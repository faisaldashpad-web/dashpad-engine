const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. MongoDB Connection
mongoose.connect("mongodb+srv://admin:Dashpad123@cluster0.d0vqco1.mongodb.net/dashpad_db?retryWrites=true&w=majority")
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log("MongoDB Connection Error: ", err));

// 2. User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    usageCount: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false }
});
const User = mongoose.model('User', userSchema);

// 3. API: ആക്സസ് ചെക്ക് ചെയ്യാൻ
app.post('/check-access', async (req, res) => {
    const { email } = req.body;
    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ email, usageCount: 0 });
            await user.save();
        }

        if (user.isPremium) return res.json({ status: "success", type: "premium" });

        // 10-ൽ കൂടുതൽ ആണെങ്കിൽ ലോക്ക് ആകുന്നു
        if (user.usageCount >= 10) {
            return res.json({ 
                status: "locked", 
                message: "പരിധി കഴിഞ്ഞു. തുടരാൻ പരസ്യം കാണുക." 
            });
        }

        // ഉപയോഗിക്കുമ്പോൾ കൗണ്ട് കൂട്ടുന്നു
        user.usageCount += 1;
        await user.save();
        
        res.json({ status: "success", remaining: 10 - user.usageCount });
    } catch (err) {
        res.status(500).json({ status: "error" });
    }
});

// 4. API: പരസ്യം കാണുമ്പോഴെല്ലാം ക്രെഡിറ്റ് നൽകാൻ
app.post('/add-credits', async (req, res) => {
    const { email, credits } = req.body; 
    try {
        let user = await User.findOne({ email });
        if (user) {
            // usageCount കുറയ്ക്കുന്നു. 
            // ഉദാഹരണത്തിന് 10-ൽ നിൽക്കുമ്പോൾ 5 ക്രെഡിറ്റ് കിട്ടിയാൽ കൗണ്ട് 5 ആകും. 
            // അപ്പോൾ യൂസർക്ക് 5 തവണ കൂടി ഉപയോഗിക്കാം.
            user.usageCount = Math.max(0, user.usageCount - credits);
            await user.save();
            res.json({ 
                status: "success", 
                message: `${credits} തവണ കൂടി ഉപയോഗിക്കാം!`,
                currentUsage: user.usageCount
            });
        }
    } catch (err) {
        res.status(500).json({ status: "error" });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

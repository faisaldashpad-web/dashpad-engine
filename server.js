const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. MongoDB Connection
// നിങ്ങളുടേതായ മംഗോഡിബി ലിങ്ക് ഇവിടെയുണ്ടെന്ന് ഉറപ്പുവരുത്തുക
mongoose.connect("mongodb+srv://admin:Dashpad123@cluster0.d0vqco1.mongodb.net/dashpad_db?retryWrites=true&w=majority")
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log("MongoDB Connection Error: ", err));

// 2. User Schema (യൂസർ വിവരങ്ങളും ഉപയോഗവും സൂക്ഷിക്കാൻ)
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    usageCount: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false }
});
const User = mongoose.model('User', userSchema);

// 3. API: ആക്സസ് ഉണ്ടോ എന്ന് പരിശോധിക്കാൻ (Login/Check Access)
app.post('/check-access', async (req, res) => {
    const { email } = req.body;
    try {
        let user = await User.findOne({ email });

        // പുതിയ യൂസർ ആണെങ്കിൽ സേവ് ചെയ്യുന്നു
        if (!user) {
            user = new User({ email, usageCount: 0 });
            await user.save();
        }

        // പ്രീമിയം മെമ്പർ ആണെങ്കിൽ ഫുൾ ആക്സസ്
        if (user.isPremium) {
            return res.json({ status: "success", type: "premium" });
        }

        // 10 തവണ കഴിഞ്ഞോ എന്ന് നോക്കുന്നു
        if (user.usageCount >= 10) {
            return res.json({ 
                status: "locked", 
                message: "നിങ്ങളുടെ 10 ഫ്രീ ചാൻസുകൾ കഴിഞ്ഞു. തുടരാൻ പരസ്യം കാണുക അല്ലെങ്കിൽ പ്രീമിയം എടുക്കുക." 
            });
        }

        // ഓരോ തവണയും ഉപയോഗം കൂട്ടുന്നു
        user.usageCount += 1;
        await user.save();
        
        res.json({ 
            status: "success", 
            type: "free", 
            remaining: 10 - user.usageCount 
        });

    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// 4. API: പരസ്യം കണ്ടു കഴിഞ്ഞാൽ ഒരു അവസരം കൂടി നൽകാൻ
app.post('/reward-user', async (req, res) => {
    const { email } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            // പരസ്യം കണ്ടതുകൊണ്ട് ഉപയോഗം ഒന്നു കുറയ്ക്കുന്നു (അപ്പോൾ ഒരു ചാൻസ് കൂടി കിട്ടും)
            user.usageCount = Math.max(0, user.usageCount - 1);
            await user.save();
            res.json({ status: "success", message: "നിങ്ങൾക്ക് ഒരു ചാൻസ് കൂടി ലഭിച്ചു!" });
        } else {
            res.status(404).json({ status: "error", message: "യൂസറെ കണ്ടെത്താനായില്ല" });
        }
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// 5. Server Start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

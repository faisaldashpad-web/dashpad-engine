const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb+srv://admin:Dashpad123@cluster0.d0vqco1.mongodb.net/dashpad_db?retryWrites=true&w=majority");

// User Schema with usage counter
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    usageCount: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false }
});
const User = mongoose.model('User', userSchema);

// API to check usage and login
app.post('/check-access', async (req, res) => {
    const { email } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
        user = new User({ email, usageCount: 0 });
        await user.save();
    }

    if (user.isPremium) return res.json({ status: "success", access: "unlimited" });

    // 10 തവണയിൽ കൂടുതൽ ഉപയോഗിച്ചാൽ പേയ്മെന്റ് സ്ക്രീൻ കാണിക്കണം
    if (user.usageCount >= 10) {
        return res.json({ status: "locked", message: "Free limit reached! Pay to unlock." });
    }

    // ഓരോ ഉപയോഗത്തിനും കൗണ്ട് കൂട്ടുന്നു
    user.usageCount += 1;
    await user.save();
    res.json({ status: "success", remaining: 10 - user.usageCount });
});

app.listen(8080, () => console.log("Server running on port 8080"));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// --- 1. MongoDB ലോഗിൻ സെറ്റപ്പ് ---
const mongoURI = "mongodb+srv://admin:Dashpad123@cluster0.d0vqco1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB Connected! ✅"))
    .catch(err => console.log("DB Error: ", err));

// ലോഗിൻ പരിശോധിക്കാനുള്ള API
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if(username === "admin" && password === "Dashpad123") {
        res.json({ success: true, message: "Login Successful" });
    } else {
        res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
});

// --- 2. എഡിറ്റർ സെറ്റപ്പ് ---
// നിങ്ങളുടെ പഴയ എഡിറ്റർ ഫയലുകൾ ഉണ്ടെങ്കിൽ അത് ഇവിടെ ലോഡ് ചെയ്യും
app.get('/', (req, res) => {
    res.send("DashPad Cloud Server is Running! 🚀");
});

// Koyeb ആവശ്യപ്പെടുന്ന പോർട്ട് 8080 ആണ്
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

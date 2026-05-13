const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGJISTRIMI (Register)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        let userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Ky email ekziston!" });

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "Llogaria u krijua!" });
    } catch (err) {
        console.log("GABIMI TEK REGJISTRIMI:", err); // Kjo do të na tregojë gabimin në terminal
        res.status(500).json({ message: "Gabim në server", error: err.message });
    }
});

// 2. KYÇJA (Login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Gjej përdoruesin
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Kredenciale të gabuara!" });

        // Krahaso fjalëkalimin
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Kredenciale të gabuara!" });

        // Krijo Tokenin (Bileta e hyrjes)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: "Gabim në server", error: err.message });
    }
});

module.exports = router;
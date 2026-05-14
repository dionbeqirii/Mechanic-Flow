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

// 3. RIVENDOS FJALËKALIMIN
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: 'Nëse emaili ekziston, fjalëkalimi i ri u dërgua.' });
        }
        const tempPass = Math.random().toString(36).slice(-8);
        user.password = tempPass;
        await user.save();
        res.json({ message: 'Fjalëkalimi u rivendos me sukses!', tempPassword: tempPass });
    } catch (err) {
        res.status(500).json({ message: 'Gabim në server' });
    }
});

// 4. LISTA E STAFIT
router.get('/staff', async (req, res) => {
    try {
        const staff = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: 'Gabim gjatë marrjes së stafit' });
    }
});

// 4. NDRYSHO PROFILIN
router.put('/profile', async (req, res) => {
    try {
        const { id, name } = req.body;
        const user = await User.findByIdAndUpdate(id, { name }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'Përdoruesi nuk u gjet' });
        res.json({ id: user._id, name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ message: 'Gabim gjatë përditësimit', error: err.message });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// 1. SHTO MAKINË TË RE
router.post('/add', async (req, res) => {
    try {
        console.log("Dati që po vijnë nga Frontend:", req.body);
        const { ownerName, carModel, licensePlate } = req.body;

        // Kontrollo nëse targa ekziston një herë
        const targaEkziston = await Car.findOne({ licensePlate });
        if (targaEkziston) {
            return res.status(400).json({ message: "Kjo makinë është regjistruar një herë!" });
        }

        const newCar = new Car({ ownerName, carModel, licensePlate });
        const savedCar = await newCar.save();
        
        console.log("✅ Makina u ruajt me sukses!");
        res.status(201).json(savedCar);
    } catch (err) {
        console.error("❌ Gabim te /add:", err.message);
        res.status(500).json({ message: "Gabim në server", error: err.message });
    }
});

// 2. MERR TË GJITHA MAKINAT
router.get('/', async (req, res) => {
    try {
        const cars = await Car.find().sort({ createdAt: -1 });
        res.json(cars);
    } catch (err) {
        console.error("❌ Gabim te GET /:", err.message);
        res.status(500).json({ message: "Gabim gjatë marrjes së të dhënave" });
    }
});

module.exports = router;
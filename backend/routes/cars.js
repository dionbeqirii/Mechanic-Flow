const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// 1. SHTO MAKINË TË RE
router.post('/add', async (req, res) => {
    try {
        const { ownerName, carModel, carYear, licensePlate } = req.body;

        const targaEkziston = await Car.findOne({ licensePlate });
        if (targaEkziston) {
            return res.status(400).json({ message: "Kjo makinë është regjistruar një herë!" });
        }

        const newCar = new Car({ ownerName, carModel, carYear, licensePlate });
        const savedCar = await newCar.save();
        res.status(201).json(savedCar);
    } catch (err) {
        res.status(500).json({ message: "Gabim në server", error: err.message });
    }
});

// 2. MERR TË GJITHA MAKINAT
router.get('/', async (req, res) => {
    try {
        const cars = await Car.find().sort({ createdAt: -1 });
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: "Gabim gjatë marrjes së të dhënave" });
    }
});

// 3. NDRYSHO STATUSIN E MAKINËS
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const statuset = ['Ne Pritje', 'Ne Servis', 'Perfunduar'];
        if (!statuset.includes(status)) {
            return res.status(400).json({ message: "Status i pavlefshëm" });
        }

        const car = await Car.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!car) return res.status(404).json({ message: "Makina nuk u gjet" });

        res.json(car);
    } catch (err) {
        res.status(500).json({ message: "Gabim gjatë ndryshimit të statusit", error: err.message });
    }
});

// 4. FSHI MAKINËN
router.delete('/:id', async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) return res.status(404).json({ message: "Makina nuk u gjet" });

        res.json({ message: "Makina u fshi me sukses" });
    } catch (err) {
        res.status(500).json({ message: "Gabim gjatë fshirjes", error: err.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

const STATUSET = ['Hapur', 'Ne Proces', 'Mbyllur'];

router.post('/add', async (req, res) => {
    try {
        const { serviceName, carPlate, mechanic, price, description } = req.body;
        const service = new Service({ serviceName, carPlate, mechanic, price, description });
        const saved = await service.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: 'Gabim në server', error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const query = {};
        if (req.query.plate) query.carPlate = req.query.plate;
        const services = await Service.find(query).sort({ createdAt: -1 });
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: 'Gabim gjatë marrjes së shërbimeve' });
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!STATUSET.includes(status)) {
            return res.status(400).json({ message: 'Status i pavlefshëm' });
        }
        const service = await Service.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!service) return res.status(404).json({ message: 'Shërbimi nuk u gjet' });
        res.json(service);
    } catch (err) {
        res.status(500).json({ message: 'Gabim gjatë ndryshimit', error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) return res.status(404).json({ message: 'Shërbimi nuk u gjet' });
        res.json({ message: 'Shërbimi u fshi me sukses' });
    } catch (err) {
        res.status(500).json({ message: 'Gabim gjatë fshirjes', error: err.message });
    }
});

module.exports = router;

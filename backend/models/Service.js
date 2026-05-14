const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceName: { type: String, required: true },
    carPlate:    { type: String, required: true },
    mechanic:    { type: String, required: true },
    price:       { type: Number, required: true },
    description: { type: String, default: '' },
    status:      { type: String, default: 'Hapur' } // Hapur | Ne Proces | Mbyllur
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);

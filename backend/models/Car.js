const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    ownerName: { type: String, required: true },
    carModel: { type: String, required: true },
    carYear: { type: Number, required: true },
    licensePlate: { type: String, required: true, unique: true },
    status: {
        type: String,
        default: 'Ne Pritje'
    }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

// Kjo pjesë bën kodimin (hashing) e fjalëkalimit para se të ruhet
userSchema.pre('save', async function() {
    // Nëse fjalëkalimi nuk është ndryshuar, mos bëj asgjë
    if (!this.isModified('password')) return;
    
    // Krijo kripën (salt) dhe kodo fjalëkalimin
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Në funksionet async, Mongoose e kupton vetë kur përfundon puna
    // prandaj nuk kemi nevojë për next()
});

module.exports = mongoose.model('User', userSchema);
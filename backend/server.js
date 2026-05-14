const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const serviceRoutes = require('./routes/services');

const app = express();

// MIDDLEWARE (Renditja është KRITIKE)
app.use(cors());
app.use(express.json()); 

// LIDHJA ME DATABAZËN
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB e lidhur: ' + mongoose.connection.name))
  .catch((err) => console.error('❌ Gabim në lidhje:', err));

// RRUGËT
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/services', serviceRoutes);

// SERBERI
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend-i po punon në: http://localhost:${PORT}`);
});
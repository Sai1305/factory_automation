const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const runSimulation = require('./simulation/factorySimulator'); // import simulation engine

// --- CONFIG ---
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// --- DB CONNECTION ---
const dbURI = process.env.MONGO_URI || 'mongodb+srv://vullamsaipavan123_db_user:OtmCxreCOwgm0OMJ@cluster0.fegjkpc.mongodb.net/factory_automation';
mongoose.connect(dbURI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ MongoDB Error:', err));

// --- ROUTES ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/machines', require('./routes/machineRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));
// app.use('/api/metrics', require('./controllers/metricsController').getMetrics); // Uncomment if you have this file

// --- START SIMULATION ENGINE ---
// This keeps the server file clean!
console.log("Initializing Simulation Engine...");
setInterval(() => {
    runSimulation();
}, 2000); // Runs every 2 seconds

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
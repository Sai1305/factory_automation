const mongoose = require('mongoose');

const machineSchema =  mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Idle', 'Error'], default: 'Idle' },
    
    mode: { type: String, enum: ['Auto', 'Manual'], default: 'Auto' }, 

    metrics: {
        temperature: { type: Number, default: 0 },
        efficiency: { type: Number, default: 100 },
        load: { type: Number, default: 0 }
    },
    task: { type: String, default: '' },
    lastMaintenance: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Machine', machineSchema);
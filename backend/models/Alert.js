const mongoose = require('mongoose');

const alertSchema = mongoose.Schema({
    machineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine' },
    machineName: { type: String, required: true }, //Critical Field
    message: { type: String, required: true },
    severity: { type: String, enum: ['Critical', 'Warning', 'Info'], default: 'Info' },
    status: { type: String, enum: ['New', 'Resolved'], default: 'New' },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);
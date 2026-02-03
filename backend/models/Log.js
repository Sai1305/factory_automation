const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
    user: { type: String, default: 'System' },
    action: { type: String, required: true },
    details: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
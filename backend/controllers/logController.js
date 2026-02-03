const Log = require('../models/Log');

//Get all activity logs sorted by newest
//GET /api/logs
const getLogs = async (req, res) => {
    try {
        const logs = await Log.find().sort({ timestamp: -1 }).limit(50);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching logs' });
    }
};

module.exports = { getLogs };
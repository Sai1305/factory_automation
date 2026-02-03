const Alert = require('../models/Alert');

//Get all system alerts sorted by newest
//GET /api/alerts
const getAlerts = async (req, res) => {
    try {
        // Fetch last 50 alerts
        const alerts = await Alert.find().sort({ timestamp: -1 }).limit(50);
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching alerts' });
    }
};

module.exports = { getAlerts };
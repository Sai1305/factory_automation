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

// Acknowledge/Resolve an Alert
// PUT /api/alerts/:id/ack
const acknowledgeAlert = async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);

        if (alert) {
            alert.status = 'Resolved';
            const updatedAlert = await alert.save();
            res.json(updatedAlert);
        } else {
            res.status(404).json({ message: 'Alert not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getAlerts, acknowledgeAlert };
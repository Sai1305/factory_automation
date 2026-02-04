const Alert = require('../models/Alert');

// Get all alerts
// GET /api/alerts
const getAlerts = async (req, res) => {
    try {
        // Sort by newest first (descending order)
        const alerts = await Alert.find().sort({ createdAt: -1 });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an alert
// DELETE /api/alerts/:id
const deleteAlert = async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);

        if (alert) {
            await alert.deleteOne();
            res.json({ message: 'Alert removed' });
        } else {
            res.status(404).json({ message: 'Alert not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Acknowledge (Resolve) an Alert
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

module.exports = {
    getAlerts,
    deleteAlert,
    acknowledgeAlert
};
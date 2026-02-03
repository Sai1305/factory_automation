const Machine = require('../models/Machine');
const Alert = require('../models/Alert');

//Get Factory Production Metrics
//GET /api/metrics
const getMetrics = async (req, res) => {
    try {
        const machines = await Machine.find();
        const alertCount = await Alert.countDocuments();

        // Calculate aggregates
        const totalMachines = machines.length;
        const activeMachines = machines.filter(m => m.status === 'Active').length;
        const errorMachines = machines.filter(m => m.status === 'Error').length;
        
        // Calculate average efficiency
        const totalEff = machines.reduce((acc, m) => acc + (m.metrics.efficiency || 0), 0);
        const avgEfficiency = totalMachines > 0 ? (totalEff / totalMachines).toFixed(1) : 0;

        res.json({
            totalMachines,
            activeMachines,
            errorMachines,
            avgEfficiency,
            totalAlerts: alertCount,
            systemStatus: errorMachines > 0 ? 'Warning' : 'Nominal'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating metrics' });
    }
};

module.exports = { getMetrics };
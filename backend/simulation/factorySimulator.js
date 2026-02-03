const Machine = require('../models/Machine');
const Alert = require('../models/Alert');
const Log = require('../models/Log');

// Helper to generate random fluctuation
const fluctuate = (base, volatility) => {
    return base + (Math.random() * volatility - (volatility / 2));
};

const runSimulation = async () => {
    try {
        const machines = await Machine.find();
        
        //Heartbeat Log (Only once per cycle, not per machine)
        if (machines.length > 0) {
            // Optional: Log routine check to keep DB alive
            // console.log(`Simulation Heartbeat: Checking ${machines.length} machines...`);
        }

        for (const machine of machines) {
            // Default values if missing
            let { temperature = 0, efficiency = 100, load = 0, vibration = 0 } = machine.metrics || {};
            const currentMode = machine.mode || 'Auto';

            // --- 1. PHYSICS ENGINE ---
            if (machine.status === 'Active') {
                // Heats up, Efficiency drops, Vibration fluctuates
                temperature = Math.min(120, fluctuate(temperature, 4) + 0.5); // Drift Up
                efficiency = Math.max(30, fluctuate(efficiency, 2) - 0.1);    // Drift Down
                load = Math.max(50, Math.min(100, fluctuate(load, 10)));      // Load 50-100
                vibration = Math.max(0, fluctuate(vibration, 1) + (load > 90 ? 0.2 : 0)); // High load = High vib

                // Random Fault Injection (Rare: 1% chance)
                if (Math.random() > 0.99) temperature += 15; 

            } else {
                // Cools down, Recovers
                temperature = Math.max(25, temperature - 3); 
                efficiency = Math.min(100, efficiency + 1);
                load = 0;
                vibration = 0;
            }

            // --- 2. ALERT GENERATION ---
            let alertMsg = null;
            let severity = 'Info';

            // Check thresholds
            if (temperature > 90) {
                alertMsg = `🔥 Overheat: ${temperature.toFixed(1)}°C`;
                severity = 'Critical';
            } else if (vibration > 10) { // New Vibration Logic
                alertMsg = `⚠️ High Vibration: ${vibration.toFixed(1)} Hz`;
                severity = 'Warning';
            }

            // Save Alert if New
            if (alertMsg) {
                // Check for existing active alert to avoid spam
                const existingAlert = await Alert.findOne({ 
                    machineId: machine._id, 
                    status: 'New'  // We use 'status' enum based on your previous schema
                });

                if (!existingAlert) {
                    console.log(`🚨 ALERT: ${alertMsg}`);
                    
                    await Alert.create({
                        machineId: machine._id,
                        machineName: machine.name,
                        message: alertMsg,
                        severity,
                        status: 'New',
                        timestamp: new Date()
                    });

                    // If Critical, Emergency Stop
                    if (severity === 'Critical' && machine.status !== 'Error') {
                        machine.status = 'Error';
                        
                        await Log.create({
                            user: 'System Safety',
                            action: 'Emergency Stop',
                            details: `${machine.name} stopped due to ${alertMsg}`,
                            timestamp: new Date()
                        });
                    }
                }
            }

            // --- 3. AUTO-RESTART (Self-Healing) ---
            if (currentMode === 'Auto' && machine.status === 'Error' && temperature < 45) {
                console.log(`♻️ Auto-Restarting ${machine.name}`);
                machine.status = 'Active';
                
                await Log.create({
                    user: 'System Bot',
                    action: 'Auto-Restart',
                    details: `${machine.name} cooled down and restarted.`,
                    timestamp: new Date()
                });

                // Resolve old alerts
                await Alert.updateMany(
                    { machineId: machine._id, status: 'New' },
                    { status: 'Resolved' }
                );
            }

            // --- 4. SAVE STATE ---
            machine.metrics = { 
                temperature: parseFloat(temperature.toFixed(1)), 
                efficiency: parseFloat(efficiency.toFixed(1)), 
                load: Math.floor(load),
                vibration: parseFloat(vibration.toFixed(1))
            };
            
            await machine.save();
        }

    } catch (err) {
        console.error("Simulation Loop Error:", err.message);
    }
};

module.exports = runSimulation;
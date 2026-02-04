const Machine = require('../models/Machine');
const Log = require('../models/Log');

//Get all machines
//GET /api/machines
const getMachines = async (req, res) => {
    try {
        const machines = await Machine.find();
        res.json(machines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Get single machine
//GET /api/machines/:id
const getMachineById = async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);
        if (machine) {
            res.json(machine);
        } else {
            res.status(404).json({ message: 'Machine not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Add a new machine
//POST /api/machines
const addMachine = async (req, res) => {
    const { name, type, status, mode } = req.body;

    try {
        const machine = new Machine({
            name,
            type,
            status: status || 'Idle',
            mode: mode || 'Auto',
            metrics: { temperature: 0, efficiency: 100, load: 0 },
            currentJob: 'None'
        });

        const createdMachine = await machine.save();
        res.status(201).json(createdMachine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Update machine details (Status, Job, Mode)
//PUT /api/machines/:id
const updateMachine = async (req, res) => {
    try {
        // Destructure fields sent from Frontend
        const { status, currentJob, mode } = req.body;

        const machine = await Machine.findById(req.params.id);

        if (machine) {
            // 1. Update fields if they are provided
            if (status) machine.status = status;
            if (currentJob !== undefined) machine.currentJob = currentJob;
            if (mode) machine.mode = mode;

            const updatedMachine = await machine.save();

            // 2. Create a Log if critical settings changed
            if (mode || status) {
                await Log.create({
                    user: req.user ? req.user.username : 'Operator',
                    action: mode ? `Mode Change` : `Status Update`,
                    details: mode 
                        ? `Switched ${machine.name} to ${mode} Mode` 
                        : `Changed ${machine.name} status to ${status}`,
                    timestamp: new Date()
                });
            }

            res.json(updatedMachine);
        } else {
            res.status(404).json({ message: 'Machine not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Delete machine
//DELETE /api/machines/:id
const deleteMachine = async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);
        if (machine) {
            await machine.deleteOne();
            res.json({ message: 'Machine removed' });
        } else {
            res.status(404).json({ message: 'Machine not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Explicit Control Action (Start/Stop/Reset)
//POST /api/machines/:id/control
const controlMachine = async (req, res) => {
    const { action } = req.body;
    
    try {
        const machine = await Machine.findById(req.params.id);
        if (!machine) return res.status(404).json({ message: 'Machine not found' });

        let logMessage = '';

        if (action === 'START') {
            machine.status = 'Active';
            logMessage = `Started ${machine.name}`;
        } else if (action === 'STOP') {
            machine.status = 'Idle';
            logMessage = `Stopped ${machine.name}`;
        } else if (action === 'RESET') {
            machine.status = 'Idle';
            machine.metrics = { temperature: 0, efficiency: 100, load: 0 };
            logMessage = `Reset ${machine.name} metrics`;
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        await machine.save();

        // Create Log
        await Log.create({
            user: req.user ? req.user.username : 'Operator',
            action: 'Manual Control',
            details: logMessage,
            timestamp: new Date()
        });

        res.json({ message: 'Command executed', machine });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Assign a Job to a machine
//PUT /api/machines/:id/job
const assignJob = async (req, res) => {
    const { jobName } = req.body;

    try {
        const machine = await Machine.findById(req.params.id);

        if (machine) {
            machine.currentJob = jobName;
            
            // Optional: Automatically start the machine when a job is assigned
            if (jobName && machine.status === 'Idle') {
                machine.status = 'Active';
            }

            const updatedMachine = await machine.save();

            // Log the action
            await Log.create({
                user: req.user ? req.user.username : 'Operator',
                action: 'Job Assignment',
                details: `Assigned job: "${jobName}" to ${machine.name}`,
                timestamp: new Date()
            });

            res.json(updatedMachine);
        } else {
            res.status(404).json({ message: 'Machine not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getMachines,
    getMachineById,
    addMachine,
    updateMachine,
    deleteMachine,
    controlMachine,
    assignJob
};
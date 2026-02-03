const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Machine = require('./models/Machine'); // Adjust path if needed

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://vullamsaipavan123_db_user:OtmCxreCOwgm0OMJ@cluster0.fegjkpc.mongodb.net/factory_automation';

const machines = [
    // 1. ROBOTS (Arm Robots, Pick & Place)
    {
        name: "Fanuc Robot Arm R-2000",
        type: "Robot",
        status: "Active",
        metrics: { temperature: 65, vibration: 2, load: 75, efficiency: 98 },
        task: "Welding Chassis",
        cycleTime: 12.5,
        lastMaintenance: new Date('2025-11-01')
    },
    {
        name: "Pick & Place Unit #4",
        type: "Robot",
        status: "Idle",
        metrics: { temperature: 40, vibration: 0, load: 0, efficiency: 100 },
        task: "Waiting for Parts",
        cycleTime: 4.2,
        lastMaintenance: new Date('2025-12-10')
    },

    // 2. CONVEYOR SYSTEMS
    {
        name: "Main Conveyor Belt A",
        type: "Conveyor",
        status: "Active",
        metrics: { temperature: 55, vibration: 8, load: 85, efficiency: 92 },
        task: "Transporting Units",
        cycleTime: 0, // Continuous
        lastMaintenance: new Date('2025-10-20')
    },

    // 3. INDUSTRIAL MOTORS
    {
        name: "Hydraulic Pump Motor",
        type: "Motor",
        status: "Active",
        metrics: { temperature: 78, vibration: 12, load: 90, efficiency: 88 },
        task: "Pressurizing System",
        cycleTime: 0,
        lastMaintenance: new Date('2025-09-15')
    },

    // 4. SENSOR DEVICES
    {
        name: "Thermal Sensor Array",
        type: "Sensor",
        status: "Active",
        metrics: { temperature: 24, vibration: 0, load: 0, efficiency: 100 },
        task: "Monitoring Zone B",
        cycleTime: 1.0,
        lastMaintenance: new Date('2026-01-01')
    },
    {
        name: "Vibration Monitor X1",
        type: "Sensor",
        status: "Active",
        metrics: { temperature: 30, vibration: 0, load: 0, efficiency: 100 },
        task: "Safety Watchdog",
        cycleTime: 0.5,
        lastMaintenance: new Date('2025-12-25')
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to DB');

        // Clear existing data
        await Machine.deleteMany({});
        console.log('Cleared old machines');

        // Insert new machines
        await Machine.insertMany(machines);
        console.log('Industrial Machines Created Successfully');

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedDB();
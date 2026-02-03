const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

// HARDCODE LINK IF .ENV FAILS
const DB = process.env.MONGO_URI

const check = async () => {
    try {
        await mongoose.connect(DB);
        console.log("✅ Connected to DB");

        const users = await User.find({});
        console.log(`Found ${users.length} users in database:`);
        
        for (let user of users) {
            console.log(`   - User: ${user.username} | Role: ${user.role}`);
            // Test Password
            const isMatch = await user.matchPassword('password123');
            console.log(`     Password 'password123' works? ${isMatch ? "YES" : "NO"}`);
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

check();

const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Trying to connect to the local database
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://vullamsaipavan123_db_user:OtmCxreCOwgm0OMJ@cluster0.fegjkpc.mongodb.net/');//mongodb://localhost:27017/flipkart_factory'
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If it fails, log the error and stop the server
        console.error(`Error: ${error.message}`);
        process.exit(1); 
    }
};

module.exports = connectDB;
const mongoose = require('mongoose');

/**
 * Connects to MongoDB using Mongoose.
 * Validates the connection string and handles connection errors.
 */
const connectDB = async () => {
    const mongoURI = process.env.MONGODB_URI;

    // Validate URI
    if (!mongoURI) {
        console.error('❌ MONGODB_URI is not defined in .env');
        throw new Error('Missing MONGODB_URI');
    }

    try {
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB connection failure:', err.message);
        throw err; // Re-throw to be handled by server startup logic
    }
};

module.exports = connectDB;

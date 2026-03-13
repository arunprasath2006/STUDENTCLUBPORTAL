const connectDB = require('../config/db');

/**
 * Service to handle all database operations for Users
 */
const userService = {
    /**
     * Insert a new user into the database
     */
    createUser: async (userData) => {
        const db = await connectDB();
        const usersCollection = db.collection('users');
        const result = await usersCollection.insertOne(userData);
        return { ...userData, _id: result.insertedId };
    },

    /**
     * Fetch all users from the database
     */
    getAllUsers: async () => {
        const db = await connectDB();
        const usersCollection = db.collection('users');
        return await usersCollection.find({}).toArray();
    }
};

module.exports = userService;

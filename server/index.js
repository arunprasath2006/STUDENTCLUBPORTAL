require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));

// Start Server after DB connection
const startServer = async () => {
    try {
        // Test connection before starting server
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to database. Server not started.', error.message);
        process.exit(1);
    }
};

startServer();

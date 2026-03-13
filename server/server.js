// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clubs', require('./routes/clubs'));
app.use('/api/events', require('./routes/events'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/announcements', require('./routes/announcements'));

app.get('/', (req, res) => {
    res.send('API is running (Dummy Data Mode Enabled)...');
});

/**
 * Async startup sequence. 
 * Modified to allow server to start even if DB fails, supporting dummy mode.
 */
const startServer = async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error('⚠️ Database connection failed. Entering Dummy Data mode.');
    }

    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT} (Dummy Data Enabled)`);
    });
};

startServer();

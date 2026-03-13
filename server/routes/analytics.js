const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const User = require('../models/User');
const Event = require('../models/Event');
const JoinRequest = require('../models/JoinRequest');
const EventRegistration = require('../models/EventRegistration');

// @route   GET api/analytics/summary
// @desc    Get counts and recent activity for dashboard
router.get('/summary', async (req, res) => {
    try {
        const activeClubs = await Club.countDocuments();
        const totalMembers = await User.countDocuments({ role: 'student' });
        const eventsThisWeek = await Event.countDocuments({
            date: { 
                $gte: new Date(), 
                $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
            }
        });
        
        // Mock engagement rate for now
        const engagementRate = 84; 

        // Recent Activities (Mix of Join Requests and Registrations)
        const recentJoins = await JoinRequest.find().sort({ createdAt: -1 }).limit(5);
        const recentRegs = await EventRegistration.find().sort({ createdAt: -1 }).limit(5);

        const activities = [
            ...recentJoins.map(j => ({ type: 'join', title: 'New join request', subtitle: `${j.name} for ${j.clubName}`, time: j.createdAt })),
            ...recentRegs.map(r => ({ type: 'event', title: 'New event registration', subtitle: `${r.name} for ${r.eventTitle}`, time: r.createdAt }))
        ].sort((a, b) => b.time - a.time).slice(0, 5);

        // Upcoming Events
        const upcomingEvents = await Event.find({ date: { $gte: new Date() } }).sort({ date: 1 }).limit(3);

        res.json({
            metrics: {
                activeClubs,
                totalMembers,
                eventsThisWeek,
                engagementRate
            },
            activities,
            upcomingEvents
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

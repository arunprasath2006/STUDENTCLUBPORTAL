const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');

// @route   GET api/events
// @desc    Get all events (REAL DATA)
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().populate('club', 'name').sort({ date: 1 });
        res.json(events);
    } catch (err) {
        console.error('❌ Error fetching events:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/events
// @desc    Create a new event
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, date, clubId, location } = req.body;
        
        const newEvent = new Event({
            title,
            description,
            date,
            club: clubId,
            location: location || 'TBD',
            createdBy: req.user.id
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        console.error('❌ Error creating event:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/events/register
// @desc    Register for an event
router.post('/register', async (req, res) => {
    try {
        const { eventId, eventTitle, name, registerNumber, department, year, phno, email } = req.body;
        
        const newRegistration = new EventRegistration({
            eventId,
            eventTitle,
            name,
            registerNumber,
            department,
            year,
            phno,
            email
        });

        await newRegistration.save();
        console.log(`✅ Event registration saved for ${eventTitle} by ${name}`);
        res.status(201).json({ msg: 'Registration submitted successfully', data: newRegistration });
    } catch (err) {
        console.error('❌ Error saving event registration:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;

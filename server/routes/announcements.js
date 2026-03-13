const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// @route   GET api/announcements
// @desc    Get all announcements
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   POST api/announcements
// @desc    Create an announcement
router.post('/', async (req, res) => {
    try {
        const { title, content, targetAudience, createdBy } = req.body;
        const newAnnouncement = new Announcement({
            title,
            content,
            targetAudience,
            createdBy
        });
        await newAnnouncement.save();
        res.json(newAnnouncement);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;

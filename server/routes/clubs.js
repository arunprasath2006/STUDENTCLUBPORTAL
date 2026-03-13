const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Club = require('../models/Club');
const User = require('../models/User');
const JoinRequest = require('../models/JoinRequest');

// @route   GET api/clubs
// @desc    Get all clubs (REAL DATA)
router.get('/', async (req, res) => {
    try {
        const clubs = await Club.find().sort({ name: 1 });
        res.json(clubs);
    } catch (err) {
        console.error('❌ Error fetching clubs:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/clubs
// @desc    Create a new club
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, category } = req.body;
        
        const newClub = new Club({
            name,
            description,
            category: category || 'General',
            createdBy: req.user.id
        });

        await newClub.save();
        res.status(201).json(newClub);
    } catch (err) {
        console.error('❌ Error creating club:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/clubs/join-request
// @desc    Submit a join request
router.post('/join-request', async (req, res) => {
    try {
        const { clubId, clubName, name, registerNumber, department, year, phno, email } = req.body;
        
        const newRequest = new JoinRequest({
            clubId,
            clubName,
            name,
            registerNumber,
            department,
            year,
            phno,
            email
        });

        await newRequest.save();
        console.log(`✅ Join request saved for ${clubName} by ${name}`);
        res.status(201).json({ msg: 'Join request submitted successfully', data: newRequest });
    } catch (err) {
        console.error('❌ Error saving join request:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// @route   GET api/clubs/join-request/all
// @desc    Get all join requests
router.get('/join-request/all', async (req, res) => {
    try {
        const requests = await JoinRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET api/clubs/join-request/user/:email
// @desc    Get join requests by user email
router.get('/join-request/user/:email', async (req, res) => {
    try {
        const email = req.params.email.toLowerCase();
        const requests = await JoinRequest.find({ 
            email: { $regex: new RegExp(`^${email}$`, 'i') } 
        }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   PUT api/clubs/join-request/:id
// @desc    Approve or reject a join request
router.put('/join-request/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const request = await JoinRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ msg: 'Request not found' });
        }

        request.status = status;
        await request.save();

        if (status === 'approved') {
            // Find the user by email (case-insensitive)
            const user = await User.findOne({ 
                email: { $regex: new RegExp(`^${request.email}$`, 'i') } 
            });
            
            if (user) {
                console.log(`✅ Updating membership for user: ${user.email} in club: ${request.clubName}`);
                
                // Add club to user's joinedClubs using addToSet (handles duplicates and casting)
                user.joinedClubs.addToSet(request.clubId);
                await user.save();

                // Add user to club's members
                const club = await Club.findById(request.clubId);
                if (club) {
                    club.members.addToSet(user._id);
                    await club.save();
                    console.log(`✅ User added to club members: ${club.name}`);
                } else {
                    console.error(`❌ Club not found during approval: ${request.clubId}`);
                }
            } else {
                console.error(`❌ User not found during approval: ${request.email}`);
            }
        }

        res.json(request);
    } catch (err) {
        console.error('❌ Error updating join request:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

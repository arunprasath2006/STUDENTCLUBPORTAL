const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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
        
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: 'Invalid request ID format' });
        }

        const request = await JoinRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ msg: 'Request not found' });
        }

        console.log(`Processing ${status} for request: ${req.params.id} (${request.name})`);

        request.status = status;
        await request.save();

        if (status === 'approved') {
            // Find the user by email (case-insensitive)
            const user = await User.findOne({ 
                email: { $regex: new RegExp(`^${request.email}$`, 'i') } 
            });
            
            if (user) {
                console.log(`✅ Updating membership for user: ${user.email} in club: ${request.clubName}`);
                
                // Ensure clubId is valid ObjectId
                let clubIdObj;
                try {
                    clubIdObj = new mongoose.Types.ObjectId(request.clubId);
                } catch (e) {
                    console.error(`❌ Invalid clubId in request: ${request.clubId}`);
                    return res.status(400).json({ msg: 'Invalid club ID in request' });
                }

                // Check if already a member to prevent duplicates
                const isAlreadyMember = user.joinedClubs.some(
                    jc => jc.club && jc.club.toString() === clubIdObj.toString()
                );

                if (!isAlreadyMember) {
                    // Add club to user's joinedClubs
                    user.joinedClubs.push({
                        club: clubIdObj,
                        role: 'Member',
                        joinedAt: new Date()
                    });
                    console.log(`✅ Added ${request.clubName} to user's joinedClubs`);
                } else {
                    console.log(`ℹ️ User is already a member of ${request.clubName}`);
                }

                // Sync profile data if missing
                if ((!user.registerNumber || user.registerNumber === '') && request.registerNumber) {
                    user.registerNumber = request.registerNumber;
                }
                if ((!user.department || user.department === '') && request.department) {
                    user.department = request.department;
                }

                await user.save();

                // Add user to club's members
                const club = await Club.findById(clubIdObj);
                if (club) {
                    club.members.addToSet(user._id);
                    await club.save();
                    console.log(`✅ User ID added to club members array: ${club.name}`);
                } else {
                    console.error(`❌ Club not found during approval: ${request.clubId}`);
                }
            } else {
                console.error(`❌ User not found during approval: ${request.email}`);
                // Optional: You might want to return an error here if the user must exist
                // return res.status(404).json({ msg: 'Student user not found. They must register first.' });
            }
        }

        res.json({ msg: `Request ${status} successfully`, data: request });
    } catch (err) {
        console.error('❌ Error updating join request:', err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// @route   PUT api/clubs/:id
// @desc    Update a club
router.put('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied: Admin only' });
        }

        const { name, description, category } = req.body;
        const clubFields = {};
        if (name) clubFields.name = name;
        if (description) clubFields.description = description;
        if (category) clubFields.category = category;

        let club = await Club.findById(req.params.id);
        if (!club) return res.status(404).json({ msg: 'Club not found' });

        club = await Club.findByIdAndUpdate(
            req.params.id,
            { $set: clubFields },
            { new: true }
        );

        res.json(club);
    } catch (err) {
        console.error('❌ Error updating club:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/clubs/:id
// @desc    Delete a club
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied: Admin only' });
        }

        const club = await Club.findById(req.params.id);
        if (!club) return res.status(404).json({ msg: 'Club not found' });

        await Club.findByIdAndDelete(req.params.id);
        
        // Also clean up related join requests
        await JoinRequest.deleteMany({ clubId: req.params.id });

        res.json({ msg: 'Club removed' });
    } catch (err) {
        console.error('❌ Error deleting club:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

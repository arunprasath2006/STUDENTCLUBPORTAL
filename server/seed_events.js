const mongoose = require('mongoose');
const Club = require('./models/Club');
const Event = require('./models/Event');
const User = require('./models/User');
require('dotenv').config();

const seedEvents = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/student_portal');
        console.log('✅ Connected to MongoDB');

        // Clear existing events
        await Event.deleteMany({});
        console.log('🗑️ Existing events cleared');

        const clubs = await Club.find();
        const admin = await User.findOne({ role: 'admin' });

        if (clubs.length === 0 || !admin) {
            console.error('❌ Essential data (clubs or admin) missing. Run seed_clubs.js and create_admin.js first.');
            process.exit(1);
        }

        const events = [
            {
                title: 'Hackathon 2025',
                description: 'A 24-hour coding challenge to build innovative solutions.',
                date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
                location: 'Main Auditorium',
                club: clubs.find(c => c.name === 'Coding Club')._id,
                createdBy: admin._id
            },
            {
                title: 'Dance Workshop',
                description: 'Learn contemporary dance from professional choreographers.',
                date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                location: 'Seminar Hall 1',
                club: clubs.find(c => c.name === 'Dance Club')._id,
                createdBy: admin._id
            },
            {
                title: 'Startup Pitch Day',
                description: 'Pitch your ideas to real investors and get feedback.',
                date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
                location: 'Innovation Hub',
                club: clubs.find(c => c.name === 'Entrepreneurship Cell')._id,
                createdBy: admin._id
            },
            {
                title: 'Musical Night',
                description: 'An evening of soulful performances by our music society.',
                date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
                location: 'Open Air Theatre',
                club: clubs.find(c => c.name === 'Music Society')._id,
                createdBy: admin._id
            }
        ];

        await Event.insertMany(events);
        console.log(`✅ ${events.length} events seeded successfully!`);
        process.exit(0);
    } catch (err) {
        console.error('❌ error seeding events:', err);
        process.exit(1);
    }
};

seedEvents();

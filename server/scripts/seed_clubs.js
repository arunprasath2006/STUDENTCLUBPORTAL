const mongoose = require('mongoose');
const Club = require('../models/Club');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

const seedClubs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_portal');
        console.log('✅ Connected to MongoDB for seeding clubs');

        const admin = await User.findOne({ email: 'admin@gmail.com' });
        if (!admin) {
            console.error('❌ Admin user not found. Please run seed_users.js first.');
            process.exit(1);
        }

        const clubs = [
            {
                name: 'Coding Club',
                description: 'The hub for all things programming and software development.',
                category: 'Technical',
                createdBy: admin._id,
                members: [admin._id]
            },
            {
                name: 'Dance Club',
                description: 'Express yourself through movement and rhythm.',
                category: 'Cultural',
                createdBy: admin._id,
                members: [admin._id]
            },
            {
                name: 'Music Society',
                description: 'For singers, instrumentalists, and music enthusiasts.',
                category: 'Cultural',
                createdBy: admin._id,
                members: [admin._id]
            },
            {
                name: 'Robotics Club',
                description: 'Building the robots of tomorrow, today.',
                category: 'Technical',
                createdBy: admin._id,
                members: [admin._id]
            },
            {
                name: 'Photography Club',
                description: 'Capturing moments and exploring visual storytelling.',
                category: 'Creative',
                createdBy: admin._id,
                members: [admin._id]
            },
            {
                name: 'Entrepreneurship Cell',
                description: 'Fostering innovation and startup culture on campus.',
                category: 'Professional',
                createdBy: admin._id,
                members: [admin._id]
            }
        ];

        for (const clubData of clubs) {
            const exists = await Club.findOne({ name: clubData.name });
            if (!exists) {
                const newClub = new Club(clubData);
                await newClub.save();
                console.log(`✅ Created club: ${clubData.name}`);
            } else {
                console.log(`ℹ️ Club already exists: ${clubData.name}`);
            }
        }

        console.log('✨ Club seeding completed successfully');
        process.exit();
    } catch (err) {
        console.error('❌ Seeding clubs failed:', err.message);
        process.exit(1);
    }
};

seedClubs();

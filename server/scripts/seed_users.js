const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_portal');
        console.log('✅ Connected to MongoDB for seeding');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const dummyStudents = [];
        for (let i = 1; i <= 5; i++) {
            dummyStudents.push({
                username: `student${i}`,
                email: `student${i}@example.com`,
                password: hashedPassword,
                role: 'student',
                joinedClubs: []
            });
        }

        // Clear existing student dummies if they exist (optional)
        // await User.deleteMany({ email: /student.*@example\.com/ });

        for (const studentData of dummyStudents) {
            const exists = await User.findOne({ email: studentData.email });
            if (!exists) {
                const newUser = new User(studentData);
                await newUser.save();
                console.log(`👤 Created user: ${studentData.email}`);
            } else {
                console.log(`ℹ️ User already exists: ${studentData.email}`);
            }
        }

        console.log('✨ Seeding completed successfully');
        process.exit();
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
        process.exit(1);
    }
};

seedUsers();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_portal');
        console.log('✅ Connected to MongoDB for admin creation');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const adminData = {
            username: 'System Admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            role: 'admin',
            joinedClubs: []
        };

        const exists = await User.findOne({ email: adminData.email });
        if (!exists) {
            const newUser = new User(adminData);
            await newUser.save();
            console.log(`👤 Admin created: ${adminData.email}`);
        } else {
            exists.role = 'admin'; // Ensure it's admin if it exists
            exists.password = hashedPassword;
            await exists.save();
            console.log(`ℹ️ Admin already exists, updated role and password: ${adminData.email}`);
        }

        console.log('✨ Admin setup complete');
        process.exit();
    } catch (err) {
        console.error('❌ Admin creation failed:', err.message);
        process.exit(1);
    }
};

createAdmin();

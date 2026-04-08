const mongoose = require('mongoose');
require('dotenv').config();
const Announcement = require('./models/Announcement');
const User = require('./models/User');

const seedAnnouncements = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.error('Admin user not found. Run seed.js first.');
            process.exit(1);
        }

        const dummyAnnouncements = [
            {
                title: 'Welcome to the Student Portal!',
                content: 'We are excited to launch our new student club portal. Stay tuned for more updates and events!',
                targetAudience: 'All',
                createdBy: admin._id
            },
            {
                title: 'Upcoming Tech Symposium',
                content: 'Join us for the annual Tech Symposium this weekend in the main auditorium. Amazing prizes to be won!',
                targetAudience: 'Students',
                createdBy: admin._id
            },
            {
                title: 'New Club Applications Open',
                content: 'Intertested in starting your own club? Applications are now open until the end of the month.',
                targetAudience: 'Students',
                createdBy: admin._id
            }
        ];

        await Announcement.deleteMany({});
        await Announcement.insertMany(dummyAnnouncements);
        
        console.log('Dummy announcements seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding announcements:', err);
        process.exit(1);
    }
};

seedAnnouncements();

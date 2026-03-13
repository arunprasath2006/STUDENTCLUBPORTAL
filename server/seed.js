const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Club = require('./models/Club');
const Event = require('./models/Event');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const users = [
    { username: 'admin', email: 'admin@example.com', password: 'password', role: 'admin' },
    { username: 'john_doe', email: 'john@example.com', password: 'password', role: 'student' },
];

const clubs = [
    { name: 'Tech Club', description: 'Explore technology, coding, and innovation.', category: 'Technology' },
    { name: 'Drama Society', description: 'Theatre, acting, and performing arts.', category: 'Arts' },
    { name: 'Sports Club', description: 'Athletics, fitness, and team sports.', category: 'Sports' },
    { name: 'Art Circle', description: 'Painting, drawing, and visual arts.', category: 'Arts' },
    { name: 'Music Band', description: 'Learn instruments and perform together.', category: 'Music' },
    { name: 'Debate Club', description: 'Public speaking and critical thinking.', category: 'Academic' },
];

const eventsData = [
    { title: 'Tech Meetup 2025', description: 'Discussing the latest in AI and Web Dev.', date: '2025-10-15T16:00:00', location: 'Auditorium Hall', clubName: 'Tech Club' },
    { title: 'Cultural Night', description: 'A night of music, dance, and drama.', date: '2025-10-20T18:00:00', location: 'Main Stage', clubName: 'Drama Society' },
    { title: 'Coding Workshop', description: 'Learn React and Node.js basics.', date: '2025-10-22T14:00:00', location: 'Lab 301', clubName: 'Tech Club' },
    { title: 'Art Exhibition', description: 'Showcasing student artwork.', date: '2025-10-25T10:00:00', location: 'Gallery Space', clubName: 'Art Circle' },
    { title: 'Sports Tournament', description: 'Inter-department football match.', date: '2025-10-28T09:00:00', location: 'Sports Ground', clubName: 'Sports Club' },
    { title: 'Music Concert', description: 'Live performance by the college band.', date: '2025-11-01T19:00:00', location: 'Amphitheatre', clubName: 'Music Band' },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await Club.deleteMany({});
        await Event.deleteMany({});
        await User.deleteMany({});
        console.log('Data cleared');

        // Create Users
        const createdUsers = [];
        for (const u of users) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(u.password, salt);
            const user = await new User({ ...u, password: hashedPassword }).save();
            createdUsers.push(user);
        }
        const adminUser = createdUsers.find(u => u.role === 'admin');
        console.log('Users created');

        // Create Clubs
        const createdClubs = [];
        for (const c of clubs) {
            const club = await new Club({ ...c, createdBy: adminUser._id }).save();
            createdClubs.push(club);
        }
        console.log('Clubs created');

        // Create Events
        for (const e of eventsData) {
            const club = createdClubs.find(c => c.name === e.clubName);
            if (club) {
                await new Event({
                    title: e.title,
                    description: e.description,
                    date: new Date(e.date),
                    location: e.location,
                    club: club._id,
                    createdBy: adminUser._id
                }).save();
            }
        }
        console.log('Events created');

        console.log('Database Seeded Successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();

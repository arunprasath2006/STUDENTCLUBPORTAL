const mongoose = require('mongoose');
const Club = require('../models/Club');

mongoose.connect('mongodb://127.0.0.1:27017/student_portal')
    .then(async () => {
        console.log('Connected to DB');
        const res = await Club.deleteMany({ 
            $or: [
                { name: { $exists: false } }, 
                { name: '' }, 
                { name: null },
                { description: { $exists: false } },
                { description: '' }
            ] 
        });
        console.log('Cleaned up clubs:', res.deletedCount);
        process.exit(0);
    })
    .catch(e => {
        console.error(e);
        process.exit(1);
    });

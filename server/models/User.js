const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    joinedClubs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

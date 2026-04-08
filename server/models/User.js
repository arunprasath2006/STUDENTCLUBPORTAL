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
    registerNumber: {
        type: String,
        default: ''
    },
    department: {
        type: String,
        default: ''
    },
    joinedClubs: [{
        club: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Club'
        },
        role: {
            type: String,
            default: 'Member'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

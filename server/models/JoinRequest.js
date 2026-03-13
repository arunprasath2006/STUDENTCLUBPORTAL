const mongoose = require('mongoose');

const JoinRequestSchema = new mongoose.Schema({
    clubId: {
        type: String,
        required: true
    },
    clubName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    phno: {
        type: String,
        required: true
    },
    registerNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('JoinRequest', JoinRequestSchema);

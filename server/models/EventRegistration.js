const mongoose = require('mongoose');

const EventRegistrationSchema = new mongoose.Schema({
    eventId: {
        type: String,
        required: true
    },
    eventTitle: {
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
    }
}, { timestamps: true });

module.exports = mongoose.model('EventRegistration', EventRegistrationSchema);

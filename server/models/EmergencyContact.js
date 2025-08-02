const mongoose = require('mongoose');

const EmergencyContactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    relationship: {
        type: String,
        required: true,
        enum: ['family', 'friend', 'colleague', 'other']
    },
    isPrimary: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('EmergencyContact', EmergencyContactSchema);
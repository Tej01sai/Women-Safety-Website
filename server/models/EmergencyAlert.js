const mongoose = require('mongoose');

const EmergencyAlertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        latitude: Number,
        longitude: Number,
        address: String
    },
    alertType: {
        type: String,
        enum: ['sos', 'help', 'check_in'],
        default: 'sos'
    },
    message: {
        type: String,
        default: 'Emergency! I need help. Please check my location.'
    },
    status: {
        type: String,
        enum: ['active', 'resolved', 'false_alarm'],
        default: 'active'
    },
    notifiedContacts: [{
        contactId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'EmergencyContact'
        },
        notificationSent: Boolean,
        sentAt: Date
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('EmergencyAlert', EmergencyAlertSchema);
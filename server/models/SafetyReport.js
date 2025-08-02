const mongoose = require('mongoose');

const SafetyReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    reportType: {
        type: String,
        required: true,
        enum: ['harassment', 'unsafe_area', 'poor_lighting', 'incident', 'suggestion']
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    severity: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'resolved', 'dismissed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SafetyReport', SafetyReportSchema);
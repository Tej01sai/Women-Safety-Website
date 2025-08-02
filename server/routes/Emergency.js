//Users\SAI\WOMEN SAFETY WEBSITE\server\routes\emergency.js
const express = require('express');
const User = require('../models/User');

const router = express.Router();

// SOS Alert
router.post('/sos', async (req, res) => {
    try {
        const { userId, location, message } = req.body;
        
        console.log('🚨 SOS ALERT RECEIVED 🚨');
        console.log('User ID:', userId);
        console.log('Location:', location);
        console.log('Message:', message);
        console.log('Timestamp:', new Date().toISOString());
        
        // Update user location
        if (userId) {
            await User.findByIdAndUpdate(userId, {
                lastKnownLocation: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    address: location.address,
                    updatedAt: new Date()
                }
            });
        }
        
        // Simulate notifying emergency contacts
        const contactsNotified = Math.floor(Math.random() * 3) + 2; // 2-4 contacts
        
        // In real implementation, you would:
        // 1. Send SMS to emergency contacts
        // 2. Send email notifications
        // 3. Alert local authorities if configured
        // 4. Log the emergency for tracking
        
        res.json({
            message: 'SOS alert sent successfully',
            contactsNotified: contactsNotified,
            alertId: Date.now().toString(),
            timestamp: new Date().toISOString(),
            location: location
        });
        
    } catch (error) {
        console.error('SOS Alert error:', error);
        res.status(500).json({ 
            message: 'Failed to send SOS alert', 
            error: error.message 
        });
    }
});

// Emergency Status Check
router.get('/status/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({
            userId: user._id,
            isActive: user.isActive,
            lastKnownLocation: user.lastKnownLocation,
            emergencyStatus: 'safe' // This would be dynamic in real implementation
        });
        
    } catch (error) {
        console.error('Emergency status error:', error);
        res.status(500).json({ message: 'Failed to get emergency status' });
    }
});

module.exports = router;
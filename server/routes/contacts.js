const express = require('express');
const router = express.Router();

// Emergency Contact Model (simplified)
const contacts = []; // In real app, this would be a database model

// Add Emergency Contact
router.post('/add', async (req, res) => {
    try {
        const { userId, name, phone, email, relationship, isPrimary } = req.body;
        
        const newContact = {
            id: Date.now().toString(),
            userId,
            name,
            phone,
            email: email || '',
            relationship,
            isPrimary: isPrimary || false,
            createdAt: new Date()
        };
        
        contacts.push(newContact);
        
        console.log('✓ Emergency contact added:', name, phone);
        
        res.status(201).json({
            message: 'Emergency contact added successfully',
            contact: newContact
        });
        
    } catch (error) {
        console.error('Add contact error:', error);
        res.status(500).json({ 
            message: 'Failed to add emergency contact',
            error: error.message 
        });
    }
});

// Get User's Emergency Contacts
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const userContacts = contacts.filter(contact => contact.userId === userId);
        
        res.json({
            contacts: userContacts,
            count: userContacts.length
        });
        
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ message: 'Failed to get emergency contacts' });
    }
});

// Delete Emergency Contact
router.delete('/:contactId', async (req, res) => {
    try {
        const { contactId } = req.params;
        
        const contactIndex = contacts.findIndex(contact => contact.id === contactId);
        if (contactIndex === -1) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        
        contacts.splice(contactIndex, 1);
        
        res.json({ message: 'Emergency contact deleted successfully' });
        
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({ message: 'Failed to delete emergency contact' });
    }
});

module.exports = router;
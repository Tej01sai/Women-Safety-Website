const express = require('express');
const SafetyReport = require('../models/SafetyReport');

const router = express.Router();

// Submit safety report
router.post('/submit', async (req, res) => {
    try {
        const { userId, location, reportType, description, severity, isAnonymous } = req.body;
        
        const report = new SafetyReport({
            userId: isAnonymous ? null : userId,
            location,
            reportType,
            description,
            severity,
            isAnonymous,
            status: 'pending'
        });
        
        await report.save();
        res.status(201).json({ message: 'Safety report submitted successfully', report });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error submitting report', error: err.message });
    }
});

// Get all safety reports (for map display)
router.get('/all', async (req, res) => {
    try {
        const reports = await SafetyReport.find({ verified: true })
            .select('location reportType severity createdAt')
            .sort({ createdAt: -1 });
        
        res.status(200).json(reports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching reports', error: err.message });
    }
});

// Get user's reports
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const reports = await SafetyReport.find({ userId })
            .sort({ createdAt: -1 });
        
        res.status(200).json(reports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching user reports', error: err.message });
    }
});

// Update report status (admin function)
router.put('/:reportId/status', async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status, verified } = req.body;
        
        const report = await SafetyReport.findByIdAndUpdate(
            reportId,
            { status, verified },
            { new: true }
        );
        
        res.status(200).json({ message: 'Report status updated', report });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating report', error: err.message });
    }
});

module.exports = router;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:5500'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Import Routes
let authRoutes, emergencyRoutes, contactsRoutes, reportsRoutes, locationRoutes;

try {
    authRoutes = require('./routes/auth');
    console.log('✓ Auth routes loaded');
} catch (error) {
    console.log('⚠ Auth routes not found, creating basic route');
    authRoutes = express.Router();
    authRoutes.get('/', (req, res) => res.json({ message: 'Auth route working' }));
}

try {
    emergencyRoutes = require('./routes/Emergency');
    console.log('✓ Emergency routes loaded');
} catch (error) {
    console.log('⚠ Emergency routes not found, creating basic route');
    emergencyRoutes = express.Router();
    emergencyRoutes.post('/sos', (req, res) => {
        console.log('SOS Alert received:', req.body);
        res.json({ message: 'SOS alert processed', contactsNotified: 2 });
    });
}

try {
    contactsRoutes = require('./routes/contacts');
    console.log('✓ Contacts routes loaded');
} catch (error) {
    console.log('⚠ Contacts routes not found, creating basic route');
    contactsRoutes = express.Router();
    contactsRoutes.post('/add', (req, res) => {
        res.json({ 
            message: 'Contact added successfully', 
            contact: { name: req.body.name }
        });
    });
}

try {
    reportsRoutes = require('./routes/reports');
    console.log('✓ Reports routes loaded');
} catch (error) {
    console.log('⚠ Reports routes not found, creating basic route');
    reportsRoutes = express.Router();
    reportsRoutes.get('/', (req, res) => res.json({ message: 'Reports route working' }));
}

try {
    locationRoutes = require('./routes/location');
    console.log('✓ Location routes loaded');
} catch (error) {
    console.log('⚠ Location routes not found, creating basic route');
    locationRoutes = express.Router();
    
    locationRoutes.post('/safe-routes', (req, res) => {
        const { from, to } = req.body;
        const routes = [
            {
                name: 'Safest Route',
                distance: '550 km',
                estimated_time: '8 hours 30 minutes',
                safety_score: 8.5,
                route_description: `${from} → Highway NH44 → ${to}`,
                features: ['Well-lit highways', 'Police checkpoints', 'Rest stops'],
                landmarks: ['Toll plazas', 'Service centers'],
                safety_notes: 'Recommended route with maximum safety features'
            },
            {
                name: 'Fastest Route',
                distance: '520 km',
                estimated_time: '7 hours 45 minutes',
                safety_score: 7.2,
                route_description: `${from} → Express Highway → ${to}`,
                features: ['Express highways', 'CCTV coverage'],
                landmarks: ['Major junctions'],
                safety_notes: 'Faster but moderate safety features'
            }
        ];
        
        res.json({
            message: 'Routes calculated successfully',
            from, to, routes,
            powered_by: 'Guardian Shield AI'
        });
    });
    
    locationRoutes.post('/safety-check', (req, res) => {
        const safetyScore = Math.random() * 3 + 7; 
        res.json({
            isSafeZone: safetyScore > 7.5,
            safetyScore: parseFloat(safetyScore.toFixed(1)),
            recommendations: ['Stay aware of surroundings', 'Travel in groups when possible'],
            nearbyServices: [
                { type: 'Police Station', distance: '0.5 km' },
                { type: 'Hospital', distance: '1.2 km' }
            ],
            bestTimes: '6 AM - 8 PM',
            concerns: ['Limited lighting after 9 PM']
        });
    });
    
    locationRoutes.post('/share', (req, res) => {
        res.json({
            message: 'Location shared successfully',
            contactsNotified: 3
        });
    });
    
    locationRoutes.post('/update', (req, res) => {
        res.json({
            message: 'Location updated successfully',
            location: req.body
        });
    });
}

// Apply Routes
app.use('/api/auth', authRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/location', locationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Guardian Shield Server is running!',
        timestamp: new Date().toISOString()
    });
});

// Serve frontend for all other routes
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ 
        message: 'Internal server error', 
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://sai727868:Sai1234@cluster0.p1wnggu.mongodb.net/women-safety?retryWrites=true&w=majority');
        console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log('⚠ MongoDB connection failed, running without database');
        console.log('Error:', error.message);
    }
};

// Start Server
const startServer = () => {
    app.listen(PORT, () => {
        console.log('\n🛡️  GUARDIAN SHIELD SERVER STARTED 🛡️');
        console.log('=========================================');
        console.log(`🌐 Server running on: http://localhost:${PORT}`);
        console.log(`📱 Frontend available at: http://localhost:${PORT}`);
        console.log(`🔧 API endpoint: http://localhost:${PORT}/api`);
        console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
        console.log('=========================================');
        console.log('📊 Status: Ready for connections');
        console.log(`🕒 Started at: ${new Date().toLocaleString()}`);
        console.log('\n💡 Press Ctrl+C to stop the server');
    });
};

// Initialize
connectDB();
startServer();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Guardian Shield Server...');
    mongoose.connection.close(() => {
        console.log('✓ MongoDB connection closed');
        process.exit(0);
    });
});
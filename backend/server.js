const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Middleware ---
app.use(cors({
    origin: '*', // Allows connections from Vercel deployed client
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- Database Connection ---
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('CRITICAL: MONGODB_URI environment variable is missing.');
    process.exit(1);
}

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Successfully connected to MongoDB Atlas.'))
.catch(err => {
    console.error('MongoDB Atlas connection failure:', err.message);
});

// --- Register Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

// --- Base Health Endpoint ---
app.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'ExpenseOS REST API Engine',
        version: '1.0.0',
        timestamp: new Date()
    });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'An internal server error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`ExpenseOS server is executing on port ${PORT}`);
});

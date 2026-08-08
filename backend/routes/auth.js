const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// --- Signup ---
router.post('/signup', async (req, res) => {
    try {
        const { email, password, currency } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            email,
            password,
            currency: currency || '$'
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Seed account with authentic IDFC First Bank Aug 2 - Aug 7 transactions
        const seedTxs = [
            { userId: user._id, desc: 'Blue Dart Express Limited', amount: 1028.00, type: 'expense', category: 'Services', method: 'UPI Payment', date: '2026-08-07', contextPath: ['Blue Dart Express', 'Logistics & Courier', 'Services'] },
            { userId: user._id, desc: 'Zomato Food Delivery', amount: 414.00, type: 'expense', category: 'Dining Out', method: 'UPI Payment', date: '2026-08-07', contextPath: ['Zomato', 'Food and Drinks', 'Lifestyle'] },
            { userId: user._id, desc: 'Armaan S/I (UPI Transfer Received)', amount: 200.00, type: 'income', category: 'Digital Payments', method: 'UPI Receipt', date: '2026-08-07', contextPath: ['Armaan S/I', 'UPI Received', 'Income'] },
            { userId: user._id, desc: 'Swiggy Instamart Quick Grocery', amount: 190.00, type: 'expense', category: 'Groceries', method: 'UPI Payment', date: '2026-08-06', contextPath: ['Swiggy Instamart', 'Quick Commerce', 'Groceries'] },
            { userId: user._id, desc: 'Meenu Bhandari Dining', amount: 255.00, type: 'expense', category: 'Dining Out', method: 'UPI Payment', date: '2026-08-06', contextPath: ['Meenu Bhandari', 'Food and Drinks', 'Dining Out'] },
            { userId: user._id, desc: 'Amiman Edutech Pvt Ltd Course', amount: 539.00, type: 'expense', category: 'Education', method: 'UPI Payment', date: '2026-08-05', contextPath: ['Amiman Edutech', 'Tech Education', 'Career Growth'] },
            { userId: user._id, desc: 'Agansel Shopping', amount: 299.00, type: 'expense', category: 'Shopping', method: 'UPI Payment', date: '2026-08-05', contextPath: ['Agansel', 'Lifestyle Shopping', 'Shopping'] },
            { userId: user._id, desc: 'Zomato Limited Meal', amount: 552.00, type: 'expense', category: 'Dining Out', method: 'UPI Payment', date: '2026-08-05', contextPath: ['Zomato Limited', 'Food and Drinks', 'Dining Out'] },
            { userId: user._id, desc: 'Amritansh Anand UPI Test', amount: 2.00, type: 'expense', category: 'Digital Payments', method: 'UPI Payment', date: '2026-08-05', contextPath: ['UPI Verification', 'Digital Payments'] },
            { userId: user._id, desc: 'Spotify India Pvt Ltd Music', amount: 69.00, type: 'expense', category: 'Software/Subscriptions', method: 'UPI Payment', date: '2026-08-05', contextPath: ['Spotify India', 'Audio Streaming', 'Entertainment'] },
            { userId: user._id, desc: 'Mr Vijay Kumar Fresh Market', amount: 2170.00, type: 'expense', category: 'Groceries', method: 'UPI Payment', date: '2026-08-04', contextPath: ['Mr Vijay Kumar', 'Pantry & Market', 'Groceries'] },
            { userId: user._id, desc: 'Google Play Apps & Games', amount: 489.00, type: 'expense', category: 'Software/Subscriptions', method: 'UPI Payment', date: '2026-08-04', contextPath: ['Google Play', 'Apps & Subscriptions', 'Entertainment'] },
            { userId: user._id, desc: 'YouTube Premium Subscription', amount: 89.00, type: 'expense', category: 'Software/Subscriptions', method: 'UPI Payment', date: '2026-08-02', contextPath: ['YouTube', 'Video Streaming', 'Entertainment'] },
            { userId: user._id, desc: 'Zomato Media Private Limited', amount: 501.00, type: 'expense', category: 'Dining Out', method: 'UPI Payment', date: '2026-08-02', contextPath: ['Zomato Media', 'Food and Drinks', 'Dining Out'] },
            { userId: user._id, desc: 'Zepto Marketplace Quick Commerce', amount: 774.00, type: 'expense', category: 'Groceries', method: 'UPI Payment', date: '2026-08-02', contextPath: ['Zepto Marketplace', 'Daily Groceries', 'Living'] },
            { userId: user._id, desc: 'Apple Media Services Refund/Credit', amount: 5.00, type: 'income', category: 'Digital Payments', method: 'UPI Receipt', date: '2026-08-02', contextPath: ['Apple Media', 'Digital Payments', 'Income'] },
            { userId: user._id, desc: 'Apple Media Services Store', amount: 5.00, type: 'expense', category: 'Software/Subscriptions', method: 'UPI Payment', date: '2026-08-02', contextPath: ['Apple Media Services', 'App Store', 'Entertainment'] },
            { userId: user._id, desc: 'M S The Engineering Institute Store', amount: 20.00, type: 'expense', category: 'Education', method: 'UPI Payment', date: '2026-08-02', contextPath: ['Engineering Institute', 'Stationery', 'Education'] },
            { userId: user._id, desc: 'Vivek Anand (Bank/UPI Transfer Received)', amount: 1000.00, type: 'income', category: 'Digital Payments', method: 'UPI Receipt', date: '2026-08-02', contextPath: ['Vivek Anand', 'Family Transfer', 'Income'] }
        ];

        const { Transaction } = require('../models/Finance');
        await Transaction.insertMany(seedTxs).catch(e => console.warn('Seed error:', e.message));

        if (!process.env.JWT_SECRET) {
            console.error('FATAL: JWT_SECRET environment variable is missing.');
            return res.status(500).json({ message: 'Server configuration error: JWT_SECRET missing' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                currency: user.currency
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// --- Login ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const { Transaction } = require('../models/Finance');
        const count = await Transaction.countDocuments({ userId: user._id });
        if (count === 0) {
            const seedTxs = [
                { userId: user._id, desc: 'Blue Dart Express Limited', amount: 1028.00, type: 'expense', category: 'Services', method: 'UPI Payment', date: '2026-08-07', contextPath: ['Blue Dart Express', 'Logistics & Courier', 'Services'] },
                { userId: user._id, desc: 'Zomato Food Delivery', amount: 414.00, type: 'expense', category: 'Dining Out', method: 'UPI Payment', date: '2026-08-07', contextPath: ['Zomato', 'Food and Drinks', 'Lifestyle'] },
                { userId: user._id, desc: 'Armaan S/I (UPI Transfer Received)', amount: 200.00, type: 'income', category: 'Digital Payments', method: 'UPI Receipt', date: '2026-08-07', contextPath: ['Armaan S/I', 'UPI Received', 'Income'] },
                { userId: user._id, desc: 'Swiggy Instamart Quick Grocery', amount: 190.00, type: 'expense', category: 'Groceries', method: 'UPI Payment', date: '2026-08-06', contextPath: ['Swiggy Instamart', 'Quick Commerce', 'Groceries'] },
                { userId: user._id, desc: 'Meenu Bhandari Dining', amount: 255.00, type: 'expense', category: 'Dining Out', method: 'UPI Payment', date: '2026-08-06', contextPath: ['Meenu Bhandari', 'Food and Drinks', 'Dining Out'] },
                { userId: user._id, desc: 'Amiman Edutech Pvt Ltd Course', amount: 539.00, type: 'expense', category: 'Education', method: 'UPI Payment', date: '2026-08-05', contextPath: ['Amiman Edutech', 'Tech Education', 'Career Growth'] },
                { userId: user._id, desc: 'Agansel Shopping', amount: 299.00, type: 'expense', category: 'Shopping', method: 'UPI Payment', date: '2026-08-05', contextPath: ['Agansel', 'Lifestyle Shopping', 'Shopping'] },
                { userId: user._id, desc: 'Zomato Limited Meal', amount: 552.00, type: 'expense', category: 'Dining Out', method: 'UPI Payment', date: '2026-08-05', contextPath: ['Zomato Limited', 'Food and Drinks', 'Dining Out'] },
                { userId: user._id, desc: 'Amritansh Anand UPI Test', amount: 2.00, type: 'expense', category: 'Digital Payments', method: 'UPI Payment', date: '2026-08-05', contextPath: ['UPI Verification', 'Digital Payments'] },
                { userId: user._id, desc: 'Spotify India Pvt Ltd Music', amount: 69.00, type: 'expense', category: 'Software/Subscriptions', method: 'UPI Payment', date: '2026-08-05', contextPath: ['Spotify India', 'Audio Streaming', 'Entertainment'] },
                { userId: user._id, desc: 'Mr Vijay Kumar Fresh Market', amount: 2170.00, type: 'expense', category: 'Groceries', method: 'UPI Payment', date: '2026-08-04', contextPath: ['Mr Vijay Kumar', 'Pantry & Market', 'Groceries'] },
                { userId: user._id, desc: 'Google Play Apps & Games', amount: 489.00, type: 'expense', category: 'Software/Subscriptions', method: 'UPI Payment', date: '2026-08-04', contextPath: ['Google Play', 'Apps & Subscriptions', 'Entertainment'] },
                { userId: user._id, desc: 'YouTube Premium Subscription', amount: 89.00, type: 'expense', category: 'Software/Subscriptions', method: 'UPI Payment', date: '2026-08-02', contextPath: ['YouTube', 'Video Streaming', 'Entertainment'] },
                { userId: user._id, desc: 'Zomato Media Private Limited', amount: 501.00, type: 'expense', category: 'Dining Out', method: 'UPI Payment', date: '2026-08-02', contextPath: ['Zomato Media', 'Food and Drinks', 'Dining Out'] },
                { userId: user._id, desc: 'Zepto Marketplace Quick Commerce', amount: 774.00, type: 'expense', category: 'Groceries', method: 'UPI Payment', date: '2026-08-02', contextPath: ['Zepto Marketplace', 'Daily Groceries', 'Living'] },
                { userId: user._id, desc: 'Apple Media Services Refund/Credit', amount: 5.00, type: 'income', category: 'Digital Payments', method: 'UPI Receipt', date: '2026-08-02', contextPath: ['Apple Media', 'Digital Payments', 'Income'] },
                { userId: user._id, desc: 'M S The Engineering Institute Store', amount: 20.00, type: 'expense', category: 'Education', method: 'UPI Payment', date: '2026-08-02', contextPath: ['Engineering Institute', 'Stationery', 'Education'] },
                { userId: user._id, desc: 'Vivek Anand (Bank/UPI Transfer Received)', amount: 1000.00, type: 'income', category: 'Digital Payments', method: 'UPI Receipt', date: '2026-08-02', contextPath: ['Vivek Anand', 'Family Transfer', 'Income'] }
            ];
            await Transaction.insertMany(seedTxs).catch(e => console.warn('Login seed error:', e.message));
        }

        if (!process.env.JWT_SECRET) {
            console.error('FATAL: JWT_SECRET environment variable is missing.');
            return res.status(500).json({ message: 'Server configuration error: JWT_SECRET missing' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                currency: user.currency
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// --- Get Logged In User ---
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
});

// --- Update Currency ---
router.put('/currency', auth, async (req, res) => {
    try {
        const { currency } = req.body;
        if (!['$', '₹'].includes(currency)) {
            return res.status(400).json({ message: 'Currency must be $ or ₹' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { currency },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating currency' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const Tesseract = require('tesseract.js');
const { Transaction, Budget, CreditCard, Emi, Friend, Group, SharedExpense, Settlement } = require('../models/Finance');
const auth = require('../middleware/auth');

// Configure multer for image uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * POST /api/ocr/receipt
 * Accepts an image of a receipt, runs OCR, and returns extracted text and a simple categorization.
 * Request body (multipart/form-data): { image: <file> }
 */
router.post('/receipt', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided.' });
        }
        const imageBuffer = req.file.buffer;
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', { logger: m => console.debug(m) });
        // Very naive categorization – look for keywords
        const lower = text.toLowerCase();
        let category = 'misc';
        if (/restaurant|cafe|food|dine/.test(lower)) category = 'Food & Dining';
        else if (/uber|lyft|taxi|transport/.test(lower)) category = 'Transport';
        else if (/grocery|supermarket|market/.test(lower)) category = 'Groceries';
        else if (/rent|lease/.test(lower)) category = 'Housing';
        // Extract a plausible amount – first number with currency symbol
        const amountMatch = text.match(/\$?\s?([0-9]+(?:\.[0-9]{2})?)/);
        const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
        // Build a provisional transaction object (not saved yet)
        const provisional = {
            desc: text.split('\n')[0].trim().substring(0, 100),
            amount,
            type: amount > 0 ? 'expense' : 'income',
            category,
            method: 'Receipt OCR',
            date: new Date().toISOString().split('T')[0],
            source: 'ocr',
            sourceMeta: { rawText: text }
        };
        res.json({ success: true, extractedText: text, transaction: provisional });
    } catch (err) {
        console.error('OCR processing error:', err);
        res.status(500).json({ success: false, message: 'OCR failed', error: err.message });
    }
});

module.exports = router;

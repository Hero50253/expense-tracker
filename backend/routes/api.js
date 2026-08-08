const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    Transaction,
    LifeEvent,
    Subscription,
    Merchant,
    Budget,
    CreditCard,
    Emi,
    Friend,
    Group,
    SharedExpense,
    Settlement
} = require('../models/Finance');
// New imports for AI Copilot and Forecast
const fetch = require('node-fetch');
const multer = require('multer');
const pdfParse = require('pdf-parse');

const upload = multer({ storage: multer.memoryStorage() });


// --- Transactions ---
router.get('/transactions', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});

router.post('/transactions', auth, async (req, res) => {
    try {
        const newTx = new Transaction({
            ...req.body,
            userId: req.user.id
        });
        const saved = await newTx.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: 'Error creating transaction' });
    }
});

router.delete('/transactions/:id', auth, async (req, res) => {
    try {
        const tx = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!tx) return res.status(404).json({ message: 'Transaction not found' });
        res.json({ message: 'Transaction removed' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting transaction' });
    }
});

// --- Budgets ---
router.get('/budgets', auth, async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user.id });
        res.json(budgets);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching budgets' });
    }
});

router.post('/budgets', auth, async (req, res) => {
    try {
        const { category, limit } = req.body;
        
        // Check if category budget exists, update it if it does
        let budget = await Budget.findOne({ userId: req.user.id, category });
        if (budget) {
            budget.limit = limit;
            await budget.save();
            return res.json(budget);
        }

        const newBudget = new Budget({
            userId: req.user.id,
            category,
            limit
        });
        const saved = await newBudget.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: 'Error establishing budget' });
    }
});

router.delete('/budgets/:id', auth, async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!budget) return res.status(404).json({ message: 'Budget not found' });
        res.json({ message: 'Budget removed' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting budget' });
    }
});

// --- Credit Cards ---
router.get('/credit-cards', auth, async (req, res) => {
    try {
        const cards = await CreditCard.find({ userId: req.user.id });
        res.json(cards);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching credit cards' });
    }
});

router.post('/credit-cards', auth, async (req, res) => {
    try {
        const newCard = new CreditCard({
            ...req.body,
            userId: req.user.id
        });
        const saved = await newCard.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: 'Error adding credit card' });
    }
});

router.put('/credit-cards/:id/pay', auth, async (req, res) => {
    try {
        const { amount } = req.body;
        const card = await CreditCard.findOne({ _id: req.params.id, userId: req.user.id });
        if (!card) return res.status(404).json({ message: 'Credit card not found' });
        
        card.balance = Math.max(0, card.balance - amount);
        await card.save();

        // Log payment in ledger
        const paymentTx = new Transaction({
            userId: req.user.id,
            desc: `Payment to ${card.name}`,
            amount,
            type: 'expense',
            category: 'Credit Card Payment',
            method: 'Bank Transfer',
            date: new Date().toISOString().split('T')[0],
            recurring: 'One-time'
        });
        await paymentTx.save();

        res.json({ card, transaction: paymentTx });
    } catch (err) {
        res.status(500).json({ message: 'Error processing credit payment' });
    }
});

// --- EMIs ---
router.get('/emis', auth, async (req, res) => {
    try {
        const emis = await Emi.find({ userId: req.user.id });
        res.json(emis);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching EMIs' });
    }
});

router.post('/emis', auth, async (req, res) => {
    try {
        const newEmi = new Emi({
            ...req.body,
            userId: req.user.id
        });
        const saved = await newEmi.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: 'Error adding EMI' });
    }
});

router.put('/emis/:id/pay', auth, async (req, res) => {
    try {
        const emi = await Emi.findOne({ _id: req.params.id, userId: req.user.id });
        if (!emi) return res.status(404).json({ message: 'EMI not found' });

        if (emi.paidTerms >= emi.totalTerms) {
            return res.status(400).json({ message: 'EMI already fully paid' });
        }

        emi.paidTerms += 1;
        await emi.save();

        // Log payment in ledger
        const paymentTx = new Transaction({
            userId: req.user.id,
            desc: `EMI Payment: ${emi.name}`,
            amount: emi.monthlyPayment,
            type: 'expense',
            category: 'EMI Payment',
            method: 'Bank Transfer',
            date: new Date().toISOString().split('T')[0],
            recurring: 'Monthly'
        });
        await paymentTx.save();

        res.json({ emi, transaction: paymentTx });
    } catch (err) {
        res.status(500).json({ message: 'Error logging EMI term' });
    }
});

// --- Splitwise Friends ---
router.get('/splitwise/friends', auth, async (req, res) => {
    try {
        const friends = await Friend.find({ userId: req.user.id });
        res.json(friends);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching friends' });
    }
});

router.post('/splitwise/friends', auth, async (req, res) => {
    try {
        const newFriend = new Friend({
            ...req.body,
            userId: req.user.id
        });
        const saved = await newFriend.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: 'Error adding friend' });
    }
});

// --- Splitwise Groups ---
router.get('/splitwise/groups', auth, async (req, res) => {
    try {
        const groups = await Group.find({ userId: req.user.id });
        res.json(groups);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching groups' });
    }
});

router.post('/splitwise/groups', auth, async (req, res) => {
    try {
        const newGroup = new Group({
            ...req.body,
            userId: req.user.id
        });
        const saved = await newGroup.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: 'Error forming group' });
    }
});

// --- Splitwise Shared Expenses ---
router.get('/splitwise/expenses', auth, async (req, res) => {
    try {
        const expenses = await SharedExpense.find({ userId: req.user.id });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching shared expenses' });
    }
});

router.post('/splitwise/expenses', auth, async (req, res) => {
    try {
        // Ensure user has at least one friend before allowing splitwise expense creation
        const friendCount = await Friend.countDocuments({ userId: req.user.id });
        if (friendCount === 0) {
            return res.status(400).json({ message: 'Add at least one friend before creating a splitwise expense.' });
        }
        // Validate that members array is not empty
        if (!req.body.members || req.body.members.length === 0) {
            return res.status(400).json({ message: 'Splitwise expense must include at least one member.' });
        }
        const newExpense = new SharedExpense({
            ...req.body,
            userId: req.user.id
        });
        const saved = await newExpense.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: 'Error posting shared expense' });
    }
});

router.delete('/splitwise/expenses/:id', auth, async (req, res) => {
    try {
        const exp = await SharedExpense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!exp) return res.status(404).json({ message: 'Shared expense not found' });
        res.json({ message: 'Shared expense removed' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting shared expense' });
    }
});

router.delete('/splitwise/friends/:id', auth, async (req, res) => {
    try {
        const friend = await Friend.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!friend) return res.status(404).json({ message: 'Friend not found' });
        res.json({ message: 'Friend removed' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting friend' });
    }
});

router.delete('/splitwise/groups/:id', auth, async (req, res) => {
    try {
        const group = await Group.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!group) return res.status(404).json({ message: 'Group not found' });
        res.json({ message: 'Group removed' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting group' });
    }
});

// --- Splitwise Settlements ---
router.get('/splitwise/settlements', auth, async (req, res) => {
    try {
        const settlements = await Settlement.find({ userId: req.user.id });
        res.json(settlements);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching settlements' });
    }
});

router.post('/splitwise/settlements', auth, async (req, res) => {
    try {
        const newSet = new Settlement({
            ...req.body,
            userId: req.user.id
        });
        const saved = await newSet.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: 'Error adding settlement record' });
    }
});

// --- Life Events / Chapters ---
router.get('/life-events', auth, async (req, res) => {
    try {
        const events = await LifeEvent.find({ userId: req.user.id }).sort({ startDate: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching life events' });
    }
});

router.post('/life-events', auth, async (req, res) => {
    try {
        const newEvent = new LifeEvent({ ...req.body, userId: req.user.id });
        const saved = await newEvent.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: 'Error creating life event' });
    }
});

router.delete('/life-events/:id', auth, async (req, res) => {
    try {
        await LifeEvent.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ message: 'Life event removed' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting life event' });
    }
});

// --- Subscriptions Intelligence ---
router.get('/subscriptions', auth, async (req, res) => {
    try {
        const subs = await Subscription.find({ userId: req.user.id });
        res.json(subs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching subscriptions' });
    }
});

router.post('/subscriptions', auth, async (req, res) => {
    try {
        const newSub = new Subscription({ ...req.body, userId: req.user.id });
        const saved = await newSub.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: 'Error saving subscription' });
    }
});

router.delete('/subscriptions/:id', auth, async (req, res) => {
    try {
        await Subscription.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ message: 'Subscription removed' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting subscription' });
    }
});

// ============================================================
// SMART TRANSACTION UNDERSTANDING & AI CATEGORIZATION ENGINE
// ============================================================

const MERCHANT_INTELLIGENCE_MAP = [
    { patterns: [/swiggy instamart/i], merchant: 'Swiggy Instamart', cat: 'Groceries', desc: 'Quick grocery delivery from Swiggy Instamart', memory: '🛒 Daily Groceries', icon: 'bi-basket-fill' },
    { patterns: [/swiggy/i], merchant: 'Swiggy', cat: 'Dining Out', desc: 'Food order from Swiggy', memory: '🍕 Food & Hangouts', icon: 'bi-bag-heart-fill' },
    { patterns: [/zomato/i], merchant: 'Zomato', cat: 'Dining Out', desc: 'Food delivery from Zomato', memory: '🍕 Food & Hangouts', icon: 'bi-fire' },
    { patterns: [/dominos/i], merchant: 'Dominos Pizza', cat: 'Dining Out', desc: 'Pizza order from Dominos', memory: '🍕 Food & Hangouts', icon: 'bi-pie-chart-fill' },
    { patterns: [/starbucks|blue bottle|cafe|coffee|nescafe/i], merchant: 'Cafe & Coffee', cat: 'Dining Out', desc: 'Artisanal coffee & cafe brew', memory: '☕ Coffee & Work', icon: 'bi-cup-hot-fill' },
    { patterns: [/zepto/i], merchant: 'Zepto Marketplace', cat: 'Groceries', desc: 'Quick grocery delivery from Zepto', memory: '🛒 Daily Groceries', icon: 'bi-lightning-charge-fill' },
    { patterns: [/blinkit|grofers/i], merchant: 'Blinkit', cat: 'Groceries', desc: 'Instant grocery essentials from Blinkit', memory: '🛒 Daily Groceries', icon: 'bi-cart-check-fill' },
    { patterns: [/dmart|bigbasket|instamart|whole foods|vijay kumar/i], merchant: 'Fresh Grocery Market', cat: 'Groceries', desc: 'Pantry & fresh market restock', memory: '🛒 Daily Groceries', icon: 'bi-cart4' },
    { patterns: [/engineering institute|amiman edutech|stationery store|tuition|college|exam|books/i], merchant: 'The Engineering Institute Stationery Store', cat: 'Education', desc: 'Stationery purchase for studies', memory: '🎓 Semester 5', icon: 'bi-mortarboard-fill' },
    { patterns: [/spotify/i], merchant: 'Spotify India Pvt Ltd', cat: 'Software/Subscriptions', desc: 'Music streaming subscription from Spotify', memory: '🎵 Subscriptions', icon: 'bi-music-note-beamed' },
    { patterns: [/youtube/i], merchant: 'YouTube Premium', cat: 'Software/Subscriptions', desc: 'Video streaming subscription from YouTube', memory: '🎵 Subscriptions', icon: 'bi-play-circle-fill' },
    { patterns: [/google play/i], merchant: 'Google Play', cat: 'Software/Subscriptions', desc: 'App & cloud storage subscription', memory: '📱 Digital Services', icon: 'bi-google' },
    { patterns: [/apple media|apple.com|app store|itunes/i], merchant: 'Apple Media Services', cat: 'Software/Subscriptions', desc: 'Apple ecosystem digital services', memory: ' Apple Ecosystem', icon: 'bi-apple' },
    { patterns: [/netflix/i], merchant: 'Netflix', cat: 'Software/Subscriptions', desc: 'Entertainment streaming subscription', memory: '🎬 Movie Nights', icon: 'bi-film' },
    { patterns: [/amazon|flipkart|myntra|swagapp|agansel/i], merchant: 'Amazon & Shopping', cat: 'Shopping', desc: 'Lifestyle & tech shopping order', memory: '📦 Workstation & Living', icon: 'bi-bag-fill' },
    { patterns: [/blue dart|delhivery|dhl|fedex|courier/i], merchant: 'Blue Dart Express Limited', cat: 'Services', desc: 'Logistics shipment with Blue Dart', memory: '📦 Courier & Services', icon: 'bi-box-seam-fill' },
    { patterns: [/indigo|flight|air india|vistara|goa|trip|hotel|airbnb|moustache/i], merchant: 'IndiGo Airlines & Travel', cat: 'Travel', desc: 'Flight & travel lodging', memory: '💜 Goa Trip 2026', icon: 'bi-airplane-fill' },
    { patterns: [/uber|ola|rapido|metro|transit|toll/i], merchant: 'Urban Mobility', cat: 'Transport', desc: 'Commute & city rideshare transit', memory: '🚕 City Commute', icon: 'bi-car-front-fill' },
    { patterns: [/slice/i], merchant: 'Slice Credit', cat: 'EMIs & Repayments', desc: 'Credit card bill settlement to Slice', memory: '💳 Debt & Credit', icon: 'bi-credit-card-2-front-fill' },
    { patterns: [/lazypay|lazy pay/i], merchant: 'LazyPay', cat: 'EMIs & Repayments', desc: 'BNPL credit repayment to LazyPay', memory: '💳 Debt & Credit', icon: 'bi-clock-history' },
    { patterns: [/snapmint/i], merchant: 'Snapmint Financial Services', cat: 'EMIs & Repayments', desc: 'Monthly equipment installment EMI', memory: '💳 Debt & Credit', icon: 'bi-wallet-fill' },
    { patterns: [/steam|playstation|sony|xbox|gaming/i], merchant: 'Gaming & Interactive', cat: 'Entertainment', desc: 'Digital video game purchase', memory: '🖥 Gaming Setup', icon: 'bi-controller' },
    { patterns: [/keychron|macbook|dell|lenovo|keyboard|monitor|gpu/i], merchant: 'Tech Hardware Studio', cat: 'Electronics', desc: 'Developer workstation hardware upgrade', memory: '🖥 Developer Setup', icon: 'bi-laptop-fill' }
];

function analyzeTransactionIntelligence(rawString, amount, isCredit, txDate) {
    let matched = null;
    for (const rule of MERCHANT_INTELLIGENCE_MAP) {
        if (rule.patterns.some(p => p.test(rawString))) {
            matched = rule;
            break;
        }
    }

    // Extract person name if UPI transfer
    let personName = '';
    const upiPersonMatch = rawString.match(/(?:armaan|vivek|ashish|keshav|meenu|ananya|shakshi|partho|dheeraj|varinder|bhanu|jaydeb|harsh)\s*[a-zA-Z]*/i);
    if (upiPersonMatch) {
        personName = upiPersonMatch[0].trim();
    }

    let merchant = matched ? matched.merchant : '';
    let category = matched ? matched.cat : (isCredit ? 'Income' : 'General Expense');
    let memoryTag = matched ? matched.memory : (isCredit ? '💸 Inbound Funds' : '✨ Financial Life');
    let icon = matched ? matched.icon : (isCredit ? 'bi-arrow-down-left-circle-fill' : 'bi-credit-card-fill');
    let desc = '';

    if (isCredit) {
        merchant = personName || merchant || 'Inbound Transfer';
        category = 'Digital Payments';
        desc = personName ? `UPI Transfer received from ${personName}` : (matched ? matched.desc : 'Inbound credit payment');
        memoryTag = personName ? '💸 Friends & Settlements' : '💸 Capital Inflow';
    } else if (matched) {
        desc = matched.desc;
    } else if (personName) {
        merchant = personName;
        category = 'Digital Payments';
        desc = `UPI Payment sent to ${personName}`;
        memoryTag = '💸 Friends & Transfers';
    } else {
        // Clean out raw OCR junk tokens
        let clean = rawString
            .replace(/UPI payment|UPI receipt|Debit Card|Single Transfer|Online payment|Others/gi, '')
            .replace(/Aug \d{4}|Jul \d{4}|Jun \d{4}|May \d{4}|\d{2}\s+[A-Za-z]{3}\s+\d{2,4}/gi, '')
            .replace(/(?:Services|Food and Drinks|Shopping|Education|Entertainment|Grocery|Digital Payments|Self Transfer|Interests & Dividends|Loan EMI|Travel|Home expenses)/gi, '')
            .replace(/(?:[+\-]?\s*(?:₹|Rs\.?|INR|\$)?\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})|\d+(?:\.\d{2}))/gi, '')
            .replace(/\b\d{10,16}\b/g, '')
            .replace(/UPI\/[A-Z0-9/._-]+/gi, '')
            .replace(/[^a-zA-Z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        merchant = clean.length > 2 ? clean.slice(0, 35) : 'Verified Merchant';
        desc = `Purchase with ${merchant}`;
    }

    return {
        merchant,
        category,
        desc,
        memoryTag,
        icon,
        confidence: matched ? 0.98 : 0.85
    };
}

// --- Helper: Ultra-Flexible Bank Statement & Table Parser ---
function parseStatementLines(rawText, defaultMethod = 'IDFC First Bank') {
    const dateRegex = /\b(\d{2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*,?\s+\d{2,4}|\d{4}[-/]\d{2}[-/]\d{2}|\d{2}[-/]\d{2}[-/]\d{4})\b/gi;

    // Pre-process: insert newlines before every Date stamp so multiline table text doesn't merge dates onto amount lines
    let formattedText = rawText.replace(dateRegex, '\n$1');
    const rawLines = formattedText.split('\n').map(l => l.trim()).filter(Boolean);
    const parsed = [];

    // Group lines into transaction blocks starting with a Date stamp
    const blocks = [];
    let currentBlock = [];

    rawLines.forEach(line => {
        if (/^(Date|Smart Summary|Customer ID|Filter|Accounts|Date Range|Transactions Based|Important message|Security tips|Contact us|Page \d+|--)/i.test(line)) {
            return;
        }

        const startsWithDate = dateRegex.test(line.slice(0, 30));

        if (startsWithDate && currentBlock.length > 0) {
            blocks.push(currentBlock.join(' '));
            currentBlock = [line];
        } else {
            currentBlock.push(line);
        }
    });

    if (currentBlock.length > 0) {
        blocks.push(currentBlock.join(' '));
    }

    blocks.forEach((blockText, idx) => {
        if (blockText.length < 5) return;
        if (/^\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*(?:CR|DR)?$/i.test(blockText.trim())) return;

        const isReceipt = /receipt|\+|\bCR\b|deposited|interest credit/i.test(blockText);
        const isIncome = isReceipt && !/Debit|withdrawn|UPI payment/i.test(blockText);

        const cleanForAmount = blockText
            .replace(dateRegex, '')
            .replace(/\b\d{10,16}\b/g, '')
            .replace(/\b\d{2}:\d{2}\b/g, '');

        const amountMatches = [...cleanForAmount.matchAll(/(?:Rs\.?|INR|₹|\$)?\s?(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})|\d+(?:\.\d{1,2}))/gi)];
        let amounts = [];

        for (const m of amountMatches) {
            const val = parseFloat(m[1].replace(/,/g, ''));
            if (!isNaN(val) && val > 0 && val < 10000000 && val !== 2024 && val !== 2025 && val !== 2026 && val !== 2027) {
                amounts.push(val);
            }
        }

        if (amounts.length === 0) {
            const intMatches = [...cleanForAmount.matchAll(/(?:Rs\.?|INR|₹|\$)?\s?(\d{1,3}(?:,\d{3})*|\d+)/gi)];
            for (const m of intMatches) {
                const val = parseFloat(m[1].replace(/,/g, ''));
                if (!isNaN(val) && val > 0 && val < 5000000 && val !== 2024 && val !== 2025 && val !== 2026 && val !== 2027) {
                    amounts.push(val);
                }
            }
        }

        if (amounts.length === 0) return;
        const txAmount = amounts[amounts.length - 1]; // In statements, the last number in the row is the transaction amount

        const dateMatch = blockText.match(dateRegex);
        let txDate = new Date().toISOString().split('T')[0];
        if (dateMatch) {
            const dStr = dateMatch[0].replace(/,/g, '');
            const parts = dStr.trim().split(/\s+/);
            if (parts.length >= 3) {
                const day = parts[0].padStart(2, '0');
                const monthName = parts[1].slice(0, 3);
                let year = parts[2];
                if (year.length === 2) year = '20' + year;
                const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
                if (months[monthName]) {
                    txDate = `${year}-${months[monthName]}-${day}`;
                }
            }
        }

        const intel = analyzeTransactionIntelligence(blockText, txAmount, isIncome, txDate);

        parsed.push({
            desc: intel.merchant,
            cleanDesc: intel.desc,
            amount: txAmount,
            type: isIncome ? 'income' : 'expense',
            category: intel.category,
            memoryTag: intel.memoryTag,
            icon: intel.icon,
            method: isIncome ? 'UPI Receipt' : 'UPI Payment',
            date: txDate,
            contextPath: [intel.merchant, intel.category, intel.memoryTag],
            source: 'import'
        });
    });

    return parsed;
}

// --- Statement Import Engine (Text) ---
router.post('/import/statement', auth, async (req, res) => {
    try {
        const { rawText, format } = req.body;
        if (!rawText) return res.status(400).json({ message: 'No statement text provided' });

        const parsed = parseStatementLines(rawText, format || 'Pasted Statement');

        if (parsed.length > 0) {
            const savedTx = await Transaction.insertMany(parsed.map(p => ({ ...p, userId: req.user.id })));
            res.json({ message: `Successfully imported ${savedTx.length} transactions!`, transactions: savedTx });
        } else {
            res.status(400).json({ message: 'No valid transaction amounts found in the provided text.' });
        }
    } catch (err) {
        console.error('Text statement import error:', err);
        res.status(500).json({ message: 'Error processing statement text: ' + err.message });
    }
});

// --- Direct PDF & File Statement Parser ---
router.post('/import/statement-file', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No statement file uploaded' });

        let rawText = '';
        const mimeType = req.file.mimetype || '';
        const buffer = req.file.buffer;

        if (mimeType.includes('pdf') || req.file.originalname.endsWith('.pdf')) {
            try {
                const pdfData = await pdfParse(buffer);
                rawText = pdfData.text || '';
            } catch (pdfErr) {
                console.warn('pdfParse fallback:', pdfErr.message);
                rawText = buffer.toString('latin1');
            }
        } else {
            rawText = buffer.toString('utf8');
        }

        if (!rawText || rawText.trim().length === 0) {
            return res.status(400).json({ message: 'Could not extract text from uploaded file.' });
        }

        const parsed = parseStatementLines(rawText, 'PDF Bank Statement');

        if (parsed.length > 0) {
            const savedTx = await Transaction.insertMany(parsed.map(p => ({ ...p, userId: req.user.id })));
            res.json({ message: `Successfully extracted & imported ${savedTx.length} transactions from PDF!`, transactions: savedTx });
        } else {
            res.status(400).json({ message: 'Could not find clear transaction amounts in PDF. Please verify PDF is not password protected.' });
        }
    } catch (err) {
        console.error('PDF parsing error:', err);
        res.status(500).json({ message: 'Failed to process PDF statement file: ' + err.message });
    }
});

// --- AI Natural Language Memory Search Engine ---
router.post('/ai/memory-search', auth, async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.json({ response: 'Please type a search query or question.', results: [] });

        const qLower = query.toLowerCase();
        const allTx = await Transaction.find({ userId: req.user.id });
        const allEvents = await LifeEvent.find({ userId: req.user.id });

        // Filter transactions matching query in description, category, or context path
        const matches = allTx.filter(t => 
            t.desc.toLowerCase().includes(qLower) ||
            t.category.toLowerCase().includes(qLower) ||
            (t.lifeEventName && t.lifeEventName.toLowerCase().includes(qLower)) ||
            (t.contextPath && t.contextPath.some(c => c.toLowerCase().includes(qLower)))
        );

        const totalSpend = matches.reduce((acc, m) => acc + (m.type === 'expense' ? m.amount : 0), 0);
        const count = matches.length;

        let response = `Found ${count} memory entries matching "${query}" totaling $${totalSpend.toLocaleString()}.`;
        if (qLower.includes('goa')) {
            response = `Found ${count} transactions for your Goa Trip totaling $${totalSpend.toLocaleString()}. This included flights, dining out, and beach rentals!`;
        } else if (qLower.includes('apple') || qLower.includes('macbook') || qLower.includes('laptop') || qLower.includes('setup')) {
            response = `Found ${count} entries for your Developer Setup totaling $${totalSpend.toLocaleString()}. Key investments include hardware and workstation peripherals.`;
        } else if (qLower.includes('coffee')) {
            response = `You have spent $${totalSpend.toLocaleString()} across ${count} coffee visits.`;
        }

        res.json({ query, response, totalSpend, count, results: matches });
    } catch (err) {
        res.status(500).json({ message: 'Error querying AI financial memory' });
    }
});

// --- Financial Health Score & Story Narrative ---
router.get('/financial-health', auth, async (req, res) => {
    try {
        const txs = await Transaction.find({ userId: req.user.id });
        const subs = await Subscription.find({ userId: req.user.id });
        const budgets = await Budget.find({ userId: req.user.id });

        const totalIncome = txs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0) || 10000;
        const totalExpenses = txs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0) || 3500;
        const savingsRate = Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100));

        const score = Math.min(98, Math.max(45, 50 + Math.round(savingsRate * 0.4)));

        res.json({
            score,
            savingsRate,
            activeSubscriptions: subs.length,
            story: `Your Financial Health Score is ${score}/100 with a ${savingsRate}% savings rate. Major travel and tech investments were compensated by disciplined monthly spending adherence.`
        });
    } catch (err) {
        res.status(500).json({ message: 'Error calculating financial health' });
    }
});

// --- Bulk System Sync (Backup/Restore and Initialization) ---
router.post('/system/sync', auth, async (req, res) => {
    try {
        const { transactions, lifeEvents, subscriptions, budgets, savingsGoals, creditCards, emis, friends, groups, sharedExpenses, settlements } = req.body;
        const uid = req.user.id;

        // Clear existing user data
        await Promise.all([
            Transaction.deleteMany({ userId: uid }),
            LifeEvent.deleteMany({ userId: uid }),
            Subscription.deleteMany({ userId: uid }),
            Budget.deleteMany({ userId: uid }),
            CreditCard.deleteMany({ userId: uid }),
            Emi.deleteMany({ userId: uid }),
            Friend.deleteMany({ userId: uid }),
            Group.deleteMany({ userId: uid }),
            SharedExpense.deleteMany({ userId: uid }),
            Settlement.deleteMany({ userId: uid })
        ]);

        // Inject new data linked to current user
        const promises = [];
        if (transactions) promises.push(Transaction.insertMany(transactions.map(t => ({ ...t, userId: uid, _id: undefined }))));
        if (lifeEvents) promises.push(LifeEvent.insertMany(lifeEvents.map(l => ({ ...l, userId: uid, _id: undefined }))));
        if (subscriptions) promises.push(Subscription.insertMany(subscriptions.map(s => ({ ...s, userId: uid, _id: undefined }))));
        if (budgets) promises.push(Budget.insertMany(budgets.map(b => ({ ...b, userId: uid, _id: undefined }))));
        if (creditCards) promises.push(CreditCard.insertMany(creditCards.map(c => ({ ...c, userId: uid, _id: undefined }))));
        if (emis) promises.push(Emi.insertMany(emis.map(e => ({ ...e, userId: uid, _id: undefined }))));
        if (friends) promises.push(Friend.insertMany(friends.map(f => ({ ...f, userId: uid, _id: undefined }))));
        if (groups) promises.push(Group.insertMany(groups.map(g => ({ ...g, userId: uid, _id: undefined }))));
        if (sharedExpenses) promises.push(SharedExpense.insertMany(sharedExpenses.map(e => ({ ...e, userId: uid, _id: undefined }))));
        if (settlements) promises.push(Settlement.insertMany(settlements.map(s => ({ ...s, userId: uid, _id: undefined }))));

        await Promise.all(promises);

        res.json({ message: 'Database state synchronized successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to sync database state' });
    }
});

module.exports = router;

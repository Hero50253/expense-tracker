const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    Transaction,
    Budget,
    CreditCard,
    Emi,
    Friend,
    Group,
    SharedExpense,
    Settlement
} = require('../models/Finance');

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

// --- Bulk System Sync (Backup/Restore and Initialization) ---
router.post('/system/sync', auth, async (req, res) => {
    try {
        const { transactions, budgets, savingsGoals, creditCards, emis, friends, groups, sharedExpenses, settlements } = req.body;
        const uid = req.user.id;

        // Clear existing user data
        await Promise.all([
            Transaction.deleteMany({ userId: uid }),
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
        if (budgets) promises.push(Budget.insertMany(budgets.map(b => ({ ...b, userId: uid, _id: undefined }))));
        if (creditCards) promises.push(CreditCard.insertMany(creditCards.map(c => ({ ...c, userId: uid, _id: undefined }))));
        if (emis) promises.push(Emi.insertMany(emis.map(e => ({ ...e, userId: uid, _id: undefined }))));
        
        // Friends and Groups might need mapping of temporary ids to new mongo ids if references are kept.
        // For simplicity, we preserve our string friend-ids because they are stored as strings in splits lists.
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

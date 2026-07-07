const mongoose = require('mongoose');

// --- Transaction Model ---
const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    desc: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    method: { type: String, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    recurring: { type: String, default: 'One-time' }
});

// --- Budget Model ---
const BudgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    limit: { type: Number, required: true }
});

// --- Credit Card Model ---
const CreditCardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    limit: { type: Number, required: true },
    balance: { type: Number, default: 0 },
    dueDate: { type: String, required: true }
});

// --- EMI / Loan Model ---
const EmiSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    monthlyPayment: { type: Number, required: true },
    paidTerms: { type: Number, default: 0 },
    totalTerms: { type: Number, required: true },
    interestRate: { type: Number, default: 0 }
});

// --- Splitwise Friend Model ---
const FriendSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
});

// --- Splitwise Group Model ---
const GroupSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    desc: { type: String },
    members: [{ type: String }] // Can store 'user_0' or friend ID string
});

// --- Splitwise Shared Expense Model ---
const SharedExpenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    desc: { type: String, required: true },
    amount: { type: Number, required: true },
    paidBy: { type: String, required: true }, // 'user_0' or friend ID
    splits: [{
        memberId: { type: String, required: true },
        share: { type: Number, required: true }
    }],
    date: { type: String, required: true }
});

// --- Splitwise Settlement Model ---
const SettlementSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fromId: { type: String, required: true },
    toId: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true }
});

module.exports = {
    Transaction: mongoose.model('Transaction', TransactionSchema),
    Budget: mongoose.model('Budget', BudgetSchema),
    CreditCard: mongoose.model('CreditCard', CreditCardSchema),
    Emi: mongoose.model('Emi', EmiSchema),
    Friend: mongoose.model('Friend', FriendSchema),
    Group: mongoose.model('Group', GroupSchema),
    SharedExpense: mongoose.model('SharedExpense', SharedExpenseSchema),
    Settlement: mongoose.model('Settlement', SettlementSchema)
};

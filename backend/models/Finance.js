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
    recurring: { type: String, default: 'One-time' },
    source: { type: String, enum: ['manual','ocr','copilot','import','simulation'], default: 'manual' },
    sourceMeta: { type: mongoose.Schema.Types.Mixed },
    lifeEventId: { type: String, default: '' },
    lifeEventName: { type: String, default: '' },
    contextPath: [{ type: String }], // e.g. ["Amazon", "Mechanical Keyboard", "Gaming Desk", "Semester 5"]
    purchaseMeta: {
        warrantyYears: { type: Number, default: 1 },
        expectedLifespanMonths: { type: Number, default: 36 },
        serialNumber: { type: String, default: '' },
        receiptUrl: { type: String, default: '' },
        depreciationRate: { type: Number, default: 0.2 } // 20% annual
    },
    relatedTransactionIds: [{ type: String }] // For graph relationship
});

// --- Life Event / Chapter Model ---
const LifeEventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, // e.g. "Goa Trip 2026", "Developer Setup"
    category: { type: String, default: 'Lifestyle' }, // Travel, Education, Career, Milestone, Tech
    description: { type: String, default: '' },
    icon: { type: String, default: 'bi-stars' },
    bannerColor: { type: String, default: '#6366F1' },
    startDate: { type: String, required: true },
    endDate: { type: String, default: '' },
    tags: [{ type: String }]
});

// --- Subscription Model ---
const SubscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceName: { type: String, required: true },
    merchantLogo: { type: String, default: '' },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    cost: { type: Number, required: true },
    nextBillingDate: { type: String, required: true },
    usageStatus: { type: String, enum: ['active', 'unused', 'flagged'], default: 'active' },
    category: { type: String, default: 'Software/Subscriptions' }
});

// --- Merchant Intelligence Model ---
const MerchantSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    logoUrl: { type: String, default: '' },
    defaultCategory: { type: String, default: 'General' },
    visitCount: { type: Number, default: 1 },
    totalSpend: { type: Number, default: 0 }
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
    groupId: { type: String, required: true },
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
    LifeEvent: mongoose.model('LifeEvent', LifeEventSchema),
    Subscription: mongoose.model('Subscription', SubscriptionSchema),
    Merchant: mongoose.model('Merchant', MerchantSchema),
    Budget: mongoose.model('Budget', BudgetSchema),
    CreditCard: mongoose.model('CreditCard', CreditCardSchema),
    Emi: mongoose.model('Emi', EmiSchema),
    Friend: mongoose.model('Friend', FriendSchema),
// --- Statement Batch Ingestion Model ---
const StatementSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    bankName: { type: String, default: 'IDFC First Bank' },
    source: { type: String, default: 'statement_upload' },
    importedAt: { type: Date, default: Date.now },
    dateRange: {
        start: { type: String, default: '' },
        end: { type: String, default: '' }
    },
    transactionCount: { type: Number, default: 0 },
    totalDebit: { type: Number, default: 0 },
    totalCredit: { type: Number, default: 0 },
    duplicateCount: { type: Number, default: 0 },
    transactions: [{ type: mongoose.Schema.Types.Mixed }]
});

module.exports = {
    Transaction: mongoose.model('Transaction', TransactionSchema),
    Statement: mongoose.model('Statement', StatementSchema),
    LifeEvent: mongoose.model('LifeEvent', LifeEventSchema),
    Subscription: mongoose.model('Subscription', SubscriptionSchema),
    Merchant: mongoose.model('Merchant', MerchantSchema),
    Budget: mongoose.model('Budget', BudgetSchema),
    CreditCard: mongoose.model('CreditCard', CreditCardSchema),
    Emi: mongoose.model('Emi', EmiSchema),
    Friend: mongoose.model('Friend', FriendSchema),
    Group: mongoose.model('Group', GroupSchema),
    SharedExpense: mongoose.model('SharedExpense', SharedExpenseSchema),
    Settlement: mongoose.model('Settlement', SettlementSchema)
};

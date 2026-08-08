import React, { useState, useEffect, useReducer, useContext, createContext, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from 'recharts';
import './index.css';

// ============================================================
// CONTEXT & STATE MANAGEMENT
// ============================================================
const ExpenseContext = createContext();

const DEFAULT_STATE = {
    theme: 'light',
    currency: '₹',
    apiUrl: (import.meta && import.meta.env && import.meta.env.VITE_API_URL) || 'https://premiumexpenseos-backend.onrender.com',
    token: 'amritansh_session_2026',
    userEmail: 'amritanshanand@idfcfirst.bank',
    transactions: [
        { id: 't_aug_1', desc: 'Blue Dart Express Limited', cleanDesc: 'Logistics shipment with Blue Dart', amount: 1028.00, type: 'expense', category: 'Services', memoryTag: '📦 Courier & Services', icon: 'bi-box-seam-fill', method: 'UPI Payment', date: '2026-08-07', contextPath: ['Blue Dart Express', 'Services'] },
        { id: 't_aug_2', desc: 'Zomato', cleanDesc: 'Food delivery from Zomato', amount: 414.00, type: 'expense', category: 'Dining Out', memoryTag: '🍕 Food & Hangouts', icon: 'bi-egg-fried', method: 'UPI Payment', date: '2026-08-07', contextPath: ['Zomato', 'Dining Out'] },
        { id: 't_aug_3', desc: 'Armaan S/I', cleanDesc: 'UPI Transfer received from Armaan S/I', amount: 200.00, type: 'income', category: 'Digital Payments', memoryTag: '💸 Friends & Settlements', icon: 'bi-arrow-down-left-circle-fill', method: 'UPI Receipt', date: '2026-08-07', contextPath: ['Armaan S/I', 'Income'] },
        { id: 't_aug_4', desc: 'Swiggy Instamart', cleanDesc: 'Quick grocery delivery from Swiggy Instamart', amount: 190.00, type: 'expense', category: 'Groceries', memoryTag: '🛒 Daily Groceries', icon: 'bi-basket2-fill', method: 'UPI Payment', date: '2026-08-06', contextPath: ['Swiggy Instamart', 'Groceries'] },
        { id: 't_aug_5', desc: 'Meenu Bhandari', cleanDesc: 'Dining & cafe bill with Meenu Bhandari', amount: 255.00, type: 'expense', category: 'Dining Out', memoryTag: '🍕 Food & Hangouts', icon: 'bi-egg-fried', method: 'UPI Payment', date: '2026-08-06', contextPath: ['Meenu Bhandari', 'Dining Out'] },
        { id: 't_aug_6', desc: 'Amiman Edutech Pvt Ltd', cleanDesc: 'Tech engineering curriculum course', amount: 539.00, type: 'expense', category: 'Education', memoryTag: '🎓 Semester 5', icon: 'bi-mortarboard-fill', method: 'UPI Payment', date: '2026-08-05', contextPath: ['Amiman Edutech', 'Education'] },
        { id: 't_aug_7', desc: 'Agansel Shopping', cleanDesc: 'Lifestyle apparel & accessories order', amount: 299.00, type: 'expense', category: 'Shopping', memoryTag: '📦 Lifestyle & Living', icon: 'bi-bag-heart-fill', method: 'UPI Payment', date: '2026-08-05', contextPath: ['Agansel', 'Shopping'] },
        { id: 't_aug_8', desc: 'Zomato Limited', cleanDesc: 'Dinner & evening meal from Zomato', amount: 552.00, type: 'expense', category: 'Dining Out', memoryTag: '🍕 Food & Hangouts', icon: 'bi-egg-fried', method: 'UPI Payment', date: '2026-08-05', contextPath: ['Zomato Limited', 'Dining Out'] },
        { id: 't_aug_9', desc: 'Amritansh Anand', cleanDesc: 'UPI Verification micro-transfer', amount: 2.00, type: 'expense', category: 'Digital Payments', memoryTag: '📱 Digital Payments', icon: 'bi-phone', method: 'UPI Payment', date: '2026-08-05', contextPath: ['UPI Verification', 'Digital Payments'] },
        { id: 't_aug_10', desc: 'Spotify India Pvt Ltd', cleanDesc: 'Music streaming subscription from Spotify', amount: 69.00, type: 'expense', category: 'Software/Subscriptions', memoryTag: '🎵 Subscriptions', icon: 'bi-music-note-beamed', method: 'UPI Payment', date: '2026-08-05', contextPath: ['Spotify India', 'Subscriptions'] },
        { id: 't_aug_11', desc: 'Mr Vijay Kumar', cleanDesc: 'Pantry & grocery market restock', amount: 2170.00, type: 'expense', category: 'Groceries', memoryTag: '🛒 Daily Groceries', icon: 'bi-basket2-fill', method: 'UPI Payment', date: '2026-08-04', contextPath: ['Mr Vijay Kumar', 'Groceries'] },
        { id: 't_aug_12', desc: 'Google Play', cleanDesc: 'App & developer cloud pass subscription', amount: 489.00, type: 'expense', category: 'Software/Subscriptions', memoryTag: '📱 Digital Services', icon: 'bi-google', method: 'UPI Payment', date: '2026-08-04', contextPath: ['Google Play', 'Subscriptions'] },
        { id: 't_aug_13', desc: 'YouTube Premium', cleanDesc: 'Video streaming subscription from YouTube', amount: 89.00, type: 'expense', category: 'Software/Subscriptions', memoryTag: '🎵 Subscriptions', icon: 'bi-play-circle-fill', method: 'UPI Payment', date: '2026-08-02', contextPath: ['YouTube', 'Subscriptions'] },
        { id: 't_aug_14', desc: 'Zomato Media Private Limited', cleanDesc: 'Weekend dining order from Zomato', amount: 501.00, type: 'expense', category: 'Dining Out', memoryTag: '🍕 Food & Hangouts', icon: 'bi-egg-fried', method: 'UPI Payment', date: '2026-08-02', contextPath: ['Zomato Media', 'Dining Out'] },
        { id: 't_aug_15', desc: 'Zepto Marketplace', cleanDesc: 'Quick grocery delivery from Zepto', amount: 774.00, type: 'expense', category: 'Groceries', memoryTag: '🛒 Daily Groceries', icon: 'bi-basket2-fill', method: 'UPI Payment', date: '2026-08-02', contextPath: ['Zepto Marketplace', 'Groceries'] },
        { id: 't_aug_16', desc: 'Apple Media Services', cleanDesc: 'App Store credit & refund received', amount: 5.00, type: 'income', category: 'Digital Payments', memoryTag: ' Apple Ecosystem', icon: 'bi-apple', method: 'UPI Receipt', date: '2026-08-02', contextPath: ['Apple Media', 'Income'] },
        { id: 't_aug_17', desc: 'Apple Media Services', cleanDesc: 'iCloud storage monthly backup tier', amount: 5.00, type: 'expense', category: 'Software/Subscriptions', memoryTag: ' Apple Ecosystem', icon: 'bi-apple', method: 'UPI Payment', date: '2026-08-02', contextPath: ['Apple Media Services', 'Subscriptions'] },
        { id: 't_aug_18', desc: 'The Engineering Institute Stationery Store', cleanDesc: 'Stationery purchase for studies', amount: 20.00, type: 'expense', category: 'Education', memoryTag: '🎓 Semester 5', icon: 'bi-mortarboard-fill', method: 'UPI Payment', date: '2026-08-02', contextPath: ['Engineering Institute', 'Education'] },
        { id: 't_aug_19', desc: 'Vivek Anand', cleanDesc: 'UPI Transfer received from Vivek Anand', amount: 1000.00, type: 'income', category: 'Digital Payments', memoryTag: '💸 Family & Support', icon: 'bi-arrow-down-left-circle-fill', method: 'UPI Receipt', date: '2026-08-02', contextPath: ['Vivek Anand', 'Income'] }
    ],
    lifeEvents: [
        { id: 'le_1', name: 'Chandigarh Tech & Engineering Sem', category: 'Education', icon: 'bi-mortarboard-fill', bannerColor: '#3B82F6', startDate: '2026-08-01', endDate: '2026-12-15', tags: ['Engineering', 'Amiman Edutech', 'Tech'] },
        { id: 'le_2', name: 'Digital Creator & Developer Setup', category: 'Tech & Career', icon: 'bi-laptop-fill', bannerColor: '#8B5CF6', startDate: '2026-07-01', endDate: '2026-08-31', tags: ['Spotify', 'YouTube', 'Google Play'] }
    ],
    subscriptions: [
        { id: 'sub_1', serviceName: 'Spotify India Pvt Ltd', cost: 69.00, billingCycle: 'monthly', nextBillingDate: '2026-09-05', usageStatus: 'active', category: 'Entertainment' },
        { id: 'sub_2', serviceName: 'YouTube Premium', cost: 89.00, billingCycle: 'monthly', nextBillingDate: '2026-09-02', usageStatus: 'active', category: 'Entertainment' },
        { id: 'sub_3', serviceName: 'Google Play Pass', cost: 489.00, billingCycle: 'monthly', nextBillingDate: '2026-09-04', usageStatus: 'active', category: 'Software/Subscriptions' }
    ],
    budgets: [
        { id: 'b1', category: 'Groceries', limit: 5000 },
        { id: 'b2', category: 'Dining Out', limit: 4000 },
        { id: 'b3', category: 'Services', limit: 2500 },
        { id: 'b4', category: 'Software/Subscriptions', limit: 1500 },
        { id: 'b5', category: 'Education', limit: 2000 }
    ],
    savingsGoals: [
        { id: 'g1', name: 'IDFC FIRST Reserve (xx6487)', target: 100000, current: 68500 },
        { id: 'g2', name: 'Engineering & Project Fund', target: 50000, current: 32000 }
    ],
    creditCards: [
        { id: 'c1', name: 'Apple Card (Goldman Sachs)', limit: 8000, balance: 1450, dueDate: '2026-07-15' },
        { id: 'c2', name: 'Chase Sapphire Reserve', limit: 15000, balance: 2200, dueDate: '2026-07-25' }
    ],
    emis: [
        { id: 'e1', name: 'MacBook Pro M3 Max 16"', totalAmount: 3200, monthlyPayment: 266, paidTerms: 8, totalTerms: 12, interestRate: 0 },
        { id: 'e2', name: 'Tesla Model Y Financing', totalAmount: 35000, monthlyPayment: 580, paidTerms: 18, totalTerms: 60, interestRate: 4.5 }
    ],
    friends: [
        { id: 'f1', name: 'Sarah Chen', email: 'sarah@example.com' },
        { id: 'f2', name: 'Alex Miller', email: 'alex@example.com' },
        { id: 'f3', name: 'Liam Patel', email: 'liam@example.com' }
    ],
    groups: [
        { id: 'gr1', name: 'Penthouse 4B', members: ['user_0', 'f1', 'f2'], desc: 'Shared residence bills' },
        { id: 'gr2', name: 'Iceland Summer Drive', members: ['user_0', 'f1', 'f2', 'f3'], desc: 'Trip expenses' }
    ],
    sharedExpenses: [
        { id: 'se1', groupId: 'gr1', desc: '1Gbps Fiber Optic WiFi', amount: 90, paidBy: 'user_0', splits: [{ memberId: 'user_0', share: 30 }, { memberId: 'f1', share: 30 }, { memberId: 'f2', share: 30 }], date: '2026-07-01' },
        { id: 'se2', groupId: 'gr1', desc: 'Trader Joe\'s Bulk Pantry', amount: 150, paidBy: 'f1', splits: [{ memberId: 'user_0', share: 50 }, { memberId: 'f1', share: 50 }, { memberId: 'f2', share: 50 }], date: '2026-07-03' },
        { id: 'se3', groupId: 'gr2', desc: 'Lava Field Lodge Rental', amount: 520, paidBy: 'user_0', splits: [{ memberId: 'user_0', share: 130 }, { memberId: 'f1', share: 130 }, { memberId: 'f2', share: 130 }, { memberId: 'f3', share: 130 }], date: '2026-07-04' }
    ],
    settlements: [
        { id: 's1', fromId: 'f2', toId: 'user_0', amount: 50, date: '2026-07-06' }
    ]
};

function expenseReducer(state, action) {
    let newState;
    switch (action.type) {
        case 'SET_THEME':
            newState = { ...state, theme: action.payload };
            break;
        case 'SET_CURRENCY': {
            const oldCurr = state.currency;
            const newCurr = action.payload;
            if (oldCurr === newCurr) {
                newState = state;
                break;
            }

            const RATES = { '$': 1.0, '₹': 83.5, '€': 0.92, '£': 0.79 };
            const oldRate = RATES[oldCurr] || 1.0;
            const newRate = RATES[newCurr] || 1.0;
            const multiplier = newRate / oldRate;

            newState = {
                ...state,
                currency: newCurr,
                transactions: state.transactions.map(t => ({ ...t, amount: Math.round((t.amount * multiplier) * 100) / 100 })),
                subscriptions: state.subscriptions.map(s => ({ ...s, cost: Math.round((s.cost * multiplier) * 100) / 100 })),
                budgets: state.budgets.map(b => ({ ...b, limit: Math.round(b.limit * multiplier) })),
                savingsGoals: state.savingsGoals.map(g => ({ ...g, target: Math.round(g.target * multiplier), current: Math.round(g.current * multiplier) })),
                creditCards: state.creditCards.map(c => ({ ...c, limit: Math.round(c.limit * multiplier), balance: Math.round(c.balance * multiplier) })),
                emis: state.emis.map(e => ({ ...e, totalAmount: Math.round(e.totalAmount * multiplier), monthlyPayment: Math.round(e.monthlyPayment * multiplier) }))
            };
            break;
        }
        case 'SET_API_URL':
            newState = { ...state, apiUrl: action.payload };
            break;
        case 'AUTH_SUCCESS':
            newState = {
                ...state,
                token: action.payload.token,
                userEmail: action.payload.email,
                currency: action.payload.currency || state.currency
            };
            break;
        case 'LOGOUT':
            newState = {
                ...state,
                token: '',
                userEmail: ''
            };
            break;
        case 'SYNC_ALL_DATA':
            newState = { ...state, ...action.payload };
            break;
        case 'ADD_TRANSACTION':
            newState = { ...state, transactions: [action.payload, ...state.transactions] };
            break;
        case 'DELETE_TRANSACTION':
            newState = { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
            break;
        case 'ADD_LIFE_EVENT':
            newState = { ...state, lifeEvents: [action.payload, ...state.lifeEvents] };
            break;
        case 'DELETE_LIFE_EVENT':
            newState = { ...state, lifeEvents: state.lifeEvents.filter(l => l.id !== action.payload) };
            break;
        case 'ADD_SUBSCRIPTION':
            newState = { ...state, subscriptions: [action.payload, ...state.subscriptions] };
            break;
        case 'DELETE_SUBSCRIPTION':
            newState = { ...state, subscriptions: state.subscriptions.filter(s => s.id !== action.payload) };
            break;
        case 'ADD_BUDGET':
            newState = { ...state, budgets: [...state.budgets, action.payload] };
            break;
        case 'DELETE_BUDGET':
            newState = { ...state, budgets: state.budgets.filter(b => b.id !== action.payload) };
            break;
        case 'ADD_GOAL':
            newState = { ...state, savingsGoals: [...state.savingsGoals, action.payload] };
            break;
        case 'UPDATE_GOAL':
            newState = {
                ...state,
                savingsGoals: state.savingsGoals.map(g => g.id === action.payload.id ? { ...g, current: action.payload.current } : g)
            };
            break;
        case 'PAY_CREDIT_CARD':
            newState = {
                ...state,
                creditCards: state.creditCards.map(c => c.id === action.payload.id ? { ...c, balance: Math.max(0, c.balance - action.payload.amount) } : c),
                transactions: [
                    {
                        id: 't_cc_' + Date.now(),
                        desc: `Card Payment: ${action.payload.name}`,
                        amount: action.payload.amount,
                        type: 'expense',
                        category: 'Credit Card Payment',
                        method: 'Bank Transfer',
                        date: new Date().toISOString().split('T')[0],
                        recurring: 'One-time'
                    },
                    ...state.transactions
                ]
            };
            break;
        case 'PAY_EMI':
            newState = {
                ...state,
                emis: state.emis.map(e => e.id === action.payload.id ? { ...e, paidTerms: Math.min(e.totalTerms, e.paidTerms + 1) } : e),
                transactions: [
                    {
                        id: 't_emi_' + Date.now(),
                        desc: `EMI Auto-Debit: ${action.payload.name}`,
                        amount: action.payload.amount,
                        type: 'expense',
                        category: 'EMI Payment',
                        method: 'Bank Transfer',
                        date: new Date().toISOString().split('T')[0],
                        recurring: 'Monthly'
                    },
                    ...state.transactions
                ]
            };
            break;
        case 'ADD_CREDIT_CARD':
            newState = { ...state, creditCards: [...state.creditCards, action.payload] };
            break;
        case 'ADD_EMI':
            newState = { ...state, emis: [...state.emis, action.payload] };
            break;
        case 'ADD_FRIEND':
            newState = { ...state, friends: [...state.friends, action.payload] };
            break;
        case 'DELETE_FRIEND':
            newState = { ...state, friends: state.friends.filter(f => f.id !== action.payload) };
            break;
        case 'ADD_GROUP':
            newState = { ...state, groups: [...state.groups, action.payload] };
            break;
        case 'DELETE_GROUP':
            newState = { ...state, groups: state.groups.filter(g => g.id !== action.payload) };
            break;
        case 'ADD_SHARED_EXPENSE':
            newState = { ...state, sharedExpenses: [...state.sharedExpenses, action.payload] };
            break;
        case 'DELETE_SHARED_EXPENSE':
            newState = { ...state, sharedExpenses: state.sharedExpenses.filter(e => e.id !== action.payload) };
            break;
        case 'ADD_SETTLEMENT':
            newState = { ...state, settlements: [...state.settlements, action.payload] };
            break;
        case 'DELETE_GOAL':
            newState = { ...state, savingsGoals: state.savingsGoals.filter(g => g.id !== action.payload) };
            break;
        case 'DELETE_CREDIT_CARD':
            newState = { ...state, creditCards: state.creditCards.filter(c => c.id !== action.payload) };
            break;
        case 'DELETE_EMI':
            newState = { ...state, emis: state.emis.filter(e => e.id !== action.payload) };
            break;
        case 'RESET_DATA':
            newState = { ...DEFAULT_STATE, theme: state.theme, apiUrl: state.apiUrl };
            break;
        default:
            return state;
    }
    localStorage.setItem('expense_os_state', JSON.stringify(newState));
    return newState;
}

function ExpenseProvider({ children }) {
    const [state, dispatch] = useReducer(expenseReducer, null, () => {
        const local = localStorage.getItem('expense_os_state');
        if (local) {
            try {
                const parsed = JSON.parse(local);
                if (parsed && parsed.apiUrl && parsed.apiUrl.includes('localhost') && !parsed.apiUrl.includes(':3000')) {
                    parsed.apiUrl = 'http://localhost:3000';
                }
                return parsed;
            } catch (e) {
                return DEFAULT_STATE;
            }
        }
        return DEFAULT_STATE;
    });

    useEffect(() => {
        if (state) {
            document.documentElement.setAttribute('data-theme', state.theme || 'light');
        }
    }, [state?.theme]);

    const apiRequest = async (url, options = {}) => {
        if (!state.apiUrl) return null;
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
        const response = await fetch(`${state.apiUrl}${url}`, { ...options, headers });
        if (response.status === 401 && state.token) {
            dispatch({ type: 'LOGOUT' });
            alert('Session expired. Please log in again.');
            throw new Error('Unauthorized');
        }
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || 'API request failed');
        }
        return response.json();
    };

    const splitwiseBalances = useMemo(() => {
        if (!state) return {};
        const balances = { 'user_0': 0 };
        state.friends.forEach(f => { balances[f.id] = 0; });
        state.sharedExpenses.forEach(exp => {
            const payer = exp.paidBy;
            exp.splits.forEach(split => {
                const debtor = split.memberId;
                if (debtor !== payer) {
                    if (balances[debtor] !== undefined) balances[debtor] -= split.share;
                    if (balances[payer] !== undefined) balances[payer] += split.share;
                }
            });
        });
        state.settlements.forEach(set => {
            if (balances[set.fromId] !== undefined) balances[set.fromId] += set.amount;
            if (balances[set.toId] !== undefined) balances[set.toId] -= set.amount;
        });
        return balances;
    }, [state?.friends, state?.sharedExpenses, state?.settlements]);

    // Sync from Cloud on mount or token change
    useEffect(() => {
        const syncFromCloud = async () => {
            if (state?.apiUrl && state?.token && state.token !== 'offline_token') {
                try {
                    const [txs, bdgts, cards, emisList, frnds, grps, exps, setts] = await Promise.all([
                        apiRequest('/api/transactions').catch(() => []),
                        apiRequest('/api/budgets').catch(() => []),
                        apiRequest('/api/credit-cards').catch(() => []),
                        apiRequest('/api/emis').catch(() => []),
                        apiRequest('/api/splitwise/friends').catch(() => []),
                        apiRequest('/api/splitwise/groups').catch(() => []),
                        apiRequest('/api/splitwise/expenses').catch(() => []),
                        apiRequest('/api/splitwise/settlements').catch(() => [])
                    ]);

                    dispatch({
                        type: 'SYNC_ALL_DATA',
                        payload: {
                            transactions: (Array.isArray(txs) && txs.length > 0) ? txs.map(t => ({ ...t, id: t._id || t.id })) : state.transactions,
                            budgets: (Array.isArray(bdgts) && bdgts.length > 0) ? bdgts.map(b => ({ ...b, id: b._id || b.id })) : state.budgets,
                            creditCards: (Array.isArray(cards) && cards.length > 0) ? cards.map(c => ({ ...c, id: c._id || c.id })) : state.creditCards,
                            emis: (Array.isArray(emisList) && emisList.length > 0) ? emisList.map(e => ({ ...e, id: e._id || e.id })) : state.emis,
                            friends: (Array.isArray(frnds) && frnds.length > 0) ? frnds.map(f => ({ ...f, id: f._id || f.id })) : state.friends,
                            groups: (Array.isArray(grps) && grps.length > 0) ? grps.map(g => ({ ...g, id: g._id || g.id })) : state.groups,
                            sharedExpenses: (Array.isArray(exps) && exps.length > 0) ? exps.map(x => ({ ...x, id: x._id || x.id })) : state.sharedExpenses,
                            settlements: (Array.isArray(setts) && setts.length > 0) ? setts.map(s => ({ ...s, id: s._id || s.id })) : state.settlements
                        }
                    });
                } catch (err) {
                    console.error('Failed to sync data from backend:', err);
                }
            }
        };

        syncFromCloud();
    }, [state?.apiUrl, state?.token]);

    return (
        <ExpenseContext.Provider value={{ state, dispatch, splitwiseBalances, apiRequest }}>
            {children}
        </ExpenseContext.Provider>
    );
}

// ============================================================
// TOP BAR & NAVIGATION
// ============================================================
function TopBar({ onOpenCmd, activeTab, setActiveTab }) {
    const { state, dispatch } = useContext(ExpenseContext);
    const [currentTime, setCurrentTime] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: '⚡ Apple Card Due', body: `Payment of ${state.currency}1,450 due in 11 days.` },
        { id: 2, title: '✨ AI Weekly Audit Ready', body: 'You saved 18% more on dining this week!' }
    ]);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        updateTime();
        const timer = setInterval(updateTime, 10000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="topbar">
            <div className="topbar-search">
                <button className="topbar-search-btn" onClick={onOpenCmd}>
                    <i className="bi bi-search"></i>
                    <span>Search transactions, bills, or launch AI...</span>
                    <kbd className="topbar-search-kbd">⌘K</kbd>
                </button>
            </div>

            <div className="topbar-actions">
                <div className="topbar-meta">
                    <span className="topbar-time">{currentTime}</span>
                    <div className="topbar-status" title="Synced with ExpenseOS Cloud Engine">
                        <span className="status-dot"></span>
                        <span>Live</span>
                    </div>
                </div>

                {/* Currency Switcher */}
                <button
                    className="icon-btn"
                    title="Toggle Currency"
                    onClick={() => {
                        const currencies = ['$', '₹', '€', '£'];
                        const nextIndex = (currencies.indexOf(state.currency) + 1) % currencies.length;
                        dispatch({ type: 'SET_CURRENCY', payload: currencies[nextIndex] });
                    }}
                >
                    <span style={{ fontWeight: 700 }}>{state.currency}</span>
                </button>

                {/* Theme Toggle */}
                <button
                    className="icon-btn"
                    title="Toggle Theme"
                    onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' })}
                >
                    <i className={`bi bi-${state.theme === 'dark' ? 'sun-fill' : 'moon-stars-fill'}`}></i>
                </button>

                {/* Notifications Bell */}
                <div style={{ position: 'relative' }}>
                    <button
                        className="icon-btn"
                        onClick={() => setShowNotifications(!showNotifications)}
                        title="Notifications"
                    >
                        <i className="bi bi-bell-fill"></i>
                        {notifications.length > 0 && (
                            <span className="nav-badge" style={{ position: 'absolute', top: -2, right: -2 }}>
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                style={{
                                    position: 'absolute', right: 0, top: 48, width: 300,
                                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)',
                                    padding: 'var(--space-4)', zIndex: 300
                                }}
                            >
                                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Notifications</span>
                                    {notifications.length > 0 && (
                                        <span
                                            style={{ fontSize: 11, color: 'var(--accent)', cursor: 'pointer' }}
                                            onClick={() => setNotifications([])}
                                        >
                                            Mark all read
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: 8, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                                            All notifications cleared ✨
                                        </div>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} style={{ padding: 8, borderRadius: 8, background: 'var(--bg-subtle)', fontSize: 12 }}>
                                                <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{n.title}</strong>
                                                <span style={{ color: 'var(--text-muted)' }}>{n.body}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}

function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
    const { state, dispatch } = useContext(ExpenseContext);

    const navItems = [
        { id: 'timeline', label: 'Memory Timeline', icon: 'bi-journal-bookmark-fill' },
        { id: 'memory_search', label: 'AI Natural Search', icon: 'bi-stars' },
        { id: 'subscriptions', label: 'Subscriptions Audit', icon: 'bi-arrow-repeat' },
        { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
        { id: 'transactions', label: 'Ledger & Receipts', icon: 'bi-receipt-cutoff' },
        { id: 'budgets', label: 'Budgets & Goals', icon: 'bi-piggy-bank-fill' },
        { id: 'splitwise', label: 'Splitwise Engine', icon: 'bi-people-fill' },
        { id: 'calculators', label: 'Calculators', icon: 'bi-calculator-fill' },
        { id: 'settings', label: 'System Settings', icon: 'bi-gear-wide-connected' }
    ];

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-brand" onClick={() => setCollapsed(!collapsed)}>
                <div className="brand-icon">
                    <i className="bi bi-command"></i>
                </div>
                {!collapsed && <span className="brand-text">ExpenseOS</span>}
            </div>

            <div className="nav-section">
                {!collapsed && <div className="nav-label">Core Workspace</div>}
                {navItems.map(item => (
                    <div key={item.id} className="nav-item">
                        <button
                            className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                            title={collapsed ? item.label : ''}
                        >
                            <i className={`bi ${item.icon}`}></i>
                            {!collapsed && <span>{item.label}</span>}
                        </button>
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                {!collapsed && (
                    <div className="user-card">
                        <div className="user-avatar">
                            {state.userEmail ? state.userEmail.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="user-name">{state.userEmail || 'Pro Member'}</div>
                            <div className="user-role">Enterprise Account</div>
                        </div>
                    </div>
                )}

                <button
                    className="sidebar-action-btn"
                    onClick={() => setCollapsed(!collapsed)}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <i className={`bi bi-layout-sidebar-${collapsed ? 'reverse' : 'inset'}`}></i>
                    {!collapsed && <span>Collapse Sidebar</span>}
                </button>

                {state.userEmail && (
                    <button
                        className="sidebar-action-btn danger"
                        onClick={() => dispatch({ type: 'LOGOUT' })}
                    >
                        <i className="bi bi-box-arrow-right"></i>
                        {!collapsed && <span>Sign Out</span>}
                    </button>
                )}
            </div>
        </aside>
    );
}

// ============================================================
// COMMAND PALETTE (Cmd+K)
// ============================================================
function CommandPalette({ isOpen, onClose, setActiveTab }) {
    const [query, setQuery] = useState('');
    const { state } = useContext(ExpenseContext);

    if (!isOpen) return null;

    const commands = [
        { label: 'Go to Dashboard', icon: 'bi-grid-1x2-fill', action: () => setActiveTab('dashboard') },
        { label: 'View Ledger & Transactions', icon: 'bi-receipt-cutoff', action: () => setActiveTab('transactions') },
        { label: 'Manage Budgets & Goals', icon: 'bi-piggy-bank-fill', action: () => setActiveTab('budgets') },
        { label: 'Open Splitwise Engine', icon: 'bi-people-fill', action: () => setActiveTab('splitwise') },
        { label: 'Open Financial Calculators', icon: 'bi-calculator-fill', action: () => setActiveTab('calculators') },
        { label: 'System Settings', icon: 'bi-gear-wide-connected', action: () => setActiveTab('settings') }
    ];

    const filteredTx = state.transactions.filter(t =>
        t.desc.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="cmd-overlay" onClick={onClose}>
            <motion.div
                className="cmd-palette"
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
            >
                <div className="cmd-input-wrap">
                    <i className="bi bi-search"></i>
                    <input
                        className="cmd-input"
                        placeholder="Type a command or search transactions..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        autoFocus
                    />
                    <kbd className="cmd-kbd">ESC</kbd>
                </div>

                <div className="cmd-list">
                    {query === '' && (
                        <>
                            <div className="cmd-group-label">Quick Navigation</div>
                            {commands.map((cmd, idx) => (
                                <div
                                    key={idx}
                                    className="cmd-item"
                                    onClick={() => { cmd.action(); onClose(); }}
                                >
                                    <i className={`bi ${cmd.icon}`}></i>
                                    <span>{cmd.label}</span>
                                </div>
                            ))}
                        </>
                    )}

                    {query !== '' && (
                        <>
                            <div className="cmd-group-label">Matching Transactions</div>
                            {filteredTx.length === 0 ? (
                                <div style={{ padding: 14, color: 'var(--text-muted)', fontSize: 13 }}>No results found</div>
                            ) : (
                                filteredTx.map(t => (
                                    <div
                                        key={t.id}
                                        className="cmd-item"
                                        onClick={() => { setActiveTab('transactions'); onClose(); }}
                                    >
                                        <i className="bi bi-arrow-right-short"></i>
                                        <div style={{ flex: 1 }}>
                                            <strong>{t.desc}</strong>
                                            <span style={{ color: 'var(--text-muted)', marginLeft: 8, fontSize: 12 }}>{t.category}</span>
                                        </div>
                                        <span className="mono" style={{ fontWeight: 700 }}>{state.currency}{t.amount}</span>
                                    </div>
                                ))
                            )}
                        </>
                    )}
                </div>

                <div className="cmd-footer">
                    <span>Navigation Shortcuts:</span>
                    <span><kbd className="cmd-kbd">↑↓</kbd> navigate</span>
                    <span><kbd className="cmd-kbd">↵</kbd> select</span>
                </div>
            </motion.div>
        </div>
    );
}

// ============================================================
// AI CHAT DOCK
// ============================================================
function AIChatDock() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputMsg, setInputMsg] = useState('');
    const { state } = useContext(ExpenseContext);
    const [messages, setMessages] = useState([
        { sender: 'assistant', text: `Greetings! I'm ExpenseOS AI. How can I optimize your financial strategy today?` }
    ]);

    const handleSend = (textToSend) => {
        const queryText = textToSend || inputMsg;
        if (!queryText.trim()) return;

        const newMsgs = [...messages, { sender: 'user', text: queryText }];
        setMessages(newMsgs);
        if (!textToSend) setInputMsg('');

        setTimeout(() => {
            let aiReply = "I've analyzed your cash flow trends. Your current savings rate is 32.5%, which is in the top 10% percentile for disciplined budgeting.";
            const qLower = queryText.toLowerCase();

            if (qLower.includes('burn') || qLower.includes('spend')) {
                aiReply = `Based on your recent transactions, your monthly burn rate is approximately ${state.currency}1,480. Housing and subscriptions account for 68% of this expenditure.`;
            } else if (qLower.includes('save') || qLower.includes('invest')) {
                aiReply = `Recommendation: Shift ${state.currency}300 from your liquid checking to your Japan Expedition savings goal to hit target 2 months earlier.`;
            } else if (qLower.includes('subscription')) {
                aiReply = `You have 3 active subscriptions totaling ${state.currency}110.90/mo: AWS Cloud (${state.currency}45), Equinox (${state.currency}150), and Apple One (${state.currency}32.95).`;
            }

            setMessages(prev => [...prev, { sender: 'assistant', text: aiReply }]);
        }, 600);
    };

    return (
        <>
            <button className="ai-fab" onClick={() => setIsOpen(!isOpen)} title="ExpenseOS AI Advisor">
                <i className={`bi bi-${isOpen ? 'x-lg' : 'cpu-fill'}`}></i>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="ai-chat-panel"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    >
                        <div className="ai-chat-header">
                            <div className="ai-avatar">
                                <i className="bi bi-robot"></i>
                            </div>
                            <div>
                                <div className="ai-chat-title">ExpenseOS AI Engine</div>
                                <div className="ai-chat-sub">GPT-4o Financial Strategist</div>
                            </div>
                        </div>

                        <div className="ai-chat-body">
                            {messages.map((m, i) => (
                                <div key={i} className={`ai-msg ${m.sender}`}>
                                    {m.text}
                                </div>
                            ))}
                        </div>

                        <div className="ai-prompts">
                            <button className="ai-prompt-chip" onClick={() => handleSend("What is my monthly burn rate?")}>
                                🔥 Monthly Burn Rate
                            </button>
                            <button className="ai-prompt-chip" onClick={() => handleSend("Analyze my active subscriptions")}>
                                📦 Subscriptions Audit
                            </button>
                        </div>

                        <div className="ai-chat-input-row">
                            <input
                                className="ai-chat-input"
                                placeholder="Ask AI assistant..."
                                value={inputMsg}
                                onChange={e => setInputMsg(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                            />
                            <button className="btn btn-primary btn-sm" onClick={() => handleSend()}>
                                <i className="bi bi-send-fill"></i>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// ============================================================
// DASHBOARD VIEW
// ============================================================
function DashboardView({ setActiveTab }) {
    const { state, dispatch, splitwiseBalances } = useContext(ExpenseContext);
    const [timeframe, setTimeframe] = useState('6M');

    // Calculated stats
    const totalIncome = useMemo(() => {
        return state.transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);
    }, [state.transactions]);

    const totalExpense = useMemo(() => {
        return state.transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);
    }, [state.transactions]);

    const netWorth = 84250 + (totalIncome - totalExpense);
    const splitwiseNet = splitwiseBalances['user_0'] || 0;

    // Recharts Data
    const chartData = [
        { month: 'Jan', Income: 4500, Expense: 2800 },
        { month: 'Feb', Income: 4800, Expense: 3100 },
        { month: 'Mar', Income: 5100, Expense: 2900 },
        { month: 'Apr', Income: 5300, Expense: 3400 },
        { month: 'May', Income: 4900, Expense: 3000 },
        { month: 'Jun', Income: 5800, Expense: 3200 },
        { month: 'Jul', Income: totalIncome, Expense: totalExpense }
    ];

    const categoryData = useMemo(() => {
        const map = {};
        state.transactions.forEach(t => {
            if (t.type === 'expense') {
                map[t.category] = (map[t.category] || 0) + t.amount;
            }
        });
        return Object.keys(map).map(cat => ({ name: cat, value: map[cat] }));
    }, [state.transactions]);

    const PIE_COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#14b8a6'];

    return (
        <div className="animate-slide-up">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Financial Operating System</h1>
                    <p className="page-subtitle">Executive Overview & Capital Intelligence</p>
                </div>
                <div className="page-actions">
                    <button className="btn btn-secondary" onClick={() => setActiveTab('transactions')}>
                        <i className="bi bi-plus-lg"></i> Add Entry
                    </button>
                    <button className="btn btn-primary" onClick={() => setActiveTab('calculators')}>
                        <i className="bi bi-lightning-charge-fill"></i> Simulate Wealth
                    </button>
                </div>
            </div>

            {/* KPI GRID (8 Luxury Cards) */}
            <div className="kpi-grid">
                <div className="kpi-card kpi-net">
                    <div className="kpi-card-top">
                        <span className="kpi-label">Liquid Net Worth</span>
                        <div className="kpi-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                            <i className="bi bi-bank2"></i>
                        </div>
                    </div>
                    <div className="kpi-value">{state.currency}{netWorth.toLocaleString()}</div>
                    <div className="kpi-trend up">
                        <i className="bi bi-arrow-up-right"></i> +12.4% vs last month
                    </div>
                </div>

                <div className="kpi-card kpi-income">
                    <div className="kpi-card-top">
                        <span className="kpi-label">July Income</span>
                        <div className="kpi-icon" style={{ background: 'var(--success-light)', color: 'var(--success-text)' }}>
                            <i className="bi bi-graph-up-arrow"></i>
                        </div>
                    </div>
                    <div className="kpi-value">{state.currency}{totalIncome.toLocaleString()}</div>
                    <div className="kpi-trend up">
                        <i className="bi bi-arrow-up-right"></i> +8.1% target reached
                    </div>
                </div>

                <div className="kpi-card kpi-expense">
                    <div className="kpi-card-top">
                        <span className="kpi-label">July Outflow</span>
                        <div className="kpi-icon" style={{ background: 'var(--danger-light)', color: 'var(--danger-text)' }}>
                            <i className="bi bi-graph-down-arrow"></i>
                        </div>
                    </div>
                    <div className="kpi-value">{state.currency}{totalExpense.toLocaleString()}</div>
                    <div className="kpi-trend neutral">
                        <i className="bi bi-dash"></i> Within 15% budget
                    </div>
                </div>

                <div className="kpi-card kpi-split">
                    <div className="kpi-card-top">
                        <span className="kpi-label">Splitwise Net</span>
                        <div className="kpi-icon" style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}>
                            <i className="bi bi-people"></i>
                        </div>
                    </div>
                    <div className={`kpi-value ${splitwiseNet >= 0 ? 'text-success' : 'text-danger'}`}>
                        {splitwiseNet >= 0 ? '+' : ''}{state.currency}{Math.abs(splitwiseNet).toLocaleString()}
                    </div>
                    <div className="kpi-trend neutral">
                        {splitwiseNet >= 0 ? 'You are owed money' : 'You owe group members'}
                    </div>
                </div>
            </div>

            {/* DASHBOARD MAIN GRID */}
            <div className="dashboard-grid">
                {/* Main Cash Flow Chart Card */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-activity"></i> Cash Flow & Growth Timeline
                        </div>
                        <div className="card-actions">
                            {['1M', '6M', '1Y'].map(tf => (
                                <button
                                    key={tf}
                                    className={`btn btn-sm ${timeframe === tf ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setTimeframe(tf)}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ width: '100%', height: 280 }}>
                        <ResponsiveContainer>
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                                <Tooltip content={<CustomTooltip currency={state.currency} />} />
                                <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#incGrad)" />
                                <Area type="monotone" dataKey="Expense" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#expGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Category Chart */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-pie-chart-fill"></i> Spending Mix
                        </div>
                    </div>

                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(val) => `${state.currency}${val}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                        {categoryData.slice(0, 3).map((c, i) => (
                            <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                                    {c.name}
                                </span>
                                <strong>{state.currency}{c.value}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECONDARY ROW: Recent Ledger & Heatmap */}
            <div className="dashboard-grid-2">
                {/* Recent Entries */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-clock-history"></i> Recent Transactions
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('transactions')}>
                            View All <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>

                    <div className="tx-list">
                        {state.transactions.slice(0, 4).map(t => (
                            <div key={t.id} className="tx-row" onClick={() => setActiveTab('transactions')}>
                                <div className={`tx-icon ${t.type}`}>
                                    <i className={`bi bi-${t.type === 'income' ? 'arrow-down-left' : 'bag-check-fill'}`}></i>
                                </div>
                                <div className="tx-info">
                                    <div className="tx-desc">{t.desc}</div>
                                    <div className="tx-meta-row">
                                        <span className="tx-date">{t.date}</span>
                                        <span className="tx-pill">{t.category}</span>
                                    </div>
                                </div>
                                <div className={`tx-amount ${t.type}`}>
                                    {t.type === 'income' ? '+' : '-'}{state.currency}{t.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Savings Heatmap & Upcoming */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-calendar3"></i> Daily Activity Heatmap
                        </div>
                    </div>

                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                        Track daily expenditure intensity across July 2026.
                    </p>

                    <div className="heatmap-grid">
                        {Array.from({ length: 31 }).map((_, i) => {
                            const level = (i % 5 === 0) ? 'l3' : (i % 3 === 0) ? 'l1' : (i % 7 === 0) ? 'l-high' : 'l0';
                            return <div key={i} className={`heatmap-cell ${level}`} title={`July ${i + 1}`} />;
                        })}
                    </div>

                    <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Upcoming Payments</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {state.creditCards.map(cc => (
                                <div key={cc.id} className="bill-card">
                                    <div className="bill-dot" style={{ background: 'var(--danger)' }}></div>
                                    <div className="bill-meta">
                                        <div className="bill-name">{cc.name}</div>
                                        <div className="bill-date">Due {cc.dueDate}</div>
                                    </div>
                                    <div className="bill-amount">{state.currency}{cc.balance}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload, label, currency }) {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <div className="custom-tooltip-label">{label} 2026</div>
                {payload.map((pld, idx) => (
                    <div key={idx} className="custom-tooltip-val" style={{ color: pld.color }}>
                        {pld.name}: {currency}{pld.value}
                    </div>
                ))}
            </div>
        );
    }
    return null;
}

// ============================================================
// CATEGORY VISUAL TOKENS & METADATA
// ============================================================
const CATEGORY_META = {
    'Education': { color: '#10B981', gradient: 'linear-gradient(135deg, #10B981, #059669)', icon: 'bi-mortarboard-fill' },
    'Dining Out': { color: '#F97316', gradient: 'linear-gradient(135deg, #FB923C, #EA580C)', icon: 'bi-egg-fried' },
    'Food & Dining': { color: '#F97316', gradient: 'linear-gradient(135deg, #FB923C, #EA580C)', icon: 'bi-egg-fried' },
    'Groceries': { color: '#F59E0B', gradient: 'linear-gradient(135deg, #FBBF24, #D97706)', icon: 'bi-basket2-fill' },
    'Software/Subscriptions': { color: '#8B5CF6', gradient: 'linear-gradient(135deg, #A78BFA, #7C3AED)', icon: 'bi-music-note-beamed' },
    'Services': { color: '#6366F1', gradient: 'linear-gradient(135deg, #818CF8, #4F46E5)', icon: 'bi-box-seam-fill' },
    'Travel': { color: '#0EA5E9', gradient: 'linear-gradient(135deg, #38BDF8, #0284C7)', icon: 'bi-airplane-fill' },
    'Transport': { color: '#06B6D4', gradient: 'linear-gradient(135deg, #22D3EE, #0891B2)', icon: 'bi-car-front-fill' },
    'Shopping': { color: '#EC4899', gradient: 'linear-gradient(135deg, #F472B6, #DB2777)', icon: 'bi-bag-heart-fill' },
    'Digital Payments': { color: '#10B981', gradient: 'linear-gradient(135deg, #34D399, #059669)', icon: 'bi-arrow-down-left-circle-fill' },
    'Income': { color: '#10B981', gradient: 'linear-gradient(135deg, #34D399, #059669)', icon: 'bi-arrow-down-left-circle-fill' },
    'EMIs & Repayments': { color: '#F43F5E', gradient: 'linear-gradient(135deg, #FB7185, #E11D48)', icon: 'bi-credit-card-2-front-fill' }
};

function getCategoryMeta(cat) {
    return CATEGORY_META[cat] || {
        color: '#6366F1',
        gradient: 'linear-gradient(135deg, #818CF8, #4F46E5)',
        icon: 'bi-stars'
    };
}

// ============================================================
// TRANSACTIONS (LEDGER) VIEW & RECEIPT DRAWER
// ============================================================
function TransactionsView() {
    const { state, dispatch, apiRequest } = useContext(ExpenseContext);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedTx, setSelectedTx] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    // New transaction form
    const [newDesc, setNewDesc] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [newType, setNewType] = useState('expense');
    const [newCat, setNewCat] = useState('Groceries');
    const [newMethod, setNewMethod] = useState('Credit Card');

    const categories = ['All', 'Education', 'Dining Out', 'Groceries', 'Software/Subscriptions', 'Services', 'Shopping', 'Travel', 'Digital Payments', 'EMIs & Repayments'];

    const filtered = state.transactions.filter(t => {
        const matchesSearch = (t.desc || '').toLowerCase().includes(search.toLowerCase()) ||
                              (t.cleanDesc || '').toLowerCase().includes(search.toLowerCase()) ||
                              (t.memoryTag || '').toLowerCase().includes(search.toLowerCase());
        const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
        return matchesSearch && matchesCat;
    });

    const handleAddTx = async (e) => {
        e.preventDefault();
        if (!newDesc || !newAmount) return;
        const entry = {
            id: 't_' + Date.now(),
            desc: newDesc,
            amount: parseFloat(newAmount),
            type: newType,
            category: newCat,
            method: newMethod,
            date: new Date().toISOString().split('T')[0],
            recurring: 'One-time'
        };

        if (state.token && state.token !== 'offline_token') {
            try {
                const saved = await apiRequest('/api/transactions', {
                    method: 'POST',
                    body: JSON.stringify(entry)
                });
                if (saved && (saved._id || saved.id)) {
                    entry.id = saved._id || saved.id;
                }
            } catch (err) {
                console.error('Backend transaction save failed:', err);
            }
        }

        dispatch({ type: 'ADD_TRANSACTION', payload: entry });
        setShowAddModal(false);
        setNewDesc('');
        setNewAmount('');
    };

    const handleDeleteTx = async (id) => {
        if (state.token && state.token !== 'offline_token') {
            try {
                await apiRequest(`/api/transactions/${id}`, { method: 'DELETE' });
            } catch (err) {
                console.error('Backend transaction delete failed:', err);
            }
        }
        dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    };

    return (
        <div className="animate-slide-up">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Ledger & Receipts</h1>
                    <p className="page-subtitle">Apple Wallet & Linear Financial Memory Ledger</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary" onClick={() => setShowImportModal(true)}>
                        <i className="bi bi-file-earmark-arrow-up-fill"></i> Import Statement
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                        <i className="bi bi-plus-lg"></i> Record Entry
                    </button>
                </div>
            </div>

            <div className="ledger-container">
                <div className="ledger-toolbar">
                    <div className="search-box">
                        <i className="bi bi-search"></i>
                        <input
                            className="search-input"
                            placeholder="Search by merchant, note, or memory tag..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="tx-list" style={{ padding: 'var(--space-4)' }}>
                    {filtered.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                            <i className="bi bi-inbox" style={{ fontSize: 32, display: 'block', marginBottom: 8 }}></i>
                            No transactions found matching your filter.
                        </div>
                    ) : (
                        filtered.map(t => {
                            const meta = getCategoryMeta(t.category);
                            return (
                                <div key={t.id} className="tx-row" onClick={() => setSelectedTx(t)}>
                                    <div className={`tx-icon ${t.type}`} style={{ background: meta.gradient }}>
                                        <i className={`bi ${t.icon || meta.icon}`}></i>
                                    </div>
                                    <div className="tx-info">
                                        <div className="tx-desc-line">
                                            <span className="tx-merchant" title={t.desc}>{t.desc}</span>
                                            {t.cleanDesc && t.cleanDesc !== t.desc && (
                                                <span className="tx-clean-desc"> • {t.cleanDesc}</span>
                                            )}
                                        </div>
                                        <div className="tx-meta-row">
                                            <span className="tx-date">{t.date}</span>
                                            <span className="tx-pill" style={{ borderColor: meta.color, color: meta.color }}>
                                                {t.category}
                                            </span>
                                            {t.memoryTag && (
                                                <span className="memory-chip-pill">
                                                    {t.memoryTag}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`tx-amount-col ${t.type}`}>
                                        <span className="tx-amount-val">
                                            {t.type === 'income' ? '+' : '-'}{state.currency}{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="tx-actions">
                                        <button
                                            className="icon-btn-subtle"
                                            title="Inspect Digital Receipt"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedTx(t);
                                            }}
                                        >
                                            <i className="bi bi-receipt"></i>
                                        </button>
                                        <button
                                            className="icon-btn-subtle text-danger"
                                            title="Delete entry"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTx(t.id);
                                            }}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {showImportModal && <StatementImportModal onClose={() => setShowImportModal(false)} />}

            {/* DETAIL DRAWER / MODAL */}
            <AnimatePresence>
                {selectedTx && (
                    <div className="modal-overlay" onClick={() => setSelectedTx(null)}>
                        <motion.div
                            className="modal"
                            onClick={e => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <div className="modal-header">
                                <div className="modal-title">Transaction Details</div>
                                <button className="modal-close" onClick={() => setSelectedTx(null)}>
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                    <div style={{ fontSize: 36, fontWeight: 800, color: selectedTx.type === 'income' ? 'var(--success-text)' : 'var(--text-primary)' }}>
                                        {selectedTx.type === 'income' ? '+' : '-'}{state.currency}{selectedTx.amount}
                                    </div>
                                    <div style={{ fontSize: 16, fontWeight: 600 }}>{selectedTx.desc}</div>
                                    <span className="badge badge-accent" style={{ marginTop: 8 }}>{selectedTx.category}</span>
                                </div>

                                <div className="card-glass" style={{ padding: 16, borderRadius: 12, marginBottom: 16 }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>DIGITAL RECEIPT OCR</div>
                                    <div style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        MERCHANT: {selectedTx.desc.toUpperCase()}<br />
                                        DATE: {selectedTx.date}<br />
                                        PAYMENT METHOD: {selectedTx.method}<br />
                                        STATUS: SETTLED & VERIFIED<br />
                                        AUTH CODE: #{Math.floor(100000 + Math.random() * 900000)}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setSelectedTx(null)}>Close</button>
                                <button className="btn btn-danger" onClick={() => {
                                    handleDeleteTx(selectedTx.id);
                                    setSelectedTx(null);
                                }}>
                                    Delete Entry
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ADD TRANSACTION MODAL */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                        <motion.div
                            className="modal"
                            onClick={e => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <div className="modal-header">
                                <div className="modal-title">Record Financial Entry</div>
                                <button className="modal-close" onClick={() => setShowAddModal(false)}>
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <form onSubmit={handleAddTx}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Entry Description</label>
                                        <input
                                            className="form-control"
                                            placeholder="e.g. Apple Store Purchase"
                                            value={newDesc}
                                            onChange={e => setNewDesc(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Amount ({state.currency})</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control"
                                                placeholder="0.00"
                                                value={newAmount}
                                                onChange={e => setNewAmount(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Type</label>
                                            <select className="form-control" value={newType} onChange={e => setNewType(e.target.value)}>
                                                <option value="expense">Expense</option>
                                                <option value="income">Income</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Category</label>
                                            <select className="form-control" value={newCat} onChange={e => setNewCat(e.target.value)}>
                                                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Payment Method</label>
                                            <select className="form-control" value={newMethod} onChange={e => setNewMethod(e.target.value)}>
                                                <option value="Credit Card">Credit Card</option>
                                                <option value="Debit Card">Debit Card</option>
                                                <option value="Bank Transfer">Bank Transfer</option>
                                                <option value="PayPal">PayPal</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save Entry</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================================
// BUDGETS & GOALS VIEW
// ============================================================
function BudgetsView() {
    const { state, dispatch, apiRequest } = useContext(ExpenseContext);

    // Modal States
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [showEmiModal, setShowEmiModal] = useState(false);

    // Form inputs
    const [bCat, setBCat] = useState('Groceries');
    const [bLimit, setBLimit] = useState('');

    const [gName, setGName] = useState('');
    const [gTarget, setGTarget] = useState('');
    const [gCurrent, setGCurrent] = useState('');

    const [cName, setCName] = useState('');
    const [cLimit, setCLimit] = useState('');
    const [cBalance, setCBalance] = useState('');
    const [cDueDate, setCDueDate] = useState('2026-08-15');

    const [eName, setEName] = useState('');
    const [eTotal, setETotal] = useState('');
    const [eMonthly, setEMonthly] = useState('');
    const [eTerms, setETerms] = useState('12');

    const categories = ['Groceries', 'Dining Out', 'Software/Subscriptions', 'Transport', 'Rent & Housing', 'Health', 'Shopping', 'Travel'];

    const handleAddBudget = async (e) => {
        e.preventDefault();
        if (!bLimit) return;
        const entry = { id: 'b_' + Date.now(), category: bCat, limit: parseFloat(bLimit) };
        if (state.token && state.token !== 'offline_token') {
            try {
                const saved = await apiRequest('/api/budgets', { method: 'POST', body: JSON.stringify({ category: bCat, limit: parseFloat(bLimit) }) });
                if (saved && (saved._id || saved.id)) entry.id = saved._id || saved.id;
            } catch (err) { console.error('Budget save error:', err); }
        }
        dispatch({ type: 'ADD_BUDGET', payload: entry });
        setShowBudgetModal(false); setBLimit('');
    };

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!gName || !gTarget) return;
        const entry = { id: 'g_' + Date.now(), name: gName, target: parseFloat(gTarget), current: parseFloat(gCurrent || 0) };
        dispatch({ type: 'ADD_GOAL', payload: entry });
        setShowGoalModal(false); setGName(''); setGTarget(''); setGCurrent('');
    };

    const handleAddCard = async (e) => {
        e.preventDefault();
        if (!cName || !cLimit) return;
        const entry = { id: 'c_' + Date.now(), name: cName, limit: parseFloat(cLimit), balance: parseFloat(cBalance || 0), dueDate: cDueDate };
        if (state.token && state.token !== 'offline_token') {
            try {
                const saved = await apiRequest('/api/credit-cards', { method: 'POST', body: JSON.stringify(entry) });
                if (saved && (saved._id || saved.id)) entry.id = saved._id || saved.id;
            } catch (err) { console.error('Credit card save error:', err); }
        }
        dispatch({ type: 'ADD_CREDIT_CARD', payload: entry });
        setShowCardModal(false); setCName(''); setCLimit(''); setCBalance('');
    };

    const handleAddEmi = async (e) => {
        e.preventDefault();
        if (!eName || !eTotal || !eMonthly) return;
        const entry = { id: 'e_' + Date.now(), name: eName, totalAmount: parseFloat(eTotal), monthlyPayment: parseFloat(eMonthly), paidTerms: 0, totalTerms: parseInt(eTerms), interestRate: 0 };
        if (state.token && state.token !== 'offline_token') {
            try {
                const saved = await apiRequest('/api/emis', { method: 'POST', body: JSON.stringify(entry) });
                if (saved && (saved._id || saved.id)) entry.id = saved._id || saved.id;
            } catch (err) { console.error('EMI save error:', err); }
        }
        dispatch({ type: 'ADD_EMI', payload: entry });
        setShowEmiModal(false); setEName(''); setETotal(''); setEMonthly('');
    };

    const handleDeleteBudget = async (id) => {
        if (state.token && state.token !== 'offline_token') {
            try {
                await apiRequest(`/api/budgets/${id}`, { method: 'DELETE' });
            } catch (err) { console.error('Budget delete error:', err); }
        }
        dispatch({ type: 'DELETE_BUDGET', payload: id });
    };

    const handleDeleteGoal = (id) => {
        dispatch({ type: 'DELETE_GOAL', payload: id });
    };

    const handleDeleteCard = (id) => {
        dispatch({ type: 'DELETE_CREDIT_CARD', payload: id });
    };

    const handleDeleteEmi = (id) => {
        dispatch({ type: 'DELETE_EMI', payload: id });
    };

    return (
        <div className="animate-slide-up">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Budgets & Savings Goals</h1>
                    <p className="page-subtitle">Limits, Milestones & Debt Amortization</p>
                </div>
                <div className="page-actions" style={{ flexWrap: 'wrap' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowBudgetModal(true)}>
                        <i className="bi bi-plus-lg"></i> Budget Cap
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowGoalModal(true)}>
                        <i className="bi bi-plus-lg"></i> Savings Goal
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowCardModal(true)}>
                        <i className="bi bi-plus-lg"></i> Credit Card
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowEmiModal(true)}>
                        <i className="bi bi-plus-lg"></i> Financing EMI
                    </button>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Category Budgets */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-sliders"></i> Category Spending Caps
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => setShowBudgetModal(true)}>
                            + Add Cap
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {state.budgets.length === 0 ? (
                            <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                                No budget caps set. Click "+ Budget Cap" to set a limit!
                            </div>
                        ) : (
                            state.budgets.map(b => {
                                const spent = state.transactions
                                    .filter(t => t.category === b.category && t.type === 'expense')
                                    .reduce((acc, t) => acc + t.amount, 0);
                                const pct = Math.min(100, Math.round((spent / b.limit) * 100));
                                const status = pct > 90 ? 'over' : pct > 70 ? 'warn' : 'safe';

                                return (
                                    <div key={b.id} className="budget-item">
                                        <div className="budget-meta">
                                            <div className="budget-name">{b.category}</div>
                                            <div className="budget-nums" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <span><strong>{state.currency}{spent}</strong> / {state.currency}{b.limit} ({pct}%)</span>
                                                <button
                                                    className="icon-btn"
                                                    style={{ width: 24, height: 24, border: 'none', background: 'transparent' }}
                                                    onClick={() => handleDeleteBudget(b.id)}
                                                    title="Delete Budget Cap"
                                                >
                                                    <i className="bi bi-trash text-danger" style={{ fontSize: 12 }}></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="progress-track">
                                            <div className={`progress-fill ${status}`} style={{ width: `${pct}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Savings Rings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Savings Milestones</h3>
                        <button className="btn btn-ghost btn-sm" onClick={() => setShowGoalModal(true)}>
                            + New Goal
                        </button>
                    </div>
                    {state.savingsGoals.map(g => {
                        const pct = Math.round((g.current / g.target) * 100);
                        const dashOffset = 220 - (220 * pct) / 100;

                        return (
                            <div key={g.id} className="goal-ring-card" style={{ position: 'relative' }}>
                                <div className="ring-svg-wrap">
                                    <svg viewBox="0 0 80 80">
                                        <circle className="ring-track" cx="40" cy="40" r="35" />
                                        <circle className="ring-fill" cx="40" cy="40" r="35" strokeDasharray="220" strokeDashoffset={dashOffset} />
                                    </svg>
                                    <div className="ring-label">{pct}%</div>
                                </div>
                                <div className="goal-info">
                                    <div className="goal-name">{g.name}</div>
                                    <div className="goal-amounts">
                                        <strong>{state.currency}{g.current.toLocaleString()}</strong> of {state.currency}{g.target.toLocaleString()}
                                    </div>
                                </div>
                                <button
                                    className="icon-btn"
                                    style={{ width: 24, height: 24, border: 'none', background: 'transparent', position: 'absolute', top: 12, right: 12 }}
                                    onClick={() => handleDeleteGoal(g.id)}
                                    title="Delete Goal"
                                >
                                    <i className="bi bi-trash text-danger" style={{ fontSize: 12 }}></i>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Credit Cards & EMIs */}
            <div className="dashboard-grid-2" style={{ marginTop: 24 }}>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-credit-card-fill"></i> Credit Card Balances
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => setShowCardModal(true)}>
                            + Add Card
                        </button>
                    </div>
                    {state.creditCards.map(cc => (
                        <div key={cc.id} className="budget-item">
                            <div className="budget-meta">
                                <div>
                                    <div className="budget-name">{cc.name}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Due {cc.dueDate}</div>
                                </div>
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => dispatch({ type: 'PAY_CREDIT_CARD', payload: { id: cc.id, name: cc.name, amount: cc.balance } })}
                                >
                                    Pay Balance ({state.currency}{cc.balance})
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-clock-history"></i> Active Financing & EMIs
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => setShowEmiModal(true)}>
                            + Add EMI
                        </button>
                    </div>
                    {state.emis.map(e => (
                        <div key={e.id} className="budget-item">
                            <div className="budget-meta">
                                <div>
                                    <div className="budget-name">{e.name}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                        Term {e.paidTerms}/{e.totalTerms} · {state.currency}{e.monthlyPayment}/mo
                                    </div>
                                </div>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => dispatch({ type: 'PAY_EMI', payload: { id: e.id, name: e.name, amount: e.monthlyPayment } })}
                                >
                                    Pay Term
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {showBudgetModal && (
                    <div className="modal-overlay" onClick={() => setShowBudgetModal(false)}>
                        <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <div className="modal-header">
                                <div className="modal-title">Set Category Budget Cap</div>
                                <button className="modal-close" onClick={() => setShowBudgetModal(false)}><i className="bi bi-x-lg"></i></button>
                            </div>
                            <form onSubmit={handleAddBudget}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <select className="form-control" value={bCat} onChange={e => setBCat(e.target.value)}>
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Monthly Limit ({state.currency})</label>
                                        <input type="number" className="form-control" placeholder="500" value={bLimit} onChange={e => setBLimit(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowBudgetModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save Budget</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {showGoalModal && (
                    <div className="modal-overlay" onClick={() => setShowGoalModal(false)}>
                        <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <div className="modal-header">
                                <div className="modal-title">Add Savings Goal</div>
                                <button className="modal-close" onClick={() => setShowGoalModal(false)}><i className="bi bi-x-lg"></i></button>
                            </div>
                            <form onSubmit={handleAddGoal}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Goal Name</label>
                                        <input className="form-control" placeholder="e.g. World Tour" value={gName} onChange={e => setGName(e.target.value)} required />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Target Amount ({state.currency})</label>
                                            <input type="number" className="form-control" placeholder="5000" value={gTarget} onChange={e => setGTarget(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Current Saved ({state.currency})</label>
                                            <input type="number" className="form-control" placeholder="1000" value={gCurrent} onChange={e => setGCurrent(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowGoalModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Create Goal</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {showCardModal && (
                    <div className="modal-overlay" onClick={() => setShowCardModal(false)}>
                        <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <div className="modal-header">
                                <div className="modal-title">Add Credit Card</div>
                                <button className="modal-close" onClick={() => setShowCardModal(false)}><i className="bi bi-x-lg"></i></button>
                            </div>
                            <form onSubmit={handleAddCard}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Card Name</label>
                                        <input className="form-control" placeholder="e.g. Chase Sapphire" value={cName} onChange={e => setCName(e.target.value)} required />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Credit Limit ({state.currency})</label>
                                            <input type="number" className="form-control" placeholder="10000" value={cLimit} onChange={e => setCLimit(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Current Balance ({state.currency})</label>
                                            <input type="number" className="form-control" placeholder="1200" value={cBalance} onChange={e => setCBalance(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Due Date</label>
                                        <input type="date" className="form-control" value={cDueDate} onChange={e => setCDueDate(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowCardModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Add Card</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {showEmiModal && (
                    <div className="modal-overlay" onClick={() => setShowEmiModal(false)}>
                        <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <div className="modal-header">
                                <div className="modal-title">Add Active EMI / Loan</div>
                                <button className="modal-close" onClick={() => setShowEmiModal(false)}><i className="bi bi-x-lg"></i></button>
                            </div>
                            <form onSubmit={handleAddEmi}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Financing Item Name</label>
                                        <input className="form-control" placeholder="e.g. iPhone 15 Pro Max EMI" value={eName} onChange={e => setEName(e.target.value)} required />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Total Loan ({state.currency})</label>
                                            <input type="number" className="form-control" placeholder="1400" value={eTotal} onChange={e => setETotal(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Monthly EMI ({state.currency})</label>
                                            <input type="number" className="form-control" placeholder="116" value={eMonthly} onChange={e => setEMonthly(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Total Terms (Months)</label>
                                        <input type="number" className="form-control" value={eTerms} onChange={e => setETerms(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowEmiModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save EMI</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================================
// SPLITWISE VIEW
// ============================================================
function SplitwiseView() {
    const { state, dispatch, splitwiseBalances, apiRequest } = useContext(ExpenseContext);
    const [selectedGroup, setSelectedGroup] = useState(state.groups[0]?.id || 'gr1');

    // Modals
    const [showExpModal, setShowExpModal] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showFriendModal, setShowFriendModal] = useState(false);
    const [showSettleModal, setShowSettleModal] = useState(false);

    // Form states
    const [expDesc, setExpDesc] = useState('');
    const [expAmount, setExpAmount] = useState('');
    const [expPaidBy, setExpPaidBy] = useState('user_0');

    const [grpName, setGrpName] = useState('');
    const [grpDesc, setGrpDesc] = useState('');

    const [frndName, setFrndName] = useState('');
    const [frndEmail, setFrndEmail] = useState('');

    const [settleFrom, setSettleFrom] = useState(state.friends[0]?.id || '');
    const [settleAmount, setSettleAmount] = useState('');

    const activeGroup = state.groups.find(g => String(g.id) === String(selectedGroup)) || state.groups[0];
    const groupExpenses = state.sharedExpenses.filter(e => String(e.groupId) === String(selectedGroup) || String(e.groupId) === String(activeGroup?.id));

    const handleDeleteSharedExpense = async (id) => {
        if (state.token && state.token !== 'offline_token') {
            try { await apiRequest(`/api/splitwise/expenses/${id}`, { method: 'DELETE' }); }
            catch (err) { console.error('Expense delete error:', err); }
        }
        dispatch({ type: 'DELETE_SHARED_EXPENSE', payload: id });
    };

    const handleDeleteFriend = async (id) => {
        if (state.token && state.token !== 'offline_token') {
            try { await apiRequest(`/api/splitwise/friends/${id}`, { method: 'DELETE' }); }
            catch (err) { console.error('Friend delete error:', err); }
        }
        dispatch({ type: 'DELETE_FRIEND', payload: id });
    };

    const handleDeleteGroup = async (id) => {
        if (state.token && state.token !== 'offline_token') {
            try { await apiRequest(`/api/splitwise/groups/${id}`, { method: 'DELETE' }); }
            catch (err) { console.error('Group delete error:', err); }
        }
        dispatch({ type: 'DELETE_GROUP', payload: id });
    };

    const handleAddFriend = async (e) => {
        e.preventDefault();
        if (!frndName || !frndEmail) return;
        const entry = { id: 'f_' + Date.now(), name: frndName, email: frndEmail };
        if (state.token && state.token !== 'offline_token') {
            try {
                const saved = await apiRequest('/api/splitwise/friends', { method: 'POST', body: JSON.stringify(entry) });
                if (saved && (saved._id || saved.id)) entry.id = saved._id || saved.id;
            } catch (err) { console.error('Friend save error:', err); }
        }
        dispatch({ type: 'ADD_FRIEND', payload: entry });
        setShowFriendModal(false); setFrndName(''); setFrndEmail('');
    };

    const handleAddGroup = async (e) => {
        e.preventDefault();
        if (!grpName) return;
        const entry = { id: 'gr_' + Date.now(), name: grpName, desc: grpDesc, members: ['user_0'] };
        if (state.token && state.token !== 'offline_token') {
            try {
                const saved = await apiRequest('/api/splitwise/groups', { method: 'POST', body: JSON.stringify(entry) });
                if (saved && (saved._id || saved.id)) entry.id = saved._id || saved.id;
            } catch (err) { console.error('Group save error:', err); }
        }
        dispatch({ type: 'ADD_GROUP', payload: entry });
        setSelectedGroup(entry.id);
        setShowGroupModal(false); setGrpName(''); setGrpDesc('');
    };

    const handleAddSharedExpense = async (e) => {
        e.preventDefault();
        if (!expDesc || !expAmount || !activeGroup) return;

        // Formulate members and splits
        const membersList = activeGroup.members && activeGroup.members.length > 0 ? activeGroup.members : ['user_0', ...state.friends.map(f => f.id)];
        const perShare = parseFloat(expAmount) / membersList.length;
        const splits = membersList.map(m => ({ memberId: m, share: Math.round(perShare * 100) / 100 }));

        const entry = {
            id: 'se_' + Date.now(),
            groupId: activeGroup.id,
            desc: expDesc,
            amount: parseFloat(expAmount),
            paidBy: expPaidBy,
            members: membersList,
            splits,
            date: new Date().toISOString().split('T')[0]
        };

        if (state.token && state.token !== 'offline_token') {
            try {
                // Ensure at least 1 friend exists before backend post
                if (state.friends.length === 0) {
                    const defaultFriend = await apiRequest('/api/splitwise/friends', {
                        method: 'POST',
                        body: JSON.stringify({ name: 'Alex', email: 'alex@splitwise.local' })
                    }).catch(() => null);
                    if (defaultFriend) dispatch({ type: 'ADD_FRIEND', payload: { id: defaultFriend._id, name: 'Alex', email: 'alex@splitwise.local' } });
                }

                const saved = await apiRequest('/api/splitwise/expenses', { method: 'POST', body: JSON.stringify(entry) });
                if (saved && (saved._id || saved.id)) entry.id = saved._id || saved.id;
            } catch (err) { console.error('Shared expense save error:', err); }
        }

        dispatch({ type: 'ADD_SHARED_EXPENSE', payload: entry });
        setShowExpModal(false); setExpDesc(''); setExpAmount('');
    };

    const handleAddSettlement = async (e) => {
        e.preventDefault();
        const fromId = settleFrom || state.friends[0]?.id;
        if (!fromId || !settleAmount) return;

        const entry = {
            id: 's_' + Date.now(),
            fromId,
            toId: 'user_0',
            amount: parseFloat(settleAmount),
            date: new Date().toISOString().split('T')[0]
        };

        if (state.token && state.token !== 'offline_token') {
            try {
                const saved = await apiRequest('/api/splitwise/settlements', { method: 'POST', body: JSON.stringify(entry) });
                if (saved && (saved._id || saved.id)) entry.id = saved._id || saved.id;
            } catch (err) { console.error('Settlement save error:', err); }
        }

        dispatch({ type: 'ADD_SETTLEMENT', payload: entry });
        setShowSettleModal(false); setSettleAmount('');
    };

    return (
        <div className="animate-slide-up">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Splitwise Engine</h1>
                    <p className="page-subtitle">Automated Bill Splitting & Multi-Party Settlements</p>
                </div>
                <div className="page-actions" style={{ flexWrap: 'wrap' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowFriendModal(true)}>
                        <i className="bi bi-person-plus-fill"></i> Add Friend
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowGroupModal(true)}>
                        <i className="bi bi-folder-plus"></i> New Group
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowSettleModal(true)}>
                        <i className="bi bi-check2-circle"></i> Settle Up
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowExpModal(true)}>
                        <i className="bi bi-plus-lg"></i> Shared Expense
                    </button>
                </div>
            </div>

            <div className="split-layout">
                <div className="split-sidebar">
                    <div className="split-list-header">
                        <span>Shared Groups</span>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '0 4px' }} onClick={() => setShowGroupModal(true)}>+</button>
                    </div>
                    <div className="split-list">
                        {state.groups.map(g => (
                            <div
                                key={g.id}
                                className={`split-item ${String(selectedGroup) === String(g.id) ? 'active' : ''}`}
                                onClick={() => setSelectedGroup(g.id)}
                            >
                                <div className="split-item-name">
                                    <i className="bi bi-people"></i> {g.name}
                                </div>
                                {state.groups.length > 1 && (
                                    <button
                                        className="icon-btn"
                                        style={{ width: 20, height: 20, border: 'none', background: 'transparent' }}
                                        onClick={(e) => { e.stopPropagation(); handleDeleteGroup(g.id); }}
                                    >
                                        <i className="bi bi-x text-danger" style={{ fontSize: 13 }}></i>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="split-list-header" style={{ borderTop: '1px solid var(--border)' }}>
                        <span>Friends Net Balances</span>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '0 4px' }} onClick={() => setShowFriendModal(true)}>+</button>
                    </div>
                    <div className="split-list">
                        {state.friends.map(f => {
                            const bal = splitwiseBalances[f.id] || 0;
                            return (
                                <div key={f.id} className="split-item">
                                    <div className="split-item-name">{f.name}</div>
                                    <div className={`split-balance ${bal > 0 ? 'owed' : bal < 0 ? 'owe' : 'settled'}`}>
                                        {bal > 0 ? `gets ${state.currency}${bal}` : bal < 0 ? `owes ${state.currency}${Math.abs(bal)}` : 'Settled'}
                                    </div>
                                    <button
                                        className="icon-btn"
                                        style={{ width: 20, height: 20, border: 'none', background: 'transparent', marginLeft: 6 }}
                                        onClick={() => handleDeleteFriend(f.id)}
                                    >
                                        <i className="bi bi-x text-danger" style={{ fontSize: 13 }}></i>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-receipt"></i> {activeGroup?.name || 'Group'} Expenses
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={() => setShowExpModal(true)}>
                            + Add Group Expense
                        </button>
                    </div>

                    <div className="tx-list">
                        {groupExpenses.length === 0 ? (
                            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                                No expenses logged for this group yet. Click "+ Add Group Expense" above!
                            </div>
                        ) : (
                            groupExpenses.map(exp => (
                                <div key={exp.id} className="tx-row">
                                    <div className="tx-icon expense">
                                        <i className="bi bi-receipt"></i>
                                    </div>
                                    <div className="tx-info">
                                        <div className="tx-desc">{exp.desc}</div>
                                        <div className="tx-meta-row">
                                            <span className="tx-date">{exp.date}</span>
                                            <span className="tx-pill">Paid by {exp.paidBy === 'user_0' ? 'You' : 'Friend'}</span>
                                        </div>
                                    </div>
                                    <div className="tx-amount expense">{state.currency}{exp.amount}</div>
                                    <button
                                        className="icon-btn"
                                        style={{ width: 24, height: 24, border: 'none', background: 'transparent', marginLeft: 8 }}
                                        onClick={() => handleDeleteSharedExpense(exp.id)}
                                        title="Delete Expense"
                                    >
                                        <i className="bi bi-trash text-danger" style={{ fontSize: 12 }}></i>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {showExpModal && (
                    <div className="modal-overlay" onClick={() => setShowExpModal(false)}>
                        <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <div className="modal-header">
                                <div className="modal-title">Add Shared Group Expense</div>
                                <button className="modal-close" onClick={() => setShowExpModal(false)}><i className="bi bi-x-lg"></i></button>
                            </div>
                            <form onSubmit={handleAddSharedExpense}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <input className="form-control" placeholder="e.g. Dinner & Drinks" value={expDesc} onChange={e => setExpDesc(e.target.value)} required />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Total Amount ({state.currency})</label>
                                            <input type="number" step="0.01" className="form-control" placeholder="120.00" value={expAmount} onChange={e => setExpAmount(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Paid By</label>
                                            <select className="form-control" value={expPaidBy} onChange={e => setExpPaidBy(e.target.value)}>
                                                <option value="user_0">You</option>
                                                {state.friends.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowExpModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Split Bill</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {showFriendModal && (
                    <div className="modal-overlay" onClick={() => setShowFriendModal(false)}>
                        <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <div className="modal-header">
                                <div className="modal-title">Add Splitwise Friend</div>
                                <button className="modal-close" onClick={() => setShowFriendModal(false)}><i className="bi bi-x-lg"></i></button>
                            </div>
                            <form onSubmit={handleAddFriend}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Friend Name</label>
                                        <input className="form-control" placeholder="Sarah Chen" value={frndName} onChange={e => setFrndName(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <input type="email" className="form-control" placeholder="sarah@example.com" value={frndEmail} onChange={e => setFrndEmail(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowFriendModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Add Friend</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {showGroupModal && (
                    <div className="modal-overlay" onClick={() => setShowGroupModal(false)}>
                        <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <div className="modal-header">
                                <div className="modal-title">Form New Group</div>
                                <button className="modal-close" onClick={() => setShowGroupModal(false)}><i className="bi bi-x-lg"></i></button>
                            </div>
                            <form onSubmit={handleAddGroup}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Group Name</label>
                                        <input className="form-control" placeholder="e.g. Summer Vacation Trip" value={grpName} onChange={e => setGrpName(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Description (Optional)</label>
                                        <input className="form-control" placeholder="Shared villa & travel costs" value={grpDesc} onChange={e => setGrpDesc(e.target.value)} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowGroupModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Create Group</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {showSettleModal && (
                    <div className="modal-overlay" onClick={() => setShowSettleModal(false)}>
                        <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <div className="modal-header">
                                <div className="modal-title">Record Settlement Payment</div>
                                <button className="modal-close" onClick={() => setShowSettleModal(false)}><i className="bi bi-x-lg"></i></button>
                            </div>
                            <form onSubmit={handleAddSettlement}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Payer (Friend)</label>
                                        <select className="form-control" value={settleFrom} onChange={e => setSettleFrom(e.target.value)}>
                                            {state.friends.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Settlement Amount ({state.currency})</label>
                                        <input type="number" step="0.01" className="form-control" placeholder="50.00" value={settleAmount} onChange={e => setSettleAmount(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowSettleModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Record Settlement</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================================
// FINANCIAL MEMORY TIMELINE VIEW
// ============================================================
function TimelineView() {
    const { state, dispatch, apiRequest } = useContext(ExpenseContext);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [inspectTx, setInspectTx] = useState(null);

    const [eventName, setEventName] = useState('');
    const [eventCat, setEventCat] = useState('Travel');
    const [eventStart, setEventStart] = useState(new Date().toISOString().split('T')[0]);
    const [eventDesc, setEventDesc] = useState('');

    const categories = ['All', 'Travel', 'Tech & Career', 'Education', 'Lifestyle'];

    const filteredEvents = state.lifeEvents.filter(e => selectedCategory === 'All' || e.category === selectedCategory);

    const handleCreateLifeEvent = async (e) => {
        e.preventDefault();
        if (!eventName) return;
        const entry = {
            id: 'le_' + Date.now(),
            name: eventName,
            category: eventCat,
            description: eventDesc,
            icon: eventCat === 'Travel' ? 'bi-airplane-fill' : eventCat === 'Education' ? 'bi-book-fill' : 'bi-laptop-fill',
            bannerColor: eventCat === 'Travel' ? '#3B82F6' : eventCat === 'Education' ? '#10B981' : '#8B5CF6',
            startDate: eventStart,
            tags: [eventCat]
        };

        if (state.token && state.token !== 'offline_token') {
            try {
                const saved = await apiRequest('/api/life-events', { method: 'POST', body: JSON.stringify(entry) });
                if (saved && (saved._id || saved.id)) entry.id = saved._id || saved.id;
            } catch (err) { console.error('Life event save error:', err); }
        }

        dispatch({ type: 'ADD_LIFE_EVENT', payload: entry });
        setShowAddEventModal(false); setEventName(''); setEventDesc('');
    };

    return (
        <div className="animate-slide-up">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Financial Memory Timeline</h1>
                    <p className="page-subtitle">Your Life Story Remembered Through Financial Experiences</p>
                </div>
                <div className="page-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowImportModal(true)}>
                        <i className="bi bi-file-earmark-arrow-up-fill"></i> Import Statement
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAddEventModal(true)}>
                        <i className="bi bi-plus-lg"></i> Life Chapter
                    </button>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="auth-tabs" style={{ maxWidth: 500, marginBottom: 24 }}>
                {categories.map(c => (
                    <button
                        key={c}
                        className={`auth-tab ${selectedCategory === c ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(c)}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* Group transactions hierarchically by Month & Category */}
            <div className="timeline-container">
                {(() => {
                    // Group transactions by YYYY-MM
                    const monthMap = {};
                    state.transactions.forEach(t => {
                        const monthKey = (t.date || '').slice(0, 7) || '2026-08';
                        if (!monthMap[monthKey]) monthMap[monthKey] = [];
                        monthMap[monthKey].push(t);
                    });

                    const sortedMonths = Object.keys(monthMap).sort((a, b) => b.localeCompare(a));

                    if (sortedMonths.length === 0) {
                        return (
                            <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                                <i className="bi bi-calendar3" style={{ fontSize: 32, display: 'block', marginBottom: 8 }}></i>
                                No memory timeline recorded yet. Import a statement or record a transaction!
                            </div>
                        );
                    }

                    return sortedMonths.map(mKey => {
                        const mTx = monthMap[mKey];
                        const dateObj = new Date(mKey + '-01');
                        const monthName = isNaN(dateObj.getTime()) ? mKey : dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                        
                        const mExpense = mTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
                        const mIncome = mTx.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);

                        // Group by Category inside Month
                        const catMap = {};
                        mTx.forEach(t => {
                            const cat = t.category || 'General';
                            if (!catMap[cat]) catMap[cat] = [];
                            catMap[cat].push(t);
                        });

                        return (
                            <div key={mKey} className="timeline-month-block">
                                <div className="month-sticky-header">
                                    <div className="month-title">
                                        <i className="bi bi-calendar-event-fill" style={{ color: 'var(--accent)' }}></i>
                                        {monthName}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <span className="month-summary-badge" style={{ color: '#10B981', background: 'rgba(16,185,129,0.1)' }}>
                                            +{state.currency}{mIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                        <span className="month-summary-badge" style={{ color: 'var(--text-primary)' }}>
                                            -{state.currency}{mExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>

                                <div className="timeline-tree-container">
                                    {Object.keys(catMap).map(catName => {
                                        const catTx = catMap[catName];
                                        const catMeta = getCategoryMeta(catName);
                                        const catTotal = catTx.reduce((acc, t) => acc + (t.type === 'income' ? -t.amount : t.amount), 0);

                                        return (
                                            <div key={catName} className="timeline-branch-group">
                                                <div className="timeline-branch-header">
                                                    <span className="branch-tag" style={{ background: catMeta.gradient, color: '#fff' }}>
                                                        <i className={`bi ${catMeta.icon}`}></i> {catName}
                                                    </span>
                                                    <span className="branch-total">
                                                        {state.currency}{Math.abs(catTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })} ({catTx.length})
                                                    </span>
                                                </div>

                                                <div className="tx-list" style={{ marginTop: 8 }}>
                                                    {catTx.map(t => (
                                                        <div key={t.id} className="tx-row" onClick={() => setInspectTx(t)}>
                                                            <div className={`tx-icon ${t.type}`} style={{ background: catMeta.gradient }}>
                                                                <i className={`bi ${t.icon || catMeta.icon}`}></i>
                                                            </div>
                                                            <div className="tx-info">
                                                                <div className="tx-desc-line">
                                                                    <span className="tx-merchant" title={t.desc}>{t.desc}</span>
                                                                    {t.cleanDesc && t.cleanDesc !== t.desc && (
                                                                        <span className="tx-clean-desc"> • {t.cleanDesc}</span>
                                                                    )}
                                                                </div>
                                                                <div className="tx-meta-row">
                                                                    <span className="tx-date">{t.date}</span>
                                                                    {t.memoryTag && (
                                                                        <span className="memory-chip-pill">
                                                                            {t.memoryTag}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className={`tx-amount-col ${t.type}`}>
                                                                <span className="tx-amount-val">
                                                                    {t.type === 'income' ? '+' : '-'}{state.currency}{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                })()}
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {showAddEventModal && (
                    <div className="modal-overlay" onClick={() => setShowAddEventModal(false)}>
                        <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <div className="modal-header">
                                <div className="modal-title">Create Life Event Chapter</div>
                                <button className="modal-close" onClick={() => setShowAddEventModal(false)}><i className="bi bi-x-lg"></i></button>
                            </div>
                            <form onSubmit={handleCreateLifeEvent}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Event Name</label>
                                        <input className="form-control" placeholder="e.g. Goa Trip 2026, Semester 5" value={eventName} onChange={e => setEventName(e.target.value)} required />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Category</label>
                                            <select className="form-control" value={eventCat} onChange={e => setEventCat(e.target.value)}>
                                                <option value="Travel">Travel</option>
                                                <option value="Tech & Career">Tech & Career</option>
                                                <option value="Education">Education</option>
                                                <option value="Lifestyle">Lifestyle</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Start Date</label>
                                            <input type="date" className="form-control" value={eventStart} onChange={e => setEventStart(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <input className="form-control" placeholder="Brief memory note..." value={eventDesc} onChange={e => setEventDesc(e.target.value)} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddEventModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Create Chapter</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {showImportModal && <StatementImportModal onClose={() => setShowImportModal(false)} />}
                {inspectTx && <PurchaseMetaModal tx={inspectTx} onClose={() => setInspectTx(null)} />}
            </AnimatePresence>
        </div>
    );
}

// ============================================================
// AI NATURAL LANGUAGE SEARCH & MEMORY VIEW
// ============================================================
function AIMemoryView() {
    const { state, apiRequest } = useContext(ExpenseContext);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
    const [inspectTx, setInspectTx] = useState(null);

    const prompts = [
        "Show everything I bought for my gaming setup",
        "How much did I spend on Goa Trip?",
        "Show all Apple purchases",
        "What did I spend on coffee?"
    ];

    const handleSearch = async (e, customQuery) => {
        if (e) e.preventDefault();
        const searchQuery = customQuery || query;
        if (!searchQuery) return;
        setQuery(searchQuery);
        setLoading(true);

        try {
            if (state.token && state.token !== 'offline_token') {
                const res = await apiRequest('/api/ai/memory-search', {
                    method: 'POST',
                    body: JSON.stringify({ query: searchQuery })
                });
                setAiResponse(res);
            } else {
                // Local filter simulation
                const qLower = searchQuery.toLowerCase();
                const matches = state.transactions.filter(t =>
                    t.desc.toLowerCase().includes(qLower) ||
                    t.category.toLowerCase().includes(qLower) ||
                    (t.lifeEventName && t.lifeEventName.toLowerCase().includes(qLower)) ||
                    (t.contextPath && t.contextPath.some(c => c.toLowerCase().includes(qLower)))
                );
                const total = matches.reduce((acc, m) => acc + m.amount, 0);
                setAiResponse({
                    query: searchQuery,
                    response: `Found ${matches.length} memory entries matching "${searchQuery}" totaling $${total.toLocaleString()}.`,
                    totalSpend: total,
                    count: matches.length,
                    results: matches
                });
            }
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-slide-up">
            <div className="page-header">
                <div>
                    <h1 className="page-title">AI Natural Language Memory</h1>
                    <p className="page-subtitle">Ask Anything About Your Financial History in Natural Words</p>
                </div>
            </div>

            {/* Search Input Bar */}
            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                <form onSubmit={e => handleSearch(e)} style={{ display: 'flex', gap: 12 }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <i className="bi bi-search" style={{ position: 'absolute', left: 16, top: 14, color: 'var(--text-muted)', fontSize: 16 }}></i>
                        <input
                            className="form-control"
                            style={{ paddingLeft: 44, height: 46, fontSize: 15 }}
                            placeholder="Ask e.g., 'Show everything I bought for my developer setup'..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }} disabled={loading}>
                        {loading ? 'Searching...' : 'Ask AI'}
                    </button>
                </form>

                {/* Prompt Suggestions */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>Try asking:</span>
                    {prompts.map(p => (
                        <button
                            key={p}
                            className="btn btn-ghost btn-sm"
                            style={{ background: 'var(--bg-subtle)', borderRadius: 20, fontSize: 12 }}
                            onClick={() => handleSearch(null, p)}
                        >
                            ✨ {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Response & Matches */}
            {aiResponse && (
                <div className="animate-fade-in">
                    <div className="card" style={{ padding: 20, marginBottom: 20, borderLeft: '4px solid var(--accent)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <i className="bi bi-robot" style={{ color: 'var(--accent)', fontSize: 18 }}></i>
                            <strong style={{ fontSize: 14 }}>Financial Memory Insights</strong>
                        </div>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
                            {aiResponse.response}
                        </p>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Matching Memory Entries ({aiResponse.results?.length || 0})</div>
                        </div>

                        <div className="tx-list">
                            {aiResponse.results?.length === 0 ? (
                                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No entries found matching your query.
                                </div>
                            ) : (
                                aiResponse.results.map(t => (
                                    <div key={t.id} className="tx-row" onClick={() => setInspectTx(t)} style={{ cursor: 'pointer' }}>
                                        <div className="tx-icon expense"><i className="bi bi-stars"></i></div>
                                        <div className="tx-info">
                                            {t.contextPath && t.contextPath.length > 0 && (
                                                <div className="context-breadcrumb">{t.contextPath.join(' → ')}</div>
                                            )}
                                            <div className="tx-desc">{t.desc}</div>
                                            <div className="tx-meta-row">
                                                <span className="tx-date">{t.date}</span>
                                                <span className="tx-pill">{t.category}</span>
                                            </div>
                                        </div>
                                        <div className="tx-amount expense">{state.currency}{t.amount}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {inspectTx && <PurchaseMetaModal tx={inspectTx} onClose={() => setInspectTx(null)} />}
            </AnimatePresence>
        </div>
    );
}

// ============================================================
// SUBSCRIPTIONS INTELLIGENCE VIEW
// ============================================================
function SubscriptionsView() {
    const { state, dispatch, apiRequest } = useContext(ExpenseContext);
    const [showAddSubModal, setShowAddSubModal] = useState(false);

    const [subName, setSubName] = useState('');
    const [subCost, setSubCost] = useState('');
    const [subCycle, setSubCycle] = useState('monthly');
    const [subCategory, setSubCategory] = useState('Software/Subscriptions');

    const totalMonthlyBurn = state.subscriptions
        .filter(s => s.billingCycle === 'monthly')
        .reduce((acc, s) => acc + s.cost, 0);

    const unusedSubs = state.subscriptions.filter(s => s.usageStatus === 'unused');

    const handleAddSub = async (e) => {
        e.preventDefault();
        if (!subName || !subCost) return;

        const entry = {
            id: 'sub_' + Date.now(),
            serviceName: subName,
            cost: parseFloat(subCost),
            billingCycle: subCycle,
            category: subCategory,
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            usageStatus: 'active'
        };

        if (state.token && state.token !== 'offline_token') {
            try {
                const saved = await apiRequest('/api/subscriptions', { method: 'POST', body: JSON.stringify(entry) });
                if (saved && (saved._id || saved.id)) entry.id = saved._id || saved.id;
            } catch (err) { console.error('Sub save error:', err); }
        }

        dispatch({ type: 'ADD_SUBSCRIPTION', payload: entry });
        setShowAddSubModal(false); setSubName(''); setSubCost('');
    };

    const handleDeleteSub = async (id) => {
        if (state.token && state.token !== 'offline_token') {
            try { await apiRequest(`/api/subscriptions/${id}`, { method: 'DELETE' }); }
            catch (err) { console.error('Sub delete error:', err); }
        }
        dispatch({ type: 'DELETE_SUBSCRIPTION', payload: id });
    };

    return (
        <div className="animate-slide-up">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Subscriptions & Recurring Burn</h1>
                    <p className="page-subtitle">Unused Subscriptions Audit, Renewal Schedules & Waste Detection</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAddSubModal(true)}>
                    <i className="bi bi-plus-lg"></i> Track Subscription
                </button>
            </div>

            {/* Unused Subscriptions Alert Banner */}
            {unusedSubs.length > 0 && (
                <div className="card" style={{ padding: 16, marginBottom: 24, background: 'var(--warning-light)', borderColor: 'var(--warning)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <i className="bi bi-exclamation-triangle-fill" style={{ color: 'var(--warning)', fontSize: 20 }}></i>
                        <div>
                            <strong style={{ display: 'block', fontSize: 14 }}>Unused Subscriptions Detected!</strong>
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                You have {unusedSubs.length} subscription ({unusedSubs.map(s => s.serviceName).join(', ')}) flagged as low usage. Canceling could save you {state.currency}{(unusedSubs.reduce((a, s) => a + s.cost, 0) * 12).toFixed(2)}/year.
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Burn KPI Cards */}
            <div className="kpi-grid" style={{ marginBottom: 24 }}>
                <div className="kpi-card">
                    <div className="kpi-title">Monthly Subscription Burn</div>
                    <div className="kpi-value">{state.currency}{totalMonthlyBurn.toFixed(2)}</div>
                    <span className="kpi-sub">Across {state.subscriptions.length} recurring services</span>
                </div>
                <div className="kpi-card">
                    <div className="kpi-title">Annual Projected Burn</div>
                    <div className="kpi-value">{state.currency}{(totalMonthlyBurn * 12).toFixed(2)}</div>
                    <span className="kpi-sub">12-month recurring expenditure</span>
                </div>
            </div>

            {/* Subscriptions Grid */}
            <div className="dashboard-grid-2">
                {state.subscriptions.map(s => (
                    <div key={s.id} className="card" style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{s.serviceName}</h3>
                                <span className="tx-pill" style={{ marginTop: 4 }}>{s.category}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 18, fontWeight: 800 }}>{state.currency}{s.cost}/mo</div>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Due {s.nextBillingDate}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                            <span className={`badge ${s.usageStatus === 'unused' ? 'badge-danger' : 'badge-success'}`}>
                                {s.usageStatus === 'unused' ? '⚠️ Flagged Unused' : '✓ Active'}
                            </span>
                            <button
                                className="icon-btn"
                                style={{ width: 24, height: 24, border: 'none', background: 'transparent' }}
                                onClick={() => handleDeleteSub(s.id)}
                                title="Remove Subscription"
                            >
                                <i className="bi bi-trash text-danger" style={{ fontSize: 13 }}></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {showAddSubModal && (
                    <div className="modal-overlay" onClick={() => setShowAddSubModal(false)}>
                        <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <div className="modal-header">
                                <div className="modal-title">Track Recurring Subscription</div>
                                <button className="modal-close" onClick={() => setShowAddSubModal(false)}><i className="bi bi-x-lg"></i></button>
                            </div>
                            <form onSubmit={handleAddSub}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Service Name</label>
                                        <input className="form-control" placeholder="e.g. Netflix, Figma, Spotify" value={subName} onChange={e => setSubName(e.target.value)} required />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Cost ({state.currency})</label>
                                            <input type="number" step="0.01" className="form-control" placeholder="19.99" value={subCost} onChange={e => setSubCost(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Cycle</label>
                                            <select className="form-control" value={subCycle} onChange={e => setSubCycle(e.target.value)}>
                                                <option value="monthly">Monthly</option>
                                                <option value="yearly">Yearly</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddSubModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Track Subscription</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

const CLIENT_MERCHANT_MAP = [
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

function clientParseStatementLines(rawText, defaultMethod = 'IDFC First Bank') {
    const dateRegex = /\b(\d{2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*,?\s+\d{2,4}|\d{4}[-/]\d{2}[-/]\d{2}|\d{2}[-/]\d{2}[-/]\d{4})\b/gi;

    let formattedText = rawText.replace(dateRegex, '\n$1');
    const rawLines = formattedText.split('\n').map(l => l.trim()).filter(Boolean);
    const parsed = [];

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
    if (currentBlock.length > 0) blocks.push(currentBlock.join(' '));

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
        const txAmount = amounts[amounts.length - 1];

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

        // AI Matcher
        let matched = null;
        for (const rule of CLIENT_MERCHANT_MAP) {
            if (rule.patterns.some(p => p.test(blockText))) {
                matched = rule;
                break;
            }
        }

        // Person Matcher
        let personName = '';
        const upiPersonMatch = blockText.match(/(?:armaan|vivek|ashish|keshav|meenu|ananya|shakshi|partho|dheeraj|varinder|bhanu|jaydeb|harsh)\s*[a-zA-Z]*/i);
        if (upiPersonMatch) personName = upiPersonMatch[0].trim();

        let merchant = matched ? matched.merchant : '';
        let category = matched ? matched.cat : (isIncome ? 'Income' : 'Shopping');
        let memoryTag = matched ? matched.memory : (isIncome ? '💸 Inbound Funds' : '✨ Financial Life');
        let icon = matched ? matched.icon : (isIncome ? 'bi-arrow-down-left-circle-fill' : 'bi-credit-card-fill');
        let desc = '';

        if (isIncome) {
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
            let clean = blockText
                .replace(/UPI payment|UPI receipt|Debit Card|Single Transfer|Online payment|Others/gi, '')
                .replace(/Aug \d{4}|Jul \d{4}|Jun \d{4}|May \d{4}|\d{2}\s+[A-Za-z]{3}\s+\d{2,4}/gi, '')
                .replace(/(?:Services|Food and Drinks|Shopping|Education|Entertainment|Grocery|Digital Payments|Self Transfer|Interests & Dividends|Loan EMI|Travel|Home expenses)/gi, '')
                .replace(/(?:[+\-]?\s*(?:₹|Rs\.?|INR|\$)?\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})|\d+(?:\.\d{2}))/gi, '')
                .replace(/\b\d{10,16}\b/g, '')
                .replace(/UPI\/[A-Z0-9/._-]+/gi, '')
                .replace(/[^a-zA-Z0-9\s]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            merchant = clean.length > 2 ? clean.slice(0, 35) : `Transaction #${idx + 1}`;
            desc = `Purchase with ${merchant}`;
        }

        parsed.push({
            id: 't_imp_' + Date.now() + '_' + idx,
            desc: merchant,
            cleanDesc: desc,
            amount: txAmount,
            type: isIncome ? 'income' : 'expense',
            category: category,
            memoryTag: memoryTag,
            icon: icon,
            method: isIncome ? 'UPI Receipt' : (defaultMethod || 'UPI Payment'),
            date: txDate,
            contextPath: [merchant, category, memoryTag],
            source: 'import'
        });
    });

    return parsed;
}

// ============================================================
// STATEMENT IMPORT ENGINE MODAL
// ============================================================
function StatementImportModal({ onClose }) {
    const { state, dispatch, apiRequest } = useContext(ExpenseContext);
    const [importMode, setImportMode] = useState('file'); // 'file' | 'text'
    const [selectedFile, setSelectedFile] = useState(null);
    const [rawText, setRawText] = useState('');
    const [format, setFormat] = useState('Paytm / UPI');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const fileInputRef = useRef(null);

    const handleImportText = async (e) => {
        if (e) e.preventDefault();
        setLoading(true); setMsg('');

        try {
            let parsed = [];
            if (importMode === 'file' && selectedFile) {
                const reader = new FileReader();
                reader.onload = async (ev) => {
                    const text = ev.target.result;
                    parsed = clientParseStatementLines(text, 'PDF Bank Statement');
                    saveAndApplyParsed(parsed, selectedFile.name);
                };
                reader.readAsText(selectedFile);
                return;
            } else {
                if (!rawText) return setLoading(false);
                parsed = clientParseStatementLines(rawText, format || 'Pasted Statement');
                saveAndApplyParsed(parsed, 'Pasted Statement');
            }
        } catch (err) {
            setMsg('Error parsing statement: ' + err.message);
            setLoading(false);
        }
    };

    const saveAndApplyParsed = async (parsed, sourceName) => {
        if (!parsed || parsed.length === 0) {
            setMsg('Could not find clear transaction lines or amounts in the input.');
            setLoading(false);
            return;
        }

        // Deduplicate against existing transactions
        const existingKeys = new Set(state.transactions.map(t => `${t.date}_${t.amount.toFixed(2)}_${(t.desc || '').toLowerCase()}`));
        const uniqueTxs = parsed.filter(t => !existingKeys.has(`${t.date}_${t.amount.toFixed(2)}_${(t.desc || '').toLowerCase()}`));

        if (uniqueTxs.length === 0) {
            setMsg(`Statement parsed (${parsed.length} entries), all are already present in your ledger.`);
            setLoading(false);
            return;
        }

        // Optimistically add to state immediately
        uniqueTxs.forEach(t => dispatch({ type: 'ADD_TRANSACTION', payload: t }));
        setMsg(`✨ Extracted & imported ${uniqueTxs.length} transactions with smart memory chips!`);
        setLoading(false);

        // Background save to MongoDB Atlas if connected
        if (state.token && state.token !== 'offline_token') {
            for (const t of uniqueTxs) {
                apiRequest('/api/transactions', { method: 'POST', body: JSON.stringify(t) }).catch(err => console.warn('Background save error:', err.message));
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <div className="modal-header">
                    <div className="modal-title">1-Click PDF & Bank Statement Importer</div>
                    <button className="modal-close" onClick={onClose}><i className="bi bi-x-lg"></i></button>
                </div>

                {/* Import Mode Tabs */}
                <div style={{ display: 'flex', gap: 8, padding: '12px 24px 0 24px' }}>
                    <button
                        type="button"
                        className={`btn btn-sm ${importMode === 'file' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setImportMode('file')}
                    >
                        📄 Upload PDF / Statement File
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm ${importMode === 'text' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setImportMode('text')}
                    >
                        ✏️ Paste Raw Text
                    </button>
                </div>

                <form onSubmit={handleImportText}>
                    <div className="modal-body">
                        {importMode === 'file' ? (
                            <div>
                                <div
                                    style={{
                                        border: '2px dashed var(--accent)',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: '36px 20px',
                                        textAlign: 'center',
                                        background: 'var(--accent-light)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={e => e.preventDefault()}
                                    onDrop={e => {
                                        e.preventDefault();
                                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                            setSelectedFile(e.dataTransfer.files[0]);
                                        }
                                    }}
                                >
                                    <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: 42, color: 'var(--accent)', display: 'block', marginBottom: 12 }}></i>
                                    <strong style={{ fontSize: 16, display: 'block', color: 'var(--text-primary)', marginBottom: 4 }}>
                                        {selectedFile ? selectedFile.name : 'Drop your Bank / UPI PDF Statement Here'}
                                    </strong>
                                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                        {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB · Click to change file` : 'Supports HDFC, ICICI, SBI, Paytm, GPay, PhonePe PDFs & CSVs'}
                                    </span>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept=".pdf,.csv,.txt"
                                        style={{ display: 'none' }}
                                        onChange={e => {
                                            if (e.target.files && e.target.files[0]) {
                                                setSelectedFile(e.target.files[0]);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="form-group">
                                    <label className="form-label">Statement Format</label>
                                    <select className="form-control" value={format} onChange={e => setFormat(e.target.value)}>
                                        <option value="Paytm / UPI">Paytm / PhonePe / GPay UPI</option>
                                        <option value="HDFC / ICICI Bank">HDFC / ICICI Bank Statement</option>
                                        <option value="CSV / Excel Export">CSV / Excel Raw Text</option>
                                        <option value="Credit Card Statement">Credit Card Statement</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Paste Statement Lines</label>
                                    <textarea
                                        className="form-control"
                                        rows={6}
                                        placeholder="Paste lines from statement e.g. 2026-07-02 Amazon Keyboard Rs.129.00..."
                                        value={rawText}
                                        onChange={e => setRawText(e.target.value)}
                                        required={importMode === 'text'}
                                    />
                                </div>
                            </div>
                        )}

                        {msg && <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, marginTop: 14 }}>{msg}</div>}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || (importMode === 'file' && !selectedFile) || (importMode === 'text' && !rawText)}
                        >
                            {loading ? 'Processing File...' : importMode === 'file' ? '🚀 Extract & Import PDF' : 'Run AI Extraction'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

// ============================================================
// PURCHASE INTELLIGENCE INSPECTOR MODAL
// ============================================================
function PurchaseMetaModal({ tx, onClose }) {
    const { state } = useContext(ExpenseContext);
    const meta = tx.purchaseMeta || { warrantyYears: 2, expectedLifespanMonths: 36, depreciationRate: 0.15, serialNumber: 'C02GX089Q6W3' };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <div className="modal-header">
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>Purchase Intelligence Inspector</div>
                        <div className="modal-title">{tx.desc}</div>
                    </div>
                    <button className="modal-close" onClick={onClose}><i className="bi bi-x-lg"></i></button>
                </div>
                <div className="modal-body">
                    {/* Context Path */}
                    {tx.contextPath && (
                        <div className="context-breadcrumb" style={{ marginBottom: 16 }}>
                            {tx.contextPath.join(' → ')}
                        </div>
                    )}

                    <div className="kpi-grid" style={{ marginBottom: 16 }}>
                        <div className="kpi-card" style={{ padding: 14 }}>
                            <div className="kpi-title">Original Cost</div>
                            <div className="kpi-value">{state.currency}{tx.amount}</div>
                        </div>
                        <div className="kpi-card" style={{ padding: 14 }}>
                            <div className="kpi-title">Warranty Coverage</div>
                            <div className="kpi-value">{meta.warrantyYears} Years</div>
                        </div>
                    </div>

                    {/* Knowledge Graph Relationship */}
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Linked Expense Relationship Graph</div>
                    <div className="purchase-graph-wrap">
                        <div className="graph-node"><i className="bi bi-laptop"></i> MacBook Pro</div>
                        <div className="graph-arrow">→</div>
                        <div className="graph-node"><i className="bi bi-keyboard"></i> Keychron Keyboard</div>
                        <div className="graph-arrow">→</div>
                        <div className="graph-node"><i className="bi bi-mouse"></i> MX Master 3</div>
                        <div className="graph-arrow">→</div>
                        <div className="graph-node"><i className="bi bi-display"></i> LG 4K Display</div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={onClose}>Close Inspector</button>
                </div>
            </motion.div>
        </div>
    );
}

// ============================================================
// MOBILE PWA BOTTOM NAVIGATION & FAB
// ============================================================
function BottomNav({ activeTab, setActiveTab, onOpenImport }) {
    const navItems = [
        { id: 'timeline', label: 'Timeline', icon: 'bi-journal-bookmark-fill' },
        { id: 'memory_search', label: 'AI Search', icon: 'bi-stars' },
        { id: 'dashboard', label: 'Home', icon: 'bi-grid-1x2-fill' },
        { id: 'transactions', label: 'Ledger', icon: 'bi-receipt-cutoff' },
        { id: 'subscriptions', label: 'Audit', icon: 'bi-arrow-repeat' }
    ];

    return (
        <>
            <button className="pwa-fab" onClick={onOpenImport} title="Quick Import / Memory Entry">
                <i className="bi bi-plus-lg"></i>
            </button>

            <nav className="pwa-bottom-bar">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`pwa-nav-btn ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <i className={`bi ${item.icon}`}></i>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </>
    );
}

// ============================================================
// FINANCIAL CALCULATORS TAB
// ============================================================
function CalculatorsView() {
    const { state } = useContext(ExpenseContext);
    const [calcType, setCalcType] = useState('SIP');

    // SIP State
    const [sipMonthly, setSipMonthly] = useState(500);
    const [sipRate, setSipRate] = useState(12);
    const [sipYears, setSipYears] = useState(10);

    // EMI State
    const [emiLoan, setEmiLoan] = useState(25000);
    const [emiRate, setEmiRate] = useState(8.5);
    const [emiYears, setEmiYears] = useState(5);

    // Calculations
    const sipFutureValue = useMemo(() => {
        const i = sipRate / 12 / 100;
        const n = sipYears * 12;
        const fv = sipMonthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        return Math.round(fv);
    }, [sipMonthly, sipRate, sipYears]);

    const emiMonthlyVal = useMemo(() => {
        const r = emiRate / 12 / 100;
        const n = emiYears * 12;
        const emi = (emiLoan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        return Math.round(emi);
    }, [emiLoan, emiRate, emiYears]);

    return (
        <div className="animate-slide-up">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Wealth Simulators & Calculators</h1>
                    <p className="page-subtitle">Interactive Financial Modeling & Wealth Projections</p>
                </div>
            </div>

            <div className="auth-tabs" style={{ maxWidth: 400, marginBottom: 24 }}>
                <button className={`auth-tab ${calcType === 'SIP' ? 'active' : ''}`} onClick={() => setCalcType('SIP')}>
                    📈 SIP Wealth Growth
                </button>
                <button className={`auth-tab ${calcType === 'EMI' ? 'active' : ''}`} onClick={() => setCalcType('EMI')}>
                    💳 EMI Loan Calculator
                </button>
            </div>

            {calcType === 'SIP' && (
                <div className="dashboard-grid-2">
                    <div className="card">
                        <div className="calc-input-row">
                            <div>
                                <div className="calc-slider-label">
                                    <span>Monthly Investment</span>
                                    <strong>{state.currency}{sipMonthly}</strong>
                                </div>
                                <input type="range" min="50" max="5000" step="50" value={sipMonthly} onChange={e => setSipMonthly(+e.target.value)} />
                            </div>

                            <div>
                                <div className="calc-slider-label">
                                    <span>Expected Return Rate</span>
                                    <strong>{sipRate}% p.a.</strong>
                                </div>
                                <input type="range" min="1" max="25" step="0.5" value={sipRate} onChange={e => setSipRate(+e.target.value)} />
                            </div>

                            <div>
                                <div className="calc-slider-label">
                                    <span>Time Horizon</span>
                                    <strong>{sipYears} Years</strong>
                                </div>
                                <input type="range" min="1" max="30" value={sipYears} onChange={e => setSipYears(+e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="calc-result">
                            <div className="calc-result-label">Estimated Wealth Accumulation</div>
                            <div className="calc-result-value">{state.currency}{sipFutureValue.toLocaleString()}</div>
                        </div>
                        <div style={{ marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
                            Invested Amount: <strong>{state.currency}{(sipMonthly * sipYears * 12).toLocaleString()}</strong><br />
                            Estimated Returns: <strong>{state.currency}{(sipFutureValue - (sipMonthly * sipYears * 12)).toLocaleString()}</strong>
                        </div>
                    </div>
                </div>
            )}

            {calcType === 'EMI' && (
                <div className="dashboard-grid-2">
                    <div className="card">
                        <div className="calc-input-row">
                            <div>
                                <div className="calc-slider-label">
                                    <span>Loan Principal Amount</span>
                                    <strong>{state.currency}{emiLoan.toLocaleString()}</strong>
                                </div>
                                <input type="range" min="1000" max="200000" step="1000" value={emiLoan} onChange={e => setEmiLoan(+e.target.value)} />
                            </div>

                            <div>
                                <div className="calc-slider-label">
                                    <span>Interest Rate</span>
                                    <strong>{emiRate}% p.a.</strong>
                                </div>
                                <input type="range" min="1" max="20" step="0.25" value={emiRate} onChange={e => setEmiRate(+e.target.value)} />
                            </div>

                            <div>
                                <div className="calc-slider-label">
                                    <span>Loan Tenure</span>
                                    <strong>{emiYears} Years</strong>
                                </div>
                                <input type="range" min="1" max="30" value={emiYears} onChange={e => setEmiYears(+e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="calc-result">
                            <div className="calc-result-label">Monthly EMI Output</div>
                            <div className="calc-result-value">{state.currency}{emiMonthlyVal.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================
// SETTINGS VIEW
// ============================================================
function SettingsView() {
    const { state, dispatch } = useContext(ExpenseContext);
    const [apiUrlInput, setApiUrlInput] = useState(state.apiUrl);

    return (
        <div className="animate-slide-up">
            <div className="page-header">
                <div>
                    <h1 className="page-title">System Configuration</h1>
                    <p className="page-subtitle">App Preferences & Database Sync Engine</p>
                </div>
            </div>

            <div className="settings-layout">
                <div className="settings-nav">
                    <div className="settings-nav-item active"><i className="bi bi-sliders"></i> General Preferences</div>
                    <div className="settings-nav-item"><i className="bi bi-hdd-network"></i> Backend Sync</div>
                </div>

                <div className="card">
                    <div className="settings-section-title">Display & Currency</div>

                    <div className="settings-row">
                        <div>
                            <div className="settings-row-label">Primary Currency</div>
                            <div className="settings-row-desc">Global currency symbol applied to all calculations</div>
                        </div>
                        <select
                            className="form-control"
                            style={{ width: 120 }}
                            value={state.currency}
                            onChange={e => dispatch({ type: 'SET_CURRENCY', payload: e.target.value })}
                        >
                            <option value="$">USD ($)</option>
                            <option value="₹">INR (₹)</option>
                            <option value="€">EUR (€)</option>
                            <option value="£">GBP (£)</option>
                        </select>
                    </div>

                    <div className="settings-row">
                        <div>
                            <div className="settings-row-label">Visual Theme</div>
                            <div className="settings-row-desc">Switch between Obsidian Dark and Clean Slate Light</div>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={state.theme === 'dark'}
                                onChange={e => dispatch({ type: 'SET_THEME', payload: e.target.checked ? 'dark' : 'light' })}
                            />
                            <span className="toggle-track"></span>
                        </label>
                    </div>

                    <div className="settings-row">
                        <div>
                            <div className="settings-row-label">Backend API URL</div>
                            <div className="settings-row-desc">Express server port configuration</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input
                                className="form-control"
                                style={{ width: 220 }}
                                value={apiUrlInput}
                                onChange={e => setApiUrlInput(e.target.value)}
                            />
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => dispatch({ type: 'SET_API_URL', payload: apiUrlInput })}
                            >
                                Update
                            </button>
                        </div>
                    </div>

                    <div className="settings-row" style={{ marginTop: 24, paddingTop: 16 }}>
                        <div>
                            <div className="settings-row-label text-danger">Reset Local Environment</div>
                            <div className="settings-row-desc">Restores initial seed transactions & clears cache</div>
                        </div>
                        <button className="btn btn-danger btn-sm" onClick={() => dispatch({ type: 'RESET_DATA' })}>
                            Reset All Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// AUTH SCREEN
// ============================================================
function AuthView() {
    const { state, dispatch, apiRequest } = useContext(ExpenseContext);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const body = isLogin ? { email, password } : { email, password, name };
            const data = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify(body)
            });

            if (data.token) {
                dispatch({
                    type: 'AUTH_SUCCESS',
                    payload: { token: data.token, email: data.email || email, currency: data.currency }
                });
                return;
            }
        } catch (err) {
            console.warn('Backend endpoint unreachable, logging in locally:', err);
            dispatch({
                type: 'AUTH_SUCCESS',
                payload: { token: 'render_session_' + Date.now(), email: email || 'user@expenseos.com' }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-screen">
            <div className="auth-feature-col">
                <div className="auth-feature-content">
                    <div className="auth-feature-eyebrow">
                        <i className="bi bi-sparkles"></i> Billion-Dollar Personal Finance OS
                    </div>
                    <h1 className="auth-headline">
                        Master your capital with <span>unrivaled elegance</span>.
                    </h1>
                    <p className="auth-sub">
                        ExpenseOS combines high-frequency transaction ledgering, automated Splitwise settlements, and real-time AI financial intelligence into a minimalist luxury workspace.
                    </p>

                    <div className="auth-features-list">
                        <div className="auth-feature-row">
                            <div className="auth-feature-ico"><i className="bi bi-lightning-charge"></i></div>
                            <div>
                                <h4>Instant Synchronization</h4>
                                <p>Seamless multi-device cloud state with offline sandbox support.</p>
                            </div>
                        </div>
                        <div className="auth-feature-row">
                            <div className="auth-feature-ico"><i className="bi bi-shield-check"></i></div>
                            <div>
                                <h4>Enterprise Vault Security</h4>
                                <p>JWT encrypted authentication and localized offline storage.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-form-col">
                <div className="auth-card">
                    <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create OS Account'}</h2>
                    <p className="auth-subtitle">Enter your credentials to access ExpenseOS</p>

                    <div className="auth-tabs">
                        <button className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>
                            Sign In
                        </button>
                        <button className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>
                            Register
                        </button>
                    </div>

                    {error && (
                        <div style={{ background: 'var(--danger-light)', color: 'var(--danger-text)', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    className="form-control"
                                    placeholder="Alex Miller"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="name@company.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
                            {loading ? 'Authenticating...' : isLogin ? 'Access ExpenseOS' : 'Initialize Account'}
                        </button>
                    </form>

                    <div className="auth-divider">OR</div>

                    <button
                        className="auth-offline-btn"
                        onClick={() => dispatch({ type: 'AUTH_SUCCESS', payload: { token: 'offline_token', email: 'guest@expenseos.local' } })}
                    >
                        <i className="bi bi-hdd-fill"></i> Continue in Local Sandbox Mode
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================
function MainApp() {
    const { state } = useContext(ExpenseContext);
    const [activeTab, setActiveTab] = useState('timeline');
    const [collapsed, setCollapsed] = useState(false);
    const [isCmdOpen, setIsCmdOpen] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    // Keyboard shortcut for Cmd+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCmdOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!state.token) {
        return <AuthView />;
    }

    return (
        <div className="app-shell">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <main className={`main-area ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <TopBar
                    onOpenCmd={() => setIsCmdOpen(true)}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <div className="page-content">
                    {activeTab === 'timeline' && <TimelineView />}
                    {activeTab === 'memory_search' && <AIMemoryView />}
                    {activeTab === 'subscriptions' && <SubscriptionsView />}
                    {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
                    {activeTab === 'transactions' && <TransactionsView />}
                    {activeTab === 'budgets' && <BudgetsView />}
                    {activeTab === 'splitwise' && <SplitwiseView />}
                    {activeTab === 'calculators' && <CalculatorsView />}
                    {activeTab === 'settings' && <SettingsView />}
                </div>
            </main>

            <AIChatDock />

            <BottomNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenImport={() => setShowImportModal(true)}
            />

            {showImportModal && <StatementImportModal onClose={() => setShowImportModal(false)} />}

            <CommandPalette
                isOpen={isCmdOpen}
                onClose={() => setIsCmdOpen(false)}
                setActiveTab={setActiveTab}
            />
        </div>
    );
}

export default function App() {
    return (
        <ExpenseProvider>
            <MainApp />
        </ExpenseProvider>
    );
}

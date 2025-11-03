// storage.js - LocalStorage Management

const STORAGE_KEYS = {
    TRANSACTIONS: 'financeTracker_transactions',
    SETTINGS: 'financeTracker_settings',
    THEME: 'financeTracker_theme'
};

// Default categories
const DEFAULT_CATEGORIES = {
    income: ['💰 Salary', '💼 Freelance', '🏢 Business', '📈 Investment', '🎁 Gift', '💵 Other Income'],
    expense: ['🍔 Food & Dining', '🚗 Transportation', '🛍️ Shopping', '🎬 Entertainment', '💡 Bills & Utilities', '⚕️ Healthcare', '📚 Education', '✈️ Travel', '🛒 Groceries', '💸 Other Expense']
};

// Get all transactions
export function getTransactions() {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
}

// Save transactions
export function saveTransactions(transactions) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

// Add new transaction
export function addTransaction(transaction) {
    const transactions = getTransactions();
    transaction.id = Date.now().toString();
    transaction.createdAt = new Date().toISOString();
    transactions.push(transaction);
    saveTransactions(transactions);
    return transaction;
}

// Update transaction
export function updateTransaction(id, updatedData) {
    const transactions = getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
        transactions[index] = { ...transactions[index], ...updatedData };
        saveTransactions(transactions);
        return transactions[index];
    }
    return null;
}

// Delete transaction
export function deleteTransaction(id) {
    const transactions = getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    saveTransactions(filtered);
    return filtered;
}

// Get settings
export function getSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
        currency: '₹',
        monthlyBudget: null
    };
}

// Save settings
export function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// Get theme
export function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
}

// Save theme
export function saveTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

// Clear all data
export function clearAllData() {
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
}

// Calculate totals
export function calculateTotals() {
    const transactions = getTransactions();
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const balance = income - expenses;
    
    return { income, expenses, balance };
}

// Get expenses by category
export function getExpensesByCategory() {
    const transactions = getTransactions();
    const expenses = transactions.filter(t => t.type === 'expense');
    
    const categoryMap = {};
    expenses.forEach(t => {
        if (!categoryMap[t.category]) {
            categoryMap[t.category] = 0;
        }
        categoryMap[t.category] += parseFloat(t.amount);
    });
    
    return categoryMap;
}

// Export to CSV
export function exportToCSV() {
    const transactions = getTransactions();
    if (transactions.length === 0) {
        return null;
    }
    
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
    const rows = transactions.map(t => [
        t.date,
        t.type,
        t.category,
        t.amount,
        t.description || ''
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    return csvContent;
}

// Import from CSV
export function importFromCSV(csvContent) {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) return 0;
    
    const headers = lines[0].toLowerCase();
    const transactions = getTransactions();
    let imported = 0;
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].match(/(?:"([^"]*)"|([^,]+))(?:,|$)/g);
        if (values && values.length >= 4) {
            const transaction = {
                id: Date.now().toString() + i,
                date: values[0].replace(/[,"]/g, '').trim(),
                type: values[1].replace(/[,"]/g, '').trim().toLowerCase(),
                category: values[2].replace(/[,"]/g, '').trim(),
                amount: parseFloat(values[3].replace(/[,"]/g, '').trim()),
                description: values[4] ? values[4].replace(/[,"]/g, '').trim() : '',
                createdAt: new Date().toISOString()
            };
            
            if (transaction.type === 'income' || transaction.type === 'expense') {
                transactions.push(transaction);
                imported++;
            }
        }
    }
    
    saveTransactions(transactions);
    return imported;
}

// Get categories
export function getCategories(type = null) {
    if (type === 'income') return DEFAULT_CATEGORIES.income;
    if (type === 'expense') return DEFAULT_CATEGORIES.expense;
    return { ...DEFAULT_CATEGORIES };
}

// Get all unique categories from transactions
export function getAllUsedCategories() {
    const transactions = getTransactions();
    const categories = new Set();
    transactions.forEach(t => categories.add(t.category));
    return Array.from(categories);
}
// transactions.js - Transactions Page

import { 
    getTransactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    getSettings,
    getCategories,
    getAllUsedCategories,
    getTheme,
    saveTheme
} from './storage.js';
import { validateTransaction, showError, hideError } from './validation.js';

let currentEditId = null;
let currentType = 'income';
let currentFilter = { type: 'all', category: 'all', month: '' };

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupThemeToggle();
    setupEventListeners();
    loadTransactions();
    populateFilters();
    setDefaultDate();
});

// Initialize theme
function initializeTheme() {
    const theme = getTheme();
    if (theme === 'dark') {
        document.body.classList.add('dark');
    }
}

// Setup theme toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
            saveTheme(newTheme);
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Add transaction button
    document.getElementById('addTransactionBtn')?.addEventListener('click', openModal);
    
    // Modal controls
    document.getElementById('closeModal')?.addEventListener('click', closeModal);
    document.getElementById('cancelBtn')?.addEventListener('click', closeModal);
    
    // Type toggle buttons
    document.getElementById('typeIncome')?.addEventListener('click', () => selectType('income'));
    document.getElementById('typeExpense')?.addEventListener('click', () => selectType('expense'));
    
    // Form submit
    document.getElementById('transactionForm')?.addEventListener('submit', handleSubmit);
    
    // Filters
    document.getElementById('filterType')?.addEventListener('change', handleFilterChange);
    document.getElementById('filterCategory')?.addEventListener('change', handleFilterChange);
    document.getElementById('filterMonth')?.addEventListener('change', handleFilterChange);
    
    // Close modal on outside click
    document.getElementById('transactionModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'transactionModal') {
            closeModal();
        }
    });
}

// Open modal
function openModal(editTransaction = null) {
    const modal = document.getElementById('transactionModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('transactionForm');
    
    if (editTransaction) {
        currentEditId = editTransaction.id;
        modalTitle.textContent = 'Edit Transaction';
        
        // Populate form
        selectType(editTransaction.type);
        document.getElementById('amount').value = editTransaction.amount;
        document.getElementById('date').value = editTransaction.date;
        document.getElementById('description').value = editTransaction.description || '';
        
        // Update categories and select
        updateCategoryOptions();
        document.getElementById('category').value = editTransaction.category;
    } else {
        currentEditId = null;
        modalTitle.textContent = 'Add Transaction';
        form.reset();
        selectType('income');
        setDefaultDate();
        updateCategoryOptions();
    }
    
    hideError('errorMessage');
    modal.classList.remove('hidden');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('transactionModal');
    modal.classList.add('hidden');
    currentEditId = null;
}

// Select transaction type
function selectType(type) {
    currentType = type;
    const incomeBtn = document.getElementById('typeIncome');
    const expenseBtn = document.getElementById('typeExpense');
    
    if (type === 'income') {
        incomeBtn.classList.add('bg-green-50', 'border-green-500', 'text-green-600');
        incomeBtn.classList.remove('border-slate-300', 'text-slate-600');
        expenseBtn.classList.remove('bg-red-50', 'border-red-500', 'text-red-600');
        expenseBtn.classList.add('border-slate-300', 'text-slate-600');
    } else {
        expenseBtn.classList.add('bg-red-50', 'border-red-500', 'text-red-600');
        expenseBtn.classList.remove('border-slate-300', 'text-slate-600');
        incomeBtn.classList.remove('bg-green-50', 'border-green-500', 'text-green-600');
        incomeBtn.classList.add('border-slate-300', 'text-slate-600');
    }
    
    updateCategoryOptions();
}

// Update category options based on type
function updateCategoryOptions() {
    const categorySelect = document.getElementById('category');
    const categories = getCategories(currentType);
    
    // Ensure categories is always an array
    const categoryArray = Array.isArray(categories) ? categories : [];
    
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    categoryArray.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
}

// Set default date to today
function setDefaultDate() {
    const dateInput = document.getElementById('date');
    if (dateInput && !currentEditId) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
}

// Handle form submit
function handleSubmit(e) {
    e.preventDefault();
    
    const formData = {
        type: currentType,
        category: document.getElementById('category').value,
        amount: document.getElementById('amount').value,
        date: document.getElementById('date').value,
        description: document.getElementById('description').value
    };
    
    // Validate
    const errors = validateTransaction(formData);
    if (errors.length > 0) {
        showError('errorMessage', errors.join('. '));
        return;
    }
    
    // Save transaction
    if (currentEditId) {
        updateTransaction(currentEditId, formData);
    } else {
        addTransaction(formData);
    }
    
    closeModal();
    loadTransactions();
}

// Load and display transactions
function loadTransactions() {
    let transactions = getTransactions();
    const settings = getSettings();
    const transactionsList = document.getElementById('transactionsList');
    const emptyState = document.getElementById('emptyState');
    
    // Apply filters
    transactions = applyFilters(transactions);
    
    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = '';
        emptyState?.classList.remove('hidden');
        return;
    }
    
    emptyState?.classList.add('hidden');
    
    transactionsList.innerHTML = transactions.map(t => `
        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-200 group">
            <div class="flex items-center space-x-4 flex-1">
                <div class="${t.type === 'income' ? 'bg-green-100' : 'bg-red-100'} p-3 rounded-lg">
                    <svg class="w-5 h-5 ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        ${t.type === 'income' ? 
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>' :
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>'
                        }
                    </svg>
                </div>
                <div class="flex-1">
                    <div class="flex items-center space-x-2">
                        <h4 class="font-semibold text-slate-800">${t.category}</h4>
                        <span class="px-2 py-1 text-xs rounded-full ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                            ${t.type}
                        </span>
                    </div>
                    <p class="text-sm text-slate-500">${formatDate(t.date)}</p>
                    ${t.description ? `<p class="text-sm text-slate-600 mt-1">${t.description}</p>` : ''}
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <p class="font-bold text-lg ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                    ${t.type === 'income' ? '+' : '-'}${settings.currency}${parseFloat(t.amount).toFixed(2)}
                </p>
                <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button onclick="window.editTransaction('${t.id}')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button onclick="window.deleteTransactionConfirm('${t.id}')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Apply filters
function applyFilters(transactions) {
    let filtered = [...transactions];
    
    // Type filter
    if (currentFilter.type !== 'all') {
        filtered = filtered.filter(t => t.type === currentFilter.type);
    }
    
    // Category filter
    if (currentFilter.category !== 'all') {
        filtered = filtered.filter(t => t.category === currentFilter.category);
    }
    
    // Month filter
    if (currentFilter.month) {
        const [year, month] = currentFilter.month.split('-');
        filtered = filtered.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getFullYear() === parseInt(year) && 
                   tDate.getMonth() === parseInt(month) - 1;
        });
    }
    
    return filtered;
}

// Handle filter change
function handleFilterChange() {
    currentFilter = {
        type: document.getElementById('filterType').value,
        category: document.getElementById('filterCategory').value,
        month: document.getElementById('filterMonth').value
    };
    loadTransactions();
}

// Populate filter options
function populateFilters() {
    const categoryFilter = document.getElementById('filterCategory');
    const allCategories = getAllUsedCategories();
    
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    allCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Global functions for edit and delete
window.editTransaction = (id) => {
    const transactions = getTransactions();
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
        openModal(transaction);
    }
};

window.deleteTransactionConfirm = (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
        deleteTransaction(id);
        loadTransactions();
    }
};
// main.js - Dashboard Page

import { getTransactions, calculateTotals, getSettings, getTheme, saveTheme } from './storage.js';
import { initCharts, updateCharts } from './charts.js';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupThemeToggle();
    updateDashboard();
    initCharts();
    loadRecentTransactions();
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

// Update dashboard with totals
function updateDashboard() {
    const { income, expenses, balance } = calculateTotals();
    const settings = getSettings();
    const currency = settings.currency;
    
    // Update summary cards
    const totalIncomeEl = document.getElementById('totalIncome');
    const totalExpensesEl = document.getElementById('totalExpenses');
    const balanceEl = document.getElementById('balance');
    
    if (totalIncomeEl) {
        totalIncomeEl.textContent = `${currency}${income.toFixed(2)}`;
    }
    
    if (totalExpensesEl) {
        totalExpensesEl.textContent = `${currency}${expenses.toFixed(2)}`;
    }
    
    if (balanceEl) {
        balanceEl.textContent = `${currency}${balance.toFixed(2)}`;
        // Change color based on balance
        if (balance < 0) {
            balanceEl.classList.add('text-red-600');
            balanceEl.classList.remove('text-green-600', 'text-slate-800');
        } else if (balance > 0) {
            balanceEl.classList.add('text-green-600');
            balanceEl.classList.remove('text-red-600', 'text-slate-800');
        }
    }
    
    // Update charts
    updateCharts();
}

// Load recent transactions (last 5)
function loadRecentTransactions() {
    const transactions = getTransactions();
    const settings = getSettings();
    const recentTransactionsList = document.getElementById('recentTransactionsList');
    
    if (!recentTransactionsList) return;
    
    // Sort by date (newest first)
    const sorted = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recent = sorted.slice(0, 5);
    
    if (recent.length === 0) {
        recentTransactionsList.innerHTML = `
            <div class="text-center py-8 text-slate-500">
                <svg class="w-16 h-16 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p>No transactions yet. Start by adding your first transaction!</p>
            </div>
        `;
        return;
    }
    
    recentTransactionsList.innerHTML = recent.map(t => `
        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-200">
            <div class="flex items-center space-x-4">
                <div class="${t.type === 'income' ? 'bg-green-100' : 'bg-red-100'} p-3 rounded-lg">
                    <svg class="w-5 h-5 ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        ${t.type === 'income' ? 
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>' :
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>'
                        }
                    </svg>
                </div>
                <div>
                    <h4 class="font-semibold text-slate-800">${t.category}</h4>
                    <p class="text-sm text-slate-500">${formatDate(t.date)}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                    ${t.type === 'income' ? '+' : '-'}${settings.currency}${parseFloat(t.amount).toFixed(2)}
                </p>
            </div>
        </div>
    `).join('');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
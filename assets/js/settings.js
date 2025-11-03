// settings.js - Settings Page

import {
    getSettings,
    saveSettings,
    clearAllData,
    calculateTotals,
    exportToCSV,
    importFromCSV,
    getTheme,
    saveTheme
} from './storage.js';
import { validateBudget, showToast } from './validation.js';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupThemeToggle();
    loadSettings();
    setupEventListeners();
    updateBudgetStatus();
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

// Load current settings
function loadSettings() {
    const settings = getSettings();
    
    // Load currency
    const currencySelect = document.getElementById('currencySymbol');
    if (currencySelect) {
        currencySelect.value = settings.currency;
    }
    
    // Load budget
    const budgetInput = document.getElementById('monthlyBudget');
    if (budgetInput && settings.monthlyBudget) {
        budgetInput.value = settings.monthlyBudget;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Save budget
    document.getElementById('saveBudget')?.addEventListener('click', saveBudget);
    
    // Save currency
    document.getElementById('saveCurrency')?.addEventListener('click', saveCurrency);
    
    // Export data
    document.getElementById('exportData')?.addEventListener('click', exportData);
    
    // Import data
    document.getElementById('importData')?.addEventListener('click', () => {
        document.getElementById('importFile')?.click();
    });
    
    document.getElementById('importFile')?.addEventListener('change', importData);
    
    // Clear all data
    document.getElementById('clearAllData')?.addEventListener('click', showConfirmModal);
    
    // Confirmation modal
    document.getElementById('cancelConfirm')?.addEventListener('click', hideConfirmModal);
    document.getElementById('confirmDelete')?.addEventListener('click', confirmClearData);
    
    // Close modal on outside click
    document.getElementById('confirmModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'confirmModal') {
            hideConfirmModal();
        }
    });
}

// Save budget
function saveBudget() {
    const budgetInput = document.getElementById('monthlyBudget');
    const amount = budgetInput.value;
    
    const error = validateBudget(amount);
    if (error) {
        showToast(error, 'error');
        return;
    }
    
    const settings = getSettings();
    settings.monthlyBudget = parseFloat(amount);
    saveSettings(settings);
    
    updateBudgetStatus();
    showToast('Monthly budget saved successfully!');
}

// Save currency
function saveCurrency() {
    const currencySelect = document.getElementById('currencySymbol');
    const currency = currencySelect.value;
    
    const settings = getSettings();
    settings.currency = currency;
    saveSettings(settings);
    
    showToast('Currency updated successfully!');
}

// Update budget status
function updateBudgetStatus() {
    const settings = getSettings();
    const budgetStatus = document.getElementById('budgetStatus');
    
    if (!settings.monthlyBudget || !budgetStatus) return;
    
    const { expenses } = calculateTotals();
    const budget = settings.monthlyBudget;
    const percentage = Math.min((expenses / budget) * 100, 100);
    const remaining = Math.max(budget - expenses, 0);
    
    // Show budget status
    budgetStatus.classList.remove('hidden');
    
    // Update progress bar
    const progressBar = document.getElementById('budgetProgress');
    const percentageText = document.getElementById('budgetPercentage');
    const remainingText = document.getElementById('budgetRemaining');
    
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        
        // Change color based on usage
        progressBar.classList.remove('bg-blue-600', 'bg-yellow-500', 'bg-red-600');
        if (percentage >= 90) {
            progressBar.classList.add('bg-red-600');
        } else if (percentage >= 70) {
            progressBar.classList.add('bg-yellow-500');
        } else {
            progressBar.classList.add('bg-blue-600');
        }
    }
    
    if (percentageText) {
        percentageText.textContent = `${percentage.toFixed(1)}%`;
    }
    
    if (remainingText) {
        remainingText.textContent = `${settings.currency}${remaining.toFixed(2)}`;
    }
}

// Export data to CSV
function exportData() {
    const csvContent = exportToCSV();
    
    if (!csvContent) {
        showToast('No data to export', 'error');
        return;
    }
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showToast('Data exported successfully!');
}

// Import data from CSV
function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const csvContent = event.target.result;
            const imported = importFromCSV(csvContent);
            
            if (imported > 0) {
                showToast(`Successfully imported ${imported} transactions!`);
                updateBudgetStatus();
            } else {
                showToast('No valid transactions found in the file', 'error');
            }
        } catch (error) {
            showToast('Error importing file. Please check the format.', 'error');
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    e.target.value = '';
}

// Show confirmation modal
function showConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Hide confirmation modal
function hideConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Confirm and clear all data
function confirmClearData() {
    clearAllData();
    hideConfirmModal();
    showToast('All data has been cleared successfully!');
    
    // Reset form
    document.getElementById('monthlyBudget').value = '';
    document.getElementById('currencySymbol').value = '₹';
    document.getElementById('budgetStatus')?.classList.add('hidden');
}
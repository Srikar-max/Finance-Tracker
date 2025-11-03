// validation.js - Input Validation

export function validateTransaction(data) {
    const errors = [];
    
    
    if (!data.type || (data.type !== 'income' && data.type !== 'expense')) {
        errors.push('Please select a valid transaction type');
    }
    
    // Validate category
    if (!data.category || data.category.trim() === '') {
        errors.push('Please select a category');
    }
    
    // Validate amount
    if (!data.amount || isNaN(data.amount) || parseFloat(data.amount) <= 0) {
        errors.push('Please enter a valid amount greater than 0');
    }
    
    // Validate date
    if (!data.date || data.date.trim() === '') {
        errors.push('Please select a date');
    } else {
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (selectedDate > today) {
            errors.push('Date cannot be in the future');
        }
    }
    
    return errors;
}

export function validateBudget(amount) {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        return 'Please enter a valid budget amount greater than 0';
    }
    return null;
}

export function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        setTimeout(() => {
            errorElement.classList.add('hidden');
        }, 5000);
    }
}

export function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}

export function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.remove('hidden', 'bg-green-600', 'bg-red-600', 'bg-blue-600');
        
        if (type === 'error') {
            toast.classList.add('bg-red-600');
        } else if (type === 'info') {
            toast.classList.add('bg-blue-600');
        } else {
            toast.classList.add('bg-green-600');
        }
        
        toast.classList.add('toast-animation');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}
// charts.js - Chart.js Integration

import { getTransactions, getExpensesByCategory, getSettings } from './storage.js';

let expensesPieChart = null;
let incomeExpensesChart = null;

// Initialize charts
export function initCharts() {
    createExpensesPieChart();
    createIncomeExpensesChart();
}

// Update all charts
export function updateCharts() {
    updateExpensesPieChart();
    updateIncomeExpensesChart();
}

// Create Expenses Pie Chart
function createExpensesPieChart() {
    const ctx = document.getElementById('expensesPieChart');
    if (!ctx) return;
    
    const expensesByCategory = getExpensesByCategory();
    const labels = Object.keys(expensesByCategory);
    const data = Object.values(expensesByCategory);
    
    const colors = [
        '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
        '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'
    ];
    
    if (expensesPieChart) {
        expensesPieChart.destroy();
    }
    
    expensesPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.length > 0 ? labels : ['No Data'],
            datasets: [{
                data: data.length > 0 ? data : [1],
                backgroundColor: labels.length > 0 ? colors.slice(0, labels.length) : ['#E2E8F0'],
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const settings = getSettings();
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${settings.currency}${value.toFixed(2)}`;
                        }
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Create Income vs Expenses Chart
function createIncomeExpensesChart() {
    const ctx = document.getElementById('incomeExpensesChart');
    if (!ctx) return;
    
    const transactions = getTransactions();
    const monthlyData = calculateMonthlyData(transactions);
    
    if (incomeExpensesChart) {
        incomeExpensesChart.destroy();
    }
    
    incomeExpensesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthlyData.labels,
            datasets: [
                {
                    label: 'Income',
                    data: monthlyData.income,
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: '#10B981',
                    borderWidth: 2,
                    borderRadius: 8,
                    hoverBackgroundColor: '#10B981'
                },
                {
                    label: 'Expenses',
                    data: monthlyData.expenses,
                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                    borderColor: '#EF4444',
                    borderWidth: 2,
                    borderRadius: 8,
                    hoverBackgroundColor: '#EF4444'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            const settings = getSettings();
                            return settings.currency + value;
                        },
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 15,
                        font: {
                            size: 13,
                            weight: '600'
                        },
                        usePointStyle: true,
                        pointStyle: 'rectRounded'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const settings = getSettings();
                            const label = context.dataset.label || '';
                            const value = context.parsed.y || 0;
                            return `${label}: ${settings.currency}${value.toFixed(2)}`;
                        }
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Calculate monthly data for the last 6 months
function calculateMonthlyData(transactions) {
    const months = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            label: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
            year: date.getFullYear(),
            month: date.getMonth(),
            income: 0,
            expenses: 0
        });
    }
    
    // Calculate totals for each month
    transactions.forEach(t => {
        const date = new Date(t.date);
        const month = months.find(m => m.year === date.getFullYear() && m.month === date.getMonth());
        if (month) {
            if (t.type === 'income') {
                month.income += parseFloat(t.amount);
            } else {
                month.expenses += parseFloat(t.amount);
            }
        }
    });
    
    return {
        labels: months.map(m => m.label),
        income: months.map(m => m.income),
        expenses: months.map(m => m.expenses)
    };
}

// Update Expenses Pie Chart
function updateExpensesPieChart() {
    if (!expensesPieChart) return;
    
    const expensesByCategory = getExpensesByCategory();
    const labels = Object.keys(expensesByCategory);
    const data = Object.values(expensesByCategory);
    
    const colors = [
        '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
        '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'
    ];
    
    expensesPieChart.data.labels = labels.length > 0 ? labels : ['No Data'];
    expensesPieChart.data.datasets[0].data = data.length > 0 ? data : [1];
    expensesPieChart.data.datasets[0].backgroundColor = labels.length > 0 ? colors.slice(0, labels.length) : ['#E2E8F0'];
    expensesPieChart.update();
}

// Update Income vs Expenses Chart
function updateIncomeExpensesChart() {
    if (!incomeExpensesChart) return;
    
    const transactions = getTransactions();
    const monthlyData = calculateMonthlyData(transactions);
    
    incomeExpensesChart.data.labels = monthlyData.labels;
    incomeExpensesChart.data.datasets[0].data = monthlyData.income;
    incomeExpensesChart.data.datasets[1].data = monthlyData.expenses;
    incomeExpensesChart.update();
}
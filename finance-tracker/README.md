# Finance & Budget Tracker 💰

A fully responsive Finance and Budget Tracking System built with pure HTML5, Tailwind CSS, Vanilla JavaScript (ES6), Chart.js, and LocalStorage API.

## 🌟 Features

### Dashboard
- **Real-time Summary Cards** - Total Income, Total Expenses, and Balance with color-coded indicators
- **Interactive Charts** 
  - Doughnut chart showing expenses by category
  - Bar chart comparing income vs expenses over the last 6 months
- **Recent Transactions** - Quick view of the last 5 transactions

### Transactions Management
- **Add Transactions** - Income or Expense with category, amount, date, and optional description
- **Edit & Delete** - Full CRUD operations on all transactions
- **Smart Filtering** - Filter by type (Income/Expense), category, or month
- **Validation** - Prevents invalid inputs (empty fields, negative values, future dates)

### Settings
- **Monthly Budget** - Set and track monthly budget with visual progress bar
- **Currency Selection** - Choose between ₹ (Rupee), $ (Dollar), or € (Euro)
- **Data Export/Import** - Export transactions to CSV and import from CSV files
- **Dark/Light Mode** - Toggle between themes with persistent preference
- **Clear All Data** - Reset everything with confirmation prompt

### Design Highlights
- ✨ Modern, clean UI with professional color scheme
- 🎨 Light slate background (#F1F5F9) with white cards and subtle shadows
- 💚 Green for income, 🔴 Red for expenses, 🔵 Blue for primary actions
- 📱 Fully responsive - works on desktop, tablet, and mobile
- ⚡ Smooth animations and transitions
- ♿ Accessible with proper labels and semantic HTML

## 🚀 How to Use

### Option 1: Using Python HTTP Server (Recommended)
```bash
cd /app/finance-tracker
python3 -m http.server 8080
```
Then open: http://localhost:8080/index.html

### Option 2: Using any other HTTP server
You need an HTTP server because the app uses ES6 modules. Simply serve the files using any web server.

## 📁 File Structure

```
finance-tracker/
├── index.html              # Dashboard page
├── transactions.html       # Transactions management page
├── settings.html          # Settings and preferences page
├── assets/
│   ├── css/
│   │   └── styles.css     # Custom styles and dark mode
│   └── js/
│       ├── main.js        # Dashboard functionality
│       ├── transactions.js # Transaction management
│       ├── settings.js    # Settings functionality
│       ├── storage.js     # LocalStorage management
│       ├── validation.js  # Input validation
│       └── charts.js      # Chart.js integration
└── README.md
```

## 💾 Data Storage

All data is stored locally in your browser using LocalStorage:
- Transactions are persisted across sessions
- Settings (currency, budget) are saved
- Theme preference is remembered
- No backend required - everything works offline!

## 🎯 Quick Start Guide

1. **Start the server**
   ```bash
   cd /app/finance-tracker
   python3 -m http.server 8080
   ```

2. **Open the app** at http://localhost:8080/index.html

3. **Add your first transaction**
   - Go to Transactions page
   - Click "Add Transaction"
   - Select Income/Expense
   - Choose category, enter amount and date
   - Add optional description
   - Click Save

4. **Set your budget** (Optional)
   - Go to Settings
   - Enter your monthly budget
   - Click Save Budget
   - Track your spending progress

5. **Customize**
   - Change currency symbol in Settings
   - Toggle dark/light mode using the moon/sun icon
   - Export your data for backup

## 📊 Default Categories

**Income Categories:**
- Salary
- Freelance
- Business
- Investment
- Gift
- Other Income

**Expense Categories:**
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Travel
- Groceries
- Other Expense

## 🎨 Color Scheme

- **Background**: #F1F5F9 (Light Slate)
- **Cards**: White (#FFFFFF)
- **Income**: #10B981 (Green)
- **Expense**: #EF4444 (Red)
- **Primary/Buttons**: #3B82F6 (Blue)
- **Text**: #1E293B (Dark Slate)
- **Borders**: #E2E8F0 (Light Gray)

## ⚡ Features in Action

### Auto-calculations
- Balance updates in real-time
- Charts refresh automatically
- Budget progress bar updates instantly

### Smart Validation
- Amount must be greater than 0
- Date cannot be in the future
- Category and type are required
- Helpful error messages

### Data Management
- Export all transactions to CSV
- Import transactions from CSV
- Clear all data with confirmation

## 🌙 Dark Mode

Toggle between light and dark themes using the moon/sun icon in the navigation bar. Your preference is saved automatically.

## 💡 Tips

1. **Regular Backups**: Export your data regularly using the CSV export feature
2. **Set Budget Early**: Set your monthly budget first to track spending better
3. **Use Descriptions**: Add descriptions to transactions for better tracking
4. **Filter Smart**: Use month filters to see spending patterns over time
5. **Check Dashboard**: Review the dashboard regularly to stay on top of finances

## 🔒 Privacy

- All data stays on your device
- No server, no tracking, no cloud storage
- Complete privacy and offline functionality
- Clear data anytime from Settings

## 📱 Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (Recommended)
- Firefox
- Safari
- Opera

Requires ES6 module support and LocalStorage.

## 🎉 Enjoy Tracking Your Finances!

Start managing your money better today with this beautiful, feature-rich finance tracker!

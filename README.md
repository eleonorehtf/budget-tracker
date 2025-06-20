# Budget Tracker App

A modern, responsive web application to help you track your budget and manage your finances effectively.

## Features

### 🎯 Budget Setup
- **Net Income Tracking**: Set your monthly net income as the foundation for your budget
- **Organized Categories**: Pre-filled categories organized by type (Fixed Expenses, Variable Expenses, Savings & Investments, Personal & Lifestyle)
- **Sub-categories Support**: Create detailed sub-categories for complex categories like Subscriptions
- **Dynamic Budget Allocation**: Allocate amounts to each category with real-time feedback
- **Budget Warnings**: Visual warnings when you exceed your net income
- **Remaining Budget Display**: See exactly how much budget you have left to allocate

### 💰 Transaction Management
- **Income & Expense Tracking**: Log both income and expenses
- **Category-based Organization**: Assign transactions to specific budget categories or sub-categories
- **Date Tracking**: Keep track of when transactions occurred
- **Description Support**: Add detailed descriptions for each transaction

### 📊 Dashboard & Analytics
- **Overview Cards**: Quick view of net income, total expenses, and remaining budget
- **List Format Categories**: Clean, organized view of budget categories by type
- **Sub-category Tracking**: Detailed tracking for categories with sub-categories
- **Progress Tracking**: Visual progress bars for each budget category
- **Color-coded Status**: Green (on track), Yellow (warning), Red (over budget)
- **Recent Transactions**: View your latest 10 transactions

### 🎨 Customization
- **Custom Categories**: Add your own budget categories with custom colors
- **Sub-category Creation**: Add detailed sub-categories to any category
- **Flexible Budgeting**: Modify your budget setup anytime
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## Budget Categories

### Fixed Expenses
- Rent / Mortgage
- Utilities (electricity, gas, water)
- Internet & Phone
- Insurance (health, auto, home, renters)
- Loan Payments (student, personal, auto)

### Variable Expenses
- Groceries
- Dining Out / Takeout
- Transportation (gas, public transport, ride-share)
- Medical / Healthcare (out-of-pocket, prescriptions)
- Household Supplies (cleaning, toiletries)

### Savings & Investments
- Emergency Fund
- Retirement Contributions
- Investment Accounts
- Short-term Savings Goals (vacation, large purchases)

### Personal & Lifestyle
- Clothing
- Gym / Fitness
- **Subscriptions** (with sub-categories for individual services)
- Travel / Vacations
- Gifts & Donations

## Sub-categories Feature

### Subscriptions Category
The Subscriptions category includes sub-categories for individual subscription services:

**Default Sub-categories:**
- Netflix
- Spotify
- Gym Membership

**Adding Sub-categories:**
1. Click the "Add Sub-category" button next to the Subscriptions category
2. Enter the sub-category name (e.g., "Amazon Prime", "YouTube Premium")
3. Set the monthly budget for that specific subscription
4. Save to add it to your budget tracking

**Benefits:**
- Track individual subscription costs separately
- See which subscriptions are using the most budget
- Easily identify subscriptions you might want to cancel
- Better organization of recurring expenses

## How to Use

### First Time Setup
1. **Open the app** by double-clicking `index.html` in your browser
2. **Set your net income** in the budget setup section
3. **Allocate your budget** to different categories by type
4. **Add sub-categories** for Subscriptions or other categories as needed
5. **Add custom categories** if needed
6. **Save your budget** to get started

### Daily Usage
1. **Add transactions** using the "Add Transaction" button
2. **Select categories or sub-categories** when adding expenses
3. **Monitor your progress** through the dashboard
4. **Check category status** to see if you're staying within budget
5. **Adjust your budget** anytime using the "Setup Budget" button

### Budget Management
- **Visual Warnings**: Input fields turn yellow when approaching budget limit, red when exceeding
- **Real-time Updates**: See remaining budget update as you allocate funds
- **Over-budget Alerts**: Get warned if your total allocation exceeds net income
- **Flexible Categories**: Add, modify, or remove categories as needed
- **Organized Display**: Categories are grouped by type for better organization
- **Sub-category Support**: Break down complex categories into detailed tracking

## File Structure

```
Budget/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Technical Details

### Data Storage
- All data is stored locally in your browser using localStorage
- No internet connection required
- Data persists between browser sessions

### Browser Compatibility
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile devices
- No external dependencies except for icons and fonts

### Features Explained

#### Budget Setup Process
1. **Net Income Input**: Enter your monthly take-home pay
2. **Category Allocation**: Distribute your income across spending categories by type
3. **Sub-category Setup**: Add detailed sub-categories for complex categories
4. **Real-time Feedback**: See allocated vs. remaining amounts
5. **Visual Warnings**: Color-coded inputs show budget status
6. **Save & Continue**: Lock in your budget and start tracking

#### Transaction Tracking
- **Type Selection**: Choose between income or expense
- **Amount Entry**: Enter the transaction amount
- **Category Assignment**: Select the appropriate budget category or sub-category
- **Description**: Add details about the transaction
- **Date**: Record when the transaction occurred

#### Dashboard Features
- **Overview Cards**: Three key metrics at a glance
- **Category Lists**: Organized by type with progress tracking
- **Sub-category Display**: Detailed breakdown of complex categories
- **Recent Activity**: Latest transactions for quick reference
- **Budget Status**: Real-time remaining budget calculation

## Tips for Effective Budgeting

1. **Start with Fixed Expenses**: Allocate your essential bills first
2. **Plan for Savings**: Include emergency fund and retirement contributions
3. **Track Subscriptions**: Use sub-categories to monitor individual subscription costs
4. **Track Regularly**: Log transactions as they happen
5. **Review Monthly**: Check your progress and adjust as needed
6. **Use Categories**: Organize spending to identify patterns
7. **Stay Flexible**: Adjust your budget as your needs change

## Getting Started

1. Download or clone this project to your computer
2. Open `index.html` in your web browser
3. Follow the setup process to configure your budget
4. Add sub-categories for your subscriptions
5. Start tracking your income and expenses!

## Support

This is a local web application, so all your data stays on your device. If you need to:
- **Backup data**: Export your browser's localStorage data
- **Reset budget**: Clear your browser's data for this site
- **Move to new device**: Transfer the files and import your data

Enjoy taking control of your finances with your new Budget Tracker! 💰✨ 
// Modern Budget Tracker - Clean & Optimized

class BudgetTracker {
    constructor() {
        this.budgetMode = 'personal'; // 'personal' or 'household'
        this.budget = {};
        this.transactions = [];
        this.jointGoals = [];
        this.partner = {
            name: 'Partner',
            income: 0,
            color: '#ec4899'
        };
        this.yourIncome = 0;
        this.sharedExpensesBudget = 0; // Total shared expenses budget
        this.sharedExpenseCategories = {
            rent: 0,
            utilities: 0,
            internet: 0,
            groceries: 0,
            dining: 0,
            transportation: 0,
            insurance: 0,
            subscriptions: 0,
            entertainment: 0,
            other: 0
        };
        this.categories = this.getDefaultCategories();
        this.customCategories = [];
        
        this.initializeApp();
        this.loadData();
        this.setupEventListeners();
        this.updateUI();
    }

    getDefaultCategories() {
        return {
            'Fixed Expenses': [
                { name: 'Rent/Mortgage', budget: 0, type: 'shared', icon: 'fas fa-home' },
                { name: 'Utilities', budget: 0, type: 'shared', icon: 'fas fa-bolt' },
                { name: 'Insurance', budget: 0, type: 'shared', icon: 'fas fa-shield-alt' },
                { name: 'Phone/Internet', budget: 0, type: 'shared', icon: 'fas fa-wifi' },
                { name: 'Car Payment', budget: 0, type: 'shared', icon: 'fas fa-car' }
            ],
            'Variable Expenses': [
                { name: 'Groceries', budget: 0, type: 'shared', icon: 'fas fa-shopping-cart' },
                { name: 'Gas/Transportation', budget: 0, type: 'shared', icon: 'fas fa-gas-pump' },
                { name: 'Dining Out', budget: 0, type: 'shared', icon: 'fas fa-utensils' },
                { name: 'Entertainment', budget: 0, type: 'shared', icon: 'fas fa-film' },
                { name: 'Shopping', budget: 0, type: 'personal', icon: 'fas fa-shopping-bag' }
            ],
            'Savings & Investments': [
                { name: 'Emergency Fund', budget: 0, type: 'shared', icon: 'fas fa-piggy-bank' },
                { name: 'Retirement', budget: 0, type: 'shared', icon: 'fas fa-chart-line' },
                { name: 'Investments', budget: 0, type: 'shared', icon: 'fas fa-coins' }
            ],
            'Personal & Lifestyle': [
                { name: 'Subscriptions', budget: 0, type: 'shared', icon: 'fas fa-credit-card', 
                  subCategories: [
                      { name: 'Netflix', budget: 0 },
                      { name: 'Spotify', budget: 0 },
                      { name: 'Gym Membership', budget: 0 }
                  ]},
                { name: 'Personal Care', budget: 0, type: 'personal', icon: 'fas fa-spa' },
                { name: 'Hobbies', budget: 0, type: 'personal', icon: 'fas fa-palette' },
                { name: 'Gifts', budget: 0, type: 'personal', icon: 'fas fa-gift' }
            ]
        };
    }

    initializeApp() {
        // Set default date to today
        document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
        
        // Initialize budget mode
        this.updateBudgetModeUI();
    }

    setupEventListeners() {
        // Budget mode toggle
        document.getElementById('personalModeBtn').addEventListener('click', () => this.setBudgetMode('personal'));
        document.getElementById('householdModeBtn').addEventListener('click', () => this.setBudgetMode('household'));

        // Setup and transaction buttons
        document.getElementById('setupBudgetBtn').addEventListener('click', () => this.toggleBudgetSetup());
        document.getElementById('addTransactionBtn').addEventListener('click', () => this.openModal('transactionModal'));

        // Budget setup
        document.getElementById('saveBudgetBtn').addEventListener('click', () => this.saveBudget());
        document.getElementById('addCustomCategoryBtn').addEventListener('click', () => this.openModal('customCategoryModal'));

        // Income inputs for household mode
        document.getElementById('yourIncomeInput').addEventListener('input', () => this.updateHouseholdIncome());
        document.getElementById('partnerIncomeInput').addEventListener('input', () => this.updateHouseholdIncome());

        // Shared expenses category inputs
        document.getElementById('rentBudget').addEventListener('input', () => this.updateSharedExpensesBudget());
        document.getElementById('utilitiesBudget').addEventListener('input', () => this.updateSharedExpensesBudget());
        document.getElementById('internetBudget').addEventListener('input', () => this.updateSharedExpensesBudget());
        document.getElementById('groceriesBudget').addEventListener('input', () => this.updateSharedExpensesBudget());
        document.getElementById('diningBudget').addEventListener('input', () => this.updateSharedExpensesBudget());
        document.getElementById('transportationBudget').addEventListener('input', () => this.updateSharedExpensesBudget());
        document.getElementById('insuranceBudget').addEventListener('input', () => this.updateSharedExpensesBudget());
        document.getElementById('subscriptionsBudget').addEventListener('input', () => this.updateSharedExpensesBudget());
        document.getElementById('entertainmentBudget').addEventListener('input', () => this.updateSharedExpensesBudget());
        document.getElementById('otherSharedBudget').addEventListener('input', () => this.updateSharedExpensesBudget());

        // Partner management
        document.getElementById('editPartnerBtn').addEventListener('click', () => this.openModal('editPartnerModal'));

        // Joint goals
        document.getElementById('addJointGoalBtn').addEventListener('click', () => this.openModal('jointGoalModal'));

        // Category management
        document.getElementById('addCategoryBtn').addEventListener('click', () => this.openModal('categoryModal'));

        // Form submissions
        document.getElementById('transactionForm').addEventListener('submit', (e) => this.handleTransactionSubmit(e));
        document.getElementById('categoryForm').addEventListener('submit', (e) => this.handleCategorySubmit(e));
        document.getElementById('customCategoryForm').addEventListener('submit', (e) => this.handleCustomCategorySubmit(e));
        document.getElementById('jointGoalForm').addEventListener('submit', (e) => this.handleJointGoalSubmit(e));
        document.getElementById('editPartnerForm').addEventListener('submit', (e) => this.handlePartnerSubmit(e));

        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => this.closeAllModals());
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });

        // Income input for personal mode
        document.getElementById('netIncome').addEventListener('input', () => this.updateBudgetAllocation());
    }

    setBudgetMode(mode) {
        this.budgetMode = mode;
        this.updateBudgetModeUI();
        this.updateUI();
        this.saveData();
    }

    updateBudgetModeUI() {
        const personalBtn = document.getElementById('personalModeBtn');
        const householdBtn = document.getElementById('householdModeBtn');
        const householdFeatures = document.getElementById('householdFeatures');
        const personalSetup = document.getElementById('personalSetup');
        const householdSetup = document.getElementById('householdSetup');
        const householdCard = document.getElementById('householdCard');
        const incomeLabel = document.getElementById('incomeLabel');

        if (this.budgetMode === 'personal') {
            personalBtn.classList.add('active');
            householdBtn.classList.remove('active');
            householdFeatures.style.display = 'none';
            personalSetup.style.display = 'block';
            householdSetup.style.display = 'none';
            householdCard.style.display = 'none';
            incomeLabel.textContent = 'Net Income';
        } else {
            personalBtn.classList.remove('active');
            householdBtn.classList.add('active');
            householdFeatures.style.display = 'block';
            personalSetup.style.display = 'none';
            householdSetup.style.display = 'block';
            householdCard.style.display = 'flex';
            incomeLabel.textContent = 'Total Income';
        }
    }

    updateHouseholdIncome() {
        const yourIncome = parseFloat(document.getElementById('yourIncomeInput').value) || 0;
        const partnerIncome = parseFloat(document.getElementById('partnerIncomeInput').value) || 0;
        const total = yourIncome + partnerIncome;

        this.yourIncome = yourIncome;
        this.partner.income = partnerIncome;

        document.getElementById('totalHouseholdIncome').textContent = this.formatCurrency(total);
        document.getElementById('yourIncome').textContent = this.formatCurrency(yourIncome);
        document.getElementById('partnerIncome').textContent = this.formatCurrency(partnerIncome);

        // Calculate contribution percentages
        if (total > 0) {
            const yourContribution = ((yourIncome / total) * 100).toFixed(1);
            const partnerContribution = ((partnerIncome / total) * 100).toFixed(1);
            
            document.getElementById('yourContribution').textContent = yourContribution + '%';
            document.getElementById('partnerContribution').textContent = partnerContribution + '%';
        }

        // Update shared expenses budget calculations
        this.updateSharedExpensesBudget();
        this.updateBudgetAllocation();
    }

    toggleBudgetSetup() {
        const setupSection = document.getElementById('budgetSetupSection');
        const isVisible = setupSection.style.display !== 'none';
        
        if (isVisible) {
            setupSection.style.display = 'none';
        } else {
            setupSection.style.display = 'block';
            this.renderBudgetCategories();
        }
    }

    renderBudgetCategories() {
        const container = document.getElementById('budgetCategoriesSetup');
        container.innerHTML = '';

        Object.entries(this.categories).forEach(([groupName, categories]) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'category-group';
            groupDiv.innerHTML = `
                <h3><i class="fas fa-folder"></i> ${groupName}</h3>
            `;

            categories.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'category-item';
                categoryDiv.innerHTML = `
                    <div class="category-header">
                        <div class="category-name">
                            <i class="${category.icon}"></i>
                            ${category.name}
                            <span class="category-type-badge ${category.type}">${category.type}</span>
                        </div>
                        <div class="category-budget">
                            <span class="currency-symbol">$</span>
                            <input type="number" 
                                   class="category-budget-input" 
                                   data-category="${category.name}" 
                                   data-group="${groupName}"
                                   value="${category.budget}" 
                                   step="0.01" 
                                   min="0"
                                   placeholder="0.00">
                        </div>
                    </div>
                    ${category.subCategories ? this.renderSubCategories(category) : ''}
                `;

                // Add event listener for budget input
                const budgetInput = categoryDiv.querySelector('.category-budget-input');
                budgetInput.addEventListener('input', () => this.updateBudgetAllocation());

                groupDiv.appendChild(categoryDiv);
            });

            container.appendChild(groupDiv);
        });
    }

    renderSubCategories(category) {
        if (!category.subCategories) return '';
        
        // Filter out sub-categories with budget of 0
        const activeSubCategories = category.subCategories.filter(sub => sub.budget > 0);
        
        if (activeSubCategories.length === 0) return '';
        
        const subCategoriesHtml = activeSubCategories.map(sub => {
            const spent = this.calculateSubCategorySpent(category.name, sub.name);
            const percentage = sub.budget > 0 ? (spent / sub.budget) * 100 : 0;
            const status = this.getProgressStatus(percentage);

            return `
                <div class="sub-category-item">
                    <div class="sub-category-header">
                        <div class="sub-category-name">${sub.name}</div>
                        <div class="sub-category-budget">
                            ${this.formatCurrency(spent)} / ${this.formatCurrency(sub.budget)}
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${status}" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        return `<div class="sub-categories">${subCategoriesHtml}</div>`;
    }

    updateBudgetAllocation() {
        let totalBudget = 0;
        let allocatedBudget = 0;

        // Calculate total available budget
        if (this.budgetMode === 'personal') {
            totalBudget = parseFloat(document.getElementById('netIncome').value) || 0;
        } else {
            totalBudget = this.yourIncome + this.partner.income;
        }

        // Calculate allocated budget
        document.querySelectorAll('.category-budget-input').forEach(input => {
            allocatedBudget += parseFloat(input.value) || 0;
        });

        document.querySelectorAll('.sub-category-budget-input').forEach(input => {
            allocatedBudget += parseFloat(input.value) || 0;
        });

        const remaining = totalBudget - allocatedBudget;

        // Update display
        document.getElementById('allocatedAmount').textContent = this.formatCurrency(allocatedBudget);
        document.getElementById('remainingAmount').textContent = this.formatCurrency(remaining);

        // Update budget summary styling
        const remainingElement = document.getElementById('remainingAmount');
        remainingElement.className = remaining < 0 ? 'warning' : 'success';
    }

    saveBudget() {
        // Update category budgets from inputs
        document.querySelectorAll('.category-budget-input').forEach(input => {
            const categoryName = input.dataset.category;
            const groupName = input.dataset.group;
            const budget = parseFloat(input.value) || 0;

            // Find and update the category
            const category = this.categories[groupName].find(cat => cat.name === categoryName);
            if (category) {
                category.budget = budget;
            }
        });

        // Update sub-category budgets
        document.querySelectorAll('.sub-category-budget-input').forEach(input => {
            const categoryName = input.dataset.category;
            const subCategoryName = input.dataset.subcategory;
            const budget = parseFloat(input.value) || 0;

            // Find and update the sub-category
            Object.values(this.categories).forEach(group => {
                const category = group.find(cat => cat.name === categoryName);
                if (category && category.subCategories) {
                    const subCategory = category.subCategories.find(sub => sub.name === subCategoryName);
                    if (subCategory) {
                        subCategory.budget = budget;
                    }
                }
            });
        });

        // Save income
        if (this.budgetMode === 'personal') {
            this.yourIncome = parseFloat(document.getElementById('netIncome').value) || 0;
        }

        this.saveData();
        this.toggleBudgetSetup();
        this.updateUI();
        this.showNotification('Budget saved successfully!', 'success');
    }

    handleTransactionSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const transaction = {
            id: Date.now(),
            type: formData.get('transactionType'),
            amount: parseFloat(formData.get('transactionAmount')),
            category: formData.get('transactionCategory'),
            description: formData.get('transactionDescription'),
            date: formData.get('transactionDate'),
            owner: this.budgetMode === 'household' ? formData.get('transactionOwner') : 'you',
            splitType: this.budgetMode === 'household' ? formData.get('splitType') : '50-50'
        };

        this.transactions.push(transaction);
        this.saveData();
        this.updateUI();
        this.closeAllModals();
        e.target.reset();
        document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
        
        this.showNotification('Transaction added successfully!', 'success');
    }

    handleCategorySubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newCategory = {
            name: formData.get('categoryName'),
            budget: parseFloat(formData.get('categoryBudget')) || 0,
            type: formData.get('categoryType'),
            color: formData.get('categoryColor'),
            icon: 'fas fa-tag'
        };

        this.customCategories.push(newCategory);
        this.saveData();
        this.updateUI();
        this.closeAllModals();
        e.target.reset();
        
        this.showNotification('Category added successfully!', 'success');
    }

    handleCustomCategorySubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newCategory = {
            name: formData.get('customCategoryName'),
            budget: parseFloat(formData.get('customCategoryBudget')) || 0,
            type: formData.get('customCategoryType'),
            color: formData.get('customCategoryColor'),
            icon: 'fas fa-tag'
        };

        this.customCategories.push(newCategory);
        this.saveData();
        this.updateUI();
        this.closeAllModals();
        e.target.reset();
        
        this.showNotification('Custom category added successfully!', 'success');
    }

    handleJointGoalSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newGoal = {
            id: Date.now(),
            name: formData.get('goalName'),
            target: parseFloat(formData.get('goalTarget')) || 0,
            deadline: formData.get('goalDeadline'),
            icon: formData.get('goalIcon'),
            current: 0,
            contributions: {
                you: 0,
                partner: 0
            }
        };

        this.jointGoals.push(newGoal);
        this.saveData();
        this.updateUI();
        this.closeAllModals();
        e.target.reset();
        
        this.showNotification('Joint goal created successfully!', 'success');
    }

    handlePartnerSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        this.partner.name = formData.get('partnerName');
        this.partner.income = parseFloat(formData.get('partnerIncomeEdit')) || 0;
        this.partner.color = formData.get('partnerColor');

        this.saveData();
        this.updateUI();
        this.closeAllModals();
        e.target.reset();
        
        this.showNotification('Partner information updated!', 'success');
    }

    updateUI() {
        this.updateDashboard();
        this.updateBudgetCategories();
        this.updateTransactions();
        this.updateJointGoals();
        this.updateSharedExpensesProgress();
    }

    updateDashboard() {
        const totalIncome = this.budgetMode === 'personal' ? this.yourIncome : (this.yourIncome + this.partner.income);
        const totalExpenses = this.calculateTotalExpenses();
        const remainingBudget = totalIncome - totalExpenses;
        const sharedExpenses = this.calculateSharedExpenses();

        document.getElementById('totalIncome').textContent = this.formatCurrency(totalIncome);
        document.getElementById('totalExpenses').textContent = this.formatCurrency(totalExpenses);
        document.getElementById('remainingBudget').textContent = this.formatCurrency(remainingBudget);
        document.getElementById('sharedExpenses').textContent = this.formatCurrency(sharedExpenses);
    }

    updateBudgetCategories() {
        const container = document.getElementById('budgetCategories');
        container.innerHTML = '';

        // Render default categories
        Object.entries(this.categories).forEach(([groupName, categories]) => {
            // Filter out categories with budget of 0
            const activeCategories = categories.filter(category => category.budget > 0);
            
            // Skip empty groups
            if (activeCategories.length === 0) {
                return;
            }

            const groupDiv = document.createElement('div');
            groupDiv.className = 'category-group';
            groupDiv.innerHTML = `
                <h3><i class="fas fa-folder"></i> ${groupName}</h3>
            `;

            activeCategories.forEach(category => {
                const spent = this.calculateCategorySpent(category.name);
                const percentage = category.budget > 0 ? (spent / category.budget) * 100 : 0;
                const status = this.getProgressStatus(percentage);

                const categoryDiv = document.createElement('div');
                categoryDiv.className = `category-item ${category.type}`;
                categoryDiv.innerHTML = `
                    <div class="category-header">
                        <div class="category-name">
                            <i class="${category.icon}"></i>
                            ${category.name}
                            <span class="category-type-badge ${category.type}">${category.type}</span>
                        </div>
                        <div class="category-budget">
                            ${this.formatCurrency(spent)} / ${this.formatCurrency(category.budget)}
                        </div>
                    </div>
                    <div class="category-progress">
                        <div class="progress-container">
                            <span>${percentage.toFixed(1)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${status}" style="width: ${Math.min(percentage, 100)}%"></div>
                        </div>
                        <div class="progress-labels">
                            <span>Spent: ${this.formatCurrency(spent)}</span>
                            <span>Remaining: ${this.formatCurrency(category.budget - spent)}</span>
                        </div>
                    </div>
                    ${category.subCategories ? this.renderSubCategoriesDisplay(category) : ''}
                `;

                groupDiv.appendChild(categoryDiv);
            });

            container.appendChild(groupDiv);
        });

        // Render custom categories
        const activeCustomCategories = this.customCategories.filter(category => category.budget > 0);
        
        if (activeCustomCategories.length > 0) {
            const customGroupDiv = document.createElement('div');
            customGroupDiv.className = 'category-group';
            customGroupDiv.innerHTML = `
                <h3><i class="fas fa-tags"></i> Custom Categories</h3>
            `;

            activeCustomCategories.forEach(category => {
                const spent = this.calculateCategorySpent(category.name);
                const percentage = category.budget > 0 ? (spent / category.budget) * 100 : 0;
                const status = this.getProgressStatus(percentage);

                const categoryDiv = document.createElement('div');
                categoryDiv.className = `category-item ${category.type}`;
                categoryDiv.innerHTML = `
                    <div class="category-header">
                        <div class="category-name">
                            <i class="${category.icon}"></i>
                            ${category.name}
                            <span class="category-type-badge ${category.type}">${category.type}</span>
                        </div>
                        <div class="category-budget">
                            ${this.formatCurrency(spent)} / ${this.formatCurrency(category.budget)}
                        </div>
                    </div>
                    <div class="category-progress">
                        <div class="progress-container">
                            <span>${percentage.toFixed(1)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${status}" style="width: ${Math.min(percentage, 100)}%"></div>
                        </div>
                        <div class="progress-labels">
                            <span>Spent: ${this.formatCurrency(spent)}</span>
                            <span>Remaining: ${this.formatCurrency(category.budget - spent)}</span>
                        </div>
                    </div>
                `;

                customGroupDiv.appendChild(categoryDiv);
            });

            container.appendChild(customGroupDiv);
        }

        // Show message if no categories have budgets set
        if (container.children.length === 0) {
            container.innerHTML = `
                <div class="empty-categories">
                    <i class="fas fa-chart-pie"></i>
                    <p>No budget categories set up yet. Click "Setup Budget" to get started!</p>
                    <button id="setupBudgetFromEmptyBtn" class="btn btn-primary">
                        <i class="fas fa-cog"></i> Setup Budget
                    </button>
                </div>
            `;
            
            // Add event listener to the dynamically created button
            const setupBudgetBtn = document.getElementById('setupBudgetFromEmptyBtn');
            if (setupBudgetBtn) {
                setupBudgetBtn.addEventListener('click', () => this.toggleBudgetSetup());
            }
        }
    }

    renderSubCategoriesDisplay(category) {
        if (!category.subCategories) return '';
        
        // Filter out sub-categories with budget of 0
        const activeSubCategories = category.subCategories.filter(sub => sub.budget > 0);
        
        if (activeSubCategories.length === 0) return '';
        
        const subCategoriesHtml = activeSubCategories.map(sub => {
            const spent = this.calculateSubCategorySpent(category.name, sub.name);
            const percentage = sub.budget > 0 ? (spent / sub.budget) * 100 : 0;
            const status = this.getProgressStatus(percentage);

            return `
                <div class="sub-category-item">
                    <div class="sub-category-header">
                        <div class="sub-category-name">${sub.name}</div>
                        <div class="sub-category-budget">
                            ${this.formatCurrency(spent)} / ${this.formatCurrency(sub.budget)}
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${status}" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        return `<div class="sub-categories">${subCategoriesHtml}</div>`;
    }

    updateTransactions() {
        const container = document.getElementById('transactionsList');
        container.innerHTML = '';

        const recentTransactions = this.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        if (recentTransactions.length === 0) {
            container.innerHTML = `
                <div class="empty-transactions">
                    <i class="fas fa-receipt"></i>
                    <p>No transactions yet. Add your first transaction!</p>
                </div>
            `;
            return;
        }

        recentTransactions.forEach(transaction => {
            const transactionDiv = document.createElement('div');
            transactionDiv.className = `transaction-item ${transaction.type}`;
            
            const householdInfo = this.budgetMode === 'household' ? `
                <div class="household-transaction-info">
                    <span class="transaction-owner ${transaction.owner}">${transaction.owner}</span>
                    <span>• ${transaction.splitType}</span>
                </div>
            ` : '';

            transactionDiv.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-details">
                        <span>${transaction.category}</span>
                        <span>${new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                    ${householdInfo}
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                </div>
            `;

            container.appendChild(transactionDiv);
        });
    }

    updateJointGoals() {
        const container = document.getElementById('jointGoals');
        
        if (this.jointGoals.length === 0) {
            container.innerHTML = `
                <div class="empty-goals">
                    <i class="fas fa-heart"></i>
                    <p>No joint goals yet. Create your first goal together!</p>
                    <button id="addJointGoalBtn" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Add Joint Goal
                    </button>
                </div>
            `;
            
            // Add event listener to the dynamically created button
            const addJointGoalBtn = document.getElementById('addJointGoalBtn');
            if (addJointGoalBtn) {
                addJointGoalBtn.addEventListener('click', () => this.openModal('jointGoalModal'));
            }
            
            return;
        }

        container.innerHTML = this.jointGoals.map(goal => {
            const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            const status = daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Due Today' : `${daysLeft} days left`;

            return `
                <div class="joint-goal-card">
                    <div class="goal-header">
                        <div class="goal-title">
                            <i class="${goal.icon}"></i>
                            ${goal.name}
                        </div>
                        <span class="goal-status">${status}</span>
                    </div>
                    <div class="goal-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                        </div>
                    </div>
                    <div class="goal-stats">
                        <span>${this.formatCurrency(goal.current)} / ${this.formatCurrency(goal.target)}</span>
                        <span>${progress.toFixed(1)}% Complete</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    calculateTotalExpenses() {
        return this.transactions
            .filter(t => t.type === 'expense')
            .reduce((total, t) => total + t.amount, 0);
    }

    calculateSharedExpenses() {
        return this.transactions
            .filter(t => t.type === 'expense' && t.owner === 'shared')
            .reduce((total, t) => total + t.amount, 0);
    }

    calculateCategorySpent(categoryName) {
        return this.transactions
            .filter(t => t.type === 'expense' && t.category === categoryName)
            .reduce((total, t) => total + t.amount, 0);
    }

    calculateSubCategorySpent(categoryName, subCategoryName) {
        return this.transactions
            .filter(t => t.type === 'expense' && t.category === categoryName && t.subCategory === subCategoryName)
            .reduce((total, t) => total + t.amount, 0);
    }

    getProgressStatus(percentage) {
        if (percentage >= 90) return 'danger';
        if (percentage >= 75) return 'warning';
        return 'safe';
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
        
        // Update transaction modal for household mode
        if (modalId === 'transactionModal') {
            const householdFields = document.getElementById('householdTransactionFields');
            householdFields.style.display = this.budgetMode === 'household' ? 'block' : 'none';
            
            // Populate category dropdown
            this.populateCategoryDropdown();
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    populateCategoryDropdown() {
        const dropdown = document.getElementById('transactionCategory');
        dropdown.innerHTML = '<option value="">Select Category</option>';

        // Add default categories
        Object.values(this.categories).forEach(group => {
            group.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                dropdown.appendChild(option);
            });
        });

        // Add custom categories
        this.customCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            dropdown.appendChild(option);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    saveData() {
        const data = {
            budgetMode: this.budgetMode,
            budget: this.budget,
            transactions: this.transactions,
            jointGoals: this.jointGoals,
            partner: this.partner,
            yourIncome: this.yourIncome,
            sharedExpensesBudget: this.sharedExpensesBudget,
            sharedExpenseCategories: this.sharedExpenseCategories,
            categories: this.categories,
            customCategories: this.customCategories
        };
        localStorage.setItem('budgetTrackerData', JSON.stringify(data));
    }

    loadData() {
        const savedData = localStorage.getItem('budgetTrackerData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.budgetMode = data.budgetMode || 'personal';
            this.budget = data.budget || {};
            this.transactions = data.transactions || [];
            this.jointGoals = data.jointGoals || [];
            this.partner = data.partner || { name: 'Partner', income: 0, color: '#ec4899' };
            this.yourIncome = data.yourIncome || 0;
            this.sharedExpensesBudget = data.sharedExpensesBudget || 0;
            this.sharedExpenseCategories = data.sharedExpenseCategories || {
                rent: 0,
                utilities: 0,
                internet: 0,
                groceries: 0,
                dining: 0,
                transportation: 0,
                insurance: 0,
                subscriptions: 0,
                entertainment: 0,
                other: 0
            };
            this.categories = data.categories || this.getDefaultCategories();
            this.customCategories = data.customCategories || [];

            // Update form fields
            document.getElementById('netIncome').value = this.yourIncome;
            document.getElementById('yourIncomeInput').value = this.yourIncome;
            document.getElementById('partnerIncomeInput').value = this.partner.income;
            
            // Update shared expense category inputs
            document.getElementById('rentBudget').value = this.sharedExpenseCategories.rent;
            document.getElementById('utilitiesBudget').value = this.sharedExpenseCategories.utilities;
            document.getElementById('internetBudget').value = this.sharedExpenseCategories.internet;
            document.getElementById('groceriesBudget').value = this.sharedExpenseCategories.groceries;
            document.getElementById('diningBudget').value = this.sharedExpenseCategories.dining;
            document.getElementById('transportationBudget').value = this.sharedExpenseCategories.transportation;
            document.getElementById('insuranceBudget').value = this.sharedExpenseCategories.insurance;
            document.getElementById('subscriptionsBudget').value = this.sharedExpenseCategories.subscriptions;
            document.getElementById('entertainmentBudget').value = this.sharedExpenseCategories.entertainment;
            document.getElementById('otherSharedBudget').value = this.sharedExpenseCategories.other;
        }
    }

    updateSharedExpensesBudget() {
        // Get values from all category inputs
        this.sharedExpenseCategories.rent = parseFloat(document.getElementById('rentBudget').value) || 0;
        this.sharedExpenseCategories.utilities = parseFloat(document.getElementById('utilitiesBudget').value) || 0;
        this.sharedExpenseCategories.internet = parseFloat(document.getElementById('internetBudget').value) || 0;
        this.sharedExpenseCategories.groceries = parseFloat(document.getElementById('groceriesBudget').value) || 0;
        this.sharedExpenseCategories.dining = parseFloat(document.getElementById('diningBudget').value) || 0;
        this.sharedExpenseCategories.transportation = parseFloat(document.getElementById('transportationBudget').value) || 0;
        this.sharedExpenseCategories.insurance = parseFloat(document.getElementById('insuranceBudget').value) || 0;
        this.sharedExpenseCategories.subscriptions = parseFloat(document.getElementById('subscriptionsBudget').value) || 0;
        this.sharedExpenseCategories.entertainment = parseFloat(document.getElementById('entertainmentBudget').value) || 0;
        this.sharedExpenseCategories.other = parseFloat(document.getElementById('otherSharedBudget').value) || 0;
        
        // Calculate total shared expenses budget
        this.sharedExpensesBudget = Object.values(this.sharedExpenseCategories).reduce((total, amount) => total + amount, 0);
        
        // Update total display
        document.getElementById('totalSharedExpensesBudget').textContent = this.formatCurrency(this.sharedExpensesBudget);
        
        // Calculate individual shares based on income proportions
        const totalIncome = this.yourIncome + this.partner.income;
        let yourShare = 0;
        let partnerShare = 0;
        
        if (totalIncome > 0) {
            const yourProportion = this.yourIncome / totalIncome;
            const partnerProportion = this.partner.income / totalIncome;
            
            yourShare = this.sharedExpensesBudget * yourProportion;
            partnerShare = this.sharedExpensesBudget * partnerProportion;
        }
        
        // Update the breakdown display
        document.getElementById('yourShareAmount').textContent = this.formatCurrency(yourShare);
        document.getElementById('partnerShareAmount').textContent = this.formatCurrency(partnerShare);
        document.getElementById('totalSharedBudget').textContent = this.formatCurrency(this.sharedExpensesBudget);
        
        // Update shared expenses progress
        this.updateSharedExpensesProgress();
        
        // Save data
        this.saveData();
    }

    updateSharedExpensesProgress() {
        const sharedBudget = this.sharedExpensesBudget;
        const sharedExpenses = this.calculateSharedExpenses();
        const remaining = sharedBudget - sharedExpenses;
        const percentage = sharedBudget > 0 ? (sharedExpenses / sharedBudget) * 100 : 0;
        
        // Update progress display
        document.getElementById('sharedExpensesProgress').textContent = 
            `${this.formatCurrency(sharedExpenses)} / ${this.formatCurrency(sharedBudget)}`;
        document.getElementById('sharedExpensesSpent').textContent = this.formatCurrency(sharedExpenses);
        document.getElementById('sharedExpensesRemaining').textContent = this.formatCurrency(remaining);
        
        // Update progress bar
        const progressFill = document.getElementById('sharedExpensesProgressFill');
        progressFill.style.width = `${Math.min(percentage, 100)}%`;
        
        // Update progress bar color based on percentage
        progressFill.className = 'progress-fill';
        if (percentage >= 90) {
            progressFill.classList.add('danger');
        } else if (percentage >= 75) {
            progressFill.classList.add('warning');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BudgetTracker();
});

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        border-left: 4px solid #3b82f6;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification.success {
        border-left-color: #10b981;
    }

    .notification.success i {
        color: #10b981;
    }

    .notification.info {
        border-left-color: #3b82f6;
    }

    .notification.info i {
        color: #3b82f6;
    }

    .notification.warning {
        border-left-color: #f59e0b;
    }

    .notification.warning i {
        color: #f59e0b;
    }

    .notification.error {
        border-left-color: #ef4444;
    }

    .notification.error i {
        color: #ef4444;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet); 
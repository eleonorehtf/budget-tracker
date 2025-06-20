// Modern Budget Tracker - Clean & Optimized

class BudgetTracker {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.categories = JSON.parse(localStorage.getItem('categories')) || this.getDefaultCategories();
        this.subCategories = JSON.parse(localStorage.getItem('subCategories')) || this.getDefaultSubCategories();
        this.netIncome = parseFloat(localStorage.getItem('netIncome')) || 0;
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        
        this.initializeApp();
        this.setupEventListeners();
        this.updateUI();
        
        // Show budget setup if no net income is set
        if (this.netIncome === 0) {
            this.showBudgetSetup();
        }
    }

    // Default categories organized by type
    getDefaultCategories() {
        return [
            // Fixed Expenses
            { id: 1, name: 'Rent / Mortgage', budget: 0, color: '#ef4444', spent: 0, type: 'Fixed Expenses' },
            { id: 2, name: 'Utilities', budget: 0, color: '#f97316', spent: 0, type: 'Fixed Expenses' },
            { id: 3, name: 'Internet & Phone', budget: 0, color: '#eab308', spent: 0, type: 'Fixed Expenses' },
            { id: 4, name: 'Insurance', budget: 0, color: '#84cc16', spent: 0, type: 'Fixed Expenses' },
            { id: 5, name: 'Loan Payments', budget: 0, color: '#06b6d4', spent: 0, type: 'Fixed Expenses' },
            
            // Variable Expenses
            { id: 6, name: 'Groceries', budget: 0, color: '#8b5cf6', spent: 0, type: 'Variable Expenses' },
            { id: 7, name: 'Dining Out', budget: 0, color: '#ec4899', spent: 0, type: 'Variable Expenses' },
            { id: 8, name: 'Transportation', budget: 0, color: '#3b82f6', spent: 0, type: 'Variable Expenses' },
            { id: 9, name: 'Medical', budget: 0, color: '#10b981', spent: 0, type: 'Variable Expenses' },
            { id: 10, name: 'Household Supplies', budget: 0, color: '#f59e0b', spent: 0, type: 'Variable Expenses' },
            
            // Savings & Investments
            { id: 11, name: 'Emergency Fund', budget: 0, color: '#059669', spent: 0, type: 'Savings & Investments' },
            { id: 12, name: 'Retirement', budget: 0, color: '#0d9488', spent: 0, type: 'Savings & Investments' },
            { id: 13, name: 'Investments', budget: 0, color: '#0891b2', spent: 0, type: 'Savings & Investments' },
            { id: 14, name: 'Savings Goals', budget: 0, color: '#7c3aed', spent: 0, type: 'Savings & Investments' },
            
            // Personal & Lifestyle
            { id: 15, name: 'Clothing', budget: 0, color: '#be185d', spent: 0, type: 'Personal & Lifestyle' },
            { id: 16, name: 'Gym / Fitness', budget: 0, color: '#dc2626', spent: 0, type: 'Personal & Lifestyle' },
            { id: 17, name: 'Subscriptions', budget: 0, color: '#ea580c', spent: 0, type: 'Personal & Lifestyle', hasSubCategories: true },
            { id: 18, name: 'Travel', budget: 0, color: '#d97706', spent: 0, type: 'Personal & Lifestyle' },
            { id: 19, name: 'Gifts & Donations', budget: 0, color: '#65a30d', spent: 0, type: 'Personal & Lifestyle' }
        ];
    }

    getDefaultSubCategories() {
        return [
            { id: 1, parentId: 17, name: 'Netflix', budget: 0, color: '#ea580c', spent: 0 },
            { id: 2, parentId: 17, name: 'Spotify', budget: 0, color: '#ea580c', spent: 0 },
            { id: 3, parentId: 17, name: 'Gym Membership', budget: 0, color: '#ea580c', spent: 0 }
        ];
    }

    initializeApp() {
        document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
        this.updateCategoryDropdown();
        document.getElementById('netIncome').value = this.netIncome;
    }

    setupEventListeners() {
        // Budget setup controls
        document.getElementById('setupBudgetBtn').addEventListener('click', () => this.showBudgetSetup());
        document.getElementById('saveBudgetBtn').addEventListener('click', () => this.saveBudget());
        document.getElementById('addCustomCategoryBtn').addEventListener('click', () => this.openModal('customCategoryModal'));

        // Modal controls
        document.getElementById('addTransactionBtn').addEventListener('click', () => this.openModal('transactionModal'));
        document.getElementById('addCategoryBtn').addEventListener('click', () => this.openModal('categoryModal'));

        // Close modals
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal').id));
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Form submissions
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        document.getElementById('categoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCategory();
        });

        document.getElementById('customCategoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCustomCategory();
        });

        document.getElementById('subCategoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSubCategory();
        });

        // Real-time updates
        document.getElementById('transactionType').addEventListener('change', () => this.updateCategoryDropdown());
        document.getElementById('netIncome').addEventListener('input', () => this.updateBudgetAllocation());
    }

    showBudgetSetup() {
        document.getElementById('budgetSetupSection').style.display = 'block';
        this.updateBudgetSetupCategories();
        this.updateBudgetAllocation();
    }

    hideBudgetSetup() {
        document.getElementById('budgetSetupSection').style.display = 'none';
    }

    updateBudgetSetupCategories() {
        const container = document.getElementById('budgetCategoriesSetup');
        container.innerHTML = '';

        // Group categories by type
        const categoriesByType = this.categories.reduce((acc, category) => {
            if (!acc[category.type]) acc[category.type] = [];
            acc[category.type].push(category);
            return acc;
        }, {});

        // Create sections for each type
        Object.entries(categoriesByType).forEach(([type, categories]) => {
            const typeSection = document.createElement('div');
            typeSection.className = 'category-type-section';
            
            typeSection.innerHTML = `
                <h4 class="category-type-header">${type}</h4>
                ${categories.map(category => this.createCategorySetupCard(category)).join('')}
            `;
            
            container.appendChild(typeSection);
        });
    }

    createCategorySetupCard(category) {
        const subCategories = this.subCategories.filter(sub => sub.parentId === category.id);
        const hasSubCategories = category.hasSubCategories && subCategories.length > 0;
        
        let subCategoriesHtml = '';
        if (category.hasSubCategories) {
            if (hasSubCategories) {
                subCategoriesHtml = `
                    <div class="sub-categories-setup">
                        <div class="sub-categories-header">
                            <span>Sub-categories:</span>
                            <button type="button" class="btn btn-small" onclick="budgetTracker.openSubCategoryModal(${category.id})">
                                <i class="fas fa-plus"></i> Add Sub-category
                            </button>
                        </div>
                        <div class="sub-categories-list">
                            ${subCategories.map(sub => `
                                <div class="sub-category-setup-item">
                                    <span>${sub.name}</span>
                                    <input type="number" 
                                           class="sub-category-setup-input" 
                                           data-sub-category-id="${sub.id}"
                                           placeholder="0.00" 
                                           step="0.01" 
                                           min="0" 
                                           value="${sub.budget}"
                                           oninput="budgetTracker.updateBudgetAllocation()">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else {
                subCategoriesHtml = `
                    <div class="sub-categories-setup">
                        <button type="button" class="btn btn-small" onclick="budgetTracker.openSubCategoryModal(${category.id})">
                            <i class="fas fa-plus"></i> Add Sub-category
                        </button>
                    </div>
                `;
            }
        }

        return `
            <div class="category-setup-card">
                <div class="category-setup-header">
                    <span class="category-setup-name">${category.name}</span>
                    <div class="category-setup-color" style="background-color: ${category.color}"></div>
                </div>
                <input type="number" 
                       class="category-setup-input" 
                       data-category-id="${category.id}"
                       placeholder="0.00" 
                       step="0.01" 
                       min="0" 
                       value="${category.budget}"
                       oninput="budgetTracker.updateBudgetAllocation()">
                ${subCategoriesHtml}
            </div>
        `;
    }

    openSubCategoryModal(parentCategoryId) {
        this.currentParentCategoryId = parentCategoryId;
        this.openModal('subCategoryModal');
    }

    updateBudgetAllocation() {
        const netIncome = parseFloat(document.getElementById('netIncome').value) || 0;
        let allocated = 0;

        // Calculate total allocated budget
        document.querySelectorAll('.category-setup-input').forEach(input => {
            const amount = parseFloat(input.value) || 0;
            allocated += amount;
            
            const categoryId = parseInt(input.dataset.categoryId);
            const category = this.categories.find(c => c.id === categoryId);
            if (category) category.budget = amount;
        });

        document.querySelectorAll('.sub-category-setup-input').forEach(input => {
            const amount = parseFloat(input.value) || 0;
            allocated += amount;
            
            const subCategoryId = parseInt(input.dataset.subCategoryId);
            const subCategory = this.subCategories.find(s => s.id === subCategoryId);
            if (subCategory) subCategory.budget = amount;
        });

        // Update display
        document.getElementById('allocatedAmount').textContent = this.formatCurrency(allocated);
        document.getElementById('remainingAmount').textContent = this.formatCurrency(netIncome - allocated);

        // Visual warnings
        this.updateBudgetWarnings(allocated, netIncome);
    }

    updateBudgetWarnings(allocated, netIncome) {
        const inputs = document.querySelectorAll('.category-setup-input, .sub-category-setup-input');
        const remainingElement = document.getElementById('remainingAmount');
        
        inputs.forEach(input => {
            input.classList.remove('warning', 'error');
            
            if (allocated > netIncome) {
                input.classList.add('error');
            } else if (allocated > netIncome * 0.95) {
                input.classList.add('warning');
            }
        });

        // Update remaining amount color
        const remaining = netIncome - allocated;
        if (remaining < 0) {
            remainingElement.style.color = '#ef4444';
        } else if (remaining < netIncome * 0.05) {
            remainingElement.style.color = '#f59e0b';
        } else {
            remainingElement.style.color = '#10b981';
        }
    }

    saveBudget() {
        const netIncome = parseFloat(document.getElementById('netIncome').value) || 0;
        const allocated = this.categories.reduce((sum, cat) => sum + cat.budget, 0) + 
                         this.subCategories.reduce((sum, sub) => sum + sub.budget, 0);

        if (allocated > netIncome) {
            if (!confirm('Warning: Your allocated budget exceeds your net income! Do you want to save anyway?')) {
                return;
            }
        }

        this.netIncome = netIncome;
        this.saveData();
        this.updateUI();
        this.hideBudgetSetup();
        this.showSuccessMessage('Budget saved successfully!');
    }

    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        
        // Reset forms
        const formMap = {
            'transactionModal': 'transactionForm',
            'categoryModal': 'categoryForm',
            'customCategoryModal': 'customCategoryForm',
            'subCategoryModal': 'subCategoryForm'
        };
        
        const formId = formMap[modalId];
        if (formId) {
            document.getElementById(formId).reset();
            if (modalId === 'transactionModal') {
                document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
            }
        }
    }

    updateCategoryDropdown() {
        const type = document.getElementById('transactionType').value;
        const categorySelect = document.getElementById('transactionCategory');
        
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        
        if (type === 'expense') {
            this.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);

                if (category.hasSubCategories) {
                    const subCategories = this.subCategories.filter(sub => sub.parentId === category.id);
                    subCategories.forEach(subCategory => {
                        const subOption = document.createElement('option');
                        subOption.value = `sub_${subCategory.id}`;
                        subOption.textContent = `  └ ${subCategory.name}`;
                        categorySelect.appendChild(subOption);
                    });
                }
            });
        }
    }

    addTransaction() {
        const formData = this.getFormData('transactionForm');
        
        if (!this.validateTransaction(formData)) return;

        const isSubCategory = formData.categoryId.startsWith('sub_');
        const actualCategoryId = isSubCategory ? 
            parseInt(formData.categoryId.replace('sub_', '')) : 
            parseInt(formData.categoryId);

        const transaction = {
            id: Date.now(),
            type: formData.type,
            amount: parseFloat(formData.amount),
            categoryId: actualCategoryId,
            isSubCategory,
            description: formData.description,
            date: formData.date,
            timestamp: new Date().toISOString()
        };

        this.transactions.push(transaction);
        this.saveData();
        this.updateUI();
        this.closeModal('transactionModal');
        this.showSuccessMessage('Transaction added successfully!');
    }

    validateTransaction(data) {
        if (!data.amount || !data.description || (data.type === 'expense' && !data.categoryId)) {
            this.showErrorMessage('Please fill in all required fields');
            return false;
        }
        return true;
    }

    addCategory() {
        const formData = this.getFormData('categoryForm');
        
        if (!formData.name || !formData.budget) {
            this.showErrorMessage('Please fill in all required fields');
            return;
        }

        const category = {
            id: Date.now(),
            name: formData.name,
            budget: parseFloat(formData.budget),
            color: formData.color,
            spent: 0,
            type: 'Custom'
        };

        this.categories.push(category);
        this.saveData();
        this.updateUI();
        this.closeModal('categoryModal');
        this.showSuccessMessage('Category added successfully!');
    }

    addCustomCategory() {
        const formData = this.getFormData('customCategoryForm');
        
        if (!formData.name || !formData.budget) {
            this.showErrorMessage('Please fill in all required fields');
            return;
        }

        const category = {
            id: Date.now(),
            name: formData.name,
            budget: parseFloat(formData.budget),
            color: formData.color,
            spent: 0,
            type: 'Custom'
        };

        this.categories.push(category);
        this.saveData();
        this.updateUI();
        this.closeModal('customCategoryModal');
        
        if (document.getElementById('budgetSetupSection').style.display !== 'none') {
            this.updateBudgetSetupCategories();
            this.updateBudgetAllocation();
        }
        
        this.showSuccessMessage('Custom category added successfully!');
    }

    addSubCategory() {
        const formData = this.getFormData('subCategoryForm');
        
        if (!formData.name || !formData.budget) {
            this.showErrorMessage('Please fill in all required fields');
            return;
        }

        const parentCategory = this.categories.find(c => c.id === this.currentParentCategoryId);
        const subCategory = {
            id: Date.now(),
            parentId: this.currentParentCategoryId,
            name: formData.name,
            budget: parseFloat(formData.budget),
            color: parentCategory.color,
            spent: 0
        };

        this.subCategories.push(subCategory);
        this.saveData();
        this.updateUI();
        this.closeModal('subCategoryModal');
        
        if (document.getElementById('budgetSetupSection').style.display !== 'none') {
            this.updateBudgetSetupCategories();
            this.updateBudgetAllocation();
        }
        
        this.showSuccessMessage('Sub-category added successfully!');
    }

    getFormData(formId) {
        const form = document.getElementById(formId);
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    saveData() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
        localStorage.setItem('categories', JSON.stringify(this.categories));
        localStorage.setItem('subCategories', JSON.stringify(this.subCategories));
        localStorage.setItem('netIncome', this.netIncome.toString());
    }

    updateUI() {
        this.updateOverview();
        this.updateCategories();
        this.updateTransactions();
    }

    updateOverview() {
        const currentMonthTransactions = this.getCurrentMonthTransactions();
        const totalIncome = this.netIncome;
        const totalExpenses = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const remainingBudget = totalIncome - totalExpenses;

        document.getElementById('totalIncome').textContent = this.formatCurrency(totalIncome);
        document.getElementById('totalExpenses').textContent = this.formatCurrency(totalExpenses);
        document.getElementById('remainingBudget').textContent = this.formatCurrency(remainingBudget);
        
        this.updateRemainingBudgetColor(remainingBudget, totalIncome);
    }

    updateRemainingBudgetColor(remaining, total) {
        const element = document.getElementById('remainingBudget');
        if (remaining < 0) {
            element.style.color = '#ef4444';
        } else if (remaining < total * 0.1) {
            element.style.color = '#f59e0b';
        } else {
            element.style.color = '#10b981';
        }
    }

    updateCategories() {
        const categoriesContainer = document.getElementById('budgetCategories');
        categoriesContainer.innerHTML = '';

        this.resetSpentAmounts();
        this.calculateSpentAmounts();

        const categoriesByType = this.categories
            .filter(category => category.budget > 0)
            .reduce((acc, category) => {
                if (!acc[category.type]) acc[category.type] = [];
                acc[category.type].push(category);
                return acc;
            }, {});

        Object.entries(categoriesByType).forEach(([type, categories]) => {
            const typeSection = document.createElement('div');
            typeSection.className = 'category-type-section';
            
            typeSection.innerHTML = `
                <h3 class="category-type-header">${type}</h3>
                <div class="categories-list">
                    ${categories.map(category => this.createCategoryItem(category)).join('')}
                </div>
            `;
            
            categoriesContainer.appendChild(typeSection);
        });
    }

    createCategoryItem(category) {
        const percentage = (category.spent / category.budget) * 100;
        const progressColor = percentage > 100 ? '#ef4444' : 
                            percentage > 80 ? '#f59e0b' : '#10b981';

        let subCategoriesHtml = '';
        if (category.hasSubCategories) {
            const subCategories = this.subCategories.filter(sub => sub.parentId === category.id && sub.budget > 0);
            if (subCategories.length > 0) {
                subCategoriesHtml = `
                    <div class="sub-categories-list">
                        ${subCategories.map(sub => this.createSubCategoryItem(sub)).join('')}
                    </div>
                `;
            }
        }

        return `
            <div class="category-list-item" style="border-left-color: ${category.color}">
                <div class="category-item-header">
                    <span class="category-item-name">${category.name}</span>
                    <span class="category-item-budget">${this.formatCurrency(category.budget)}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%; background-color: ${progressColor}"></div>
                </div>
                <div class="category-item-spent">
                    ${this.formatCurrency(category.spent)} / ${this.formatCurrency(category.budget)}
                    ${percentage > 100 ? ` (${this.formatCurrency(category.spent - category.budget)} over budget)` : ''}
                </div>
                ${subCategoriesHtml}
            </div>
        `;
    }

    createSubCategoryItem(subCategory) {
        const percentage = (subCategory.spent / subCategory.budget) * 100;
        const progressColor = percentage > 100 ? '#ef4444' : 
                            percentage > 80 ? '#f59e0b' : '#10b981';

        return `
            <div class="sub-category-item">
                <div class="sub-category-header">
                    <span class="sub-category-name">└ ${subCategory.name}</span>
                    <span class="sub-category-budget">${this.formatCurrency(subCategory.budget)}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%; background-color: ${progressColor}"></div>
                </div>
                <div class="sub-category-spent">
                    ${this.formatCurrency(subCategory.spent)} / ${this.formatCurrency(subCategory.budget)}
                    ${percentage > 100 ? ` (${this.formatCurrency(subCategory.spent - subCategory.budget)} over budget)` : ''}
                </div>
            </div>
        `;
    }

    resetSpentAmounts() {
        this.categories.forEach(category => category.spent = 0);
        this.subCategories.forEach(subCategory => subCategory.spent = 0);
    }

    calculateSpentAmounts() {
        const currentMonthTransactions = this.getCurrentMonthTransactions()
            .filter(t => t.type === 'expense');

        currentMonthTransactions.forEach(transaction => {
            if (transaction.isSubCategory) {
                const subCategory = this.subCategories.find(s => s.id === transaction.categoryId);
                if (subCategory) subCategory.spent += transaction.amount;
            } else {
                const category = this.categories.find(c => c.id === transaction.categoryId);
                if (category) category.spent += transaction.amount;
            }
        });
    }

    getCurrentMonthTransactions() {
        return this.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === this.currentMonth && 
                   transactionDate.getFullYear() === this.currentYear;
        });
    }

    updateTransactions() {
        const transactionsContainer = document.getElementById('transactionsList');
        const recentTransactions = this.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        if (recentTransactions.length === 0) {
            transactionsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <p>No transactions yet. Add your first transaction!</p>
                </div>
            `;
            return;
        }

        transactionsContainer.innerHTML = recentTransactions
            .map(transaction => this.createTransactionItem(transaction))
            .join('');
    }

    createTransactionItem(transaction) {
        let categoryName = 'Uncategorized';
        if (transaction.isSubCategory) {
            const subCategory = this.subCategories.find(s => s.id === transaction.categoryId);
            if (subCategory) categoryName = subCategory.name;
        } else {
            const category = this.categories.find(c => c.id === transaction.categoryId);
            if (category) categoryName = category.name;
        }

        const iconClass = transaction.type === 'income' ? 'fas fa-arrow-down' : 'fas fa-arrow-up';
        const iconColor = transaction.type === 'income' ? '#10b981' : '#ef4444';

        return `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-icon" style="background-color: ${iconColor}">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="transaction-details">
                        <h4>${transaction.description}</h4>
                        <p>${categoryName} • ${this.formatDate(transaction.date)}</p>
                    </div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                </div>
            </div>
        `;
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}

// Initialize the app when the page loads
let budgetTracker;
document.addEventListener('DOMContentLoaded', () => {
    budgetTracker = new BudgetTracker();
}); 
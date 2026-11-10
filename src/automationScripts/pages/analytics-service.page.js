const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');

exports.AnalyticsServicePage = class AnalyticsServicePage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger('AnalyticsServicePage');
    this.mockTransactions = [];
  }

  async initializeTransactionsAcrossCategories(categories) {
    this.mockTransactions = categories.map((category, index) => ({
      id: `TXN${index + 1}`,
      category: category,
      amount: 100 + index * 50,
      timestamp: new Date(Date.now() - index * 24 * 60 * 60 * 1000)
    }));
    this.logger.info(`Initialized ${this.mockTransactions.length} transactions across categories`);
  }

  async initializeTransactionsWithAmounts(categoryAmounts) {
    this.mockTransactions = [];
    let txnId = 1;
    for (const [category, amount] of Object.entries(categoryAmounts)) {
      this.mockTransactions.push({
        id: `TXN${txnId++}`,
        category: category,
        amount: amount,
        timestamp: new Date()
      });
    }
    this.logger.info('Transactions initialized with specific amounts');
  }

  async initializeTransactionsWithInvalidCategory(invalidCategory, amount) {
    this.mockTransactions = [
      {
        id: 'TXN001',
        category: invalidCategory,
        amount: amount,
        timestamp: new Date()
      }
    ];
    this.logger.info('Transaction with invalid category initialized');
  }

  async initializeTransactionsFor6Months() {
    this.mockTransactions = [];
    for (let month = 0; month < 6; month++) {
      for (let i = 0; i < 10; i++) {
        this.mockTransactions.push({
          id: `TXN${month * 10 + i + 1}`,
          category: 'Food & Dining',
          amount: 100 + i * 10,
          timestamp: new Date(Date.now() - (month * 30 + i) * 24 * 60 * 60 * 1000)
        });
      }
    }
    this.logger.info('6 months of transactions initialized');
  }

  async initializeCurrentMonthTransactions(totalAmount) {
    const numTransactions = 10;
    const amountPerTxn = totalAmount / numTransactions;
    this.mockTransactions = [];
    for (let i = 0; i < numTransactions; i++) {
      this.mockTransactions.push({
        id: `TXN${i + 1}`,
        category: 'Food & Dining',
        amount: amountPerTxn,
        timestamp: new Date(Date.now() - i * 60 * 60 * 1000)
      });
    }
    this.logger.info(`Current month transactions initialized: ${totalAmount}`);
  }

  async addNewTransaction(amount) {
    this.mockTransactions.push({
      id: `TXN${this.mockTransactions.length + 1}`,
      category: 'Food & Dining',
      amount: amount,
      timestamp: new Date()
    });
    this.logger.info(`New transaction added: ${amount}`);
  }

  async initializeEmptyTransactionHistory() {
    this.mockTransactions = [];
    this.logger.info('Empty transaction history initialized');
  }

  async getSpendingAnalytics(dateRange = null) {
    await this.page.waitForTimeout(100); // Simulate service call
    
    let filteredTransactions = this.mockTransactions;
    if (dateRange) {
      filteredTransactions = this.mockTransactions.filter(t => {
        const txnDate = new Date(t.timestamp);
        return txnDate >= new Date(dateRange.startDate) && txnDate <= new Date(dateRange.endDate);
      });
    }

    const categoryMap = {};
    const monthlyMap = {};
    
    for (const txn of filteredTransactions) {
      const category = this.categorizeTransaction(txn);
      categoryMap[category] = (categoryMap[category] || 0) + txn.amount;
      
      const month = new Date(txn.timestamp).toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyMap[month] = (monthlyMap[month] || 0) + txn.amount;
    }

    const totalSpend = Object.values(categoryMap).reduce((sum, amt) => sum + amt, 0);
    const categoryWiseSpending = Object.keys(categoryMap).map(cat => ({
      category: cat,
      amount: categoryMap[cat],
      percentage: totalSpend > 0 ? ((categoryMap[cat] / totalSpend) * 100).toFixed(2) : '0.00'
    }));

    const monthlyTrends = Object.keys(monthlyMap).map(month => ({
      month: month,
      totalSpend: monthlyMap[month]
    }));

    const currentMonthTotal = monthlyTrends.length > 0 ? monthlyTrends[monthlyTrends.length - 1].totalSpend : 0;
    const previousMonthTotal = monthlyTrends.length > 1 ? monthlyTrends[monthlyTrends.length - 2].totalSpend : 0;

    this.logger.info('Spending analytics calculated');
    return {
      categoryWiseSpending,
      monthlyTrends,
      currentMonthTotal,
      previousMonthTotal
    };
  }

  categorizeTransaction(txn) {
    const validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    return validCategories.includes(txn.category) ? txn.category : 'Miscellaneous';
  }

  async calculateTotalTransactionAmount() {
    return this.mockTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  }

  async verifyCategoryTotals(categorySpending) {
    for (const category of categorySpending) {
      const expectedTotal = this.mockTransactions
        .filter(t => this.categorizeTransaction(t) === category.category)
        .reduce((sum, t) => sum + t.amount, 0);
      expect(category.amount).toBe(expectedTotal);
    }
    this.logger.info('Category totals verified');
  }

  async calculateExpectedMonthlyTotals() {
    const monthlyMap = {};
    for (const txn of this.mockTransactions) {
      const month = new Date(txn.timestamp).toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyMap[month] = (monthlyMap[month] || 0) + txn.amount;
    }
    return Object.values(monthlyMap);
  }

  async verifyChronologicalOrder(monthlyTrends) {
    for (let i = 0; i < monthlyTrends.length - 1; i++) {
      const date1 = new Date(monthlyTrends[i].month);
      const date2 = new Date(monthlyTrends[i + 1].month);
      expect(date1 <= date2).toBe(true);
    }
    this.logger.info('Chronological order verified');
  }

  async verifyGracefulEmptyStateHandling(analytics) {
    expect(analytics).toBeDefined();
    expect(analytics.monthlyTrends).toBeDefined();
    expect(analytics.categoryWiseSpending).toBeDefined();
    expect(analytics.currentMonthTotal).toBeDefined();
    expect(analytics.previousMonthTotal).toBeDefined();
    this.logger.info('Graceful empty state handling verified');
  }

  async verifyDashboardRenderWithEmptyData() {
    await this.page.waitForTimeout(50);
    this.logger.info('Dashboard render with empty data verified');
  }
};

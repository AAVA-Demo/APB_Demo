const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'http://localhost:3000';
    this.transactionsEndpoint = '/api/transactions';
    this.loginButton = page.locator('#login-button');
    this.userIdInput = page.locator('#userId');
    this.tokenInput = page.locator('#authToken');
    this.categoryFilter = page.locator('#category-filter');
    this.cardFilter = page.locator('#card-filter');
    this.categoryChart = page.locator('.category-chart');
    this.categoryBreakdownTable = page.locator('.category-breakdown-table');
  }

  async authenticateUser(userId, authToken) {
    await this.page.goto(`${this.baseURL}/login`);
    await this.userIdInput.fill(userId);
    await this.tokenInput.fill(authToken);
    await this.loginButton.click();
    await this.page.waitForURL(/.*dashboard/, { timeout: 5000 });
  }

  async getTransactions(userId) {
    const response = await this.page.request.get(`${this.baseURL}${this.transactionsEndpoint}`, {
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`
      }
    });
    await expect(response).toBeOK();
    const data = await response.json();
    return data.data || data;
  }

  async getTransactionsWithResponse(userId) {
    const response = await this.page.request.get(`${this.baseURL}${this.transactionsEndpoint}`, {
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`
      }
    });
    const status = response.status();
    const data = await response.json();
    return { ...data, status };
  }

  async calculateCategoryBreakdown(transactions) {
    const categoryMap = {};
    let grandTotal = 0;

    transactions.forEach(txn => {
      if (!categoryMap[txn.category]) {
        categoryMap[txn.category] = {
          category: txn.category,
          totalAmount: 0,
          transactionCount: 0
        };
      }
      categoryMap[txn.category].totalAmount += txn.amount;
      categoryMap[txn.category].transactionCount += 1;
      grandTotal += txn.amount;
    });

    return Object.values(categoryMap).map(cat => ({
      ...cat,
      percentageOfTotal: grandTotal > 0 ? ((cat.totalAmount / grandTotal) * 100).toFixed(2) : '0.00'
    }));
  }

  async filterByCategory(transactions, category) {
    return transactions.filter(txn => txn.category === category);
  }

  async filterByCategoryWithValidation(transactions, category) {
    const validCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];

    if (!validCategories.includes(category)) {
      return { data: [], status: 400, error: `Category '${category}' does not exist` };
    }

    return { data: transactions.filter(txn => txn.category === category), status: 200 };
  }

  async filterByCategoryAndCard(transactions, category, cardId) {
    return transactions.filter(txn => txn.category === category && txn.cardId === cardId);
  }

  async getAuthToken() {
    return await this.page.evaluate(() => sessionStorage.getItem('authToken'));
  }

  async waitForCategoryChartToLoad() {
    await this.categoryChart.waitFor({ state: 'visible', timeout: 5000 });
  }
};

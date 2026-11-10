const { expect } = require('@playwright/test');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'http://localhost:3000';
    this.apiEndpoint = '/api/transactions';
    this.loginButton = page.locator('#login-button');
    this.userIdInput = page.locator('#userId');
    this.tokenInput = page.locator('#authToken');
    this.transactionsList = page.locator('.transactions-list');
    this.transactionItem = page.locator('.transaction-item');
    this.paginationControls = page.locator('.pagination');
  }

  async authenticateUser(userId, authToken) {
    await this.page.goto(`${this.baseURL}/login`);
    await this.userIdInput.fill(userId);
    await this.tokenInput.fill(authToken);
    await this.loginButton.click();
    await this.page.waitForURL(/.*dashboard/, { timeout: 5000 });
  }

  async getTransactions(page, size) {
    const response = await this.page.request.get(`${this.baseURL}${this.apiEndpoint}?page=${page}&size=${size}`, {
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`
      }
    });
    await expect(response).toBeOK();
    const data = await response.json();
    return {
      data: data.data || data,
      pagination: {
        totalRecords: data.totalRecords || 0,
        totalPages: data.totalPages || 0,
        currentPage: page,
        pageSize: size
      }
    };
  }

  async getTransactionsWithInvalidParams(page, size) {
    try {
      const response = await this.page.request.get(`${this.baseURL}${this.apiEndpoint}?page=${page}&size=${size}`, {
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      });
      const status = response.status();
      const data = await response.json();
      return { ...data, status };
    } catch (error) {
      return { error: error.message, status: 400 };
    }
  }

  async getAuthToken() {
    return await this.page.evaluate(() => sessionStorage.getItem('authToken'));
  }

  async waitForTransactionsToLoad() {
    await this.transactionsList.waitFor({ state: 'visible', timeout: 5000 });
  }

  async validateTransactionFields(transaction, requiredFields) {
    requiredFields.forEach(field => {
      expect(transaction).toHaveProperty(field);
    });
  }
};

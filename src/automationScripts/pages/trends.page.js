const { expect } = require('@playwright/test');

exports.TrendsPage = class TrendsPage {
  constructor(page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'http://localhost:3000';
    this.trendsEndpoint = '/api/transactions/trends';
    this.transactionsEndpoint = '/api/transactions';
    this.loginButton = page.locator('#login-button');
    this.userIdInput = page.locator('#userId');
    this.tokenInput = page.locator('#authToken');
    this.trendChart = page.locator('.trend-chart');
    this.trendTable = page.locator('.trend-table');
  }

  async authenticateUser(userId, authToken) {
    await this.page.goto(`${this.baseURL}/login`);
    await this.userIdInput.fill(userId);
    await this.tokenInput.fill(authToken);
    await this.loginButton.click();
    await this.page.waitForURL(/.*dashboard/, { timeout: 5000 });
  }

  async getMonthlyTrends() {
    const response = await this.page.request.get(`${this.baseURL}${this.trendsEndpoint}`, {
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`
      }
    });
    await expect(response).toBeOK();
    const data = await response.json();
    return data.trends || data;
  }

  async getMonthlyTrendsWithResponse() {
    const response = await this.page.request.get(`${this.baseURL}${this.trendsEndpoint}`, {
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`
      }
    });
    const status = response.status();
    const data = await response.json();
    return {
      trends: data.trends || data,
      message: data.message || '',
      status
    };
  }

  async getTransactionsForValidation() {
    const response = await this.page.request.get(`${this.baseURL}${this.transactionsEndpoint}`, {
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`
      }
    });
    await expect(response).toBeOK();
    const data = await response.json();
    return data.data || data;
  }

  async getAuthToken() {
    return await this.page.evaluate(() => sessionStorage.getItem('authToken'));
  }

  async waitForTrendChartToLoad() {
    await this.trendChart.waitFor({ state: 'visible', timeout: 5000 });
  }
};

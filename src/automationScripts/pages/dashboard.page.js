const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'http://localhost:3000';
    this.cardsEndpoint = '/api/cards';
    this.loginButton = page.locator('#login-button');
    this.userIdInput = page.locator('#userId');
    this.tokenInput = page.locator('#authToken');
    this.kpiTotalSpend = page.locator('[data-testid="kpi-total-spend"]');
    this.kpiCreditLimit = page.locator('[data-testid="kpi-credit-limit"]');
    this.kpiAvailableCredit = page.locator('[data-testid="kpi-available-credit"]');
    this.kpiOutstanding = page.locator('[data-testid="kpi-outstanding"]');
  }

  async authenticateUser(userId, authToken) {
    await this.page.goto(`${this.baseURL}/login`);
    await this.userIdInput.fill(userId);
    await this.tokenInput.fill(authToken);
    await this.loginButton.click();
    await this.page.waitForURL(/.*dashboard/, { timeout: 5000 });
  }

  async getCreditCards(userId) {
    const response = await this.page.request.get(`${this.baseURL}${this.cardsEndpoint}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`
      }
    });
    await expect(response).toBeOK();
    return await response.json();
  }

  async calculateKPIs(cards) {
    let totalMonthlySpend = 0;
    let totalCreditLimit = 0;
    let totalOutstanding = 0;

    cards.forEach(card => {
      totalMonthlySpend += card.monthlySpend || 0;
      totalCreditLimit += card.totalCreditLimit || 0;
      totalOutstanding += card.outstandingAmount || 0;
    });

    const totalAvailableCredit = totalCreditLimit - totalOutstanding;

    return {
      totalMonthlySpend,
      totalCreditLimit,
      totalOutstanding,
      totalAvailableCredit
    };
  }

  async getKPIsWithInvalidAuth(userId, authToken) {
    try {
      const response = await this.page.request.get(`${this.baseURL}${this.cardsEndpoint}/${userId}`, {
        headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
      });
      const status = response.status();
      const data = await response.json();
      return { ...data, status };
    } catch (error) {
      return { error: error.message, status: 401 };
    }
  }

  async getAuthToken() {
    return await this.page.evaluate(() => sessionStorage.getItem('authToken'));
  }

  async waitForKPIsToLoad() {
    await this.kpiTotalSpend.waitFor({ state: 'visible', timeout: 5000 });
  }
};

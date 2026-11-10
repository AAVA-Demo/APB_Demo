const { expect } = require('@playwright/test');

exports.CreditCardPage = class CreditCardPage {
  constructor(page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'http://localhost:3000';
    this.apiEndpoint = '/api/cards';
    this.loginButton = page.locator('#login-button');
    this.userIdInput = page.locator('#userId');
    this.tokenInput = page.locator('#authToken');
    this.cardsList = page.locator('.credit-cards-list');
    this.cardItem = page.locator('.card-item');
  }

  async authenticateUser(userId, authToken) {
    await this.page.goto(`${this.baseURL}/login`);
    await this.userIdInput.fill(userId);
    await this.tokenInput.fill(authToken);
    await this.loginButton.click();
    await this.page.waitForURL(/.*dashboard/, { timeout: 5000 });
  }

  async getCreditCards(userId) {
    const response = await this.page.request.get(`${this.baseURL}${this.apiEndpoint}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`
      }
    });
    await expect(response).toBeOK();
    const data = await response.json();
    return data;
  }

  async getCreditCardsWithResponse(userId) {
    const response = await this.page.request.get(`${this.baseURL}${this.apiEndpoint}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`
      }
    });
    const status = response.status();
    const data = await response.json();
    return { ...data, status };
  }

  async getCreditCardsWithInvalidAuth(userId, authToken) {
    try {
      const response = await this.page.request.get(`${this.baseURL}${this.apiEndpoint}/${userId}`, {
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

  async validateCardFields(card, requiredFields) {
    requiredFields.forEach(field => {
      expect(card).toHaveProperty(field);
    });
  }

  async waitForCardsToLoad() {
    await this.cardsList.waitFor({ state: 'visible', timeout: 5000 });
  }
};

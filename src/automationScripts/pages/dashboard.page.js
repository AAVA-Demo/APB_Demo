const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendKPI = page.locator('[data-kpi="monthlySpend"]');
    this.totalCreditLimitKPI = page.locator('[data-kpi="totalCreditLimit"]');
    this.availableCreditKPI = page.locator('[data-kpi="availableCredit"]');
    this.outstandingAmountKPI = page.locator('[data-kpi="outstandingAmount"]');
    this.kpiLoadingIndicator = page.locator('.kpi-loading');
    this.cachedDataIndicator = page.locator('.cached-data-indicator');
    this.lastUpdatedTimestamp = page.locator('.last-updated');
    this.errorMessage = page.locator('.error-message');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForKPIsToLoad() {
    await this.monthlySpendKPI.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForFunction(() => {
      return !document.querySelector('.kpi-loading');
    }, { timeout: 5000 });
  }

  async getMonthlySpend() {
    await this.monthlySpendKPI.waitFor({ state: 'visible' });
    const text = await this.monthlySpendKPI.textContent();
    return parseFloat(text.replace(/[^0-9.-]+/g, ''));
  }

  async getTotalCreditLimit() {
    await this.totalCreditLimitKPI.waitFor({ state: 'visible' });
    const text = await this.totalCreditLimitKPI.textContent();
    return parseFloat(text.replace(/[^0-9.-]+/g, ''));
  }

  async getAvailableCredit() {
    await this.availableCreditKPI.waitFor({ state: 'visible' });
    const text = await this.availableCreditKPI.textContent();
    return parseFloat(text.replace(/[^0-9.-]+/g, ''));
  }

  async getOutstandingAmount() {
    await this.outstandingAmountKPI.waitFor({ state: 'visible' });
    const text = await this.outstandingAmountKPI.textContent();
    return parseFloat(text.replace(/[^0-9.-]+/g, ''));
  }

  async getCachedDataIndicator() {
    if (await this.cachedDataIndicator.isVisible({ timeout: 3000 }).catch(() => false)) {
      return await this.cachedDataIndicator.textContent();
    }
    return null;
  }

  async getLastUpdatedTimestamp() {
    if (await this.lastUpdatedTimestamp.isVisible({ timeout: 3000 }).catch(() => false)) {
      return await this.lastUpdatedTimestamp.textContent();
    }
    return null;
  }

  async getErrorMessage() {
    if (await this.errorMessage.isVisible({ timeout: 3000 }).catch(() => false)) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  async simulateDataSourceUnavailability() {
    await this.page.route('**/api/cards', route => {
      route.abort('failed');
    });
  }

  async simulateIncompleteDataResponse() {
    await this.page.route('**/api/cards', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          cards: [
            { cardId: 'CARD1', creditLimit: 10000, availableCredit: 7500, outstandingAmount: 2500 },
            { cardId: 'CARD2', availableCredit: 12000, outstandingAmount: 3000 },
            { cardId: 'CARD3', creditLimit: 8000, availableCredit: 6000, outstandingAmount: 2000 }
          ]
        })
      });
    });
  }

  async clearCache() {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  async addTestCard(cardData) {
    await this.page.evaluate((card) => {
      if (!window.testCards) {
        window.testCards = [];
      }
      window.testCards.push(card);
    }, cardData);
  }
};

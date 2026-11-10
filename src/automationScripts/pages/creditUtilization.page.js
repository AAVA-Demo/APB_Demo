const { expect } = require('@playwright/test');

exports.CreditUtilizationPage = class CreditUtilizationPage {
  constructor(page) {
    this.page = page;
    this.availableCreditDisplay = page.locator('[data-testid="available-credit-display"]');
    this.outstandingAmountDisplay = page.locator('[data-testid="outstanding-amount-display"]');
    this.dataUnavailableIndicator = page.locator('.data-unavailable-indicator');
    this.utilizationContainer = page.locator('.credit-utilization-container');
  }

  async navigate() {
    await this.page.click('a[href="/credit-utilization"]');
    await expect(this.utilizationContainer).toBeVisible({ timeout: 3000 });
  }

  async getAvailableCredit() {
    await expect(this.availableCreditDisplay).toBeVisible();
    return await this.availableCreditDisplay.textContent();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountDisplay).toBeVisible();
    return await this.outstandingAmountDisplay.textContent();
  }

  async getUnavailableDataIndicator() {
    await expect(this.dataUnavailableIndicator).toBeVisible();
    return await this.dataUnavailableIndicator.textContent();
  }
};
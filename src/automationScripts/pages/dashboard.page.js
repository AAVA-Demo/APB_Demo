const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendKPI = page.locator('.kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('.kpi-card:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('.kpi-card:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('.kpi-card:has-text("Outstanding Amount")');
    this.creditCardList = page.locator('credit-card-list');
    this.creditCardItems = page.locator('.card-item');
    this.errorMessage = page.locator('.alert-danger');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async getKPIValue(kpiName) {
    const kpiCard = this.page.locator(`.kpi-card:has-text("${kpiName}")`);
    await expect(kpiCard).toBeVisible();
    const valueElement = kpiCard.locator('.value');
    return await valueElement.textContent();
  }

  async getCreditCardCount() {
    await expect(this.creditCardItems.first()).toBeVisible();
    return await this.creditCardItems.count();
  }

  async getCardDetails(cardName) {
    const cardElement = this.page.locator(`.card-item:has-text("${cardName}")`);
    await expect(cardElement).toBeVisible();

    const cardNumber = await cardElement.locator('p').first().textContent();
    const creditLimitElement = cardElement.locator('strong').filter({ hasText: /\$/ }).first();
    const creditLimit = await creditLimitElement.textContent();

    return {
      cardName: cardName,
      cardNumber: cardNumber.trim(),
      creditLimit: creditLimit.trim()
    };
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};

const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount"]');
    this.errorMessage = page.locator('.alert-danger');
    this.loadingSpinner = page.locator('.loading-spinner');
  }

  async waitForDashboardLoad() {
    await expect(this.loadingSpinner).not.toBeVisible({ timeout: 5000 });
    await expect(this.monthlySpendKPI).toBeVisible();
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    return await this.monthlySpendKPI.textContent();
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    return await this.totalCreditLimitKPI.textContent();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    return await this.availableCreditKPI.textContent();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    return await this.outstandingAmountKPI.textContent();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async simulateTransaction(amount, cardId) {
    await this.page.evaluate(({ amt, cid }) => {
      fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt, cardId: cid })
      });
    }, { amt: amount, cid: cardId });
  }

  async simulatePayment(amount, cardId) {
    await this.page.evaluate(({ amt, cid }) => {
      fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt, cardId: cid })
      });
    }, { amt: amount, cid: cardId });
  }
};
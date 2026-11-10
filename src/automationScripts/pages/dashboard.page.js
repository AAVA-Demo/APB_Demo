const { expect } = require('@playwright/test');

/**
 * Page Object: DashboardPage
 * Handles all dashboard KPI interactions, real-time updates, and navigation
 */
exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.outstandingBalanceKPI = page.locator('[data-kpi="outstanding"], .kpi-outstanding, text="Outstanding Amount"').locator('..');
    this.availableCreditKPI = page.locator('[data-kpi="available"], .kpi-available, text="Available Credit"').locator('..');
    this.monthlySpendKPI = page.locator('[data-kpi="monthly-spend"], .kpi-monthly-spend, text="Monthly Spend"').locator('..');
    this.totalCreditLimitKPI = page.locator('[data-kpi="credit-limit"], .kpi-credit-limit, text="Total Credit Limit"').locator('..');
    this.alertBanner = page.locator('.alert, .alert-banner, [role="alert"]');
    this.notificationBanner = page.locator('.notification, .toast, .snackbar');
    this.refreshButton = page.locator('button:has-text("Refresh"), button:has-text("Retry")');
    this.paymentOptionsLink = page.locator('a:has-text("Payment Options"), a:has-text("View Payment")');
    this.cardManagementLink = page.locator('a:has-text("Card Management"), a:has-text("My Cards")');
    this.dashboardLink = page.locator('a:has-text("Dashboard"), a:has-text("Home")');
  }

  async getOutstandingBalance() {
    await expect(this.outstandingBalanceKPI).toBeVisible();
    const text = await this.outstandingBalanceKPI.locator('.kpi-value, .value, strong').first().textContent();
    return text.trim();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.locator('.kpi-value, .value, strong').first().textContent();
    return text.trim();
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.locator('.kpi-value, .value, strong').first().textContent();
    return text.trim();
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.locator('.kpi-value, .value, strong').first().textContent();
    return text.trim();
  }

  async simulateTransaction(amount, cardName) {
    await this.page.evaluate(({ amt, card }) => {
      window.dispatchEvent(new CustomEvent('newTransaction', { detail: { amount: amt, card: card } }));
    }, { amt: amount, card: cardName });
  }

  async simulateBackendUnavailable() {
    await this.page.route('**/api/transactions/**', route => route.abort());
  }

  async restoreBackendService() {
    await this.page.unroute('**/api/transactions/**');
  }

  async navigateToCardManagement() {
    await expect(this.cardManagementLink).toBeVisible();
    await this.cardManagementLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToDashboard() {
    await expect(this.dashboardLink).toBeVisible();
    await this.dashboardLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLayoutIntegrity() {
    await expect(this.outstandingBalanceKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
  }
};

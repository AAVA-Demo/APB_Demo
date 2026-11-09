const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('.dashboard-container, #dashboard, [data-testid="dashboard"]');
    this.monthlySpendKPI = page.locator('[data-kpi="monthly-spend"], .kpi-monthly-spend, #monthly-spend-kpi');
    this.totalCreditLimitKPI = page.locator('[data-kpi="total-credit-limit"], .kpi-total-credit-limit, #total-credit-limit-kpi');
    this.availableCreditKPI = page.locator('[data-kpi="available-credit"], .kpi-available-credit, #available-credit-kpi');
    this.outstandingAmountKPI = page.locator('[data-kpi="outstanding-amount"], .kpi-outstanding-amount, #outstanding-amount-kpi');
    this.kpiCards = page.locator('.kpi-card, [data-testid="kpi-card"]');
    this.consolidatedViewLink = page.locator('a:has-text("Consolidated View"), [href*="consolidated"]');
    this.consolidatedTotalCreditLimit = page.locator('[data-consolidated="total-credit-limit"]');
    this.consolidatedAvailableCredit = page.locator('[data-consolidated="available-credit"]');
    this.consolidatedOutstandingAmount = page.locator('[data-consolidated="outstanding-amount"]');
    this.inactiveCardNotification = page.locator('.notification, .alert, [role="alert"]').filter({ hasText: /inactive/i });
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible({ timeout: 15000 });
    await this.page.waitForLoadState('networkidle');
    await expect(this.kpiCards.first()).toBeVisible();
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const valueElement = this.monthlySpendKPI.locator('.kpi-value, .value, [data-testid="kpi-value"]');
    await expect(valueElement).toBeVisible();
    return await valueElement.textContent();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const valueElement = this.totalCreditLimitKPI.locator('.kpi-value, .value, [data-testid="kpi-value"]');
    await expect(valueElement).toBeVisible();
    return await valueElement.textContent();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const valueElement = this.availableCreditKPI.locator('.kpi-value, .value, [data-testid="kpi-value"]');
    await expect(valueElement).toBeVisible();
    return await valueElement.textContent();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const valueElement = this.outstandingAmountKPI.locator('.kpi-value, .value, [data-testid="kpi-value"]');
    await expect(valueElement).toBeVisible();
    return await valueElement.textContent();
  }

  async navigateToConsolidatedView() {
    await expect(this.consolidatedViewLink).toBeVisible();
    await this.consolidatedViewLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getConsolidatedTotalCreditLimit() {
    await expect(this.consolidatedTotalCreditLimit).toBeVisible();
    return await this.consolidatedTotalCreditLimit.textContent();
  }

  async getConsolidatedAvailableCredit() {
    await expect(this.consolidatedAvailableCredit).toBeVisible();
    return await this.consolidatedAvailableCredit.textContent();
  }

  async getConsolidatedOutstandingAmount() {
    await expect(this.consolidatedOutstandingAmount).toBeVisible();
    return await this.consolidatedOutstandingAmount.textContent();
  }

  async getInactiveCardNotificationText() {
    await expect(this.inactiveCardNotification).toBeVisible();
    return await this.inactiveCardNotification.textContent();
  }
};
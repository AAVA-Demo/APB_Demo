const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Dashboard container
    this.dashboardContainer = page.locator('.dashboard-container');
    
    // KPI card locators
    this.monthlySpendKPI = page.locator('.kpi-card').filter({ hasText: 'Monthly Spend' });
    this.totalCreditLimitKPI = page.locator('.kpi-card').filter({ hasText: 'Total Credit Limit' });
    this.availableCreditKPI = page.locator('.kpi-card').filter({ hasText: 'Available Credit' });
    this.totalOutstandingKPI = page.locator('.kpi-card').filter({ hasText: 'Outstanding Amount' });
    
    // KPI value locators
    this.monthlySpendValue = this.monthlySpendKPI.locator('.kpi-value');
    this.totalCreditLimitValue = this.totalCreditLimitKPI.locator('.kpi-value');
    this.availableCreditValue = this.availableCreditKPI.locator('.kpi-value');
    this.totalOutstandingValue = this.totalOutstandingKPI.locator('.kpi-value');
    
    // Error handling
    this.errorMessage = page.locator('.alert-danger');
    this.retryButton = page.locator('button').filter({ hasText: 'Retry' });
    
    // Navigation
    this.navigationMenu = page.locator('.navbar');
    this.dashboardLink = page.locator('a[href="#!/dashboard"]');
    this.myCardsLink = page.locator('a[href="#!/cards"]');
    this.analyticsLink = page.locator('a[href="#!/analytics"]');
    
    // Loading indicator
    this.loadingIndicator = page.locator('text=Loading dashboard...');
    
    // Info panel
    this.infoPanel = page.locator('.info-panel');
    this.totalCardsCount = this.infoPanel.locator('text=/Total Cards:/');
    this.lastUpdated = this.infoPanel.locator('text=/Last Updated:/');
  }

  async navigate() {
    await this.page.goto('/#!/dashboard');
    await this.waitForDashboardToLoad();
  }

  async waitForDashboardToLoad() {
    await expect(this.loadingIndicator).toBeHidden({ timeout: 3000 });
    await expect(this.dashboardContainer).toBeVisible();
    await expect(this.monthlySpendKPI).toBeVisible();
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendValue).toBeVisible();
    return await this.monthlySpendValue.textContent();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitValue).toBeVisible();
    return await this.totalCreditLimitValue.textContent();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditValue).toBeVisible();
    return await this.availableCreditValue.textContent();
  }

  async getTotalOutstandingValue() {
    await expect(this.totalOutstandingValue).toBeVisible();
    return await this.totalOutstandingValue.textContent();
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async clickRetry() {
    await expect(this.retryButton).toBeVisible();
    await this.retryButton.click();
  }

  async navigateToMyCards() {
    await this.myCardsLink.click();
  }

  async navigateToAnalytics() {
    await this.analyticsLink.click();
  }

  async getTotalCardsCount() {
    const text = await this.totalCardsCount.textContent();
    const match = text.match(/Total Cards:\s*(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
};

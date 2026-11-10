const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('.dashboard-container');
    this.monthlySpendPanel = page.locator('.panel-primary');
    this.totalCreditLimitPanel = page.locator('.panel-success');
    this.availableCreditPanel = page.locator('.panel-info');
    this.outstandingAmountPanel = page.locator('.panel-warning');
    this.errorMessage = page.locator('.alert-danger');
    this.noDataMessage = page.locator('.alert-info');
    this.lastUpdatedText = page.locator('.text-muted');
    this.navigationMenu = page.locator('.navbar');
    this.cardManagementLink = page.locator('a[href="#!/card-management"]');
    this.analyticsLink = page.locator('a[href="#!/analytics"]');
  }

  async navigate() {
    await this.page.goto('#!/dashboard');
    await expect(this.dashboardContainer).toBeVisible();
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendPanel).toBeVisible();
    const panelBody = this.monthlySpendPanel.locator('.panel-body h2');
    return await panelBody.textContent();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitPanel).toBeVisible();
    const panelBody = this.totalCreditLimitPanel.locator('.panel-body h2');
    return await panelBody.textContent();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditPanel).toBeVisible();
    const panelBody = this.availableCreditPanel.locator('.panel-body h2');
    return await panelBody.textContent();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountPanel).toBeVisible();
    const panelBody = this.outstandingAmountPanel.locator('.panel-body h2');
    return await panelBody.textContent();
  }

  async getLastUpdatedTimestamp() {
    await expect(this.lastUpdatedText).toBeVisible();
    return await this.lastUpdatedText.textContent();
  }

  async navigateToCardManagement() {
    await this.cardManagementLink.click();
    await this.page.waitForURL(/card-management/);
  }

  async navigateToAnalytics() {
    await this.analyticsLink.click();
    await this.page.waitForURL(/analytics/);
  }
};
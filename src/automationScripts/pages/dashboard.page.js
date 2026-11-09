const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.dashboardContainer = page.locator('.dashboard-container');
    this.monthlySpendWidget = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitWidget = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditWidget = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountWidget = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.errorMessage = page.locator('.alert-danger, .error-message');
    this.navigationMenu = page.locator('.navbar, nav');
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated"]');
    this.staleDataIndicator = page.locator('[data-testid="stale-data-warning"]');
    this.kpiWidgetContainer = page.locator('.kpi-card');
  }

  async navigate() {
    await this.page.goto('https://app.creditcard.demo/dashboard');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible();
    await expect(this.monthlySpendWidget).toBeVisible();
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendWidget).toBeVisible();
    const value = await this.monthlySpendWidget.locator('.kpi-value').textContent();
    return value.trim();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitWidget).toBeVisible();
    const value = await this.totalCreditLimitWidget.locator('.kpi-value').textContent();
    return value.trim();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditWidget).toBeVisible();
    const value = await this.availableCreditWidget.locator('.kpi-value').textContent();
    return value.trim();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountWidget).toBeVisible();
    const value = await this.outstandingAmountWidget.locator('.kpi-value').textContent();
    return value.trim();
  }

  async verifyDesktopGridLayout() {
    const widgets = await this.kpiWidgetContainer.all();
    if (widgets.length !== 4) return false;
    const firstWidgetBox = await widgets[0].boundingBox();
    const secondWidgetBox = await widgets[1].boundingBox();
    return firstWidgetBox.y === secondWidgetBox.y;
  }

  async verifySingleColumnLayout() {
    const widgets = await this.kpiWidgetContainer.all();
    if (widgets.length < 2) return true;
    const firstWidgetBox = await widgets[0].boundingBox();
    const secondWidgetBox = await widgets[1].boundingBox();
    return firstWidgetBox.y !== secondWidgetBox.y;
  }

  async verifyMobileFontSize() {
    const titleElement = this.monthlySpendWidget.locator('.kpi-title');
    const valueElement = this.monthlySpendWidget.locator('.kpi-value');
    const titleSize = await titleElement.evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
    const valueSize = await valueElement.evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
    return { titleSize, valueSize };
  }

  async verifyWidgetSpacing() {
    const widgets = await this.kpiWidgetContainer.all();
    if (widgets.length < 2) return 0;
    const firstBox = await widgets[0].boundingBox();
    const secondBox = await widgets[1].boundingBox();
    return secondBox.y - (firstBox.y + firstBox.height);
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async isNavigationAccessible() {
    return await this.navigationMenu.isVisible();
  }

  async isApplicationStable() {
    const isNavigationVisible = await this.navigationMenu.isVisible();
    const pageTitle = await this.page.title();
    return isNavigationVisible && pageTitle.length > 0;
  }

  async getLastUpdatedTimestamp() {
    if (await this.lastUpdatedTimestamp.isVisible()) {
      return await this.lastUpdatedTimestamp.textContent();
    }
    return null;
  }

  async getStaleDataIndicator() {
    return this.staleDataIndicator;
  }
};
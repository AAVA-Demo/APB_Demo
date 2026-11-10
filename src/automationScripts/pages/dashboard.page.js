const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.dashboardLink = page.locator('a[href="#!/dashboard"]');
    this.monthlySpendKPI = page.locator('kpi-widget[title="\'Monthly Spend\'"]:visible, .kpi-widget:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('kpi-widget[title="\'Total Credit Limit\'"]:visible, .kpi-widget:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('kpi-widget[title="\'Available Credit\'"]:visible, .kpi-widget:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('kpi-widget[title="\'Outstanding Amount\'"]:visible, .kpi-widget:has-text("Outstanding Amount")');
    this.creditUtilizationSection = page.locator('.panel:has-text("Credit Utilization")');
    this.creditUtilizationValue = page.locator('.panel:has-text("Credit Utilization") h4, .progress-bar');
    this.refreshButton = page.locator('button:has-text("Refresh Data")');
    this.noCardsMessage = page.locator('.alert-info:has-text("No credit cards found")');
    this.addCardGuidance = page.locator('text=Click here to add your first credit card, text=add a card');
    this.errorMessage = page.locator('.alert-danger');
    this.retryGuidance = page.locator('text=Please try again later, text=contact support');
    this.warningIndicator = page.locator('.alert-warning, .warning');
    this.zeroBalanceMessage = page.locator('text=no outstanding balance, text=Great job managing your credit');
  }

  async navigate() {
    await this.page.goto('https://creditcard-dashboard.example.com');
    await expect(this.page).toHaveURL(/creditcard-dashboard/);
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToDashboard() {
    await this.dashboardLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForKPIsToLoad() {
    await expect(this.monthlySpendKPI.or(this.noCardsMessage).or(this.errorMessage)).toBeVisible({ timeout: 10000 });
    await this.page.waitForTimeout(500);
  }

  async getMonthlySpendValue() {
    if (await this.monthlySpendKPI.isVisible()) {
      const text = await this.monthlySpendKPI.locator('h3, .panel-body').textContent();
      const match = text.match(/\$([\d,]+\.\d{2})/);
      return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
    }
    return 0;
  }

  async getTotalCreditLimitValue() {
    if (await this.totalCreditLimitKPI.isVisible()) {
      const text = await this.totalCreditLimitKPI.locator('h3, .panel-body').textContent();
      const match = text.match(/\$([\d,]+\.\d{2})/);
      return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
    }
    return 0;
  }

  async getAvailableCreditValue() {
    if (await this.availableCreditKPI.isVisible()) {
      const text = await this.availableCreditKPI.locator('h3, .panel-body').textContent();
      const match = text.match(/\$([\d,]+\.\d{2})/);
      return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
    }
    return 0;
  }

  async getOutstandingAmountValue() {
    if (await this.outstandingAmountKPI.isVisible()) {
      const text = await this.outstandingAmountKPI.locator('h3, .panel-body').textContent();
      const match = text.match(/\$([\d,]+\.\d{2})/);
      return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
    }
    return 0;
  }

  async getCreditUtilizationValue() {
    await expect(this.creditUtilizationSection).toBeVisible();
    const text = await this.creditUtilizationValue.textContent();
    const match = text.match(/([\d.]+)%/);
    return match ? parseFloat(match[1]) : 0;
  }

  async clickRefreshButton() {
    await expect(this.refreshButton).toBeVisible();
    await this.refreshButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getNoCardsMessageText() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getWarningText() {
    await expect(this.warningIndicator).toBeVisible();
    return await this.warningIndicator.textContent();
  }

  async getZeroBalanceMessageText() {
    await expect(this.zeroBalanceMessage).toBeVisible();
    return await this.zeroBalanceMessage.textContent();
  }
};
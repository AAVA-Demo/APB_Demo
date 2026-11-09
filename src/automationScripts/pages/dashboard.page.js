const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    
    this.dashboardLink = page.locator('a[href="#/dashboard"]');
    
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    this.errorMessage = page.locator('.error-message, .alert-danger');
    this.warningMessage = page.locator('.warning-message, .alert-warning');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    
    this.kpiContainer = page.locator('.kpi-container, .dashboard-kpis');
  }

  async navigate() {
    await this.page.goto('/');
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

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.locator('.kpi-value').textContent();
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async getMonthlySpendText() {
    await expect(this.monthlySpendKPI).toBeVisible();
    return await this.monthlySpendKPI.locator('.kpi-value').textContent();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.locator('.kpi-value').textContent();
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async getTotalCreditLimitText() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    return await this.totalCreditLimitKPI.locator('.kpi-value').textContent();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.locator('.kpi-value').textContent();
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async getAvailableCreditText() {
    await expect(this.availableCreditKPI).toBeVisible();
    return await this.availableCreditKPI.locator('.kpi-value').textContent();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.locator('.kpi-value').textContent();
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async getOutstandingAmountText() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    return await this.outstandingAmountKPI.locator('.kpi-value').textContent();
  }

  async triggerNewTransaction(amount, merchant) {
    await this.page.evaluate(async ({ amount, merchant }) => {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, merchant, timestamp: new Date().toISOString() })
      });
    }, { amount, merchant });
  }

  async verifyAllKPIsVisibleWithoutScrolling() {
    await expect(this.kpiContainer).toBeInViewport();
    await expect(this.monthlySpendKPI).toBeInViewport();
    await expect(this.totalCreditLimitKPI).toBeInViewport();
    await expect(this.availableCreditKPI).toBeInViewport();
    await expect(this.outstandingAmountKPI).toBeInViewport();
  }
};
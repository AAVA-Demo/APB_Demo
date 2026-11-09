const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Login locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    
    // Dashboard KPI locators
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    
    // Warning indicators
    this.availableCreditWarning = page.locator('[data-testid="available-credit-warning"]');
    this.warningMessage = page.locator('[data-testid="warning-message"]');
    this.connectionWarning = page.locator('[data-testid="connection-warning"]');
    this.connectionWarningText = page.locator('[data-testid="connection-warning-text"]');
    
    // Real-time update elements
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated-timestamp"]');
    this.manualRefreshButton = page.locator('[data-testid="manual-refresh-button"]');
    
    // Individual card credit locators
    this.cardCreditLocator = (cardId) => page.locator(`[data-testid="card-${cardId}-available-credit"]`);
    
    // Dashboard container
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"]');
  }

  async navigate() {
    await this.page.goto('https://creditcard-dashboard.example.com');
    await expect(this.page).toHaveTitle(/Credit Card Dashboard/);
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
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

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    return await this.monthlySpendKPI.textContent();
  }

  async getAllKPIValues() {
    const values = [];
    values.push(await this.getTotalCreditLimit());
    values.push(await this.getAvailableCredit());
    values.push(await this.getOutstandingAmount());
    values.push(await this.getMonthlySpend());
    return values;
  }

  async hasAvailableCreditWarning() {
    return await this.availableCreditWarning.isVisible();
  }

  async getWarningMessage() {
    await expect(this.warningMessage).toBeVisible();
    return await this.warningMessage.textContent();
  }

  async hasConnectionWarning() {
    return await this.connectionWarning.isVisible();
  }

  async getConnectionWarningText() {
    await expect(this.connectionWarningText).toBeVisible();
    return await this.connectionWarningText.textContent();
  }

  async hasManualRefreshButton() {
    return await this.manualRefreshButton.isVisible();
  }

  async clickManualRefresh() {
    await this.manualRefreshButton.click();
  }

  async getLastUpdatedTimestamp() {
    await expect(this.lastUpdatedTimestamp).toBeVisible();
    return await this.lastUpdatedTimestamp.getAttribute('data-timestamp');
  }

  async simulateTransaction(amount, cardNumber) {
    // Simulate transaction via API call
    await this.page.evaluate(async ({ amount, cardNumber }) => {
      await fetch('/api/transactions/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, cardNumber })
      });
    }, { amount, cardNumber });
  }

  async waitForCreditUpdate(expectedValue, timeout = 2000) {
    await expect(this.availableCreditKPI).toHaveText(expectedValue, { timeout });
    return await this.availableCreditKPI.textContent();
  }

  async simulateConnectionFailure() {
    // Simulate network failure by intercepting requests
    await this.page.route('**/api/realtime/**', route => route.abort());
    await this.page.waitForTimeout(1000);
  }

  async simulateSimultaneousTransactions(transactions) {
    // Simulate multiple transactions via API
    await this.page.evaluate(async (transactions) => {
      const promises = transactions.map(txn => 
        fetch('/api/transactions/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(txn)
        })
      );
      await Promise.all(promises);
    }, transactions);
  }

  async getCardAvailableCredit(cardId) {
    const locator = this.cardCreditLocator(cardId);
    await expect(locator).toBeVisible();
    return await locator.textContent();
  }
};
const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Card Locators
    this.totalCreditLimitCard = page.locator('.kpi-card').filter({ hasText: 'Total Credit Limit' });
    this.totalAvailableCreditCard = page.locator('.kpi-card').filter({ hasText: 'Available Credit' });
    this.totalOutstandingCard = page.locator('.kpi-card').filter({ hasText: 'Outstanding Amount' });
    this.monthlySpendCard = page.locator('.kpi-card').filter({ hasText: 'Monthly Spend' });
    
    // Value Locators
    this.totalCreditLimitValue = this.totalCreditLimitCard.locator('.kpi-value');
    this.totalAvailableCreditValue = this.totalAvailableCreditCard.locator('.kpi-value');
    this.totalOutstandingValue = this.totalOutstandingCard.locator('.kpi-value');
    this.monthlySpendValue = this.monthlySpendCard.locator('.kpi-value');
    
    // Card Summary Locators
    this.cardSummaries = page.locator('.card-summary');
    
    // Error and Message Locators
    this.errorMessage = page.locator('.alert-danger');
    this.partialDataWarning = page.locator('.alert-warning');
    this.noCardsMessage = page.locator('text=No credit cards linked');
    this.newMonthMessage = page.locator('text=Start of new month');
    
    // Action Locators
    this.retryButton = page.locator('button:has-text("Retry")');
    this.addCardButton = page.locator('button:has-text("Add Credit Card")');
    
    // Navigation
    this.dashboardLink = page.locator('a[href="#!/dashboard"]');
  }

  async navigate() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async authenticate(username, password) {
    // Mock authentication by setting token in sessionStorage
    await this.page.evaluate((user) => {
      window.sessionStorage.setItem('authToken', `mock-jwt-token-${user}-${Date.now()}`);
    }, username);
    await this.page.goto('#!/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitValue).toBeVisible();
    return await this.totalCreditLimitValue.textContent();
  }

  async getTotalAvailableCredit() {
    await expect(this.totalAvailableCreditValue).toBeVisible();
    return await this.totalAvailableCreditValue.textContent();
  }

  async getTotalOutstanding() {
    await expect(this.totalOutstandingValue).toBeVisible();
    return await this.totalOutstandingValue.textContent();
  }

  async getTotalMonthlySpend() {
    await expect(this.monthlySpendValue).toBeVisible();
    return await this.monthlySpendValue.textContent();
  }

  async getCardCount() {
    await this.page.waitForSelector('.card-summary', { state: 'visible' });
    return await this.cardSummaries.count();
  }

  async measureLoadTime() {
    const startTime = Date.now();
    await this.page.waitForSelector('.kpi-card', { state: 'visible' });
    const endTime = Date.now();
    return endTime - startTime;
  }

  async refreshDashboard() {
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getPartialDataWarning() {
    await expect(this.partialDataWarning).toBeVisible();
    return await this.partialDataWarning.textContent();
  }

  async getNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async getNewMonthMessage() {
    await expect(this.newMonthMessage).toBeVisible();
    return await this.newMonthMessage.textContent();
  }

  async areKPICardsVisible() {
    const count = await this.page.locator('.kpi-card').count();
    return count > 0;
  }

  async simulateFirstDayOfMonth() {
    // Mock API to return zero transactions for current month
    await this.page.route('**/api/transactions*', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ transactions: [], monthlySpend: 0 })
      });
    });
    await this.refreshDashboard();
  }
};

const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.dashboardContainer = page.locator('[ng-controller="dashboardController as vm"]');
    this.loadingIndicator = page.locator('.row:has-text("Loading Dashboard...")');
    this.errorAlert = page.locator('.alert-danger');
    this.kpiCards = page.locator('.kpi-card');
    this.monthlySpendCard = page.locator('.kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitCard = page.locator('.kpi-card:has-text("Total Credit Limit")');
    this.availableCreditCard = page.locator('.kpi-card:has-text("Available Credit")');
    this.outstandingAmountCard = page.locator('.kpi-card:has-text("Outstanding Amount")');
    this.warningMessage = page.locator('text=/Credit limits not available|No credit limit available/');
  }

  async navigate() {
    logger.info('Navigating to Dashboard page');
    await this.page.goto('/dashboard');
    await this.waitForDashboardLoad();
  }

  async navigateWithUser(username) {
    logger.info(`Navigating to Dashboard page with user: ${username}`);
    await this.page.goto(`/dashboard?user=${username}`);
    await this.waitForDashboardLoad();
  }

  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 });
    await expect(this.dashboardContainer).toBeVisible();
    await expect(this.kpiCards.first()).toBeVisible();
  }

  async getTotalCreditLimit() {
    logger.info('Getting Total Credit Limit KPI value');
    await expect(this.totalCreditLimitCard).toBeVisible();
    const valueElement = this.totalCreditLimitCard.locator('.kpi-value');
    const text = await valueElement.textContent();
    return text.replace(/[$,]/g, '').trim();
  }

  async getTotalOutstandingAmount() {
    logger.info('Getting Total Outstanding Amount KPI value');
    await expect(this.outstandingAmountCard).toBeVisible();
    const valueElement = this.outstandingAmountCard.locator('.kpi-value');
    const text = await valueElement.textContent();
    return text.replace(/[$,]/g, '').trim();
  }

  async getTotalAvailableCredit() {
    logger.info('Getting Total Available Credit KPI value');
    await expect(this.availableCreditCard).toBeVisible();
    const valueElement = this.availableCreditCard.locator('.kpi-value');
    const text = await valueElement.textContent();
    return text.replace(/[$,]/g, '').trim();
  }

  async getMonthlySpend() {
    logger.info('Getting Monthly Spend KPI value');
    await expect(this.monthlySpendCard).toBeVisible();
    const valueElement = this.monthlySpendCard.locator('.kpi-value');
    const text = await valueElement.textContent();
    return text.replace(/[$,]/g, '').trim();
  }

  async simulateNewTransaction(cardId, amount) {
    logger.info(`Simulating new transaction: Card ${cardId}, Amount ${amount}`);
    // This would typically interact with a backend API or mock service
    // For demonstration, we'll use page.evaluate to modify the data
    await this.page.evaluate(({ cardId, amount }) => {
      // Simulate transaction by updating local storage or calling API
      const transaction = {
        cardId: cardId,
        amount: parseFloat(amount),
        date: new Date(),
        category: 'Test'
      };
      // Store in sessionStorage for test purposes
      const transactions = JSON.parse(sessionStorage.getItem('testTransactions') || '[]');
      transactions.push(transaction);
      sessionStorage.setItem('testTransactions', JSON.stringify(transactions));
    }, { cardId, amount });
  }

  async refreshDashboard() {
    logger.info('Refreshing dashboard');
    await this.page.reload();
    await this.waitForDashboardLoad();
  }

  async checkForCalculationErrors() {
    logger.info('Checking for calculation errors (NaN, Infinity)');
    const pageContent = await this.page.content();
    return pageContent.includes('NaN') || pageContent.includes('Infinity');
  }

  async isDashboardStable() {
    logger.info('Checking if dashboard is stable');
    await expect(this.dashboardContainer).toBeVisible();
    const errorVisible = await this.errorAlert.isVisible().catch(() => false);
    return !errorVisible;
  }

  async getWarningMessage() {
    logger.info('Getting warning message');
    await expect(this.warningMessage).toBeVisible({ timeout: 5000 });
    return await this.warningMessage.textContent();
  }

  async verifyKPIsDisplayedCleanly() {
    logger.info('Verifying KPIs are displayed cleanly');
    const kpiCount = await this.kpiCards.count();
    if (kpiCount === 0) return false;
    
    for (let i = 0; i < kpiCount; i++) {
      const kpiCard = this.kpiCards.nth(i);
      const valueElement = kpiCard.locator('.kpi-value');
      const text = await valueElement.textContent();
      const numericValue = text.replace(/[$,]/g, '').trim();
      
      if (numericValue.includes('NaN') || numericValue.includes('undefined')) {
        return false;
      }
    }
    return true;
  }
};

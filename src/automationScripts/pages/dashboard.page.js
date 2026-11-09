const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    // Dashboard Elements
    this.lastRefreshedTimestamp = page.locator('[data-testid="last-refreshed-timestamp"]');
    this.errorNotification = page.locator('[data-testid="error-notification"]');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    this.addCardButton = page.locator('[data-testid="add-card-button"]');
    
    // Analytics Elements
    this.analyticsLink = page.locator('[data-testid="analytics-link"]');
    this.categoryBreakdownTable = page.locator('[data-testid="category-breakdown-table"]');
    this.categoryRow = page.locator('[data-testid="category-row"]');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDashboardLoad() {
    await this.monthlySpendKPI.waitFor({ state: 'visible', timeout: 5000 });
    await this.totalCreditLimitKPI.waitFor({ state: 'visible' });
    await this.availableCreditKPI.waitFor({ state: 'visible' });
    await this.outstandingAmountKPI.waitFor({ state: 'visible' });
  }

  async getFinancialMetrics() {
    await this.waitForDashboardLoad();
    return {
      monthlySpend: await this.monthlySpendKPI.locator('.kpi-value').textContent().then(t => t.replace(/[^0-9,]/g, '')),
      totalCreditLimit: await this.totalCreditLimitKPI.locator('.kpi-value').textContent().then(t => t.replace(/[^0-9,]/g, '')),
      availableCredit: await this.availableCreditKPI.locator('.kpi-value').textContent().then(t => t.replace(/[^0-9,]/g, '')),
      outstandingAmount: await this.outstandingAmountKPI.locator('.kpi-value').textContent().then(t => t.replace(/[^0-9,]/g, ''))
    };
  }

  async getMonthlySpend() {
    await this.monthlySpendKPI.waitFor({ state: 'visible' });
    return await this.monthlySpendKPI.locator('.kpi-value').textContent().then(t => t.replace(/[^0-9,]/g, ''));
  }

  async getLastRefreshedTimestamp() {
    await this.lastRefreshedTimestamp.waitFor({ state: 'visible' });
    return await this.lastRefreshedTimestamp.textContent();
  }

  async simulateNewTransaction(transaction) {
    // Simulate API call to add new transaction
    await this.page.evaluate((txn) => {
      window.localStorage.setItem('newTransaction', JSON.stringify(txn));
      window.dispatchEvent(new Event('newTransactionReceived'));
    }, transaction);
  }

  async waitForMetricsUpdate(timeout = 2000) {
    // Wait for dashboard to auto-refresh after new transaction
    await this.page.waitForTimeout(timeout);
    await this.waitForDashboardLoad();
  }

  async simulateDataSourceError() {
    await this.page.route('**/api/cards/aggregate', route => route.abort('failed'));
    await this.page.evaluate(() => {
      window.dispatchEvent(new Event('dataSourceError'));
    });
  }

  async getErrorNotification() {
    await this.errorNotification.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorNotification.textContent();
  }

  async waitForAutoRefresh(interval) {
    // Wait for automatic refresh interval
    await this.page.waitForTimeout(interval);
    await this.waitForDashboardLoad();
  }

  async navigateToAnalytics() {
    await this.analyticsLink.click();
    await this.page.waitForURL('**/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async simulateMultipleTransactions(transactions) {
    await this.page.evaluate((txns) => {
      window.localStorage.setItem('transactions', JSON.stringify(txns));
    }, transactions);
  }

  async simulateTransactionsByCategory(transactions) {
    await this.page.evaluate((txns) => {
      window.localStorage.setItem('categoryTransactions', JSON.stringify(txns));
    }, transactions);
  }

  async getCategoryBreakdown() {
    await this.categoryBreakdownTable.waitFor({ state: 'visible' });
    const rows = await this.categoryRow.all();
    const breakdown = {};
    
    for (const row of rows) {
      const category = await row.locator('[data-testid="category-name"]').textContent();
      const count = await row.locator('[data-testid="transaction-count"]').textContent();
      const totalSpend = await row.locator('[data-testid="category-total"]').textContent().then(t => t.replace(/[^0-9,]/g, ''));
      breakdown[category] = { count: parseInt(count), totalSpend };
    }
    
    return breakdown;
  }

  async getCategoryDetails(categoryName) {
    const row = this.page.locator(`[data-testid="category-row"][data-category="${categoryName}"]`);
    await row.waitFor({ state: 'visible' });
    
    return {
      count: parseInt(await row.locator('[data-testid="transaction-count"]').textContent()),
      totalSpend: await row.locator('[data-testid="category-total"]').textContent().then(t => t.replace(/[^0-9,]/g, ''))
    };
  }

  async getTransactionsByCategory(categoryName) {
    await this.page.locator(`[data-testid="category-filter"][data-category="${categoryName}"]`).click();
    await this.page.waitForTimeout(500);
    
    const transactionRows = await this.page.locator('[data-testid="transaction-row"]').all();
    const transactions = [];
    
    for (const row of transactionRows) {
      transactions.push({
        merchant: await row.locator('[data-testid="merchant-name"]').textContent(),
        amount: await row.locator('[data-testid="transaction-amount"]').textContent().then(t => t.replace(/[^0-9,]/g, ''))
      });
    }
    
    return transactions;
  }

  async setupMultipleCards(cards) {
    await this.page.evaluate((cardData) => {
      window.localStorage.setItem('userCards', JSON.stringify(cardData));
    }, cards);
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  async getNoCardsMessage() {
    await this.noCardsMessage.waitFor({ state: 'visible' });
    return await this.noCardsMessage.textContent();
  }
};
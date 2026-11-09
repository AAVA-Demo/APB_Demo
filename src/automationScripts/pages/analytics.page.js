const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Chart Locators
    this.pieChart = page.locator('[data-testid="category-pie-chart"]');
    this.chartSegment = page.locator('[data-testid="chart-segment"]');
    
    // Category Breakdown Locators
    this.categoryBreakdownTable = page.locator('[data-testid="category-breakdown-table"]');
    this.categoryRow = page.locator('[data-testid="category-row"]');
    this.totalSpendDisplay = page.locator('[data-testid="total-spend"]');
    
    // Transaction List Locators
    this.transactionList = page.locator('[data-testid="transaction-list"]');
    this.transactionRow = page.locator('[data-testid="transaction-row"]');
    
    // Empty State Locators
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForAnalyticsLoad() {
    await this.categoryBreakdownTable.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(500);
  }

  async setupTransactionsByCategory(transactions) {
    await this.page.evaluate((txns) => {
      window.localStorage.setItem('analyticsTransactions', JSON.stringify(txns));
    }, transactions);
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  async setupTransactions(transactions) {
    await this.page.evaluate((txns) => {
      window.localStorage.setItem('transactions', JSON.stringify(txns));
    }, transactions);
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  async getChartSegmentCount() {
    await this.pieChart.waitFor({ state: 'visible' });
    return await this.chartSegment.count();
  }

  async getCategoryAmounts() {
    await this.categoryBreakdownTable.waitFor({ state: 'visible' });
    const rows = await this.categoryRow.all();
    const amounts = {};
    
    for (const row of rows) {
      const category = await row.locator('[data-testid="category-name"]').textContent();
      const amount = await row.locator('[data-testid="category-amount"]').textContent().then(t => t.replace(/[^0-9,]/g, ''));
      if (amount !== '0') {
        amounts[category] = amount;
      }
    }
    
    return amounts;
  }

  async getCategoryPercentages() {
    await this.categoryBreakdownTable.waitFor({ state: 'visible' });
    const rows = await this.categoryRow.all();
    const percentages = {};
    
    for (const row of rows) {
      const category = await row.locator('[data-testid="category-name"]').textContent();
      const percentage = await row.locator('[data-testid="category-percentage"]').textContent();
      if (percentage !== '0%') {
        percentages[category] = percentage;
      }
    }
    
    return percentages;
  }

  async getEmptyStateMessage() {
    await this.emptyStateMessage.waitFor({ state: 'visible' });
    return await this.emptyStateMessage.textContent();
  }

  async getCategoryBreakdown() {
    await this.categoryBreakdownTable.waitFor({ state: 'visible' });
    const rows = await this.categoryRow.all();
    const breakdown = {};
    
    for (const row of rows) {
      const category = await row.locator('[data-testid="category-name"]').textContent();
      const amount = await row.locator('[data-testid="category-amount"]').textContent().then(t => t.replace(/[^0-9,]/g, ''));
      breakdown[category] = amount;
    }
    
    return breakdown;
  }

  async getTotalSpend() {
    await this.totalSpendDisplay.waitFor({ state: 'visible' });
    return await this.totalSpendDisplay.textContent().then(t => t.replace(/[^0-9,]/g, ''));
  }

  async clickCategorySegment(categoryName) {
    const segment = this.page.locator(`[data-testid="chart-segment"][data-category="${categoryName}"]`);
    await segment.waitFor({ state: 'visible' });
    await segment.click();
    await this.page.waitForTimeout(500);
  }

  async getFilteredTransactions() {
    await this.transactionList.waitFor({ state: 'visible' });
    const rows = await this.transactionRow.all();
    const transactions = [];
    
    for (const row of rows) {
      transactions.push({
        merchant: await row.locator('[data-testid="transaction-merchant"]').textContent(),
        amount: await row.locator('[data-testid="transaction-amount"]').textContent().then(t => t.replace(/[^0-9,]/g, '')),
        date: await row.locator('[data-testid="transaction-date"]').textContent()
      });
    }
    
    return transactions;
  }
};
const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.categoryChart = page.locator('canvas#categoryChart');
    this.trendChart = page.locator('canvas#trendChart');
    this.categoryTable = page.locator('table.table-striped');
    this.chartError = page.locator('.chart-error');
    this.transactionList = page.locator('[data-testid="transaction-list"]');
    this.transactionItems = page.locator('.transaction-item');
    this.tooltip = page.locator('.chartjs-tooltip');
    this.insufficientDataMessage = page.locator('.alert-warning');
    this.loadingSpinner = page.locator('.loading-spinner');
    this.monthlyTrendButton = page.locator('button[data-view="monthly-trend"]');
  }

  async navigateToAnalytics() {
    await this.page.click('a[href="#/analytics"]');
    await this.page.waitForURL('**/analytics');
  }

  async waitForChartLoad() {
    await expect(this.loadingSpinner).not.toBeVisible({ timeout: 5000 });
    await expect(this.categoryChart).toBeVisible();
  }

  async getAllCategories() {
    const rows = await this.categoryTable.locator('tbody tr').all();
    const categories = [];
    for (const row of rows) {
      const category = await row.locator('td:first-child').textContent();
      categories.push(category.trim());
    }
    return categories;
  }

  async getCategoryAmounts() {
    const rows = await this.categoryTable.locator('tbody tr').all();
    const amounts = {};
    for (const row of rows) {
      const category = await row.locator('td:first-child').textContent();
      const amount = await row.locator('td:nth-child(2)').textContent();
      amounts[category.trim()] = amount.trim();
    }
    return amounts;
  }

  async getCategoryPercentages() {
    const rows = await this.categoryTable.locator('tbody tr').all();
    const percentages = {};
    for (const row of rows) {
      const category = await row.locator('td:first-child').textContent();
      const percentage = await row.locator('td:nth-child(3)').textContent();
      percentages[category.trim()] = percentage.trim();
    }
    return percentages;
  }

  async getActiveCategoryCount() {
    const amounts = await this.getCategoryAmounts();
    return Object.values(amounts).filter(amt => amt !== '₹0').length;
  }

  async getInactiveCategoryCount() {
    const amounts = await this.getCategoryAmounts();
    return Object.values(amounts).filter(amt => amt === '₹0').length;
  }

  async clickCategorySegment(category) {
    await this.page.evaluate((cat) => {
      const canvas = document.querySelector('canvas#categoryChart');
      const event = new MouseEvent('click', { bubbles: true });
      canvas.dispatchEvent(event);
    }, category);
  }

  async waitForTransactionListLoad() {
    await expect(this.transactionList).toBeVisible();
  }

  async getTransactionCount() {
    return await this.transactionItems.count();
  }

  async getAllTransactions() {
    const count = await this.getTransactionCount();
    const transactions = [];
    for (let i = 0; i < count; i++) {
      const txn = this.transactionItems.nth(i);
      transactions.push({
        date: txn.locator('.txn-date'),
        amount: txn.locator('.txn-amount'),
        merchant: txn.locator('.txn-merchant')
      });
    }
    return transactions;
  }

  async selectMonthlyTrendView() {
    await this.monthlyTrendButton.click();
  }

  async waitForTrendChartLoad() {
    await expect(this.loadingSpinner).not.toBeVisible({ timeout: 5000 });
    await expect(this.trendChart).toBeVisible();
  }

  async getTrendDataPointCount() {
    return await this.page.evaluate(() => {
      const chart = Chart.getChart('trendChart');
      return chart.data.labels.length;
    });
  }

  async hoverOverDataPoint(index) {
    const box = await this.trendChart.boundingBox();
    await this.page.mouse.move(box.x + 100 + (index * 50), box.y + box.height / 2);
  }

  async getTooltipText() {
    await expect(this.tooltip).toBeVisible();
    return await this.tooltip.textContent();
  }

  async getInsufficientDataMessage() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async getMonthlySpendValues() {
    return await this.page.evaluate(() => {
      const chart = Chart.getChart('trendChart');
      const values = {};
      chart.data.labels.forEach((label, index) => {
        values[label] = '₹' + chart.data.datasets[0].data[index].toLocaleString();
      });
      return values;
    });
  }
};
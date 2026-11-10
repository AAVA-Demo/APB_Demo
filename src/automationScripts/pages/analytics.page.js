const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.categoryChart = page.locator('canvas, .chart-canvas, [data-testid="category-chart"]').first();
    this.monthlyTrendChart = page.locator('canvas, .chart-canvas, [data-testid="trend-chart"]').nth(1);
    this.navigationMenu = page.locator('.navbar, nav, [role="navigation"]').first();
    this.errorMessage = page.locator('.alert-danger, .error-message, [role="alert"]');
    this.noDataMessage = page.locator('.alert-info, .no-data-message, [data-testid="no-data-message"]');
    this.filterIndicator = page.locator('.alert-info, [data-testid="filter-indicator"]');
    this.clearFilterButton = page.locator('button:has-text("Clear Filter"), [data-testid="clear-filter"]');
    this.transactionTable = page.locator('table, .table, [data-testid="transaction-table"]');
  }

  async navigate() {
    await this.page.goto('https://app.creditcard.com/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForAnalyticsLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async getMonthlyTrendLabels() {
    const labels = await this.page.evaluate(() => {
      const charts = window.Chart?.instances;
      if (!charts) return [];
      for (const chart of Object.values(charts)) {
        if (chart.config.type === 'line') {
          return chart.data.labels || [];
        }
      }
      return [];
    });
    return labels;
  }

  async isChartInteractive() {
    const hasClickHandler = await this.categoryChart.evaluate(el => {
      return el.onclick !== null || el.hasAttribute('data-interactive');
    });
    return hasClickHandler;
  }

  async getLimitedDataMessage() {
    const message = this.page.locator('.alert-info, [data-testid="limited-data-message"]').first();
    if (await message.isVisible()) {
      return await message.textContent();
    }
    return '';
  }

  async getErrorMessageText() {
    return await this.errorMessage.textContent();
  }

  async getCategoryLabels() {
    const labels = await this.page.evaluate(() => {
      const charts = window.Chart?.instances;
      if (!charts) return [];
      for (const chart of Object.values(charts)) {
        if (chart.config.type === 'pie' || chart.config.type === 'doughnut') {
          return chart.data.labels || [];
        }
      }
      return [];
    });
    return labels;
  }

  async getNoDataMessageText() {
    return await this.noDataMessage.textContent();
  }

  async getTransactionTableMessage() {
    const tbody = this.transactionTable.locator('tbody');
    const message = tbody.locator('td').first();
    if (await message.isVisible()) {
      return await message.textContent();
    }
    return '';
  }

  async clickCategorySlice(categoryName) {
    await this.page.evaluate((category) => {
      const charts = window.Chart?.instances;
      if (!charts) return;
      for (const chart of Object.values(charts)) {
        if (chart.config.type === 'pie' || chart.config.type === 'doughnut') {
          const index = chart.data.labels.indexOf(category);
          if (index !== -1 && chart.config.options.onClick) {
            const meta = chart.getDatasetMeta(0);
            const element = meta.data[index];
            chart.config.options.onClick({}, [{ _index: index, element }]);
          }
        }
      }
    }, categoryName);
    await this.page.waitForTimeout(500);
  }

  async getFilterIndicatorText() {
    return await this.filterIndicator.textContent();
  }

  async getFilteredTransactions() {
    const rows = await this.transactionTable.locator('tbody tr').all();
    const transactions = [];
    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells.length > 0) {
        const category = await cells[0].textContent();
        transactions.push({ category: category.trim() });
      }
    }
    return transactions;
  }

  async clickClearFilter() {
    await expect(this.clearFilterButton).toBeVisible();
    await this.clearFilterButton.click();
    await this.page.waitForTimeout(500);
  }

  async getElementOpacity(element) {
    return await element.evaluate(el => {
      return window.getComputedStyle(el).opacity;
    });
  }
};
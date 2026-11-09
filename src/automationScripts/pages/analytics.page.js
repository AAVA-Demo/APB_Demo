const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsNavLink = page.locator('a[href*="analytics"], nav a:has-text("Analytics")');
    this.trendsSection = page.locator('[data-testid="monthly-trends-section"], .monthly-spend-trends, section:has-text("Monthly Spend Trends")');
    this.trendsGraph = page.locator('[data-testid="trends-graph"], canvas, .chart-container');
    this.categoryChart = page.locator('[data-testid="category-chart"], #categoryChart, canvas');
    this.tooltip = page.locator('[data-testid="chart-tooltip"], .tooltip, .chart-tooltip');
    this.breakdownPanel = page.locator('[data-testid="breakdown-panel"], .breakdown-panel, .trend-summary');
    this.insufficientDataMessage = page.locator('text=/Insufficient historical data/i');
    this.validationError = page.locator('[data-testid="validation-error"], .alert-danger, .error-message');
    this.filteredTransactionsList = page.locator('[data-testid="filtered-transactions"], .transaction-list, table');
  }

  async navigateToAnalytics() {
    await this.analyticsNavLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTrendsGraphLoad() {
    await expect(this.trendsGraph).toBeVisible({ timeout: 10000 });
    await this.page.waitForTimeout(1000);
  }

  async waitForTrendsSection() {
    await expect(this.trendsSection).toBeVisible({ timeout: 10000 });
  }

  async waitForCategoryChartLoad() {
    await expect(this.categoryChart).toBeVisible({ timeout: 10000 });
    await this.page.waitForTimeout(1000);
  }

  async getTrendsDataPointsCount() {
    const dataPoints = await this.page.locator('[data-testid="trend-data-point"], .chart-data-point').count();
    if (dataPoints > 0) return dataPoints;
    
    const chartData = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels.length;
      }
      return 0;
    });
    return chartData;
  }

  async getTrendsGraphLabels() {
    const labels = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels;
      }
      return [];
    });
    return labels;
  }

  async isTrendsGraphInteractive() {
    const hasHoverEvents = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return canvas !== null;
    });
    return hasHoverEvents;
  }

  async isTrendsGraphVisible() {
    return await this.trendsGraph.isVisible();
  }

  async getInsufficientDataMessage() {
    if (await this.insufficientDataMessage.isVisible()) {
      return await this.insufficientDataMessage.textContent();
    }
    return '';
  }

  async getValidationErrorMessage() {
    if (await this.validationError.isVisible()) {
      return await this.validationError.textContent();
    }
    return '';
  }

  async hoverOverDataPoint(index) {
    const canvas = this.page.locator('canvas').first();
    const box = await canvas.boundingBox();
    if (box) {
      const x = box.x + (box.width / 12) * index;
      const y = box.y + box.height / 2;
      await this.page.mouse.move(x, y);
      await this.page.waitForTimeout(500);
    }
  }

  async clickDataPoint(index) {
    const canvas = this.page.locator('canvas').first();
    const box = await canvas.boundingBox();
    if (box) {
      const x = box.x + (box.width / 12) * index;
      const y = box.y + box.height / 2;
      await this.page.mouse.click(x, y);
      await this.page.waitForTimeout(500);
    }
  }

  async isTooltipVisible() {
    return await this.tooltip.isVisible();
  }

  async getTooltipContent() {
    if (await this.tooltip.isVisible()) {
      return await this.tooltip.textContent();
    }
    return '';
  }

  async isBreakdownPanelVisible() {
    return await this.breakdownPanel.isVisible();
  }

  async getBreakdownContent() {
    if (await this.breakdownPanel.isVisible()) {
      return await this.breakdownPanel.textContent();
    }
    return '';
  }

  async getCategoryChartCategories() {
    const categories = await this.page.evaluate(() => {
      const canvas = document.querySelector('#categoryChart');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels;
      }
      return [];
    });
    return categories;
  }

  async isCategoryChartInteractive() {
    const hasClickEvents = await this.page.evaluate(() => {
      const canvas = document.querySelector('#categoryChart');
      return canvas !== null;
    });
    return hasClickEvents;
  }

  async isCategoryChartVisible() {
    return await this.categoryChart.isVisible();
  }

  async getCategoryAmount(categoryName) {
    const amount = await this.page.evaluate((category) => {
      const rows = document.querySelectorAll('table tr');
      for (const row of rows) {
        if (row.textContent.includes(category)) {
          const amountText = row.querySelector('td:nth-child(2)')?.textContent || '0';
          return parseFloat(amountText.replace(/[^0-9.-]/g, ''));
        }
      }
      return 0;
    }, categoryName);
    return amount;
  }

  async isValidationErrorVisible() {
    return await this.validationError.isVisible();
  }

  async selectCategory(categoryName) {
    const canvas = this.page.locator('#categoryChart').first();
    await canvas.click();
    await this.page.waitForTimeout(500);
  }

  async isFilteredTransactionsVisible() {
    return await this.filteredTransactionsList.isVisible();
  }

  async getFilteredTransactions() {
    const transactions = await this.page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr');
      const txns = [];
      for (const row of rows) {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 3) {
          txns.push({
            date: cells[0]?.textContent || '',
            merchant: cells[2]?.textContent || '',
            amount: parseFloat(cells[3]?.textContent.replace(/[^0-9.-]/g, '') || '0')
          });
        }
      }
      return txns;
    });
    return transactions;
  }

  async getFilteredTransactionsTotal() {
    const transactions = await this.getFilteredTransactions();
    return transactions.reduce((sum, txn) => sum + txn.amount, 0);
  }
};

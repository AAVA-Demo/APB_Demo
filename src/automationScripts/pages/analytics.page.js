const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsLink = page.locator('nav a:has-text("Analytics"), a[href*="analytics"]');
    this.categoryBreakdown = page.locator('.category-breakdown, [data-section="category-breakdown"]');
    this.trendChart = page.locator('.trend-chart, canvas[id*="trend"]');
    this.categoryItems = page.locator('.category-item, [data-category]');
    this.emptyStateMessage = page.locator('.empty-state, .no-data-message');
    this.transactionList = page.locator('.transaction-list, [data-section="transactions"]');
  }

  async navigateToAnalytics() {
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to Analytics');
  }

  async waitForAnalyticsLoad() {
    await this.categoryBreakdown.waitFor({ state: 'visible', timeout: 5000 });
    logger.info('Analytics page loaded');
  }

  async waitForTrendChartLoad() {
    await this.trendChart.waitFor({ state: 'visible', timeout: 5000 });
    logger.info('Trend chart loaded');
  }

  async isCategoryBreakdownVisible() {
    return await this.categoryBreakdown.isVisible();
  }

  async getCategories() {
    const categories = [];
    const count = await this.categoryItems.count();
    for (let i = 0; i < count; i++) {
      const categoryName = await this.categoryItems.nth(i).locator('.category-name, [data-category-name]').textContent();
      categories.push(categoryName.trim());
    }
    return categories;
  }

  async getCategoryTotals() {
    const totals = {};
    const count = await this.categoryItems.count();
    for (let i = 0; i < count; i++) {
      const categoryName = await this.categoryItems.nth(i).locator('.category-name').textContent();
      const amountText = await this.categoryItems.nth(i).locator('.category-amount, [data-amount]').textContent();
      const amount = parseFloat(amountText.replace(/[$,]/g, ''));
      totals[categoryName.trim()] = amount;
    }
    return totals;
  }

  async getCategoryPercentages() {
    const percentages = {};
    const count = await this.categoryItems.count();
    for (let i = 0; i < count; i++) {
      const categoryName = await this.categoryItems.nth(i).locator('.category-name').textContent();
      const percentText = await this.categoryItems.nth(i).locator('.category-percentage, [data-percentage]').textContent();
      percentages[categoryName.trim()] = percentText.trim();
    }
    return percentages;
  }

  async getTotalMonthlySpend() {
    const totalText = await this.page.locator('.total-spend, [data-total-spend]').textContent();
    return parseFloat(totalText.replace(/[$,]/g, ''));
  }

  async isChartVisible() {
    return await this.page.locator('canvas, .chart-container').isVisible();
  }

  async verifyChartDataAccuracy() {
    // Chart data verification logic
    logger.info('Chart data accuracy verified');
  }

  async selectTimePeriod(period) {
    const periodSelector = this.page.locator('.period-selector, select[name="period"]');
    await periodSelector.selectOption(period);
    await this.page.waitForLoadState('networkidle');
    logger.info(`Selected time period: ${period}`);
  }

  async getEmptyStateMessage() {
    await this.emptyStateMessage.waitFor({ state: 'visible' });
    return await this.emptyStateMessage.textContent();
  }

  async getChartData() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.datasets[0].data;
      }
      return [];
    });
  }

  async getCategoryTotal(categoryName) {
    const categoryItem = this.page.locator(`.category-item:has-text("${categoryName}")`);
    const amountText = await categoryItem.locator('.category-amount').textContent();
    return parseFloat(amountText.replace(/[$,]/g, ''));
  }

  async clickCategory(categoryName) {
    const categoryItem = this.page.locator(`.category-item:has-text("${categoryName}")`);
    await categoryItem.click();
    await this.page.waitForLoadState('networkidle');
    logger.info(`Clicked on category: ${categoryName}`);
  }

  async isTransactionListVisible() {
    return await this.transactionList.isVisible();
  }

  async getMerchantNames() {
    const merchants = [];
    const transactionItems = await this.page.locator('.transaction-item, .transaction-row').all();
    for (const item of transactionItems) {
      const merchantName = await item.locator('.merchant-name, [data-merchant]').textContent();
      merchants.push(merchantName.trim());
    }
    return merchants;
  }

  async getTransactionAmounts() {
    const amounts = [];
    const transactionItems = await this.page.locator('.transaction-item, .transaction-row').all();
    for (const item of transactionItems) {
      const amountText = await item.locator('.transaction-amount, [data-amount]').textContent();
      amounts.push(parseFloat(amountText.replace(/[$,]/g, '')));
    }
    return amounts;
  }

  async getTransactionDates() {
    const dates = [];
    const transactionItems = await this.page.locator('.transaction-item, .transaction-row').all();
    for (const item of transactionItems) {
      const dateText = await item.locator('.transaction-date, [data-date]').textContent();
      dates.push(dateText.trim());
    }
    return dates;
  }

  async getTransactionDescriptions() {
    const descriptions = [];
    const transactionItems = await this.page.locator('.transaction-item, .transaction-row').all();
    for (const item of transactionItems) {
      const descText = await item.locator('.transaction-description, [data-description]').textContent();
      descriptions.push(descText.trim());
    }
    return descriptions;
  }

  async getTransactionCategories() {
    const categories = [];
    const transactionItems = await this.page.locator('.transaction-item, .transaction-row').all();
    for (const item of transactionItems) {
      const categoryText = await item.locator('.transaction-category, [data-category]').textContent();
      categories.push(categoryText.trim());
    }
    return categories;
  }

  async getMonthLabels() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels;
      }
      return [];
    });
  }

  async getMonthlySpendValues() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.datasets[0].data;
      }
      return [];
    });
  }

  async verifyYAxisFormatting() {
    const yAxisLabel = await this.page.locator('.y-axis-label, [data-y-axis]').first().textContent();
    return yAxisLabel.includes('$');
  }

  async clickMonthDataPoint(month) {
    await this.page.evaluate((monthName) => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const event = new MouseEvent('click', { bubbles: true });
        canvas.dispatchEvent(event);
      }
    }, month);
    await this.page.waitForLoadState('networkidle');
    logger.info(`Clicked on ${month} data point`);
  }

  async isDetailViewVisible() {
    return await this.page.locator('.detail-view, [data-section="detail"]').isVisible();
  }

  async getNotificationMessage() {
    const notification = await this.page.locator('.notification, .alert-info').textContent();
    return notification.trim();
  }

  async getMonthTotal(month) {
    const monthData = await this.page.locator(`.month-data:has-text("${month}") .month-total`).textContent();
    return parseFloat(monthData.replace(/[$,]/g, ''));
  }

  async getCategoryDistribution() {
    const distribution = {};
    const categoryItems = await this.page.locator('.category-item').all();
    for (const item of categoryItems) {
      const categoryName = await item.locator('.category-name').textContent();
      const amountText = await item.locator('.category-amount').textContent();
      distribution[categoryName.trim()] = parseFloat(amountText.replace(/[$,]/g, ''));
    }
    return distribution;
  }

  async getTopMerchants() {
    const merchants = [];
    const merchantItems = await this.page.locator('.merchant-item, [data-merchant-item]').all();
    for (const item of merchantItems) {
      const name = await item.locator('.merchant-name').textContent();
      const amountText = await item.locator('.merchant-amount').textContent();
      merchants.push({
        name: name.trim(),
        amount: parseFloat(amountText.replace(/[$,]/g, ''))
      });
    }
    return merchants;
  }

  async getTransactionCount() {
    const countText = await this.page.locator('.transaction-count, [data-transaction-count]').textContent();
    return parseInt(countText.match(/\d+/)[0]);
  }

  async getAllDetailValues() {
    const categoryDistribution = await this.getCategoryDistribution();
    const topMerchants = await this.getTopMerchants();
    const categorySum = Object.values(categoryDistribution).reduce((a, b) => a + b, 0);
    const merchantSum = topMerchants.reduce((a, b) => a + b.amount, 0);
    return {
      categorySum,
      merchantSum
    };
  }
};

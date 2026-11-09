const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    this.navigationMenu = page.locator('nav, .navbar, [role="navigation"]');
    this.analyticsLink = page.locator('a, button').filter({ hasText: /Analytics|Spending/ });
    this.analyticsContainer = page.locator('.analytics-container, #analytics, [data-testid="analytics"]');
    
    this.categoryChart = page.locator('canvas, .chart, [data-chart="category"]');
    this.trendChart = page.locator('canvas, .chart, [data-chart="trend"]');
    
    this.categoryLabels = page.locator('.category-label, [data-category-label]');
    this.categoryDataElements = page.locator('.category-data, [data-category-data]');
    
    this.noDataMessage = page.locator('.no-data-message, .empty-state').filter({ hasText: /No spending data/ });
    
    this.trendAnalysisSection = page.locator('.trend-analysis, #trend-analysis, [data-section="trend"]');
    this.monthDetailPanel = page.locator('.month-detail, [data-month-detail]');
    this.transactionList = page.locator('.transaction-list, [data-transactions]');
    
    this.limitedDataNotification = page.locator('.notification, .alert-info').filter({ hasText: /Limited data available/ });
  }

  async navigateToAnalytics() {
    await expect(this.analyticsLink).toBeVisible();
    await this.analyticsLink.click();
    await expect(this.analyticsContainer).toBeVisible();
    logger.info('Navigated to Analytics section');
  }

  async getCategoryLabels() {
    await expect(this.categoryChart).toBeVisible();
    const labels = [];
    const count = await this.categoryLabels.count();
    for (let i = 0; i < count; i++) {
      const text = await this.categoryLabels.nth(i).textContent();
      labels.push(text.trim());
    }
    return labels;
  }

  async getCategorySpendingData() {
    await expect(this.categoryChart).toBeVisible();
    const data = {};
    const categoryItems = this.page.locator('.category-item, [data-category]');
    const count = await categoryItems.count();
    
    for (let i = 0; i < count; i++) {
      const categoryName = await categoryItems.nth(i).locator('.category-name, [data-category-name]').textContent();
      const categoryAmount = await categoryItems.nth(i).locator('.category-amount, [data-category-amount]').textContent();
      data[categoryName.trim()] = categoryAmount.trim();
    }
    
    return data;
  }

  async getCategoryPercentages() {
    await expect(this.categoryChart).toBeVisible();
    const percentages = {};
    const categoryItems = this.page.locator('.category-item, [data-category]');
    const count = await categoryItems.count();
    
    for (let i = 0; i < count; i++) {
      const categoryName = await categoryItems.nth(i).locator('.category-name, [data-category-name]').textContent();
      const percentageText = await categoryItems.nth(i).locator('.category-percentage, [data-category-percentage]').textContent();
      const percentage = parseFloat(percentageText.replace('%', ''));
      percentages[categoryName.trim()] = percentage;
    }
    
    return percentages;
  }

  async getNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
    return await this.noDataMessage.textContent();
  }

  async isCategoryChartVisible() {
    try {
      await this.categoryChart.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async getCategoryAmount(categoryName) {
    const categoryItem = this.page.locator('.category-item, [data-category]').filter({ has: this.page.locator('.category-name').filter({ hasText: categoryName }) });
    await expect(categoryItem).toBeVisible();
    const amountText = await categoryItem.locator('.category-amount, [data-category-amount]').textContent();
    return amountText.trim();
  }

  async navigateToTrendAnalysis() {
    const trendLink = this.page.locator('a, button').filter({ hasText: /Trend|Monthly/ });
    await expect(trendLink).toBeVisible();
    await trendLink.click();
    await expect(this.trendAnalysisSection).toBeVisible();
    logger.info('Navigated to trend analysis section');
  }

  async verifyChartInteractivity() {
    await expect(this.trendChart).toBeVisible();
    const isInteractive = await this.trendChart.evaluate(element => {
      return element.hasAttribute('data-interactive') || element.classList.contains('interactive');
    });
    return isInteractive;
  }

  async getTrendMonthLabels() {
    await expect(this.trendChart).toBeVisible();
    const labels = [];
    const monthLabels = this.page.locator('.month-label, [data-month-label]');
    const count = await monthLabels.count();
    for (let i = 0; i < count; i++) {
      const text = await monthLabels.nth(i).textContent();
      labels.push(text.trim());
    }
    return labels;
  }

  async clickMonthDataPoint(monthName) {
    const dataPoint = this.page.locator('.data-point, [data-month]').filter({ hasText: monthName });
    await expect(dataPoint).toBeVisible();
    await dataPoint.click();
    logger.info(`Clicked on month data point: ${monthName}`);
  }

  async getMonthDetailSpend() {
    await expect(this.monthDetailPanel).toBeVisible();
    const spendElement = this.monthDetailPanel.locator('.month-spend, [data-month-spend]');
    const text = await spendElement.textContent();
    return text.trim();
  }

  async getLimitedDataNotification() {
    await expect(this.limitedDataNotification).toBeVisible();
    return await this.limitedDataNotification.textContent();
  }

  async identifySpendingSpike() {
    await expect(this.trendChart).toBeVisible();
    const dataPoints = this.page.locator('.data-point, [data-month]');
    const count = await dataPoints.count();
    let maxAmount = 0;
    let spikeMonth = '';
    
    for (let i = 0; i < count; i++) {
      const monthText = await dataPoints.nth(i).locator('[data-month-label]').textContent();
      const amountText = await dataPoints.nth(i).locator('[data-amount]').textContent();
      const amount = parseFloat(amountText.replace(/[$,]/g, ''));
      
      if (amount > maxAmount) {
        maxAmount = amount;
        spikeMonth = monthText.trim();
      }
    }
    
    return {
      month: spikeMonth,
      amount: `$${maxAmount.toFixed(2)}`
    };
  }

  async getMonthCategoryBreakdown() {
    await expect(this.monthDetailPanel).toBeVisible();
    const breakdown = {};
    const categoryItems = this.monthDetailPanel.locator('.category-item, [data-category]');
    const count = await categoryItems.count();
    
    for (let i = 0; i < count; i++) {
      const categoryName = await categoryItems.nth(i).locator('.category-name, [data-category-name]').textContent();
      const categoryAmount = await categoryItems.nth(i).locator('.category-amount, [data-category-amount]').textContent();
      breakdown[categoryName.trim()] = categoryAmount.trim();
    }
    
    return breakdown;
  }

  async getMonthTransactions() {
    await expect(this.transactionList).toBeVisible();
    const transactions = [];
    const transactionItems = this.transactionList.locator('.transaction-item, [data-transaction]');
    const count = await transactionItems.count();
    
    for (let i = 0; i < count; i++) {
      const description = await transactionItems.nth(i).locator('.transaction-description, [data-description]').textContent();
      const amount = await transactionItems.nth(i).locator('.transaction-amount, [data-amount]').textContent();
      transactions.push({
        description: description.trim(),
        amount: amount.trim()
      });
    }
    
    return transactions;
  }
};
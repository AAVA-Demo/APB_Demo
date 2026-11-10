const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsContainer = page.locator('.analytics-container');
    this.categoryChart = page.locator('.category-chart');
    this.emptyStateMessage = page.locator('.empty-state-message');
    this.categoryDetailView = page.locator('.category-detail-view');
    this.loadingIndicator = page.locator('.loading-spinner');
  }

  async navigateToAnalytics() {
    logger.info('Navigating to analytics page');
    await this.page.click('a[href="/analytics"]');
    await this.page.waitForLoadState('networkidle');
    logger.info('Analytics page loaded');
  }

  async waitForAnalyticsLoad() {
    logger.info('Waiting for analytics to load');
    await expect(this.analyticsContainer).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    if (await this.loadingIndicator.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(this.loadingIndicator).toBeHidden({ timeout: 5000 });
    }
    logger.info('Analytics loaded');
  }

  async getAllCategories() {
    const categories = [];
    const categoryElements = await this.page.locator('.category-label').all();
    for (const element of categoryElements) {
      const text = await element.textContent();
      categories.push(text.trim());
    }
    return categories;
  }

  async getCategoryData(categoryName) {
    logger.info(`Getting data for category: ${categoryName}`);
    const categoryElement = this.page.locator(`.category-item:has-text("${categoryName}")`);
    await expect(categoryElement).toBeVisible();
    return {
      amount: await categoryElement.locator('.category-amount').textContent(),
      percentage: await categoryElement.locator('.category-percentage').textContent()
    };
  }

  async clickCategorySegment(categoryName) {
    logger.info(`Clicking category segment: ${categoryName}`);
    await this.page.click(`.category-segment[data-category="${categoryName}"]`);
    await this.page.waitForTimeout(500);
    logger.info('Category segment clicked');
  }

  async getCategoryDetails() {
    await expect(this.categoryDetailView).toBeVisible();
    return {
      transactionCount: await this.categoryDetailView.locator('.transaction-count').textContent(),
      totalAmount: await this.categoryDetailView.locator('.total-amount').textContent(),
      percentage: await this.categoryDetailView.locator('.percentage').textContent()
    };
  }

  async getEmptyStateText() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async isChartVisible() {
    return await this.categoryChart.isVisible({ timeout: 1000 }).catch(() => false);
  }

  async getVisibleCategories() {
    const categories = [];
    const visibleElements = await this.page.locator('.category-item:visible').all();
    for (const element of visibleElements) {
      const text = await element.locator('.category-label').textContent();
      categories.push(text.trim());
    }
    return categories;
  }
};
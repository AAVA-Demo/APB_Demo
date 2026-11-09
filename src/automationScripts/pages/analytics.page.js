const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    // Category chart elements
    this.categoryChart = page.locator('canvas[id*="category"], .category-chart, [data-testid="category-chart"]');
    this.categoryBars = page.locator('.category-bar, [data-testid="category-bar"]');
    this.categoryItem = page.locator('.category-item, [data-testid="category-item"]');
    
    // Trend chart elements
    this.trendChart = page.locator('canvas[id*="trend"], .trend-chart, [data-testid="trend-chart"]');
    this.trendLine = page.locator('.trend-line, [data-testid="trend-line"]');
    this.trendSection = page.locator('.trend-section, [data-testid="trend-section"]');
    
    // Messages
    this.noDataMessage = page.locator('.alert-info:has-text("No spending data"), .message:has-text("No spending data")');
    this.limitedDataMessage = page.locator('.alert-info:has-text("Limited historical data"), .message:has-text("Limited historical data")');
    
    // Error elements
    this.errorMessage = page.locator('.alert-danger, .error-message');
    this.trendErrorMessage = page.locator('.trend-error, [data-testid="trend-error"]');
    this.trendRetryButton = page.locator('[data-testid="trend-retry"], button:has-text("Retry")').first();
    
    // Loading indicators
    this.loadingSpinner = page.locator('.spinner, .loading, [data-testid="loading"]');
  }

  async waitForChartToLoad() {
    await this.page.waitForTimeout(500);
    const spinnerVisible = await this.loadingSpinner.isVisible().catch(() => false);
    if (spinnerVisible) {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    }
    await this.page.waitForSelector('canvas, .error-message', { timeout: 10000 });
  }

  async getAllCategoryBars() {
    return await this.categoryBars.all();
  }

  async getCategoryAmounts() {
    const categories = await this.categoryItem.all();
    const amounts = {};
    for (const category of categories) {
      const text = await category.textContent();
      const nameMatch = text.match(/([A-Za-z &]+)/);
      const amountMatch = text.match(/\$([\d,]+\.\d{2})/);
      if (nameMatch && amountMatch) {
        amounts[nameMatch[1].trim()] = amountMatch[1];
      }
    }
    return amounts;
  }

  async getCategoryPercentages() {
    const categories = await this.categoryItem.all();
    const percentages = {};
    for (const category of categories) {
      const text = await category.textContent();
      const nameMatch = text.match(/([A-Za-z &]+)/);
      const percentMatch = text.match(/([\d.]+)%/);
      if (nameMatch && percentMatch) {
        percentages[nameMatch[1].trim()] = percentMatch[1];
      }
    }
    return percentages;
  }

  async waitForNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible({ timeout: 10000 });
  }

  async getNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
    return await this.noDataMessage.textContent();
  }

  async waitForErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async navigateToTrendSection() {
    const trendSectionVisible = await this.trendSection.isVisible().catch(() => false);
    if (!trendSectionVisible) {
      // Scroll to trend section or click tab if needed
      await this.page.evaluate(() => {
        const section = document.querySelector('.trend-section, [data-testid="trend-section"]');
        if (section) section.scrollIntoView();
      });
    }
    await this.page.waitForTimeout(500);
  }

  async waitForTrendChartToLoad() {
    await this.page.waitForTimeout(500);
    const spinnerVisible = await this.loadingSpinner.isVisible().catch(() => false);
    if (spinnerVisible) {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    }
    await this.page.waitForSelector('canvas[id*="trend"], .trend-chart, .trend-error', { timeout: 10000 });
  }

  async getTrendDataPoints() {
    // Interact with Chart.js to get data points
    const dataPoints = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas[id*="trend"]');
      if (canvas && canvas.chart) {
        return canvas.chart.data.datasets[0].data;
      }
      return [];
    });
    return dataPoints;
  }

  async getTrendMonthLabels() {
    const labels = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas[id*="trend"]');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels;
      }
      return [];
    });
    return labels;
  }

  async getLimitedDataMessage() {
    await expect(this.limitedDataMessage).toBeVisible();
    return await this.limitedDataMessage.textContent();
  }

  async waitForTrendErrorMessage() {
    await expect(this.trendErrorMessage).toBeVisible({ timeout: 10000 });
  }

  async getTrendErrorMessage() {
    await expect(this.trendErrorMessage).toBeVisible();
    return await this.trendErrorMessage.textContent();
  }
};
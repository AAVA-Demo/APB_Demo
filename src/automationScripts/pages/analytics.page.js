const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // View Selection Locators
    this.categoryViewButton = page.locator('[data-testid="view-category-spending"]');
    this.monthlyTrendsViewButton = page.locator('[data-testid="view-monthly-trends"]');
    this.cardWiseViewButton = page.locator('[data-testid="view-card-wise"]');
    
    // Chart Locators
    this.chartContainer = page.locator('[data-testid="analytics-chart"]');
    this.chartCanvas = page.locator('canvas[data-testid="chart-canvas"]');
    this.chartLegend = page.locator('[data-testid="chart-legend"]');
    this.chartDataPoints = page.locator('[data-testid="chart-data-point"]');
    
    // Data Display Locators
    this.categoryLabel = page.locator('[data-testid="category-label"]');
    this.categoryAmount = page.locator('[data-testid="category-amount"]');
    this.monthLabel = page.locator('[data-testid="month-label"]');
    this.monthAmount = page.locator('[data-testid="month-amount"]');
    
    // Missing Data Indicators
    this.missingDataIndicator = page.locator('[data-testid="missing-data-indicator"]');
    this.cardBreakdownSection = page.locator('[data-testid="card-breakdown"]');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await expect(this.chartContainer).toBeVisible();
    logger.info('Navigated to analytics page');
  }

  async selectCategorySpendingView() {
    await this.categoryViewButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Category spending view selected');
  }

  async selectMonthlyTrendsView() {
    await this.monthlyTrendsViewButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Monthly trends view selected');
  }

  async waitForChartToLoad() {
    await expect(this.chartCanvas).toBeVisible({ timeout: 10000 });
    logger.info('Chart loaded');
  }

  async setupMonthlyTrendsData(monthlyData) {
    await this.page.route('**/api/analytics/monthly-trends**', async route => {
      const data = [];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const values = [monthlyData.january, monthlyData.february, monthlyData.march, monthlyData.april, monthlyData.may, monthlyData.june, monthlyData.july, monthlyData.august, monthlyData.september, monthlyData.october, monthlyData.november, monthlyData.december];
      
      for (let i = 0; i < months.length; i++) {
        data.push({ month: months[i], totalSpend: values[i] });
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(data)
      });
    });
    logger.info('Monthly trends test data setup completed');
  }

  async setupMonthlyTrendsDataWithGaps(monthlyData) {
    await this.page.route('**/api/analytics/monthly-trends**', async route => {
      const data = [];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'];
      const values = [monthlyData.january, monthlyData.february, monthlyData.march, monthlyData.april, monthlyData.may, monthlyData.june, monthlyData.july, monthlyData.august, monthlyData.september, monthlyData.october];
      
      for (let i = 0; i < months.length; i++) {
        if (values[i] !== null) {
          data.push({ month: months[i], totalSpend: values[i] });
        }
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(data)
      });
    });
    logger.info('Monthly trends test data with gaps setup completed');
  }

  async setupMultiCardMonthlyData(config) {
    await this.page.route('**/api/analytics/monthly-trends**', async route => {
      const data = [];
      const months = ['January', 'February', 'March', 'April', 'May', 'June'];
      const totalMonthly = config.cardA.monthly + config.cardB.monthly;
      
      for (const month of months) {
        data.push({ month, totalSpend: totalMonthly });
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(data)
      });
    });
    logger.info('Multi-card monthly trends test data setup completed');
  }

  async setupCategorySpendingData(categoryData) {
    await this.page.route('**/api/analytics/category-spending**', async route => {
      const data = [];
      
      for (const [category, amount] of Object.entries(categoryData)) {
        data.push({ category, amount });
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(data)
      });
    });
    logger.info('Category spending test data setup completed');
  }

  async setupCategorySpendingDataWithInvalid(config) {
    await this.page.route('**/api/analytics/category-spending**', async route => {
      const data = [];
      
      for (const [category, amount] of Object.entries(config.validCategories)) {
        data.push({ category, amount });
      }
      
      const miscTotal = config.nullCategory.totalAmount + config.unknownCategory.totalAmount;
      data.push({ category: 'Miscellaneous', amount: miscTotal });
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(data)
      });
    });
    logger.info('Category spending test data with invalid categories setup completed');
  }

  async setupMultiCardCategoryData(config) {
    await this.page.route('**/api/analytics/category-spending**', async route => {
      const data = [];
      const consolidated = {};
      
      for (const [category, amount] of Object.entries(config.cardA)) {
        consolidated[category] = (consolidated[category] || 0) + amount;
      }
      
      for (const [category, amount] of Object.entries(config.cardB)) {
        consolidated[category] = (consolidated[category] || 0) + amount;
      }
      
      for (const [category, amount] of Object.entries(consolidated)) {
        data.push({ category, amount });
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(data)
      });
    });
    logger.info('Multi-card category spending test data setup completed');
  }

  async getMonthlyDataPointCount() {
    return await this.monthLabel.count();
  }

  async getMonthlyTrendsData() {
    const months = await this.monthLabel.allTextContents();
    const amounts = await this.monthAmount.allTextContents();
    
    const data = {};
    for (let i = 0; i < months.length; i++) {
      data[months[i].trim()] = parseFloat(amounts[i].replace(/[^0-9.]/g, ''));
    }
    
    return data;
  }

  async verifyChronologicalOrder() {
    const months = await this.monthLabel.allTextContents();
    const expectedOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    let lastIndex = -1;
    for (const month of months) {
      const currentIndex = expectedOrder.indexOf(month.trim());
      if (currentIndex <= lastIndex) return false;
      lastIndex = currentIndex;
    }
    
    return true;
  }

  async verifyChartDataFormat() {
    const chartExists = await this.chartCanvas.isVisible();
    const legendExists = await this.chartLegend.isVisible();
    return chartExists && legendExists;
  }

  async getMonthSpend(monthName) {
    const monthLocator = this.page.locator(`[data-testid="month-label"][data-month="${monthName}"]`);
    const amountLocator = monthLocator.locator('..').locator('[data-testid="month-amount"]');
    const amountText = await amountLocator.textContent();
    return parseFloat(amountText.replace(/[^0-9.]/g, ''));
  }

  async monthExists(monthName) {
    const monthLocator = this.page.locator(`[data-testid="month-label"][data-month="${monthName}"]`);
    return await monthLocator.isVisible();
  }

  async verifyMissingDataIndication() {
    return await this.missingDataIndicator.isVisible();
  }

  async hasCardWiseBreakdown() {
    return await this.cardBreakdownSection.isVisible();
  }

  async getCategoryCount() {
    return await this.categoryLabel.count();
  }

  async getCategorySpendingData() {
    const categories = await this.categoryLabel.allTextContents();
    const amounts = await this.categoryAmount.allTextContents();
    
    const data = {};
    for (let i = 0; i < categories.length; i++) {
      data[categories[i].trim()] = parseFloat(amounts[i].replace(/[^0-9.]/g, ''));
    }
    
    return data;
  }

  async getCategorySpend(categoryName) {
    const categoryLocator = this.page.locator(`[data-testid="category-label"][data-category="${categoryName}"]`);
    const amountLocator = categoryLocator.locator('..').locator('[data-testid="category-amount"]');
    const amountText = await amountLocator.textContent();
    return parseFloat(amountText.replace(/[^0-9.]/g, ''));
  }

  async getTotalCategorySpend() {
    const amounts = await this.categoryAmount.allTextContents();
    let total = 0;
    for (const amountStr of amounts) {
      total += parseFloat(amountStr.replace(/[^0-9.]/g, ''));
    }
    return total;
  }
};

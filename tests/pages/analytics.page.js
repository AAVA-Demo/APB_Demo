const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.analyticsLink = page.locator('a[href*="analytics"]');
    this.categoryWiseViewButton = page.locator('button[data-view="category-wise"]');
    this.monthlyTrendViewButton = page.locator('button[data-view="monthly-trend"]');
    this.categoryList = page.locator('.category-item');
    this.categoryName = page.locator('.category-name');
    this.categoryAmount = page.locator('.category-amount');
    this.categoryPercentage = page.locator('.category-percentage');
    this.totalSpendDisplay = page.locator('[data-testid="total-spend"]');
    this.errorMessage = page.locator('.error-message, .alert-danger');
    this.chartContainer = page.locator('.chart-container');
    this.trendLine = page.locator('svg path.trend-line, canvas');
    this.monthDataPoint = page.locator('.month-data-point');
    this.dateRangeStartInput = page.locator('input[name="start-date"]');
    this.dateRangeEndInput = page.locator('input[name="end-date"]');
    this.applyDateRangeButton = page.locator('button[data-action="apply-date-range"]');
    this.navigationMenu = page.locator('nav.navbar');
    this.chartYAxis = page.locator('.chart-y-axis');
  }

  async navigate() {
    logger.info('Navigating to application');
    await this.page.goto('https://creditcard-dashboard.example.com');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAnalytics() {
    logger.info('Navigating to analytics section');
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.chartContainer).toBeVisible();
  }

  async selectCategoryWiseView() {
    logger.info('Selecting category-wise view');
    await this.categoryWiseViewButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectMonthlyTrendView() {
    logger.info('Selecting monthly trend view');
    await this.monthlyTrendViewButton.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.chartContainer).toBeVisible();
  }

  async getAllDisplayedCategories() {
    await expect(this.categoryList.first()).toBeVisible();
    const categories = await this.categoryName.allTextContents();
    return categories.map(cat => cat.trim());
  }

  async getCategoryAmounts() {
    const categories = await this.getAllDisplayedCategories();
    const amounts = {};
    
    for (const category of categories) {
      const amountLocator = this.page.locator(`.category-item:has-text("${category}") .category-amount`);
      const amount = await amountLocator.textContent();
      amounts[category] = amount.trim();
    }
    
    return amounts;
  }

  async getCategoryPercentages() {
    const categories = await this.getAllDisplayedCategories();
    const percentages = {};
    
    for (const category of categories) {
      const percentageLocator = this.page.locator(`.category-item:has-text("${category}") .category-percentage`);
      const percentage = await percentageLocator.textContent();
      percentages[category] = percentage.replace('%', '').trim();
    }
    
    return percentages;
  }

  async getCategoryAmount(categoryName) {
    const amountLocator = this.page.locator(`.category-item:has-text("${categoryName}") .category-amount`);
    await expect(amountLocator).toBeVisible();
    return (await amountLocator.textContent()).trim();
  }

  async getTotalSpend() {
    await expect(this.totalSpendDisplay).toBeVisible();
    return (await this.totalSpendDisplay.textContent()).trim();
  }

  async hasDisplayErrors() {
    const nullElements = await this.page.locator('text=/null|undefined|NaN/i').count();
    const brokenCharts = await this.page.locator('.chart-error, .broken-chart').count();
    return nullElements > 0 || brokenCharts > 0;
  }

  async getVisibleCategories() {
    const visibleCategories = [];
    const categories = await this.getAllDisplayedCategories();
    
    for (const category of categories) {
      const categoryLocator = this.page.locator(`.category-item:has-text("${category}")`);
      if (await categoryLocator.isVisible()) {
        const amount = await this.getCategoryAmount(category);
        if (!amount.includes('$0.00') || await categoryLocator.isVisible()) {
          visibleCategories.push(category);
        }
      }
    }
    
    return visibleCategories;
  }

  async selectDateRange(startDate, endDate) {
    logger.info(`Selecting date range: ${startDate} to ${endDate}`);
    await this.dateRangeStartInput.fill(startDate);
    await this.dateRangeEndInput.fill(endDate);
    await this.applyDateRangeButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlyDataPointCount() {
    await expect(this.monthDataPoint.first()).toBeVisible();
    return await this.monthDataPoint.count();
  }

  async getMonthlyTotals() {
    const totals = {};
    const dataPoints = await this.monthDataPoint.all();
    
    for (const point of dataPoints) {
      const month = await point.getAttribute('data-month');
      const amount = await point.getAttribute('data-amount');
      totals[month] = amount;
    }
    
    return totals;
  }

  async isTrendLineVisible() {
    return await this.trendLine.isVisible();
  }

  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return (await this.errorMessage.textContent()).trim();
  }

  async isAnalyticsPageFunctional() {
    const hasChart = await this.chartContainer.isVisible();
    const hasNav = await this.navigationMenu.isVisible();
    return hasChart && hasNav;
  }

  async hasWorkingNavigation() {
    return await this.navigationMenu.isEnabled();
  }

  async hasBrokenUIElements() {
    const brokenElements = await this.page.locator('.error, .broken, [style*="display: none"]').count();
    const undefinedTexts = await this.page.locator('text=/undefined|null/i').count();
    return brokenElements > 0 || undefinedTexts > 0;
  }

  async getMonthAmount(month) {
    const monthLocator = this.page.locator(`[data-month="${month}"]`);
    if (await monthLocator.isVisible()) {
      const amount = await monthLocator.getAttribute('data-amount');
      return amount || '$0.00';
    }
    return '$0.00';
  }

  async getNonZeroMonths() {
    const nonZeroMonths = [];
    const dataPoints = await this.monthDataPoint.all();
    
    for (const point of dataPoints) {
      const month = await point.getAttribute('data-month');
      const amount = await point.getAttribute('data-amount');
      if (amount && amount !== '$0.00' && parseFloat(amount.replace(/[$,]/g, '')) > 0) {
        nonZeroMonths.push(month);
      }
    }
    
    return nonZeroMonths;
  }

  async isChartScaleProper() {
    const yAxisVisible = await this.chartYAxis.isVisible();
    const chartNotDistorted = await this.chartContainer.evaluate(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    return yAxisVisible && chartNotDistorted;
  }

  async isTrendLineConnectingAllPoints() {
    const trendLineExists = await this.trendLine.isVisible();
    if (!trendLineExists) return false;
    
    const pathData = await this.trendLine.evaluate(el => {
      if (el.tagName.toLowerCase() === 'path') {
        return el.getAttribute('d');
      }
      return 'canvas';
    });
    
    return pathData !== null && pathData !== '';
  }
};
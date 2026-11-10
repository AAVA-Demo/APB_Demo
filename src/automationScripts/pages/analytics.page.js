const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');
const config = require('../../data/config.json');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.logoutButton = page.locator('a:has-text("Logout")');
    
    this.analyticsNavLink = page.locator('a[href="/analytics"]');
    this.monthlyTrendsTab = page.locator('[data-testid="tab-monthly-trends"]');
    this.categoryWiseTab = page.locator('[data-testid="tab-category-wise"]');
    this.cardWiseTab = page.locator('[data-testid="tab-card-wise"]');
    
    this.monthlyTrendsChart = page.locator('[data-testid="monthly-trends-chart"]');
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.cardWiseChart = page.locator('[data-testid="card-wise-chart"]');
    
    this.startDateInput = page.locator('[data-testid="filter-start-date"]');
    this.endDateInput = page.locator('[data-testid="filter-end-date"]');
    this.applyFilterButton = page.locator('[data-testid="apply-filter-button"]');
    this.clearFilterButton = page.locator('[data-testid="clear-filter-button"]');
    
    this.chartTooltip = page.locator('[data-testid="chart-tooltip"]');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    this.noSpendingDataMessage = page.locator('[data-testid="no-spending-data-message"]');
    this.validationErrorMessage = page.locator('[data-testid="validation-error-message"]');
    this.warningMessage = page.locator('[data-testid="warning-message"]');
    
    this.analyticsLoader = page.locator('[data-testid="analytics-loader"]');
  }

  async navigate() {
    logger.info('Navigating to application');
    await this.page.goto(config.baseUrl);
  }

  async login(username, password) {
    logger.info(`Logging in as user: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL('**/dashboard');
    logger.info('Login successful');
  }

  async logout() {
    logger.info('Logging out user');
    await this.logoutButton.click();
    await this.page.waitForURL('**/login');
  }

  async navigateToAnalytics() {
    logger.info('Navigating to analytics page');
    await this.analyticsNavLink.click();
    await this.page.waitForURL('**/analytics');
    await this.waitForAnalyticsLoad();
  }

  async waitForAnalyticsLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.analyticsLoader).toBeHidden({ timeout: 5000 }).catch(() => {});
    logger.info('Analytics page loaded successfully');
  }

  async selectMonthlyTrendsTab() {
    logger.info('Selecting Monthly Trends tab');
    await this.monthlyTrendsTab.click();
    await expect(this.monthlyTrendsChart).toBeVisible({ timeout: 3000 }).catch(() => {});
  }

  async selectCategoryWiseTab() {
    logger.info('Selecting Category-wise tab');
    await this.categoryWiseTab.click();
    await expect(this.categoryChart).toBeVisible({ timeout: 3000 }).catch(() => {});
  }

  async selectCardWiseTab() {
    logger.info('Selecting Card-wise tab');
    await this.cardWiseTab.click();
    await expect(this.cardWiseChart).toBeVisible({ timeout: 3000 }).catch(() => {});
  }

  async getMonthlyTrendsData() {
    await expect(this.monthlyTrendsChart).toBeVisible();
    const dataPoints = await this.page.locator('[data-testid="chart-data-point"]').all();
    const data = [];
    for (const point of dataPoints) {
      const month = await point.getAttribute('data-month');
      const amount = await point.getAttribute('data-amount');
      data.push({ month, amount: parseFloat(amount) });
    }
    return data;
  }

  async getCategorySpendingData() {
    await expect(this.categoryChart).toBeVisible();
    const slices = await this.page.locator('[data-testid="chart-slice"]').all();
    const categories = [];
    for (const slice of slices) {
      const name = await slice.getAttribute('data-category');
      const amount = await slice.getAttribute('data-amount');
      const percentage = await slice.getAttribute('data-percentage');
      categories.push({ name, amount: parseFloat(amount), percentage: parseFloat(percentage) });
    }
    return categories;
  }

  async applyDateRangeFilter(startDate, endDate) {
    logger.info(`Applying date range filter: ${startDate} to ${endDate}`);
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
    await this.applyFilterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async enterDateRange(startDate, endDate) {
    logger.info(`Entering date range: ${startDate} to ${endDate}`);
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
  }

  async clickApplyFilter() {
    logger.info('Clicking Apply Filter button');
    await this.applyFilterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async hoverOverDataPoint(index) {
    logger.info(`Hovering over data point at index ${index}`);
    const dataPoint = this.page.locator('[data-testid="chart-data-point"]').nth(index);
    await dataPoint.hover();
    await this.page.waitForTimeout(500);
  }

  async hoverOverCategorySlice(categoryName) {
    logger.info(`Hovering over category slice: ${categoryName}`);
    const slice = this.page.locator(`[data-testid="chart-slice"][data-category="${categoryName}"]`);
    await slice.hover();
    await this.page.waitForTimeout(500);
  }

  async getTooltipText() {
    await expect(this.chartTooltip).toBeVisible();
    return await this.chartTooltip.textContent();
  }

  async getInsufficientDataMessageText() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async getNoSpendingDataMessageText() {
    await expect(this.noSpendingDataMessage).toBeVisible();
    return await this.noSpendingDataMessage.textContent();
  }

  async getValidationErrorText() {
    await expect(this.validationErrorMessage).toBeVisible();
    return await this.validationErrorMessage.textContent();
  }

  async getWarningMessageText() {
    await expect(this.warningMessage).toBeVisible();
    return await this.warningMessage.textContent();
  }

  async simulateCategorizationFailure() {
    logger.info('Simulating transaction categorization failure');
    await this.page.route('**/api/analytics/process', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          categorySpending: [
            { category: 'Shopping', amount: 8500, percentage: 18.6 },
            { category: 'Miscellaneous', amount: 12000, percentage: 26.3, uncategorized: true }
          ],
          warning: 'Some transactions could not be categorized'
        })
      });
    });
  }
};

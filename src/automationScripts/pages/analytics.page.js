const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.analyticsLink = page.locator('a[href="#!/analytics"]');
    this.categoryBreakdownSection = page.locator('h3:has-text("Category-Wise Spending"), category-spend-chart');
    this.categoryFilterCheckboxes = page.locator('category-filter input[type="checkbox"]');
    this.startDateInput = page.locator('input[type="date"][ng-model*="startDate"]');
    this.endDateInput = page.locator('input[type="date"][ng-model*="endDate"]');
    this.applyFiltersButton = page.locator('button:has-text("Apply Filters")');
    this.trendChart = page.locator('canvas#spendTrendLineCanvas, spend-trend-line');
    this.noDataMessage = page.locator('.alert-info:has-text("No spending data available")');
    this.insufficientDataMessage = page.locator('text=Insufficient historical data, text=meaningful trend analysis');
    this.validationError = page.locator('.alert-danger, text=Invalid date range');
  }

  async navigate() {
    await this.page.goto('https://creditcard-dashboard.example.com');
    await expect(this.page).toHaveURL(/creditcard-dashboard/);
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAnalytics() {
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getAllCategories() {
    await expect(this.categoryBreakdownSection).toBeVisible();
    const categories = [];
    const categoryNames = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of categoryNames) {
      const isVisible = await this.page.locator(`text=${category}`).isVisible().catch(() => false);
      if (isVisible) {
        categories.push(category);
      }
    }
    return categories;
  }

  async getCategoryBreakdownData() {
    await expect(this.categoryBreakdownSection).toBeVisible();
    await this.page.waitForTimeout(1000);
    const chartData = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas#categorySpendCanvas');
      if (canvas && canvas.chart) {
        const chart = canvas.chart;
        return chart.data.labels.map((label, index) => ({
          category: label,
          amount: chart.data.datasets[0].data[index],
          percentage: (chart.data.datasets[0].data[index] / chart.data.datasets[0].data.reduce((a, b) => a + b, 0)) * 100
        }));
      }
      const categoryNames = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      return categoryNames.map(category => ({
        category: category,
        amount: 0,
        percentage: 0
      }));
    });
    return chartData;
  }

  async getNoDataMessageText() {
    await expect(this.noDataMessage).toBeVisible();
    return await this.noDataMessage.textContent();
  }

  async selectCategory(categoryName) {
    const checkbox = this.page.locator(`category-filter label:has-text("${categoryName}") input[type="checkbox"]`);
    await expect(checkbox).toBeVisible();
    const isChecked = await checkbox.isChecked();
    if (!isChecked) {
      await checkbox.check();
    }
  }

  async setDateRange(startDate, endDate) {
    await expect(this.startDateInput).toBeVisible();
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
  }

  async setDateRangeToLast12Months() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    await this.setDateRange(
      startDate.toISOString().substring(0, 10),
      endDate.toISOString().substring(0, 10)
    );
  }

  async clickApplyFilters() {
    await expect(this.applyFiltersButton).toBeVisible();
    await this.applyFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTrendChartToRender() {
    await expect(this.trendChart.or(this.insufficientDataMessage).or(this.validationError)).toBeVisible({ timeout: 5000 });
    await this.page.waitForTimeout(500);
  }

  async getTrendChartData() {
    await expect(this.trendChart).toBeVisible();
    await this.page.waitForTimeout(1000);
    const chartData = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas#spendTrendLineCanvas');
      if (canvas && canvas.chart) {
        const chart = canvas.chart;
        return chart.data.labels.map((label, index) => ({
          period: label,
          totalSpend: chart.data.datasets[0].data[index]
        }));
      }
      return [];
    });
    return chartData;
  }

  async isChartInteractive() {
    await expect(this.trendChart).toBeVisible();
    const boundingBox = await this.trendChart.boundingBox();
    if (!boundingBox) return false;
    await this.page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
    await this.page.waitForTimeout(500);
    const tooltipVisible = await this.page.locator('.chartjs-tooltip, [role="tooltip"]').isVisible().catch(() => false);
    return tooltipVisible;
  }

  async getInsufficientDataMessageText() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async getValidationErrorText() {
    await expect(this.validationError).toBeVisible();
    return await this.validationError.textContent();
  }
};
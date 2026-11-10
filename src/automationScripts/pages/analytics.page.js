const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Analytics Container Locators
    this.analyticsContainer = page.locator('.analytics-container');
    this.categoryPanel = page.locator('.panel:has-text("Category-wise Spending")');
    this.trendsPanel = page.locator('.panel:has-text("Monthly Spend Trends")');
    this.spinner = page.locator('.spinner');
    this.errorAlert = page.locator('.alert.alert-danger');
    
    // Chart Locators
    this.pieChart = page.locator('canvas').first();
    this.lineChart = page.locator('canvas').nth(1);
    this.chartEmptyMessage = page.locator('text=/No data to display/i');
    
    // Category Locators
    this.categoryItems = page.locator('[data-testid="category-item"]');
    this.categoryLabels = page.locator('[data-testid="category-label"]');
    this.categorySpends = page.locator('[data-testid="category-spend"]');
    this.categoryPercentages = page.locator('[data-testid="category-percentage"]');
    
    // Monthly Trends Locators
    this.monthLabels = page.locator('[data-testid="month-label"]');
    this.monthSpends = page.locator('[data-testid="month-spend"]');
    this.categoryBreakdownPanel = page.locator('.panel.panel-info');
    this.categoryBreakdownTable = page.locator('.panel.panel-info table');
    this.clearFilterButton = page.locator('button:has-text("Clear Filter")');
  }

  async navigate() {
    await this.page.goto('/#/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForAnalyticsLoad() {
    await this.page.waitForSelector('.analytics-container', { state: 'visible' });
    await this.spinner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  async getAllCategories() {
    // Extract categories from pie chart or category list
    const categories = [];
    const categoryElements = await this.page.locator('.panel-body').first().locator('text=/Food & Dining|Fuel|Shopping|Travel|Entertainment|Utilities|Healthcare|Education|Miscellaneous/').all();
    
    for (const element of categoryElements) {
      const text = await element.textContent();
      categories.push(text.trim());
    }
    
    return [...new Set(categories)];
  }

  async getCategorySpend(category) {
    // This would interact with the actual chart or data display
    // For now, we'll look for text patterns
    const spendElement = await this.page.locator(`text=/${category}/`).locator('xpath=following-sibling::*[contains(text(), "$")]').first();
    try {
      return await spendElement.textContent({ timeout: 2000 });
    } catch {
      return '$0.00';
    }
  }

  async getAllCategoryPercentages() {
    // Extract percentages from the visualization
    const percentages = [];
    const percentageElements = await this.page.locator('text=/%/').all();
    
    for (const element of percentageElements) {
      const text = await element.textContent();
      const match = text.match(/([0-9.]+)%/);
      if (match) {
        percentages.push(parseFloat(match[1]));
      }
    }
    
    return percentages;
  }

  async hasSpendingData() {
    try {
      const noDataVisible = await this.chartEmptyMessage.isVisible({ timeout: 2000 });
      return !noDataVisible;
    } catch {
      return true;
    }
  }

  async getNoDataMessage() {
    try {
      return await this.page.locator('text=/No spending data available/i').textContent({ timeout: 2000 });
    } catch {
      return null;
    }
  }

  async getChartEmptyMessage() {
    try {
      return await this.chartEmptyMessage.textContent({ timeout: 2000 });
    } catch {
      return null;
    }
  }

  async getMonthlyTrendMonths() {
    // Extract month labels from the line chart
    const months = [];
    const monthElements = await this.page.locator('text=/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/').all();
    
    for (const element of monthElements) {
      const text = await element.textContent();
      months.push(text.trim());
    }
    
    return [...new Set(months)];
  }

  async getMonthlySpend(month) {
    // Get spend value for specific month
    const spendElement = await this.page.locator(`text=/${month}/`).locator('xpath=following-sibling::*[contains(text(), "$")]').first();
    try {
      return await spendElement.textContent({ timeout: 2000 });
    } catch {
      return '$0.00';
    }
  }

  async clickMonthDataPoint(month) {
    // Click on chart data point - this would interact with Chart.js
    // For now, simulate by clicking on month label or related element
    await this.page.locator(`text=${month}`).first().click();
    await this.page.waitForTimeout(500);
  }

  async getCategoryBreakdownForMonth() {
    try {
      await expect(this.categoryBreakdownPanel).toBeVisible({ timeout: 3000 });
      return await this.categoryBreakdownTable.isVisible();
    } catch {
      return false;
    }
  }

  async waitForCategoryBreakdown() {
    await this.categoryBreakdownPanel.waitFor({ state: 'visible', timeout: 5000 });
  }

  async getAllPossibleMonths() {
    // Return all 12 months for comparison
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

  async clearCategoryFilter() {
    if (await this.clearFilterButton.isVisible()) {
      await this.clearFilterButton.click();
      await this.page.waitForTimeout(500);
    }
  }
};

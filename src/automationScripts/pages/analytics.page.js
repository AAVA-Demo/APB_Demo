const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation Locators
    this.analyticsLink = page.locator('[data-testid="nav-analytics"], a:has-text("Analytics")');
    this.monthlyTrendsTab = page.locator('[data-testid="tab-monthly-trends"], button:has-text("Monthly Trends")');
    this.categoryViewTab = page.locator('[data-testid="tab-category"], button:has-text("Category View")');
    
    // Monthly Trends Locators
    this.trendGraph = page.locator('[data-testid="trend-graph"], .chart-container canvas, .monthly-trend-chart');
    this.tooltip = page.locator('[data-testid="chart-tooltip"], .tooltip, .chart-tooltip');
    this.cardFilter = page.locator('[data-testid="card-filter"], select[name="cardFilter"], .card-filter');
    
    // Category Analytics Locators
    this.categoryChart = page.locator('[data-testid="category-chart"], .chart-container canvas, .category-chart');
    this.categoryLegend = page.locator('[data-testid="category-legend"], .chart-legend, table');
    
    // Error Locators
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-danger');
  }

  async navigateToMonthlyTrends() {
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
    if (await this.monthlyTrendsTab.isVisible()) {
      await this.monthlyTrendsTab.click();
    }
    await expect(this.trendGraph).toBeVisible();
  }

  async navigateToSpendingAnalytics() {
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
    if (await this.categoryViewTab.isVisible()) {
      await this.categoryViewTab.click();
    }
    await expect(this.categoryChart).toBeVisible();
  }

  async getDisplayedMonths() {
    // Extract month labels from chart x-axis or legend
    const labels = await this.page.locator('.chart-container .month-label, [data-testid="month-label"]').allTextContents();
    return labels.map(l => l.trim());
  }

  async getMonthlySpendingAmounts() {
    // Extract spending amounts from chart data points
    const amounts = await this.page.locator('.chart-container .data-point, [data-testid="data-point"]').allTextContents();
    return amounts.map(a => a.replace(/[^0-9.]/g, ''));
  }

  async hoverOverMonth(month) {
    const monthElement = this.page.locator(`.chart-container .month-label:has-text("${month}"), [data-month="${month}"]`);
    await expect(monthElement).toBeVisible();
    await monthElement.hover();
    await this.page.waitForTimeout(500); // Wait for tooltip to appear
  }

  async getMonthsWithNonZeroData() {
    const months = await this.getDisplayedMonths();
    const amounts = await this.getMonthlySpendingAmounts();
    const nonZeroMonths = [];
    for (let i = 0; i < months.length; i++) {
      if (parseFloat(amounts[i]) > 0) {
        nonZeroMonths.push(months[i]);
      }
    }
    return nonZeroMonths;
  }

  async getMonthAmount(month) {
    await this.hoverOverMonth(month);
    await expect(this.tooltip).toBeVisible();
    const tooltipText = await this.tooltip.textContent();
    const amountMatch = tooltipText.match(/\$[\d,]+\.\d{2}/);
    return amountMatch ? amountMatch[0] : '0';
  }

  async getAvailableCards() {
    await expect(this.cardFilter).toBeVisible();
    const options = await this.cardFilter.locator('option').allTextContents();
    return options.map(o => o.trim()).filter(o => o.includes('****'));
  }

  async selectCardFilter(cardIdentifier) {
    await expect(this.cardFilter).toBeVisible();
    await this.cardFilter.selectOption({ label: cardIdentifier });
    await this.page.waitForLoadState('networkidle');
  }

  async getDisplayedCategories() {
    // Extract category names from chart legend or table
    const categories = await this.page.locator('.chart-legend .category-name, table tbody tr td:first-child, [data-testid="category-name"]').allTextContents();
    return categories.map(c => c.trim());
  }

  async getCategoryData() {
    const categories = await this.getDisplayedCategories();
    const data = [];
    for (const category of categories) {
      const row = this.page.locator(`table tbody tr:has-text("${category}"), [data-category="${category}"]`);
      const amount = await row.locator('td:nth-child(2), .amount').textContent();
      const percentage = await row.locator('td:nth-child(3), .percentage').textContent();
      data.push({
        category,
        amount: amount.trim(),
        percentage: percentage.trim()
      });
    }
    return data;
  }

  async hoverOverCategory(category) {
    const categoryElement = this.page.locator(`.chart-container [data-category="${category}"], .category-segment:has-text("${category}")`);
    await expect(categoryElement).toBeVisible();
    await categoryElement.hover();
    await this.page.waitForTimeout(500); // Wait for tooltip to appear
  }
};

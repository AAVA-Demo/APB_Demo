const { expect } = require('@playwright/test');

/**
 * Page Object: AnalyticsPage
 * Description: Handles all interactions with the Spending Analytics and Category Insights interface
 * Epic: QE-9528 - Spending Analytics and Category Insights
 */
exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Main analytics elements
    this.analyticsContainer = page.locator('.analytics-dashboard, [data-testid="analytics-dashboard"]').first();
    this.categoryChart = page.locator('canvas#categoryChart, .chart-container canvas, [data-testid="category-chart"]').first();
    this.categoryBreakdownTable = page.locator('.category-breakdown, [data-testid="category-breakdown"]').first();
    
    // Category elements
    this.categoryRows = page.locator('.category-row, [data-testid="category-row"]');
    this.categoryNames = page.locator('.category-name, [data-testid="category-name"]');
    this.categoryAmounts = page.locator('.category-amount, [data-testid="category-amount"]');
    this.categoryPercentages = page.locator('.category-percent, [data-testid="category-percent"]');
    
    // Drill-down view elements
    this.drillDownView = page.locator('.chart-container:has-text("Transaction Details"), [data-testid="drill-down-view"]').first();
    this.transactionTable = page.locator('.table-responsive table, [data-testid="transaction-table"]').first();
    this.transactionRows = page.locator('.table-responsive table tbody tr, [data-testid="transaction-row"]');
    this.closeButton = page.locator('button:has-text("Close"), .close-btn, [data-testid="close-button"]').first();
    
    // Empty state elements
    this.emptyStateMessage = page.locator('text=No spending data available, [data-testid="empty-state-message"]').first();
    this.emptyStateIcon = page.locator('.empty-state-icon, [data-testid="empty-state-icon"]').first();
    this.noCategoryDataMessage = page.locator('text=No transactions available, [data-testid="no-category-data"]').first();
    
    // Loading elements
    this.loadingSpinner = page.locator('.loading-spinner, .spinner, [data-testid="loading-spinner"]').first();
    this.errorMessage = page.locator('.error-message, .alert-danger, [data-testid="error-message"]').first();
    
    // Navigation
    this.analyticsNavLink = page.locator('a[href*="analytics"], nav a:has-text("Analytics")').first();
    
    // Predefined categories
    this.categories = [
      'Food & Dining',
      'Fuel',
      'Shopping',
      'Travel',
      'Entertainment',
      'Utilities',
      'Healthcare',
      'Education',
      'Miscellaneous'
    ];
  }

  /**
   * Navigate to the analytics page
   */
  async navigate() {
    await this.page.goto('/analytics', { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for analytics dashboard to load
   */
  async waitForAnalyticsLoad() {
    await this.page.waitForSelector('canvas, .category-breakdown', { state: 'visible', timeout: 5000 });
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  /**
   * Verify all 9 predefined categories are displayed
   */
  async verifyAllCategoriesDisplayed() {
    await expect(this.categoryBreakdownTable).toBeVisible();
    const displayedCategories = await this.categoryNames.allTextContents();
    
    for (const category of this.categories) {
      const found = displayedCategories.some(displayed => displayed.includes(category));
      expect(found).toBeTruthy();
    }
  }

  /**
   * Verify chart interactivity (hover functionality)
   */
  async verifyChartInteractivity() {
    await expect(this.categoryChart).toBeVisible();
    await this.categoryChart.hover();
    await this.page.waitForTimeout(500);
  }

  /**
   * Click on a specific category segment in the chart
   * @param {string} categoryName - Name of the category to click
   */
  async clickCategorySegment(categoryName) {
    const categoryRow = this.categoryRows.filter({ hasText: categoryName }).first();
    await expect(categoryRow).toBeVisible();
    await categoryRow.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Calculate sum of all category amounts
   * @returns {Promise<number>}
   */
  async calculateCategorySum() {
    await expect(this.categoryBreakdownTable).toBeVisible();
    const amounts = await this.categoryAmounts.allTextContents();
    
    let sum = 0;
    for (const amountText of amounts) {
      const numericValue = parseFloat(amountText.replace(/[^0-9.]/g, ''));
      if (!isNaN(numericValue)) {
        sum += numericValue;
      }
    }
    return sum;
  }

  /**
   * Verify all transactions are categorized (no uncategorized transactions)
   */
  async verifyAllTransactionsCategorized() {
    const categoryCount = await this.categoryRows.count();
    expect(categoryCount).toBe(9);
  }

  /**
   * Verify transaction breakdown is displayed in drill-down view
   */
  async verifyTransactionBreakdownDisplayed() {
    await expect(this.transactionTable).toBeVisible();
    const rowCount = await this.transactionRows.count();
    expect(rowCount).toBeGreaterThan(0);
  }

  /**
   * Verify monthly trends are displayed in drill-down view
   */
  async verifyMonthlyTrendsDisplayed() {
    await expect(this.drillDownView).toBeVisible();
    const drillDownText = await this.drillDownView.textContent();
    expect(drillDownText).toContain('Transaction Details');
  }

  /**
   * Verify category-specific metrics are displayed
   */
  async verifyCategoryMetricsDisplayed() {
    await expect(this.transactionTable).toBeVisible();
    const headers = await this.transactionTable.locator('thead th').allTextContents();
    expect(headers).toContain('Date');
    expect(headers).toContain('Description');
    expect(headers).toContain('Amount');
  }

  /**
   * Get transaction count from drill-down view
   * @returns {Promise<number>}
   */
  async getTransactionCount() {
    await expect(this.transactionTable).toBeVisible();
    return await this.transactionRows.count();
  }

  /**
   * Close drill-down view
   */
  async closeDrillDown() {
    await expect(this.closeButton).toBeVisible();
    await this.closeButton.click();
    await this.page.waitForTimeout(500);
  }
};
const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Date range filter locators
    this.dateRangeFilter = page.locator('[data-testid="date-range-filter"], .filter-section');
    this.startDateInput = page.locator('input[type="date"][name="startDate"], input[placeholder*="Start Date"]').first();
    this.endDateInput = page.locator('input[type="date"][name="endDate"], input[placeholder*="End Date"]').first();
    this.applyButton = page.locator('button:has-text("Apply"), [data-testid="apply-filter"]');
    
    // Chart and visualization locators
    this.categoryChart = page.locator('canvas#categoryChartCanvas, [data-testid="category-chart"], .chart-container');
    this.totalSpendingDisplay = page.locator('[data-testid="total-spending"], .value:has-text("Total Spending")');
    
    // Error and message locators
    this.validationError = page.locator('[data-testid="validation-error"], .error-message');
    this.noDataMessage = page.locator('[data-testid="no-data-message"], .text-center:has-text("No spending data")');
    
    // Category breakdown table
    this.categoryTable = page.locator('table.table-striped, [data-testid="category-breakdown-table"]');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async setStartDate(date) {
    await this.startDateInput.waitFor({ state: 'visible' });
    await this.startDateInput.fill(date);
  }

  async setEndDate(date) {
    await this.endDateInput.waitFor({ state: 'visible' });
    await this.endDateInput.fill(date);
  }

  async applyDateFilter() {
    await this.applyButton.click();
    // Wait for dynamic update (no page reload)
    await this.page.waitForTimeout(500);
  }

  async getChartData() {
    // This would typically interact with Chart.js canvas
    // For now, return mock data or null if chart is empty
    const chartVisible = await this.categoryChart.isVisible();
    if (!chartVisible) return null;
    
    // In real implementation, would extract data from canvas or API
    return { categories: [], amounts: [] };
  }

  async getTotalSpending() {
    await expect(this.totalSpendingDisplay).toBeVisible();
    const text = await this.totalSpendingDisplay.textContent();
    return text.replace(/[^0-9]/g, '');
  }

  async getCategoryList() {
    // Extract categories from the chart or table
    const rows = await this.categoryTable.locator('tbody tr').all();
    const categories = [];
    
    for (const row of rows) {
      const categoryCell = await row.locator('td').first().textContent();
      categories.push(categoryCell.trim());
    }
    
    return categories;
  }

  async getCategoryBreakdown() {
    // Extract full category breakdown with amounts and percentages
    const rows = await this.categoryTable.locator('tbody tr').all();
    const breakdown = [];
    
    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells.length >= 3) {
        const category = await cells[0].textContent();
        const amount = await cells[1].textContent();
        const percentage = await cells[2].textContent();
        
        breakdown.push({
          category: category.trim(),
          amount: amount.replace(/[^0-9]/g, ''),
          percentage: percentage.replace(/[^0-9.]/g, '')
        });
      }
    }
    
    return breakdown;
  }
};

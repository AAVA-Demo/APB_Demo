const { expect } = require('@playwright/test');

exports.CardDetailPage = class CardDetailPage {
  constructor(page) {
    this.page = page;
    
    // Card detail locators
    this.cardInfoSection = page.locator('.card-tile, [data-testid="card-info"]');
    this.monthlySpendDisplay = page.locator('strong:has-text("Monthly Spend") + text(), [data-testid="monthly-spend"]');
    
    // Trend chart locators
    this.trendChart = page.locator('canvas#spendTrendCanvas, [data-testid="trend-chart"]');
    this.chartContainer = page.locator('.chart-container:has-text("Monthly Spend Trends")');
    
    // Error and message locators
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message');
    this.noDataMessage = page.locator('[data-testid="no-data-message"], .text-center:has-text("No transaction data")');
    
    // Back button
    this.backButton = page.locator('a:has-text("Back to Cards"), [data-testid="back-button"]');
  }

  async navigate(cardId) {
    await this.page.goto(`/cards/${cardId}`);
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlySpend() {
    await expect(this.cardInfoSection).toBeVisible();
    const text = await this.monthlySpendDisplay.textContent();
    return text.replace(/[^0-9]/g, '');
  }

  async getTrendData() {
    // In real implementation, would extract data from Chart.js canvas
    // For now, return mock trend data structure
    await expect(this.trendChart).toBeVisible();
    
    // Mock 12-month trend data
    const months = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024',
                   'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024'];
    
    // In real scenario, would parse canvas data or API response
    return months.map(month => ({
      month,
      amount: Math.floor(Math.random() * 5000) + 2000 // Mock amount
    }));
  }

  async goBack() {
    await this.backButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyChartVisible() {
    await expect(this.trendChart).toBeVisible();
  }

  async verifyNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
  }
};

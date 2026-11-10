const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.categoryPieChart = page.locator('[data-testid="category-pie-chart"]');
    this.trendChart = page.locator('[data-testid="trend-chart"]');
    this.categoryItems = page.locator('.category-item');
    this.categoryTooltip = page.locator('.category-tooltip');
    this.warningMessage = page.locator('.warning-message');
    this.errorMessage = page.locator('.error-message');
    this.insufficientDataMessage = page.locator('.insufficient-data-message');
    this.drillDownView = page.locator('.drill-down-view');
    this.transactionList = page.locator('.transaction-list');
    this.analyticsContainer = page.locator('.analytics-container');
  }

  async navigateToAnalytics() {
    await this.page.goto('https://app.creditcard.com/analytics');
    await expect(this.analyticsContainer).toBeVisible();
  }

  async navigateToSpendingInsights() {
    await this.page.goto('https://app.creditcard.com/analytics/insights');
    await expect(this.trendChart).toBeVisible({ timeout: 5000 });
  }

  async getAllCategories() {
    await expect(this.categoryItems.first()).toBeVisible();
    const categories = await this.categoryItems.locator('.category-name').allTextContents();
    return categories.map(cat => cat.trim());
  }

  async getAllCategoryAmounts() {
    await expect(this.categoryItems.first()).toBeVisible();
    const amounts = await this.categoryItems.locator('.category-amount').allTextContents();
    return amounts.map(amt => amt.trim());
  }

  async getAllCategoryPercentages() {
    await expect(this.categoryItems.first()).toBeVisible();
    const percentages = await this.categoryItems.locator('.category-percentage').allTextContents();
    return percentages.map(pct => pct.trim());
  }

  async getTotalTransactionCount() {
    const countElement = this.page.locator('[data-testid="total-transaction-count"]');
    await expect(countElement).toBeVisible();
    const text = await countElement.textContent();
    return parseInt(text.trim());
  }

  async getCategorizedTransactionCount() {
    const countElement = this.page.locator('[data-testid="categorized-transaction-count"]');
    await expect(countElement).toBeVisible();
    const text = await countElement.textContent();
    return parseInt(text.trim());
  }

  async hoverOverCategorySegment(categoryName) {
    const segment = this.page.locator(`[data-category="${categoryName}"]`);
    await segment.hover();
  }

  async getCategoryAmount(categoryName) {
    const categoryItem = this.page.locator(`.category-item:has-text("${categoryName}")`);
    await expect(categoryItem).toBeVisible();
    const amount = await categoryItem.locator('.category-amount').textContent();
    return amount.trim();
  }

  async getChartTotalAmount() {
    const totalElement = this.page.locator('[data-testid="chart-total-amount"]');
    await expect(totalElement).toBeVisible();
    const text = await totalElement.textContent();
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async getDatabaseTotalAmount() {
    // Note: This would typically require API call or backend verification
    const totalElement = this.page.locator('[data-testid="database-total-amount"]');
    await expect(totalElement).toBeVisible();
    const text = await totalElement.textContent();
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async hasUncategorizedGroup() {
    const uncategorized = this.page.locator('.category-item:has-text("Uncategorized")');
    return await uncategorized.isVisible();
  }

  async hasRawTransactionData() {
    return await this.transactionList.isVisible();
  }

  async getWarningMessage() {
    await expect(this.warningMessage).toBeVisible();
    return await this.warningMessage.textContent();
  }

  async getAllTransactions() {
    await expect(this.transactionList).toBeVisible();
    const transactions = await this.transactionList.locator('.transaction-item').allTextContents();
    return transactions;
  }

  async getAllMonthsInChart() {
    await expect(this.trendChart).toBeVisible();
    const months = await this.trendChart.locator('.month-label').allTextContents();
    return months.map(month => month.trim());
  }

  async getAllMonthlyTotals() {
    await expect(this.trendChart).toBeVisible();
    const totals = await this.trendChart.locator('.month-total').allTextContents();
    return totals.map(total => total.trim());
  }

  async clickOnMonth(monthName) {
    const monthElement = this.page.locator(`[data-month="${monthName}"]`);
    await monthElement.click();
  }

  async getDrillDownCategories() {
    await expect(this.drillDownView).toBeVisible();
    const categories = await this.drillDownView.locator('.category-item').allTextContents();
    return categories;
  }

  async getInsufficientDataMessage() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async getChartDataPoints() {
    await expect(this.trendChart).toBeVisible();
    const dataPoints = await this.trendChart.locator('.data-point').allTextContents();
    return dataPoints;
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};

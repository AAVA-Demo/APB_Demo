const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsMenu = page.locator('a:has-text("Analytics"), [href*="analytics"]');
    this.monthlyTrendsLink = page.locator('a:has-text("Monthly Trends"), [href*="monthly-trends"]');
    this.spendingAnalyticsLink = page.locator('a:has-text("Spending"), a:has-text("Spending Analytics"), [href*="spending"]');
    this.cardWiseSpendLink = page.locator('a:has-text("Card-Wise"), a:has-text("Card-Wise Spend"), [href*="card-wise"]');
    this.monthlyTrendChart = page.locator('.monthly-trend-chart, #monthly-trend-chart, [data-chart="monthly-trend"]');
    this.monthDataPoints = page.locator('.month-data-point, .chart-data-point, [data-type="month-point"]');
    this.insufficientDataMessage = page.locator('.insufficient-data-message, .no-data-message').filter({ hasText: /more historical data/i });
    this.monthDetailView = page.locator('.month-detail-view, .drill-down-view, [data-view="month-detail"]');
    this.categoryBreakdownSection = page.locator('.category-breakdown, [data-section="category-breakdown"]');
    this.categoryChart = page.locator('.category-chart, #category-chart, [data-chart="category"]');
    this.categoryDrillDownView = page.locator('.category-drill-down, [data-view="category-detail"]');
    this.transactionList = page.locator('.transaction-list, [data-list="transactions"]');
    this.transactionItems = page.locator('.transaction-item, [data-item="transaction"]');
    this.dateRangeFilter = page.locator('input[type="date"], .date-range-filter, [data-filter="date-range"]');
    this.cardTypeFilter = page.locator('select[name="card-type"], .card-type-filter, [data-filter="card-type"]');
    this.insufficientDataForSubCategoryMessage = page.locator('.message').filter({ hasText: /insufficient data for sub-category/i });
    this.cardWiseSpendChart = page.locator('.card-wise-chart, #card-wise-chart, [data-chart="card-wise"]');
    this.categoryFilterDropdown = page.locator('select[name="category"], .category-filter, [data-filter="category"]');
    this.emptyStateMessage = page.locator('.empty-state, .no-data-message, [data-state="empty"]');
  }

  async navigateToMonthlyTrends() {
    await expect(this.analyticsMenu).toBeVisible();
    await this.analyticsMenu.click();
    await expect(this.monthlyTrendsLink).toBeVisible();
    await this.monthlyTrendsLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.monthlyTrendChart).toBeVisible({ timeout: 10000 });
  }

  async navigateToSpendingAnalytics() {
    await expect(this.analyticsMenu).toBeVisible();
    await this.analyticsMenu.click();
    await expect(this.spendingAnalyticsLink).toBeVisible();
    await this.spendingAnalyticsLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.categoryChart).toBeVisible({ timeout: 10000 });
  }

  async navigateToCardWiseSpend() {
    await expect(this.analyticsMenu).toBeVisible();
    await this.analyticsMenu.click();
    await expect(this.cardWiseSpendLink).toBeVisible();
    await this.cardWiseSpendLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.cardWiseSpendChart).toBeVisible({ timeout: 10000 });
  }

  async getMonthDataPointCount() {
    await expect(this.monthDataPoints.first()).toBeVisible();
    return await this.monthDataPoints.count();
  }

  async getAllMonthlySpendingData() {
    const dataPoints = await this.monthDataPoints.all();
    const monthlyData = [];
    for (const point of dataPoints) {
      const month = await point.getAttribute('data-month') || await point.locator('.month-label').textContent();
      const amount = await point.getAttribute('data-amount') || await point.locator('.amount-label').textContent();
      monthlyData.push({ month, amount });
    }
    return monthlyData;
  }

  async clickMonthDataPoint(monthName) {
    const monthPoint = this.monthDataPoints.filter({ hasText: monthName });
    await expect(monthPoint).toBeVisible();
    await monthPoint.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getInsufficientDataMessageText() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async getTransactionCountForMonth() {
    await expect(this.transactionItems.first()).toBeVisible();
    return await this.transactionItems.count();
  }

  async getCategoryBreakdownList() {
    const categoryItems = this.categoryBreakdownSection.locator('.category-item, [data-item="category"]');
    await expect(categoryItems.first()).toBeVisible();
    return await categoryItems.all();
  }

  async clickCategoryInChart(categoryName) {
    const categoryElement = this.categoryChart.locator(`[data-category="${categoryName}"], text=${categoryName}`).first();
    await expect(categoryElement).toBeVisible();
    await categoryElement.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionList() {
    await expect(this.transactionItems.first()).toBeVisible();
    const items = await this.transactionItems.all();
    const transactions = [];
    for (const item of items) {
      const merchantName = await item.locator('.merchant-name, [data-field="merchant"]').textContent();
      const date = await item.locator('.transaction-date, [data-field="date"]').textContent();
      const amount = await item.locator('.transaction-amount, [data-field="amount"]').textContent();
      transactions.push({ merchantName, date, amount });
    }
    return transactions;
  }

  async applyDateRangeFilter(startDate, endDate) {
    const startDateInput = this.dateRangeFilter.first();
    const endDateInput = this.dateRangeFilter.last();
    await expect(startDateInput).toBeVisible();
    await startDateInput.fill(startDate);
    await expect(endDateInput).toBeVisible();
    await endDateInput.fill(endDate);
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionCount() {
    return await this.transactionItems.count();
  }

  async getFirstTransaction() {
    const firstItem = this.transactionItems.first();
    await expect(firstItem).toBeVisible();
    const merchantName = await firstItem.locator('.merchant-name, [data-field="merchant"]').textContent();
    const date = await firstItem.locator('.transaction-date, [data-field="date"]').textContent();
    const amount = await firstItem.locator('.transaction-amount, [data-field="amount"]').textContent();
    return { merchantName, date, amount };
  }

  async getCardSpendingData() {
    const cardDataElements = this.cardWiseSpendChart.locator('.card-data, [data-type="card-spending"]');
    await expect(cardDataElements.first()).toBeVisible();
    const cards = await cardDataElements.all();
    const cardData = [];
    for (const card of cards) {
      const cardName = await card.getAttribute('data-card') || await card.locator('.card-name').textContent();
      const amount = await card.getAttribute('data-amount') || await card.locator('.amount').textContent();
      const category = await card.getAttribute('data-category') || '';
      cardData.push({ cardName, amount, category });
    }
    return cardData;
  }

  async getCategoryFilterOptions() {
    await expect(this.categoryFilterDropdown).toBeVisible();
    const options = await this.categoryFilterDropdown.locator('option').allTextContents();
    return options;
  }

  async selectCategoryFilter(categoryName) {
    await expect(this.categoryFilterDropdown).toBeVisible();
    await this.categoryFilterDropdown.selectOption({ label: categoryName });
    await this.page.waitForLoadState('networkidle');
  }

  async getEmptyStateMessageText() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }
};
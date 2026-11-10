const { expect } = require('@playwright/test');

exports.CategoryAnalyticsPage = class CategoryAnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation Locators
    this.categoryAnalyticsLink = page.locator('[data-testid="category-analytics-link"]');
    
    // Pie Chart Locators
    this.pieChart = page.locator('[data-testid="category-pie-chart"]');
    this.categorySegments = page.locator('[data-testid="category-segment"]');
    this.tooltipElement = page.locator('[data-testid="chart-tooltip"]');
    
    // Category Details Locators
    this.categoryLabels = page.locator('[data-testid="category-label"]');
    this.categoryAmounts = page.locator('[data-testid="category-amount"]');
    this.categoryPercentages = page.locator('[data-testid="category-percentage"]');
    this.categoryTransactionCounts = page.locator('[data-testid="category-transaction-count"]');
    
    // Transaction Details Locators
    this.transactionDetailsList = page.locator('[data-testid="transaction-details-list"]');
    this.transactionTable = page.locator('[data-testid="transaction-table"]');
    this.transactionTableHeaders = page.locator('[data-testid="transaction-table"] thead th');
    this.transactionRows = page.locator('[data-testid="transaction-table"] tbody tr');
    
    // Filter Locators
    this.dateRangeStartInput = page.locator('[data-testid="date-range-start"]');
    this.dateRangeEndInput = page.locator('[data-testid="date-range-end"]');
    this.applyDateRangeButton = page.locator('[data-testid="apply-date-range-btn"]');
    this.cardFilterDropdown = page.locator('[data-testid="card-filter-dropdown"]');
    this.amountMinInput = page.locator('[data-testid="amount-min-input"]');
    this.amountMaxInput = page.locator('[data-testid="amount-max-input"]');
    this.applyAmountFilterButton = page.locator('[data-testid="apply-amount-filter-btn"]');
    
    // Filtered Results Locators
    this.filteredTotalLabel = page.locator('[data-testid="filtered-total"]');
    this.filteredCountLabel = page.locator('[data-testid="filtered-count"]');
    
    // Message Locators
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"]');
    this.noDataMessage = page.locator('[data-testid="no-data-message"]');
    this.viewAllCategoriesButton = page.locator('[data-testid="view-all-categories-btn"]');
    this.changeDateRangeButton = page.locator('[data-testid="change-date-range-btn"]');
    this.selectDifferentDateRangeButton = page.locator('[data-testid="select-different-date-range-btn"]');
    this.addTransactionsLink = page.locator('[data-testid="add-transactions-link"]');
    
    // Loading Indicator
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  async navigate() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToCategoryAnalytics() {
    await this.categoryAnalyticsLink.click();
    await expect(this.pieChart).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getAllCategoryNames() {
    const names = [];
    const categoryElements = await this.categoryLabels.all();
    for (const element of categoryElements) {
      names.push(await element.textContent());
    }
    return names;
  }

  async getCategoryAmount(categoryName) {
    const categoryRow = this.page.locator(`[data-testid="category-row"][data-category="${categoryName}"]`);
    await expect(categoryRow).toBeVisible();
    const amountElement = categoryRow.locator('[data-testid="category-amount"]');
    return await amountElement.textContent();
  }

  async getCategoryPercentage(categoryName) {
    const categoryRow = this.page.locator(`[data-testid="category-row"][data-category="${categoryName}"]`);
    await expect(categoryRow).toBeVisible();
    const percentageElement = categoryRow.locator('[data-testid="category-percentage"]');
    return await percentageElement.textContent();
  }

  async getCategoryTransactionCount(categoryName) {
    const categoryRow = this.page.locator(`[data-testid="category-row"][data-category="${categoryName}"]`);
    await expect(categoryRow).toBeVisible();
    const countElement = categoryRow.locator('[data-testid="category-transaction-count"]');
    const countText = await countElement.textContent();
    return parseInt(countText, 10);
  }

  async getAllCategoryAmounts() {
    const amounts = [];
    const amountElements = await this.categoryAmounts.all();
    for (const element of amountElements) {
      const text = await element.textContent();
      const numericValue = parseFloat(text.replace(/[$,]/g, ''));
      amounts.push(numericValue);
    }
    return amounts;
  }

  async getAllCategoryPercentages() {
    const percentages = [];
    const percentageElements = await this.categoryPercentages.all();
    for (const element of percentageElements) {
      const text = await element.textContent();
      const numericValue = parseFloat(text.replace('%', ''));
      percentages.push(numericValue);
    }
    return percentages;
  }

  async clickCategorySegment(categoryName) {
    const segment = this.page.locator(`[data-testid="category-segment"][data-category="${categoryName}"]`);
    await expect(segment).toBeVisible();
    await segment.click();
    await this.page.waitForLoadState('networkidle');
  }

  async hoverOverCategory(categoryName) {
    const segment = this.page.locator(`[data-testid="category-segment"][data-category="${categoryName}"]`);
    await expect(segment).toBeVisible();
    await segment.hover();
  }

  async getTransactionTableHeaders() {
    const headers = [];
    const headerElements = await this.transactionTableHeaders.all();
    for (const element of headerElements) {
      headers.push(await element.textContent());
    }
    return headers;
  }

  async getAllTransactionAmounts() {
    const amounts = [];
    const rows = await this.transactionRows.all();
    for (const row of rows) {
      const amountCell = row.locator('[data-testid="transaction-amount"]');
      const text = await amountCell.textContent();
      const numericValue = parseFloat(text.replace(/[$,]/g, ''));
      amounts.push(numericValue);
    }
    return amounts;
  }

  async selectDateRange(startDate, endDate) {
    await this.dateRangeStartInput.fill(startDate);
    await this.dateRangeEndInput.fill(endDate);
    await this.applyDateRangeButton.click();
  }

  async waitForChartUpdate() {
    await this.page.waitForTimeout(1000); // Brief wait for chart animation
    await this.page.waitForLoadState('networkidle');
  }

  async applyDateRangeFilter(startDate, endDate) {
    await this.dateRangeStartInput.fill(startDate);
    await this.dateRangeEndInput.fill(endDate);
    await this.applyDateRangeButton.click();
    await this.waitForFilterUpdate();
  }

  async applyCardFilter(cardName) {
    await this.cardFilterDropdown.selectOption({ label: cardName });
    await this.waitForFilterUpdate();
  }

  async applyAmountRangeFilter(minAmount, maxAmount) {
    await this.amountMinInput.fill(minAmount.toString());
    await this.amountMaxInput.fill(maxAmount.toString());
    await this.applyAmountFilterButton.click();
    await this.waitForFilterUpdate();
  }

  async waitForFilterUpdate() {
    await this.page.waitForTimeout(500); // Brief wait for filter processing
    await this.page.waitForLoadState('networkidle');
  }

  async getFilteredTotal() {
    await expect(this.filteredTotalLabel).toBeVisible();
    return await this.filteredTotalLabel.textContent();
  }

  async getFilteredCount() {
    await expect(this.filteredCountLabel).toBeVisible();
    const text = await this.filteredCountLabel.textContent();
    return parseInt(text, 10);
  }
};
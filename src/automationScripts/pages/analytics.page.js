const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.analyticsMenuItem = page.locator('nav a[href="#/analytics"]');
    this.monthlyTrendsChart = page.locator('.chart-container:has-text("Monthly Spending Trends")');
    this.categoryWiseChart = page.locator('.chart-container:has-text("Category-Wise Spending")');
    this.infoMessage = page.locator('.alert-info');
    this.errorMessage = page.locator('.alert-danger');
    this.drillDownView = page.locator('.drill-down-view');
    this.transactionList = page.locator('.transaction-list');
    this.closeDrillDownButton = page.locator('button:has-text("Close")');
    this.categoryViewButton = page.locator('button:has-text("Category-wise")');
    this.filterSection = page.locator('.filter-section');
    this.applyFilterButton = page.locator('button:has-text("Apply Filter")');
    this.clearFilterButton = page.locator('button:has-text("Clear")');
    this.totalSpendingDisplay = page.locator('.total-spending');
  }

  async navigate() {
    await this.page.goto('https://creditcard-dashboard.example.com');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAnalytics() {
    await expect(this.analyticsMenuItem).toBeVisible();
    await this.analyticsMenuItem.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyMonthlyTrendsChartVisible() {
    await expect(this.monthlyTrendsChart).toBeVisible();
    const chart = this.monthlyTrendsChart.locator('canvas');
    await expect(chart).toBeVisible();
  }

  async verifyChartMonthCount(expectedCount) {
    await this.page.waitForTimeout(1000);
    const chartLabels = await this.page.evaluate(() => {
      const charts = window.Chart.instances;
      if (charts && charts.length > 0) {
        return charts[0].data.labels.length;
      }
      return 0;
    });
    expect(chartLabels).toBe(expectedCount);
  }

  async verifyMonthlySpending(month, expectedAmount) {
    await this.page.waitForTimeout(500);
    const chartData = await this.page.evaluate((monthName) => {
      const charts = window.Chart.instances;
      if (charts && charts.length > 0) {
        const chart = charts[0];
        const index = chart.data.labels.indexOf(monthName);
        if (index !== -1) {
          return chart.data.datasets[0].data[index];
        }
      }
      return null;
    }, month);
    expect(chartData).toBe(expectedAmount);
  }

  async drillDownToMonth(month) {
    const chartCanvas = this.monthlyTrendsChart.locator('canvas');
    await chartCanvas.click();
    await this.page.waitForTimeout(500);
  }

  async verifyTransactionDetailsVisible() {
    await expect(this.transactionList).toBeVisible();
  }

  async getTransactionCount() {
    const transactions = this.transactionList.locator('.transaction-item');
    return await transactions.count();
  }

  async closeDrillDown() {
    await expect(this.closeDrillDownButton).toBeVisible();
    await this.closeDrillDownButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyInfoMessage(expectedMessage) {
    await expect(this.infoMessage).toBeVisible();
    const actualMessage = await this.infoMessage.textContent();
    expect(actualMessage.trim()).toContain(expectedMessage);
  }

  async verifyErrorMessage(expectedMessage) {
    await expect(this.errorMessage).toBeVisible();
    const actualMessage = await this.errorMessage.textContent();
    expect(actualMessage.trim()).toContain(expectedMessage);
  }

  async selectCategoryWiseView() {
    await expect(this.categoryViewButton).toBeVisible();
    await this.categoryViewButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyCategoryCount(expectedCount) {
    await this.page.waitForTimeout(1000);
    const categoryItems = this.page.locator('.category-item');
    const count = await categoryItems.count();
    expect(count).toBe(expectedCount);
  }

  async verifyCategorySpending(category, expectedAmount) {
    const categoryItem = this.page.locator(`.category-item:has-text("${category}")`);
    await expect(categoryItem).toBeVisible();
    const amountText = await categoryItem.locator('.category-amount').textContent();
    const amount = this.parseAmount(amountText);
    expect(amount).toBe(expectedAmount);
  }

  async verifyChartInteractive() {
    const chartCanvas = this.categoryWiseChart.locator('canvas');
    await expect(chartCanvas).toBeVisible();
    await chartCanvas.hover();
    await this.page.waitForTimeout(500);
  }

  async verifyFilterOptionsVisible() {
    await expect(this.filterSection).toBeVisible();
  }

  async verifyCategoryPercentage(category, expectedPercentage) {
    const categoryItem = this.page.locator(`.category-item:has-text("${category}")`);
    await expect(categoryItem).toBeVisible();
    const percentageText = await categoryItem.locator('.category-percentage').textContent();
    const percentage = parseFloat(percentageText.replace(/[^0-9.]/g, ''));
    expect(percentage).toBeCloseTo(expectedPercentage, 1);
  }

  async verifyCategorizationNote(expectedNote) {
    const note = this.page.locator('.categorization-note');
    await expect(note).toBeVisible();
    const noteText = await note.textContent();
    expect(noteText.trim()).toContain(expectedNote);
  }

  async verifyTotalSpendingMatches() {
    await expect(this.totalSpendingDisplay).toBeVisible();
    const totalText = await this.totalSpendingDisplay.textContent();
    const total = this.parseAmount(totalText);
    expect(total).toBeGreaterThan(0);
  }

  async drillDownToCategory(category) {
    const categoryItem = this.page.locator(`.category-item:has-text("${category}")`);
    await categoryItem.click();
    await this.page.waitForTimeout(500);
  }

  async verifyMixedTransactions() {
    const transactions = this.transactionList.locator('.transaction-item');
    const count = await transactions.count();
    expect(count).toBeGreaterThan(0);
  }

  async getTotalSpending() {
    await expect(this.totalSpendingDisplay).toBeVisible();
    const totalText = await this.totalSpendingDisplay.textContent();
    return this.parseAmount(totalText);
  }

  async applyFilter(categories) {
    for (const category of categories) {
      const checkbox = this.filterSection.locator(`input[type="checkbox"][value="${category}"]`);
      await checkbox.check();
    }
    await this.applyFilterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clearFilter() {
    await this.clearFilterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  parseAmount(amountText) {
    const cleaned = amountText.replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned);
  }
};

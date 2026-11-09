const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    
    this.analyticsLink = page.locator('a[href="#/analytics"]');
    this.monthlyTrendsTab = page.locator('[data-testid="monthly-trends-tab"]');
    
    this.lineChart = page.locator('[data-testid="line-chart"], canvas.line-chart');
    this.barChart = page.locator('[data-testid="bar-chart"], canvas.bar-chart');
    this.pieChart = page.locator('[data-testid="pie-chart"], canvas.pie-chart');
    
    this.tooltip = page.locator('.chart-tooltip, [data-testid="chart-tooltip"]');
    this.drillDownPanel = page.locator('[data-testid="drill-down-panel"]');
    this.closeDrillDownButton = page.locator('[data-testid="close-drill-down"]');
    
    this.notificationMessage = page.locator('.notification-message, .alert-info');
    this.noDataMessage = page.locator('[data-testid="no-data-message"]');
    this.emptyChartPlaceholder = page.locator('[data-testid="empty-chart-placeholder"]');
    
    this.timePeriodSelector = page.locator('[data-testid="time-period-selector"]');
    
    this.categoryItems = page.locator('[data-testid="category-item"]');
  }

  async navigate() {
    await this.page.goto('/');
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

  async navigateToMonthlyTrends() {
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
    await this.monthlyTrendsTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getDataPointCount() {
    await expect(this.lineChart).toBeVisible();
    const dataPoints = await this.page.locator('[data-testid="data-point"]').count();
    return dataPoints;
  }

  async verifyChartAxes() {
    const xAxis = this.page.locator('[data-testid="x-axis"]');
    const yAxis = this.page.locator('[data-testid="y-axis"]');
    await expect(xAxis).toBeVisible();
    await expect(yAxis).toBeVisible();
  }

  async hoverOverDataPoint(month) {
    const dataPoint = this.page.locator(`[data-testid="data-point-${month}"]`);
    await expect(dataPoint).toBeVisible();
    await dataPoint.hover();
    await this.page.waitForTimeout(500);
  }

  async clickDataPoint(month) {
    const dataPoint = this.page.locator(`[data-testid="data-point-${month}"]`);
    await expect(dataPoint).toBeVisible();
    await dataPoint.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCategoryBreakdown() {
    await expect(this.drillDownPanel).toBeVisible();
    const categories = await this.drillDownPanel.locator('[data-testid="category-breakdown-item"]').all();
    return categories;
  }

  async getCategoryNames() {
    await expect(this.drillDownPanel).toBeVisible();
    const names = [];
    const items = await this.drillDownPanel.locator('[data-testid="category-name"]').all();
    for (const item of items) {
      names.push(await item.textContent());
    }
    return names;
  }

  async getMonthTransactionCount() {
    await expect(this.drillDownPanel).toBeVisible();
    const text = await this.drillDownPanel.locator('[data-testid="transaction-count"]').textContent();
    return parseInt(text);
  }

  async closeDrillDownPanel() {
    await this.closeDrillDownButton.click();
    await this.page.waitForTimeout(300);
  }

  async performPinchZoom() {
    await this.page.touchscreen.tap(400, 400);
    await this.page.mouse.move(300, 300);
    await this.page.mouse.move(500, 500);
  }

  async performSwipeGesture() {
    await this.page.touchscreen.tap(600, 400);
    await this.page.mouse.move(600, 400);
    await this.page.mouse.move(200, 400);
  }

  async tapDataPoint(month) {
    const dataPoint = this.page.locator(`[data-testid="data-point-${month}"]`);
    await expect(dataPoint).toBeVisible();
    await this.page.touchscreen.tap(await dataPoint.boundingBox().then(box => box.x + box.width / 2), await dataPoint.boundingBox().then(box => box.y + box.height / 2));
    await this.page.waitForLoadState('networkidle');
  }

  async getBarChartData() {
    await expect(this.barChart).toBeVisible();
    const data = [];
    const bars = await this.page.locator('[data-testid="bar-chart-item"]').all();
    for (const bar of bars) {
      const month = await bar.getAttribute('data-month');
      const amount = parseFloat(await bar.getAttribute('data-amount'));
      data.push({ month, amount });
    }
    return data;
  }

  async getDataPointValue(month) {
    const dataPoint = this.page.locator(`[data-testid="data-point-${month}"]`);
    await expect(dataPoint).toBeVisible();
    const value = await dataPoint.getAttribute('data-value');
    return parseFloat(value);
  }

  async getCategoryAmount(categoryName) {
    await expect(this.drillDownPanel).toBeVisible();
    const categoryItem = this.drillDownPanel.locator(`[data-testid="category-item"]:has-text("${categoryName}")`);
    const text = await categoryItem.locator('[data-testid="category-amount"]').textContent();
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async getCategoryCount() {
    await expect(this.pieChart).toBeVisible();
    return await this.categoryItems.count();
  }

  async getAllCategoryAmounts() {
    await expect(this.pieChart).toBeVisible();
    const amounts = [];
    const count = await this.categoryItems.count();
    for (let i = 0; i < count; i++) {
      const text = await this.categoryItems.nth(i).locator('[data-testid="category-amount"]').textContent();
      amounts.push(parseFloat(text.replace(/[$,]/g, '')));
    }
    return amounts;
  }

  async getAllCategoryPercentages() {
    await expect(this.pieChart).toBeVisible();
    const percentages = [];
    const count = await this.categoryItems.count();
    for (let i = 0; i < count; i++) {
      const text = await this.categoryItems.nth(i).locator('[data-testid="category-percentage"]').textContent();
      percentages.push(parseFloat(text.replace('%', '')));
    }
    return percentages;
  }

  async getCategoryData(categoryName) {
    const categoryItem = this.page.locator(`[data-testid="category-item"]:has-text("${categoryName}")`);
    await expect(categoryItem).toBeVisible();
    const amountText = await categoryItem.locator('[data-testid="category-amount"]').textContent();
    const percentageText = await categoryItem.locator('[data-testid="category-percentage"]').textContent();
    return {
      amount: parseFloat(amountText.replace(/[$,]/g, '')),
      percentage: parseFloat(percentageText.replace('%', ''))
    };
  }

  async selectTimePeriod(period) {
    await expect(this.timePeriodSelector).toBeVisible();
    await this.timePeriodSelector.selectOption({ label: period });
    await this.page.waitForLoadState('networkidle');
  }
};
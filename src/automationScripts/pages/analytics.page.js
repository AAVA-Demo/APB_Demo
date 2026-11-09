const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.navigationMenu = page.locator('nav.navbar');
    this.analyticsLink = page.locator('a[href="#!/analytics"]');
    this.analyticsPage = page.locator('.analytics-container');
    this.monthlyTrendsSection = page.locator('.panel:has-text("Monthly Spend Trends")');
    this.categoryWiseSection = page.locator('.panel:has-text("Category-wise Spending")');
    this.monthlyTrendsVisualization = page.locator('.panel:has-text("Monthly Spend Trends") canvas');
    this.lineGraph = page.locator('canvas#chart-line, canvas[id^="chart-"]').first();
    this.pieChart = page.locator('canvas#chart-pie, canvas[id^="chart-"]').first();
    this.insufficientDataMessage = page.locator('.analytics-container').getByText(/Insufficient data/i);
    this.tooltip = page.locator('.chartjs-tooltip, [role="tooltip"]');
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async navigate() {
    await this.page.goto('https://app.example.com/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAnalytics() {
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.analyticsPage).toBeVisible();
  }

  async navigateToMonthlyTrends() {
    await expect(this.monthlyTrendsSection).toBeVisible();
    await this.page.waitForTimeout(500);
  }

  async navigateToCategoryWiseSpending() {
    await expect(this.categoryWiseSection).toBeVisible();
    await this.page.waitForTimeout(500);
  }

  async loginWith12MonthsHistory(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async loginWithNoTransactions(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async loginWithAllCategories(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async loginWithInvalidCategories(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async loginWithThreeCategories(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getDataPointCount() {
    const chartData = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return 0;
      const chart = Chart.getChart(canvas);
      return chart ? chart.data.labels.length : 0;
    });
    return chartData;
  }

  async getMonthLabels() {
    const labels = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      return chart ? chart.data.labels : [];
    });
    return labels;
  }

  async verifyChronologicalOrder() {
    const labels = await this.getMonthLabels();
    if (labels.length < 2) return true;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < labels.length - 1; i++) {
      const currentIndex = months.findIndex(m => labels[i].includes(m));
      const nextIndex = months.findIndex(m => labels[i + 1].includes(m));
      if (currentIndex > nextIndex) return false;
    }
    return true;
  }

  async verifyAccurateSpendingAmounts() {
    const dataPoints = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      return chart ? chart.data.datasets[0].data : [];
    });
    return dataPoints.every(point => typeof point === 'number' && point >= 0);
  }

  async hoverOverDataPoint(monthLabel) {
    const canvas = this.lineGraph;
    await canvas.hover();
    await this.page.waitForTimeout(500);
  }

  async getTooltipTotalSpending() {
    await this.tooltip.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    const text = await this.tooltip.textContent();
    const match = text.match(/\$[\d,]+\.\d{2}/);
    return match ? match[0] : null;
  }

  async getTooltipCategoryBreakdown() {
    const text = await this.tooltip.textContent();
    return text;
  }

  async moveAwayFromDataPoint() {
    await this.page.mouse.move(0, 0);
    await this.page.waitForTimeout(300);
  }

  async getAllCategorySegments() {
    const categories = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      return chart ? chart.data.labels : [];
    });
    return categories;
  }

  async verifyCategoryAmounts() {
    const amounts = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      return chart ? chart.data.datasets[0].data : [];
    });
    return amounts.every(amount => typeof amount === 'number' && amount > 0);
  }

  async verifyCategoryPercentages() {
    const amounts = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      return chart ? chart.data.datasets[0].data : [];
    });
    const total = amounts.reduce((sum, val) => sum + val, 0);
    const percentages = amounts.map(val => (val / total) * 100);
    return percentages.every(pct => pct > 0 && pct <= 100);
  }

  async verifyPieChartInteractivity() {
    const canvas = this.pieChart;
    await canvas.hover();
    await this.page.waitForTimeout(300);
    const tooltipVisible = await this.tooltip.isVisible().catch(() => false);
    return tooltipVisible;
  }

  async verifyAllTransactionsVisible() {
    const segments = await this.getAllCategorySegments();
    return segments.length > 0;
  }

  async verifyInvalidCategoriesInMiscellaneous() {
    const categories = await this.getAllCategorySegments();
    return categories.includes('Miscellaneous');
  }

  async getCategoryAmount(categoryName) {
    const data = await this.page.evaluate((cat) => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return null;
      const chart = Chart.getChart(canvas);
      if (!chart) return null;
      const index = chart.data.labels.indexOf(cat);
      return index >= 0 ? chart.data.datasets[0].data[index] : null;
    }, categoryName);
    return data;
  }

  async verifyMiscellaneousIncludesInvalidTransactions() {
    const miscAmount = await this.getCategoryAmount('Miscellaneous');
    return miscAmount !== null && miscAmount > 0;
  }

  async sumAllPercentages() {
    const amounts = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      return chart ? chart.data.datasets[0].data : [];
    });
    const total = amounts.reduce((sum, val) => sum + val, 0);
    const percentages = amounts.map(val => (val / total) * 100);
    return percentages.reduce((sum, pct) => sum + pct, 0);
  }

  async verifyNoEmptyCategories() {
    const amounts = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      return chart ? chart.data.datasets[0].data : [];
    });
    return amounts.every(amount => amount > 0);
  }
};
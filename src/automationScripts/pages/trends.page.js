const { expect } = require('@playwright/test');

/**
 * Trends Page Object
 * Handles all interactions with the Monthly Spend Trends page
 * Covers: Monthly Trends, Card-wise Analysis, Filters
 */
exports.TrendsPage = class TrendsPage {

  constructor(page) {
    this.page = page;
    
    // Navigation Locators
    this.navTrends = page.locator('a[href="#/trends"]');
    
    // Filter Locators
    this.filterPanel = page.locator('.filter-panel');
    this.startDateInput = page.locator('input[type="date"][ng-model*="startDate"]');
    this.endDateInput = page.locator('input[type="date"][ng-model*="endDate"]');
    this.cardFilterDropdown = page.locator('select[ng-model*="selectedCard"]');
    
    // Chart Locators
    this.chartContainer = page.locator('.chart-container');
    this.chartCanvas = page.locator('canvas');
    this.chartLegend = page.locator('.chart-legend, [class*="legend"]');
    
    // Message Locators
    this.errorMessage = page.locator('.alert-danger');
    this.retryButton = page.locator('button:has-text("Retry")');
    this.emptyStateMessage = page.locator('p:has-text("No spending data")');
    this.insufficientDataMessage = page.locator('p:has-text("Insufficient data")');
    
    // Loading Locators
    this.loadingIndicator = page.locator('p:has-text("Loading trend data")');
    
    // Login Locators
    this.usernameInput = page.locator('#username, input[name="username"]');
    this.passwordInput = page.locator('#password, input[name="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login")');
  }

  async navigate() {
    await this.page.goto('https://creditcard-dashboard.example.com');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToTrends() {
    await this.navTrends.click();
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForPageLoad() {
    await this.page.waitForSelector('.trends-container', { state: 'visible', timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async waitForChartLoad() {
    await this.chartContainer.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(1000);
  }

  async waitForChartUpdate() {
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState('networkidle');
  }

  async getChartMonths() {
    // Execute JavaScript to extract Chart.js data
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      return chart ? chart.data.labels : [];
    });
  }

  async getMonthlyAmounts() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      if (!chart || !chart.data.datasets[0]) return [];
      return chart.data.datasets[0].data;
    });
  }

  async getChartDatasets() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      if (!chart) return [];
      return chart.data.datasets.map(ds => ({
        name: ds.label,
        data: ds.data
      }));
    });
  }

  async hoverDataPoint(index) {
    const canvas = this.chartCanvas;
    const box = await canvas.boundingBox();
    // Calculate approximate position of data point
    const x = box.x + (box.width / 7) * (index + 1);
    const y = box.y + box.height / 2;
    await this.page.mouse.move(x, y);
    await this.page.waitForTimeout(500);
  }

  async getTooltipText() {
    const tooltip = this.page.locator('.chartjs-tooltip, [role="tooltip"]');
    await expect(tooltip).toBeVisible({ timeout: 2000 });
    return await tooltip.textContent();
  }

  async verifyChartInteractive() {
    const canvas = this.chartCanvas;
    await expect(canvas).toBeVisible();
    // Verify canvas is interactive (has event listeners)
    const isInteractive = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return canvas && Chart.getChart(canvas) !== undefined;
    });
    expect(isInteractive).toBe(true);
  }

  async hasChartData() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;
      const chart = Chart.getChart(canvas);
      if (!chart || !chart.data.datasets) return false;
      return chart.data.datasets.some(ds => ds.data && ds.data.length > 0);
    });
  }

  async getStartDateValue() {
    return await this.startDateInput.inputValue();
  }

  async getEndDateValue() {
    return await this.endDateInput.inputValue();
  }

  async getSelectedCard() {
    const selectedOption = await this.cardFilterDropdown.locator('option:checked').textContent();
    return selectedOption.trim();
  }

  async clickRetry() {
    await this.retryButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCardFilterOptions() {
    const options = await this.cardFilterDropdown.locator('option').allTextContents();
    return options.map(opt => opt.trim());
  }

  async selectCard(cardName) {
    await this.cardFilterDropdown.selectOption({ label: cardName });
    await this.page.waitForTimeout(500);
  }

  async getLegendItems() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      if (!chart) return [];
      return chart.data.datasets.map(ds => ds.label);
    });
  }

  async verifyLegendColors() {
    const colors = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      if (!chart) return [];
      return chart.data.datasets.map(ds => ds.borderColor);
    });
    // Verify each dataset has a distinct color
    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(colors.length);
  }

  async getMonthAmounts(monthLabel) {
    return await this.page.evaluate((month) => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return {};
      const chart = Chart.getChart(canvas);
      if (!chart) return {};
      const monthIndex = chart.data.labels.indexOf(month);
      if (monthIndex === -1) return {};
      const result = {};
      chart.data.datasets.forEach(ds => {
        result[ds.label] = ds.data[monthIndex];
      });
      return result;
    }, monthLabel);
  }

};
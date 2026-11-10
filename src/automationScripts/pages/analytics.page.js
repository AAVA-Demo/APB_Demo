const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger('AnalyticsPage');
    
    // Chart Locators
    this.trendChart = page.locator('[data-testid="trend-chart"], #trendChart, canvas#trendChart');
    this.categoryChart = page.locator('[data-testid="category-chart"], #categoryChart, canvas#categoryChart');
    
    // Chart Data Locators (using Chart.js structure)
    this.chartLabels = page.locator('.chartjs-axis-label, .chart-label');
    this.chartDataPoints = page.locator('.chartjs-data-point, .chart-data-point');
    this.categoryTooltip = page.locator('[data-testid="chart-tooltip"], .chartjs-tooltip, .chart-tooltip');
    
    // Drill-down Locators
    this.drillDownView = page.locator('[data-testid="drill-down-view"], .drill-down-view, .detail-view');
    this.drillDownMonth = page.locator('[data-testid="drill-down-month"], .drill-down-month');
    this.drillDownDetails = page.locator('[data-testid="drill-down-detail"], .drill-down-detail');
    
    // Message Locators
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"], .alert:has-text("months of data available")');
    this.analyticsErrorMessage = page.locator('[data-testid="analytics-error"], .alert-danger:has-text("temporarily unavailable")');
    this.noSpendingDataMessage = page.locator('[data-testid="no-spending-data"], .alert:has-text("No spending data available")');
    this.dataErrorMessage = page.locator('[data-testid="data-error"], .alert-danger:has-text("Unable to load spending data")');
    
    // Login Locators
    this.usernameInput = page.locator('[data-testid="username"], input[name="username"], #username');
    this.passwordInput = page.locator('[data-testid="password"], input[name="password"], #password');
    this.loginButton = page.locator('[data-testid="login-button"], button:has-text("Login"), button[type="submit"]');
    
    // Loading Indicator
    this.loadingIndicator = page.locator('[data-testid="loading"], .loading, .spinner');
  }

  async navigate() {
    this.logger.info('Navigating to analytics dashboard');
    await this.page.goto('/analytics');
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    this.logger.info('Waiting for analytics page to load');
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {
      this.logger.info('No loading indicator found or already hidden');
    });
    await Promise.race([
      this.trendChart.waitFor({ state: 'visible', timeout: 3000 }),
      this.categoryChart.waitFor({ state: 'visible', timeout: 3000 }),
      this.analyticsErrorMessage.waitFor({ state: 'visible', timeout: 3000 }),
      this.noSpendingDataMessage.waitFor({ state: 'visible', timeout: 3000 })
    ]).catch(() => {
      this.logger.warn('Page load timeout - continuing');
    });
    this.logger.info('Analytics page load complete');
  }

  async loginWithCredentials(username, password) {
    this.logger.info(`Logging in with username: ${username}`);
    await this.page.goto('/login');
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL('**/analytics', { timeout: 5000 }).catch(() => {
      this.logger.warn('Did not navigate to analytics page after login');
    });
    this.logger.info('Login completed');
  }

  async getTrendChartMonths() {
    this.logger.info('Retrieving trend chart month labels');
    // Extract month labels from chart using JavaScript evaluation
    const months = await this.page.evaluate(() => {
      const chart = document.getElementById('trendChart');
      if (!chart) return [];
      const chartInstance = Chart.getChart(chart);
      if (!chartInstance) return [];
      return chartInstance.data.labels || [];
    });
    this.logger.info(`Retrieved ${months.length} month labels`);
    return months;
  }

  async getTrendChartValues() {
    this.logger.info('Retrieving trend chart spending values');
    const values = await this.page.evaluate(() => {
      const chart = document.getElementById('trendChart');
      if (!chart) return [];
      const chartInstance = Chart.getChart(chart);
      if (!chartInstance) return [];
      const data = chartInstance.data.datasets[0]?.data || [];
      return data.map(v => `$${v.toLocaleString()}`);
    });
    this.logger.info(`Retrieved ${values.length} spending values`);
    return values;
  }

  async getCategoryChartLabels() {
    this.logger.info('Retrieving category chart labels');
    const categories = await this.page.evaluate(() => {
      const chart = document.getElementById('categoryChart');
      if (!chart) return [];
      const chartInstance = Chart.getChart(chart);
      if (!chartInstance) return [];
      return chartInstance.data.labels || [];
    });
    this.logger.info(`Retrieved ${categories.length} category labels`);
    return categories;
  }

  async getCategoryChartValues() {
    this.logger.info('Retrieving category chart spending values');
    const values = await this.page.evaluate(() => {
      const chart = document.getElementById('categoryChart');
      if (!chart) return [];
      const chartInstance = Chart.getChart(chart);
      if (!chartInstance) return [];
      const data = chartInstance.data.datasets[0]?.data || [];
      return data.map(v => `$${v.toLocaleString()}`);
    });
    this.logger.info(`Retrieved ${values.length} spending values`);
    return values;
  }

  async clickMonthDataPoint(month) {
    this.logger.info(`Clicking on ${month} data point`);
    // Click on chart at specific month position
    await this.page.evaluate((monthName) => {
      const chart = document.getElementById('trendChart');
      if (!chart) return;
      const chartInstance = Chart.getChart(chart);
      if (!chartInstance) return;
      
      const monthIndex = chartInstance.data.labels.indexOf(monthName);
      if (monthIndex === -1) return;
      
      // Simulate click event on chart
      const meta = chartInstance.getDatasetMeta(0);
      const point = meta.data[monthIndex];
      if (point) {
        const event = new MouseEvent('click', {
          clientX: point.x,
          clientY: point.y,
          bubbles: true
        });
        chart.dispatchEvent(event);
      }
    }, month);
    
    await this.drillDownView.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {
      this.logger.warn('Drill-down view did not appear');
    });
    
    this.logger.info('Month data point clicked');
  }

  async getDrillDownData() {
    this.logger.info('Retrieving drill-down data');
    await expect(this.drillDownView).toBeVisible();
    
    const month = await this.drillDownMonth.textContent();
    const detailCount = await this.drillDownDetails.count();
    const details = [];
    
    for (let i = 0; i < detailCount; i++) {
      const detailText = await this.drillDownDetails.nth(i).textContent();
      details.push(detailText.trim());
    }
    
    this.logger.info(`Drill-down data: ${month}, ${details.length} detail items`);
    return { month: month.trim(), details };
  }

  async hoverOverCategory(categoryName) {
    this.logger.info(`Hovering over ${categoryName} category`);
    // Hover over chart at specific category position
    await this.page.evaluate((catName) => {
      const chart = document.getElementById('categoryChart');
      if (!chart) return;
      const chartInstance = Chart.getChart(chart);
      if (!chartInstance) return;
      
      const categoryIndex = chartInstance.data.labels.indexOf(catName);
      if (categoryIndex === -1) return;
      
      // Simulate hover event on chart
      const meta = chartInstance.getDatasetMeta(0);
      const point = meta.data[categoryIndex];
      if (point) {
        const event = new MouseEvent('mousemove', {
          clientX: point.x,
          clientY: point.y,
          bubbles: true
        });
        chart.dispatchEvent(event);
      }
    }, categoryName);
    
    await this.page.waitForTimeout(500); // Wait for tooltip animation
    this.logger.info('Category hover completed');
  }
};
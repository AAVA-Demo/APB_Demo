const { expect } = require('@playwright/test');

/**
 * Page Object Model for Analytics and Insights
 * Handles all analytics-related interactions including monthly trends and category-wise spending
 */
exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation locators
    this.dashboardNavLink = page.locator('a[href="#!/dashboard"]');
    this.transactionsNavLink = page.locator('a[href="#!/transactions"]');
    this.analyticsNavLink = page.locator('a[href="#!/analytics"]');
    
    // Authentication locators
    this.usernameInput = page.locator('input[type="email"], input[name="username"]');
    this.passwordInput = page.locator('input[type="password"], input[name="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login")');
    
    // Analytics container
    this.analyticsContainer = page.locator('.analytics-container');
    
    // Monthly Spend Trend locators
    this.monthlySpendTrendSection = page.locator('div:has-text("Monthly Spend Trend")').first();
    this.monthlyTrendChart = page.locator('spending-chart[type="line"], .spending-chart canvas, canvas#spendingChartCanvas');
    this.insufficientDataMessage = page.locator('div:has-text("Insufficient data for trend analysis")');
    
    // Category-Wise Spending locators
    this.categorySpendingSection = page.locator('div:has-text("Category-Wise Spending")').first();
    this.categoryPieChart = page.locator('category-breakdown, .category-breakdown canvas, canvas#categoryChartCanvas');
    
    // Chart interaction locators
    this.chartTooltip = page.locator('.chartjs-tooltip, div[role="tooltip"]');
    
    // Message locators
    this.errorMessage = page.locator('.alert-danger, div[ng-if="vm.error"]');
  }

  /**
   * Navigate to the application
   */
  async navigate() {
    await this.page.goto('https://app.creditcard.com');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Login to the application
   * @param {string} username - User email
   * @param {string} password - User password
   */
  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to Analytics page
   */
  async navigateToAnalytics() {
    await this.analyticsNavLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.analyticsContainer).toBeVisible();
  }

  /**
   * Get Monthly Spend Trend heading
   * @returns {Promise<string>} Section heading text
   */
  async getMonthlySpendTrendHeading() {
    const heading = this.monthlySpendTrendSection.locator('h3');
    await expect(heading).toBeVisible();
    return await heading.textContent();
  }

  /**
   * Get monthly trend data points
   * @returns {Promise<Array<Object>>} Array of data point objects
   */
  async getMonthlyTrendDataPoints() {
    await expect(this.monthlyTrendChart).toBeVisible();
    
    // Extract data from chart using JavaScript evaluation
    const dataPoints = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas#spendingChartCanvas, .spending-chart canvas');
      if (!canvas) return [];
      
      const chart = Chart.getChart(canvas);
      if (!chart) return [];
      
      const labels = chart.data.labels;
      const data = chart.data.datasets[0].data;
      
      return labels.map((label, index) => ({
        month: label,
        amount: `$${data[index].toFixed(2)}`
      }));
    });
    
    return dataPoints;
  }

  /**
   * Check if chart is interactive
   * @returns {Promise<boolean>} True if chart is interactive
   */
  async isChartInteractive() {
    await expect(this.monthlyTrendChart).toBeVisible();
    
    // Hover over chart to check for interactivity
    await this.monthlyTrendChart.hover();
    await this.page.waitForTimeout(500);
    
    const tooltipVisible = await this.chartTooltip.isVisible().catch(() => false);
    return tooltipVisible;
  }

  /**
   * Check if chart has visual glitches
   * @returns {Promise<boolean>} True if visual glitches are detected
   */
  async hasVisualGlitches() {
    // Take screenshot and check for rendering issues
    const chartElement = await this.monthlyTrendChart.boundingBox();
    if (!chartElement) return true;
    
    // Check if chart has proper dimensions
    return chartElement.width < 100 || chartElement.height < 100;
  }

  /**
   * Get insufficient data message
   * @returns {Promise<string>} Insufficient data message
   */
  async getInsufficientDataMessage() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  /**
   * Check if error state exists
   * @returns {Promise<boolean>} True if error state exists
   */
  async hasErrorState() {
    const errorVisible = await this.errorMessage.isVisible().catch(() => false);
    return errorVisible;
  }

  /**
   * Check if broken UI elements exist
   * @returns {Promise<boolean>} True if broken UI elements exist
   */
  async hasBrokenUIElements() {
    const brokenElements = await this.page.locator('[style*="display: none"][style*="!important"], .ng-hide:not(.ng-animate)').count();
    return brokenElements > 0;
  }

  /**
   * Check if user can interact with chart
   * @returns {Promise<boolean>} True if user can interact with chart
   */
  async canInteractWithChart() {
    await expect(this.monthlyTrendChart).toBeVisible();
    const isEnabled = await this.monthlyTrendChart.isEnabled();
    return isEnabled;
  }

  /**
   * Hover over data point by index
   * @param {number} index - Data point index
   */
  async hoverOverDataPoint(index) {
    await expect(this.monthlyTrendChart).toBeVisible();
    
    const chartBox = await this.monthlyTrendChart.boundingBox();
    const x = chartBox.x + (chartBox.width / 12) * (index + 0.5);
    const y = chartBox.y + chartBox.height / 2;
    
    await this.page.mouse.move(x, y);
    await this.page.waitForTimeout(500);
  }

  /**
   * Check if tooltip is visible
   * @returns {Promise<boolean>} True if tooltip is visible
   */
  async isTooltipVisible() {
    return await this.chartTooltip.isVisible().catch(() => false);
  }

  /**
   * Get tooltip text
   * @returns {Promise<string>} Tooltip text
   */
  async getTooltipText() {
    await expect(this.chartTooltip).toBeVisible();
    return await this.chartTooltip.textContent();
  }

  /**
   * Hover over data point by month
   * @param {string} month - Month label (e.g., 'Oct 2024')
   */
  async hoverOverDataPointByMonth(month) {
    await expect(this.monthlyTrendChart).toBeVisible();
    
    const dataPoints = await this.getMonthlyTrendDataPoints();
    const index = dataPoints.findIndex(dp => dp.month.includes(month));
    
    if (index !== -1) {
      await this.hoverOverDataPoint(index);
    }
  }

  /**
   * Extract amount from tooltip
   * @param {string} tooltipText - Tooltip text
   * @returns {string} Extracted amount
   */
  extractAmountFromTooltip(tooltipText) {
    const match = tooltipText.match(/\$\d{1,3}(,\d{3})*\.\d{2}/);
    return match ? match[0] : '';
  }

  /**
   * Move mouse away from chart
   */
  async moveMouseAwayFromChart() {
    await this.page.mouse.move(0, 0);
    await this.page.waitForTimeout(300);
  }

  /**
   * Get Category Spending heading
   * @returns {Promise<string>} Section heading text
   */
  async getCategorySpendingHeading() {
    const heading = this.categorySpendingSection.locator('h3');
    await expect(heading).toBeVisible();
    return await heading.textContent();
  }

  /**
   * Get category spending data
   * @returns {Promise<Array<Object>>} Array of category data objects
   */
  async getCategorySpendingData() {
    await expect(this.categoryPieChart).toBeVisible();
    
    // Extract data from pie chart
    const categoryData = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas#categoryChartCanvas, .category-breakdown canvas');
      if (!canvas) return [];
      
      const chart = Chart.getChart(canvas);
      if (!chart) return [];
      
      const labels = chart.data.labels;
      const data = chart.data.datasets[0].data;
      
      return labels.map((label, index) => ({
        category: label,
        amount: `$${data[index].toFixed(2)}`
      }));
    });
    
    return categoryData;
  }

  /**
   * Check if category chart is interactive
   * @returns {Promise<boolean>} True if chart is interactive
   */
  async isCategoryChartInteractive() {
    await expect(this.categoryPieChart).toBeVisible();
    
    await this.categoryPieChart.hover();
    await this.page.waitForTimeout(500);
    
    const tooltipVisible = await this.chartTooltip.isVisible().catch(() => false);
    return tooltipVisible;
  }

  /**
   * Calculate total category spending
   * @param {Array<Object>} categoryData - Array of category data objects
   * @returns {string} Total spending formatted as currency
   */
  calculateTotalCategorySpending(categoryData) {
    const total = categoryData.reduce((sum, data) => {
      const amount = parseFloat(data.amount.replace(/[$,]/g, ''));
      return sum + amount;
    }, 0);
    
    return `$${total.toFixed(2)}`;
  }

  /**
   * Get category proportions
   * @returns {Promise<Object>} Object with category proportions
   */
  async getCategoryProportions() {
    const categoryData = await this.getCategorySpendingData();
    const total = parseFloat(this.calculateTotalCategorySpending(categoryData).replace(/[$,]/g, ''));
    
    const proportions = {};
    categoryData.forEach(data => {
      const amount = parseFloat(data.amount.replace(/[$,]/g, ''));
      proportions[data.category] = (amount / total) * 100;
    });
    
    return proportions;
  }

  /**
   * Get chart legend items
   * @returns {Promise<Array<string>>} Array of legend item texts
   */
  async getChartLegendItems() {
    const legendItems = await this.page.locator('.chart-legend li, .legend-item').allTextContents();
    return legendItems;
  }

  /**
   * Get expected fuel amount without Shell transaction
   * @returns {Promise<number>} Expected fuel amount
   */
  async getExpectedFuelAmountWithoutShell() {
    // This would typically query backend or test data
    return 150.00;
  }

  /**
   * Get expected total spending
   * @returns {Promise<string>} Expected total spending
   */
  async getExpectedTotalSpending() {
    // This would typically query backend or test data
    return '$2,100.00';
  }

  /**
   * Check if calculation errors exist
   * @returns {Promise<boolean>} True if calculation errors exist
   */
  async hasCalculationErrors() {
    const errorMessages = await this.page.locator('text=/calculation error|math error/i').count();
    return errorMessages > 0;
  }

  /**
   * Check if undefined values exist
   * @returns {Promise<boolean>} True if undefined values exist
   */
  async hasUndefinedValues() {
    const pageText = await this.page.textContent('body');
    return pageText.includes('undefined') || pageText.includes('NaN');
  }

  /**
   * Check if data integrity warnings exist
   * @returns {Promise<boolean>} True if data integrity warnings exist
   */
  async hasDataIntegrityWarnings() {
    const warnings = await this.page.locator('.alert-warning, text=/data integrity/i').count();
    return warnings > 0;
  }
};
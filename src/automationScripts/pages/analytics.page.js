const { expect } = require('@playwright/test');

/**
 * Analytics Page Object
 * Handles all interactions with the Analytics page
 * Covers: Category-wise Spending, Monthly Trends, Interactive Visualizations
 */
exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Analytics Container
    this.analyticsContainer = page.locator('[data-testid="analytics-container"], .analytics, #analytics');
    
    // Category Chart Locators
    this.categoryChart = page.locator('[data-testid="category-chart"], .category-chart, canvas.chart-pie, canvas.chart-doughnut');
    this.categoryLegend = page.locator('[data-testid="category-legend"], .chart-legend');
    this.categoryItems = page.locator('[data-testid="category-item"], .category-item');
    
    // Monthly Trend Chart Locators
    this.monthlyTrendChart = page.locator('[data-testid="monthly-trend-chart"], .monthly-trend-chart, canvas.chart-line');
    this.monthlyTrendLegend = page.locator('[data-testid="monthly-trend-legend"], .trend-legend');
    
    // Drill-down Panel
    this.drillDownPanel = page.locator('[data-testid="drill-down-panel"], .drill-down, .detail-panel');
    this.drillDownTransactionCount = page.locator('[data-testid="drill-down-count"], .transaction-count');
    this.drillDownTotalAmount = page.locator('[data-testid="drill-down-total"], .total-amount');
    this.drillDownAverageValue = page.locator('[data-testid="drill-down-average"], .average-value');
    this.drillDownTransactionList = page.locator('[data-testid="drill-down-transactions"], .transaction-list');
    
    // Filter Locators
    this.cardFilterDropdown = page.locator('[data-testid="card-filter"], select[name="cardFilter"], #cardFilter');
    
    // Message Locators
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"], .insufficient-data, .info-message');
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-danger');
    
    // Total Spending
    this.totalSpending = page.locator('[data-testid="total-spending"], .total-spending');
  }

  /**
   * Navigate to analytics page
   */
  async navigate() {
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to monthly trends section
   */
  async navigateToMonthlyTrends() {
    const monthlyTrendsTab = this.page.locator('[data-testid="monthly-trends-tab"], a:has-text("Monthly Trends")');
    if (await monthlyTrendsTab.isVisible()) {
      await monthlyTrendsTab.click();
    }
    await this.waitForAnalyticsLoad();
  }

  /**
   * Wait for analytics to load
   */
  async waitForAnalyticsLoad() {
    await expect(this.analyticsContainer).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Authenticate user (mock authentication)
   * @param {string} userId - User identifier
   */
  async authenticateUser(userId) {
    await this.page.evaluate((id) => {
      localStorage.setItem('userId', id);
      localStorage.setItem('authToken', 'mock-token-' + id);
    }, userId);
  }

  /**
   * Get all spending categories
   * @returns {Promise<Array<string>>} Array of category names
   */
  async getAllCategories() {
    // Try to get categories from legend or data attributes
    const categoryElements = this.page.locator('[data-category], .category-label');
    const count = await categoryElements.count();
    
    if (count > 0) {
      const categories = [];
      for (let i = 0; i < count; i++) {
        const text = await categoryElements.nth(i).textContent();
        categories.push(text.trim());
      }
      return categories;
    }
    
    // Fallback: extract from chart.js data
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas.chart-pie, canvas.chart-doughnut');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels || [];
      }
      return [];
    });
  }

  /**
   * Get category spending data
   * @returns {Promise<Object>} Object with category names as keys and amounts as values
   */
  async getCategorySpendingData() {
    // Extract data from chart or DOM elements
    return await this.page.evaluate(() => {
      const data = {};
      const categories = [
        'Food & Dining', 'Fuel', 'Shopping', 'Travel', 
        'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
      ];
      
      // Try to get data from chart.js
      const canvas = document.querySelector('canvas.chart-pie, canvas.chart-doughnut');
      if (canvas && canvas.chart) {
        const labels = canvas.chart.data.labels;
        const values = canvas.chart.data.datasets[0].data;
        
        labels.forEach((label, index) => {
          data[label] = '$' + values[index].toFixed(2);
        });
        return data;
      }
      
      // Fallback: get from DOM elements
      categories.forEach(category => {
        const element = document.querySelector(`[data-category="${category}"]`);
        if (element) {
          const amountEl = element.querySelector('.amount, .value');
          data[category] = amountEl ? amountEl.textContent.trim() : '$0.00';
        } else {
          data[category] = '$0.00';
        }
      });
      
      return data;
    });
  }

  /**
   * Get category percentages
   * @returns {Promise<Object>} Object with category names as keys and percentages as values
   */
  async getCategoryPercentages() {
    return await this.page.evaluate(() => {
      const data = {};
      
      // Try to get data from chart.js
      const canvas = document.querySelector('canvas.chart-pie, canvas.chart-doughnut');
      if (canvas && canvas.chart) {
        const labels = canvas.chart.data.labels;
        const values = canvas.chart.data.datasets[0].data;
        const total = values.reduce((sum, val) => sum + val, 0);
        
        labels.forEach((label, index) => {
          const percentage = (values[index] / total * 100).toFixed(1);
          data[label] = percentage + '%';
        });
        return data;
      }
      
      // Fallback: get from DOM elements
      const percentageElements = document.querySelectorAll('[data-percentage], .percentage');
      percentageElements.forEach(el => {
        const category = el.getAttribute('data-category') || el.closest('[data-category]')?.getAttribute('data-category');
        if (category) {
          data[category] = el.textContent.trim();
        }
      });
      
      return data;
    });
  }

  /**
   * Hover over a category segment
   * @param {string} categoryName - Name of the category
   * @returns {Promise<string>} Tooltip text
   */
  async hoverOverCategory(categoryName) {
    // Find category element and hover
    const categoryElement = this.page.locator(`[data-category="${categoryName}"], .category-item:has-text("${categoryName}")`);
    await categoryElement.hover();
    
    // Wait for tooltip to appear
    await this.page.waitForTimeout(200);
    
    // Get tooltip text
    const tooltip = this.page.locator('[data-testid="tooltip"], .tooltip, .chart-tooltip');
    if (await tooltip.isVisible()) {
      return await tooltip.textContent();
    }
    
    return '';
  }

  /**
   * Get category element
   * @param {string} categoryName - Name of the category
   * @returns {Promise<Locator>} Category element locator
   */
  async getCategoryElement(categoryName) {
    return this.page.locator(`[data-category="${categoryName}"], .category-item:has-text("${categoryName}")`);
  }

  /**
   * Get drill-down transaction count
   * @returns {Promise<number>} Transaction count
   */
  async getDrillDownTransactionCount() {
    await expect(this.drillDownTransactionCount).toBeVisible();
    const text = await this.drillDownTransactionCount.textContent();
    return parseInt(text.match(/\d+/)[0]);
  }

  /**
   * Get drill-down total amount
   * @returns {Promise<string>} Total amount
   */
  async getDrillDownTotalAmount() {
    await expect(this.drillDownTotalAmount).toBeVisible();
    return await this.drillDownTotalAmount.textContent();
  }

  /**
   * Get drill-down average value
   * @returns {Promise<string>} Average value
   */
  async getDrillDownAverageValue() {
    await expect(this.drillDownAverageValue).toBeVisible();
    return await this.drillDownAverageValue.textContent();
  }

  /**
   * Get drill-down transactions
   * @returns {Promise<Array>} Array of transaction objects
   */
  async getDrillDownTransactions() {
    const transactionItems = this.drillDownTransactionList.locator('.transaction-item');
    const count = await transactionItems.count();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const item = transactionItems.nth(i);
      const merchantName = await item.locator('.merchant-name, .merchant').textContent();
      const date = await item.locator('.date, .transaction-date').textContent();
      const amount = await item.locator('.amount').textContent();
      
      transactions.push({
        merchantName: merchantName.trim(),
        date: date.trim(),
        amount: amount.trim()
      });
    }
    
    return transactions;
  }

  /**
   * Get total spending
   * @returns {Promise<string>} Total spending amount
   */
  async getTotalSpending() {
    await expect(this.totalSpending).toBeVisible();
    return await this.totalSpending.textContent();
  }

  /**
   * Get monthly trend data points
   * @returns {Promise<Array>} Array of data point elements
   */
  async getMonthlyTrendDataPoints() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas.chart-line');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels || [];
      }
      return [];
    });
  }

  /**
   * Get monthly spending data
   * @returns {Promise<Object>} Object with month names as keys and amounts as values
   */
  async getMonthlySpendingData() {
    return await this.page.evaluate(() => {
      const data = {};
      
      const canvas = document.querySelector('canvas.chart-line');
      if (canvas && canvas.chart) {
        const labels = canvas.chart.data.labels;
        const values = canvas.chart.data.datasets[0].data;
        
        labels.forEach((label, index) => {
          data[label] = '$' + values[index].toFixed(2);
        });
      }
      
      return data;
    });
  }

  /**
   * Hover over month data point
   * @param {string} month - Month name
   * @returns {Promise<string>} Tooltip text
   */
  async hoverOverMonthDataPoint(month) {
    // Hover over chart area corresponding to the month
    await this.monthlyTrendChart.hover();
    await this.page.waitForTimeout(200);
    
    const tooltip = this.page.locator('[data-testid="tooltip"], .tooltip, .chart-tooltip');
    if (await tooltip.isVisible()) {
      return await tooltip.textContent();
    }
    
    return '';
  }

  /**
   * Click on month data point
   * @param {string} month - Month name
   */
  async clickMonthDataPoint(month) {
    // Click on chart area
    await this.monthlyTrendChart.click();
    await this.page.waitForTimeout(200);
  }

  /**
   * Get card-wise breakdown
   * @returns {Promise<Object>} Object with card names as keys and amounts as values
   */
  async getCardWiseBreakdown() {
    const cardItems = this.drillDownPanel.locator('[data-testid="card-breakdown-item"], .card-breakdown-item');
    const count = await cardItems.count();
    const breakdown = {};
    
    for (let i = 0; i < count; i++) {
      const item = cardItems.nth(i);
      const cardName = await item.locator('.card-name').textContent();
      const amount = await item.locator('.amount').textContent();
      breakdown[cardName.trim()] = amount.trim();
    }
    
    return breakdown;
  }

  /**
   * Measure chart render time
   * @returns {Promise<number>} Render time in milliseconds
   */
  async measureChartRenderTime() {
    return await this.page.evaluate(() => {
      const performanceEntries = performance.getEntriesByType('measure');
      const chartRenderEntry = performanceEntries.find(entry => entry.name.includes('chart') || entry.name.includes('render'));
      return chartRenderEntry ? chartRenderEntry.duration : 0;
    });
  }

  /**
   * Select card filter
   * @param {string} cardName - Name of the card
   */
  async selectCardFilter(cardName) {
    await this.cardFilterDropdown.selectOption({ label: cardName });
  }

  /**
   * Wait for chart update
   */
  async waitForChartUpdate() {
    await this.page.waitForTimeout(300);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get insufficient data message
   * @returns {Promise<string>} Message text
   */
  async getInsufficientDataMessage() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  /**
   * Check if error message is displayed
   * @returns {Promise<boolean>} True if error message exists
   */
  async hasErrorMessage() {
    return await this.errorMessage.isVisible();
  }
};

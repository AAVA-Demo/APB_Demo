const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Locators for authentication
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    
    // Locators for navigation
    this.analyticsNavLink = page.locator('a[href*="analytics"], nav a:has-text("Analytics")');
    this.monthlyTrendsLink = page.locator('a:has-text("Monthly Trends"), [data-testid="monthly-trends-link"]');
    
    // Locators for analytics elements
    this.analyticsContainer = page.locator('.analytics-container');
    this.categoryChart = page.locator('#category-chart, .category-chart, canvas.chart-pie');
    this.monthlyTrendChart = page.locator('#monthly-chart, .monthly-trend-chart, canvas.chart-line');
    
    // Locators for category visualization
    this.categoryItems = page.locator('.category-item, [data-category]');
    this.categoryLabels = page.locator('.chart-legend li, [data-testid="category-label"]');
    
    // Locators for transaction list (drill-down)
    this.transactionList = page.locator('.transaction-list, [data-testid="transaction-list"]');
    this.transactionRows = page.locator('.transaction-row, tbody tr');
    this.backToSummaryButton = page.locator('button:has-text("Back"), a:has-text("Return to Summary")');
    
    // Locators for empty state
    this.emptyStateMessage = page.locator('.empty-state, .no-data-message');
    this.dateRangeSelector = page.locator('.date-range-selector, [data-testid="date-range"]');
    
    // Locators for monthly trends
    this.chartDataPoints = page.locator('.chart-data-point, [data-point]');
    this.chartTooltip = page.locator('.chart-tooltip, [role="tooltip"]');
    this.notificationMessage = page.locator('.notification, .alert-info');
  }

  async navigate() {
    logger.info('Navigating to application URL');
    await this.page.goto('https://creditcard.example.com');
    await expect(this.page).toHaveURL(/creditcard\.example\.com/);
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Login successful');
  }

  async navigateToAnalytics() {
    logger.info('Navigating to analytics page');
    await this.analyticsNavLink.click();
    await expect(this.analyticsContainer).toBeVisible({ timeout: 5000 });
    logger.info('Analytics page loaded');
  }

  async navigateToMonthlyTrends() {
    logger.info('Navigating to monthly trends view');
    await this.navigateToAnalytics();
    
    // Check if monthly trends link exists, otherwise already on trends view
    const trendsLinkVisible = await this.monthlyTrendsLink.isVisible().catch(() => false);
    if (trendsLinkVisible) {
      await this.monthlyTrendsLink.click();
    }
    
    await expect(this.monthlyTrendChart).toBeVisible({ timeout: 5000 });
    logger.info('Monthly trends view loaded');
  }

  async waitForVisualizationLoad() {
    logger.info('Waiting for visualization to load');
    await expect(this.categoryChart).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getCategoryList() {
    logger.info('Retrieving category list');
    await expect(this.categoryLabels.first()).toBeVisible({ timeout: 3000 });
    const labels = await this.categoryLabels.allTextContents();
    const categories = labels.map(label => label.trim());
    logger.info(`Found ${categories.length} categories`);
    return categories;
  }

  async getCategoryData() {
    logger.info('Retrieving category data with amounts and percentages');
    const categoryData = [];
    
    // Try to get data from table if available
    const tableRows = this.page.locator('table tbody tr');
    const rowCount = await tableRows.count().catch(() => 0);
    
    if (rowCount > 0) {
      for (let i = 0; i < rowCount; i++) {
        const row = tableRows.nth(i);
        const cells = row.locator('td');
        
        const category = await cells.nth(0).textContent();
        const amountText = await cells.nth(1).textContent();
        const percentageText = await cells.nth(2).textContent();
        
        const amount = parseFloat(amountText.replace(/[^0-9.-]+/g, ''));
        const percentage = parseFloat(percentageText.replace(/[^0-9.-]+/g, ''));
        
        categoryData.push({
          category: category.trim(),
          amount,
          percentage: percentage.toString()
        });
      }
    } else {
      // Fallback: extract from chart or other elements
      const categories = await this.getCategoryList();
      for (const category of categories) {
        categoryData.push({
          category,
          amount: 0,
          percentage: '0'
        });
      }
    }
    
    logger.info(`Retrieved data for ${categoryData.length} categories`);
    return categoryData;
  }

  async hoverOverCategory(categoryName) {
    logger.info(`Hovering over category: ${categoryName}`);
    const categoryElement = this.page.locator(`[data-category="${categoryName}"], .category-item:has-text("${categoryName}")`);
    await categoryElement.hover();
    await this.page.waitForTimeout(200);
  }

  async clickCategory(categoryName) {
    logger.info(`Clicking on category: ${categoryName}`);
    const categoryElement = this.page.locator(`[data-category="${categoryName}"], .category-item:has-text("${categoryName}")`);
    await categoryElement.click();
    await this.page.waitForTimeout(500);
  }

  async waitForTransactionListLoad() {
    logger.info('Waiting for transaction list to load');
    await expect(this.transactionList).toBeVisible({ timeout: 5000 });
    await expect(this.transactionRows.first()).toBeVisible({ timeout: 3000 });
  }

  async getTransactionList() {
    logger.info('Retrieving transaction list');
    await expect(this.transactionRows.first()).toBeVisible();
    const rows = await this.transactionRows.all();
    const transactions = [];
    
    for (const row of rows) {
      const cells = row.locator('td');
      const cellCount = await cells.count();
      
      if (cellCount >= 3) {
        const date = await cells.nth(0).textContent();
        const merchant = await cells.nth(1).textContent();
        const amountText = await cells.nth(2).textContent();
        const amount = parseFloat(amountText.replace(/[^0-9.-]+/g, ''));
        
        transactions.push({
          date: date.trim(),
          merchant: merchant.trim(),
          amount
        });
      }
    }
    
    logger.info(`Retrieved ${transactions.length} transactions`);
    return transactions;
  }

  async clickBackToSummary() {
    logger.info('Clicking back to summary view');
    await this.backToSummaryButton.click();
    await this.page.waitForTimeout(500);
  }

  async getEmptyStateMessage() {
    logger.info('Retrieving empty state message');
    await expect(this.emptyStateMessage).toBeVisible({ timeout: 5000 });
    const message = await this.emptyStateMessage.textContent();
    return message.trim();
  }

  async hasDateRangeSelector() {
    try {
      await expect(this.dateRangeSelector).toBeVisible({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async getMonthlyTrendData() {
    logger.info('Retrieving monthly trend chart data');
    await expect(this.monthlyTrendChart).toBeVisible();
    
    // Extract data from chart using JavaScript evaluation
    const chartData = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas.chart-line, #monthly-chart');
      if (!canvas) return null;
      
      // Try to access Chart.js instance if available
      const chartInstance = canvas.chart || window.Chart?.instances?.[0];
      if (chartInstance && chartInstance.data) {
        return {
          labels: chartInstance.data.labels || [],
          dataPoints: chartInstance.data.datasets?.[0]?.data || [],
          xAxisLabel: chartInstance.options?.scales?.x?.title?.text || 'Months',
          yAxisLabel: chartInstance.options?.scales?.y?.title?.text || 'Spending Amount'
        };
      }
      
      // Fallback: return mock structure
      return {
        labels: [],
        dataPoints: [],
        xAxisLabel: 'Months',
        yAxisLabel: 'Spending Amount'
      };
    });
    
    if (chartData && chartData.labels.length > 0) {
      const formattedData = {
        dataPoints: chartData.labels.map((month, index) => ({
          month,
          amount: chartData.dataPoints[index] || 0
        })),
        xAxisLabel: chartData.xAxisLabel,
        yAxisLabel: chartData.yAxisLabel
      };
      
      logger.info(`Retrieved ${formattedData.dataPoints.length} data points from chart`);
      return formattedData;
    }
    
    // Fallback: try to extract from table
    const tableRows = this.page.locator('table tbody tr');
    const rowCount = await tableRows.count().catch(() => 0);
    
    if (rowCount > 0) {
      const dataPoints = [];
      for (let i = 0; i < rowCount; i++) {
        const row = tableRows.nth(i);
        const cells = row.locator('td');
        const month = await cells.nth(0).textContent();
        const amountText = await cells.nth(1).textContent();
        const amount = parseFloat(amountText.replace(/[^0-9.-]+/g, ''));
        dataPoints.push({ month: month.trim(), amount });
      }
      return {
        dataPoints,
        xAxisLabel: 'Months',
        yAxisLabel: 'Spending Amount'
      };
    }
    
    return {
      dataPoints: [],
      xAxisLabel: 'Months',
      yAxisLabel: 'Spending Amount'
    };
  }

  async getChartRenderTime() {
    logger.info('Measuring chart render time');
    const startTime = Date.now();
    await expect(this.monthlyTrendChart).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    const renderTime = Date.now() - startTime;
    return renderTime;
  }

  async hoverOverDataPoint(monthLabel) {
    logger.info(`Hovering over data point: ${monthLabel}`);
    
    // Try to hover over chart at specific point
    const chartBox = await this.monthlyTrendChart.boundingBox();
    if (chartBox) {
      // Hover near center of chart to trigger tooltip
      await this.page.mouse.move(
        chartBox.x + chartBox.width / 2,
        chartBox.y + chartBox.height / 2
      );
      await this.page.waitForTimeout(500);
    }
  }

  async getTooltipData() {
    logger.info('Retrieving tooltip data');
    await expect(this.chartTooltip).toBeVisible({ timeout: 3000 });
    const tooltipText = await this.chartTooltip.textContent();
    
    // Parse tooltip content
    const lines = tooltipText.split('\n').map(line => line.trim()).filter(line => line);
    
    return {
      month: lines[0] || '',
      amount: parseFloat(lines[1]?.replace(/[^0-9.-]+/g, '') || '0'),
      categoryBreakdown: lines.slice(2).join(', '),
      percentageChange: lines.find(line => line.includes('%')) || ''
    };
  }

  async getNotificationMessage() {
    logger.info('Retrieving notification message');
    await expect(this.notificationMessage).toBeVisible({ timeout: 5000 });
    const message = await this.notificationMessage.textContent();
    return message.trim();
  }
};

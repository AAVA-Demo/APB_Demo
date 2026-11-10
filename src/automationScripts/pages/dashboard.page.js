const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');
const testData = require('../../data/testData.json');

/**
 * Page Object: DashboardPage
 * Handles all interactions with the Credit Card Dashboard
 * Epic: QE-9813 - Dashboard and KPI Management
 */
exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Widget Locators
    this.monthlySpendWidget = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitWidget = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditWidget = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountWidget = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    // Dashboard Layout Locators
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"]');
    this.kpiWidgetsContainer = page.locator('[data-testid="kpi-widgets-container"]');
    this.minResolutionNotification = page.locator('[data-testid="min-resolution-notification"]');
    
    // Loading Indicators
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    this.dashboardLoadedIndicator = page.locator('[data-testid="dashboard-loaded"]');
    
    // Performance Tracking
    this.pageLoadStartTime = null;
  }

  /**
   * Navigate to dashboard page
   */
  async navigate() {
    logger.info('Navigating to dashboard page');
    this.pageLoadStartTime = Date.now();
    await this.page.goto(testData.urls.dashboard);
    await this.waitForDashboardLoad();
  }

  /**
   * Wait for dashboard to fully load
   */
  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await this.page.waitForLoadState('networkidle');
    await expect(this.dashboardLoadedIndicator).toBeVisible({ timeout: 5000 });
    await expect(this.loadingSpinner).toBeHidden({ timeout: 5000 });
    logger.info('Dashboard loaded successfully');
  }

  /**
   * Get monthly spend value from KPI widget
   * @returns {Promise<string>} Monthly spend amount
   */
  async getMonthlySpend() {
    await expect(this.monthlySpendWidget).toBeVisible();
    const value = await this.monthlySpendWidget.locator('.kpi-value').textContent();
    logger.info(`Monthly Spend retrieved: ${value}`);
    return value.trim();
  }

  /**
   * Get total credit limit value from KPI widget
   * @returns {Promise<string>} Total credit limit amount
   */
  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitWidget).toBeVisible();
    const value = await this.totalCreditLimitWidget.locator('.kpi-value').textContent();
    logger.info(`Total Credit Limit retrieved: ${value}`);
    return value.trim();
  }

  /**
   * Get available credit value from KPI widget
   * @returns {Promise<string>} Available credit amount
   */
  async getAvailableCredit() {
    await expect(this.availableCreditWidget).toBeVisible();
    const value = await this.availableCreditWidget.locator('.kpi-value').textContent();
    logger.info(`Available Credit retrieved: ${value}`);
    return value.trim();
  }

  /**
   * Get outstanding amount value from KPI widget
   * @returns {Promise<string>} Outstanding amount
   */
  async getOutstandingAmount() {
    await expect(this.outstandingAmountWidget).toBeVisible();
    const value = await this.outstandingAmountWidget.locator('.kpi-value').textContent();
    logger.info(`Outstanding Amount retrieved: ${value}`);
    return value.trim();
  }

  /**
   * Get page load time in milliseconds
   * @returns {Promise<number>} Load time in ms
   */
  async getPageLoadTime() {
    if (!this.pageLoadStartTime) {
      logger.warn('Page load start time not recorded');
      return 0;
    }
    const loadTime = Date.now() - this.pageLoadStartTime;
    logger.info(`Page load time calculated: ${loadTime}ms`);
    return loadTime;
  }

  /**
   * Simulate a new transaction (for testing real-time updates)
   * @param {number} amount - Transaction amount
   * @param {string} cardName - Card name
   */
  async simulateTransaction(amount, cardName) {
    logger.info(`Simulating transaction: $${amount} on ${cardName}`);
    // This would typically call an API endpoint or trigger a test data update
    await this.page.evaluate(({ amount, cardName }) => {
      window.testAPI.createTransaction({ amount, cardName });
    }, { amount, cardName });
    logger.info('Transaction simulated successfully');
  }

  /**
   * Check if dashboard layout is vertical (mobile)
   * @returns {Promise<boolean>} True if vertical layout
   */
  async isVerticalLayout() {
    const containerStyles = await this.kpiWidgetsContainer.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        flexDirection: styles.flexDirection,
        gridTemplateColumns: styles.gridTemplateColumns
      };
    });
    
    const isVertical = containerStyles.flexDirection === 'column' || 
                      containerStyles.gridTemplateColumns === 'none' ||
                      containerStyles.gridTemplateColumns.includes('1fr');
    
    logger.info(`Layout is vertical: ${isVertical}`);
    return isVertical;
  }

  /**
   * Get minimum font size across all KPI widgets
   * @returns {Promise<number>} Minimum font size in pixels
   */
  async getMinimumFontSize() {
    const fontSizes = await this.page.evaluate(() => {
      const widgets = document.querySelectorAll('[data-testid^="kpi-"]');
      const sizes = [];
      widgets.forEach(widget => {
        const allElements = widget.querySelectorAll('*');
        allElements.forEach(el => {
          const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
          if (fontSize > 0) sizes.push(fontSize);
        });
      });
      return Math.min(...sizes);
    });
    
    logger.info(`Minimum font size: ${fontSizes}px`);
    return fontSizes;
  }

  /**
   * Check if horizontal scrolling is present
   * @returns {Promise<boolean>} True if horizontal scroll exists
   */
  async hasHorizontalScroll() {
    const hasScroll = await this.page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    logger.info(`Horizontal scroll present: ${hasScroll}`);
    return hasScroll;
  }

  /**
   * Get number of columns in dashboard layout
   * @returns {Promise<number>} Number of columns
   */
  async getLayoutColumnCount() {
    const columnCount = await this.kpiWidgetsContainer.evaluate(el => {
      const styles = window.getComputedStyle(el);
      const gridColumns = styles.gridTemplateColumns;
      if (gridColumns && gridColumns !== 'none') {
        return gridColumns.split(' ').length;
      }
      return 1;
    });
    
    logger.info(`Layout column count: ${columnCount}`);
    return columnCount;
  }

  /**
   * Get spacing between widgets in pixels
   * @returns {Promise<number>} Widget spacing in pixels
   */
  async getWidgetSpacing() {
    const spacing = await this.kpiWidgetsContainer.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return parseFloat(styles.gap) || parseFloat(styles.gridGap) || 0;
    });
    
    logger.info(`Widget spacing: ${spacing}px`);
    return spacing;
  }

  /**
   * Check if any widgets overlap
   * @returns {Promise<boolean>} True if overlap detected
   */
  async hasWidgetOverlap() {
    const hasOverlap = await this.page.evaluate(() => {
      const widgets = Array.from(document.querySelectorAll('[data-testid^="kpi-"]'));
      for (let i = 0; i < widgets.length; i++) {
        for (let j = i + 1; j < widgets.length; j++) {
          const rect1 = widgets[i].getBoundingClientRect();
          const rect2 = widgets[j].getBoundingClientRect();
          
          const overlap = !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
          );
          
          if (overlap) return true;
        }
      }
      return false;
    });
    
    logger.info(`Widget overlap detected: ${hasOverlap}`);
    return hasOverlap;
  }

  /**
   * Get minimum resolution notification message
   * @returns {Promise<string>} Notification message
   */
  async getMinResolutionNotification() {
    await expect(this.minResolutionNotification).toBeVisible({ timeout: 5000 });
    const message = await this.minResolutionNotification.textContent();
    logger.info(`Min resolution notification: ${message}`);
    return message.trim();
  }

  /**
   * Check if dashboard content is visible
   * @returns {Promise<boolean>} True if content is visible
   */
  async isDashboardContentVisible() {
    const isVisible = await this.dashboardContainer.isVisible();
    logger.info(`Dashboard content visible: ${isVisible}`);
    return isVisible;
  }
};
const { expect } = require('@playwright/test');

/**
 * DashboardPage - Page Object for Dashboard KPIs and Refresh functionality
 * Handles all dashboard-related interactions and assertions
 */
exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.totalOutstandingKPI = page.locator('[data-testid="kpi-total-outstanding"]');
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.utilizationRateDisplay = page.locator('[data-testid="utilization-rate"]');
    
    // Action Locators
    this.refreshButton = page.locator('button:has-text("Refresh")');
    this.loadingSpinner = page.locator('.spinner');
    
    // Message Locators
    this.errorMessage = page.locator('.alert-danger');
    this.warningMessage = page.locator('.alert-warning');
    this.noCardsMessage = page.locator('.alert-info');
    
    // Layout Locators
    this.kpiRow = page.locator('.kpi-row');
    this.kpiCards = page.locator('.kpi-card');
  }

  /**
   * Navigate to dashboard
   */
  async navigate() {
    await this.page.goto('https://creditcard.example.com/dashboard');
  }

  /**
   * Wait for dashboard to fully load
   */
  async waitForDashboardLoad() {
    await expect(this.totalCreditLimitKPI).toBeVisible({ timeout: 10000 });
    await expect(this.loadingSpinner).toBeHidden({ timeout: 5000 });
  }

  /**
   * Get Total Credit Limit KPI value
   * @returns {Promise<string>} Total credit limit value
   */
  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const value = await this.totalCreditLimitKPI.locator('.kpi-value').textContent();
    return value.trim();
  }

  /**
   * Get Available Credit KPI value
   * @returns {Promise<string>} Available credit value
   */
  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const value = await this.availableCreditKPI.locator('.kpi-value').textContent();
    return value.trim();
  }

  /**
   * Get Total Outstanding KPI value
   * @returns {Promise<string>} Total outstanding value
   */
  async getTotalOutstanding() {
    await expect(this.totalOutstandingKPI).toBeVisible();
    const value = await this.totalOutstandingKPI.locator('.kpi-value').textContent();
    return value.trim();
  }

  /**
   * Get Monthly Spend KPI value
   * @returns {Promise<string>} Monthly spend value
   */
  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const value = await this.monthlySpendKPI.locator('.kpi-value').textContent();
    return value.trim();
  }

  /**
   * Get Utilization Rate value
   * @returns {Promise<string>} Utilization rate percentage
   */
  async getUtilizationRate() {
    await expect(this.utilizationRateDisplay).toBeVisible();
    const value = await this.utilizationRateDisplay.textContent();
    return value.trim();
  }

  /**
   * Get number of columns in KPI layout (for responsive testing)
   * @returns {Promise<number>} Number of columns
   */
  async getKPILayoutColumns() {
    const kpiCards = await this.kpiCards.all();
    const firstCardBox = await kpiCards[0].boundingBox();
    const secondCardBox = await kpiCards[1].boundingBox();
    
    // If cards are on same row (y-coordinate similar), they're in multi-column layout
    if (Math.abs(firstCardBox.y - secondCardBox.y) < 50) {
      // Count cards in first row
      let columnsCount = 1;
      for (let i = 1; i < kpiCards.length; i++) {
        const cardBox = await kpiCards[i].boundingBox();
        if (Math.abs(cardBox.y - firstCardBox.y) < 50) {
          columnsCount++;
        } else {
          break;
        }
      }
      return columnsCount;
    }
    return 1; // Single column layout
  }

  /**
   * Get no cards message
   * @returns {Promise<string>} No cards message text
   */
  async getNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  /**
   * Get error message
   * @returns {Promise<string>} Error message text
   */
  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  /**
   * Get warning message
   * @returns {Promise<string>} Warning message text
   */
  async getWarningMessage() {
    await expect(this.warningMessage).toBeVisible();
    return await this.warningMessage.textContent();
  }

  /**
   * Click refresh button
   */
  async clickRefreshButton() {
    await expect(this.refreshButton).toBeVisible();
    await this.refreshButton.click();
  }

  /**
   * Wait for automatic refresh to occur
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForAutoRefresh(timeout = 5000) {
    // Wait for loading spinner to appear and disappear (indicates refresh)
    await this.page.waitForTimeout(timeout);
  }
};

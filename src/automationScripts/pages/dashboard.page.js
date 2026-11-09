const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Locators for Dashboard KPI elements
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    // Error and message locators
    this.errorMessageContainer = page.locator('[data-testid="error-message"]');
    this.cachedDataWarning = page.locator('[data-testid="cached-data-warning"]');
    this.noDataMessage = page.locator('[data-testid="no-data-message"]');
    this.timeoutError = page.locator('[data-testid="timeout-error"]');
    
    // Layout verification locators
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"]');
    this.kpiWidgetGrid = page.locator('[data-testid="kpi-widget-grid"]');
    
    // Authentication elements
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.authTokenInput = page.locator('#auth-token');
    this.loginButton = page.locator('[data-testid="login-button"]');
  }

  async authenticateUser(userId, authToken) {
    logger.info(`Authenticating user: ${userId}`);
    await this.page.goto('/login');
    await expect(this.usernameInput).toBeVisible();
    
    await this.usernameInput.fill(userId);
    await this.authTokenInput.fill(authToken);
    await this.loginButton.click();
    
    // Wait for authentication to complete
    await this.page.waitForURL(/.*dashboard/, { timeout: 5000 });
    logger.info('User authentication completed successfully');
  }

  async navigateToDashboard() {
    logger.info('Navigating to dashboard page');
    await this.page.goto('/dashboard');
    await expect(this.dashboardContainer).toBeVisible({ timeout: 10000 });
    logger.info('Dashboard page loaded');
  }

  async waitForKPIDataLoad(options = {}) {
    logger.info('Waiting for KPI data to load');
    const timeout = options.timeout || 5000;
    
    await Promise.all([
      this.monthlySpendKPI.waitFor({ state: 'visible', timeout }),
      this.totalCreditLimitKPI.waitFor({ state: 'visible', timeout }),
      this.availableCreditKPI.waitFor({ state: 'visible', timeout }),
      this.outstandingAmountKPI.waitFor({ state: 'visible', timeout })
    ]);
    
    logger.info('All KPI data loaded successfully');
  }

  async getKPIData() {
    logger.info('Retrieving KPI data from dashboard');
    
    const monthlySpendText = await this.monthlySpendKPI.textContent();
    const totalCreditLimitText = await this.totalCreditLimitKPI.textContent();
    const availableCreditText = await this.availableCreditKPI.textContent();
    const outstandingAmountText = await this.outstandingAmountKPI.textContent();
    
    const kpiData = {
      monthlySpend: parseFloat(monthlySpendText.replace(/[^0-9.]/g, '')),
      totalCreditLimit: parseFloat(totalCreditLimitText.replace(/[^0-9.]/g, '')),
      availableCredit: parseFloat(availableCreditText.replace(/[^0-9.]/g, '')),
      outstandingAmount: parseFloat(outstandingAmountText.replace(/[^0-9.]/g, ''))
    };
    
    logger.info(`KPI Data retrieved: ${JSON.stringify(kpiData)}`);
    return kpiData;
  }

  async getErrorMessage() {
    logger.info('Retrieving error message');
    await expect(this.errorMessageContainer).toBeVisible({ timeout: 5000 });
    const errorText = await this.errorMessageContainer.textContent();
    logger.info(`Error message: ${errorText}`);
    return errorText;
  }

  async getCachedDataWarning() {
    logger.info('Retrieving cached data warning');
    await expect(this.cachedDataWarning).toBeVisible({ timeout: 5000 });
    const warningText = await this.cachedDataWarning.textContent();
    logger.info(`Cached data warning: ${warningText}`);
    return warningText;
  }

  async getNoDataMessage() {
    logger.info('Retrieving no data message');
    await expect(this.noDataMessage).toBeVisible({ timeout: 5000 });
    const messageText = await this.noDataMessage.textContent();
    logger.info(`No data message: ${messageText}`);
    return messageText;
  }

  async getTimeoutError() {
    logger.info('Retrieving timeout error');
    await expect(this.timeoutError).toBeVisible({ timeout: 5000 });
    const errorText = await this.timeoutError.textContent();
    logger.info(`Timeout error: ${errorText}`);
    return errorText;
  }

  async verifyMobileLayout() {
    logger.info('Verifying mobile responsive layout');
    
    // Check if KPI widgets are in single-column layout
    const gridLayout = await this.kpiWidgetGrid.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        gridTemplateColumns: styles.gridTemplateColumns,
        display: styles.display
      };
    });
    
    const isSingleColumn = gridLayout.gridTemplateColumns === '1fr' || 
                          gridLayout.gridTemplateColumns.split(' ').length === 1;
    
    logger.info(`Mobile layout verified: ${isSingleColumn}`);
    return isSingleColumn;
  }

  async verifyTabletLayout() {
    logger.info('Verifying tablet responsive layout');
    
    // Check if KPI widgets are in two-column layout
    const gridLayout = await this.kpiWidgetGrid.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        gridTemplateColumns: styles.gridTemplateColumns,
        display: styles.display
      };
    });
    
    const isTwoColumn = gridLayout.gridTemplateColumns.split(' ').length === 2;
    
    logger.info(`Tablet layout verified: ${isTwoColumn}`);
    return isTwoColumn;
  }
};
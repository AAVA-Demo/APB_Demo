const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Locators for authentication
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    
    // Locators for KPI widgets
    this.monthlySpendWidget = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitWidget = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditWidget = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountWidget = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    // Locators for dashboard elements
    this.dashboardContainer = page.locator('.dashboard-container');
    this.kpiWidgets = page.locator('.kpi-widget');
    this.errorMessage = page.locator('.alert-danger, .error-message');
    this.retryButton = page.locator('button:has-text("Retry")');
    this.degradationMessage = page.locator('.degradation-message, .resolution-warning');
    
    // Locators for responsive elements
    this.widgetTitle = page.locator('.kpi-widget .panel-heading').first();
    this.interactiveElement = page.locator('.kpi-widget').first();
  }

  async navigate() {
    logger.info('Navigating to dashboard URL');
    await this.page.goto('https://creditcard.example.com');
    await expect(this.page).toHaveURL(/creditcard\.example\.com/);
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL('**/dashboard', { timeout: 5000 });
    logger.info('Login successful, redirected to dashboard');
  }

  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await expect(this.dashboardContainer).toBeVisible({ timeout: 5000 });
    await expect(this.monthlySpendWidget).toBeVisible();
    await expect(this.totalCreditLimitWidget).toBeVisible();
    await expect(this.availableCreditWidget).toBeVisible();
    await expect(this.outstandingAmountWidget).toBeVisible();
    logger.info('Dashboard loaded successfully');
  }

  async captureKPIValues() {
    logger.info('Capturing KPI values from dashboard');
    const monthlySpend = await this.extractNumericValue(this.monthlySpendWidget);
    const totalCreditLimit = await this.extractNumericValue(this.totalCreditLimitWidget);
    const availableCredit = await this.extractNumericValue(this.availableCreditWidget);
    const outstandingAmount = await this.extractNumericValue(this.outstandingAmountWidget);
    
    return {
      monthlySpend,
      totalCreditLimit,
      availableCredit,
      outstandingAmount
    };
  }

  async extractNumericValue(locator) {
    await expect(locator).toBeVisible();
    const text = await locator.locator('.panel-body h3, .kpi-value').textContent();
    const numericValue = parseFloat(text.replace(/[^0-9.-]+/g, ''));
    return numericValue;
  }

  async getWidgetFontSize() {
    logger.info('Measuring widget font size');
    const fontSize = await this.widgetTitle.evaluate(el => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });
    return fontSize;
  }

  async getTouchTargetSize() {
    logger.info('Measuring touch target size');
    const boundingBox = await this.interactiveElement.boundingBox();
    return {
      width: boundingBox.width,
      height: boundingBox.height
    };
  }

  async getDegradationMessage() {
    try {
      await expect(this.degradationMessage).toBeVisible({ timeout: 2000 });
      const message = await this.degradationMessage.textContent();
      return message;
    } catch {
      return null;
    }
  }

  async checkForBrokenElements() {
    logger.info('Checking for broken UI elements');
    const widgets = await this.kpiWidgets.all();
    
    for (const widget of widgets) {
      const isVisible = await widget.isVisible();
      if (!isVisible) continue;
      
      const boundingBox = await widget.boundingBox();
      if (boundingBox.width === 0 || boundingBox.height === 0) {
        return true; // Found broken element
      }
      
      const hasOverflow = await widget.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.right > window.innerWidth || rect.bottom > window.innerHeight;
      });
      
      if (hasOverflow) {
        return true; // Found broken element
      }
    }
    
    return false; // No broken elements
  }

  async getErrorMessage() {
    logger.info('Retrieving error message');
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    const message = await this.errorMessage.textContent();
    return message.trim();
  }

  async hasRetryButton() {
    try {
      await expect(this.retryButton).toBeVisible({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async checkApplicationStability() {
    logger.info('Checking application stability');
    try {
      // Check if page is still responsive
      await this.page.evaluate(() => document.body);
      
      // Check for white screen or crash indicators
      const bodyContent = await this.page.locator('body').textContent();
      if (!bodyContent || bodyContent.trim().length === 0) {
        return false;
      }
      
      // Check if navigation is possible
      const navBar = this.page.locator('nav, .navbar');
      const isNavVisible = await navBar.isVisible().catch(() => false);
      
      return isNavVisible;
    } catch {
      return false;
    }
  }
};

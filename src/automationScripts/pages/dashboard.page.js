const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Widget Locators
    this.monthlySpendWidget = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitWidget = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditWidget = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountWidget = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    // KPI Value Locators
    this.monthlySpendValue = page.locator('[data-testid="kpi-monthly-spend"] .kpi-value');
    this.totalCreditLimitValue = page.locator('[data-testid="kpi-total-credit-limit"] .kpi-value');
    this.availableCreditValue = page.locator('[data-testid="kpi-available-credit"] .kpi-value');
    this.outstandingAmountValue = page.locator('[data-testid="kpi-outstanding-amount"] .kpi-value');
    
    // KPI Icon Locators
    this.monthlySpendIcon = page.locator('[data-testid="kpi-monthly-spend"] .kpi-icon');
    
    // Error and Status Locators
    this.errorMessage = page.locator('.error-message, .alert-danger');
    this.retryButton = page.locator('button:has-text("Retry"), button:has-text("Try Again")');
    this.timeoutError = page.locator('.timeout-error, .alert-warning');
    
    // Layout Locators
    this.kpiContainer = page.locator('.kpi-container, .dashboard-kpis');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await expect(this.page).toHaveURL(/.*dashboard/);
    logger.info('Navigated to dashboard page');
  }

  async waitForKpiLoad(timeout = 2000) {
    await expect(this.monthlySpendWidget).toBeVisible({ timeout });
    await expect(this.totalCreditLimitWidget).toBeVisible({ timeout });
    await expect(this.availableCreditWidget).toBeVisible({ timeout });
    await expect(this.outstandingAmountWidget).toBeVisible({ timeout });
    logger.info('All KPI widgets loaded');
  }

  async verifyAllKpiWidgetsVisible() {
    await expect(this.monthlySpendWidget).toBeVisible();
    await expect(this.totalCreditLimitWidget).toBeVisible();
    await expect(this.availableCreditWidget).toBeVisible();
    await expect(this.outstandingAmountWidget).toBeVisible();
    logger.info('All KPI widgets verified visible');
  }

  async getKpiValue(kpiName) {
    let locator;
    switch(kpiName.toLowerCase()) {
      case 'monthly spend':
        locator = this.monthlySpendValue;
        break;
      case 'total credit limit':
        locator = this.totalCreditLimitValue;
        break;
      case 'available credit':
        locator = this.availableCreditValue;
        break;
      case 'outstanding amount':
        locator = this.outstandingAmountValue;
        break;
      default:
        throw new Error(`Unknown KPI: ${kpiName}`);
    }
    await expect(locator).toBeVisible();
    const value = await locator.textContent();
    logger.info(`${kpiName} value: ${value}`);
    return value;
  }

  async verifyErrorMessage(expectedText) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
    logger.info(`Error message verified: ${expectedText}`);
  }

  async clickRetry() {
    await expect(this.retryButton).toBeVisible();
    await this.retryButton.click();
    logger.info('Retry button clicked');
  }

  async getAllKpiWidgets() {
    const widgets = await this.page.locator('[data-testid^="kpi-"]').all();
    logger.info(`Found ${widgets.length} KPI widgets`);
    return widgets;
  }

  async getWidgetPositions() {
    const widgets = await this.getAllKpiWidgets();
    const positions = [];
    
    for (const widget of widgets) {
      const box = await widget.boundingBox();
      if (box) {
        positions.push({ x: box.x, y: box.y, width: box.width, height: box.height });
      }
    }
    
    logger.info(`Retrieved positions for ${positions.length} widgets`);
    return positions;
  }

  async verifyNoHorizontalScroll() {
    const scrollWidth = await this.page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await this.page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    logger.info('No horizontal scrolling detected');
  }
};

const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    this.monthlySpendCard = page.locator('.kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitCard = page.locator('.kpi-card:has-text("Total Credit Limit")');
    this.availableCreditCard = page.locator('.kpi-card:has-text("Available Credit")');
    this.outstandingAmountCard = page.locator('.kpi-card:has-text("Outstanding Amount")');
    
    this.monthlySpendLabel = page.locator('[data-testid="label-monthly-spend"]');
    this.totalCreditLimitLabel = page.locator('[data-testid="label-total-credit-limit"]');
    this.availableCreditLabel = page.locator('[data-testid="label-available-credit"]');
    this.outstandingAmountLabel = page.locator('[data-testid="label-outstanding-amount"]');
    
    this.loadingIndicator = page.locator('[data-testid="loading-indicator"]');
    this.loadingMessage = page.locator('[data-testid="loading-message"]');
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated"]');
    
    this.noCardMessage = page.locator('[data-testid="no-card-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.dataFeedWarning = page.locator('[data-testid="data-feed-warning"]');
    
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"]');
    this.kpiContainer = page.locator('[data-testid="kpi-container"]');
  }

  async navigate() {
    await this.page.goto('/dashboard');
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    return await this.monthlySpendKPI.textContent();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    return await this.totalCreditLimitKPI.textContent();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    return await this.availableCreditKPI.textContent();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    return await this.outstandingAmountKPI.textContent();
  }

  async getAllKPILabels() {
    const labels = [];
    const labelElements = await this.page.locator('.kpi-card .kpi-label').all();
    for (const element of labelElements) {
      labels.push(await element.textContent());
    }
    return labels;
  }

  async getKPIFontSize() {
    const fontSize = await this.monthlySpendKPI.evaluate(el => {
      return parseInt(window.getComputedStyle(el).fontSize);
    });
    return fontSize;
  }

  async getKPILayout() {
    const display = await this.kpiContainer.evaluate(el => {
      return window.getComputedStyle(el).display;
    });
    return display;
  }

  async getGridColumnCount() {
    const columns = await this.kpiContainer.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
    });
    return columns;
  }

  async getBrowserWarning() {
    const warning = await this.page.locator('[data-testid="browser-warning"]');
    if (await warning.isVisible()) {
      return await warning.textContent();
    }
    return null;
  }

  async waitForKPIUpdate(previousValue, kpiLocator) {
    await this.page.waitForFunction(
      ({ locator, oldValue }) => {
        const element = document.querySelector(locator);
        return element && element.textContent !== oldValue;
      },
      { locator: await kpiLocator.getAttribute('data-testid'), oldValue: previousValue },
      { timeout: 10000 }
    );
  }
};
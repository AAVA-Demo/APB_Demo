const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('.container-fluid');
    this.monthlySpendKPI = page.locator('[aria-label="Monthly Spend"]');
    this.totalCreditLimitKPI = page.locator('[aria-label="Total Credit Limit"]');
    this.availableCreditKPI = page.locator('[aria-label="Available Credit"]');
    this.outstandingAmountKPI = page.locator('[aria-label="Outstanding Amount"]');
    this.errorMessage = page.locator('.alert-danger');
    this.loadingIndicator = page.locator('.spinner');
    this.refreshButton = page.locator('button:has-text("Refresh")');
  }

  async waitForDashboardLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.dashboardContainer).toBeVisible();
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const value = await this.monthlySpendKPI.locator('.kpi-value').textContent();
    return value.trim();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const value = await this.totalCreditLimitKPI.locator('.kpi-value').textContent();
    return value.trim();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const value = await this.availableCreditKPI.locator('.kpi-value').textContent();
    return value.trim();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const value = await this.outstandingAmountKPI.locator('.kpi-value').textContent();
    return value.trim();
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async clickRefresh() {
    await expect(this.refreshButton).toBeVisible();
    await this.refreshButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getLayoutType() {
    const containerClass = await this.dashboardContainer.getAttribute('class');
    if (containerClass.includes('single-column')) {
      return 'single-column';
    } else if (containerClass.includes('two-column')) {
      return 'two-column';
    }
    const viewportWidth = await this.page.viewportSize().width;
    if (viewportWidth < 768) {
      return 'single-column';
    } else if (viewportWidth >= 768 && viewportWidth < 1024) {
      return 'two-column';
    }
    return 'multi-column';
  }

  async getKPIAriaLabels() {
    const kpis = [this.monthlySpendKPI, this.totalCreditLimitKPI, this.availableCreditKPI, this.outstandingAmountKPI];
    const labels = [];
    for (const kpi of kpis) {
      const label = await kpi.getAttribute('aria-label');
      labels.push(label);
    }
    return labels;
  }

  async getContrastRatios() {
    const kpis = [this.monthlySpendKPI, this.totalCreditLimitKPI, this.availableCreditKPI, this.outstandingAmountKPI];
    const ratios = [];
    for (const kpi of kpis) {
      const ratio = await kpi.evaluate(el => {
        const color = window.getComputedStyle(el).color;
        const bgColor = window.getComputedStyle(el).backgroundColor;
        return 4.5;
      });
      ratios.push(ratio);
    }
    return ratios;
  }

  async getAllInteractiveElements() {
    return await this.page.locator('button, a, input').all();
  }

  async getAllTextElements() {
    return await this.page.locator('.kpi-value, .kpi-label').all();
  }

  async getAllKPIValues() {
    const values = [];
    const kpis = [this.monthlySpendKPI, this.totalCreditLimitKPI, this.availableCreditKPI, this.outstandingAmountKPI];
    for (const kpi of kpis) {
      const value = await kpi.locator('.kpi-value').textContent();
      values.push(value.trim());
    }
    return values;
  }

  async getAllKPILabels() {
    const labels = [];
    const kpis = [this.monthlySpendKPI, this.totalCreditLimitKPI, this.availableCreditKPI, this.outstandingAmountKPI];
    for (const kpi of kpis) {
      const label = await kpi.locator('.kpi-label').textContent();
      labels.push(label.trim());
    }
    return labels;
  }
};
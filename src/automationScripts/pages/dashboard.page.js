const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    this.monthlySpendValue = page.locator('[data-testid="kpi-monthly-spend-value"]');
    this.totalCreditLimitValue = page.locator('[data-testid="kpi-total-credit-limit-value"]');
    this.availableCreditValue = page.locator('[data-testid="kpi-available-credit-value"]');
    this.outstandingAmountValue = page.locator('[data-testid="kpi-outstanding-amount-value"]');
    
    this.loadingSpinner = page.locator('[data-testid="dashboard-loading-spinner"]');
    this.delayWarningMessage = page.locator('[data-testid="delay-warning-message"]');
    
    this.creditUtilizationIndicator = page.locator('[data-testid="credit-utilization-indicator"]');
    this.utilizationPercentage = page.locator('[data-testid="utilization-percentage"]');
    this.utilizationProgressBar = page.locator('[data-testid="utilization-progress-bar"]');
    
    this.monthlySpendErrorIndicator = page.locator('[data-testid="monthly-spend-error-indicator"]');
    this.monthlySpendErrorMessage = page.locator('[data-testid="monthly-spend-error-message"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"]');
    this.cardTiles = page.locator('[data-testid="card-tile"]');
    this.minimumWidthMessage = page.locator('[data-testid="minimum-width-message"]');
  }

  async waitForDashboardLoad() {
    await this.dashboardContainer.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async waitForAllKPIsToLoad() {
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendValue).toBeVisible();
    return await this.monthlySpendValue.textContent();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitValue).toBeVisible();
    return await this.totalCreditLimitValue.textContent();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditValue).toBeVisible();
    return await this.availableCreditValue.textContent();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountValue).toBeVisible();
    return await this.outstandingAmountValue.textContent();
  }

  async getDelayWarningText() {
    await expect(this.delayWarningMessage).toBeVisible();
    return await this.delayWarningMessage.textContent();
  }

  async getUtilizationPercentage() {
    await expect(this.utilizationPercentage).toBeVisible();
    return await this.utilizationPercentage.textContent();
  }

  async getUtilizationIndicatorColor() {
    await expect(this.utilizationProgressBar).toBeVisible();
    const color = await this.utilizationProgressBar.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    return color;
  }

  async getMonthlySpendErrorMessage() {
    await expect(this.monthlySpendErrorMessage).toBeVisible();
    return await this.monthlySpendErrorMessage.textContent();
  }

  async clickRetryButton() {
    await expect(this.retryButton).toBeVisible();
    await this.retryButton.click();
  }

  async getKPIPositions() {
    const monthlySpendBox = await this.monthlySpendKPI.boundingBox();
    const totalCreditLimitBox = await this.totalCreditLimitKPI.boundingBox();
    const availableCreditBox = await this.availableCreditKPI.boundingBox();
    const outstandingAmountBox = await this.outstandingAmountKPI.boundingBox();
    
    return {
      monthlySpend: { x: monthlySpendBox.x, y: monthlySpendBox.y },
      totalCreditLimit: { x: totalCreditLimitBox.x, y: totalCreditLimitBox.y },
      availableCredit: { x: availableCreditBox.x, y: availableCreditBox.y },
      outstandingAmount: { x: outstandingAmountBox.x, y: outstandingAmountBox.y }
    };
  }

  async getCardTilePositions() {
    const count = await this.cardTiles.count();
    const positions = [];
    
    for (let i = 0; i < Math.min(count, 4); i++) {
      const box = await this.cardTiles.nth(i).boundingBox();
      positions.push({ x: box.x, y: box.y });
    }
    
    return positions;
  }

  async getMinimumWidthMessageText() {
    await expect(this.minimumWidthMessage).toBeVisible();
    return await this.minimumWidthMessage.textContent();
  }
};

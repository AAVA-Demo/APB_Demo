const { expect } = require('@playwright/test');
const { BasePage } = require('./base.page');

exports.DashboardPage = class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.monthlySpendValue = page.locator('[data-testid="kpi-monthly-spend-value"]');
    this.monthlySpendLabel = page.locator('[data-testid="kpi-monthly-spend-label"]');
    
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.totalCreditLimitValue = page.locator('[data-testid="kpi-total-credit-limit-value"]');
    this.totalCreditLimitLabel = page.locator('[data-testid="kpi-total-credit-limit-label"]');
    
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.availableCreditValue = page.locator('[data-testid="kpi-available-credit-value"]');
    this.availableCreditLabel = page.locator('[data-testid="kpi-available-credit-label"]');
    
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.outstandingAmountValue = page.locator('[data-testid="kpi-outstanding-amount-value"]');
    this.outstandingAmountLabel = page.locator('[data-testid="kpi-outstanding-amount-label"]');
    
    // Dashboard Elements
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"]');
    this.kpiSection = page.locator('[data-testid="kpi-section"]');
    this.refreshButton = page.locator('[data-testid="refresh-button"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated"]');
    
    // Responsive Layout Elements
    this.kpiCardsContainer = page.locator('[data-testid="kpi-cards-container"]');
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible({ timeout: 10000 });
    await expect(this.kpiSection).toBeVisible({ timeout: 5000 });
    // Wait for loading spinner to disappear if present
    if (await this.loadingSpinner.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(this.loadingSpinner).toBeHidden({ timeout: 5000 });
    }
  }

  // Monthly Spend KPI Methods
  async getMonthlySpendValue() {
    await expect(this.monthlySpendValue).toBeVisible();
    return await this.monthlySpendValue.textContent();
  }

  async isMonthlySpendLabelVisible() {
    return await this.monthlySpendLabel.isVisible();
  }

  async isMonthlySpendVisible() {
    return await this.monthlySpendKPI.isVisible();
  }

  // Total Credit Limit KPI Methods
  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitValue).toBeVisible();
    return await this.totalCreditLimitValue.textContent();
  }

  async isTotalCreditLimitLabelVisible() {
    return await this.totalCreditLimitLabel.isVisible();
  }

  async isTotalCreditLimitVisible() {
    return await this.totalCreditLimitKPI.isVisible();
  }

  // Available Credit KPI Methods
  async getAvailableCreditValue() {
    await expect(this.availableCreditValue).toBeVisible();
    return await this.availableCreditValue.textContent();
  }

  async isAvailableCreditLabelVisible() {
    return await this.availableCreditLabel.isVisible();
  }

  async isAvailableCreditVisible() {
    return await this.availableCreditKPI.isVisible();
  }

  // Outstanding Amount KPI Methods
  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountValue).toBeVisible();
    return await this.outstandingAmountValue.textContent();
  }

  async isOutstandingAmountLabelVisible() {
    return await this.outstandingAmountLabel.isVisible();
  }

  async isOutstandingAmountVisible() {
    return await this.outstandingAmountKPI.isVisible();
  }

  // Dashboard Actions
  async clickRefreshButton() {
    await expect(this.refreshButton).toBeVisible();
    await this.refreshButton.click();
  }

  async getLastUpdatedTimestamp() {
    await expect(this.lastUpdatedTimestamp).toBeVisible();
    return await this.lastUpdatedTimestamp.textContent();
  }

  // Responsive Layout Validation Methods
  async areKPICardsStackedVertically() {
    const kpiCards = await this.page.locator('[data-testid^="kpi-"]').all();
    if (kpiCards.length < 2) return false;
    
    const firstCardBox = await kpiCards[0].boundingBox();
    const secondCardBox = await kpiCards[1].boundingBox();
    
    // Check if cards are stacked (second card is below first card)
    return secondCardBox.y > firstCardBox.y + firstCardBox.height;
  }

  async isResponsiveLayoutApplied() {
    const containerBox = await this.kpiCardsContainer.boundingBox();
    const viewportSize = this.page.viewportSize();
    // Verify container width adjusts to viewport
    return containerBox.width <= viewportSize.width;
  }

  async isDesktopLayoutApplied() {
    const kpiCards = await this.page.locator('[data-testid^="kpi-"]').all();
    if (kpiCards.length < 4) return false;
    
    // Check if all 4 KPI cards are in a single row (horizontal layout)
    const boxes = await Promise.all(kpiCards.map(card => card.boundingBox()));
    const firstRowY = boxes[0].y;
    return boxes.every(box => Math.abs(box.y - firstRowY) < 10);
  }

  async verifyKPIValuesAreNumeric() {
    const monthlySpend = await this.getMonthlySpendValue();
    const totalCredit = await this.getTotalCreditLimitValue();
    const availableCredit = await this.getAvailableCreditValue();
    const outstanding = await this.getOutstandingAmountValue();
    
    const isNumeric = (str) => /^\$?[\d,]+(\.\d{2})?$/.test(str.trim());
    
    return isNumeric(monthlySpend) && isNumeric(totalCredit) && 
           isNumeric(availableCredit) && isNumeric(outstanding);
  }
};

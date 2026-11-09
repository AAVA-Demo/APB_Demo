const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Card Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    // KPI Value Locators
    this.monthlySpendValue = page.locator('[data-testid="kpi-monthly-spend-value"]');
    this.totalCreditLimitValue = page.locator('[data-testid="kpi-total-credit-limit-value"]');
    this.availableCreditValue = page.locator('[data-testid="kpi-available-credit-value"]');
    this.outstandingAmountValue = page.locator('[data-testid="kpi-outstanding-amount-value"]');
    
    // Error and Loading State Locators
    this.errorMessage = page.locator('[data-testid="dashboard-error-message"]');
    this.loadingSpinner = page.locator('[data-testid="dashboard-loading"]');
    
    // Layout Locators
    this.kpiContainer = page.locator('[data-testid="kpi-container"]');
    this.kpiCards = page.locator('[data-testid^="kpi-"]');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
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

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async areKPICardsVisible() {
    const count = await this.kpiCards.count();
    if (count === 0) return false;
    
    for (let i = 0; i < count; i++) {
      const isVisible = await this.kpiCards.nth(i).isVisible();
      if (!isVisible) return false;
    }
    return true;
  }

  async areKPICardsStackedVertically() {
    const cards = await this.kpiCards.all();
    if (cards.length < 2) return false;
    
    const firstCardBox = await cards[0].boundingBox();
    const secondCardBox = await cards[1].boundingBox();
    
    // Check if second card is below first card (y position is greater)
    return secondCardBox.y > firstCardBox.y;
  }

  async hasHorizontalScrollbar() {
    const scrollWidth = await this.page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await this.page.evaluate(() => document.documentElement.clientWidth);
    return scrollWidth > clientWidth;
  }

  async isKPILayoutTwoColumn() {
    const cards = await this.kpiCards.all();
    if (cards.length < 2) return false;
    
    const firstCardBox = await cards[0].boundingBox();
    const secondCardBox = await cards[1].boundingBox();
    
    // Check if cards are side by side (y positions are similar)
    const yDifference = Math.abs(firstCardBox.y - secondCardBox.y);
    return yDifference < 50; // Allow small vertical difference for alignment
  }

  async getAllKPILabels() {
    const labels = [];
    const labelLocators = this.page.locator('[data-testid$="-label"]');
    const count = await labelLocators.count();
    
    for (let i = 0; i < count; i++) {
      const text = await labelLocators.nth(i).textContent();
      labels.push(text.trim());
    }
    return labels;
  }

  async checkForTextOverlap() {
    const elements = await this.kpiCards.all();
    
    for (let i = 0; i < elements.length - 1; i++) {
      const box1 = await elements[i].boundingBox();
      const box2 = await elements[i + 1].boundingBox();
      
      // Check for overlap
      const overlap = (
        box1.x < box2.x + box2.width &&
        box1.x + box1.width > box2.x &&
        box1.y < box2.y + box2.height &&
        box1.y + box1.height > box2.y
      );
      
      if (overlap) return true;
    }
    return false;
  }

  async areKPIValuesTruncated() {
    const values = [this.monthlySpendValue, this.totalCreditLimitValue, 
                    this.availableCreditValue, this.outstandingAmountValue];
    
    for (const value of values) {
      const element = await value.elementHandle();
      const isTruncated = await this.page.evaluate(el => {
        return el.scrollWidth > el.clientWidth;
      }, element);
      
      if (isTruncated) return true;
    }
    return false;
  }
};
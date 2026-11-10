const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.noCreditCardMessage = page.locator('[data-testid="no-credit-card-message"]');
    this.refreshButton = page.locator('[data-testid="refresh-button"]');
    this.kpiContainer = page.locator('.kpi-container');
  }

  async waitForDashboardLoad() {
    await expect(this.monthlySpendKPI).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.locator('.kpi-value').textContent();
    return text.trim();
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.locator('.kpi-value').textContent();
    return text.trim();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.locator('.kpi-value').textContent();
    return text.trim();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.locator('.kpi-value').textContent();
    return text.trim();
  }

  async getDashboardLoadTime() {
    const startTime = Date.now();
    await this.waitForDashboardLoad();
    const endTime = Date.now();
    return endTime - startTime;
  }

  async isKPICardsVerticallyStacked() {
    const kpiCards = await this.kpiContainer.locator('.kpi-card').all();
    if (kpiCards.length < 2) return false;
    
    const firstCardBox = await kpiCards[0].boundingBox();
    const secondCardBox = await kpiCards[1].boundingBox();
    
    // Cards are vertically stacked if second card's Y position is greater than first card's bottom
    return secondCardBox.y > (firstCardBox.y + firstCardBox.height);
  }

  async isKPICardsTwoColumnGrid() {
    const kpiCards = await this.kpiContainer.locator('.kpi-card').all();
    if (kpiCards.length < 4) return false;
    
    const firstCardBox = await kpiCards[0].boundingBox();
    const secondCardBox = await kpiCards[1].boundingBox();
    const thirdCardBox = await kpiCards[2].boundingBox();
    
    // Two-column grid: second card should be on same row as first (similar Y), third card on new row
    const sameRow = Math.abs(firstCardBox.y - secondCardBox.y) < 10;
    const newRow = thirdCardBox.y > (firstCardBox.y + firstCardBox.height);
    
    return sameRow && newRow;
  }

  async triggerDataRefresh() {
    await this.refreshButton.click();
    await this.page.waitForTimeout(500);
  }

  async checkForUIOverlap() {
    const kpiCards = await this.kpiContainer.locator('.kpi-card').all();
    
    for (let i = 0; i < kpiCards.length - 1; i++) {
      const card1Box = await kpiCards[i].boundingBox();
      const card2Box = await kpiCards[i + 1].boundingBox();
      
      // Check if cards overlap
      const overlap = !(card1Box.x + card1Box.width <= card2Box.x || 
                       card2Box.x + card2Box.width <= card1Box.x || 
                       card1Box.y + card1Box.height <= card2Box.y || 
                       card2Box.y + card2Box.height <= card1Box.y);
      
      if (overlap) return true;
    }
    return false;
  }

  async isTextTruncated() {
    const kpiValues = await this.kpiContainer.locator('.kpi-value').all();
    
    for (const value of kpiValues) {
      const element = await value.elementHandle();
      const isTruncated = await this.page.evaluate(el => {
        return el.scrollWidth > el.clientWidth;
      }, element);
      
      if (isTruncated) return true;
    }
    return false;
  }

  async checkContrastRatio() {
    // Simplified contrast check - in real implementation, would calculate actual contrast ratio
    const backgroundColor = await this.kpiContainer.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    const textColor = await this.monthlySpendKPI.locator('.kpi-value').evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    
    // Basic check: ensure colors are different
    return backgroundColor !== textColor;
  }
};
const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendCard = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitCard = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditCard = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountCard = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.kpiCards = page.locator('.kpi-card');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await this.waitForDashboardLoad();
  }

  async waitForDashboardLoad() {
    await expect(this.monthlySpendCard).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendCard).toBeVisible();
    return await this.monthlySpendCard.locator('.value').textContent();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitCard).toBeVisible();
    return await this.totalCreditLimitCard.locator('.value').textContent();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditCard).toBeVisible();
    return await this.availableCreditCard.locator('.value').textContent();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountCard).toBeVisible();
    return await this.outstandingAmountCard.locator('.value').textContent();
  }

  async verifyStackedLayout() {
    const cards = await this.kpiCards.all();
    let previousBottom = 0;
    for (const card of cards) {
      const box = await card.boundingBox();
      if (box.y < previousBottom) return false;
      previousBottom = box.y + box.height;
    }
    return true;
  }

  async verifyGridLayout(columns, rows) {
    const cards = await this.kpiCards.all();
    if (cards.length !== columns * rows) return false;
    const firstBox = await cards[0].boundingBox();
    const secondBox = await cards[1].boundingBox();
    return firstBox.y === secondBox.y;
  }

  async getKPIFontSize() {
    const fontSize = await this.monthlySpendCard.locator('.value').evaluate(el => {
      return parseInt(window.getComputedStyle(el).fontSize);
    });
    return fontSize;
  }

  async verifyKPICurrencyFormat() {
    const values = await this.kpiCards.locator('.value').allTextContents();
    return values.every(val => /\$[0-9,]+(\.\d{2})?/.test(val));
  }

  async getCardSpacing() {
    const cards = await this.kpiCards.all();
    if (cards.length < 2) return 0;
    const firstBox = await cards[0].boundingBox();
    const secondBox = await cards[1].boundingBox();
    return Math.abs(secondBox.x - (firstBox.x + firstBox.width));
  }

  async verifyNoTextOverflow() {
    const cards = await this.kpiCards.all();
    for (const card of cards) {
      const hasOverflow = await card.evaluate(el => {
        return el.scrollWidth > el.clientWidth;
      });
      if (hasOverflow) return false;
    }
    return true;
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async isKPIDataDisplayed() {
    const count = await this.kpiCards.count();
    if (count === 0) return false;
    const firstValue = await this.monthlySpendCard.locator('.value').textContent();
    return firstValue !== '';
  }

  async getNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async verifyAllKPICurrencyFormat() {
    const monthlySpend = await this.getMonthlySpendValue();
    const totalLimit = await this.getTotalCreditLimitValue();
    const availableCredit = await this.getAvailableCreditValue();
    const outstanding = await this.getOutstandingAmountValue();
    return /\$[0-9,]+(\.\d{2})?/.test(monthlySpend) &&
           /\$[0-9,]+/.test(totalLimit) &&
           /\$[0-9,]+/.test(availableCredit) &&
           /\$[0-9,]+/.test(outstanding);
  }
};

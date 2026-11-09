const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendCard = page.locator('.kpi-card:has-text("Monthly Spend")');
    this.creditLimitCard = page.locator('.kpi-card:has-text("Total Credit Limit")');
    this.availableCreditCard = page.locator('.kpi-card:has-text("Available Credit")');
    this.outstandingAmountCard = page.locator('.kpi-card:has-text("Outstanding Amount")');
    this.creditCardList = page.locator('.card-item');
    this.errorMessage = page.locator('.alert-danger, .alert-warning');
  }

  async verifyStackedLayout() {
    const cards = await this.page.locator('.kpi-card').all();
    let previousBottom = 0;
    for (const card of cards) {
      const box = await card.boundingBox();
      if (box.y < previousBottom) {
        return false;
      }
      previousBottom = box.y + box.height;
    }
    return true;
  }

  async verifyTwoColumnLayout() {
    const cards = await this.page.locator('.kpi-card').all();
    if (cards.length < 4) return false;
    const firstBox = await cards[0].boundingBox();
    const secondBox = await cards[1].boundingBox();
    return Math.abs(firstBox.y - secondBox.y) < 10;
  }

  async hasHorizontalScrollbar() {
    const hasScroll = await this.page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    return hasScroll;
  }

  async getKPIFontSizes() {
    const labelFontSize = await this.monthlySpendCard.locator('h3').evaluate(el => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });
    const valueFontSize = await this.monthlySpendCard.locator('.value').evaluate(el => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });
    return { labelFontSize, valueFontSize };
  }

  async checkTextTruncation() {
    const elements = await this.page.locator('.kpi-card h3, .kpi-card .value').all();
    for (const el of elements) {
      const isTruncated = await el.evaluate(element => {
        return element.scrollWidth > element.clientWidth;
      });
      if (isTruncated) return true;
    }
    return false;
  }

  async checkOverlappingElements() {
    const cards = await this.page.locator('.kpi-card').all();
    for (let i = 0; i < cards.length - 1; i++) {
      const box1 = await cards[i].boundingBox();
      const box2 = await cards[i + 1].boundingBox();
      if (box1.y + box1.height > box2.y && box1.x < box2.x + box2.width && box1.x + box1.width > box2.x) {
        return true;
      }
    }
    return false;
  }

  async getKPICardDimensions() {
    const box = await this.monthlySpendCard.boundingBox();
    return { width: box.width, height: box.height };
  }

  async scrollVertically() {
    await this.page.evaluate(() => window.scrollBy(0, 500));
    await this.page.waitForTimeout(500);
  }

  async verifyInteractivity() {
    try {
      await this.monthlySpendCard.click({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendCard).toBeVisible();
    const value = await this.monthlySpendCard.locator('.value').textContent();
    return value.trim();
  }

  async getCreditLimitValue() {
    await expect(this.creditLimitCard).toBeVisible();
    const value = await this.creditLimitCard.locator('.value').textContent();
    return value.trim();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditCard).toBeVisible();
    const value = await this.availableCreditCard.locator('.value').textContent();
    return value.trim();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountCard).toBeVisible();
    const value = await this.outstandingAmountCard.locator('.value').textContent();
    return value.trim();
  }

  async verifyFinancialCalculation(available, outstanding, limit) {
    return (available + outstanding) === limit;
  }
};

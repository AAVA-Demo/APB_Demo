const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.noCardMessage = page.locator('.no-cards-message');
    this.errorMessage = page.locator('.error-message');
    this.loadingIndicator = page.locator('.loading-indicator');
    this.navigationMenu = page.locator('nav.navbar');
    this.kpiContainer = page.locator('.kpi-grid');
  }

  async waitForDashboardLoad() {
    await this.page.waitForSelector('.dashboard-container', { state: 'visible', timeout: 5000 });
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.locator('.kpi-value').textContent();
    return text.trim();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.locator('.kpi-value').textContent();
    return text.trim();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.locator('.kpi-value').textContent();
    return text.trim();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.locator('.kpi-value').textContent();
    return text.trim();
  }

  async isKPILoading() {
    const loadingState = await this.kpiContainer.locator('.loading-state').isVisible();
    return loadingState;
  }

  async getKPILayoutType() {
    const containerClass = await this.kpiContainer.getAttribute('class');
    if (containerClass.includes('single-column')) return 'single-column';
    if (containerClass.includes('two-column')) return 'two-column';
    return 'unknown';
  }

  async getKPIFontSize() {
    const fontSize = await this.monthlySpendKPI.locator('.kpi-value').evaluate(el => {
      return parseInt(window.getComputedStyle(el).fontSize);
    });
    return fontSize;
  }

  async getKPICardSpacing() {
    const spacing = await this.kpiContainer.evaluate(el => {
      const cards = el.querySelectorAll('.kpi-card');
      if (cards.length < 2) return 0;
      const rect1 = cards[0].getBoundingClientRect();
      const rect2 = cards[1].getBoundingClientRect();
      return rect2.top - rect1.bottom;
    });
    return spacing;
  }

  async isTextTruncated() {
    const isTruncated = await this.monthlySpendKPI.evaluate(el => {
      return el.scrollWidth > el.clientWidth;
    });
    return isTruncated;
  }

  async isKPIEvenlyDistributed() {
    const isEven = await this.kpiContainer.evaluate(el => {
      const cards = el.querySelectorAll('.kpi-card');
      if (cards.length < 2) return true;
      const widths = Array.from(cards).map(card => card.offsetWidth);
      const firstWidth = widths[0];
      return widths.every(width => Math.abs(width - firstWidth) < 5);
    });
    return isEven;
  }

  async getTouchTargetSize() {
    const interactiveElements = await this.page.locator('button, a').first();
    if (await interactiveElements.count() === 0) return null;
    const box = await interactiveElements.boundingBox();
    return box;
  }

  async waitForDataOrTimeout(timeout) {
    try {
      await this.monthlySpendKPI.waitFor({ state: 'visible', timeout: timeout });
      return true;
    } catch (e) {
      return false;
    }
  }

  async hasCachedDataMessage() {
    const cachedMessage = this.page.locator('.cached-data-message');
    return await cachedMessage.isVisible();
  }

  async hasTimeoutMessage() {
    const timeoutMessage = this.page.locator('.timeout-message');
    return await timeoutMessage.isVisible();
  }
};

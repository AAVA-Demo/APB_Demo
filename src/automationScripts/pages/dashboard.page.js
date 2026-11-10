const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.kpiCardsContainer = page.locator('.row.mb-4, .kpi-container, [data-testid="kpi-cards"]').first();
    this.kpiCards = page.locator('.col-md-3.col-sm-6, .kpi-card, [data-testid="kpi-card"]');
    this.monthlySpendKpi = page.locator('[data-testid="kpi-monthly-spend"], .kpi-card:has-text("Monthly Spend")').first();
    this.totalCreditLimitKpi = page.locator('[data-testid="kpi-credit-limit"], .kpi-card:has-text("Total Credit Limit")').first();
    this.availableCreditKpi = page.locator('[data-testid="kpi-available-credit"], .kpi-card:has-text("Available Credit")').first();
    this.outstandingAmountKpi = page.locator('[data-testid="kpi-outstanding"], .kpi-card:has-text("Outstanding Amount")').first();
    this.creditCardTiles = page.locator('.col-lg-4.col-md-6, .card, [data-testid="credit-card-tile"]');
    this.navigationMenu = page.locator('.navbar, nav, [role="navigation"]').first();
    this.noCardsMessage = page.locator('.alert-info, .no-cards-message, [data-testid="no-cards-message"]');
    this.errorMessage = page.locator('.alert-danger, .error-message, [role="alert"]');
  }

  async navigate() {
    await this.page.goto('https://app.creditcard.com/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDashboardLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.kpiCardsContainer).toBeVisible({ timeout: 10000 });
  }

  async getKpiCardColumnCount() {
    const cards = await this.kpiCards.all();
    if (cards.length === 0) return 0;
    const firstCardBox = await cards[0].boundingBox();
    const containerBox = await this.kpiCardsContainer.boundingBox();
    if (!firstCardBox || !containerBox) return 0;
    const cardsInFirstRow = [];
    for (const card of cards) {
      const box = await card.boundingBox();
      if (box && Math.abs(box.y - firstCardBox.y) < 10) {
        cardsInFirstRow.push(card);
      }
    }
    return cardsInFirstRow.length;
  }

  async getContainerFontSize() {
    const fontSize = await this.kpiCardsContainer.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    return fontSize;
  }

  async isHorizontallyScrollable() {
    const scrollWidth = await this.page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    return scrollWidth;
  }

  async getCreditCardCount() {
    return await this.creditCardTiles.count();
  }

  async getAllCardTypes() {
    const types = [];
    const cards = await this.creditCardTiles.all();
    for (const card of cards) {
      const typeElement = card.locator('.card-title, h5, [data-testid="card-type"]').first();
      const type = await typeElement.textContent();
      types.push(type.trim());
    }
    return types;
  }

  async getCardNumber(index) {
    const card = this.creditCardTiles.nth(index);
    const numberElement = card.locator('.card-text.text-muted, [data-testid="card-number"]').first();
    return await numberElement.textContent();
  }

  async getCardFinancialData(index) {
    const card = this.creditCardTiles.nth(index);
    const creditLimitText = await card.locator('p:has-text("Credit Limit")').first().textContent();
    const availableCreditText = await card.locator('p:has-text("Available")').first().textContent();
    const outstandingText = await card.locator('p:has-text("Outstanding")').first().textContent();
    const monthlySpendText = await card.locator('p:has-text("Monthly Spend")').first().textContent();
    const expiryDateText = await card.locator('small:has-text("Expires")').first().textContent();
    return {
      creditLimit: this.parseAmount(creditLimitText),
      availableCredit: this.parseAmount(availableCreditText),
      outstanding: this.parseAmount(outstandingText),
      monthlySpend: this.parseAmount(monthlySpendText),
      expiryDate: expiryDateText.replace('Expires:', '').trim()
    };
  }

  parseAmount(text) {
    const match = text.match(/\$([\d,]+\.\d{2})/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
  }

  async getNoCardsMessageText() {
    return await this.noCardsMessage.textContent();
  }

  async getAllKpiValues() {
    const values = [];
    const kpis = await this.kpiCards.all();
    for (const kpi of kpis) {
      const valueElement = kpi.locator('.card-title, h4, [data-testid="kpi-value"]').first();
      const value = await valueElement.textContent();
      values.push(value.trim());
    }
    return values;
  }

  async getErrorMessageText() {
    return await this.errorMessage.textContent();
  }

  async getTouchTargetSize(element) {
    const box = await element.boundingBox();
    return { width: box.width, height: box.height };
  }

  async hasTouchActiveClass(element) {
    const classes = await element.getAttribute('class');
    return classes.includes('touch-active');
  }

  async getElementsWithInsufficientTouchTarget() {
    const allInteractive = await this.page.locator('button, a, [role="button"]').all();
    const insufficient = [];
    for (const element of allInteractive) {
      const box = await element.boundingBox();
      if (box && (box.width < 44 || box.height < 44)) {
        insufficient.push(element);
      }
    }
    return insufficient;
  }

  async hasHoverState(element) {
    const boxShadow = await element.evaluate(el => {
      return window.getComputedStyle(el).boxShadow;
    });
    return boxShadow !== 'none';
  }

  async getCursorStyle(element) {
    return await element.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
  }

  async getKpiValue(kpiName) {
    let kpiElement;
    switch(kpiName) {
      case 'monthlySpend':
        kpiElement = this.monthlySpendKpi;
        break;
      case 'totalCreditLimit':
        kpiElement = this.totalCreditLimitKpi;
        break;
      case 'availableCredit':
        kpiElement = this.availableCreditKpi;
        break;
      case 'outstanding':
        kpiElement = this.outstandingAmountKpi;
        break;
    }
    const valueElement = kpiElement.locator('.card-title, h4, [data-testid="kpi-value"]').first();
    return await valueElement.textContent();
  }

  async getNumericKpiValue(kpiName) {
    const value = await this.getKpiValue(kpiName);
    return this.parseAmount(value);
  }

  async getVisibleKpis() {
    const visible = [];
    if (await this.monthlySpendKpi.isVisible()) visible.push('monthlySpend');
    if (await this.totalCreditLimitKpi.isVisible()) visible.push('totalCreditLimit');
    if (await this.availableCreditKpi.isVisible()) visible.push('availableCredit');
    if (await this.outstandingAmountKpi.isVisible()) visible.push('outstanding');
    return visible;
  }

  async getDataUnavailableMessage() {
    const message = this.page.locator('.data-unavailable, [data-testid="data-unavailable"]').first();
    if (await message.isVisible()) {
      return await message.textContent();
    }
    return '';
  }

  async getCreditUtilization() {
    const utilizationElement = this.page.locator('[data-testid="credit-utilization"], .credit-utilization').first();
    const text = await utilizationElement.textContent();
    const match = text.match(/([\d.]+)%/);
    return match ? parseFloat(match[1]) : 0;
  }
};
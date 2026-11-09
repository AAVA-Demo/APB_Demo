const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"], .kpi-widget:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"], .kpi-widget:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"], .kpi-widget:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"], .kpi-widget:has-text("Outstanding")');
    
    // Card Portfolio Locators
    this.cardWidgets = page.locator('.card-summary, .card-widget, [data-testid="credit-card"]');
    this.noCardsMessage = page.locator('.no-cards-message, .alert-info:has-text("No credit cards found")');
  }

  async getKPIValue(kpiType) {
    logger.info(`Getting KPI value for: ${kpiType}`);
    let locator;
    
    switch(kpiType) {
      case 'monthlySpend':
        locator = this.monthlySpendKPI;
        break;
      case 'totalCreditLimit':
        locator = this.totalCreditLimitKPI;
        break;
      case 'availableCredit':
        locator = this.availableCreditKPI;
        break;
      case 'outstandingAmount':
        locator = this.outstandingAmountKPI;
        break;
      default:
        throw new Error(`Unknown KPI type: ${kpiType}`);
    }
    
    await expect(locator).toBeVisible();
    const text = await locator.textContent();
    const match = text.match(/\$[\d,]+\.\d{2}/);
    return match ? match[0] : null;
  }

  async scrollToCardSection() {
    logger.info('Scrolling to credit card section');
    await this.page.evaluate(() => {
      const cardSection = document.querySelector('.cards-section, [data-testid="card-portfolio"]');
      if (cardSection) cardSection.scrollIntoView({ behavior: 'smooth' });
    });
    await this.page.waitForTimeout(500);
  }

  async scrollToTop() {
    logger.info('Scrolling to top of page');
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(500);
  }

  async getCardCreditLimit(cardIndex) {
    logger.info(`Getting credit limit for card at index: ${cardIndex}`);
    const card = this.cardWidgets.nth(cardIndex);
    await expect(card).toBeVisible();
    const text = await card.textContent();
    const match = text.match(/Credit Limit[:\s]*\$([\d,]+\.\d{2})/);
    return match ? `$${match[1]}` : null;
  }

  async getAllCardNumbers() {
    logger.info('Getting all card numbers');
    const count = await this.cardWidgets.count();
    const cardNumbers = [];
    
    for (let i = 0; i < count; i++) {
      const card = this.cardWidgets.nth(i);
      const text = await card.textContent();
      const match = text.match(/\*{4}\d{4}/);
      if (match) cardNumbers.push(match[0]);
    }
    
    return cardNumbers;
  }

  async getCardMetrics(cardIndex) {
    logger.info(`Getting metrics for card at index: ${cardIndex}`);
    const card = this.cardWidgets.nth(cardIndex);
    await expect(card).toBeVisible();
    const text = await card.textContent();
    
    const creditLimitMatch = text.match(/Credit Limit[:\s]*\$([\d,]+)/);
    const availableCreditMatch = text.match(/Available Credit[:\s]*\$([\d,]+)/);
    const outstandingMatch = text.match(/Outstanding[:\s]*\$([\d,]+)/);
    
    return {
      creditLimit: creditLimitMatch ? `$${creditLimitMatch[1]}` : null,
      availableCredit: availableCreditMatch ? `$${availableCreditMatch[1]}` : null,
      outstanding: outstandingMatch ? `$${outstandingMatch[1]}` : null
    };
  }

  async getCardDetails(cardIndex) {
    logger.info(`Getting details for card at index: ${cardIndex}`);
    const card = this.cardWidgets.nth(cardIndex);
    await expect(card).toBeVisible();
    const text = await card.textContent();
    
    const cardholderMatch = text.match(/Cardholder[:\s]*([A-Za-z\s]+)/);
    const typeMatch = text.match(/(Visa|Mastercard|Amex|Discover)\s+([A-Za-z]+)/);
    const numberMatch = text.match(/\*{4}\d{4}/);
    
    return {
      cardholderName: cardholderMatch ? cardholderMatch[1].trim() : null,
      cardType: typeMatch ? `${typeMatch[1]} ${typeMatch[2]}` : null,
      cardNumber: numberMatch ? numberMatch[0] : null
    };
  }

  async verifyGridLayout() {
    logger.info('Verifying grid layout');
    const gridStyle = await this.page.evaluate(() => {
      const cardSection = document.querySelector('.cards-section, [data-testid="card-portfolio"]');
      if (!cardSection) return null;
      const computedStyle = window.getComputedStyle(cardSection);
      const gridTemplateColumns = computedStyle.gridTemplateColumns;
      return gridTemplateColumns;
    });
    
    if (gridStyle && gridStyle.split(' ').length === 2) {
      return '2-column';
    }
    return 'unknown';
  }

  async hasHorizontalScrollbar() {
    logger.info('Checking for horizontal scrollbar');
    return await this.page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
  }
};

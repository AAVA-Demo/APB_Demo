const { expect } = require('@playwright/test');

exports.PortfolioPage = class PortfolioPage {
  constructor(page) {
    this.page = page;
    
    // Portfolio Container Locators
    this.portfolioContainer = page.locator('.portfolio-container');
    this.cardListContainer = page.locator('[data-testid="card-list"]');
    this.cardItems = page.locator('.card-item');
    this.addCardButton = page.locator('button:has-text("Add Card")');
    this.addCardModal = page.locator('.modal.fade.in');
    this.spinner = page.locator('.spinner');
    this.errorAlert = page.locator('.alert.alert-danger');
    this.noCardsMessage = page.locator('text=/No credit cards/i');
    
    // Card Detail Locators
    this.cardDetailPanel = page.locator('.panel.panel-primary');
    this.backButton = page.locator('button:has-text("Back to Portfolio")');
    this.cardHolderName = page.locator('[data-testid="card-holder-name"]');
    this.cardType = page.locator('[data-testid="card-type"]');
    this.cardIssuer = page.locator('[data-testid="card-issuer"]');
    this.cardCreditLimit = page.locator('[data-testid="card-credit-limit"]');
    this.cardOutstandingBalance = page.locator('[data-testid="card-outstanding"]');
    this.cardAvailableCredit = page.locator('[data-testid="card-available-credit"]');
    
    // Card Metrics Locators
    this.cardMonthlySpendMetric = page.locator('[data-testid="card-monthly-spend"]');
    this.cardUtilizationMetric = page.locator('[data-testid="card-utilization-rate"]');
    this.cardTransactionCountMetric = page.locator('[data-testid="card-transaction-count"]');
    this.cardLastTransactionMetric = page.locator('[data-testid="card-last-transaction"]');
  }

  async navigate() {
    await this.page.goto('/#/portfolio');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForPortfolioLoad() {
    await this.page.waitForSelector('.portfolio-container', { state: 'visible' });
    await this.spinner.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  }

  async getCardCount() {
    await this.waitForPortfolioLoad();
    return await this.cardItems.count();
  }

  async getAllCardNumbers() {
    const cards = await this.cardItems.all();
    const cardNumbers = [];
    for (const card of cards) {
      const cardNumber = await card.locator('h4').textContent();
      const match = cardNumber.match(/\*{4}\d{4}/);
      if (match) {
        cardNumbers.push(match[0]);
      }
    }
    return cardNumbers;
  }

  async getAllCardTypes() {
    const cards = await this.cardItems.all();
    const types = [];
    for (const card of cards) {
      const typeText = await card.locator('h4').textContent();
      const type = typeText.split(' - ')[0];
      types.push(type);
    }
    return types;
  }

  async getAllIssuers() {
    const cards = await this.cardItems.all();
    const issuers = [];
    for (const card of cards) {
      const issuerText = await card.locator('p:has-text("Issuer:")').textContent();
      issuers.push(issuerText.replace('Issuer:', '').trim());
    }
    return issuers;
  }

  async getCardByIndex(index) {
    const card = this.cardItems.nth(index);
    return {
      element: card,
      cardNumber: card.locator('h4'),
      cardType: card.locator('h4'),
      issuer: card.locator('p:has-text("Issuer:")'),
      creditLimit: card.locator('p:has-text("Credit Limit:")'),
      availableCredit: card.locator('p:has-text("Available:")')
    };
  }

  async getAllCards() {
    const count = await this.getCardCount();
    const cards = [];
    for (let i = 0; i < count; i++) {
      cards.push(await this.getCardByIndex(i));
    }
    return cards;
  }

  async selectCard(index) {
    const card = this.cardItems.nth(index);
    await card.click();
    await this.page.waitForTimeout(500);
  }

  async waitForCardDetails() {
    await this.cardDetailPanel.waitFor({ state: 'visible', timeout: 3000 });
  }

  async getNoCardsMessage() {
    try {
      return await this.noCardsMessage.textContent({ timeout: 2000 });
    } catch {
      return null;
    }
  }

  async clickAddCard() {
    await this.addCardButton.click();
    await this.page.waitForTimeout(500);
  }

  async getCardMonthlySpend() {
    await expect(this.cardMonthlySpendMetric).toBeVisible();
    return await this.cardMonthlySpendMetric.textContent();
  }

  async getCardUtilizationRate() {
    await expect(this.cardUtilizationMetric).toBeVisible();
    return await this.cardUtilizationMetric.textContent();
  }

  async getCardTransactionCount() {
    await expect(this.cardTransactionCountMetric).toBeVisible();
    const text = await this.cardTransactionCountMetric.textContent();
    return text.match(/\d+/)[0];
  }

  async getLastTransactionDate() {
    try {
      await expect(this.cardLastTransactionMetric).toBeVisible({ timeout: 2000 });
      return await this.cardLastTransactionMetric.textContent();
    } catch {
      return 'N/A';
    }
  }

  async goBackToPortfolio() {
    await this.backButton.click();
    await this.waitForPortfolioLoad();
  }
};

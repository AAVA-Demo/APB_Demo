const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    // Card Locators
    this.cardContainer = page.locator('[data-testid="card-container"]');
    this.cardItems = page.locator('[data-testid="card-item"]');
    this.activeCardItems = page.locator('[data-testid="card-item"][data-status="active"]');
    
    // Message Locators
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    this.addCardPrompt = page.locator('[data-testid="add-card-prompt"]');
    
    // Error Indicator Locators
    this.kpiErrorIndicator = (kpiName) => page.locator(`[data-testid="kpi-${kpiName}-error"]`);
    
    // Dashboard State Locators
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  async navigate() {
    logger.info('Navigating to Dashboard page');
    await this.page.goto('/dashboard');
    await expect(this.dashboardContainer).toBeVisible();
    await expect(this.loadingSpinner).not.toBeVisible({ timeout: 5000 });
    logger.info('Dashboard page loaded successfully');
  }

  async authenticateUser(email, cardIds, options = {}) {
    logger.info(`Authenticating user: ${email} with cards: ${cardIds}`);
    
    // Mock authentication and card setup based on test requirements
    await this.page.evaluate(({ email, cardIds, options }) => {
      window.mockUserData = {
        email: email,
        cards: cardIds ? cardIds.split(',').map((id, index) => ({
          cardId: id.trim(),
          cardType: index === 0 ? 'Visa Platinum' : index === 1 ? 'Mastercard Gold' : 'Visa Gold',
          cardNumber: `**** **** **** ${1234 + index}`,
          creditLimit: options.incompleteCreditLimit && index === 1 ? null : (100000 - index * 50000),
          availableCredit: 65000 - index * 35000,
          outstandingAmount: options.outstandingAmount !== undefined ? options.outstandingAmount : (35000 - index * 15000),
          monthlySpend: 22000 - index * 12000,
          status: options.expiredCard === id.trim() ? 'Expired' : 'active',
          lastUpdated: new Date()
        })) : []
      };
    }, { email, cardIds, options });
    
    await this.page.reload();
    await expect(this.loadingSpinner).not.toBeVisible({ timeout: 5000 });
    logger.info('User authentication completed');
  }

  async getKPIData() {
    logger.info('Retrieving KPI data');
    
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
    
    const monthlySpend = await this.extractNumericValue(this.monthlySpendKPI);
    const totalCreditLimit = await this.extractNumericValue(this.totalCreditLimitKPI);
    const availableCredit = await this.extractNumericValue(this.availableCreditKPI);
    const outstandingAmount = await this.extractNumericValue(this.outstandingAmountKPI);
    
    logger.info('KPI data retrieved successfully');
    
    return {
      monthlySpend,
      totalCreditLimit,
      availableCredit,
      outstandingAmount
    };
  }

  async extractNumericValue(locator) {
    const text = await locator.textContent();
    const numericValue = text.replace(/[^0-9]/g, '');
    return parseInt(numericValue, 10);
  }

  async hasKPIErrorIndicator(kpiName) {
    logger.info(`Checking for error indicator on KPI: ${kpiName}`);
    const errorIndicator = this.kpiErrorIndicator(kpiName);
    return await errorIndicator.isVisible();
  }

  async isDashboardResponsive() {
    logger.info('Checking dashboard responsiveness');
    
    try {
      await expect(this.dashboardContainer).toBeVisible();
      await this.page.waitForTimeout(500); // Brief wait to ensure no freeze
      const isClickable = await this.dashboardContainer.isEnabled();
      return isClickable;
    } catch (error) {
      logger.error('Dashboard responsiveness check failed', error);
      return false;
    }
  }

  async getAllCards() {
    logger.info('Retrieving all credit cards');
    await expect(this.cardContainer).toBeVisible();
    
    const cardCount = await this.cardItems.count();
    const cards = [];
    
    for (let i = 0; i < cardCount; i++) {
      const cardItem = this.cardItems.nth(i);
      const cardData = await cardItem.evaluate(el => ({
        cardId: el.getAttribute('data-card-id'),
        creditLimit: parseInt(el.getAttribute('data-credit-limit'), 10),
        availableCredit: parseInt(el.getAttribute('data-available-credit'), 10),
        outstandingAmount: parseInt(el.getAttribute('data-outstanding-amount'), 10),
        monthlySpend: parseInt(el.getAttribute('data-monthly-spend'), 10),
        status: el.getAttribute('data-status')
      }));
      cards.push(cardData);
    }
    
    logger.info(`Retrieved ${cards.length} credit cards`);
    return cards;
  }

  async getActiveCards() {
    logger.info('Retrieving active credit cards');
    await expect(this.cardContainer).toBeVisible();
    
    const activeCardCount = await this.activeCardItems.count();
    const activeCards = [];
    
    for (let i = 0; i < activeCardCount; i++) {
      const cardItem = this.activeCardItems.nth(i);
      const cardData = await cardItem.evaluate(el => ({
        cardId: el.getAttribute('data-card-id'),
        creditLimit: parseInt(el.getAttribute('data-credit-limit'), 10),
        availableCredit: parseInt(el.getAttribute('data-available-credit'), 10),
        outstandingAmount: parseInt(el.getAttribute('data-outstanding-amount'), 10),
        monthlySpend: parseInt(el.getAttribute('data-monthly-spend'), 10),
        status: el.getAttribute('data-status')
      }));
      activeCards.push(cardData);
    }
    
    logger.info(`Retrieved ${activeCards.length} active credit cards`);
    return activeCards;
  }

  async isConsolidatedViewDisplayed() {
    logger.info('Checking if consolidated view is displayed');
    await expect(this.cardContainer).toBeVisible();
    const cardCount = await this.cardItems.count();
    return cardCount > 0;
  }

  async getNoCardsMessage() {
    logger.info('Retrieving no cards message');
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async getAddCardPrompt() {
    logger.info('Retrieving add card prompt');
    await expect(this.addCardPrompt).toBeVisible();
    return await this.addCardPrompt.textContent();
  }

  async hasEmptyCardComponents() {
    logger.info('Checking for empty card components');
    const cardCount = await this.cardItems.count();
    return cardCount === 0 ? false : await this.cardItems.first().evaluate(el => el.innerHTML.trim() === '');
  }

  async isCardVisible(cardId) {
    logger.info(`Checking if card ${cardId} is visible`);
    const cardLocator = this.page.locator(`[data-testid="card-item"][data-card-id="${cardId}"]`);
    return await cardLocator.isVisible();
  }
};
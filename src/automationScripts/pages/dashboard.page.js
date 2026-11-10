const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.totalCreditLimitLabel = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.totalOutstandingLabel = page.locator('[data-testid="kpi-total-outstanding"]');
    this.totalAvailableCreditLabel = page.locator('[data-testid="kpi-total-available-credit"]');
    this.totalMonthlySpendLabel = page.locator('[data-testid="kpi-total-monthly-spend"]');
    
    // Card List Locators
    this.cardList = page.locator('[data-testid="card-list"]');
    this.cardRow = page.locator('[data-testid="card-row"]');
    this.cardNameField = page.locator('[data-testid="card-name"]');
    this.cardNumberField = page.locator('[data-testid="card-number"]');
    this.availableCreditField = page.locator('[data-testid="available-credit"]');
    this.outstandingBalanceField = page.locator('[data-testid="outstanding-balance"]');
    this.expiryDateField = page.locator('[data-testid="expiry-date"]');
    this.cardCountLabel = page.locator('[data-testid="card-count"]');
    
    // Error and Empty State Locators
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    
    // Refresh Controls
    this.refreshButton = page.locator('[data-testid="refresh-button"]');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to dashboard');
  }

  async setupTestData(config) {
    await this.page.route('**/api/cards**', async route => {
      let cards = [];
      
      if (config.cardA) {
        cards.push({
          cardId: 'card-a',
          cardType: 'Visa Platinum',
          cardNumber: '**** **** **** 1234',
          creditLimit: config.cardA.creditLimit,
          outstandingAmount: config.cardA.outstandingAmount,
          availableCredit: config.cardA.availableCredit,
          monthlySpend: config.cardA.monthlySpend,
          expiryDate: '12/26'
        });
      }
      
      if (config.cardB) {
        cards.push({
          cardId: 'card-b',
          cardType: 'MasterCard Gold',
          cardNumber: '**** **** **** 5678',
          creditLimit: config.cardB.creditLimit,
          outstandingAmount: config.cardB.outstandingAmount,
          availableCredit: config.cardB.availableCredit,
          monthlySpend: config.cardB.monthlySpend,
          expiryDate: '11/25'
        });
      }
      
      if (config.cards) {
        cards = config.cards;
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(cards)
      });
    });
    logger.info('Test data setup completed');
  }

  async setupBackendError(statusCode) {
    await this.page.route('**/api/cards**', async route => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service Unavailable' })
      });
    });
    logger.info(`Backend configured to return HTTP ${statusCode}`);
  }

  async setupBackendTimeout() {
    await this.page.route('**/api/cards**', async route => {
      // Simulate timeout by delaying response beyond reasonable time
      await new Promise(resolve => setTimeout(resolve, 60000));
      await route.abort('timedout');
    });
    logger.info('Backend configured to timeout');
  }

  async waitForKPIsToLoad() {
    await expect(this.totalCreditLimitLabel).toBeVisible({ timeout: 10000 });
    logger.info('KPIs loaded');
  }

  async waitForCardsToLoad() {
    await expect(this.cardList).toBeVisible({ timeout: 10000 });
    logger.info('Card list loaded');
  }

  async getTotalCreditLimit() {
    const text = await this.totalCreditLimitLabel.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTotalOutstanding() {
    const text = await this.totalOutstandingLabel.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTotalAvailableCredit() {
    const text = await this.totalAvailableCreditLabel.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTotalMonthlySpend() {
    const text = await this.totalMonthlySpendLabel.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async verifyAllKPIsZero() {
    const creditLimit = await this.getTotalCreditLimit();
    const outstanding = await this.getTotalOutstanding();
    const availableCredit = await this.getTotalAvailableCredit();
    const monthlySpend = await this.getTotalMonthlySpend();
    
    return (creditLimit === 0 && outstanding === 0 && availableCredit === 0 && monthlySpend === 0);
  }

  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async simulateNewTransaction(cardId, amount) {
    // Update the mock to reflect new transaction
    await this.page.route('**/api/cards**', async route => {
      const cards = [
        {
          cardId: 'card-a',
          cardType: 'Visa Platinum',
          creditLimit: 10000,
          outstandingAmount: 3500, // Updated from 3000
          availableCredit: 6500, // Updated from 7000
          monthlySpend: 1500
        },
        {
          cardId: 'card-b',
          cardType: 'MasterCard Gold',
          creditLimit: 5000,
          outstandingAmount: 2000,
          availableCredit: 3000,
          monthlySpend: 800
        }
      ];
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(cards)
      });
    });
    logger.info(`Simulated new transaction: ${amount} on ${cardId}`);
  }

  async refreshData() {
    await this.refreshButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Data refresh triggered');
  }

  async getAllCardNames() {
    const names = await this.cardNameField.allTextContents();
    return names.map(name => name.trim());
  }

  async getAllCardNumbers() {
    const numbers = await this.cardNumberField.allTextContents();
    return numbers.map(num => num.trim());
  }

  async getAllAvailableCredits() {
    const credits = await this.availableCreditField.allTextContents();
    return credits.map(credit => parseFloat(credit.replace(/[^0-9.]/g, '')));
  }

  async getAllOutstandingBalances() {
    const balances = await this.outstandingBalanceField.allTextContents();
    return balances.map(balance => parseFloat(balance.replace(/[^0-9.]/g, '')));
  }

  async getAllExpiryDates() {
    const dates = await this.expiryDateField.allTextContents();
    return dates.map(date => date.trim());
  }

  async getCardCount() {
    const text = await this.cardCountLabel.textContent();
    return parseInt(text.match(/\d+/)[0]);
  }

  async isEmptyStateVisible() {
    return await this.emptyStateMessage.isVisible();
  }

  async getEmptyStateMessage() {
    return await this.emptyStateMessage.textContent();
  }

  async isRetryButtonVisible() {
    return await this.retryButton.isVisible();
  }
};

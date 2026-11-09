const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    this.myCardsLink = page.locator('a, button').filter({ hasText: /My Cards|Cards/ });
    this.cardList = page.locator('.card-list, #card-list, [data-testid="card-list"]');
    this.cardItems = page.locator('.card-item, .card-card, [data-card-id]');
    this.cardDetailPage = page.locator('.card-detail, #card-detail, [data-testid="card-detail"]');
    
    this.maskedCardNumbers = page.locator('.card-number, [data-card-number]');
    this.creditLimits = page.locator('.credit-limit, [data-credit-limit]');
    this.currentBalances = page.locator('.current-balance, [data-current-balance]');
    
    this.totalSpendElement = page.locator('.total-spend, [data-total-spend]');
    this.availableCreditElement = page.locator('.available-credit, [data-available-credit]');
    this.categoryBreakdownSection = page.locator('.category-breakdown, [data-category-breakdown]');
    
    this.noSpendingDataMessage = page.locator('.no-data-message, .empty-state').filter({ hasText: /No spending data/ });
    this.timeoutErrorMessage = page.locator('.error-message, .alert-error').filter({ hasText: /Unable to load card data/ });
    this.serviceUnavailableError = page.locator('.error-message, .alert-error').filter({ hasText: /cannot be retrieved/ });
    
    this.loadingIndicator = page.locator('.loading, .spinner, [data-loading]');
    this.backButton = page.locator('button, a').filter({ hasText: /Back|Return/ });
  }

  async navigateToMyCards() {
    await expect(this.myCardsLink).toBeVisible();
    await this.myCardsLink.click();
    await expect(this.cardList).toBeVisible();
    logger.info('Navigated to My Cards section');
  }

  async getCardCount() {
    await expect(this.cardItems.first()).toBeVisible();
    return await this.cardItems.count();
  }

  async getAllMaskedCardNumbers() {
    await expect(this.maskedCardNumbers.first()).toBeVisible();
    const numbers = [];
    const count = await this.maskedCardNumbers.count();
    for (let i = 0; i < count; i++) {
      const text = await this.maskedCardNumbers.nth(i).textContent();
      numbers.push(text.trim());
    }
    return numbers;
  }

  async getAllCreditLimits() {
    await expect(this.creditLimits.first()).toBeVisible();
    const limits = [];
    const count = await this.creditLimits.count();
    for (let i = 0; i < count; i++) {
      const text = await this.creditLimits.nth(i).textContent();
      limits.push(text.trim());
    }
    return limits;
  }

  async getAllCurrentBalances() {
    await expect(this.currentBalances.first()).toBeVisible();
    const balances = [];
    const count = await this.currentBalances.count();
    for (let i = 0; i < count; i++) {
      const text = await this.currentBalances.nth(i).textContent();
      balances.push(text.trim());
    }
    return balances;
  }

  async selectCardByMaskedNumber(maskedNumber) {
    const cardItem = this.cardItems.filter({ has: this.page.locator('.card-number').filter({ hasText: maskedNumber }) });
    await expect(cardItem).toBeVisible();
    await cardItem.click();
    await expect(this.cardDetailPage).toBeVisible();
    logger.info(`Selected card: ${maskedNumber}`);
  }

  async getTotalSpend() {
    await expect(this.totalSpendElement).toBeVisible();
    const text = await this.totalSpendElement.textContent();
    return text.trim();
  }

  async getCardAvailableCredit() {
    await expect(this.availableCreditElement).toBeVisible();
    const text = await this.availableCreditElement.textContent();
    return text.trim();
  }

  async getCategoryBreakdown() {
    await expect(this.categoryBreakdownSection).toBeVisible();
    const breakdown = {};
    const categoryItems = this.categoryBreakdownSection.locator('.category-item, [data-category]');
    const count = await categoryItems.count();
    
    for (let i = 0; i < count; i++) {
      const categoryName = await categoryItems.nth(i).locator('.category-name, [data-category-name]').textContent();
      const categoryAmount = await categoryItems.nth(i).locator('.category-amount, [data-category-amount]').textContent();
      breakdown[categoryName.trim()] = categoryAmount.trim();
    }
    
    return breakdown;
  }

  async getNoSpendingDataMessage() {
    await expect(this.noSpendingDataMessage).toBeVisible();
    return await this.noSpendingDataMessage.textContent();
  }

  async isTransactionBreakdownVisible() {
    try {
      await this.categoryBreakdownSection.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async navigateBackToCardList() {
    await expect(this.backButton).toBeVisible();
    await this.backButton.click();
    await expect(this.cardList).toBeVisible();
    logger.info('Navigated back to card list');
  }

  async waitForLoadingIndicator() {
    await expect(this.loadingIndicator).toBeVisible();
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async getErrorMessage() {
    const errorLocator = this.page.locator('.error-message, .alert-error, .alert-danger');
    await expect(errorLocator).toBeVisible();
    return await errorLocator.textContent();
  }
};
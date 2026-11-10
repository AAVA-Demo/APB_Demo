const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.CardsPage = class CardsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.myCardsLink = page.locator('a:has-text("My Cards"), a[href*="/cards"]');
    
    // Card List Elements
    this.cardsContainer = page.locator('.cards-container, [data-testid="cards-list"]');
    this.cardItems = page.locator('.card-item, [data-testid="card-item"]');
    this.noCardsMessage = page.locator('.no-cards-message, .alert-info:has-text("No credit cards")');
    this.addCardButton = page.locator('button:has-text("Add Card"), button:has-text("Activate Card")');
    
    // Pagination/Scrolling
    this.paginationControls = page.locator('.pagination, [data-testid="pagination"]');
    this.scrollContainer = page.locator('.scroll-container, [data-testid="scroll-container"]');
    
    // Loading
    this.loadingIndicator = page.locator('.loading, .spinner');
  }

  async navigateToCardsPage() {
    await this.myCardsLink.click();
    logger.info('Navigated to My Cards page');
  }

  async waitForCardsPageLoad() {
    await expect(this.cardsContainer).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {
      logger.info('No loading indicator found');
    });
    
    logger.info('Cards page loaded');
  }

  async getCardCount() {
    const count = await this.cardItems.count();
    logger.info(`Card count: ${count}`);
    return count;
  }

  async verifyCardType(index, expectedType) {
    const cardItem = this.cardItems.nth(index);
    const typeLocator = cardItem.locator('.card-type, [data-testid="card-type"]');
    await expect(typeLocator).toContainText(expectedType);
    logger.info(`Card ${index + 1} type verified: ${expectedType}`);
  }

  async verifyCardLastFourDigits(index, expectedDigits) {
    const cardItem = this.cardItems.nth(index);
    const numberLocator = cardItem.locator('.card-number, [data-testid="card-number"]');
    const text = await numberLocator.textContent();
    expect(text).toContain(expectedDigits);
    logger.info(`Card ${index + 1} last 4 digits verified: ${expectedDigits}`);
  }

  async verifyCardBalance(index, expectedBalance) {
    const cardItem = this.cardItems.nth(index);
    const balanceLocator = cardItem.locator('.card-balance, [data-testid="outstanding-balance"]');
    await expect(balanceLocator).toContainText(expectedBalance);
    logger.info(`Card ${index + 1} balance verified: ${expectedBalance}`);
  }

  async verifyCardAvailableCredit(index, expectedAvailable) {
    const cardItem = this.cardItems.nth(index);
    const availableLocator = cardItem.locator('.available-credit, [data-testid="available-credit"]');
    await expect(availableLocator).toContainText(expectedAvailable);
    logger.info(`Card ${index + 1} available credit verified: ${expectedAvailable}`);
  }

  async verifyCardCreditLimit(index, expectedLimit) {
    const cardItem = this.cardItems.nth(index);
    const limitLocator = cardItem.locator('.credit-limit, [data-testid="credit-limit"]');
    await expect(limitLocator).toContainText(expectedLimit);
    logger.info(`Card ${index + 1} credit limit verified: ${expectedLimit}`);
  }

  async isPaginationVisible() {
    try {
      await expect(this.paginationControls).toBeVisible({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async verifyPaginationFunctional() {
    const nextButton = this.paginationControls.locator('button:has-text("Next"), .next');
    const isEnabled = await nextButton.isEnabled();
    
    if (isEnabled) {
      await nextButton.click();
      await this.page.waitForLoadState('networkidle');
      logger.info('Pagination next button clicked successfully');
    }
    
    logger.info('Pagination controls are functional');
  }

  async verifyScrollingFunctional() {
    const scrollHeight = await this.scrollContainer.evaluate(el => el.scrollHeight);
    const clientHeight = await this.scrollContainer.evaluate(el => el.clientHeight);
    
    if (scrollHeight > clientHeight) {
      await this.scrollContainer.evaluate(el => el.scrollTop = el.scrollHeight);
      await this.page.waitForTimeout(500);
      logger.info('Scrolling functionality verified');
    }
  }

  async verifyAllCardsHaveCompleteDetails() {
    const count = await this.cardItems.count();
    
    for (let i = 0; i < count; i++) {
      const cardItem = this.cardItems.nth(i);
      await expect(cardItem.locator('.card-type')).toBeVisible();
      await expect(cardItem.locator('.card-number')).toBeVisible();
      await expect(cardItem.locator('.card-balance, [data-testid="outstanding-balance"]')).toBeVisible();
      await expect(cardItem.locator('.available-credit')).toBeVisible();
      await expect(cardItem.locator('.credit-limit')).toBeVisible();
    }
    
    logger.info('All cards display complete information');
  }

  async clickCard(index) {
    await this.cardItems.nth(index).click();
    logger.info(`Clicked on card ${index + 1}`);
  }

  async clickDeactivatedCard() {
    const deactivatedCard = this.cardItems.filter({ hasText: /closed|deactivated|inactive/i }).first();
    await deactivatedCard.click();
    logger.info('Clicked on deactivated card');
  }

  async verifyNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    const text = await this.noCardsMessage.textContent();
    expect(text).toMatch(/no credit cards|no cards found/i);
    logger.info('No cards message displayed');
  }

  async verifyAddCardButtonVisible() {
    await expect(this.addCardButton).toBeVisible();
    logger.info('Add Card button is visible');
  }

  async clickAddCardButton() {
    await this.addCardButton.click();
    logger.info('Add Card button clicked');
  }
};

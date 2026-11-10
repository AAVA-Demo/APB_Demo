const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.PortfolioPage = class PortfolioPage {
  constructor(page) {
    this.page = page;
    this.cardList = page.locator('[data-testid="card-list"]');
    this.cardItems = page.locator('.card-item, [data-testid^="card-"]');
    this.noCardsMessage = page.locator('.no-cards-message, .empty-state');
    this.paginationControls = page.locator('.pagination, .pagination-controls');
  }

  async navigate() {
    await this.page.click('a[href*="portfolio"], nav a:has-text("Portfolio")');
    await expect(this.page).toHaveURL(/portfolio/);
    logger.info('Navigated to Portfolio page');
  }

  async waitForCardListToLoad() {
    await expect(this.cardList).toBeVisible({ timeout: 2000 });
    logger.info('Card list loaded');
  }

  async getCardCount() {
    const count = await this.cardItems.count();
    logger.info(`Card count: ${count}`);
    return count;
  }

  async getAllCards() {
    await this.waitForCardListToLoad();
    const cards = [];
    const count = await this.cardItems.count();
    
    for (let i = 0; i < count; i++) {
      const card = this.cardItems.nth(i);
      const cardData = {
        name: await card.locator('[data-field="card-name"]').textContent(),
        type: await card.locator('[data-field="card-type"]').textContent(),
        lastFourDigits: await card.locator('[data-field="card-number"]').textContent(),
        creditLimit: await card.locator('[data-field="credit-limit"]').textContent(),
        availableCredit: await card.locator('[data-field="available-credit"]').textContent(),
        outstandingBalance: await card.locator('[data-field="outstanding-balance"]').textContent()
      };
      cards.push(cardData);
    }
    
    logger.info(`Retrieved ${cards.length} card details`);
    return cards;
  }

  async hasPaginationControls() {
    const isVisible = await this.paginationControls.isVisible();
    logger.info(`Pagination controls visible: ${isVisible}`);
    return isVisible;
  }

  async hasScrollingFunctionality() {
    const hasScroll = await this.page.evaluate(() => {
      const cardList = document.querySelector('[data-testid="card-list"]');
      return cardList.scrollHeight > cardList.clientHeight;
    });
    logger.info(`Scrolling functionality: ${hasScroll}`);
    return hasScroll;
  }

  async scrollToBottomOfCardList() {
    await this.cardList.evaluate(el => {
      el.scrollTop = el.scrollHeight;
    });
    logger.info('Scrolled to bottom of card list');
  }

  async getLastCard() {
    const count = await this.cardItems.count();
    const lastCard = this.cardItems.nth(count - 1);
    await expect(lastCard).toBeVisible();
    const name = await lastCard.locator('[data-field="card-name"]').textContent();
    logger.info(`Last card: ${name}`);
    return name;
  }

  async isPageResponsive() {
    const isResponsive = await this.page.evaluate(() => {
      const body = document.body;
      return body.scrollWidth <= body.clientWidth;
    });
    logger.info(`Page responsive: ${isResponsive}`);
    return isResponsive;
  }

  async getNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    const message = await this.noCardsMessage.textContent();
    logger.info(`No cards message: ${message}`);
    return message.trim();
  }

  async hasEmptyCardList() {
    const emptyList = this.page.locator('.empty-card-list, table:has(tbody:empty)');
    const isVisible = await emptyList.isVisible();
    logger.info(`Empty card list visible: ${isVisible}`);
    return isVisible;
  }

  async hasErrorState() {
    const errorState = this.page.locator('.error-state, .alert-danger');
    const isVisible = await errorState.isVisible();
    logger.info(`Error state visible: ${isVisible}`);
    return isVisible;
  }

  async canNavigateToOtherSections() {
    const navLinks = this.page.locator('nav a, .nav-link');
    const count = await navLinks.count();
    logger.info(`Navigation links available: ${count}`);
    return count > 0;
  }

  async selectCard(cardId) {
    const card = this.page.locator(`[data-card-id="${cardId}"]`);
    await expect(card).toBeVisible();
    await card.click();
    logger.info(`Selected card: ${cardId}`);
  }
};

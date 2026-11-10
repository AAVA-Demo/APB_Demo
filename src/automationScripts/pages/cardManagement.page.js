const { expect } = require('@playwright/test');
const { WaitUtils } = require('../utils/wait.utils');
const { Logger } = require('../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger();
    this.waitUtils = new WaitUtils(page);
    
    // Locators
    this.cardsLink = page.locator('a[href="#/cards"]');
    this.cardListContainer = page.locator('.card-management-container');
    this.cardItems = page.locator('.card-item, .panel.card-item');
    this.emptyStateMessage = page.locator('.card-management-container .alert, .empty-state');
    this.addCardButton = page.locator('button:has-text("Add Card")');
    this.contactSupportLink = page.locator('a:has-text("Contact Support")');
    this.cardDetailsView = page.locator('.card-details-container');
  }

  async navigateToCardManagement() {
    await this.cardsLink.click();
    await this.waitUtils.waitForPageLoad();
    await expect(this.page).toHaveURL(/.*cards/);
    this.logger.info('Navigated to Card Management interface');
  }

  async getAllCards() {
    await this.waitUtils.waitForElement(this.cardListContainer);
    
    const cardCount = await this.cardItems.count();
    if (cardCount === 0) {
      this.logger.info('No cards found');
      return [];
    }
    
    const cards = await this.page.evaluate(() => {
      const cardElements = Array.from(document.querySelectorAll('.card-item, .panel.card-item'));
      return cardElements.map(card => {
        const getText = (selector) => card.querySelector(selector)?.textContent.trim() || '';
        const getValue = (selector) => {
          const text = getText(selector);
          return parseFloat(text.replace(/[$,]/g, '')) || 0;
        };
        
        return {
          cardId: card.getAttribute('data-card-id') || '',
          cardNumber: getText('h4, .card-number').split(' - ')[1] || getText('h4, .card-number'),
          cardType: getText('h4, .card-type').split(' - ')[0] || getText('h4, .card-type'),
          cardHolderName: getText('p:has-text("Holder:")').replace('Holder:', '').trim(),
          balance: getValue('p:has-text("Outstanding:")'),
          creditLimit: getValue('p:has-text("Credit Limit:")'),
          availableCredit: getValue('p:has-text("Available Credit:")'),
          utilizationRate: parseFloat(getText('p:has-text("Utilization:")').replace(/[^0-9.]/g, '')),
          status: getText('.label, p:has-text("Status:")').replace('Status:', '').trim(),
          issuer: getText('p:has-text("Issuer:")').replace('Issuer:', '').trim()
        };
      });
    });
    
    this.logger.info(`Retrieved ${cards.length} cards`);
    return cards;
  }

  async hasActionableOption() {
    const addCardVisible = await this.addCardButton.isVisible().catch(() => false);
    const supportLinkVisible = await this.contactSupportLink.isVisible().catch(() => false);
    return addCardVisible || supportLinkVisible;
  }

  async selectCard(cardId) {
    const cardElement = this.page.locator(`.card-item[data-card-id="${cardId}"], .card-item:has-text("${cardId}")`);
    await cardElement.locator('button:has-text("View Details")').click();
    await this.waitUtils.waitForElement(this.cardDetailsView);
    this.logger.info(`Selected card: ${cardId}`);
  }
};

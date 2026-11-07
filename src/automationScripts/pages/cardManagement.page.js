const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    this.cardManagementContainer = page.locator('.card-management-container, #card-management, [data-testid="card-management"]');
    
    this.cardItems = page.locator('.card-item, .card-card, [data-card-item]');
    this.cardName = page.locator('.card-header, .card-name, [data-card-name]');
    this.cardType = page.locator('[data-card-type]');
    this.creditLimit = page.locator('[data-credit-limit]');
    this.availableCredit = page.locator('[data-available-credit]');
    this.outstandingAmount = page.locator('[data-outstanding]');
    
    this.cardDetailContainer = page.locator('.card-detail-container, [data-view="card-detail"]');
    this.spendAnalysisSection = page.locator('.kpi-card:has-text("Spending Analysis"), [data-section="spend-analysis"]');
    
    this.monthlySpendValue = page.locator('[data-spend="monthly"], p:has-text("Monthly Spend")');
    this.weeklySpendValue = page.locator('[data-spend="weekly"], p:has-text("Weekly Spend")');
    this.topCategories = page.locator('[data-top-categories] li, .top-categories li');
    
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
    this.noTransactionsMessage = page.locator('.message:has-text("No transactions"), .alert-info');
    this.spendAnalysisError = page.locator('.error-message:has-text("spending analysis")');
    
    this.backButton = page.locator('button:has-text("Back"), [data-action="back"]');
  }

  async waitForCardsLoad() {
    await expect(this.cardManagementContainer).toBeVisible({ timeout: 15000 });
    await this.page.waitForLoadState('networkidle');
    logger.info('Card Management page loaded');
  }

  async getDisplayedCardCount() {
    await this.page.waitForTimeout(500);
    const count = await this.cardItems.count();
    return count;
  }

  async getAllCardDetails() {
    const cards = [];
    const cardCount = await this.cardItems.count();
    
    for (let i = 0; i < cardCount; i++) {
      const card = this.cardItems.nth(i);
      const cardData = await card.evaluate(el => {
        const getText = (selector) => {
          const element = el.querySelector(selector);
          return element ? element.textContent.trim() : '';
        };
        
        return {
          cardName: getText('.card-header, .card-name') || el.textContent.split('\n')[0].trim(),
          cardType: getText('[data-card-type]') || '',
          creditLimit: getText('[data-credit-limit], strong:has-text("Credit Limit") + *') || '',
          availableCredit: getText('[data-available-credit], strong:has-text("Available Credit") + *') || '',
          outstandingAmount: getText('[data-outstanding], strong:has-text("Outstanding") + *') || ''
        };
      });
      cards.push(cardData);
    }
    
    return cards;
  }

  async selectCardByName(cardName) {
    const card = this.page.locator(`.card-item:has-text("${cardName}")`);
    await expect(card).toBeVisible();
    await card.click();
    logger.info(`Selected card: ${cardName}`);
    await this.page.waitForLoadState('networkidle');
  }

  async selectCardByIndex(index) {
    const card = this.cardItems.nth(index);
    await expect(card).toBeVisible();
    await card.click();
    logger.info(`Selected card at index: ${index}`);
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardDetailLoad() {
    await expect(this.cardDetailContainer).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    logger.info('Card detail page loaded');
  }

  async getCardSpendAnalysis() {
    await expect(this.spendAnalysisSection).toBeVisible();
    
    const spendData = await this.page.evaluate(() => {
      const getTextByLabel = (label) => {
        const element = document.querySelector(`p:has-text("${label}")`);
        if (!element) return '';
        const text = element.textContent;
        const match = text.match(/₹?([0-9,]+)/);  
        return match ? match[0] : text.split(':')[1]?.trim() || '';
      };
      
      const topCats = [];
      const categoryElements = document.querySelectorAll('[data-top-categories] li, .top-categories li, h5:has-text("Top Categories") + ul li');
      categoryElements.forEach(el => {
        const text = el.textContent.trim();
        const parts = text.split(':');
        if (parts.length === 2) {
          topCats.push({
            category: parts[0].trim(),
            amount: parts[1].trim()
          });
        }
      });
      
      return {
        monthlySpend: getTextByLabel('Monthly Spend'),
        weeklySpend: getTextByLabel('Weekly Spend'),
        topCategories: topCats
      };
    });
    
    return spendData;
  }

  async getNoTransactionsMessage() {
    await expect(this.noTransactionsMessage).toBeVisible();
    return await this.noTransactionsMessage.textContent();
  }

  async waitForErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async areCardsVisible() {
    return await this.cardItems.first().isVisible().catch(() => false);
  }

  async waitForSpendAnalysisError() {
    await expect(this.spendAnalysisError).toBeVisible({ timeout: 10000 });
  }

  async getSpendAnalysisErrorMessage() {
    await expect(this.spendAnalysisError).toBeVisible();
    return await this.spendAnalysisError.textContent();
  }

  async isSpendAnalysisVisible() {
    return await this.spendAnalysisSection.isVisible().catch(() => false);
  }

  async clickBackButton() {
    await expect(this.backButton).toBeVisible();
    await this.backButton.click();
    logger.info('Clicked back button');
    await this.page.waitForLoadState('networkidle');
  }
};
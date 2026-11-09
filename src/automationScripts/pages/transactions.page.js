const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.transactionsMenuLink = page.locator('a[href*="transactions"], nav a:has-text("Transactions")');
    
    // Transaction List Locators
    this.transactionRows = page.locator('.transaction-row, tbody tr, [data-testid="transaction"]');
    this.noTransactionsMessage = page.locator('.no-transactions-message, .alert-info:has-text("No transactions found")');
    this.noTransactionsForCardMessage = page.locator('.alert-info:has-text("No transactions found for the selected card")');
    
    // Filter Locators
    this.cardFilterDropdown = page.locator('select[name="cardFilter"], select#cardFilter, [data-testid="card-filter"]');
  }

  async navigateToTransactions() {
    logger.info('Navigating to Transactions section');
    await this.transactionsMenuLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyChronologicalOrder() {
    logger.info('Verifying transactions are in chronological order');
    const count = await this.transactionRows.count();
    if (count === 0) return true;
    
    const dates = [];
    for (let i = 0; i < Math.min(count, 10); i++) {
      const row = this.transactionRows.nth(i);
      const text = await row.textContent();
      const dateMatch = text.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}/);
      if (dateMatch) dates.push(new Date(dateMatch[0]));
    }
    
    for (let i = 1; i < dates.length; i++) {
      if (dates[i] > dates[i-1]) return false;
    }
    
    return true;
  }

  async getTransactionDetails(rowIndex) {
    logger.info(`Getting transaction details for row: ${rowIndex}`);
    const row = this.transactionRows.nth(rowIndex);
    await expect(row).toBeVisible();
    const text = await row.textContent();
    
    const merchantMatch = text.match(/([A-Za-z\s&]+)(?=\s+\$|\s+[A-Z][a-z]{2}\s+\d)/);
    const amountMatch = text.match(/\$\d+\.\d{2}/);
    const dateMatch = text.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}/);
    const cardMatch = text.match(/(Visa|Mastercard|Amex|Discover)[^\*]*\*{4}\d{4}/);
    
    return {
      merchantName: merchantMatch ? merchantMatch[1].trim() : null,
      amount: amountMatch ? amountMatch[0] : null,
      date: dateMatch ? dateMatch[0] : null,
      card: cardMatch ? cardMatch[0].trim() : null
    };
  }

  async getTotalTransactionCount() {
    logger.info('Getting total transaction count');
    const countText = await this.page.locator('.transaction-count, [data-testid="total-count"]').textContent();
    const match = countText.match(/\d+/);
    return match ? parseInt(match[0]) : await this.transactionRows.count();
  }

  async getCardFilterOptions() {
    logger.info('Getting card filter options');
    await expect(this.cardFilterDropdown).toBeVisible();
    const options = await this.cardFilterDropdown.locator('option').allTextContents();
    return options.map(opt => opt.trim());
  }

  async selectCardFilter(cardName) {
    logger.info(`Selecting card filter: ${cardName}`);
    await expect(this.cardFilterDropdown).toBeVisible();
    await this.cardFilterDropdown.selectOption({ label: cardName });
    await this.page.waitForLoadState('networkidle');
  }

  async getVisibleTransactionCount() {
    logger.info('Getting visible transaction count');
    return await this.transactionRows.count();
  }

  async getAllVisibleTransactionCards() {
    logger.info('Getting all visible transaction card types');
    const count = await this.transactionRows.count();
    const cards = [];
    
    for (let i = 0; i < count; i++) {
      const row = this.transactionRows.nth(i);
      const text = await row.textContent();
      const cardMatch = text.match(/(Visa|Mastercard|Amex|Discover)[^\*]*\*{4}\d{4}/);
      if (cardMatch) cards.push(cardMatch[0].trim());
    }
    
    return cards;
  }

  async hasTransactionsFromOtherCards(excludedCards) {
    logger.info('Checking for transactions from other cards');
    const allCards = await this.getAllVisibleTransactionCards();
    return allCards.some(card => excludedCards.some(excluded => card.includes(excluded)));
  }

  async getAllUniqueCardTypes() {
    logger.info('Getting all unique card types');
    const allCards = await this.getAllVisibleTransactionCards();
    const uniqueTypes = [...new Set(allCards.map(card => {
      const match = card.match(/(Visa|Mastercard|Amex|Discover)\s+([A-Za-z]+)/);
      return match ? `${match[1]} ${match[2]}` : null;
    }).filter(Boolean))];
    
    return uniqueTypes;
  }
};

const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.MultiCardPage = class MultiCardPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.cardManagementContainer = page.locator('.multi-card-container');
    this.cardPanels = page.locator('.card-panel');
    this.selectedCard = page.locator('.selected-card');
    this.cardDetailsSection = page.locator('.panel-info');
    this.emptyStateMessage = page.locator('.empty-state-message');
    this.errorMessage = page.locator('.alert-danger');
    this.noTransactionMessage = page.locator('.no-transaction-message');
    this.cardManagementLink = page.locator('a[href="#/cards"]');
  }

  async navigateToCardManagement() {
    logger.info('Navigating to card management interface');
    await this.cardManagementLink.click();
    await expect(this.cardManagementContainer).toBeVisible();
    logger.info('Card management interface loaded');
  }

  async getCardCount() {
    logger.info('Counting credit cards');
    await expect(this.cardManagementContainer).toBeVisible();
    const count = await this.cardPanels.count();
    logger.info(`Total cards displayed: ${count}`);
    return count;
  }

  async selectCard(cardNumber) {
    logger.info(`Selecting card: ${cardNumber}`);
    const cardPanel = this.page.locator(`.card-panel:has-text("${cardNumber}")`);
    await expect(cardPanel).toBeVisible();
    await cardPanel.click();
    await expect(this.selectedCard).toBeVisible();
    logger.info(`Card ${cardNumber} selected`);
  }

  async verifyCardDetails(index, expectedDetails) {
    logger.info(`Verifying details for card at index ${index}`);
    const cardPanel = this.cardPanels.nth(index);
    await expect(cardPanel).toBeVisible();
    
    const cardNumber = await cardPanel.locator('strong').textContent();
    expect(cardNumber.trim()).toBe(expectedDetails.number);
    logger.debug(`Card number verified: ${cardNumber}`);
    
    const cardType = await cardPanel.locator('h4').textContent();
    expect(cardType.trim()).toBe(expectedDetails.type);
    logger.debug(`Card type verified: ${cardType}`);
    
    const issuerText = await cardPanel.locator('p:has-text("Issuer:")').textContent();
    expect(issuerText).toContain(expectedDetails.issuer);
    logger.debug(`Issuer verified: ${expectedDetails.issuer}`);
    
    const limitText = await cardPanel.locator('p:has-text("Credit Limit:")').textContent();
    const limitValue = parseFloat(limitText.replace(/[^0-9.]/g, ''));
    expect(limitValue).toBe(expectedDetails.limit);
    logger.debug(`Credit limit verified: $${limitValue}`);
    
    const availableText = await cardPanel.locator('p:has-text("Available:")').textContent();
    const availableValue = parseFloat(availableText.replace(/[^0-9.]/g, ''));
    expect(availableValue).toBe(expectedDetails.available);
    logger.debug(`Available credit verified: $${availableValue}`);
    
    const outstandingText = await cardPanel.locator('p:has-text("Outstanding:")').textContent();
    const outstandingValue = parseFloat(outstandingText.replace(/[^0-9.]/g, ''));
    expect(outstandingValue).toBe(expectedDetails.outstanding);
    logger.debug(`Outstanding amount verified: $${outstandingValue}`);
    
    logger.info(`Card ${index} details verified successfully`);
  }

  async getCardSpendingMetrics() {
    logger.info('Retrieving card spending metrics');
    await expect(this.cardDetailsSection).toBeVisible();
    
    const totalSpendText = await this.cardDetailsSection.locator('p:has-text("Monthly Spend:")').textContent();
    const totalSpend = parseFloat(totalSpendText.replace(/[^0-9.]/g, ''));
    
    const transactionCountText = await this.cardDetailsSection.locator('p:has-text("Total Transactions:")').textContent();
    const transactionCount = parseInt(transactionCountText.replace(/[^0-9]/g, ''));
    
    const avgTransactionText = await this.cardDetailsSection.locator('p:has-text("Average Transaction:")').textContent();
    const averageTransaction = parseFloat(avgTransactionText.replace(/[^0-9.]/g, ''));
    
    const metrics = {
      totalSpend,
      transactionCount,
      averageTransaction
    };
    
    logger.info(`Metrics retrieved: Total=$${totalSpend}, Count=${transactionCount}, Avg=$${averageTransaction}`);
    return metrics;
  }

  async getCategoryBreakdown() {
    logger.info('Retrieving category breakdown');
    await expect(this.cardDetailsSection).toBeVisible();
    
    const categories = {};
    const categoryRows = await this.cardDetailsSection.locator('.category-row').all();
    
    for (const row of categoryRows) {
      const categoryName = await row.locator('.category-name').textContent();
      const amountText = await row.locator('.category-amount').textContent();
      const amount = parseFloat(amountText.replace(/[^0-9.]/g, ''));
      categories[categoryName.trim()] = amount;
    }
    
    logger.info(`Category breakdown retrieved: ${JSON.stringify(categories)}`);
    return categories;
  }

  async getEmptyStateMessage() {
    logger.debug('Checking for empty state message');
    if (await this.emptyStateMessage.isVisible()) {
      const message = await this.emptyStateMessage.textContent();
      logger.info(`Empty state message: ${message}`);
      return message;
    }
    return '';
  }

  async getErrorMessage() {
    logger.debug('Checking for error message');
    if (await this.errorMessage.isVisible()) {
      const message = await this.errorMessage.textContent();
      logger.warn(`Error message: ${message}`);
      return message;
    }
    return '';
  }

  async getNoTransactionMessage() {
    logger.debug('Checking for no transaction message');
    if (await this.noTransactionMessage.isVisible()) {
      const message = await this.noTransactionMessage.textContent();
      logger.info(`No transaction message: ${message}`);
      return message;
    }
    return '';
  }
};
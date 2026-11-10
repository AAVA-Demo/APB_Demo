const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { AuthHelper } = require('./helpers/auth.helper');
const { Logger } = require('./utils/logger');

test.describe('Card Management - Multiple Credit Card Portfolio', () => {
  let cardManagementPage;
  let authHelper;
  let logger;

  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    authHelper = new AuthHelper(page);
    logger = new Logger();
    await authHelper.authenticate();
  });

  test('QE-10387 TS-001 TC-001: Verify card management displays all cards with masked numbers', async ({ page }) => {
    logger.info('Test Case ID: QE-10387 TS-001 TC-001');
    const userId = 'user-multi-cards-001';
    
    await authHelper.authenticateAsUser(userId);
    await cardManagementPage.navigateToCardManagement();
    
    const cards = await cardManagementPage.getAllCards();
    expect(cards.length).toBeGreaterThan(0);
    logger.info(`Retrieved ${cards.length} credit cards`);
    
    for (const card of cards) {
      // Validate masked card number format
      expect(card.cardNumber).toMatch(/^\*{4}\s\*{4}\s\*{4}\s\d{4}$/);
      logger.info(`Card number masked correctly: ${card.cardNumber}`);
      
      // Validate required fields
      expect(card.cardType).toBeTruthy();
      expect(card.balance).toBeGreaterThanOrEqual(0);
      expect(card.creditLimit).toBeGreaterThan(0);
      expect(['Active', 'Inactive']).toContain(card.status);
      logger.info(`Card: ${card.cardType}, Balance: $${card.balance}, Limit: $${card.creditLimit}, Status: ${card.status}`);
    }
  });

  test('QE-10387 TS-001 TC-002: Verify card holder name and issuer information display', async ({ page }) => {
    logger.info('Test Case ID: QE-10387 TS-001 TC-002');
    const userId = 'user-card-details-001';
    
    await authHelper.authenticateAsUser(userId);
    await cardManagementPage.navigateToCardManagement();
    
    const cards = await cardManagementPage.getAllCards();
    
    for (const card of cards) {
      expect(card.cardHolderName).toBeTruthy();
      expect(card.cardHolderName.length).toBeGreaterThan(0);
      expect(card.issuer).toBeTruthy();
      logger.info(`Card Holder: ${card.cardHolderName}, Issuer: ${card.issuer}`);
    }
  });

  test('QE-10387 TS-002 TC-001: Verify empty state message when no cards registered', async ({ page }) => {
    logger.info('Test Case ID: QE-10387 TS-002 TC-001');
    const userId = 'user-no-cards-001';
    
    await authHelper.authenticateAsUser(userId);
    await cardManagementPage.navigateToCardManagement();
    
    const cards = await cardManagementPage.getAllCards();
    expect(cards.length).toBe(0);
    logger.info('Verified no cards are returned');
    
    // Verify no errors
    const errors = await page.evaluate(() => window.errors || []);
    expect(errors.length).toBe(0);
    
    // Verify empty state message
    await expect(cardManagementPage.emptyStateMessage).toBeVisible();
    const messageText = await cardManagementPage.emptyStateMessage.textContent();
    expect(messageText).toContain('No cards are registered');
    logger.info(`Empty state message: ${messageText}`);
    
    // Verify actionable options
    const hasActionButton = await cardManagementPage.hasActionableOption();
    expect(hasActionButton).toBeTruthy();
    logger.info('Actionable option (Add Card/Contact Support) is present');
  });

  test('QE-10387 TS-003 TC-001: Verify 10 cards retrieved within 1 second performance threshold', async ({ page }) => {
    logger.info('Test Case ID: QE-10387 TS-003 TC-001');
    const userId = 'user-max-cards-001';
    
    await authHelper.authenticateAsUser(userId);
    
    const startTime = Date.now();
    await cardManagementPage.navigateToCardManagement();
    const cards = await cardManagementPage.getAllCards();
    const endTime = Date.now();
    
    const elapsedTime = endTime - startTime;
    expect(cards.length).toBe(10);
    expect(elapsedTime).toBeLessThanOrEqual(1000);
    logger.info(`Retrieved ${cards.length} cards in ${elapsedTime}ms (threshold: 1000ms)`);
    
    // Validate all cards have complete data
    for (const card of cards) {
      expect(card.cardId).toBeTruthy();
      expect(card.cardNumber).toBeTruthy();
      expect(card.cardType).toBeTruthy();
      expect(card.balance).toBeGreaterThanOrEqual(0);
      expect(card.creditLimit).toBeGreaterThan(0);
      expect(card.status).toBeTruthy();
    }
    logger.info('All 10 cards have complete data');
  });
});

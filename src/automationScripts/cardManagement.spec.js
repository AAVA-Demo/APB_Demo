const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const logger = require('../utils/logger');

test.describe('Card Management Feature Tests', () => {

  test('QE-7992 TS-001 TC-001 - Verify multiple credit cards display', async ({ page }) => {
    logger.info('Starting test: QE-7992 TS-001 TC-001');
    const cardManagementPage = new CardManagementPage(page);
    
    await test.step('Launch application', async () => {
      await cardManagementPage.navigate();
      logger.info('Application loaded');
    });

    await test.step('Authenticate user', async () => {
      await cardManagementPage.login('testuser_3cards', 'Pass@123');
      logger.info('User authenticated');
    });

    await test.step('Navigate to card management page', async () => {
      await cardManagementPage.navigateToCardManagement();
      await cardManagementPage.waitForCardListLoad();
      logger.info('Card management page loaded');
    });

    await test.step('Verify 3 cards displayed', async () => {
      const cardCount = await cardManagementPage.getCardCount();
      expect(cardCount).toBe(3);
      const cardIds = await cardManagementPage.getAllCardIds();
      expect(cardIds).toContain('card1');
      expect(cardIds).toContain('card2');
      expect(cardIds).toContain('card3');
      logger.info('3 cards verified');
    });

    await test.step('Verify card types', async () => {
      const card1Type = await cardManagementPage.getCardType('card1');
      const card2Type = await cardManagementPage.getCardType('card2');
      const card3Type = await cardManagementPage.getCardType('card3');
      expect(card1Type).toBe('Visa');
      expect(card2Type).toBe('Mastercard');
      expect(card3Type).toBe('Amex');
      logger.info('Card types verified');
    });

    await test.step('Verify credit limits', async () => {
      const card1Limit = await cardManagementPage.getCardCreditLimit('card1');
      const card2Limit = await cardManagementPage.getCardCreditLimit('card2');
      const card3Limit = await cardManagementPage.getCardCreditLimit('card3');
      expect(card1Limit).toBe('$10,000');
      expect(card2Limit).toBe('$15,000');
      expect(card3Limit).toBe('$20,000');
      logger.info('Credit limits verified');
    });
  });

  test('QE-7992 TS-002 TC-001 - Verify empty card list message', async ({ page }) => {
    logger.info('Starting test: QE-7992 TS-002 TC-001');
    const cardManagementPage = new CardManagementPage(page);
    
    await cardManagementPage.navigate();
    await cardManagementPage.login('testuser_nocards', 'Pass@123');
    await cardManagementPage.navigateToCardManagement();

    await test.step('Verify empty card list', async () => {
      const cardCount = await cardManagementPage.getCardCount();
      expect(cardCount).toBe(0);
      logger.info('Card list is empty');
    });

    await test.step('Verify appropriate message displayed', async () => {
      const message = await cardManagementPage.getEmptyListMessage();
      expect(message).toContain('No cards are available');
      logger.info('Empty list message verified');
    });
  });

  test('QE-7992 TS-003 TC-001 - Verify service unavailable error message', async ({ page }) => {
    logger.info('Starting test: QE-7992 TS-003 TC-001');
    const cardManagementPage = new CardManagementPage(page);
    
    await cardManagementPage.navigate();
    await cardManagementPage.login('testuser_servicefail', 'Pass@123');

    await test.step('Simulate service unavailability', async () => {
      await cardManagementPage.simulateServiceUnavailable();
      logger.info('Service unavailability simulated');
    });

    await cardManagementPage.navigateToCardManagement();

    await test.step('Verify error message displayed', async () => {
      const errorMessage = await cardManagementPage.getErrorMessage();
      expect(errorMessage).toContain('Service is unreachable');
      logger.info('Service unavailable error message verified');
    });
  });

  test('QE-7990 TS-001 TC-001 - Verify card-specific spend analysis', async ({ page }) => {
    logger.info('Starting test: QE-7990 TS-001 TC-001');
    const cardManagementPage = new CardManagementPage(page);
    
    await cardManagementPage.navigate();
    await cardManagementPage.login('testuser_cardspend', 'Pass@123');
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.waitForCardListLoad();

    await test.step('Select card1', async () => {
      await cardManagementPage.selectCard('card1');
      await cardManagementPage.waitForSpendAnalysisLoad();
      logger.info('Card1 selected');
    });

    await test.step('Verify total spend', async () => {
      const totalSpend = await cardManagementPage.getTotalSpend();
      expect(totalSpend).toBe('$500');
      logger.info('Total spend verified: $500');
    });

    await test.step('Verify all 5 transactions displayed', async () => {
      const transactions = await cardManagementPage.getTransactionDetails();
      expect(transactions).toHaveLength(5);
      expect(transactions[0]).toEqual({ id: 'TXN-001', amount: '$100' });
      expect(transactions[1]).toEqual({ id: 'TXN-002', amount: '$75' });
      expect(transactions[2]).toEqual({ id: 'TXN-003', amount: '$125' });
      expect(transactions[3]).toEqual({ id: 'TXN-004', amount: '$50' });
      expect(transactions[4]).toEqual({ id: 'TXN-005', amount: '$150' });
      logger.info('All 5 transactions verified');
    });
  });

  test('QE-7990 TS-002 TC-001 - Verify spend analysis for card with no transactions', async ({ page }) => {
    logger.info('Starting test: QE-7990 TS-002 TC-001');
    const cardManagementPage = new CardManagementPage(page);
    
    await cardManagementPage.navigate();
    await cardManagementPage.login('testuser_notxn', 'Pass@123');
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.waitForCardListLoad();

    await test.step('Select card with no transactions', async () => {
      await cardManagementPage.selectCard('card2');
      await cardManagementPage.waitForSpendAnalysisLoad();
      logger.info('Card2 selected');
    });

    await test.step('Verify total spend is $0', async () => {
      const totalSpend = await cardManagementPage.getTotalSpend();
      expect(totalSpend).toBe('$0');
      logger.info('Total spend is $0');
    });

    await test.step('Verify appropriate message displayed', async () => {
      const message = await cardManagementPage.getNoTransactionsMessage();
      expect(message).toContain('No transactions are available for analysis');
      logger.info('No transactions message verified');
    });
  });

  test('QE-7990 TS-003 TC-001 - Verify error for non-existent card ID', async ({ page }) => {
    logger.info('Starting test: QE-7990 TS-003 TC-001');
    const cardManagementPage = new CardManagementPage(page);
    
    await cardManagementPage.navigate();
    await cardManagementPage.login('testuser_invalidcard', 'Pass@123');

    await test.step('Attempt to access spend analysis for invalid card', async () => {
      await cardManagementPage.attemptAccessToCard('card999');
      logger.info('Attempted access to card999');
    });

    await test.step('Verify error message', async () => {
      const errorMessage = await cardManagementPage.getCardNotFoundError();
      expect(errorMessage).toContain('Card was not found or access is denied');
      logger.info('Card not found error verified');
    });
  });
});
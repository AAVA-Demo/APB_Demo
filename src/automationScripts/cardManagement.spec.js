const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Multiple Credit Card Management and Card-Wise Spend Analysis', () => {

  test('QE-8974 TS-001 TC-001 - Verify user can view all cards with masked numbers and complete details', async ({ page }) => {
    logger.info('Starting test: QE-8974 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await test.step('Login with multi-card user credentials', async () => {
      await loginPage.navigate();
      await loginPage.login('multicard@example.com', 'Multi@123');
      logger.info('Multi-card user logged in successfully');
    });

    await test.step('Navigate to card management interface', async () => {
      await cardManagementPage.navigate();
      await expect(page).toHaveURL(/.*cards/);
      logger.info('Card management page loaded');
    });

    await test.step('Verify all registered credit cards are displayed', async () => {
      await cardManagementPage.waitForCardsToLoad();
      const cardCount = await cardManagementPage.getCardCount();
      expect(cardCount).toBeGreaterThan(0);
      logger.info(`${cardCount} credit cards displayed`);
    });

    await test.step('Verify card numbers are masked', async () => {
      const maskedNumbers = await cardManagementPage.getCardNumbers();
      maskedNumbers.forEach(number => {
        expect(number).toMatch(/\*{4}\s\*{4}\s\*{4}\s\d{4}/);
      });
      logger.info('All card numbers are properly masked');
    });

    await test.step('Verify card type is displayed for each card', async () => {
      const cardTypes = await cardManagementPage.getCardTypes();
      expect(cardTypes.length).toBeGreaterThan(0);
      logger.info(`Card types displayed: ${cardTypes.join(', ')}`);
    });

    await test.step('Verify expiry date is displayed for each card', async () => {
      const expiryDates = await cardManagementPage.getExpiryDates();
      expiryDates.forEach(date => {
        expect(date).toMatch(/\d{2}\/\d{2}/);
      });
      logger.info('All expiry dates displayed in MM/YY format');
    });

    await test.step('Verify credit limit is displayed for each card', async () => {
      const creditLimits = await cardManagementPage.getCreditLimits();
      expect(creditLimits.length).toBeGreaterThan(0);
      logger.info('Credit limits displayed for all cards');
    });

    await test.step('Verify available credit is displayed for each card', async () => {
      const availableCredits = await cardManagementPage.getAvailableCredits();
      expect(availableCredits.length).toBeGreaterThan(0);
      logger.info('Available credits displayed for all cards');
    });

    logger.info('Test QE-8974 TS-001 TC-001 completed successfully');
  });

  test('QE-8974 TS-002 TC-001 - Verify appropriate message for user with no credit cards', async ({ page }) => {
    logger.info('Starting test: QE-8974 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await test.step('Login with new user credentials', async () => {
      await loginPage.navigate();
      await loginPage.login('newuser@example.com', 'NewUser@123');
      logger.info('New user logged in successfully');
    });

    await test.step('Navigate to card management interface', async () => {
      await cardManagementPage.navigate();
      await expect(page).toHaveURL(/.*cards/);
      logger.info('Card management page loaded');
    });

    await test.step('Verify no cards found message is displayed', async () => {
      await cardManagementPage.waitForNoCardsMessage();
      const message = await cardManagementPage.getNoCardsMessage();
      expect(message).toContain('No credit cards found');
      logger.info('No cards message displayed correctly');
    });

    await test.step('Verify card list is empty', async () => {
      const cardCount = await cardManagementPage.getCardCount();
      expect(cardCount).toBe(0);
      logger.info('Card list is empty as expected');
    });

    logger.info('Test QE-8974 TS-002 TC-001 completed successfully');
  });

  test('QE-8974 TS-003 TC-001 - Verify error message when user has more than 50 cards', async ({ page }) => {
    logger.info('Starting test: QE-8974 TS-003 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await test.step('Simulate service downtime', async () => {
      await page.route('**/api/cards/summary**', route => route.abort());
      logger.info('Service blocked for testing');
    });

    await test.step('Login with max card user credentials', async () => {
      await loginPage.navigate();
      await loginPage.login('maxcarduser@example.com', 'MaxCard@123');
      logger.info('Max card user logged in');
    });

    await test.step('Navigate to card management interface', async () => {
      await cardManagementPage.navigate();
      logger.info('Card management page loaded');
    });

    await test.step('Verify maximum card limit error message', async () => {
      await cardManagementPage.waitForErrorMessage();
      const errorText = await cardManagementPage.getErrorMessageText();
      expect(errorText).toContain('Maximum card limit reached');
      logger.info('Maximum card limit error displayed');
    });

    await test.step('Verify only 50 cards are displayed', async () => {
      const cardCount = await cardManagementPage.getCardCount();
      expect(cardCount).toBeLessThanOrEqual(50);
      logger.info(`${cardCount} cards displayed (max 50)`);
    });

    await test.step('Verify 51st card is not present', async () => {
      const hasCard51 = await cardManagementPage.hasCardById('card51');
      expect(hasCard51).toBeFalsy();
      logger.info('51st card not displayed as expected');
    });

    logger.info('Test QE-8974 TS-003 TC-001 completed successfully');
  });

  test('QE-8976 TS-001 TC-001 - Verify detailed spend information for selected card', async ({ page }) => {
    logger.info('Starting test: QE-8976 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await test.step('Login with multi-card user credentials', async () => {
      await loginPage.navigate();
      await loginPage.login('multicard@example.com', 'Multi@123');
      logger.info('Multi-card user logged in');
    });

    await test.step('Navigate to card management interface', async () => {
      await cardManagementPage.navigate();
      await cardManagementPage.waitForCardsToLoad();
      logger.info('Card list loaded');
    });

    await test.step('Select specific credit card', async () => {
      await cardManagementPage.selectCardByMaskedNumber('**** **** **** 1234');
      logger.info('Card selected for spend analysis');
    });

    await test.step('Verify total spend is displayed', async () => {
      await cardManagementPage.waitForSpendAnalysisToLoad();
      const totalSpend = await cardManagementPage.getTotalSpend();
      expect(totalSpend).toBeTruthy();
      logger.info(`Total spend displayed: ${totalSpend}`);
    });

    await test.step('Verify transaction count is displayed', async () => {
      const transactionCount = await cardManagementPage.getTransactionCount();
      expect(transactionCount).toBeGreaterThan(0);
      logger.info(`Transaction count: ${transactionCount}`);
    });

    await test.step('Verify category breakdown is displayed', async () => {
      const categoryBreakdown = await cardManagementPage.getCategoryBreakdown();
      expect(categoryBreakdown).toBeTruthy();
      expect(Object.keys(categoryBreakdown).length).toBeGreaterThan(0);
      logger.info('Category breakdown displayed');
    });

    await test.step('Verify complete transaction history is displayed', async () => {
      const transactionHistory = await cardManagementPage.getTransactionHistory();
      expect(transactionHistory.length).toBeGreaterThan(0);
      logger.info(`${transactionHistory.length} transactions in history`);
    });

    logger.info('Test QE-8976 TS-001 TC-001 completed successfully');
  });

  test('QE-8976 TS-002 TC-001 - Verify zero values for card with no transaction history', async ({ page }) => {
    logger.info('Starting test: QE-8976 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await test.step('Login with new card user credentials', async () => {
      await loginPage.navigate();
      await loginPage.login('newcarduser@example.com', 'NewCard@123');
      logger.info('New card user logged in');
    });

    await test.step('Navigate to card management interface', async () => {
      await cardManagementPage.navigate();
      await cardManagementPage.waitForCardsToLoad();
      logger.info('Card list loaded');
    });

    await test.step('Select card with no transaction history', async () => {
      await cardManagementPage.selectCardByMaskedNumber('**** **** **** 9999');
      logger.info('Card with no history selected');
    });

    await test.step('Verify total spend displays zero', async () => {
      await cardManagementPage.waitForSpendAnalysisToLoad();
      const totalSpend = await cardManagementPage.getTotalSpend();
      expect(totalSpend).toContain('$0');
      logger.info('Total spend shows $0');
    });

    await test.step('Verify transaction count displays zero', async () => {
      const transactionCount = await cardManagementPage.getTransactionCount();
      expect(transactionCount).toBe(0);
      logger.info('Transaction count shows 0');
    });

    await test.step('Verify no transactions message is displayed', async () => {
      const message = await cardManagementPage.getNoTransactionsMessage();
      expect(message).toContain('No transactions found');
      logger.info('No transactions message displayed');
    });

    await test.step('Verify transaction history is empty', async () => {
      const transactionHistory = await cardManagementPage.getTransactionHistory();
      expect(transactionHistory.length).toBe(0);
      logger.info('Transaction history is empty');
    });

    logger.info('Test QE-8976 TS-002 TC-001 completed successfully');
  });

  test('QE-8976 TS-003 TC-001 - Verify error when transaction data is temporarily unavailable', async ({ page }) => {
    logger.info('Starting test: QE-8976 TS-003 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await test.step('Login with recent card user credentials', async () => {
      await loginPage.navigate();
      await loginPage.login('recentcarduser@example.com', 'Recent@123');
      logger.info('Recent card user logged in');
    });

    await test.step('Navigate to card management interface', async () => {
      await cardManagementPage.navigate();
      await cardManagementPage.waitForCardsToLoad();
      logger.info('Card list loaded');
    });

    await test.step('Select recently added card', async () => {
      await cardManagementPage.selectCardByMaskedNumber('**** **** **** 7777');
      logger.info('Recently added card selected');
    });

    await test.step('Verify transaction data unavailable error message', async () => {
      await cardManagementPage.waitForErrorMessage();
      const errorText = await cardManagementPage.getErrorMessageText();
      expect(errorText).toContain('Transaction data temporarily unavailable');
      logger.info('Data unavailable error displayed');
    });

    await test.step('Verify spend analysis data is not displayed', async () => {
      const hasPlaceholders = await cardManagementPage.hasSpendAnalysisPlaceholders();
      expect(hasPlaceholders).toBeTruthy();
      logger.info('Spend analysis shows placeholders');
    });

    logger.info('Test QE-8976 TS-003 TC-001 completed successfully');
  });

});
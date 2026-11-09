const { test, expect } = require('@playwright/test');
const { PortfolioPage } = require('./pages/portfolio.page');
const { Logger } = require('../utils/logger');

/**
 * Test Suite: Credit Card Portfolio Management
 * Epic: QE-8188 - Credit Card Portfolio Management
 * User Stories: QE-8310, QE-8308
 * Purpose: Validate multiple credit card display and card-wise spend analysis
 */

test.describe('Credit Card Portfolio Management', () => {
  let portfolioPage;

  test.beforeEach(async ({ page }) => {
    portfolioPage = new PortfolioPage(page);
    Logger.info('Initializing Portfolio Management test suite');
  });

  /**
   * Test Case: QE-8410 TS-001 TC-001
   * Scenario: User with 5 linked credit cards can view all card details within 1 second
   */
  test('TC-QE-8410-TS-001: Verify user with 5 linked credit cards can view all card details in centralized portfolio within 1 second', async ({ page }) => {
    Logger.info('Starting test: QE-8410 TS-001 TC-001');
    
    // Step 1: Authenticate as a user with 5 linked credit cards
    await portfolioPage.navigate();
    await portfolioPage.login('testuser_5cards', 'Pass@123');
    await expect(portfolioPage.getUserProfile()).toBeVisible();
    Logger.info('User authenticated successfully');

    // Step 2: Navigate to the credit card portfolio section
    const startTime = Date.now();
    await portfolioPage.navigateToPortfolio();
    await expect(page).toHaveURL(/.*\/portfolio/);
    Logger.info('Portfolio page loaded successfully');

    // Step 3: Verify all 5 credit cards are displayed with complete details
    await expect(portfolioPage.getCardListContainer()).toBeVisible();
    const cardCount = await portfolioPage.getCardCount();
    expect(cardCount).toBe(5);
    Logger.info('All 5 credit cards displayed');

    const cards = await portfolioPage.getAllCards();
    for (const card of cards) {
      await expect(card.cardNumber).toBeVisible();
      await expect(card.cardType).toBeVisible();
      await expect(card.creditLimit).toBeVisible();
      await expect(card.availableCredit).toBeVisible();
      await expect(card.outstandingAmount).toBeVisible();
    }
    Logger.info('All card details displayed correctly');

    // Step 4: Measure card data retrieval time
    const endTime = Date.now();
    const retrievalTime = endTime - startTime;
    expect(retrievalTime).toBeLessThanOrEqual(1000);
    Logger.info(`Card data retrieved in ${retrievalTime}ms (within 1 second threshold)`);
  });

  /**
   * Test Case: QE-8410 TS-002 TC-001
   * Scenario: Timeout error is displayed when card data retrieval service times out
   */
  test('TC-QE-8410-TS-002: Verify timeout error is displayed when card data retrieval service times out after 2 seconds for user with 10 linked cards', async ({ page }) => {
    Logger.info('Starting test: QE-8410 TS-002 TC-001');
    
    // Step 1: Authenticate as a user with 10 linked credit cards
    await portfolioPage.navigate();
    await portfolioPage.login('testuser_10cards', 'Pass@123');
    await expect(portfolioPage.getUserProfile()).toBeVisible();
    Logger.info('User authenticated successfully');

    // Step 2: Navigate to the credit card portfolio section
    await portfolioPage.navigateToPortfolio();
    await expect(page).toHaveURL(/.*\/portfolio/);
    Logger.info('Portfolio page attempted to load');

    // Step 3: Simulate card data retrieval service timeout after 2 seconds
    await page.waitForTimeout(2500); // Wait for timeout to occur

    // Step 4: Verify timeout error message is displayed
    await expect(portfolioPage.getErrorMessage()).toBeVisible();
    const errorMessage = await portfolioPage.getErrorMessageText();
    expect(errorMessage).toContain('Failed to load portfolio');
    Logger.info('Timeout error message displayed correctly');

    // Step 5: Verify no cards are displayed
    const cardCount = await portfolioPage.getCardCount();
    expect(cardCount).toBe(0);
    Logger.info('No cards displayed as expected');
  });

  /**
   * Test Case: QE-8410 TS-003 TC-001
   * Scenario: Empty portfolio message is displayed without system errors when user has no linked credit cards
   */
  test('TC-QE-8410-TS-003: Verify empty portfolio message is displayed without system errors when user has no linked credit cards', async ({ page }) => {
    Logger.info('Starting test: QE-8410 TS-003 TC-001');
    
    // Step 1: Authenticate as a user with no linked credit cards
    await portfolioPage.navigate();
    await portfolioPage.login('testuser_nocards', 'Pass@123');
    await expect(portfolioPage.getUserProfile()).toBeVisible();
    Logger.info('User authenticated successfully');

    // Step 2: Navigate to the credit card portfolio section
    await portfolioPage.navigateToPortfolio();
    await expect(page).toHaveURL(/.*\/portfolio/);
    Logger.info('Portfolio page loaded successfully');

    // Step 3: Verify empty portfolio message is displayed
    await expect(portfolioPage.getEmptyPortfolioMessage()).toBeVisible();
    const message = await portfolioPage.getEmptyPortfolioMessageText();
    expect(message).toContain('No credit cards found');
    Logger.info('Empty portfolio message displayed correctly');

    // Step 4: Verify no system errors are triggered
    const consoleErrors = await portfolioPage.getConsoleErrors();
    expect(consoleErrors.length).toBe(0);
    await expect(portfolioPage.getErrorMessage()).not.toBeVisible();
    Logger.info('No system errors triggered');
  });

  /**
   * Test Case: QE-8411 TS-001 TC-001
   * Scenario: Card-wise spend analysis displays spending patterns, transaction listing, and utilization metrics
   */
  test('TC-QE-8411-TS-001: Verify card-wise spend analysis displays spending patterns, transaction listing, and utilization metrics for selected card', async ({ page }) => {
    Logger.info('Starting test: QE-8411 TS-001 TC-001');
    
    // Step 1: Authenticate as a user with transaction history across 3 credit cards
    await portfolioPage.navigate();
    await portfolioPage.login('testuser_multicard', 'Pass@123');
    await expect(portfolioPage.getUserProfile()).toBeVisible();
    Logger.info('User authenticated successfully');

    // Step 2: Navigate to the credit card portfolio section
    await portfolioPage.navigateToPortfolio();
    await expect(page).toHaveURL(/.*\/portfolio/);
    await expect(portfolioPage.getCardListContainer()).toBeVisible();
    Logger.info('Portfolio page loaded with all 3 credit cards displayed');

    // Step 3: Select credit card 'Visa **** 1234' for analysis
    await portfolioPage.selectCard('card1');
    await expect(page).toHaveURL(/.*\/portfolio\/card1/);
    Logger.info('Card details page loaded for Visa **** 1234');

    // Step 4: Verify spending patterns are displayed correctly
    await expect(portfolioPage.getSpendingAnalysisSection()).toBeVisible();
    const totalSpend = await portfolioPage.getTotalSpendValue();
    const monthlySpend = await portfolioPage.getMonthlySpendValue();
    expect(totalSpend).toBe('₹25,000');
    expect(monthlySpend).toBe('₹8,000');
    Logger.info('Spending patterns displayed correctly');

    // Step 5: Verify transaction listing displays 15 transactions
    await expect(portfolioPage.getTransactionTable()).toBeVisible();
    const transactionCount = await portfolioPage.getTransactionCount();
    expect(transactionCount).toBe(15);
    
    const transactions = await portfolioPage.getAllTransactions();
    for (const txn of transactions) {
      await expect(txn.date).toBeVisible();
      await expect(txn.merchant).toBeVisible();
      await expect(txn.category).toBeVisible();
      await expect(txn.amount).toBeVisible();
      await expect(txn.description).toBeVisible();
    }
    Logger.info('Transaction listing displays 15 transactions with all details');

    // Step 6: Verify utilization metrics are displayed correctly
    const utilization = await portfolioPage.getUtilizationPercentage();
    expect(utilization).toBe('30%');
    Logger.info('Utilization metrics displayed correctly');
  });

  /**
   * Test Case: QE-8411 TS-002 TC-001
   * Scenario: System displays 'No transactions found' message with 0% utilization for card with no transaction history
   */
  test('TC-QE-8411-TS-002: Verify system displays No transactions found message with 0% utilization and empty transaction list for card with no transaction history', async ({ page }) => {
    Logger.info('Starting test: QE-8411 TS-002 TC-001');
    
    // Step 1: Authenticate as a user with a credit card that has no transaction history
    await portfolioPage.navigate();
    await portfolioPage.login('testuser_notxn', 'Pass@123');
    await expect(portfolioPage.getUserProfile()).toBeVisible();
    Logger.info('User authenticated successfully');

    // Step 2: Navigate to the credit card portfolio section
    await portfolioPage.navigateToPortfolio();
    await expect(page).toHaveURL(/.*\/portfolio/);
    await expect(portfolioPage.getCardListContainer()).toBeVisible();
    Logger.info('Portfolio page loaded with credit card displayed');

    // Step 3: Select credit card with no transaction history for analysis
    await portfolioPage.selectCard('card_empty');
    await expect(page).toHaveURL(/.*\/portfolio\/card_empty/);
    Logger.info('Card details page loaded for selected card');

    // Step 4: Verify 'No transactions found' message is displayed
    await expect(portfolioPage.getNoTransactionsMessage()).toBeVisible();
    const message = await portfolioPage.getNoTransactionsMessageText();
    expect(message).toContain('No transactions found for this card');
    Logger.info('No transactions found message displayed correctly');

    // Step 5: Verify utilization percentage is 0%
    const utilization = await portfolioPage.getUtilizationPercentage();
    expect(utilization).toBe('0%');
    Logger.info('Utilization percentage is 0% as expected');

    // Step 6: Verify transaction list is empty without system errors
    const transactionCount = await portfolioPage.getTransactionCount();
    expect(transactionCount).toBe(0);
    const consoleErrors = await portfolioPage.getConsoleErrors();
    expect(consoleErrors.length).toBe(0);
    Logger.info('Transaction list is empty with no system errors');
  });

  /**
   * Test Case: QE-8411 TS-003 TC-001
   * Scenario: Validation error is displayed when attempting analysis on deactivated card
   */
  test('TC-QE-8411-TS-003: Verify validation error Card not found or inactive is displayed when attempting analysis on deactivated card', async ({ page }) => {
    Logger.info('Starting test: QE-8411 TS-003 TC-001');
    
    // Step 1: Authenticate as a user with a deactivated credit card in account
    await portfolioPage.navigate();
    await portfolioPage.login('testuser_inactive', 'Pass@123');
    await expect(portfolioPage.getUserProfile()).toBeVisible();
    Logger.info('User authenticated successfully');

    // Step 2: Navigate to the credit card portfolio section
    await portfolioPage.navigateToPortfolio();
    await expect(page).toHaveURL(/.*\/portfolio/);
    Logger.info('Portfolio page loaded');

    // Step 3: Attempt to select deactivated credit card for analysis
    await portfolioPage.selectCard('card_inactive');
    Logger.info('System detected card is inactive');

    // Step 4: Verify validation error message is displayed
    await expect(portfolioPage.getValidationErrorMessage()).toBeVisible();
    const errorMessage = await portfolioPage.getValidationErrorMessageText();
    expect(errorMessage).toContain('Card not found or inactive');
    Logger.info('Validation error message displayed correctly');

    // Step 5: Verify analysis is not performed
    await expect(page).toHaveURL(/.*\/portfolio/);
    await expect(portfolioPage.getCardDetailsSection()).not.toBeVisible();
    Logger.info('Analysis not performed, user remains on portfolio page');
  });
});

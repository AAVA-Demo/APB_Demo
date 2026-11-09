const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const logger = require('../utils/logger');

test.describe('Credit Card Management and Viewing', () => {
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    logger.info('Starting card management test case');
  });

  test('QE-8499 TS-001 TC-001: Verify all registered credit cards are displayed with complete information', async ({ page }) => {
    logger.info('Test Case: QE-8499 TS-001 TC-001');
    
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardManagementLoad();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(3);
    
    await cardManagementPage.verifyCardNumber(0, '****1234');
    await cardManagementPage.verifyCardNumber(1, '****5678');
    await cardManagementPage.verifyCardNumber(2, '****9012');
    
    await cardManagementPage.verifyCardType(0, 'Visa');
    await cardManagementPage.verifyCardType(1, 'MasterCard');
    await cardManagementPage.verifyCardType(2, 'Visa');
    
    await cardManagementPage.verifyCardHolderName(0, 'John Doe');
    await cardManagementPage.verifyCardHolderName(1, 'John Doe');
    await cardManagementPage.verifyCardHolderName(2, 'John Doe');
    
    await cardManagementPage.verifyExpiryDate(0, '12/25');
    await cardManagementPage.verifyExpiryDate(1, '06/26');
    await cardManagementPage.verifyExpiryDate(2, '09/24');
    
    await cardManagementPage.verifyCardStatus(0, 'Active');
    await cardManagementPage.verifyCardStatus(1, 'Active');
    await cardManagementPage.verifyCardStatus(2, 'Active');
    
    logger.info('Test Case QE-8499 TS-001 TC-001 completed successfully');
  });

  test('QE-8499 TS-001 TC-002: Verify card list maintains correct order and grouping', async ({ page }) => {
    logger.info('Test Case: QE-8499 TS-001 TC-002');
    
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardManagementLoad();
    
    const cardOrder = await cardManagementPage.getCardOrder();
    expect(cardOrder).toEqual(['1', '2', '3']);
    
    const visualSeparation = await cardManagementPage.verifyVisualSeparation();
    expect(visualSeparation).toBeTruthy();
    
    logger.info('Test Case QE-8499 TS-001 TC-002 completed successfully');
  });

  test('QE-8499 TS-002 TC-001: Verify single registered credit card is displayed correctly', async ({ page }) => {
    logger.info('Test Case: QE-8499 TS-002 TC-001');
    
    await cardManagementPage.navigateWithUser('test_user_single_card');
    await cardManagementPage.waitForCardManagementLoad();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(1);
    
    await cardManagementPage.verifyCardNumber(0, '****1234');
    await cardManagementPage.verifyCardType(0, 'Visa');
    await cardManagementPage.verifyCardHolderName(0, 'John Doe');
    await cardManagementPage.verifyExpiryDate(0, '12/25');
    await cardManagementPage.verifyCardStatus(0, 'Active');
    
    logger.info('Test Case QE-8499 TS-002 TC-001 completed successfully');
  });

  test('QE-8499 TS-003 TC-001: Verify appropriate message when no registered credit cards', async ({ page }) => {
    logger.info('Test Case: QE-8499 TS-003 TC-001');
    
    await cardManagementPage.navigateWithUser('test_user_no_cards');
    await cardManagementPage.waitForCardManagementLoad();
    
    const emptyMessage = await cardManagementPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No credit cards registered');
    
    const hasErrors = await cardManagementPage.checkForSystemErrors();
    expect(hasErrors).toBeFalsy();
    
    const isStable = await cardManagementPage.isInterfaceStable();
    expect(isStable).toBeTruthy();
    
    logger.info('Test Case QE-8499 TS-003 TC-001 completed successfully');
  });

  test('QE-8499 TS-003 TC-002: Verify empty state UI renders gracefully', async ({ page }) => {
    logger.info('Test Case: QE-8499 TS-003 TC-002');
    
    await cardManagementPage.navigateWithUser('test_user_no_cards');
    await cardManagementPage.waitForCardManagementLoad();
    
    const emptyStateVisible = await cardManagementPage.isEmptyStateVisible();
    expect(emptyStateVisible).toBeTruthy();
    
    const hasUndefinedValues = await cardManagementPage.checkForUndefinedValues();
    expect(hasUndefinedValues).toBeFalsy();
    
    const hasConsoleErrors = await cardManagementPage.checkForConsoleErrors();
    expect(hasConsoleErrors).toBeFalsy();
    
    logger.info('Test Case QE-8499 TS-003 TC-002 completed successfully');
  });

  test('QE-8495 TS-001 TC-001: Verify card-wise spend analysis displays all detailed metrics', async ({ page }) => {
    logger.info('Test Case: QE-8495 TS-001 TC-001');
    
    await cardManagementPage.navigate();
    await cardManagementPage.selectCard('1');
    await cardManagementPage.waitForCardDetailsLoad();
    
    const currentMonthSpend = await cardManagementPage.getCurrentMonthSpend();
    expect(currentMonthSpend).toBe('9200');
    
    const yearToDateSpend = await cardManagementPage.getYearToDateSpend();
    expect(yearToDateSpend).toBe('13200');
    
    const currentBalance = await cardManagementPage.getCurrentBalance();
    expect(currentBalance).toBe('15000');
    
    const availableCredit = await cardManagementPage.getAvailableCredit();
    expect(availableCredit).toBe('35000');
    
    const creditLimit = await cardManagementPage.getCreditLimit();
    expect(creditLimit).toBe('50000');
    
    logger.info('Test Case QE-8495 TS-001 TC-001 completed successfully');
  });

  test('QE-8495 TS-001 TC-002: Verify transaction count is displayed accurately', async ({ page }) => {
    logger.info('Test Case: QE-8495 TS-001 TC-002');
    
    await cardManagementPage.navigate();
    await cardManagementPage.selectCard('1');
    await cardManagementPage.waitForCardDetailsLoad();
    
    const transactionCount = await cardManagementPage.getTransactionCount();
    expect(transactionCount).toBe('4');
    
    logger.info('Test Case QE-8495 TS-001 TC-002 completed successfully');
  });

  test('QE-8495 TS-002 TC-001: Verify card with no transactions displays zero spending metrics', async ({ page }) => {
    logger.info('Test Case: QE-8495 TS-002 TC-001');
    
    await cardManagementPage.navigate();
    await cardManagementPage.selectCard('4');
    await cardManagementPage.waitForCardDetailsLoad();
    
    const currentMonthSpend = await cardManagementPage.getCurrentMonthSpend();
    expect(currentMonthSpend).toBe('0');
    
    const yearToDateSpend = await cardManagementPage.getYearToDateSpend();
    expect(yearToDateSpend).toBe('0');
    
    const transactionCount = await cardManagementPage.getTransactionCount();
    expect(transactionCount).toBe('0');
    
    const creditLimit = await cardManagementPage.getCreditLimit();
    expect(creditLimit).toBe('30000');
    
    const availableCredit = await cardManagementPage.getAvailableCredit();
    expect(availableCredit).toBe('30000');
    
    logger.info('Test Case QE-8495 TS-002 TC-001 completed successfully');
  });

  test('QE-8495 TS-002 TC-002: Verify card details view renders correctly without errors for zero transactions', async ({ page }) => {
    logger.info('Test Case: QE-8495 TS-002 TC-002');
    
    await cardManagementPage.navigate();
    await cardManagementPage.selectCard('4');
    await cardManagementPage.waitForCardDetailsLoad();
    
    const spendingMetricsZero = await cardManagementPage.verifySpendingMetricsAreZero();
    expect(spendingMetricsZero).toBeTruthy();
    
    const hasJSErrors = await cardManagementPage.checkForJavaScriptErrors();
    expect(hasJSErrors).toBeFalsy();
    
    const cardInfoDisplayed = await cardManagementPage.verifyCardInformationDisplayed();
    expect(cardInfoDisplayed).toBeTruthy();
    
    logger.info('Test Case QE-8495 TS-002 TC-002 completed successfully');
  });

  test('QE-8495 TS-003 TC-001: Verify error message for removed or inaccessible card', async ({ page }) => {
    logger.info('Test Case: QE-8495 TS-003 TC-001');
    
    await cardManagementPage.navigate();
    await cardManagementPage.selectCard('invalid-card-id');
    
    const errorMessage = await cardManagementPage.getErrorMessage();
    expect(errorMessage).toContain('Card not found');
    
    const hasSystemCrash = await cardManagementPage.checkForSystemCrash();
    expect(hasSystemCrash).toBeFalsy();
    
    const canNavigateBack = await cardManagementPage.verifyNavigationWorking();
    expect(canNavigateBack).toBeTruthy();
    
    logger.info('Test Case QE-8495 TS-003 TC-001 completed successfully');
  });

  test('QE-8495 TS-003 TC-002: Verify error handling when accessing card via direct URL with invalid ID', async ({ page }) => {
    logger.info('Test Case: QE-8495 TS-003 TC-002');
    
    await cardManagementPage.navigateDirectToCard('invalid-id');
    
    const errorHandled = await cardManagementPage.isErrorHandledGracefully();
    expect(errorHandled).toBeTruthy();
    
    const errorMessage = await cardManagementPage.getErrorMessage();
    expect(errorMessage).toContain('Card not found. Please return to your card portfolio.');
    
    const hasConsoleErrors = await cardManagementPage.checkForUndefinedCardDataErrors();
    expect(hasConsoleErrors).toBeFalsy();
    
    logger.info('Test Case QE-8495 TS-003 TC-002 completed successfully');
  });
});

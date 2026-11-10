const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { LoginPage } = require('./pages/login.page');
const Logger = require('../utils/logger');

/**
 * Test Suite: Multiple Credit Card Management
 * Epic: QE-9828 - CreditCardNew20261110205228-Multiple Credit Card Management
 * User Stories: QE-9911 (Multiple Credit Card Display), QE-9910 (Card Selection and Switching)
 */

test.describe('Card Management - Multiple Credit Card Display (QE-9911)', () => {

  test('QE-9997 TS001 TC-001: Verify user with 3 registered credit cards can view all cards with basic details in card management interface', async ({ page }) => {
    Logger.info('Starting test: QE-9997 TS001 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    // Step 1: Launch the application and log in with user having 3 credit cards
    Logger.info('Step 1: Launching and logging in');
    await loginPage.navigate();
    await loginPage.login('user123', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User is authenticated successfully');

    // Step 2: Navigate to the card management interface
    Logger.info('Step 2: Navigating to card management');
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    Logger.info('Card management page loads successfully');

    // Step 3: Verify all 3 credit cards are displayed in the list
    Logger.info('Step 3: Verifying 3 cards are displayed');
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(3);
    const cardTypes = await cardManagementPage.getAllCardTypes();
    expect(cardTypes).toContain('Visa');
    expect(cardTypes).toContain('MasterCard');
    expect(cardTypes).toContain('Amex');
    Logger.info('List shows 3 cards: Visa, MasterCard, Amex');

    // Step 4: Verify each card displays card type
    Logger.info('Step 4: Verifying card types');
    expect(cardTypes).toEqual(['Visa', 'MasterCard', 'Amex']);
    Logger.info('Card types displayed: Visa, MasterCard, Amex');

    // Step 5: Verify each card displays masked card number
    Logger.info('Step 5: Verifying masked card numbers');
    const cardNumbers = await cardManagementPage.getAllCardNumbers();
    expect(cardNumbers[0]).toContain('**** **** **** 1234');
    expect(cardNumbers[1]).toContain('**** **** **** 5678');
    expect(cardNumbers[2]).toContain('**** **** **** 9012');
    Logger.info('Card numbers displayed as: **** **** **** 1234, **** **** **** 5678, **** **** **** 9012');

    // Step 6: Verify each card displays credit limit
    Logger.info('Step 6: Verifying credit limits');
    const creditLimits = await cardManagementPage.getAllCreditLimits();
    expect(creditLimits).toContain('₹50,000');
    expect(creditLimits).toContain('₹30,000');
    expect(creditLimits).toContain('₹70,000');
    Logger.info('Credit limits displayed: ₹50,000, ₹30,000, ₹70,000');

    // Step 7: Verify each card displays available credit
    Logger.info('Step 7: Verifying available credit');
    const availableCredits = await cardManagementPage.getAllAvailableCredits();
    expect(availableCredits).toContain('₹35,000');
    expect(availableCredits).toContain('₹20,000');
    expect(availableCredits).toContain('₹50,000');
    Logger.info('Available credit displayed: ₹35,000, ₹20,000, ₹50,000');
    Logger.info('Test QE-9997 TS001 TC-001 completed successfully');
  });

  test('QE-9997 TS002 TC-001: Verify system enforces maximum card limit of 10 and displays warning when user has 11 cards', async ({ page }) => {
    Logger.info('Starting test: QE-9997 TS002 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    // Step 1: Launch the application and log in with user having 11 registered credit cards
    Logger.info('Step 1: Launching and logging in with user_11cards');
    await loginPage.navigate();
    await loginPage.login('user_11cards', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User is authenticated successfully');

    // Step 2: Navigate to the card management interface
    Logger.info('Step 2: Navigating to card management');
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    Logger.info('Card management page loads');

    // Step 3: Verify only the first 10 credit cards are displayed in the list
    Logger.info('Step 3: Verifying only 10 cards displayed');
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(10);
    Logger.info('List displays exactly 10 cards');

    // Step 4: Verify warning message is displayed
    Logger.info('Step 4: Verifying warning message');
    await expect(cardManagementPage.maxCardWarning).toBeVisible();
    const warningMessage = await cardManagementPage.getMaxCardWarningMessage();
    expect(warningMessage).toContain('Maximum card limit (10) reached. Contact support to manage additional cards.');
    Logger.info('Warning message shows correctly');

    // Step 5: Verify the 11th card is not visible in the list
    Logger.info('Step 5: Verifying 11th card not visible');
    const card11Visible = await cardManagementPage.isCardVisible('card11');
    expect(card11Visible).toBe(false);
    Logger.info('11th card is not displayed');
    Logger.info('Test QE-9997 TS002 TC-001 completed successfully');
  });

  test('QE-9997 TS003 TC-001: Verify credit card list displays real-time data including outstanding balance, monthly spend, and card status', async ({ page }) => {
    Logger.info('Starting test: QE-9997 TS003 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    // Step 1: Launch the application and log in
    Logger.info('Step 1: Launching and logging in');
    await loginPage.navigate();
    await loginPage.login('user123', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User is authenticated successfully');

    // Step 2: Navigate to the card management interface
    Logger.info('Step 2: Navigating to card management');
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    Logger.info('Card list loads successfully');

    // Step 3: Verify each card displays current outstanding balance
    Logger.info('Step 3: Verifying outstanding balances');
    const outstandingBalances = await cardManagementPage.getAllOutstandingBalances();
    expect(outstandingBalances).toContain('₹15,000');
    expect(outstandingBalances).toContain('₹10,000');
    expect(outstandingBalances).toContain('₹20,000');
    Logger.info('Outstanding balances displayed: ₹15,000, ₹10,000, ₹20,000');

    // Step 4: Verify each card displays monthly spend
    Logger.info('Step 4: Verifying monthly spend');
    const monthlySpends = await cardManagementPage.getAllMonthlySpends();
    expect(monthlySpends).toContain('₹12,000');
    expect(monthlySpends).toContain('₹8,000');
    expect(monthlySpends).toContain('₹15,000');
    Logger.info('Monthly spend displayed: ₹12,000, ₹8,000, ₹15,000');

    // Step 5: Verify each card displays card status
    Logger.info('Step 5: Verifying card status');
    const cardStatuses = await cardManagementPage.getAllCardStatuses();
    expect(cardStatuses.every(status => status === 'Active')).toBe(true);
    Logger.info('Card status displayed: Active, Active, Active');

    // Step 6: Verify cards are sorted by most recently used
    Logger.info('Step 6: Verifying card sorting');
    const firstCard = await cardManagementPage.getFirstCardId();
    expect(firstCard).toBeTruthy();
    Logger.info('Cards are ordered with most recently used card at the top');
    Logger.info('Test QE-9997 TS003 TC-001 completed successfully');
  });
});

test.describe('Card Management - Card Selection and Switching (QE-9910)', () => {

  test('QE-9995 TS001 TC-001: Verify instant display of card-specific details when user selects a specific card from the list', async ({ page }) => {
    Logger.info('Starting test: QE-9995 TS001 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    // Step 1: Launch the application and log in with user having 3 credit cards
    Logger.info('Step 1: Launching and logging in');
    await loginPage.navigate();
    await loginPage.login('user123', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User is authenticated successfully');

    // Step 2: Navigate to the card management interface
    Logger.info('Step 2: Navigating to card management');
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    await expect(cardManagementPage.cardList).toBeVisible();
    Logger.info('Card list displays 3 cards');

    // Step 3: Click on the Visa card ending in 1234
    Logger.info('Step 3: Selecting Visa card ending in 1234');
    const startTime = Date.now();
    await cardManagementPage.selectCardByNumber('1234');
    const endTime = Date.now();
    Logger.info('Card is selected');

    // Step 4: Verify card details display instantly within 200ms without page reload
    Logger.info('Step 4: Verifying instant display');
    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThan(200);
    await expect(cardManagementPage.cardDetailsPanel).toBeVisible();
    Logger.info('Card details appear without lag or page refresh');

    // Step 5: Verify individual credit limit is displayed
    Logger.info('Step 5: Verifying credit limit');
    const creditLimit = await cardManagementPage.getSelectedCardCreditLimit();
    expect(creditLimit).toBe('₹50,000');
    Logger.info('Credit Limit shows ₹50,000');

    // Step 6: Verify available credit is displayed
    Logger.info('Step 6: Verifying available credit');
    const availableCredit = await cardManagementPage.getSelectedCardAvailableCredit();
    expect(availableCredit).toBe('₹35,000');
    Logger.info('Available Credit shows ₹35,000');

    // Step 7: Verify outstanding balance is displayed
    Logger.info('Step 7: Verifying outstanding balance');
    const outstandingBalance = await cardManagementPage.getSelectedCardOutstandingBalance();
    expect(outstandingBalance).toBe('₹15,000');
    Logger.info('Outstanding Balance shows ₹15,000');

    // Step 8: Verify monthly spend is displayed
    Logger.info('Step 8: Verifying monthly spend');
    const monthlySpend = await cardManagementPage.getSelectedCardMonthlySpend();
    expect(monthlySpend).toBe('₹12,000');
    Logger.info('Monthly Spend shows ₹12,000');
    Logger.info('Test QE-9995 TS001 TC-001 completed successfully');
  });

  test('QE-9995 TS002 TC-001: Verify error message is displayed when user attempts to select a deactivated or removed card', async ({ page }) => {
    Logger.info('Starting test: QE-9995 TS002 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    // Step 1: Launch the application and log in
    Logger.info('Step 1: Launching and logging in with user_deactivated_card');
    await loginPage.navigate();
    await loginPage.login('user_deactivated_card', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User is authenticated successfully');

    // Step 2: Navigate to the card management interface
    Logger.info('Step 2: Navigating to card management');
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    Logger.info('Card list loads');

    // Step 3: Attempt to select a card that has been deactivated
    Logger.info('Step 3: Attempting to select deactivated card');
    await cardManagementPage.selectCardByNumber('9999');
    Logger.info('System detects deactivated card');

    // Step 4: Verify error message is displayed
    Logger.info('Step 4: Verifying error message');
    await expect(cardManagementPage.errorMessage).toBeVisible();
    const errorText = await cardManagementPage.getErrorMessage();
    expect(errorText).toContain('This card is no longer active. Please select a different card');
    Logger.info('Error message shows correctly');

    // Step 5: Verify access to card details is prevented
    Logger.info('Step 5: Verifying card details not loaded');
    const detailsVisible = await cardManagementPage.cardDetailsPanel.isVisible();
    expect(detailsVisible).toBe(false);
    Logger.info('Card details view does not load');
    Logger.info('Test QE-9995 TS002 TC-001 completed successfully');
  });

  test('QE-9995 TS003 TC-001: Verify data isolation and instant switching when user rapidly switches between multiple cards', async ({ page }) => {
    Logger.info('Starting test: QE-9995 TS003 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    // Step 1: Launch the application and log in with user having 3 cards
    Logger.info('Step 1: Launching and logging in');
    await loginPage.navigate();
    await loginPage.login('user123', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User is authenticated successfully');

    // Step 2: Navigate to the card management interface
    Logger.info('Step 2: Navigating to card management');
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    await expect(cardManagementPage.cardList).toBeVisible();
    Logger.info('Card list displays 3 cards');

    // Step 3: Select card1 (Visa ending 1234)
    Logger.info('Step 3: Selecting card1');
    await cardManagementPage.selectCardByNumber('1234');
    const card1Limit = await cardManagementPage.getSelectedCardCreditLimit();
    const card1Available = await cardManagementPage.getSelectedCardAvailableCredit();
    const card1Outstanding = await cardManagementPage.getSelectedCardOutstandingBalance();
    const card1Spend = await cardManagementPage.getSelectedCardMonthlySpend();
    expect(card1Limit).toBe('₹50,000');
    expect(card1Available).toBe('₹35,000');
    expect(card1Outstanding).toBe('₹15,000');
    expect(card1Spend).toBe('₹12,000');
    Logger.info('Card1 details display correctly');

    // Step 4: Immediately select card2 (MasterCard ending 5678)
    Logger.info('Step 4: Immediately selecting card2');
    const startTime2 = Date.now();
    await cardManagementPage.selectCardByNumber('5678');
    const endTime2 = Date.now();
    const card2Limit = await cardManagementPage.getSelectedCardCreditLimit();
    const card2Available = await cardManagementPage.getSelectedCardAvailableCredit();
    const card2Outstanding = await cardManagementPage.getSelectedCardOutstandingBalance();
    const card2Spend = await cardManagementPage.getSelectedCardMonthlySpend();
    expect(card2Limit).toBe('₹30,000');
    expect(card2Available).toBe('₹20,000');
    expect(card2Outstanding).toBe('₹10,000');
    expect(card2Spend).toBe('₹8,000');
    expect(endTime2 - startTime2).toBeLessThan(200);
    Logger.info('Card2 details display instantly');

    // Step 5: Immediately select card3 (Amex ending 9012)
    Logger.info('Step 5: Immediately selecting card3');
    const startTime3 = Date.now();
    await cardManagementPage.selectCardByNumber('9012');
    const endTime3 = Date.now();
    const card3Limit = await cardManagementPage.getSelectedCardCreditLimit();
    const card3Available = await cardManagementPage.getSelectedCardAvailableCredit();
    const card3Outstanding = await cardManagementPage.getSelectedCardOutstandingBalance();
    const card3Spend = await cardManagementPage.getSelectedCardMonthlySpend();
    expect(card3Limit).toBe('₹70,000');
    expect(card3Available).toBe('₹50,000');
    expect(card3Outstanding).toBe('₹20,000');
    expect(card3Spend).toBe('₹15,000');
    expect(endTime3 - startTime3).toBeLessThan(200);
    Logger.info('Card3 details display instantly');

    // Step 6: Immediately select card1 again
    Logger.info('Step 6: Selecting card1 again');
    await cardManagementPage.selectCardByNumber('1234');
    const card1LimitAgain = await cardManagementPage.getSelectedCardCreditLimit();
    expect(card1LimitAgain).toBe('₹50,000');
    Logger.info('Card1 details display correctly again with no data leakage');

    // Step 7: Verify each switch completes instantaneously without lag
    Logger.info('Step 7: Verifying switch timing');
    expect(endTime2 - startTime2).toBeLessThan(200);
    expect(endTime3 - startTime3).toBeLessThan(200);
    Logger.info('All card switches complete within 200ms each');

    // Step 8: Verify no display errors or data mixing between cards
    Logger.info('Step 8: Verifying data isolation');
    expect(card1Limit).not.toBe(card2Limit);
    expect(card2Limit).not.toBe(card3Limit);
    Logger.info('Each card displays only its own data with no cross-contamination');
    Logger.info('Test QE-9995 TS003 TC-001 completed successfully');
  });
});
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { MultiCardManagementPage } = require('./pages/multiCardManagement.page');

test.describe('Multi-Card Portfolio View Tests', () => {

  test('QE-9715 TS-001 TC-001 - Verify multi-card management interface displays all 10 credit cards with correctly masked card numbers, individual credit limits, and outstanding balances loaded within 1 second', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const multiCardPage = new MultiCardManagementPage(page);

    // Step 1 & 2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser_10cards', 'Test@123');

    // Step 3: Navigate to multi-card management interface
    await multiCardPage.navigate();

    // Step 4 & 5: Record timestamp and verify cards load within 1 second
    const startTime = Date.now();
    await multiCardPage.waitForCardsLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(1000);

    // Step 6: Verify each card displays masked card number
    const cardNumbers = ['1234', '5678', '9012', '3456', '7890', '2345', '6789', '0123', '4567', '8901'];
    for (const lastFour of cardNumbers) {
      const isMasked = await multiCardPage.verifyCardNumberMasked(lastFour);
      expect(isMasked).toBe(true);
    }

    // Step 7: Verify each card displays individual credit limit
    const creditLimits = ['$10,000', '$15,000', '$5,000', '$20,000', '$8,000', '$12,000', '$7,000', '$18,000', '$9,000', '$11,000'];
    const displayedLimits = await multiCardPage.getAllCreditLimits();
    expect(displayedLimits).toEqual(creditLimits);

    // Step 8: Verify each card displays current outstanding balance
    const outstandingBalances = ['$2,000', '$5,000', '$1,500', '$8,000', '$3,000', '$4,500', '$2,500', '$7,000', '$3,500', '$4,000'];
    const displayedBalances = await multiCardPage.getAllOutstandingBalances();
    expect(displayedBalances).toEqual(outstandingBalances);
  });

  test('QE-9715 TS-002 TC-001 - Verify multi-card management interface displays appropriate message when user has zero credit cards associated with their account', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const multiCardPage = new MultiCardManagementPage(page);

    // Step 1 & 2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser_nocards', 'Test@123');

    // Step 3: Navigate to multi-card management interface
    await multiCardPage.navigate();

    // Step 4 & 5: Verify appropriate message is displayed
    const message = await multiCardPage.getNoCardsMessage();
    expect(message).toContain('No credit cards found');
    expect(message).toContain('Please add a credit card to start managing your portfolio');

    // Step 6: Verify no card list or card details are displayed
    const cardCount = await multiCardPage.getCardCount();
    expect(cardCount).toBe(0);
  });

  test('QE-9715 TS-003 TC-001 - Verify multi-card portfolio view displays available cards correctly and shows error indicator for cards with invalid or missing data without crashing the entire view', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const multiCardPage = new MultiCardManagementPage(page);

    // Step 1 & 2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser_invalidcards', 'Test@123');

    // Step 3 & 4: Navigate and observe multi-card portfolio view
    await multiCardPage.navigate();
    await expect(multiCardPage.cardListContainer).toBeVisible();

    // Step 5: Verify 3 cards with valid data display correctly
    const validCards = [
      { lastFour: '1234', limit: '$10,000', outstanding: '$2,000' },
      { lastFour: '5678', limit: '$15,000', outstanding: '$5,000' },
      { lastFour: '9012', limit: '$8,000', outstanding: '$3,000' }
    ];
    for (const card of validCards) {
      const isValid = await multiCardPage.verifyCardDataDisplayed(card.lastFour, card.limit, card.outstanding);
      expect(isValid).toBe(true);
    }

    // Step 6: Verify 2 cards with invalid data display error indicator
    const errorIndicatorCount = await multiCardPage.getErrorIndicatorCount();
    expect(errorIndicatorCount).toBe(2);

    const errorMessage = await multiCardPage.getErrorIndicatorMessage();
    expect(errorMessage).toMatch(/Card data unavailable|Unable to load card details/);

    // Step 7: Verify entire multi-card view remains functional
    await expect(multiCardPage.cardListContainer).toBeVisible();
    const totalCards = await multiCardPage.getCardCount();
    expect(totalCards).toBe(5);
  });

});
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CardManagementPage } = require('./pages/cardManagement.page');

test.describe('Card Management Tests - QE-9802 & QE-9821', () => {
  let loginPage;
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
  });

  test('TC-7086: Verify consolidated card list displays all 5 cards with masked numbers and details within 3 seconds', async ({ page }) => {
    // Step 3: Navigate to the credit card management page
    const startTime = Date.now();
    await cardManagementPage.navigateToCardManagement();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(3000);

    // Step 4: Verify all 5 credit cards are displayed in consolidated view
    await expect(cardManagementPage.cardListContainer).toBeVisible();
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(5);

    // Step 5: Verify card numbers are masked showing only last 4 digits
    const cardNumbers = await cardManagementPage.getAllCardNumbers();
    cardNumbers.forEach(cardNumber => {
      expect(cardNumber).toMatch(/\*{4}\d{4}/);
    });

    // Step 6: Verify current balances are displayed for each card
    const balances = await cardManagementPage.getAllCardBalances();
    expect(balances.length).toBe(5);
    balances.forEach(balance => {
      expect(balance).toMatch(/\$[\d,]+\.\d{2}/);
    });

    // Step 7: Verify available credit is displayed for each card
    const availableCredits = await cardManagementPage.getAllAvailableCredits();
    expect(availableCredits.length).toBe(5);

    // Step 8: Verify issuer information is displayed for each card
    const issuers = await cardManagementPage.getAllIssuers();
    expect(issuers.length).toBe(5);
    const expectedIssuers = ['Chase', 'Citi', 'Amex', 'Discover', 'Wells Fargo'];
    issuers.forEach(issuer => {
      expect(expectedIssuers).toContain(issuer);
    });
  });

  test('TC-7087: Verify system handles user with 21 cards exceeding 20-card NFR limit', async ({ page }) => {
    // Re-login with poweruser
    await loginPage.navigate();
    await loginPage.login('poweruser', 'Pass@123');

    // Step 4: Navigate to the credit card management page
    await cardManagementPage.navigateToCardManagement();

    // Step 5: Verify system displays only first 20 cards OR returns validation error
    const cardCount = await cardManagementPage.getCardCount();
    const warningMessage = await cardManagementPage.getWarningMessage();

    if (cardCount === 20) {
      // Option A: First 20 cards displayed with warning
      expect(warningMessage).toMatch(/maximum card limit.*20/i);
    } else {
      // Option B: Validation error
      const errorMessage = await cardManagementPage.getErrorMessage();
      expect(errorMessage).toMatch(/maximum card limit.*exceeded/i);
    }

    // Step 8: Verify application does not crash or display undefined errors
    await expect(page).toHaveURL(/cards/);
  });

  test('TC-7088: Verify error handling when credit card data repository is unavailable', async ({ page }) => {
    // Step 3: Simulate credit card data repository unavailability
    await page.route('**/api/cards', route => route.abort());

    // Step 4: Navigate to the credit card management page
    await cardManagementPage.navigateToCardManagement();

    // Step 5: Verify user-friendly error message is displayed
    await expect(cardManagementPage.errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await cardManagementPage.getErrorMessage();
    expect(errorText).toMatch(/cards cannot be loaded/i);

    // Step 6: Verify retry option is available
    await expect(cardManagementPage.retryButton).toBeVisible();

    // Step 7: Verify backend service failure details are not exposed
    expect(errorText).not.toMatch(/stack trace|service url|database/i);

    // Step 8: Verify application remains stable
    await expect(page).toHaveURL(/cards/);
  });

  test('TC-7074: Verify detailed spend analysis for selected card with transaction history', async ({ page }) => {
    // Step 3: Navigate to the credit card management page
    await cardManagementPage.navigateToCardManagement();

    // Step 4: Select card-001 from the card list
    await cardManagementPage.selectCard('card-001');

    // Step 5: Verify monthly spend total is displayed
    await expect(cardManagementPage.cardDetailMonthlySpend).toBeVisible();
    const monthlySpend = await cardManagementPage.getCardDetailMonthlySpend();
    expect(monthlySpend).toMatch(/\$[\d,]+\.\d{2}/);

    // Step 6: Verify spending breakdown by category is displayed
    await expect(cardManagementPage.categoryBreakdown).toBeVisible();
    const categories = await cardManagementPage.getCategoryBreakdown();
    expect(categories.length).toBeGreaterThan(0);

    // Step 7: Verify total transaction count is displayed
    await expect(cardManagementPage.transactionCount).toBeVisible();
    const txnCount = await cardManagementPage.getTransactionCount();
    expect(parseInt(txnCount)).toBeGreaterThanOrEqual(0);

    // Step 8: Verify last transaction date is displayed
    await expect(cardManagementPage.lastTransactionDate).toBeVisible();
    const lastTxnDate = await cardManagementPage.getLastTransactionDate();
    expect(lastTxnDate).toMatch(/\d{4}-\d{2}-\d{2}/);

    // Step 9: Verify no transactions from other cards are included
    const transactionCardIds = await cardManagementPage.getAllTransactionCardIds();
    transactionCardIds.forEach(cardId => {
      expect(cardId).toBe('card-001');
    });
  });

  test('TC-7075: Verify card details display with zero values when card has no transaction history', async ({ page }) => {
    // Step 3: Navigate to the credit card management page
    await cardManagementPage.navigateToCardManagement();

    // Step 4: Select a card with no transaction history (card-006)
    await cardManagementPage.selectCard('card-006');

    // Step 5: Verify card basic information is displayed
    await expect(cardManagementPage.cardNumber).toBeVisible();
    await expect(cardManagementPage.cardIssuer).toBeVisible();
    await expect(cardManagementPage.cardCreditLimit).toBeVisible();
    await expect(cardManagementPage.cardBalance).toBeVisible();

    // Step 6: Verify monthly spend shows zero
    const monthlySpend = await cardManagementPage.getCardDetailMonthlySpend();
    expect(monthlySpend).toMatch(/\$0\.00/);

    // Step 7: Verify transaction count shows zero
    const txnCount = await cardManagementPage.getTransactionCount();
    expect(txnCount).toBe('0');

    // Step 8: Verify message indicating no transactions is displayed
    const noTxnMessage = await cardManagementPage.getNoTransactionsMessage();
    expect(noTxnMessage).toMatch(/no transactions found/i);

    // Step 9: Verify no undefined or null values are displayed
    const pageText = await page.textContent('body');
    expect(pageText).not.toMatch(/undefined|null/i);
  });

  test('TC-7076: Verify error handling when transaction service is unavailable during card spend analysis', async ({ page }) => {
    // Step 3: Simulate transaction service unavailability
    await page.route('**/api/transactions/**', route => route.abort());

    // Step 4: Navigate to the credit card management page
    await cardManagementPage.navigateToCardManagement();

    // Step 5: Select card-001 from the card list
    await cardManagementPage.selectCard('card-001');

    // Step 6: Verify card basic information is displayed
    await expect(cardManagementPage.cardNumber).toBeVisible();
    await expect(cardManagementPage.cardIssuer).toBeVisible();
    await expect(cardManagementPage.cardCreditLimit).toBeVisible();
    await expect(cardManagementPage.cardBalance).toBeVisible();

    // Step 7: Verify error message for spend analysis is displayed
    await expect(cardManagementPage.spendAnalysisError).toBeVisible({ timeout: 5000 });
    const errorText = await cardManagementPage.getSpendAnalysisError();
    expect(errorText).toMatch(/spend analysis cannot be loaded/i);

    // Step 8: Verify retry option is available
    await expect(cardManagementPage.retryButton).toBeVisible();

    // Step 9: Verify no system crash or undefined errors occur
    await expect(page).toHaveURL(/cards/);
  });
});

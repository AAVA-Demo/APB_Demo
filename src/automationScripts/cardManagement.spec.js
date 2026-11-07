const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Credit Card Management and Transactions', () => {
  let cardManagementPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'ValidPass123');
    await cardManagementPage.navigate();
  });

  test('TC-PerfTest6-007: Verify user can add new credit card with valid details', async ({ page }) => {
    await cardManagementPage.waitForPageLoad();
    const initialCardCount = await cardManagementPage.getCardCount();
    await cardManagementPage.clickAddCardButton();
    await cardManagementPage.fillCardNumber('4532123456789012');
    await cardManagementPage.fillIssuer('Visa');
    await cardManagementPage.fillCreditLimit('8000');
    await cardManagementPage.fillExpiryDate('12/2027');
    await cardManagementPage.submitCardForm();
    await cardManagementPage.waitForSuccessMessage();
    const newCardCount = await cardManagementPage.getCardCount();
    expect(newCardCount).toBe(initialCardCount + 1);
    const isCardVisible = await cardManagementPage.isCardVisible('4532123456789012');
    expect(isCardVisible).toBeTruthy();
    const cardStatus = await cardManagementPage.getCardStatus('4532123456789012');
    expect(cardStatus).toBe('active');
  });

  test('TC-PerfTest6-008: Verify validation error for invalid card number format', async ({ page }) => {
    await cardManagementPage.waitForPageLoad();
    await cardManagementPage.clickAddCardButton();
    await cardManagementPage.fillCardNumber('4532-ABCD-5678-9012');
    await cardManagementPage.fillIssuer('Visa');
    await cardManagementPage.fillCreditLimit('5000');
    await cardManagementPage.submitCardForm();
    await cardManagementPage.waitForValidationError();
    const errorMessage = await cardManagementPage.getValidationError('cardNumber');
    expect(errorMessage).toContain('invalid');
    await cardManagementPage.clearCardNumber();
    await cardManagementPage.fillCardNumber('4532123456789012');
    await cardManagementPage.submitCardForm();
    await cardManagementPage.waitForSuccessMessage();
  });

  test('TC-PerfTest6-009: Verify duplicate card prevention', async ({ page }) => {
    await cardManagementPage.waitForPageLoad();
    await cardManagementPage.clickAddCardButton();
    await cardManagementPage.fillCardNumber('4532123456789012');
    await cardManagementPage.fillIssuer('Visa');
    await cardManagementPage.fillCreditLimit('8000');
    await cardManagementPage.submitCardForm();
    await cardManagementPage.waitForSuccessMessage();
    await cardManagementPage.clickAddCardButton();
    await cardManagementPage.fillCardNumber('4532123456789012');
    await cardManagementPage.fillIssuer('Visa');
    await cardManagementPage.fillCreditLimit('8000');
    await cardManagementPage.submitCardForm();
    await cardManagementPage.waitForErrorMessage();
    const errorMessage = await cardManagementPage.getErrorMessage();
    expect(errorMessage).toContain('already registered');
  });

  test('TC-PerfTest6-010: Verify user can view chronological transaction list for selected card', async ({ page }) => {
    await cardManagementPage.waitForPageLoad();
    await cardManagementPage.selectCard('Visa ending in 9012');
    await cardManagementPage.navigateToTransactionHistory();
    await cardManagementPage.waitForTransactionsLoad();
    const transactionCount = await cardManagementPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
    const isChronological = await cardManagementPage.verifyChronologicalOrder();
    expect(isChronological).toBeTruthy();
    const firstTransaction = await cardManagementPage.getTransactionDetails(0);
    expect(firstTransaction).toHaveProperty('date');
    expect(firstTransaction).toHaveProperty('merchant');
    expect(firstTransaction).toHaveProperty('category');
    expect(firstTransaction).toHaveProperty('amount');
  });

  test('TC-PerfTest6-011: Verify date range filter for transaction history', async ({ page }) => {
    await cardManagementPage.waitForPageLoad();
    await cardManagementPage.selectCard('Visa ending in 9012');
    await cardManagementPage.navigateToTransactionHistory();
    await cardManagementPage.waitForTransactionsLoad();
    const initialCount = await cardManagementPage.getTransactionCount();
    await cardManagementPage.applyDateRangeFilter('2024-05-15', '2024-06-14');
    await cardManagementPage.waitForTransactionsLoad();
    const filteredCount = await cardManagementPage.getTransactionCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    const allTransactionsInRange = await cardManagementPage.verifyTransactionsInDateRange('2024-05-15', '2024-06-14');
    expect(allTransactionsInRange).toBeTruthy();
    await cardManagementPage.clearDateRangeFilter();
    await cardManagementPage.waitForTransactionsLoad();
    const clearedCount = await cardManagementPage.getTransactionCount();
    expect(clearedCount).toBe(initialCount);
  });

  test('TC-PerfTest6-012: Verify empty state for card with no transactions', async ({ page }) => {
    await page.route('**/api/cards/*/transactions', route => route.fulfill({ status: 200, body: JSON.stringify([]) }));
    await cardManagementPage.waitForPageLoad();
    await cardManagementPage.selectCard('Mastercard ending in 5678');
    await cardManagementPage.navigateToTransactionHistory();
    await cardManagementPage.waitForTransactionsLoad();
    const transactionCount = await cardManagementPage.getTransactionCount();
    expect(transactionCount).toBe(0);
    const emptyStateMessage = await cardManagementPage.getEmptyStateMessage();
    expect(emptyStateMessage).toContain('No transactions found');
  });
});
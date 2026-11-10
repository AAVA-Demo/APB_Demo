const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CardManagementPage } = require('./pages/card-management.page');

/**
 * Test Suite: Card-Wise Spend Breakdown Analysis
 * User Story: QE-9295
 * Test Cases: QE-9437 TS-001 TC-001, QE-9437 TS-002 TC-001, QE-9437 TS-003 TC-001
 */

test.describe('Card-Wise Spend Breakdown Analysis', () => {
  let loginPage;
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    await loginPage.navigate();
  });

  /**
   * Test Case ID: QE-9437 TS-001 TC-001
   * Description: Verify user can select a credit card and view detailed spend breakdown with transaction summary
   */
  test('TC-001: User views detailed spend breakdown for selected card', async ({ page }) => {
    // Step 1: Login with multi-card user
    await loginPage.login('multicard_user@demo.com', 'Pass@123');

    // Step 2: Navigate to My Cards page
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.waitForCardsLoad();

    // Step 3: Select specific card (Card1 ****1234)
    await cardManagementPage.selectCardByLastFourDigits('1234');

    // Step 4: Verify card detail page displays total spend
    await expect(cardManagementPage.cardDetailPage).toBeVisible();
    const totalSpend = await cardManagementPage.getCardTotalSpend();
    expect(totalSpend).toMatch(/\$[\d,]+\.\d{2}/);

    // Step 5: Verify available credit is displayed
    const availableCredit = await cardManagementPage.getCardAvailableCredit();
    expect(availableCredit).toMatch(/\$[\d,]+\.\d{2}/);

    // Step 6: Verify current balance is displayed
    const currentBalance = await cardManagementPage.getCardCurrentBalance();
    expect(currentBalance).toMatch(/\$[\d,]+\.\d{2}/);

    // Step 7: Verify transaction summary displays key metrics
    await expect(cardManagementPage.transactionSummary).toBeVisible();
    const totalTransactions = await cardManagementPage.getTotalTransactionsCount();
    expect(totalTransactions).toMatch(/\d+/);
    const lastTransactionDate = await cardManagementPage.getLastTransactionDate();
    expect(lastTransactionDate).toBeTruthy();

    // Step 8: Verify credit utilization percentage is displayed
    const utilization = await cardManagementPage.getCreditUtilizationPercentage();
    expect(utilization).toMatch(/\d+%/);
  });

  /**
   * Test Case ID: QE-9437 TS-002 TC-001
   * Description: Verify card-wise spend breakdown displays correctly for credit card with zero transactions
   */
  test('TC-002: Card with zero transactions displays correctly', async ({ page }) => {
    // Step 1: Login with zero-transaction user
    await loginPage.login('zerotxn_user@demo.com', 'Pass@123');

    // Step 2: Navigate to My Cards and select card with zero transactions
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.selectCardByLastFourDigits('5678');

    // Step 3: Verify total spend displays $0.00
    const totalSpend = await cardManagementPage.getCardTotalSpend();
    expect(totalSpend).toContain('$0.00');

    // Step 4: Verify available credit equals full credit limit
    const availableCredit = await cardManagementPage.getCardAvailableCredit();
    const creditLimit = await cardManagementPage.getCardCreditLimit();
    expect(availableCredit).toBe(creditLimit);

    // Step 5: Verify current balance displays $0.00
    const currentBalance = await cardManagementPage.getCardCurrentBalance();
    expect(currentBalance).toContain('$0.00');

    // Step 6: Verify transaction summary displays zero transactions
    const totalTransactions = await cardManagementPage.getTotalTransactionsCount();
    expect(totalTransactions).toBe('0');
    const lastTransactionDate = await cardManagementPage.getLastTransactionDate();
    expect(lastTransactionDate).toMatch(/N\/A|empty/);

    // Step 7: Verify credit utilization shows 0%
    const utilization = await cardManagementPage.getCreditUtilizationPercentage();
    expect(utilization).toContain('0%');

    // Step 8: Verify no errors and clean empty state
    await expect(cardManagementPage.errorMessage).not.toBeVisible();
    await expect(cardManagementPage.transactionEmptyState).toBeVisible();
  });

  /**
   * Test Case ID: QE-9437 TS-003 TC-001
   * Description: Verify appropriate error message is displayed when user attempts to view spend breakdown for deactivated card
   */
  test('TC-003: Deactivated card displays appropriate error message', async ({ page }) => {
    // Step 1: Login with deactivated-card user
    await loginPage.login('deactivated_card_user@demo.com', 'Pass@123');

    // Step 2: Navigate to My Cards page
    await cardManagementPage.navigateToMyCards();

    // Step 3: Attempt to access deactivated card (via direct URL)
    await page.goto('https://app.creditcard.demo/#/cards/card3_deactivated');

    // Step 4: Verify appropriate error message is displayed
    await expect(cardManagementPage.cardErrorMessage).toBeVisible();
    const errorText = await cardManagementPage.getCardErrorMessageText();
    expect(errorText).toMatch(/no longer available|not found/i);

    // Step 5: Verify user is redirected to safe page
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/cards$|\/dashboard$/);

    // Step 6: Verify no sensitive data or stack traces in error
    expect(errorText).not.toContain('Error:');
    expect(errorText).not.toContain('stack');
  });
});
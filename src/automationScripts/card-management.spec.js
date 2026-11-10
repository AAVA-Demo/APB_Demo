const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CardManagementPage } = require('./pages/card-management.page');

/**
 * Test Suite: Multiple Credit Card Display View
 * User Story: QE-9296
 * Test Cases: QE-9441 TS-001 TC-001, QE-9441 TS-002 TC-001, QE-9441 TS-003 TC-001
 */

test.describe('Multiple Credit Card Display View', () => {
  let loginPage;
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    await loginPage.navigate();
  });

  /**
   * Test Case ID: QE-9441 TS-001 TC-001
   * Description: Verify user with 5 credit cards can view all cards with masked card numbers and correct details
   */
  test('TC-001: User with 5 cards views all cards with masked numbers', async ({ page }) => {
    // Step 1: Login with 5-card user
    await loginPage.login('fivecard_user@demo.com', 'Pass@123');

    // Step 2: Navigate to My Cards page
    await cardManagementPage.navigateToMyCards();

    // Step 3: Verify all 5 cards are displayed
    await cardManagementPage.waitForCardsLoad();
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(5);

    // Step 4: Verify each card displays masked card number (****XXXX format)
    const cardNumbers = await cardManagementPage.getAllCardNumbers();
    cardNumbers.forEach(cardNumber => {
      expect(cardNumber).toMatch(/^\*{4}\d{4}$/);
    });

    // Step 5: Verify each card displays credit limit in currency format
    const creditLimits = await cardManagementPage.getAllCreditLimits();
    creditLimits.forEach(limit => {
      expect(limit).toMatch(/\$[\d,]+\.\d{2}/);
    });

    // Step 6: Verify each card displays current balance
    const balances = await cardManagementPage.getAllCurrentBalances();
    balances.forEach(balance => {
      expect(balance).toMatch(/\$[\d,]+\.\d{2}/);
    });

    // Step 7: Verify portfolio summary displays aggregated totals
    await expect(cardManagementPage.portfolioSummary).toBeVisible();
    const summaryText = await cardManagementPage.getPortfolioSummaryText();
    expect(summaryText).toContain('Total Credit Limit');
    expect(summaryText).toContain('Total Outstanding');
  });

  /**
   * Test Case ID: QE-9441 TS-002 TC-001
   * Description: Verify user with 20 credit cards (system maximum) can view all cards without performance degradation
   */
  test('TC-002: User with 20 cards views all cards without performance issues', async ({ page }) => {
    // Step 1: Login with max-card user (20 cards)
    await loginPage.login('maxcard_user@demo.com', 'Pass@123');

    // Step 2: Navigate to My Cards and measure load time
    const startTime = Date.now();
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.waitForCardsLoad();
    const loadTime = Date.now() - startTime;

    // Verify load time is under 500ms (NFR requirement)
    expect(loadTime).toBeLessThan(500);

    // Step 3: Verify all 20 cards are displayed
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(20);

    // Step 4: Verify all cards display masked card numbers
    const cardNumbers = await cardManagementPage.getAllCardNumbers();
    expect(cardNumbers.length).toBe(20);
    cardNumbers.forEach(cardNumber => {
      expect(cardNumber).toMatch(/^\*{4}\d{4}$/);
    });

    // Step 5: Verify all cards display credit limits and balances
    const creditLimits = await cardManagementPage.getAllCreditLimits();
    expect(creditLimits.length).toBe(20);

    // Step 6: Test scrolling performance - no UI lag
    await cardManagementPage.scrollToBottom();
    await page.waitForTimeout(500);
    await cardManagementPage.scrollToTop();
    await expect(cardManagementPage.firstCardItem).toBeVisible();

    // Step 7: Test filter/sort performance (if available)
    if (await cardManagementPage.sortDropdown.isVisible()) {
      const sortStartTime = Date.now();
      await cardManagementPage.sortByName();
      const sortTime = Date.now() - sortStartTime;
      expect(sortTime).toBeLessThan(1000);
    }
  });

  /**
   * Test Case ID: QE-9441 TS-003 TC-001
   * Description: Verify user with no associated credit cards sees appropriate empty state message
   */
  test('TC-003: User with no cards sees appropriate empty state', async ({ page }) => {
    // Step 1: Login with no-card user
    await loginPage.login('nocard_user@demo.com', 'Pass@123');

    // Step 2: Navigate to My Cards page
    await cardManagementPage.navigateToMyCards();

    // Step 3: Verify empty state message is displayed
    await expect(cardManagementPage.emptyStateMessage).toBeVisible();
    const emptyMessage = await cardManagementPage.getEmptyStateMessageText();
    expect(emptyMessage).toContain('No credit cards found');

    // Step 4: Verify no error messages or stack traces
    await expect(cardManagementPage.errorMessage).not.toBeVisible();

    // Step 5: Verify portfolio summary shows zero totals
    const summaryText = await cardManagementPage.getPortfolioSummaryText();
    expect(summaryText).toContain('$0.00');
  });
});
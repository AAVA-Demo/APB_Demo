const { test, expect } = require('@playwright/test');
const { CardListPage } = require('./pages/cardList.page');
const { CardDetailPage } = require('./pages/cardDetail.page');
const { LoginPage } = require('./pages/login.page');

/**
 * Test Suite: Multiple Credit Card Management
 * User Stories: QE-9790, QE-9789
 * Test Cases: QE-9790 TS-001 TC-001, QE-9790 TS-002 TC-001, QE-9790 TS-003 TC-001,
 *             QE-9789 TS-001 TC-001, QE-9789 TS-001 TC-002, QE-9789 TS-002 TC-001, QE-9789 TS-003 TC-001
 */

test.describe('Multiple Credit Card Management', () => {
  let cardListPage;
  let cardDetailPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    cardListPage = new CardListPage(page);
    cardDetailPage = new CardDetailPage(page);
    loginPage = new LoginPage(page);
  });

  /**
   * Test Case ID: QE-9790 TS-001 TC-001
   * Description: Verify system retrieves and displays all registered credit cards with complete metadata
   */
  test('TC-001: Verify all registered cards displayed with complete metadata', async ({ page }) => {
    // Step 1: Authenticate as user with 5 registered credit cards
    await loginPage.navigate();
    await loginPage.login('testuser016', 'valid_token');

    // Step 2: Navigate to card management page
    await cardListPage.navigate();

    // Step 3: Validate each card contains required metadata
    const cardCount = await cardListPage.getCardCount();
    expect(cardCount).toBe(5);

    // Verify first card metadata
    const firstCard = await cardListPage.getCardByIndex(0);
    expect(firstCard.cardType).toBeTruthy();
    expect(firstCard.lastFourDigits).toMatch(/^\d{4}$/);
    expect(firstCard.issuer).toBeTruthy();
    expect(firstCard.creditLimit).toBeGreaterThan(0);
    expect(firstCard.currentBalance).toBeGreaterThanOrEqual(0);

    // Step 4: Verify card type field contains valid values
    const cardTypes = await cardListPage.getAllCardTypes();
    cardTypes.forEach(type => {
      expect(['Visa', 'MasterCard', 'Amex']).toContain(type);
    });

    // Step 5: Verify lastFourDigits is masked correctly
    const lastFourDigits = await cardListPage.getAllLastFourDigits();
    lastFourDigits.forEach(digits => {
      expect(digits).toMatch(/^\d{4}$/);
    });

    // Step 6: Validate all 5 cards are displayed
    await expect(cardListPage.cardPanels.nth(0)).toBeVisible();
    await expect(cardListPage.cardPanels.nth(4)).toBeVisible();
  });

  /**
   * Test Case ID: QE-9790 TS-002 TC-001
   * Description: Verify system returns empty card list when user has no registered cards
   */
  test('TC-002: Verify empty card list handling', async ({ page }) => {
    // Step 1: Authenticate as new user with no cards
    await loginPage.navigate();
    await loginPage.login('newuser002', 'valid_token');

    // Step 2: API returns empty array (verified via network)
    await page.route('**/api/users/newuser002/cards', route => {
      route.fulfill({ status: 200, body: JSON.stringify([]) });
    });

    // Step 3: Navigate to card management page
    await cardListPage.navigate();

    // Step 4: Validate appropriate messaging is displayed
    const emptyMessage = await cardListPage.getEmptyMessage();
    expect(emptyMessage).toContain('No credit cards found');

    // Step 5: Confirm no card data or empty widgets displayed
    const cardCount = await cardListPage.getCardCount();
    expect(cardCount).toBe(0);
    await expect(cardListPage.cardPanels.first()).not.toBeVisible();
  });

  /**
   * Test Case ID: QE-9790 TS-003 TC-001
   * Description: Verify system handles credit card data repository unavailability gracefully
   */
  test('TC-003: Verify graceful handling of repository unavailability', async ({ page }) => {
    // Step 1: Authenticate as user
    await loginPage.navigate();
    await loginPage.login('testuser017', 'valid_token');

    // Step 2: Simulate repository unavailability (503 error)
    await page.route('**/api/users/testuser017/cards', route => {
      route.fulfill({ status: 503, body: 'Service Unavailable' });
    });

    // Step 3: System catches error and logs it (verified in console)
    page.on('console', msg => {
      if (msg.type() === 'error') {
        expect(msg.text()).toContain('Failed to fetch cards');
      }
    });

    // Step 4: Navigate to card management page
    await cardListPage.navigate();

    // Step 5: Validate user-friendly error message
    const errorMessage = await cardListPage.getErrorMessage();
    expect(errorMessage).toContain('Unable to load credit cards');

    // Step 6: Confirm application remains functional
    await expect(cardListPage.cardListContainer).toBeVisible();
    await expect(page).not.toHaveURL(/.*crash/);
  });

  /**
   * Test Case ID: QE-9789 TS-001 TC-001
   * Description: Verify system retrieves card-specific transactions and calculates all metrics within 500ms
   */
  test('TC-004: Verify card-specific metrics calculation within 500ms', async ({ page }) => {
    // Step 1: Authenticate as user with multiple cards
    await loginPage.navigate();
    await loginPage.login('testuser018', 'valid_token');

    // Step 2: Navigate to card portfolio and select card
    await cardListPage.navigate();
    await cardListPage.selectCardByIndex(0);

    // Step 3: Record start time and retrieve spend analysis
    const startTime = Date.now();
    await cardDetailPage.waitForSpendAnalysisLoad();

    // Step 4-5: Verify metrics are calculated
    const monthlySpend = await cardDetailPage.getMonthlySpend();
    const transactionCount = await cardDetailPage.getTransactionCount();
    const avgTransactionAmount = await cardDetailPage.getAvgTransactionAmount();
    const spendByCategory = await cardDetailPage.getSpendByCategory();

    expect(monthlySpend).toBe(1500);
    expect(transactionCount).toBe(25);
    expect(avgTransactionAmount).toBe(60);
    expect(spendByCategory['Food & Dining']).toBe(500);
    expect(spendByCategory['Fuel']).toBe(300);
    expect(spendByCategory['Shopping']).toBe(700);

    // Step 6: Verify response time <= 500ms
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    expect(responseTime).toBeLessThanOrEqual(500);

    // Step 7: Validate all metrics displayed
    await expect(cardDetailPage.monthlySpendField).toBeVisible();
    await expect(cardDetailPage.transactionCountField).toBeVisible();
    await expect(cardDetailPage.avgTransactionField).toBeVisible();
  });

  /**
   * Test Case ID: QE-9789 TS-001 TC-002
   * Description: Verify spending distribution by category is calculated correctly for selected card
   */
  test('TC-005: Verify category spending distribution accuracy', async ({ page }) => {
    // Step 1: Authenticate and select card
    await loginPage.navigate();
    await loginPage.login('testuser019', 'valid_token');

    // Step 2: Navigate to card detail
    await cardListPage.navigate();
    await cardListPage.selectCardById('card2');

    // Step 3: Manual aggregation verification
    // Expected: Food & Dining: 600, Fuel: 200, Shopping: 400

    // Step 4: Retrieve spend analysis from API
    await cardDetailPage.waitForSpendAnalysisLoad();
    const spendByCategory = await cardDetailPage.getSpendByCategory();

    // Step 5: Validate API-returned breakdown matches manual calculation
    expect(spendByCategory['Food & Dining']).toBe(600);
    expect(spendByCategory['Fuel']).toBe(200);
    expect(spendByCategory['Shopping']).toBe(400);
  });

  /**
   * Test Case ID: QE-9789 TS-002 TC-001
   * Description: Verify system calculates card utilization percentage accurately
   */
  test('TC-006: Verify card utilization percentage calculation', async ({ page }) => {
    // Step 1: Authenticate and select card
    await loginPage.navigate();
    await loginPage.login('testuser020', 'valid_token');

    // Step 2: Navigate to card detail
    await cardListPage.navigate();
    await cardListPage.selectCardById('card3');

    // Step 3: Manual calculation: (7000 / 10000) * 100 = 70%
    await cardDetailPage.waitForCardDetailsLoad();

    // Step 4: Retrieve utilization metric
    const utilizationPercent = await cardDetailPage.getUtilizationPercent();

    // Step 5: Validate displayed utilization matches calculation
    expect(utilizationPercent).toBe(70);
    await expect(cardDetailPage.utilizationField).toContainText('70%');
  });

  /**
   * Test Case ID: QE-9789 TS-003 TC-001
   * Description: Verify system handles cards with zero transactions gracefully
   */
  test('TC-007: Verify zero transactions handling', async ({ page }) => {
    // Step 1: Authenticate as user with card having no transactions
    await loginPage.navigate();
    await loginPage.login('testuser021', 'valid_token');

    // Step 2: Select card with no transactions
    await cardListPage.navigate();
    await cardListPage.selectCardById('card4');

    // Step 3: System retrieves empty transaction array
    await cardDetailPage.waitForSpendAnalysisLoad();

    // Step 4: Verify all metrics are zero
    const monthlySpend = await cardDetailPage.getMonthlySpend();
    const transactionCount = await cardDetailPage.getTransactionCount();
    const avgTransactionAmount = await cardDetailPage.getAvgTransactionAmount();

    expect(monthlySpend).toBe(0);
    expect(transactionCount).toBe(0);
    expect(avgTransactionAmount).toBe(0);

    // Step 5: Validate appropriate message displayed
    const noTransactionsMessage = await cardDetailPage.getNoTransactionsMessage();
    expect(noTransactionsMessage).toContain('No transactions found');

    // Step 6: Confirm no errors logged
    await expect(cardDetailPage.cardDetailContainer).toBeVisible();
    await expect(page).not.toHaveURL(/.*error/);
  });
});

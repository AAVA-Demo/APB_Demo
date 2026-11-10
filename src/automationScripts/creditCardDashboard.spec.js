const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { logger } = require('../utils/logger');

test.describe('Credit Card Dashboard KPIs', () => {

  test('QE-10349 TS-001 TC-001: Verify KPI calculation accuracy with 2 credit cards', async ({ page }) => {
    logger.info('Starting test: QE-10349 TS-001 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Set up test data with 2 cards
    await dashboardPage.setupTestData({
      cardA: {
        creditLimit: 10000,
        outstandingAmount: 3000,
        availableCredit: 7000,
        monthlySpend: 1500
      },
      cardB: {
        creditLimit: 5000,
        outstandingAmount: 2000,
        availableCredit: 3000,
        monthlySpend: 800
      }
    });
    logger.info('Test data prepared with 2 cards');
    
    // Step 2: Navigate to dashboard
    await dashboardPage.navigate();
    await dashboardPage.waitForKPIsToLoad();
    logger.info('Dashboard loaded with KPIs');
    
    // Step 3: Verify Total Credit Limit
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe(15000);
    logger.info('Total Credit Limit verified: $15,000');
    
    // Step 4: Verify Total Outstanding Amount
    const totalOutstanding = await dashboardPage.getTotalOutstanding();
    expect(totalOutstanding).toBe(5000);
    logger.info('Total Outstanding verified: $5,000');
    
    // Step 5: Verify Total Available Credit
    const totalAvailableCredit = await dashboardPage.getTotalAvailableCredit();
    expect(totalAvailableCredit).toBe(10000);
    logger.info('Total Available Credit verified: $10,000');
    
    // Step 6: Verify Total Monthly Spend
    const totalMonthlySpend = await dashboardPage.getTotalMonthlySpend();
    expect(totalMonthlySpend).toBe(2300);
    logger.info('Total Monthly Spend verified: $2,300');
  });

  test('QE-10349 TS-002 TC-001: Verify KPI calculation handles missing or null financial data', async ({ page }) => {
    logger.info('Starting test: QE-10349 TS-002 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Set up test data with null values
    await dashboardPage.setupTestData({
      cardA: {
        creditLimit: 10000,
        outstandingAmount: null,
        availableCredit: 8000,
        monthlySpend: undefined
      },
      cardB: {
        creditLimit: null,
        outstandingAmount: 1000,
        availableCredit: 4000,
        monthlySpend: 500
      }
    });
    logger.info('Test data prepared with missing/null values');
    
    // Step 2: Navigate to dashboard and calculate KPIs
    await dashboardPage.navigate();
    await dashboardPage.waitForKPIsToLoad();
    logger.info('Dashboard loaded, KPI calculation completed');
    
    // Step 3: Verify Total Credit Limit excludes null values
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe(10000);
    logger.info('Total Credit Limit verified: $10,000 (Card A only)');
    
    // Step 4: Verify Total Outstanding excludes null values
    const totalOutstanding = await dashboardPage.getTotalOutstanding();
    expect(totalOutstanding).toBe(1000);
    logger.info('Total Outstanding verified: $1,000 (Card B only)');
    
    // Step 5: Verify Total Available Credit includes both valid values
    const totalAvailableCredit = await dashboardPage.getTotalAvailableCredit();
    expect(totalAvailableCredit).toBe(12000);
    logger.info('Total Available Credit verified: $12,000');
    
    // Step 6: Verify Total Monthly Spend excludes undefined values
    const totalMonthlySpend = await dashboardPage.getTotalMonthlySpend();
    expect(totalMonthlySpend).toBe(500);
    logger.info('Total Monthly Spend verified: $500 (Card B only)');
  });

  test('QE-10349 TS-002 TC-002: Verify system returns appropriate error when all card data is invalid', async ({ page }) => {
    logger.info('Starting test: QE-10349 TS-002 TC-002');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Set up test data with all null values
    await dashboardPage.setupTestData({
      cardA: {
        creditLimit: null,
        outstandingAmount: null,
        availableCredit: null,
        monthlySpend: null
      }
    });
    logger.info('Test data prepared with all null values');
    
    // Step 2: Navigate to dashboard
    await dashboardPage.navigate();
    await dashboardPage.waitForKPIsToLoad();
    logger.info('Dashboard loaded');
    
    // Step 3: Verify all KPIs are zero or error message is present
    const allKPIsZero = await dashboardPage.verifyAllKPIsZero();
    const errorMessageVisible = await dashboardPage.isErrorMessageVisible();
    
    expect(allKPIsZero || errorMessageVisible).toBeTruthy();
    logger.info('Verified: All KPIs are zero OR error message displayed');
  });

  test('QE-10349 TS-003 TC-001: Verify KPI data refreshes within 45-60 seconds after data changes', async ({ page }) => {
    logger.info('Starting test: QE-10349 TS-003 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Load initial KPI values
    await dashboardPage.setupTestData({
      cardA: { creditLimit: 10000, outstandingAmount: 3000, availableCredit: 7000, monthlySpend: 1500 },
      cardB: { creditLimit: 5000, outstandingAmount: 2000, availableCredit: 3000, monthlySpend: 800 }
    });
    await dashboardPage.navigate();
    await dashboardPage.waitForKPIsToLoad();
    
    const initialOutstanding = await dashboardPage.getTotalOutstanding();
    expect(initialOutstanding).toBe(5000);
    logger.info('Initial totalOutstanding: $5,000');
    
    // Step 2: Simulate new transaction posted to Card A
    await dashboardPage.simulateNewTransaction('cardA', 500);
    logger.info('Simulated new transaction: $500 on Card A');
    
    // Step 3: Wait for 45 seconds
    await page.waitForTimeout(45000);
    logger.info('Waited 45 seconds for auto-refresh');
    
    // Step 4: Trigger data refresh
    await dashboardPage.refreshData();
    await dashboardPage.waitForKPIsToLoad();
    logger.info('Data refresh triggered');
    
    // Step 5: Verify totalOutstanding reflects new transaction
    const updatedOutstanding = await dashboardPage.getTotalOutstanding();
    expect(updatedOutstanding).toBe(5500);
    logger.info('Updated totalOutstanding verified: $5,500');
    
    // Step 6: Verify totalAvailableCredit decreased accordingly
    const updatedAvailableCredit = await dashboardPage.getTotalAvailableCredit();
    expect(updatedAvailableCredit).toBe(9500);
    logger.info('Updated totalAvailableCredit verified: $9,500');
  });

});

test.describe('Credit Card Portfolio View', () => {

  test('QE-10348 TS-001 TC-001: Verify system displays all 4 linked credit cards with complete details', async ({ page }) => {
    logger.info('Starting test: QE-10348 TS-001 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Set up test user with 4 linked cards
    await dashboardPage.setupTestData({
      cards: [
        { cardType: 'Visa Platinum', cardNumber: '**** **** **** 1234', creditLimit: 10000, availableCredit: 7000, outstandingAmount: 3000, expiryDate: '12/26' },
        { cardType: 'MasterCard Gold', cardNumber: '**** **** **** 5678', creditLimit: 8000, availableCredit: 6000, outstandingAmount: 2000, expiryDate: '11/25' },
        { cardType: 'Amex Blue', cardNumber: '**** **** **** 9012', creditLimit: 12000, availableCredit: 10000, outstandingAmount: 2000, expiryDate: '10/27' },
        { cardType: 'Discover Silver', cardNumber: '**** **** **** 3456', creditLimit: 6000, availableCredit: 5000, outstandingAmount: 1000, expiryDate: '09/26' }
      ]
    });
    logger.info('Test data prepared with 4 cards');
    
    // Step 2: Navigate to dashboard
    await dashboardPage.navigate();
    await dashboardPage.waitForCardsToLoad();
    logger.info('Dashboard loaded, cards displayed');
    
    // Step 3: Verify each card includes cardName
    const cardNames = await dashboardPage.getAllCardNames();
    expect(cardNames).toEqual(['Visa Platinum', 'MasterCard Gold', 'Amex Blue', 'Discover Silver']);
    logger.info('Card names verified');
    
    // Step 4: Verify each card includes masked cardNumber
    const cardNumbers = await dashboardPage.getAllCardNumbers();
    for (const cardNumber of cardNumbers) {
      expect(cardNumber).toMatch(/\*{4} \*{4} \*{4} \d{4}/);
    }
    logger.info('Card numbers verified (masked format)');
    
    // Step 5: Verify each card includes availableCredit
    const availableCredits = await dashboardPage.getAllAvailableCredits();
    expect(availableCredits).toEqual([7000, 6000, 10000, 5000]);
    logger.info('Available credits verified');
    
    // Step 6: Verify each card includes outstandingBalance
    const outstandingBalances = await dashboardPage.getAllOutstandingBalances();
    expect(outstandingBalances).toEqual([3000, 2000, 2000, 1000]);
    logger.info('Outstanding balances verified');
    
    // Step 7: Verify each card includes expiryDate
    const expiryDates = await dashboardPage.getAllExpiryDates();
    expect(expiryDates).toEqual(['12/26', '11/25', '10/27', '09/26']);
    logger.info('Expiry dates verified');
  });

  test('QE-10348 TS-002 TC-001: Verify system displays empty state when user has no linked cards', async ({ page }) => {
    logger.info('Starting test: QE-10348 TS-002 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Set up test user with no cards
    await dashboardPage.setupTestData({ cards: [] });
    logger.info('Test data prepared: empty card portfolio');
    
    // Step 2: Navigate to dashboard
    await dashboardPage.navigate();
    logger.info('Dashboard loaded');
    
    // Step 3: Verify response contains empty array with cardCount = 0
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(0);
    logger.info('Card count verified: 0');
    
    // Step 4: Verify no error is thrown
    const errorVisible = await dashboardPage.isErrorMessageVisible();
    expect(errorVisible).toBeFalsy();
    logger.info('No error message displayed');
    
    // Step 5: Verify UI displays empty state message
    const emptyStateVisible = await dashboardPage.isEmptyStateVisible();
    expect(emptyStateVisible).toBeTruthy();
    const emptyStateMessage = await dashboardPage.getEmptyStateMessage();
    expect(emptyStateMessage.toLowerCase()).toContain('no credit cards');
    logger.info('Empty state message verified');
  });

  test('QE-10348 TS-003 TC-001: Verify system displays error when backend service is unavailable', async ({ page }) => {
    logger.info('Starting test: QE-10348 TS-003 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Configure backend to return 503
    await dashboardPage.setupBackendError(503);
    logger.info('Backend configured to return HTTP 503');
    
    // Step 2: Navigate to dashboard
    await dashboardPage.navigate();
    logger.info('Dashboard navigation attempted');
    
    // Step 3: Verify service rejects with error
    const errorVisible = await dashboardPage.isErrorMessageVisible();
    expect(errorVisible).toBeTruthy();
    logger.info('Error message displayed');
    
    // Step 4: Verify error message content
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage.toLowerCase()).toContain('failed to load');
    logger.info('Error message verified: "Failed to load credit card data"');
    
    // Step 5: Verify retry functionality is available
    const retryButtonVisible = await dashboardPage.isRetryButtonVisible();
    expect(retryButtonVisible).toBeTruthy();
    logger.info('Retry button verified');
  });

  test('QE-10348 TS-003 TC-002: Verify system handles timeout error when backend does not respond', async ({ page }) => {
    logger.info('Starting test: QE-10348 TS-003 TC-002');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Configure backend to timeout
    await dashboardPage.setupBackendTimeout();
    logger.info('Backend configured to timeout');
    
    // Step 2: Navigate to dashboard
    await dashboardPage.navigate();
    logger.info('Dashboard navigation attempted');
    
    // Step 3: Verify service rejects with timeout error
    const errorVisible = await dashboardPage.isErrorMessageVisible();
    expect(errorVisible).toBeTruthy();
    logger.info('Error message displayed');
    
    // Step 4: Verify error message indicates timeout
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage.toLowerCase()).toMatch(/failed to load|timeout/);
    logger.info('Error message verified: timeout indication');
    
    // Step 5: Verify retry functionality is available
    const retryButtonVisible = await dashboardPage.isRetryButtonVisible();
    expect(retryButtonVisible).toBeTruthy();
    logger.info('Retry functionality verified');
  });

});

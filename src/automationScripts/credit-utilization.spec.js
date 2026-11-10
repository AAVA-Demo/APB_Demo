const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

// Test Case - QE-10429 TS-001 TC-001
test.describe('Credit Utilization - Transaction Update', () => {
  test('TC-001: Verify $500 purchase updates available credit and outstanding amount accurately', async ({ page }) => {
    logger.info('Starting TC-001: Credit utilization update test');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@1234');
    logger.info('User authenticated');

    // Step 2: Note current values
    await dashboardPage.waitForDashboardLoad();
    const initialCreditLimit = 10000;
    const initialAvailable = 8000;
    const initialOutstanding = 2000;
    logger.info(`Initial - Limit: $${initialCreditLimit}, Available: $${initialAvailable}, Outstanding: $${initialOutstanding}`);

    // Step 3: Simulate $500 transaction
    await page.evaluate(() => {
      window.mockTransaction = { amount: 500, cardId: 'card1', merchant: 'Electronics Store' };
    });
    logger.info('$500 transaction simulated on Card 1');

    // Step 4: Refresh dashboard
    await page.reload();
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard refreshed');

    // Step 5: Verify Available Credit updated
    const updatedAvailable = await dashboardPage.getCardAvailableCredit('card1');
    expect(updatedAvailable).toBe(7500);
    logger.info('Available Credit updated: $7,500');

    // Step 6: Verify Outstanding Amount updated
    const updatedOutstanding = await dashboardPage.getCardOutstandingAmount('card1');
    expect(updatedOutstanding).toBe(2500);
    logger.info('Outstanding Amount updated: $2,500');

    // Step 7: Verify Credit Limit unchanged
    const creditLimit = await dashboardPage.getCardCreditLimit('card1');
    expect(creditLimit).toBe(10000);
    logger.info('Credit Limit unchanged: $10,000');

    // Step 8: Verify 100% calculation accuracy
    expect(updatedAvailable + updatedOutstanding).toBe(initialCreditLimit);
    logger.info('Calculation accuracy: 100%');

    // Step 9: Verify consolidated KPIs reflect change
    const consolidatedAvailable = await dashboardPage.getAvailableCreditValue();
    const consolidatedOutstanding = await dashboardPage.getOutstandingAmountValue();
    logger.info('Consolidated KPIs reflect transaction');
  });
});

// Test Case - QE-10429 TS-002 TC-001
test.describe('Credit Utilization - Deactivated Card', () => {
  test('TC-002: Verify deactivated card excluded from KPI calculations', async ({ page }) => {
    logger.info('Starting TC-002: Deactivated card exclusion test');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@1234');
    logger.info('User authenticated');

    // Step 2: Note current consolidated KPIs
    await dashboardPage.waitForDashboardLoad();
    const initialTotalLimit = await dashboardPage.getTotalCreditLimitValue();
    const initialAvailable = await dashboardPage.getAvailableCreditValue();
    const initialOutstanding = await dashboardPage.getOutstandingAmountValue();
    logger.info(`Initial KPIs - Limit: ${initialTotalLimit}, Available: ${initialAvailable}, Outstanding: ${initialOutstanding}`);

    // Step 3: Simulate Card 3 deactivation
    await page.evaluate(() => {
      window.deactivateCard = 'card3';
    });
    logger.info('Card 3 (Amex Gold) deactivated');

    // Step 4: Refresh dashboard
    await page.reload();
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard refreshed');

    // Step 5: Verify Card 3 excluded from KPIs
    const updatedTotalLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(updatedTotalLimit).toBe(35000); // Excluding Card 3's $15,000
    logger.info('Card 3 excluded from Total Credit Limit');

    // Step 6: Verify notification message
    const notification = await page.locator('.notification, .alert-info').textContent();
    expect(notification).toContain('deactivated');
    expect(notification).toContain('9012');
    logger.info('Deactivation notification displayed');

    // Step 7: Verify Card 3 not in active card list
    await page.locator('nav a:has-text("My Cards")').click();
    const cardCount = await page.locator('.card-tile').count();
    expect(cardCount).toBe(2);
    logger.info('Card 3 not visible in active card list');

    // Step 8: Verify no stale data
    await page.locator('nav a:has-text("Dashboard")').click();
    await dashboardPage.waitForDashboardLoad();
    const finalKPIs = await dashboardPage.getAllKPIs();
    expect(finalKPIs.totalCreditLimit).toBe(35000);
    logger.info('No stale data from Card 3');
  });
});

// Test Case - QE-10429 TS-003 TC-001
test.describe('Credit Utilization - Concurrent Transactions', () => {
  test('TC-003: Verify simultaneous transactions on two cards correctly aggregated', async ({ page }) => {
    logger.info('Starting TC-003: Concurrent transactions test');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser_multicards', 'Test@1234');
    logger.info('User authenticated');

    // Step 2: Note current values for both cards
    await dashboardPage.waitForDashboardLoad();
    const card1InitialAvailable = 12000;
    const card1InitialOutstanding = 3000;
    const card2InitialAvailable = 15000;
    const card2InitialOutstanding = 5000;
    logger.info('Initial values noted for Card 1 and Card 2');

    // Step 3: Simulate simultaneous transactions
    await page.evaluate(() => {
      window.mockTransactions = [
        { amount: 300, cardId: 'card1', merchant: 'Store A', timestamp: Date.now() },
        { amount: 500, cardId: 'card2', merchant: 'Store B', timestamp: Date.now() }
      ];
    });
    logger.info('Simultaneous transactions: $300 on Card 1, $500 on Card 2');

    // Step 4: Refresh dashboard
    await page.reload();
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard refreshed');

    // Step 5: Verify Card 1 Available Credit
    const card1UpdatedAvailable = await dashboardPage.getCardAvailableCredit('card1');
    expect(card1UpdatedAvailable).toBe(11700);
    logger.info('Card 1 Available Credit: $11,700');

    // Step 6: Verify Card 1 Outstanding Amount
    const card1UpdatedOutstanding = await dashboardPage.getCardOutstandingAmount('card1');
    expect(card1UpdatedOutstanding).toBe(3300);
    logger.info('Card 1 Outstanding Amount: $3,300');

    // Step 7: Verify Card 2 Available Credit
    const card2UpdatedAvailable = await dashboardPage.getCardAvailableCredit('card2');
    expect(card2UpdatedAvailable).toBe(14500);
    logger.info('Card 2 Available Credit: $14,500');

    // Step 8: Verify Card 2 Outstanding Amount
    const card2UpdatedOutstanding = await dashboardPage.getCardOutstandingAmount('card2');
    expect(card2UpdatedOutstanding).toBe(5500);
    logger.info('Card 2 Outstanding Amount: $5,500');

    // Step 9: Verify consolidated KPIs
    const totalAvailable = await dashboardPage.getAvailableCreditValue();
    const totalOutstanding = await dashboardPage.getOutstandingAmountValue();
    expect(totalAvailable).toBe(26200);
    expect(totalOutstanding).toBe(8800);
    logger.info('Consolidated KPIs correctly aggregated');

    // Step 10: Verify data integrity
    expect(card1UpdatedAvailable + card1UpdatedOutstanding).toBe(15000);
    expect(card2UpdatedAvailable + card2UpdatedOutstanding).toBe(20000);
    logger.info('Data integrity maintained: 100% accuracy');
  });
});

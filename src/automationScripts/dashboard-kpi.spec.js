const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { Logger } = require('../utils/logger');

test.describe('Dashboard KPI Tests - CreditCardNew20261109190104', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    Logger.info('Navigating to dashboard');
    await dashboardPage.navigate();
  });

  test('TC-5998: Verify card-wise spending comparison returns accurate data for 4 active cards', async ({ page }) => {
    Logger.info('Test Case ID: QE-9025 TS-001 TC-001');
    
    // Step 1: Prepare test data - 4 active credit cards with different spending patterns
    const testData = {
      userId: 'user123',
      cards: [
        { id: 'card1', limit: 5000, outstanding: 1500, transactions: 15 },
        { id: 'card2', limit: 10000, outstanding: 3200, transactions: 28 },
        { id: 'card3', limit: 3000, outstanding: 750, transactions: 8 },
        { id: 'card4', limit: 8000, outstanding: 4100, transactions: 35 }
      ]
    };
    
    // Step 2: Send API request to retrieve card-wise spending comparison
    const response = await dashboardPage.getCardComparison(testData.userId);
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK with comparison data');
    
    // Step 3: Validate total spending amounts for each card
    const comparisonData = await response.json();
    await expect(comparisonData.cards[0].totalSpending).toBe(1500);
    await expect(comparisonData.cards[1].totalSpending).toBe(3200);
    await expect(comparisonData.cards[2].totalSpending).toBe(750);
    await expect(comparisonData.cards[3].totalSpending).toBe(4100);
    Logger.info('Total spending amounts validated');
    
    // Step 4: Validate utilization rate calculation
    await expect(comparisonData.cards[0].utilizationRate).toBeCloseTo(30.0, 1);
    await expect(comparisonData.cards[1].utilizationRate).toBeCloseTo(32.0, 1);
    await expect(comparisonData.cards[2].utilizationRate).toBeCloseTo(25.0, 1);
    await expect(comparisonData.cards[3].utilizationRate).toBeCloseTo(51.25, 1);
    Logger.info('Utilization rates validated');
    
    // Step 5: Validate transaction count
    await expect(comparisonData.cards[0].transactionCount).toBe(15);
    await expect(comparisonData.cards[1].transactionCount).toBe(28);
    await expect(comparisonData.cards[2].transactionCount).toBe(8);
    await expect(comparisonData.cards[3].transactionCount).toBe(35);
    Logger.info('Transaction counts validated');
    
    // Step 6: Validate average transaction amount
    await expect(comparisonData.cards[0].avgTransactionAmount).toBeCloseTo(100, 1);
    await expect(comparisonData.cards[1].avgTransactionAmount).toBeCloseTo(114.29, 1);
    await expect(comparisonData.cards[2].avgTransactionAmount).toBeCloseTo(93.75, 1);
    await expect(comparisonData.cards[3].avgTransactionAmount).toBeCloseTo(117.14, 1);
    Logger.info('Average transaction amounts validated');
  });

  test('TC-5999: Verify validation message when user with only 1 card attempts comparison', async ({ page }) => {
    Logger.info('Test Case ID: QE-9025 TS-002 TC-001');
    
    // Step 1: Prepare test data - user with only 1 active credit card
    const testData = {
      userId: 'user456',
      cardId: 'card001',
      limit: 5000,
      balance: 1200
    };
    
    // Step 2: Send API request to access card comparison feature
    const response = await dashboardPage.getCardComparison(testData.userId);
    await expect(response.status).toBeGreaterThanOrEqual(400);
    await expect(response.status).toBeLessThan(500);
    Logger.info('API returned 4xx error as expected');
    
    // Step 3: Validate error response contains appropriate validation message
    const errorData = await response.json();
    await expect(errorData.message).toContain('At least 2 cards are required for comparison functionality');
    Logger.info('Validation message confirmed');
    
    // Step 4: Verify no comparison data is returned
    await expect(errorData.comparisonData).toBeUndefined();
    Logger.info('No comparison data returned as expected');
  });

  test('TC-6000: Verify card comparison handles zero-transaction card correctly', async ({ page }) => {
    Logger.info('Test Case ID: QE-9025 TS-003 TC-001');
    
    // Step 1: Prepare test data - 3 cards with Card C having 0 transactions
    const testData = {
      userId: 'user789',
      cards: [
        { id: 'cardA', limit: 5000, outstanding: 1200, transactions: 10 },
        { id: 'cardB', limit: 8000, outstanding: 2400, transactions: 15 },
        { id: 'cardC', limit: 3000, outstanding: 0, transactions: 0 }
      ]
    };
    
    // Step 2: Send API request to retrieve card-wise spending comparison
    const response = await dashboardPage.getCardComparison(testData.userId);
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK');
    
    const comparisonData = await response.json();
    
    // Step 3: Validate Card C shows 0% utilization
    await expect(comparisonData.cards[2].utilizationRate).toBe(0);
    Logger.info('Card C utilization is 0%');
    
    // Step 4: Validate Card C shows $0 spending
    await expect(comparisonData.cards[2].totalSpending).toBe(0);
    Logger.info('Card C spending is $0');
    
    // Step 5: Validate Card A and Card B data integrity
    await expect(comparisonData.cards[0].utilizationRate).toBeCloseTo(24.0, 1);
    await expect(comparisonData.cards[0].totalSpending).toBe(1200);
    await expect(comparisonData.cards[1].utilizationRate).toBeCloseTo(30.0, 1);
    await expect(comparisonData.cards[1].totalSpending).toBe(2400);
    Logger.info('Card A and B data integrity maintained');
    
    // Step 6: Verify all 3 cards are included
    await expect(comparisonData.cards.length).toBe(3);
    Logger.info('All 3 cards included in response');
  });

  test('TC-6001: Verify dashboard returns responsive layout metadata for mobile device', async ({ page }) => {
    Logger.info('Test Case ID: QE-9024 TS-001 TC-001');
    
    // Step 1: Set user agent to mobile device with viewport 375px
    await page.setViewportSize({ width: 375, height: 667 });
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      'Viewport-Width': '375'
    });
    Logger.info('Mobile device context configured');
    
    // Step 2: Send API request to retrieve dashboard data
    const response = await dashboardPage.getDashboardData('user123', 'mobile');
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK with dashboard data');
    
    const dashboardData = await response.json();
    
    // Step 3: Validate mobile-optimized rendering flag
    await expect(dashboardData.metadata.layoutMode).toBe('mobile');
    await expect(dashboardData.metadata.stackedLayout).toBe(true);
    Logger.info('Mobile layout metadata validated');
    
    // Step 4: Verify KPI cards configured for stacked display
    await expect(dashboardData.metadata.kpiCardLayout).toBe('stacked');
    await expect(dashboardData.metadata.columnsPerRow).toBe(1);
    Logger.info('Stacked layout configuration confirmed');
    
    // Step 5: Validate no horizontal overflow flag
    await expect(dashboardData.metadata.horizontalOverflow).toBe(false);
    await expect(dashboardData.metadata.scrollRequired).toBe(false);
    Logger.info('No horizontal overflow confirmed');
    
    // Step 6: Verify all KPI data values are present
    await expect(dashboardData.monthlySpend).toBeDefined();
    await expect(dashboardData.totalCreditLimit).toBeDefined();
    await expect(dashboardData.availableCredit).toBeDefined();
    await expect(dashboardData.totalOutstanding).toBeDefined();
    Logger.info('All KPI data values present');
  });

  test('TC-6002: Verify system handles extremely narrow viewport with warning flag', async ({ page }) => {
    Logger.info('Test Case ID: QE-9024 TS-002 TC-001');
    
    // Step 1: Set viewport width to 280px (below minimum)
    await page.setViewportSize({ width: 280, height: 667 });
    await page.setExtraHTTPHeaders({
      'Viewport-Width': '280',
      'User-Agent': 'Mobile device'
    });
    Logger.info('Narrow viewport configured (280px)');
    
    // Step 2: Send API request to retrieve dashboard data
    const response = await dashboardPage.getDashboardData('user456', 'mobile');
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK (not error)');
    
    const dashboardData = await response.json();
    
    // Step 3: Validate viewport warning flag
    await expect(dashboardData.metadata.viewportWarning).toBe(true);
    await expect(dashboardData.metadata.message).toContain('Viewport is below recommended minimum of 320px');
    Logger.info('Viewport warning flag validated');
    
    // Step 4: Verify all dashboard KPI data is still provided
    await expect(dashboardData.monthlySpend).toBeDefined();
    await expect(dashboardData.totalCreditLimit).toBeDefined();
    await expect(dashboardData.availableCredit).toBeDefined();
    await expect(dashboardData.totalOutstanding).toBeDefined();
    Logger.info('All KPI data still provided');
    
    // Step 5: Validate layout integrity flag
    await expect(dashboardData.metadata.layoutIntegrity).toBe(true);
    await expect(dashboardData.metadata.dataAccessible).toBe(true);
    Logger.info('Layout integrity confirmed');
    
    // Step 6: Verify no critical errors
    await expect(dashboardData.error).toBeUndefined();
    Logger.info('No critical errors present');
  });

  test('TC-6003: Verify KPI data consistency across viewport changes', async ({ page }) => {
    Logger.info('Test Case ID: QE-9024 TS-003 TC-001');
    
    // Step 1: Send initial request from desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopResponse = await dashboardPage.getDashboardData('user789', 'desktop');
    await expect(desktopResponse.status).toBe(200);
    Logger.info('Desktop request successful');
    
    // Step 2: Capture KPI values from desktop response
    const desktopData = await desktopResponse.json();
    const desktopKPIs = {
      monthlySpend: desktopData.monthlySpend,
      totalCreditLimit: desktopData.totalCreditLimit,
      availableCredit: desktopData.availableCredit,
      totalOutstanding: desktopData.totalOutstanding
    };
    Logger.info('Desktop KPI values captured');
    
    // Step 3: Send second request from tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    const tabletResponse = await dashboardPage.getDashboardData('user789', 'tablet');
    await expect(tabletResponse.status).toBe(200);
    Logger.info('Tablet request successful');
    
    const tabletData = await tabletResponse.json();
    
    // Step 4: Validate KPI values remain identical
    await expect(tabletData.monthlySpend).toBe(desktopKPIs.monthlySpend);
    await expect(tabletData.totalCreditLimit).toBe(desktopKPIs.totalCreditLimit);
    await expect(tabletData.availableCredit).toBe(desktopKPIs.availableCredit);
    await expect(tabletData.totalOutstanding).toBe(desktopKPIs.totalOutstanding);
    Logger.info('KPI data consistency validated');
    
    // Step 5: Verify only layout metadata changed
    await expect(desktopData.metadata.layoutMode).toBe('desktop');
    await expect(desktopData.metadata.columnsPerRow).toBe(4);
    await expect(tabletData.metadata.layoutMode).toBe('tablet');
    await expect(tabletData.metadata.columnsPerRow).toBe(2);
    Logger.info('Layout metadata differences confirmed');
    
    // Step 6: Confirm data consistency flag
    await expect(tabletData.metadata.dataConsistency).toBe(true);
    Logger.info('Data consistency flag validated');
  });

  test('TC-6015: Verify KPI dashboard returns accurate real-time aggregated metrics for 3 active cards', async ({ page }) => {
    Logger.info('Test Case ID: QE-9020 TS-001 TC-001');
    
    // Step 1: Prepare test data - 3 active cards with current month transactions
    const testData = {
      userId: 'user123',
      cards: [
        { limit: 5000, outstanding: 1200, monthlySpend: 800 },
        { limit: 8000, outstanding: 3200, monthlySpend: 1500 },
        { limit: 10000, outstanding: 4500, monthlySpend: 2200 }
      ]
    };
    
    // Step 2: Send API request to access KPI dashboard
    const response = await dashboardPage.getKPIDashboard(testData.userId);
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK with KPI data');
    
    const kpiData = await response.json();
    
    // Step 3: Validate total monthly spend
    await expect(kpiData.totalMonthlySpend).toBe(4500);
    Logger.info('Total monthly spend validated: $4500');
    
    // Step 4: Verify total credit limit
    await expect(kpiData.totalCreditLimit).toBe(23000);
    Logger.info('Total credit limit validated: $23000');
    
    // Step 5: Validate available credit
    await expect(kpiData.availableCredit).toBe(14100);
    Logger.info('Available credit validated: $14100');
    
    // Step 6: Verify total outstanding amount
    await expect(kpiData.totalOutstanding).toBe(8900);
    Logger.info('Total outstanding validated: $8900');
  });

  test('TC-6016: Verify KPI dashboard calculates credit utilization correctly', async ({ page }) => {
    Logger.info('Test Case ID: QE-9020 TS-001 TC-002');
    
    // Step 1: Prepare test data - 3 cards with different utilization rates
    const testData = {
      userId: 'user456',
      cards: [
        { limit: 10000, outstanding: 2000 },
        { limit: 5000, outstanding: 2500 },
        { limit: 8000, outstanding: 6000 }
      ]
    };
    
    // Step 2: Send API request to retrieve KPI dashboard data
    const response = await dashboardPage.getKPIDashboard(testData.userId);
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK');
    
    const kpiData = await response.json();
    
    // Step 3: Validate overall credit utilization percentage
    await expect(kpiData.creditUtilization).toBeCloseTo(45.65, 1);
    Logger.info('Credit utilization validated: 45.65%');
    
    // Step 4: Verify total outstanding amount
    await expect(kpiData.totalOutstanding).toBe(10500);
    Logger.info('Total outstanding validated: $10500');
    
    // Step 5: Verify total credit limit
    await expect(kpiData.totalCreditLimit).toBe(23000);
    Logger.info('Total credit limit validated: $23000');
  });

  test('TC-6017: Verify KPI dashboard returns $0 values when all cards are inactive', async ({ page }) => {
    Logger.info('Test Case ID: QE-9020 TS-002 TC-001');
    
    // Step 1: Prepare test data - user with all inactive/closed cards
    const testData = {
      userId: 'user999',
      cards: [
        { status: 'inactive', limit: 5000 },
        { status: 'closed', limit: 8000 },
        { status: 'inactive', limit: 10000 },
        { status: 'closed', limit: 6000 }
      ]
    };
    
    // Step 2: Send API request to access KPI dashboard
    const response = await dashboardPage.getKPIDashboard(testData.userId);
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK');
    
    const kpiData = await response.json();
    
    // Step 3: Validate all KPI metrics show $0
    await expect(kpiData.monthlySpend).toBe(0);
    await expect(kpiData.totalCreditLimit).toBe(0);
    await expect(kpiData.availableCredit).toBe(0);
    await expect(kpiData.totalOutstanding).toBe(0);
    Logger.info('All KPI metrics are $0 as expected');
    
    // Step 4: Verify appropriate status messaging
    await expect(kpiData.message).toContain('No active cards are available for KPI calculation');
    Logger.info('Status message validated');
    
    // Step 5: Validate response metadata
    await expect(kpiData.metadata.activeCardCount).toBe(0);
    await expect(kpiData.metadata.inactiveCardCount).toBe(4);
    await expect(kpiData.metadata.kpiCalculationPossible).toBe(false);
    Logger.info('Metadata validated');
  });

  test('TC-6018: Verify KPI dashboard calculates available credit excluding maxed-out cards', async ({ page }) => {
    Logger.info('Test Case ID: QE-9020 TS-003 TC-001');
    
    // Step 1: Prepare test data - 5 cards with 2 maxed-out
    const testData = {
      userId: 'user789',
      cards: [
        { limit: 5000, outstanding: 5000 },
        { limit: 8000, outstanding: 8000 },
        { limit: 10000, outstanding: 3000 },
        { limit: 6000, outstanding: 2000 },
        { limit: 12000, outstanding: 6000 }
      ]
    };
    
    // Step 2: Send API request to retrieve KPI dashboard data
    const response = await dashboardPage.getKPIDashboard(testData.userId);
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK');
    
    const kpiData = await response.json();
    
    // Step 3: Validate available credit calculation
    await expect(kpiData.availableCredit).toBe(17000);
    Logger.info('Available credit validated: $17000');
    
    // Step 4: Verify total credit limit includes all cards
    await expect(kpiData.totalCreditLimit).toBe(41000);
    Logger.info('Total credit limit validated: $41000');
    
    // Step 5: Validate total outstanding amount
    await expect(kpiData.totalOutstanding).toBe(24000);
    Logger.info('Total outstanding validated: $24000');
    
    // Step 6: Verify overall credit utilization percentage
    await expect(kpiData.creditUtilization).toBeCloseTo(58.54, 1);
    Logger.info('Credit utilization validated: 58.54%');
  });
});

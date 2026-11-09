const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Credit Card Dashboard - KPI Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test('TC-4772: Verify aggregated KPI metrics display for user with three active credit cards', async ({ page }) => {
    // Test Case ID: QE-7986 TS-001 TC-001
    // Step 1-2: Launch and authenticate
    await dashboardPage.login('testuser_3cards', 'Pass@123');
    
    // Step 3: Navigate to Dashboard KPI section
    await dashboardPage.waitForDashboardLoad();
    
    // Step 4: Verify Total Credit Limit
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$155,000.00');
    
    // Step 5: Verify Available Credit
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('$117,000.00');
    
    // Step 6: Verify Outstanding Amount
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('$38,000.00');
    
    // Step 7: Verify Monthly Spend
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('$26,000.00');
  });

  test('TC-4774: Verify dashboard displays zero available credit with warnings for fully utilized cards', async ({ page }) => {
    // Test Case ID: QE-7986 TS-002 TC-001
    // Step 1-2: Launch and authenticate
    await dashboardPage.login('testuser_zero_credit', 'Pass@123');
    
    // Step 3: Navigate to Dashboard KPI section
    await dashboardPage.waitForDashboardLoad();
    
    // Step 4: Verify Available Credit displays $0
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('$0.00');
    
    // Verify visual warning indicator
    const hasWarningIndicator = await dashboardPage.hasAvailableCreditWarning();
    expect(hasWarningIndicator).toBeTruthy();
    
    // Step 5: Verify warning message
    const warningMessage = await dashboardPage.getWarningMessage();
    expect(warningMessage).toContain('All credit cards are fully utilized');
    
    // Step 6: Verify Outstanding equals Total Credit Limit
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(totalCreditLimit).toBe(outstandingAmount);
    expect(totalCreditLimit).toBe('$80,000.00');
  });

  test('TC-4776: Verify proper formatting of KPI values with currency symbols and thousand separators', async ({ page }) => {
    // Test Case ID: QE-7986 TS-003 TC-001
    // Step 1-2: Launch and authenticate
    await dashboardPage.login('testuser_multi_limit', 'Pass@123');
    
    // Step 3: Navigate to Dashboard KPI section
    await dashboardPage.waitForDashboardLoad();
    
    // Step 4: Verify currency symbol
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toMatch(/^\$/);
    
    // Step 5: Verify thousand separators
    const allKPIs = await dashboardPage.getAllKPIValues();
    allKPIs.forEach(kpi => {
      expect(kpi).toMatch(/\$[\d,]+\.\d{2}/);
    });
    
    // Step 6: Verify decimal precision (2 decimal places)
    allKPIs.forEach(kpi => {
      expect(kpi).toMatch(/\.\d{2}$/);
    });
  });
});

test.describe('Credit Card Dashboard - Real-Time Updates', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test('TC-4791: Verify available credit updates automatically within 2 seconds after new transaction', async ({ page }) => {
    // Test Case ID: QE-7982 TS-001 TC-001
    // Step 1-2: Launch and authenticate
    await dashboardPage.login('testuser_realtime', 'Pass@123');
    
    // Step 3: Note current available credit
    await dashboardPage.waitForDashboardLoad();
    const initialCredit = await dashboardPage.getAvailableCredit();
    expect(initialCredit).toBe('$35,000.00');
    
    // Step 4: Simulate transaction (via API or backend)
    await dashboardPage.simulateTransaction(500, '**** 1234');
    
    // Step 5-6: Verify automatic update within 2 seconds
    const updatedCredit = await dashboardPage.waitForCreditUpdate('$34,500.00', 2000);
    expect(updatedCredit).toBe('$34,500.00');
    
    // Step 7: Verify timestamp
    const lastUpdated = await dashboardPage.getLastUpdatedTimestamp();
    const timeDiff = Date.now() - new Date(lastUpdated).getTime();
    expect(timeDiff).toBeLessThan(2000);
  });

  test('TC-4792: Verify warning displayed when real-time update service experiences connection failure', async ({ page }) => {
    // Test Case ID: QE-7982 TS-002 TC-001
    // Step 1-2: Launch and authenticate
    await dashboardPage.login('testuser', 'Pass@123');
    
    // Step 3: Note current state
    await dashboardPage.waitForDashboardLoad();
    const initialCredit = await dashboardPage.getAvailableCredit();
    const initialTimestamp = await dashboardPage.getLastUpdatedTimestamp();
    
    // Step 4: Simulate connection failure
    await dashboardPage.simulateConnectionFailure();
    
    // Step 5: Verify warning indicator
    const hasWarning = await dashboardPage.hasConnectionWarning();
    expect(hasWarning).toBeTruthy();
    const warningText = await dashboardPage.getConnectionWarningText();
    expect(warningText).toContain('Credit availability data may not be current');
    
    // Step 6: Verify manual refresh option
    const hasRefreshButton = await dashboardPage.hasManualRefreshButton();
    expect(hasRefreshButton).toBeTruthy();
    
    // Step 7: Verify last update timestamp
    const displayedTimestamp = await dashboardPage.getLastUpdatedTimestamp();
    expect(displayedTimestamp).toBe(initialTimestamp);
    
    // Step 8: Click manual refresh
    await dashboardPage.clickManualRefresh();
    await dashboardPage.waitForDashboardLoad();
  });

  test('TC-4793: Verify accurate update of total available credit for simultaneous transactions on multiple cards', async ({ page }) => {
    // Test Case ID: QE-7982 TS-003 TC-001
    // Step 1-2: Launch and authenticate
    await dashboardPage.login('testuser_multi_card', 'Pass@123');
    
    // Step 3: Note initial total available credit
    await dashboardPage.waitForDashboardLoad();
    const initialTotal = await dashboardPage.getAvailableCredit();
    expect(initialTotal).toBe('$60,000.00');
    
    // Step 4: Simulate simultaneous transactions
    await dashboardPage.simulateSimultaneousTransactions([
      { cardId: 'card-A', amount: -300 },
      { cardId: 'card-B', amount: 150 }
    ]);
    
    // Step 5: Verify total available credit update
    const updatedTotal = await dashboardPage.waitForCreditUpdate('$59,850.00', 2000);
    expect(updatedTotal).toBe('$59,850.00');
    
    // Step 6: Verify individual card updates
    const cardACredit = await dashboardPage.getCardAvailableCredit('card-A');
    const cardBCredit = await dashboardPage.getCardAvailableCredit('card-B');
    expect(cardACredit).toBe('$24,700.00');
    expect(cardBCredit).toBe('$35,150.00');
    
    // Step 7: Verify update within SLA
    const timestamp = await dashboardPage.getLastUpdatedTimestamp();
    const timeDiff = Date.now() - new Date(timestamp).getTime();
    expect(timeDiff).toBeLessThan(2000);
  });
});
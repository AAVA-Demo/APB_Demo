const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

// Test Cases for QE-8297 (Real-time Financial Data Refresh)
test.describe('QE-8297: Real-time Financial Data Refresh', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test('QE-8297 TS-001 TC-001: Verify dashboard automatically refreshes all financial metrics within 2 seconds when new transaction data is received', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Step 2: Dashboard loads displaying initial financial metrics
    await dashboardPage.waitForDashboardLoad();
    const initialMetrics = await dashboardPage.getFinancialMetrics();
    expect(initialMetrics.monthlySpend).toBe('24,500');
    expect(initialMetrics.totalCreditLimit).toBe('100,000');
    expect(initialMetrics.availableCredit).toBe('70,000');
    expect(initialMetrics.outstandingAmount).toBe('30,000');
    
    // Step 3: Simulate new transaction data received
    await dashboardPage.simulateNewTransaction({ amount: 1500, merchant: 'Amazon', cardId: 'card001' });
    
    // Step 4: Verify dashboard automatically refreshes within 2 seconds
    await dashboardPage.waitForMetricsUpdate(2000);
    const updatedMetrics = await dashboardPage.getFinancialMetrics();
    expect(updatedMetrics.monthlySpend).toBe('26,000');
    expect(updatedMetrics.availableCredit).toBe('68,500');
    expect(updatedMetrics.outstandingAmount).toBe('31,500');
    
    // Step 5: Verify last refreshed timestamp is updated
    const timestamp = await dashboardPage.getLastRefreshedTimestamp();
    expect(timestamp).toContain('10:00:07 AM');
  });

  test('QE-8297 TS-002 TC-001: Verify dashboard displays last successful metrics with error notification when data source becomes unavailable', async ({ page }) => {
    // Step 1-2: Load dashboard with current metrics
    await dashboardPage.waitForDashboardLoad();
    const initialMetrics = await dashboardPage.getFinancialMetrics();
    const initialTimestamp = await dashboardPage.getLastRefreshedTimestamp();
    
    // Step 3: Simulate data source becoming unavailable
    await dashboardPage.simulateDataSourceError();
    
    // Step 4: Verify dashboard continues to display last successful metrics
    const currentMetrics = await dashboardPage.getFinancialMetrics();
    expect(currentMetrics).toEqual(initialMetrics);
    
    // Step 5: Verify error notification is displayed
    const errorMessage = await dashboardPage.getErrorNotification();
    expect(errorMessage).toContain('Unable to refresh data');
    expect(errorMessage).toContain('Data may be stale');
    
    // Step 6: Verify last refreshed timestamp shows previous successful refresh time
    const currentTimestamp = await dashboardPage.getLastRefreshedTimestamp();
    expect(currentTimestamp).toBe(initialTimestamp);
  });

  test('QE-8297 TS-003 TC-001: Verify dashboard automatically refreshes at regular intervals during extended session with multiple background transactions', async ({ page }) => {
    // Step 1-2: Load dashboard and keep it open
    await dashboardPage.waitForDashboardLoad();
    const initialSpend = await dashboardPage.getMonthlySpend();
    
    // Step 3: Simulate multiple transactions over 10 minutes
    await dashboardPage.simulateNewTransaction({ amount: 500, time: '10:02 AM' });
    await dashboardPage.simulateNewTransaction({ amount: 1200, time: '10:05 AM' });
    await dashboardPage.simulateNewTransaction({ amount: 800, time: '10:08 AM' });
    
    // Step 4: Verify dashboard automatically refreshes at regular intervals
    await dashboardPage.waitForAutoRefresh(300000); // 5 minutes
    const firstRefreshSpend = await dashboardPage.getMonthlySpend();
    expect(firstRefreshSpend).toBe('26,200');
    
    await dashboardPage.waitForAutoRefresh(300000); // Another 5 minutes
    const secondRefreshSpend = await dashboardPage.getMonthlySpend();
    expect(secondRefreshSpend).toBe('27,000');
    
    // Step 5: Verify last refreshed timestamp updates
    const timestamp = await dashboardPage.getLastRefreshedTimestamp();
    expect(timestamp).toContain('10:10 AM');
    
    // Step 6: Verify all financial metrics reflect cumulative changes
    const finalMetrics = await dashboardPage.getFinancialMetrics();
    expect(finalMetrics.monthlySpend).toBe('27,000');
  });
});

// Test Cases for QE-8296 (Transaction Categorization and Breakdown)
test.describe('QE-8296: Transaction Categorization and Breakdown', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test('QE-8296 TS-001 TC-001: Verify automatic transaction categorization achieves 95% accuracy across 20 diverse merchant transactions', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Step 2: Simulate 20 transactions across diverse merchant types
    const transactions = [
      { merchant: 'Swiggy', category: 'Food & Dining' },
      { merchant: 'Zomato', category: 'Food & Dining' },
      { merchant: 'Dominos', category: 'Food & Dining' },
      { merchant: 'McDonalds', category: 'Food & Dining' },
      { merchant: 'HP Petrol', category: 'Fuel' },
      { merchant: 'Bharat Petroleum', category: 'Fuel' },
      { merchant: 'Indian Oil', category: 'Fuel' },
      { merchant: 'Amazon', category: 'Shopping' },
      { merchant: 'Flipkart', category: 'Shopping' },
      { merchant: 'Myntra', category: 'Shopping' },
      { merchant: 'Ajio', category: 'Shopping' },
      { merchant: 'Uber', category: 'Travel' },
      { merchant: 'Ola', category: 'Travel' },
      { merchant: 'MakeMyTrip', category: 'Travel' },
      { merchant: 'BookMyShow', category: 'Entertainment' },
      { merchant: 'Netflix', category: 'Entertainment' },
      { merchant: 'Electricity Bill', category: 'Utilities' },
      { merchant: 'Mobile Recharge', category: 'Utilities' },
      { merchant: 'Apollo Pharmacy', category: 'Healthcare' },
      { merchant: 'Coursera', category: 'Education' }
    ];
    await dashboardPage.simulateMultipleTransactions(transactions);
    
    // Step 3: Navigate to Analytics dashboard
    await dashboardPage.navigateToAnalytics();
    
    // Step 4: Verify automatic categorization accuracy (at least 19/20 = 95%)
    const categoryBreakdown = await dashboardPage.getCategoryBreakdown();
    expect(categoryBreakdown['Food & Dining'].count).toBe(4);
    expect(categoryBreakdown['Fuel'].count).toBe(3);
    expect(categoryBreakdown['Shopping'].count).toBe(4);
    expect(categoryBreakdown['Travel'].count).toBe(3);
    expect(categoryBreakdown['Entertainment'].count).toBe(2);
    expect(categoryBreakdown['Utilities'].count).toBe(2);
    expect(categoryBreakdown['Healthcare'].count).toBe(1);
    expect(categoryBreakdown['Education'].count).toBe(1);
    
    // Step 5: Verify spending breakdown displays without manual categorization
    const totalCategorized = Object.values(categoryBreakdown).reduce((sum, cat) => sum + cat.count, 0);
    expect(totalCategorized).toBe(20);
  });

  test('QE-8296 TS-002 TC-001: Verify unrecognized merchant transaction is automatically assigned to Miscellaneous category as fallback', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Step 2: Simulate transaction at unrecognized merchant
    await dashboardPage.simulateNewTransaction({ merchant: 'XYZ Store', amount: 2500 });
    
    // Step 3: Navigate to Analytics dashboard
    await dashboardPage.navigateToAnalytics();
    
    // Step 4: Verify transaction is assigned to Miscellaneous category
    const miscCategory = await dashboardPage.getCategoryDetails('Miscellaneous');
    expect(miscCategory.count).toBe(1);
    expect(miscCategory.totalSpend).toBe('2,500');
    
    // Step 5: Verify transaction details are preserved
    const transactions = await dashboardPage.getTransactionsByCategory('Miscellaneous');
    expect(transactions[0].merchant).toBe('XYZ Store');
    expect(transactions[0].amount).toBe('2,500');
  });

  test('QE-8296 TS-003 TC-001: Verify category aggregation accuracy by validating sum of all category totals matches overall monthly spend', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Step 2: Simulate 15 transactions across multiple categories
    const transactions = [
      { category: 'Food & Dining', amount: 3500, count: 3 },
      { category: 'Fuel', amount: 2000, count: 2 },
      { category: 'Shopping', amount: 4200, count: 4 },
      { category: 'Entertainment', amount: 800, count: 1 },
      { category: 'Healthcare', amount: 1200, count: 1 },
      { category: 'Utilities', amount: 1500, count: 2 },
      { category: 'Travel', amount: 350, count: 1 },
      { category: 'Education', amount: 2500, count: 1 }
    ];
    await dashboardPage.simulateTransactionsByCategory(transactions);
    
    // Step 3: Navigate to Analytics dashboard
    await dashboardPage.navigateToAnalytics();
    
    // Step 4: Verify spending breakdown by category
    const categoryBreakdown = await dashboardPage.getCategoryBreakdown();
    expect(categoryBreakdown['Food & Dining'].totalSpend).toBe('3,500');
    expect(categoryBreakdown['Fuel'].totalSpend).toBe('2,000');
    expect(categoryBreakdown['Shopping'].totalSpend).toBe('4,200');
    
    // Step 5: Calculate sum of all category totals
    const categorySum = Object.values(categoryBreakdown).reduce((sum, cat) => sum + parseInt(cat.totalSpend.replace(/,/g, '')), 0);
    
    // Step 6: Verify sum matches overall monthly spend
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(categorySum.toString()).toBe(monthlySpend.replace(/,/g, ''));
    expect(monthlySpend).toBe('16,050');
  });
});

// Test Cases for QE-8293 (Consolidated Financial Metrics Dashboard)
test.describe('QE-8293: Consolidated Financial Metrics Dashboard', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test('QE-8293 TS-001 TC-001: Verify consolidated financial metrics display accurate aggregated values across 3 active credit cards', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Step 2: Simulate user with 3 active cards
    await dashboardPage.setupMultipleCards([
      { id: 'card001', limit: 50000, available: 35000, outstanding: 15000, monthlySpend: 12000 },
      { id: 'card002', limit: 30000, available: 20000, outstanding: 10000, monthlySpend: 8000 },
      { id: 'card003', limit: 20000, available: 15000, outstanding: 5000, monthlySpend: 4500 }
    ]);
    
    // Step 3: Dashboard loads and displays consolidated metrics
    await dashboardPage.waitForDashboardLoad();
    
    // Step 4-7: Verify all consolidated metrics
    const metrics = await dashboardPage.getFinancialMetrics();
    expect(metrics.monthlySpend).toBe('24,500');
    expect(metrics.totalCreditLimit).toBe('100,000');
    expect(metrics.availableCredit).toBe('70,000');
    expect(metrics.outstandingAmount).toBe('30,000');
    
    // Step 8: Verify all 4 metrics visible in unified interface
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });

  test('QE-8293 TS-002 TC-001: Verify dashboard displays clear message when user has no active credit cards', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Step 2: Simulate user with no active cards
    await dashboardPage.setupMultipleCards([]);
    
    // Step 3: Navigate to Financial Overview Dashboard
    await dashboardPage.waitForDashboardLoad();
    
    // Step 4: Verify clear message is displayed
    const message = await dashboardPage.getNoCardsMessage();
    expect(message).toContain('No active credit cards found');
    expect(message).toContain('Add or activate a credit card');
    
    // Step 5: Verify guidance is provided
    await expect(dashboardPage.addCardButton).toBeVisible();
    
    // Step 6: Verify financial metrics show zero or are not displayed
    const metrics = await dashboardPage.getFinancialMetrics();
    expect(metrics.monthlySpend).toBe('0');
    expect(metrics.totalCreditLimit).toBe('0');
  });

  test('QE-8293 TS-003 TC-001: Verify dashboard displays accurate financial metrics for single-card user', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Step 2: Simulate user with 1 active card
    await dashboardPage.setupMultipleCards([
      { id: 'card001', issuer: 'HDFC Bank', type: 'Visa Platinum', limit: 50000, available: 35000, outstanding: 15000, monthlySpend: 12000 }
    ]);
    
    // Step 3: Dashboard loads
    await dashboardPage.waitForDashboardLoad();
    
    // Step 4-7: Verify all metrics based on single card
    const metrics = await dashboardPage.getFinancialMetrics();
    expect(metrics.monthlySpend).toBe('12,000');
    expect(metrics.totalCreditLimit).toBe('50,000');
    expect(metrics.availableCredit).toBe('35,000');
    expect(metrics.outstandingAmount).toBe('15,000');
    
    // Step 8: Verify dashboard works correctly for single-card scenario
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });
});
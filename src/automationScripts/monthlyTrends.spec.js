const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { Logger } = require('../utils/logger');

test.describe('Monthly Spend Trends Visualization - QE-8450', () => {
  let analyticsPage;
  const logger = new Logger();

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    logger.info('Navigated to analytics page');
  });

  test('QE-8450 TS-001 TC-001: Verify system aggregates transaction data from all credit cards for the past 12 months and calculates accurate monthly spending totals', async () => {
    logger.info('Starting test: 12-month aggregation');
    
    await analyticsPage.waitForMonthlyTrendsChartToLoad();
    const monthlyData = await analyticsPage.getMonthlySpendTrends();
    
    expect(monthlyData.length).toBe(12);
    
    const janTotal = monthlyData.find(m => m.month === 'Jan');
    expect(janTotal.totalSpend).toBe(800);
    
    const febTotal = monthlyData.find(m => m.month === 'Feb');
    expect(febTotal.totalSpend).toBe(1000);
    
    for (const monthData of monthlyData) {
      const transactions = await analyticsPage.getTransactionsForMonth(monthData.month);
      const calculatedTotal = transactions.reduce((sum, txn) => sum + txn.amount, 0);
      expect(monthData.totalSpend).toBe(calculatedTotal);
    }
    
    logger.info('12-month aggregation validated successfully');
  });

  test('QE-8450 TS-002 TC-001: Verify system displays zero spend for months with zero transactions, maintaining continuity in the 12-month timeline', async () => {
    logger.info('Starting test: Zero transaction months');
    
    await analyticsPage.setupTestScenario({ 
      monthsWithTransactions: ['Jan', 'Feb', 'Apr', 'May', 'Jun', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] 
    });
    await analyticsPage.navigate();
    
    await analyticsPage.waitForMonthlyTrendsChartToLoad();
    const monthlyData = await analyticsPage.getMonthlySpendTrends();
    
    expect(monthlyData.length).toBe(12);
    
    const marData = monthlyData.find(m => m.month === 'Mar');
    expect(marData).toBeTruthy();
    expect(marData.totalSpend).toBe(0);
    
    const julData = monthlyData.find(m => m.month === 'Jul');
    expect(julData).toBeTruthy();
    expect(julData.totalSpend).toBe(0);
    
    logger.info('Zero spend months validated in continuous timeline');
  });

  test('QE-8450 TS-003 TC-001: Verify system correctly assigns transactions occurring on month boundaries to the correct monthly bucket based on transaction date', async () => {
    logger.info('Starting test: Month boundary processing');
    
    await analyticsPage.addTestTransaction({ date: '2024-01-31', amount: 500 });
    await analyticsPage.addTestTransaction({ date: '2024-02-01', amount: 600 });
    await analyticsPage.navigate();
    
    await analyticsPage.waitForMonthlyTrendsChartToLoad();
    const monthlyData = await analyticsPage.getMonthlySpendTrends();
    
    const janData = monthlyData.find(m => m.month === 'Jan');
    expect(janData.totalSpend).toBeGreaterThanOrEqual(500);
    
    const febData = monthlyData.find(m => m.month === 'Feb');
    expect(febData.totalSpend).toBeGreaterThanOrEqual(600);
    
    const janTransactions = await analyticsPage.getTransactionsForMonth('Jan');
    const jan31Transaction = janTransactions.find(txn => txn.date === '2024-01-31');
    expect(jan31Transaction).toBeTruthy();
    
    const febTransactions = await analyticsPage.getTransactionsForMonth('Feb');
    const feb1Transaction = febTransactions.find(txn => txn.date === '2024-02-01');
    expect(feb1Transaction).toBeTruthy();
    
    logger.info('Month boundary transactions assigned correctly');
  });
});

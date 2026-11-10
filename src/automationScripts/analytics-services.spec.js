const { test, expect } = require('@playwright/test');
const { AnalyticsServicePage } = require('./pages/analytics-service.page');
const { Logger } = require('../utils/logger');

test.describe('Analytics Service - Spending Insights', () => {
  let analyticsPage;
  const logger = new Logger('AnalyticsServicesSpec');

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsServicePage(page);
    logger.info('Test setup completed');
  });

  test('[QE-10369 TS-001 TC-001] Verify category-wise spending across all 9 categories', async () => {
    logger.info('Starting test: Category-wise spending validation');
    
    // Step 1: Initialize with transactions across all 9 categories
    const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    await analyticsPage.initializeTransactionsAcrossCategories(categories);
    logger.info('Transactions initialized across all 9 categories');
    
    // Step 2: Get spending analytics
    const dateRange = { startDate: '2023-11-01', endDate: '2024-01-31' };
    const analytics = await analyticsPage.getSpendingAnalytics(dateRange);
    logger.info('Spending analytics retrieved');
    
    // Step 3: Verify data aggregation
    expect(analytics.categoryWiseSpending).toBeDefined();
    logger.info('Data aggregation factory processed transactions');
    
    // Step 4: Verify 9 category entries
    expect(analytics.categoryWiseSpending.length).toBe(9);
    logger.info('Verified 9 category entries');
    
    // Step 5: Verify required fields
    for (const category of analytics.categoryWiseSpending) {
      expect(category).toHaveProperty('category');
      expect(category).toHaveProperty('amount');
      expect(category).toHaveProperty('percentage');
    }
    logger.info('All required fields present in category entries');
    
    // Step 6: Verify sum of amounts equals total spend
    const totalAmount = analytics.categoryWiseSpending.reduce((sum, cat) => sum + cat.amount, 0);
    const expectedTotal = await analyticsPage.calculateTotalTransactionAmount();
    expect(totalAmount).toBe(expectedTotal);
    logger.info('Sum of category amounts matches total spend');
    
    // Step 7: Verify sum of percentages equals 100%
    const totalPercentage = analytics.categoryWiseSpending.reduce((sum, cat) => sum + parseFloat(cat.percentage), 0);
    expect(totalPercentage).toBeCloseTo(100, 1);
    logger.info('Sum of percentages equals 100%');
    
    // Step 8: Verify each category has correct total
    await analyticsPage.verifyCategoryTotals(analytics.categoryWiseSpending);
    logger.info('Each category total verified against mock data');
    
    logger.info('Test completed successfully');
  });

  test('[QE-10369 TS-002 TC-001] Verify category spending calculation accuracy', async () => {
    logger.info('Starting test: Category spending calculation accuracy');
    
    // Step 1: Initialize with specific amounts
    await analyticsPage.initializeTransactionsWithAmounts({
      'Food & Dining': 1000,
      'Fuel': 500,
      'Others': 500
    });
    logger.info('Transactions initialized with specific amounts');
    
    // Step 2: Get spending analytics
    const analytics = await analyticsPage.getSpendingAnalytics();
    logger.info('Analytics processed');
    
    // Step 3: Extract categoryWiseSpending
    const categorySpending = analytics.categoryWiseSpending;
    expect(categorySpending).toBeDefined();
    logger.info('Category-wise spending extracted');
    
    // Step 4: Locate Food & Dining entry
    const foodDining = categorySpending.find(c => c.category === 'Food & Dining');
    expect(foodDining).toBeDefined();
    logger.info('Food & Dining entry located');
    
    // Step 5: Verify Food & Dining amount and percentage
    expect(foodDining.amount).toBe(1000);
    expect(parseFloat(foodDining.percentage)).toBeCloseTo(50.00, 1);
    logger.info('Food & Dining: amount=1000, percentage=50.00% verified');
    
    // Step 6: Locate Fuel entry
    const fuel = categorySpending.find(c => c.category === 'Fuel');
    expect(fuel).toBeDefined();
    logger.info('Fuel entry located');
    
    // Step 7: Verify Fuel amount and percentage
    expect(fuel.amount).toBe(500);
    expect(parseFloat(fuel.percentage)).toBeCloseTo(25.00, 1);
    logger.info('Fuel: amount=500, percentage=25.00% verified');
    
    // Step 8: Verify percentage calculation formula
    const totalSpend = 2000;
    const calculatedPercentage = (foodDining.amount / totalSpend) * 100;
    expect(parseFloat(foodDining.percentage)).toBeCloseTo(calculatedPercentage, 1);
    logger.info('Percentage calculation formula verified');
    
    logger.info('Test completed successfully');
  });

  test('[QE-10369 TS-003 TC-001] Verify invalid category defaults to Miscellaneous', async () => {
    logger.info('Starting test: Invalid category handling');
    
    // Step 1: Initialize with invalid category transaction
    await analyticsPage.initializeTransactionsWithInvalidCategory('InvalidCategory', 100);
    logger.info('Transaction with invalid category initialized');
    
    // Step 2: Get spending analytics
    const analytics = await analyticsPage.getSpendingAnalytics();
    logger.info('Analytics processed');
    
    // Step 3: Verify categorization method invoked
    expect(analytics.categoryWiseSpending).toBeDefined();
    logger.info('Category factory processed invalid transaction');
    
    // Step 4: Verify assigned to Miscellaneous
    const miscellaneous = analytics.categoryWiseSpending.find(c => c.category === 'Miscellaneous');
    expect(miscellaneous).toBeDefined();
    logger.info('Transaction assigned to Miscellaneous category');
    
    // Step 5: Locate Miscellaneous entry
    expect(miscellaneous.category).toBe('Miscellaneous');
    logger.info('Miscellaneous entry found');
    
    // Step 6: Verify amount includes invalid transaction
    expect(miscellaneous.amount).toBeGreaterThanOrEqual(100);
    logger.info('Miscellaneous total includes $100 from invalid transaction');
    
    // Step 7: Verify no data loss
    const totalSpend = analytics.categoryWiseSpending.reduce((sum, cat) => sum + cat.amount, 0);
    const expectedTotal = await analyticsPage.calculateTotalTransactionAmount();
    expect(totalSpend).toBe(expectedTotal);
    logger.info('No data loss confirmed - totals match');
    
    // Step 8: Verify no errors thrown
    expect(analytics).toBeDefined();
    logger.info('System handled invalid category gracefully');
    
    logger.info('Test completed successfully');
  });

  test('[QE-10359 TS-001 TC-001] Verify monthly spend aggregation across 6 months', async () => {
    logger.info('Starting test: Monthly spend aggregation');
    
    // Step 1: Initialize with 6 months of transactions
    await analyticsPage.initializeTransactionsFor6Months();
    logger.info('6 months of transactions initialized');
    
    // Step 2: Get spending analytics
    const dateRange = { startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), endDate: new Date() };
    const analytics = await analyticsPage.getSpendingAnalytics(dateRange);
    logger.info('Analytics retrieved for 6-month period');
    
    // Step 3: Verify monthly grouping
    expect(analytics.monthlyTrends).toBeDefined();
    logger.info('Transactions grouped by month');
    
    // Step 4: Verify 6 monthly entries
    expect(analytics.monthlyTrends.length).toBe(6);
    logger.info('Verified 6 monthly entries');
    
    // Step 5: Verify month and totalSpend fields
    for (const trend of analytics.monthlyTrends) {
      expect(trend).toHaveProperty('month');
      expect(trend).toHaveProperty('totalSpend');
    }
    logger.info('All monthly entries have required fields');
    
    // Step 6: Calculate expected monthly totals
    const expectedTotals = await analyticsPage.calculateExpectedMonthlyTotals();
    logger.info('Expected monthly totals calculated');
    
    // Step 7: Verify each month's total
    for (let i = 0; i < analytics.monthlyTrends.length; i++) {
      expect(analytics.monthlyTrends[i].totalSpend).toBe(expectedTotals[i]);
    }
    logger.info('All monthly totals verified as accurate');
    
    // Step 8: Verify chronological order
    await analyticsPage.verifyChronologicalOrder(analytics.monthlyTrends);
    logger.info('Monthly trends in chronological order');
    
    logger.info('Test completed successfully');
  });

  test('[QE-10359 TS-002 TC-001] Verify real-time current month updates within 2 seconds', async () => {
    logger.info('Starting test: Real-time current month updates');
    
    // Step 1: Initialize with current month transactions totaling $5000
    await analyticsPage.initializeCurrentMonthTransactions(5000);
    logger.info('Current month transactions initialized: $5000');
    
    // Step 2: Get initial analytics
    const initialAnalytics = await analyticsPage.getSpendingAnalytics();
    expect(initialAnalytics.currentMonthTotal).toBe(5000);
    logger.info('Initial current month total: $5000');
    
    // Step 3: Add new transaction
    await analyticsPage.addNewTransaction(500);
    logger.info('New transaction added: $500');
    
    // Step 4: Start performance timer
    const startTime = Date.now();
    logger.info('Performance timer started');
    
    // Step 5: Get updated analytics
    const updatedAnalytics = await analyticsPage.getSpendingAnalytics();
    logger.info('Updated analytics retrieved');
    
    // Step 6: Verify processing time <= 2 seconds
    const processingTime = Date.now() - startTime;
    expect(processingTime).toBeLessThanOrEqual(2000);
    logger.info(`Processing time: ${processingTime}ms (within 2 seconds)`);
    
    // Step 7: Verify updated total
    expect(updatedAnalytics.currentMonthTotal).toBe(5500);
    logger.info('Current month total updated to $5500');
    
    // Step 8: Verify monthly trends reflect update
    const currentMonthTrend = updatedAnalytics.monthlyTrends[updatedAnalytics.monthlyTrends.length - 1];
    expect(currentMonthTrend.totalSpend).toBe(5500);
    logger.info('Monthly trends array reflects updated total');
    
    logger.info('Test completed successfully');
  });

  test('[QE-10359 TS-003 TC-001] Verify empty transaction history handling', async () => {
    logger.info('Starting test: Empty transaction history handling');
    
    // Step 1: Initialize with zero transactions
    await analyticsPage.initializeEmptyTransactionHistory();
    logger.info('Empty transaction history initialized');
    
    // Step 2: Get spending analytics
    const analytics = await analyticsPage.getSpendingAnalytics();
    logger.info('Analytics retrieved');
    
    // Step 3: Verify valid response
    expect(analytics).toBeDefined();
    logger.info('Valid analytics object returned');
    
    // Step 4: Verify empty monthly trends
    expect(analytics.monthlyTrends).toEqual([]);
    expect(analytics.monthlyTrends.length).toBe(0);
    logger.info('Monthly trends array is empty');
    
    // Step 5: Verify currentMonthTotal = 0
    expect(analytics.currentMonthTotal).toBe(0);
    logger.info('Current month total verified: 0');
    
    // Step 6: Verify previousMonthTotal = 0
    expect(analytics.previousMonthTotal).toBe(0);
    logger.info('Previous month total verified: 0');
    
    // Step 7: Verify graceful handling
    await analyticsPage.verifyGracefulEmptyStateHandling(analytics);
    logger.info('Graceful empty state handling confirmed');
    
    // Step 8: Verify dashboard can render
    await analyticsPage.verifyDashboardRenderWithEmptyData();
    logger.info('Dashboard renders with empty data without errors');
    
    logger.info('Test completed successfully');
  });
});

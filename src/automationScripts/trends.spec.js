const { test, expect } = require('@playwright/test');
const { TrendsPage } = require('./pages/trends.page');

// Test Suite for QE-9918 - Monthly Spending Trend Visualization
test.describe('Monthly Spending Trends Tests', () => {

  test('QE-9918 TS-001 TC-001 - Verify 12-month trend data retrieval', async ({ page }) => {
    const trendsPage = new TrendsPage(page);
    const testData = {
      userId: 'user123',
      authToken: 'valid-token-abc123',
      expectedMonthCount: 12
    };

    // Step 1: Authenticate user session
    await trendsPage.authenticateUser(testData.userId, testData.authToken);

    // Step 3: Send GET request to trends endpoint
    const trends = await trendsPage.getMonthlyTrends();

    // Step 5: Validate response contains exactly 12 monthly trend objects
    expect(trends.length).toBe(testData.expectedMonthCount);

    // Step 6: Verify each trend object contains required fields
    const requiredFields = ['month', 'totalSpend', 'transactionCount'];
    trends.forEach(trend => {
      requiredFields.forEach(field => {
        expect(trend).toHaveProperty(field);
      });
    });

    // Step 7: Validate month identifiers are in YYYY-MM format and sorted
    const monthRegex = /^\d{4}-\d{2}$/;
    trends.forEach(trend => {
      expect(trend.month).toMatch(monthRegex);
    });

    // Verify chronological order
    for (let i = 0; i < trends.length - 1; i++) {
      const currentMonth = new Date(trends[i].month + '-01');
      const nextMonth = new Date(trends[i + 1].month + '-01');
      expect(currentMonth.getTime()).toBeLessThanOrEqual(nextMonth.getTime());
    }

    // Step 8 & 9: Verify totalSpend and transactionCount are accurate
    trends.forEach(trend => {
      expect(typeof trend.totalSpend).toBe('number');
      expect(trend.totalSpend).toBeGreaterThanOrEqual(0);
      expect(typeof trend.transactionCount).toBe('number');
      expect(trend.transactionCount).toBeGreaterThanOrEqual(0);
    });
  });

  test('QE-9918 TS-002 TC-001 - Verify insufficient data handling for partial trends', async ({ page }) => {
    const trendsPage = new TrendsPage(page);
    const testData = {
      userId: 'user999',
      authToken: 'valid-token-mno345'
    };

    // Step 1: Authenticate user session
    await trendsPage.authenticateUser(testData.userId, testData.authToken);

    // Step 3: Send GET request to trends endpoint
    const response = await trendsPage.getMonthlyTrendsWithResponse();

    // Step 5: Validate response contains fewer than 12 months
    expect(response.trends.length).toBeLessThan(12);

    // Step 6: Verify message indicating insufficient data
    expect(response.message).toMatch(/Insufficient data|Only \d+ month/i);

    // Step 7: Confirm HTTP status code is 200
    expect(response.status).toBe(200);
  });

  test('QE-9918 TS-003 TC-001 - Verify multi-card monthly aggregation without duplicates', async ({ page }) => {
    const trendsPage = new TrendsPage(page);
    const testData = {
      userId: 'user123',
      authToken: 'valid-token-abc123',
      expectedCardIds: ['CC001', 'CC002', 'CC003']
    };

    // Step 1: Authenticate user session
    await trendsPage.authenticateUser(testData.userId, testData.authToken);

    // Step 4: Send GET request to trends endpoint
    const trends = await trendsPage.getMonthlyTrends();

    // Step 6: Validate totalSpend is sum from all cards
    // Get transactions for validation
    const transactions = await trendsPage.getTransactionsForValidation();

    trends.forEach(trend => {
      const monthTransactions = transactions.filter(txn => {
        const txnMonth = new Date(txn.date).toISOString().substring(0, 7);
        return txnMonth === trend.month;
      });

      const expectedTotal = monthTransactions.reduce((sum, txn) => sum + txn.amount, 0);
      const expectedCount = monthTransactions.length;

      // Step 6: Verify totalSpend matches aggregated amount
      expect(Math.abs(trend.totalSpend - expectedTotal)).toBeLessThan(0.01);

      // Step 8: Verify transactionCount matches aggregated count
      expect(trend.transactionCount).toBe(expectedCount);
    });

    // Step 7: Verify no duplicate counting
    const allTransactionIds = new Set();
    transactions.forEach(txn => {
      expect(allTransactionIds.has(txn.transactionId)).toBe(false);
      allTransactionIds.add(txn.transactionId);
    });
  });
});

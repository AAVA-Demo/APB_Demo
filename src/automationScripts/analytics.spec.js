const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');

// Test Suite for QE-9920 - Category-Wise Spending Visualization
test.describe('Analytics - Category-Wise Spending Tests', () => {

  test('QE-9920 TS-001 TC-001 - Verify full category breakdown with all 9 categories', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    const testData = {
      userId: 'user123',
      authToken: 'valid-token-abc123',
      expectedCategories: [
        'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
        'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
      ]
    };

    // Step 1: Authenticate user session
    await analyticsPage.authenticateUser(testData.userId, testData.authToken);

    // Step 2: Retrieve all transactions
    const transactions = await analyticsPage.getTransactions(testData.userId);

    // Step 4-6: Aggregate and calculate category breakdown
    const categoryBreakdown = await analyticsPage.calculateCategoryBreakdown(transactions);

    // Step 7: Validate response contains all 9 categories
    expect(categoryBreakdown.length).toBe(testData.expectedCategories.length);
    testData.expectedCategories.forEach(category => {
      const found = categoryBreakdown.find(c => c.category === category);
      expect(found).toBeDefined();
      expect(found).toHaveProperty('totalAmount');
      expect(found).toHaveProperty('transactionCount');
      expect(found).toHaveProperty('percentageOfTotal');
    });

    // Step 8: Verify sum of percentages equals 100%
    const totalPercentage = categoryBreakdown.reduce((sum, cat) => sum + parseFloat(cat.percentageOfTotal), 0);
    expect(Math.round(totalPercentage)).toBe(100);
  });

  test('QE-9920 TS-002 TC-001 - Verify empty category breakdown for user with no transactions', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    const testData = {
      userId: 'user999',
      authToken: 'valid-token-ghi789'
    };

    // Step 1: Authenticate user session
    await analyticsPage.authenticateUser(testData.userId, testData.authToken);

    // Step 2: Retrieve transactions (should be empty)
    const response = await analyticsPage.getTransactionsWithResponse(testData.userId);

    // Step 3: Validate empty category breakdown
    expect(response.categoryBreakdown || response.data).toEqual([]);

    // Step 4: Verify message indicating no spending data
    expect(response.message).toMatch(/No spending data available/i);

    // Step 5: Confirm HTTP status code is 200
    expect(response.status).toBe(200);
  });

  test('QE-9920 TS-003 TC-001 - Verify partial category breakdown with only 3 categories', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    const testData = {
      userId: 'user456',
      authToken: 'valid-token-jkl012',
      expectedCategories: ['Food & Dining', 'Fuel', 'Shopping'],
      excludedCategories: ['Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous']
    };

    // Step 1: Authenticate user session
    await analyticsPage.authenticateUser(testData.userId, testData.authToken);

    // Step 2: Retrieve all transactions
    const transactions = await analyticsPage.getTransactions(testData.userId);

    // Step 4-6: Aggregate and calculate category breakdown
    const categoryBreakdown = await analyticsPage.calculateCategoryBreakdown(transactions);

    // Step 7: Validate response contains only 3 categories
    expect(categoryBreakdown.length).toBe(testData.expectedCategories.length);
    testData.expectedCategories.forEach(category => {
      const found = categoryBreakdown.find(c => c.category === category);
      expect(found).toBeDefined();
    });

    // Step 8: Verify excluded categories are not in response
    testData.excludedCategories.forEach(category => {
      const found = categoryBreakdown.find(c => c.category === category);
      expect(found).toBeUndefined();
    });

    // Step 9: Verify sum of percentages equals 100%
    const totalPercentage = categoryBreakdown.reduce((sum, cat) => sum + parseFloat(cat.percentageOfTotal), 0);
    expect(Math.round(totalPercentage)).toBe(100);
  });
});

// Test Suite for QE-9919 - Interactive Spending Pattern Analysis
test.describe('Analytics - Interactive Filtering Tests', () => {

  test('QE-9919 TS-001 TC-001 - Verify category filter application', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    const testData = {
      userId: 'user123',
      authToken: 'valid-token-abc123',
      selectedCategory: 'Food & Dining'
    };

    // Step 1: Authenticate user session
    await analyticsPage.authenticateUser(testData.userId, testData.authToken);

    // Step 2: Retrieve all transactions
    const transactions = await analyticsPage.getTransactions(testData.userId);

    // Step 3 & 4: Apply category filter
    const filteredTransactions = await analyticsPage.filterByCategory(transactions, testData.selectedCategory);

    // Step 5 & 6: Aggregate filtered data
    const categoryBreakdown = await analyticsPage.calculateCategoryBreakdown(filteredTransactions);

    // Step 7: Validate only selected category in response
    expect(categoryBreakdown.length).toBe(1);
    expect(categoryBreakdown[0].category).toBe(testData.selectedCategory);

    // Step 8: Verify no other categories in response
    filteredTransactions.forEach(txn => {
      expect(txn.category).toBe(testData.selectedCategory);
    });
  });

  test('QE-9919 TS-002 TC-001 - Verify invalid category filter returns empty result', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    const testData = {
      userId: 'user123',
      authToken: 'valid-token-abc123',
      selectedCategory: 'InvalidCategory'
    };

    // Step 1: Authenticate user session
    await analyticsPage.authenticateUser(testData.userId, testData.authToken);

    // Step 2: Retrieve all transactions
    const transactions = await analyticsPage.getTransactions(testData.userId);

    // Step 3 & 4: Apply invalid category filter
    const response = await analyticsPage.filterByCategoryWithValidation(transactions, testData.selectedCategory);

    // Step 5: Verify empty result or validation error
    expect(response.data || response).toEqual([]);

    // Step 6: Confirm appropriate status code
    expect([200, 400]).toContain(response.status || 200);
  });

  test('QE-9919 TS-003 TC-001 - Verify combined category and card filter', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    const testData = {
      userId: 'user123',
      authToken: 'valid-token-abc123',
      selectedCategory: 'Fuel',
      selectedCard: 'CC001'
    };

    // Step 1: Authenticate user session
    await analyticsPage.authenticateUser(testData.userId, testData.authToken);

    // Step 2: Retrieve all transactions
    const transactions = await analyticsPage.getTransactions(testData.userId);

    // Step 3-5: Apply both filters
    const filteredTransactions = await analyticsPage.filterByCategoryAndCard(
      transactions,
      testData.selectedCategory,
      testData.selectedCard
    );

    // Step 8: Validate all transactions match both criteria
    filteredTransactions.forEach(txn => {
      expect(txn.category).toBe(testData.selectedCategory);
      expect(txn.cardId).toBe(testData.selectedCard);
    });

    // Step 9: Verify no transactions from other categories or cards
    const invalidTransactions = filteredTransactions.filter(
      txn => txn.category !== testData.selectedCategory || txn.cardId !== testData.selectedCard
    );
    expect(invalidTransactions.length).toBe(0);
  });
});

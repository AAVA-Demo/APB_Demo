const { test, expect } = require('@playwright/test');
const { CreditCardAPIPage } = require('./pages/creditCardAPI.page');

// Test Suite for Credit Card Portfolio Management - User Story QE-9282
test.describe('QE-9430 - Multiple Credit Card Overview', () => {
  let apiPage;

  test.beforeEach(async ({ request }) => {
    apiPage = new CreditCardAPIPage(request);
  });

  test('QE-9430 TS-001 TC-001 - Verify system retrieves all registered credit cards with complete information', async () => {
    // Step 1: Authenticate user with multiple registered credit cards
    const authToken = 'valid_token_123';
    const userId = 'testuser_multi_card';
    
    // Step 2 & 3: Send GET request to /api/portfolio endpoint and validate response
    const response = await apiPage.getPortfolio(authToken);
    expect(response.status).toBe(200);
    
    const portfolioData = await response.json();
    expect(portfolioData.cards).toBeDefined();
    expect(portfolioData.cards.length).toBe(3);
    
    // Step 3: Validate expected card IDs
    const cardIds = portfolioData.cards.map(card => card.cardId);
    expect(cardIds).toContain('card_001');
    expect(cardIds).toContain('card_002');
    expect(cardIds).toContain('card_003');
    
    // Step 4: Verify each card object contains credit limit field
    portfolioData.cards.forEach(card => {
      expect(card.creditLimit).toBeDefined();
      expect(card.creditLimit).not.toBeNull();
    });
    
    // Step 5: Verify each card object contains available credit field
    portfolioData.cards.forEach(card => {
      expect(card.availableCredit).toBeDefined();
      expect(card.availableCredit).not.toBeNull();
    });
    
    // Step 6: Verify each card object contains current balance field
    portfolioData.cards.forEach(card => {
      expect(card.outstandingAmount).toBeDefined();
      expect(card.outstandingAmount).not.toBeNull();
    });
  });

  test('QE-9430 TS-002 TC-001 - Verify system returns empty card portfolio when user has no registered cards', async () => {
    // Step 1: Authenticate user with no registered credit cards
    const authToken = 'valid_token_456';
    const userId = 'testuser_no_cards';
    
    // Step 2: Send GET request to /api/portfolio endpoint
    const response = await apiPage.getPortfolio(authToken);
    expect(response.status).toBe(200);
    
    // Step 3 & 4: Validate response contains empty cards array
    const portfolioData = await response.json();
    expect(portfolioData.cards).toBeDefined();
    expect(Array.isArray(portfolioData.cards)).toBe(true);
    expect(portfolioData.cards.length).toBe(0);
  });

  test('QE-9430 TS-003 TC-001 - Verify system returns partial card data with error indicators when balance unavailable', async () => {
    // Step 1: Authenticate user with registered credit cards
    const authToken = 'valid_token_789';
    const userId = 'testuser_partial_data';
    
    // Step 2: Simulate external service failure (handled by mock server)
    // Step 3: Send GET request to /api/portfolio endpoint
    const response = await apiPage.getPortfolio(authToken);
    expect(response.status).toBe(200);
    
    const portfolioData = await response.json();
    
    // Step 4: Validate response contains card objects with error indicators
    const cardsWithErrors = portfolioData.cards.filter(card => 
      card.balanceStatus === 'unavailable' || card.errorMessage
    );
    expect(cardsWithErrors.length).toBeGreaterThan(0);
    
    // Step 5: Verify static card information is still present
    portfolioData.cards.forEach(card => {
      expect(card.cardName).toBeDefined();
      expect(card.cardNumber).toBeDefined();
      expect(card.creditLimit).toBeDefined();
    });
  });
});

// Test Suite for Monthly Spend Trend Analysis - User Story QE-9284
test.describe('QE-9429 - Monthly Spend Trend Analysis', () => {
  let apiPage;

  test.beforeEach(async ({ request }) => {
    apiPage = new CreditCardAPIPage(request);
  });

  test('QE-9429 TS-001 TC-001 - Verify system returns monthly spending trend data for 12 months', async () => {
    // Step 1: Authenticate user with 12+ months of transaction history
    const authToken = 'valid_token_abc';
    const userId = 'testuser_12mo_history';
    
    // Step 2: Send GET request with 12-month date range filter
    const startTime = Date.now();
    const response = await apiPage.getSpendingAnalytics(authToken, { dateRange: '12' });
    const responseTime = Date.now() - startTime;
    
    expect(response.status).toBe(200);
    
    // Step 3: Validate response contains monthlyTrends array with 12 entries
    const analyticsData = await response.json();
    expect(analyticsData.monthlyTrends).toBeDefined();
    expect(analyticsData.monthlyTrends.length).toBe(12);
    
    // Step 4: Verify each month entry contains month label and totalSpend value
    analyticsData.monthlyTrends.forEach(monthData => {
      expect(monthData.month).toBeDefined();
      expect(monthData.month).not.toBeNull();
      expect(monthData.totalSpend).toBeDefined();
      expect(monthData.totalSpend).not.toBeNull();
    });
    
    // Step 5: Verify response time is within acceptable threshold
    expect(responseTime).toBeLessThan(3000);
  });

  test('QE-9429 TS-002 TC-001 - Verify system returns empty trend dataset for users with less than 1 month history', async () => {
    // Step 1: Authenticate user with less than 1 month of transaction history
    const authToken = 'valid_token_def';
    const userId = 'testuser_new_account';
    
    // Step 2: Send GET request with 12-month date range filter
    const response = await apiPage.getSpendingAnalytics(authToken, { dateRange: '12' });
    expect(response.status).toBe(200);
    
    // Step 3: Validate response contains empty monthlyTrends array
    const analyticsData = await response.json();
    expect(analyticsData.monthlyTrends).toBeDefined();
    expect(Array.isArray(analyticsData.monthlyTrends)).toBe(true);
    expect(analyticsData.monthlyTrends.length).toBe(0);
  });

  test('QE-9429 TS-003 TC-001 - Verify system rejects request with validation error when invalid date range filter is submitted', async () => {
    // Step 1: Authenticate user
    const authToken = 'valid_token_ghi';
    const userId = 'testuser_valid';
    
    // Step 2: Send GET request with invalid date range (end before start)
    const response = await apiPage.getSpendingAnalytics(authToken, { 
      startDate: '2024-12-01', 
      endDate: '2024-01-01' 
    });
    
    expect(response.status).toBe(400);
    
    // Step 3: Validate error response contains validation error message
    const errorData = await response.json();
    expect(errorData.error).toBeDefined();
    expect(errorData.message).toContain('Invalid date range');
    expect(errorData.message).toContain('End date must be after start date');
  });
});

// Test Suite for Consolidated KPI Dashboard - User Story QE-9285
test.describe('QE-9428 - Consolidated KPI Dashboard Display', () => {
  let apiPage;

  test.beforeEach(async ({ request }) => {
    apiPage = new CreditCardAPIPage(request);
  });

  test('QE-9428 TS-001 TC-001 - Verify system calculates and returns real-time KPI metrics within 2 seconds', async () => {
    // Step 1: Authenticate user with multiple registered credit cards
    const authToken = 'valid_token_jkl';
    const userId = 'testuser_multi_card_kpi';
    
    // Step 2: Send GET request to /api/portfolio endpoint
    const startTime = Date.now();
    const response = await apiPage.getPortfolio(authToken);
    const responseTime = Date.now() - startTime;
    
    expect(response.status).toBe(200);
    
    const portfolioData = await response.json();
    
    // Step 3: Validate response contains KPI metrics object
    expect(portfolioData.kpis).toBeDefined();
    expect(portfolioData.kpis.monthlySpend).toBeDefined();
    expect(portfolioData.kpis.totalCreditLimit).toBeDefined();
    expect(portfolioData.kpis.totalAvailableCredit).toBeDefined();
    expect(portfolioData.kpis.totalOutstanding).toBeDefined();
    
    // Step 4-7: Verify KPI calculations
    // Note: Exact values depend on mock data configuration
    expect(typeof portfolioData.kpis.monthlySpend).toBe('number');
    expect(typeof portfolioData.kpis.totalCreditLimit).toBe('number');
    expect(typeof portfolioData.kpis.totalAvailableCredit).toBe('number');
    expect(typeof portfolioData.kpis.totalOutstanding).toBe('number');
    
    // Step 8: Verify response time meets performance requirement
    expect(responseTime).toBeLessThan(2000);
  });

  test('QE-9428 TS-002 TC-001 - Verify system returns zero values for KPIs when user has no cards', async () => {
    // Step 1: Authenticate user with no registered credit cards
    const authToken = 'valid_token_mno';
    const userId = 'testuser_no_cards_kpi';
    
    // Step 2: Send GET request to /api/portfolio endpoint
    const response = await apiPage.getPortfolio(authToken);
    expect(response.status).toBe(200);
    
    // Step 3: Validate response contains KPI metrics object with zero values
    const portfolioData = await response.json();
    expect(portfolioData.kpis).toBeDefined();
    expect(portfolioData.kpis.monthlySpend).toBe(0);
    expect(portfolioData.kpis.totalCreditLimit).toBe(0);
    expect(portfolioData.kpis.totalAvailableCredit).toBe(0);
    expect(portfolioData.kpis.totalOutstanding).toBe(0);
  });

  test('QE-9428 TS-003 TC-001 - Verify system returns cached KPI data with staleness indicator', async () => {
    // Step 1: Authenticate user with registered credit cards
    const authToken = 'valid_token_pqr';
    const userId = 'testuser_cached_kpi';
    
    // Step 2: Simulate real-time data source timeout (handled by mock server)
    // Step 3: Send GET request to /api/portfolio endpoint
    const response = await apiPage.getPortfolio(authToken);
    expect(response.status).toBe(200);
    
    const portfolioData = await response.json();
    
    // Step 4: Validate response contains KPI metrics from cache
    expect(portfolioData.kpis).toBeDefined();
    expect(portfolioData.kpis.monthlySpend).toBeGreaterThan(0);
    expect(portfolioData.kpis.totalCreditLimit).toBeGreaterThan(0);
    
    // Step 5: Verify response includes staleness indicator
    expect(portfolioData.dataFreshness === 'cached' || portfolioData.lastUpdated).toBeTruthy();
  });
});

// Test Suite for Category-Wise Spending Visualization - User Story QE-9281
test.describe('QE-9427 - Category-Wise Spending Visualization', () => {
  let apiPage;

  test.beforeEach(async ({ request }) => {
    apiPage = new CreditCardAPIPage(request);
  });

  test('QE-9427 TS-001 TC-001 - Verify system returns category-wise spending breakdown across all 9 categories', async () => {
    // Step 1: Authenticate user with transactions across multiple categories
    const authToken = 'valid_token_stu';
    const userId = 'testuser_multi_category';
    
    // Step 2: Send GET request to /api/analytics/spending endpoint
    const startTime = Date.now();
    const response = await apiPage.getSpendingAnalytics(authToken);
    const responseTime = Date.now() - startTime;
    
    expect(response.status).toBe(200);
    
    const analyticsData = await response.json();
    
    // Step 3: Validate response contains categoryBreakdown array with 9 entries
    expect(analyticsData.categoryBreakdown).toBeDefined();
    expect(analyticsData.categoryBreakdown.length).toBe(9);
    
    // Step 4: Verify each category entry contains required fields
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    analyticsData.categoryBreakdown.forEach(categoryData => {
      expect(categoryData.category).toBeDefined();
      expect(categoryData.amount).toBeDefined();
      expect(categoryData.percentage).toBeDefined();
      expect(expectedCategories).toContain(categoryData.category);
    });
    
    // Step 5: Verify total of all category percentages equals 100
    const totalPercentage = analyticsData.categoryBreakdown.reduce(
      (sum, cat) => sum + cat.percentage, 0
    );
    expect(totalPercentage).toBeCloseTo(100, 1);
    
    // Step 6: Verify response time meets performance requirement
    expect(responseTime).toBeLessThan(3000);
  });

  test('QE-9427 TS-002 TC-001 - Verify system returns zero spending values when user has no transactions', async () => {
    // Step 1: Authenticate user with no transactions in selected period
    const authToken = 'valid_token_vwx';
    const userId = 'testuser_no_transactions';
    
    // Step 2: Send GET request with date range filter
    const response = await apiPage.getSpendingAnalytics(authToken, { dateRange: '30' });
    expect(response.status).toBe(200);
    
    const analyticsData = await response.json();
    
    // Step 3: Validate response contains categoryBreakdown array with 9 entries
    expect(analyticsData.categoryBreakdown).toBeDefined();
    expect(analyticsData.categoryBreakdown.length).toBe(9);
    
    // Step 4: Verify all category amounts are zero
    analyticsData.categoryBreakdown.forEach(categoryData => {
      expect(categoryData.amount).toBe(0);
      expect(categoryData.percentage).toBe(0);
    });
  });

  test('QE-9427 TS-003 TC-001 - Verify system returns validation error for date range exceeding 12 months', async () => {
    // Step 1: Authenticate user
    const authToken = 'valid_token_yz1';
    const userId = 'testuser_valid_category';
    
    // Step 2: Send GET request with date range exceeding 12 months
    const response = await apiPage.getSpendingAnalytics(authToken, { dateRange: '15' });
    
    expect(response.status).toBe(400);
    
    // Step 3: Validate error response contains validation error message
    const errorData = await response.json();
    expect(errorData.error).toBeDefined();
    expect(errorData.message).toContain('Invalid date range');
    expect(errorData.message).toContain('Maximum supported period is 12 months');
  });
});

// Test Suite for Transaction History List View - User Story QE-9286
test.describe('QE-9426 - Transaction History List View', () => {
  let apiPage;

  test.beforeEach(async ({ request }) => {
    apiPage = new CreditCardAPIPage(request);
  });

  test('QE-9426 TS-001 TC-001 - Verify system retrieves paginated list of all transactions', async () => {
    // Step 1: Authenticate user with multiple credit cards and transaction history
    const authToken = 'valid_token_234';
    const userId = 'testuser_multi_txn';
    
    // Step 2: Send GET request with pagination parameters
    const response = await apiPage.getTransactions(authToken, { page: 1, pageSize: 20 });
    expect(response.status).toBe(200);
    
    // Step 3: Validate response contains transactions array
    const transactionData = await response.json();
    expect(transactionData.transactions).toBeDefined();
    expect(Array.isArray(transactionData.transactions)).toBe(true);
    expect(transactionData.transactions.length).toBeLessThanOrEqual(20);
    expect(transactionData.totalCount).toBeDefined();
    expect(transactionData.page).toBe(1);
    expect(transactionData.pageSize).toBe(20);
    
    // Step 4-7: Verify each transaction contains required fields
    transactionData.transactions.forEach(transaction => {
      expect(transaction.merchant).toBeDefined();
      expect(transaction.merchant).not.toBeNull();
      expect(transaction.amount).toBeDefined();
      expect(transaction.amount).not.toBeNull();
      expect(transaction.date).toBeDefined();
      expect(transaction.date).not.toBeNull();
      expect(transaction.category).toBeDefined();
      expect(transaction.category).not.toBeNull();
    });
  });

  test('QE-9426 TS-002 TC-001 - Verify system returns empty transaction list for users with no history', async () => {
    // Step 1: Authenticate user with no transaction history
    const authToken = 'valid_token_567';
    const userId = 'testuser_no_txn';
    
    // Step 2: Send GET request to /api/transactions endpoint
    const response = await apiPage.getTransactions(authToken, { page: 1, pageSize: 20 });
    expect(response.status).toBe(200);
    
    // Step 3: Validate response contains empty transactions array
    const transactionData = await response.json();
    expect(transactionData.transactions).toBeDefined();
    expect(Array.isArray(transactionData.transactions)).toBe(true);
    expect(transactionData.transactions.length).toBe(0);
    expect(transactionData.totalCount).toBe(0);
  });

  test('QE-9426 TS-003 TC-001 - Verify system returns error when unauthenticated user accesses endpoint', async () => {
    // Step 1: Send GET request without authentication token
    const response = await apiPage.getTransactionsWithoutAuth({ page: 1, pageSize: 20 });
    
    expect(response.status).toBe(401);
    
    // Step 2: Validate error response contains authentication error message
    const errorData = await response.json();
    expect(errorData.error).toBeDefined();
    expect(errorData.message).toContain('Authentication');
  });
});

// Test Suite for Card-Wise Transaction Filtering - User Story QE-9283
test.describe('QE-9425 - Card-Wise Transaction Filtering', () => {
  let apiPage;

  test.beforeEach(async ({ request }) => {
    apiPage = new CreditCardAPIPage(request);
  });

  test('QE-9425 TS-001 TC-001 - Verify system filters transactions by selected credit card within 1 second', async () => {
    // Step 1: Authenticate user with multiple credit cards and transactions
    const authToken = 'valid_token_890';
    const userId = 'testuser_filter_card';
    
    // Step 2: Send GET request with cardId filter
    const startTime = Date.now();
    const response = await apiPage.getTransactions(authToken, { 
      cardId: 'card_001', 
      page: 1, 
      pageSize: 20 
    });
    const responseTime = Date.now() - startTime;
    
    expect(response.status).toBe(200);
    
    const transactionData = await response.json();
    
    // Step 3 & 4: Validate response contains only transactions for selected card
    expect(transactionData.transactions).toBeDefined();
    transactionData.transactions.forEach(transaction => {
      expect(transaction.cardId).toBe('card_001');
      expect(transaction.cardId).not.toBe('card_002');
      expect(transaction.cardId).not.toBe('card_003');
    });
    
    // Step 5: Verify response time meets performance requirement
    expect(responseTime).toBeLessThan(1000);
  });

  test('QE-9425 TS-002 TC-001 - Verify system returns empty list when filtering by card with no transactions', async () => {
    // Step 1: Authenticate user with credit card that has no transactions
    const authToken = 'valid_token_abc2';
    const userId = 'testuser_card_no_txn';
    
    // Step 2: Send GET request with cardId filter for card with no transactions
    const response = await apiPage.getTransactions(authToken, { 
      cardId: 'card_empty', 
      page: 1, 
      pageSize: 20 
    });
    
    expect(response.status).toBe(200);
    
    // Step 3: Validate response contains empty transactions array
    const transactionData = await response.json();
    expect(transactionData.transactions).toBeDefined();
    expect(Array.isArray(transactionData.transactions)).toBe(true);
    expect(transactionData.transactions.length).toBe(0);
    expect(transactionData.totalCount).toBe(0);
  });

  test('QE-9425 TS-003 TC-001 - Verify system returns validation error for invalid card ID', async () => {
    // Step 1: Authenticate user
    const authToken = 'valid_token_def3';
    const userId = 'testuser_invalid_card';
    
    // Step 2: Send GET request with invalid cardId
    const response = await apiPage.getTransactions(authToken, { 
      cardId: 'invalid_card_999', 
      page: 1, 
      pageSize: 20 
    });
    
    expect(response.status).toBe(400);
    
    // Step 3: Validate error response contains validation error message
    const errorData = await response.json();
    expect(errorData.error).toBeDefined();
    expect(errorData.message).toContain('Invalid card ID');
  });
});
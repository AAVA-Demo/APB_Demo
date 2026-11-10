const { test, expect } = require('@playwright/test');
const { TransactionPage } = require('./pages/transaction.page');

// Test Suite for QE-9922 - Transaction History Listing Display
test.describe('Transaction Management Tests', () => {

  test('QE-9922 TS-001 TC-001 - Verify paginated transaction retrieval with 20 records', async ({ page }) => {
    const transactionPage = new TransactionPage(page);
    const testData = {
      userId: 'user123',
      authToken: 'valid-token-abc123',
      page: 1,
      size: 20
    };

    // Step 1: Authenticate user session
    await transactionPage.authenticateUser(testData.userId, testData.authToken);

    // Step 2 & 3: Send GET request with pagination parameters
    const response = await transactionPage.getTransactions(testData.page, testData.size);

    // Step 4: Validate response contains exactly 20 transaction objects
    expect(response.data.length).toBe(testData.size);

    // Step 5: Verify each transaction contains required fields
    const requiredFields = ['transactionId', 'date', 'merchant', 'amount', 'category', 'cardId'];
    response.data.forEach(transaction => {
      requiredFields.forEach(field => {
        expect(transaction).toHaveProperty(field);
      });
    });

    // Step 6: Validate pagination metadata
    expect(response.pagination).toHaveProperty('totalRecords');
    expect(response.pagination).toHaveProperty('totalPages');
    expect(response.pagination.currentPage).toBe(testData.page);
    expect(response.pagination.pageSize).toBe(testData.size);

    // Step 7: Confirm transactions are sorted by date descending
    for (let i = 0; i < response.data.length - 1; i++) {
      const currentDate = new Date(response.data[i].date);
      const nextDate = new Date(response.data[i + 1].date);
      expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
    }
  });

  test('QE-9922 TS-002 TC-001 - Verify validation error for invalid page number', async ({ page }) => {
    const transactionPage = new TransactionPage(page);
    const testData = {
      userId: 'user123',
      authToken: 'valid-token-abc123',
      page: -1,
      size: 20
    };

    // Step 1: Authenticate user session
    await transactionPage.authenticateUser(testData.userId, testData.authToken);

    // Step 2: Send GET request with invalid page parameter
    const response = await transactionPage.getTransactionsWithInvalidParams(testData.page, testData.size);

    // Step 4: Verify response returns HTTP status code 400
    expect(response.status).toBe(400);

    // Step 5: Confirm error message indicates invalid pagination
    expect(response.error).toContain('Page number must be greater than or equal to 1');
  });

  test('QE-9922 TS-002 TC-002 - Verify validation error for page exceeding total pages', async ({ page }) => {
    const transactionPage = new TransactionPage(page);
    const testData = {
      userId: 'user123',
      authToken: 'valid-token-abc123',
      page: 10,
      size: 20,
      expectedTotalPages: 5
    };

    // Step 1: Authenticate user session
    await transactionPage.authenticateUser(testData.userId, testData.authToken);

    // Step 2: Determine total pages
    const initialResponse = await transactionPage.getTransactions(1, testData.size);
    const totalPages = initialResponse.pagination.totalPages;

    // Step 3: Send GET request with page exceeding total pages
    const response = await transactionPage.getTransactionsWithInvalidParams(testData.page, testData.size);

    // Step 4: Verify response returns HTTP status code 400 or 404
    expect([400, 404]).toContain(response.status);

    // Step 5: Confirm error message indicates page exceeds total
    expect(response.error).toMatch(/exceeds total pages|out of range/i);
  });

  test('QE-9922 TS-003 TC-001 - Verify multi-card transaction aggregation with sorting', async ({ page }) => {
    const transactionPage = new TransactionPage(page);
    const testData = {
      userId: 'user123',
      authToken: 'valid-token-abc123',
      page: 1,
      size: 20,
      expectedCardIds: ['CC001', 'CC002', 'CC003']
    };

    // Step 1: Authenticate user session
    await transactionPage.authenticateUser(testData.userId, testData.authToken);

    // Step 3: Send GET request with pagination parameters
    const response = await transactionPage.getTransactions(testData.page, testData.size);

    // Step 5: Validate response contains transactions from all credit cards
    const cardIdsInResponse = [...new Set(response.data.map(t => t.cardId))];
    testData.expectedCardIds.forEach(cardId => {
      expect(cardIdsInResponse).toContain(cardId);
    });

    // Step 6: Verify transactions are sorted by date descending across all cards
    for (let i = 0; i < response.data.length - 1; i++) {
      const currentDate = new Date(response.data[i].date);
      const nextDate = new Date(response.data[i + 1].date);
      expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
    }

    // Step 7: Validate pagination metadata reflects total across all cards
    expect(response.pagination.totalRecords).toBeGreaterThan(0);
    expect(response.pagination.totalPages).toBeGreaterThan(0);
  });
});

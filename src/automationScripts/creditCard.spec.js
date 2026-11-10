const { test, expect } = require('@playwright/test');
const { CreditCardPage } = require('./pages/creditCard.page');

// Test Suite for QE-9923 - Multiple Credit Card View
test.describe('Credit Card Management Tests', () => {

  test('QE-9923 TS-001 TC-001 - Verify user with 3 registered credit cards can retrieve all card details', async ({ page }) => {
    const creditCardPage = new CreditCardPage(page);
    const testData = {
      userId: 'user123',
      authToken: 'valid-token-abc123',
      expectedCardCount: 3
    };

    // Step 1: Authenticate user session
    await creditCardPage.authenticateUser(testData.userId, testData.authToken);
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 2 & 3: Send GET request and retrieve credit card data
    const cards = await creditCardPage.getCreditCards(testData.userId);

    // Step 4: Validate response contains exactly 3 credit card objects
    expect(cards.length).toBe(testData.expectedCardCount);

    // Step 5: Verify each card object contains required fields
    const requiredFields = ['cardId', 'cardNumber', 'cardType', 'totalCreditLimit', 'outstandingAmount', 'monthlySpend'];
    cards.forEach(card => {
      requiredFields.forEach(field => {
        expect(card).toHaveProperty(field);
      });
    });

    // Step 6: Validate data types and value ranges
    cards.forEach(card => {
      expect(typeof card.cardId).toBe('string');
      expect(typeof card.totalCreditLimit).toBe('number');
      expect(card.totalCreditLimit).toBeGreaterThan(0);
      expect(typeof card.outstandingAmount).toBe('number');
      expect(card.outstandingAmount).toBeGreaterThanOrEqual(0);
    });
  });

  test('QE-9923 TS-002 TC-001 - Verify user with no registered credit cards receives empty card list', async ({ page }) => {
    const creditCardPage = new CreditCardPage(page);
    const testData = {
      userId: 'user456',
      authToken: 'valid-token-xyz789'
    };

    // Step 1: Authenticate user session
    await creditCardPage.authenticateUser(testData.userId, testData.authToken);

    // Step 2 & 3: Send GET request for user with no cards
    const response = await creditCardPage.getCreditCardsWithResponse(testData.userId);

    // Step 4: Validate response returns empty array
    expect(response.cards).toEqual([]);

    // Step 5: Verify response includes appropriate message
    expect(response.message).toContain('No credit cards available');

    // Step 6: Confirm HTTP status code is 200
    expect(response.status).toBe(200);
  });

  test('QE-9923 TS-003 TC-001 - Verify invalid session cannot retrieve credit card data', async ({ page }) => {
    const creditCardPage = new CreditCardPage(page);
    const testData = {
      userId: 'user123',
      authToken: null
    };

    // Step 1: Attempt GET request without valid authentication token
    const response = await creditCardPage.getCreditCardsWithInvalidAuth(testData.userId, testData.authToken);

    // Step 3: Verify response returns HTTP status code 401
    expect(response.status).toBe(401);

    // Step 4: Confirm error message indicates authentication failure
    expect(response.error).toContain('Authentication failed');

    // Step 5: Ensure no credit card information is exposed
    expect(response).not.toHaveProperty('cards');
    expect(response).not.toHaveProperty('cardId');
    expect(response).not.toHaveProperty('cardNumber');
  });
});

const { test, expect } = require('@playwright/test');
const { CreditCardsPage } = require('./pages/credit-cards.page');
const { ApiHelper } = require('./helpers/api.helper');

/**
 * Test Suite: Multiple Credit Cards Overview
 * Epic: QE-8357 - Dashboard KPIs and Credit Card Overview
 * Test Cases: QE-8460 TS-001 TC-001, QE-8460 TS-002 TC-001, QE-8460 TS-003 TC-001
 */

test.describe('Multiple Credit Cards Overview', () => {
  let creditCardsPage;
  let apiHelper;

  test.beforeEach(async ({ page }) => {
    creditCardsPage = new CreditCardsPage(page);
    apiHelper = new ApiHelper(page);
  });

  /**
   * Test Case ID: QE-8460 TS-001 TC-001
   * Description: Verify user with 3 registered credit cards sees all cards with accurate details
   */
  test('TC-001: Verify display of 3 credit cards with accurate balances and limits', async ({ page }) => {
    // Step 1: Setup test data with 3 credit cards
    const testUserId = 'testuser_3cards';
    const expectedCards = [
      { cardId: 'card_001', limit: 5000, outstanding: 2000, available: 3000 },
      { cardId: 'card_002', limit: 10000, outstanding: 3000, available: 7000 },
      { cardId: 'card_003', limit: 8000, outstanding: 1000, available: 7000 }
    ];

    // Step 2: Send API request to retrieve credit cards
    const response = await apiHelper.getCreditCards(testUserId);
    expect(response.status).toBe(200);

    // Step 3: Validate response contains exactly 3 cards
    const cardsData = await response.json();
    expect(cardsData.length).toBe(3);

    // Navigate to credit cards overview page
    await creditCardsPage.navigate();

    // Step 4 & 5: Verify each card displays correct details
    for (let i = 0; i < expectedCards.length; i++) {
      const card = expectedCards[i];
      const cardElement = creditCardsPage.getCardByIndex(i);
      
      await expect(cardElement.creditLimit).toHaveText(`$${card.limit.toLocaleString()}.00`);
      await expect(cardElement.outstandingAmount).toHaveText(`$${card.outstanding.toLocaleString()}.00`);
      await expect(cardElement.availableCredit).toHaveText(`$${card.available.toLocaleString()}.00`);
      
      // Verify available credit calculation
      const calculatedAvailable = card.limit - card.outstanding;
      expect(calculatedAvailable).toBe(card.available);
    }
  });

  /**
   * Test Case ID: QE-8460 TS-002 TC-001
   * Description: Verify empty state message when user has no credit cards
   */
  test('TC-002: Verify empty state message for user with no credit cards', async ({ page }) => {
    // Step 1: Setup test user with no credit cards
    const testUserId = 'testuser_nocards';

    // Step 2: Send API request
    const response = await apiHelper.getCreditCards(testUserId);
    expect(response.status).toBe(200);

    // Step 3: Validate empty response
    const cardsData = await response.json();
    expect(cardsData.length).toBe(0);

    // Navigate to credit cards page
    await creditCardsPage.navigate();

    // Step 4: Verify empty state message
    await expect(creditCardsPage.emptyStateMessage).toBeVisible();
    await expect(creditCardsPage.emptyStateMessage).toContainText('No credit cards are linked to your account');
    await expect(creditCardsPage.cardsList).not.toBeVisible();
  });

  /**
   * Test Case ID: QE-8460 TS-003 TC-001
   * Description: Verify total credit utilization percentage calculation across all cards
   */
  test('TC-003: Verify total credit utilization calculation across multiple cards', async ({ page }) => {
    // Step 1: Setup test data with multiple cards
    const testUserId = 'testuser_utilization';
    const cardsData = [
      { cardId: 'card_001', limit: 5000, outstanding: 2000 },
      { cardId: 'card_002', limit: 10000, outstanding: 3000 },
      { cardId: 'card_003', limit: 8000, outstanding: 1000 }
    ];

    // Step 2: Send API request for overview
    const response = await apiHelper.getCreditCardsOverview(testUserId);
    expect(response.status).toBe(200);
    const overviewData = await response.json();

    // Step 3-5: Verify aggregated values
    const expectedTotalLimit = 23000;
    const expectedTotalOutstanding = 6000;
    const expectedUtilization = 26.09;

    expect(overviewData.totalCreditLimit).toBe(expectedTotalLimit);
    expect(overviewData.totalOutstanding).toBe(expectedTotalOutstanding);
    expect(overviewData.creditUtilizationPercent).toBeCloseTo(expectedUtilization, 2);

    // Verify on UI
    await creditCardsPage.navigate();
    await expect(creditCardsPage.totalCreditLimit).toHaveText(`$${expectedTotalLimit.toLocaleString()}.00`);
    await expect(creditCardsPage.totalOutstanding).toHaveText(`$${expectedTotalOutstanding.toLocaleString()}.00`);
    await expect(creditCardsPage.creditUtilization).toHaveText(`${expectedUtilization}%`);
  });
});
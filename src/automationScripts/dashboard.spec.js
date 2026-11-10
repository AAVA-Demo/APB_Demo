const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

// Test Suite for QE-9921 - Dashboard KPI Display
test.describe('Dashboard KPI Tests', () => {

  test('QE-9921 TS-001 TC-001 - Verify aggregated KPI calculation with multiple cards', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const testData = {
      userId: 'user123',
      authToken: 'valid-token-abc123',
      expectedCards: [
        { cardId: 'CC001', monthlySpend: 8000, totalCreditLimit: 50000, outstandingAmount: 15000 },
        { cardId: 'CC002', monthlySpend: 3500, totalCreditLimit: 30000, outstandingAmount: 5000 },
        { cardId: 'CC003', monthlySpend: 12000, totalCreditLimit: 70000, outstandingAmount: 25000 }
      ],
      expectedKPIs: {
        totalMonthlySpend: 23500,
        totalCreditLimit: 150000,
        totalOutstanding: 45000,
        totalAvailableCredit: 105000
      }
    };

    // Step 1: Authenticate user session
    await dashboardPage.authenticateUser(testData.userId, testData.authToken);

    // Step 2 & 3: Retrieve all credit cards and verify count
    const cards = await dashboardPage.getCreditCards(testData.userId);
    expect(cards.length).toBe(testData.expectedCards.length);

    // Step 4-7: Calculate and validate KPIs
    const kpis = await dashboardPage.calculateKPIs(cards);

    expect(kpis.totalMonthlySpend).toBe(testData.expectedKPIs.totalMonthlySpend);
    expect(kpis.totalCreditLimit).toBe(testData.expectedKPIs.totalCreditLimit);
    expect(kpis.totalOutstanding).toBe(testData.expectedKPIs.totalOutstanding);
    expect(kpis.totalAvailableCredit).toBe(testData.expectedKPIs.totalAvailableCredit);
  });

  test('QE-9921 TS-002 TC-001 - Verify unauthorized access to dashboard KPIs', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const testData = {
      userId: 'user123',
      authToken: null
    };

    // Step 1: Attempt GET request without valid authentication
    const response = await dashboardPage.getKPIsWithInvalidAuth(testData.userId, testData.authToken);

    // Step 3: Verify response returns HTTP status code 401
    expect(response.status).toBe(401);

    // Step 4: Confirm error message indicates authorization failure
    expect(response.error).toMatch(/Authorization failed|Unauthorized/i);

    // Step 5: Ensure no financial data is exposed
    expect(response).not.toHaveProperty('totalMonthlySpend');
    expect(response).not.toHaveProperty('totalCreditLimit');
    expect(response).not.toHaveProperty('totalOutstanding');
  });

  test('QE-9921 TS-003 TC-001 - Verify zero outstanding amount calculation', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const testData = {
      userId: 'user789',
      authToken: 'valid-token-def456',
      cardData: {
        cardId: 'CC004',
        totalCreditLimit: 40000,
        outstandingAmount: 0
      },
      expectedAvailableCredit: 40000,
      expectedUtilization: 0
    };

    // Step 1: Authenticate user session
    await dashboardPage.authenticateUser(testData.userId, testData.authToken);

    // Step 2 & 3: Retrieve credit card data
    const cards = await dashboardPage.getCreditCards(testData.userId);
    const card = cards.find(c => c.cardId === testData.cardData.cardId);

    // Step 4: Calculate available credit
    const availableCredit = card.totalCreditLimit - card.outstandingAmount;
    expect(availableCredit).toBe(testData.expectedAvailableCredit);

    // Step 5: Calculate utilization percentage
    const utilization = (card.outstandingAmount / card.totalCreditLimit) * 100;
    expect(utilization).toBe(testData.expectedUtilization);

    // Step 6 & 7: Validate calculations
    expect(availableCredit).toBe(card.totalCreditLimit);
    expect(utilization).toBe(0);
  });
});

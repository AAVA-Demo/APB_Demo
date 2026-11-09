const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

// Test cases for QE-8009: Multiple Credit Card Display
test.describe('Multiple Credit Card Display', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test('QE-8009 TS-001 TC-001: Verify multiple credit card display shows all registered cards', async () => {
    // Step 1: Application loads
    await expect(dashboardPage.page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Verify three registered credit cards
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3: Navigate to multi-card management section
    await dashboardPage.navigateToCardManagement();
    
    // Step 4: Verify all three cards displayed
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(3);
    
    // Step 5: Verify each card displays key details
    const card1Details = await dashboardPage.getCardDetails(0);
    expect(card1Details.cardNumber).toContain('**** 1234');
    expect(card1Details.cardType).toBe('Visa');
    expect(card1Details.balance).toBe('$2,500');
    expect(card1Details.limit).toBe('$10,000');
    
    const card2Details = await dashboardPage.getCardDetails(1);
    expect(card2Details.cardNumber).toContain('**** 5678');
    expect(card2Details.cardType).toBe('Mastercard');
    
    const card3Details = await dashboardPage.getCardDetails(2);
    expect(card3Details.cardNumber).toContain('**** 9012');
    expect(card3Details.cardType).toBe('Amex');
  });

  test('QE-8009 TS-002 TC-001: Verify appropriate message when user has no registered cards', async () => {
    // Step 1: Application loads
    await expect(dashboardPage.page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Verify no registered cards
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3: Navigate to multi-card management section
    await dashboardPage.navigateToCardManagement();
    
    // Step 4: Verify system detects empty portfolio
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(0);
    
    // Step 5: Verify appropriate message
    const emptyMessage = await dashboardPage.getEmptyPortfolioMessage();
    const hasValidMessage = emptyMessage.includes('No credit cards found') || emptyMessage.includes('Add a credit card');
    expect(hasValidMessage).toBeTruthy();
  });

  test('QE-8009 TS-003 TC-001: Verify error message when card portfolio service returns error', async () => {
    // Step 1: Application loads
    await expect(dashboardPage.page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Navigate to multi-card management section
    await dashboardPage.navigateToCardManagement();
    
    // Step 3: Simulate service error (handled by test data setup)
    // Step 4: Verify system handles error gracefully
    await expect(dashboardPage.errorMessage).toBeVisible();
    
    // Step 5: Verify appropriate error message
    const errorText = await dashboardPage.getErrorMessage();
    expect(errorText).toContain('Unable to load credit cards at this time');
  });
});

// Test cases for QE-8008: Card-Wise Spend Analysis
test.describe('Card-Wise Spend Analysis', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.navigateToCardManagement();
  });

  test('QE-8008 TS-001 TC-001: Verify card-wise spend analysis displays complete breakdown', async () => {
    // Step 1-2: Already handled in beforeEach
    
    // Step 3: Select specific credit card
    await dashboardPage.selectCard(0);
    await expect(dashboardPage.cardAnalysisView).toBeVisible();
    
    // Step 4: Verify detailed spending breakdown
    const spendingBreakdown = await dashboardPage.getSpendingBreakdown();
    expect(spendingBreakdown.totalSpend).toBe('$2,500');
    expect(spendingBreakdown.currentMonthSpend).toBe('$450');
    expect(spendingBreakdown.availableCredit).toBe('$7,500');
    
    // Step 5: Verify monthly trends
    const monthlyTrends = await dashboardPage.getMonthlyTrends();
    expect(monthlyTrends).toHaveLength(6);
    expect(monthlyTrends[0].month).toBe('Jan');
    expect(monthlyTrends[5].month).toBe('Jun');
    
    // Step 6: Verify utilization percentage
    const utilization = await dashboardPage.getUtilizationPercentage();
    expect(utilization).toBe('25.00%');
  });

  test('QE-8008 TS-002 TC-001: Verify card-wise analysis displays zero spend for card with no history', async () => {
    // Step 1-2: Already handled in beforeEach
    
    // Step 3: Select card with no transaction history
    await dashboardPage.selectCard(1);
    await expect(dashboardPage.cardAnalysisView).toBeVisible();
    
    // Step 4: Verify zero spend
    const spendingBreakdown = await dashboardPage.getSpendingBreakdown();
    expect(spendingBreakdown.totalSpend).toBe('$0.00');
    expect(spendingBreakdown.currentMonthSpend).toBe('$0.00');
    expect(spendingBreakdown.outstandingAmount).toBe('$0.00');
    
    // Step 5: Verify empty trends
    const trendsMessage = await dashboardPage.getTrendsMessage();
    const isEmptyState = trendsMessage.includes('No spending history available') || await dashboardPage.hasEmptyTrendsChart();
    expect(isEmptyState).toBeTruthy();
    
    // Step 6: Verify 0% utilization
    const utilization = await dashboardPage.getUtilizationPercentage();
    expect(utilization).toBe('0.00%');
  });

  test('QE-8008 TS-003 TC-001: Verify validation error for invalid card ID', async () => {
    // Step 1-2: Already handled in beforeEach
    
    // Step 3: Attempt to analyze invalid card ID
    await dashboardPage.attemptSelectInvalidCard('CC999');
    
    // Step 4: Verify system validates card ID
    await expect(dashboardPage.validationError).toBeVisible();
    
    // Step 5: Verify appropriate error message
    const errorText = await dashboardPage.getValidationErrorMessage();
    const hasValidError = errorText.includes('Card cannot be found') || errorText.includes('not associated with your account');
    expect(hasValidError).toBeTruthy();
  });
});
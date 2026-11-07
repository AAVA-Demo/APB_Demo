const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

/**
 * Test Suite: Dashboard KPIs and Credit Card Overview
 * Test Cases: QE-7540 TS-001 TC-001, QE-7540 TS-002 TC-001, QE-7540 TS-003 TC-001,
 *             QE-7541 TS-001 TC-001, QE-7541 TS-002 TC-001, QE-7541 TS-003 TC-001
 */

test.describe('Dashboard KPIs and Credit Card Overview', () => {

  test('QE-7540 TS-001 TC-001 - Verify dashboard displays accurate KPIs with proper currency formatting', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 2: Login with test user
    await dashboardPage.login('testuser@example.com', 'Test@123');
    
    // Step 3: Verify dashboard page loads
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.kpiSection).toBeVisible();
    
    // Step 4: Verify Monthly Spend KPI
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('$6,000');
    
    // Step 5: Verify Total Credit Limit KPI
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBe('$45,000');
    
    // Step 6: Verify Available Credit KPI
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBe('$37,500');
    
    // Step 7: Verify Outstanding Amount KPI
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBe('$7,500');
    
    // Step 8: Verify currency formatting (no decimal places)
    await dashboardPage.verifyKPICurrencyFormat();
  });

  test('QE-7540 TS-002 TC-001 - Verify error handling when credit card service is unavailable', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    
    // Step 2: Login
    await dashboardPage.login('testuser@example.com', 'Test@123');
    
    // Step 3: Simulate service unavailability (mock API failure)
    await page.route('**/api/creditcards', route => route.abort('failed'));
    
    // Step 4: Navigate to dashboard
    await dashboardPage.navigateToDashboard();
    
    // Step 5: Verify error message is displayed
    await expect(dashboardPage.errorMessage).toBeVisible();
    await expect(dashboardPage.errorMessage).toContainText('Failed to load dashboard data');
    
    // Step 6: Verify Retry button is visible
    await expect(dashboardPage.retryButton).toBeVisible();
    await expect(dashboardPage.retryButton).toBeEnabled();
    
    // Step 7: Verify no stale data is displayed
    await expect(dashboardPage.kpiSection).not.toBeVisible();
    
    // Step 8: Click Retry button
    await dashboardPage.clickRetry();
  });

  test('QE-7540 TS-003 TC-001 - Verify dashboard with zero credit cards shows all KPIs as zero', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    
    // Step 2: Login with new user (zero cards)
    await dashboardPage.login('newuser@example.com', 'Test@123');
    
    // Step 3: Verify dashboard loads
    await dashboardPage.waitForDashboardLoad();
    
    // Step 4-7: Verify all KPIs show $0
    expect(await dashboardPage.getMonthlySpendValue()).toBe('$0');
    expect(await dashboardPage.getTotalCreditLimitValue()).toBe('$0');
    expect(await dashboardPage.getAvailableCreditValue()).toBe('$0');
    expect(await dashboardPage.getOutstandingAmountValue()).toBe('$0');
    
    // Step 8: Verify informational message
    await expect(dashboardPage.emptyStateMessage).toBeVisible();
    await expect(dashboardPage.emptyStateMessage).toContainText('You have no credit cards registered');
    
    // Step 9: Verify credit card count is 0
    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBe(0);
  });

  test('QE-7541 TS-001 TC-001 - Verify responsive mobile layout for multiple credit cards', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await dashboardPage.navigate();
    
    // Step 2: Login
    await dashboardPage.login('testuser@example.com', 'Test@123');
    
    // Step 3: Verify mobile-optimized layout
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.verifyMobileLayout();
    
    // Step 4: Verify all cards are displayed
    const cards = await dashboardPage.getAllCreditCards();
    expect(cards.length).toBe(3);
    
    // Step 5: Verify card details are complete
    await dashboardPage.verifyCreditCardDetails(0, {
      name: 'Visa Gold',
      number: '**** 1234',
      limit: '$10,000',
      available: '$7,500',
      outstanding: '$2,500',
      monthly: '$1,500'
    });
    
    // Step 6: Verify currency formatting
    await dashboardPage.verifyCurrencyFormatting();
    
    // Step 7: Verify scrollability
    await dashboardPage.scrollThroughCards();
  });

  test('QE-7541 TS-002 TC-001 - Verify handling of cards with missing balance data', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    
    // Step 2: Login with user having mixed data quality
    await dashboardPage.login('testuser@example.com', 'Test@123');
    
    // Step 3: Verify cards with complete data display correctly
    await dashboardPage.verifyCardDataComplete(0);
    
    // Step 4: Verify error indicator for incomplete cards
    await expect(dashboardPage.getCardErrorIndicator(1)).toBeVisible();
    
    // Step 5: Verify error message on hover/click
    await dashboardPage.hoverCardErrorIndicator(1);
    await expect(dashboardPage.errorTooltip).toContainText('Incomplete card data');
    
    // Step 6: Verify KPIs exclude incomplete cards
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalLimit).toBe('$10,000');
  });

  test('QE-7541 TS-003 TC-001 - Verify desktop multi-column grid layout', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await dashboardPage.navigate();
    
    // Step 2: Login
    await dashboardPage.login('testuser@example.com', 'Test@123');
    
    // Step 3: Verify multi-column grid layout
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.verifyGridLayout(2);
    
    // Step 4: Verify all cards visible without scrolling
    await dashboardPage.verifyAllCardsInViewport();
    
    // Step 5: Verify complete financial details
    await dashboardPage.verifyCreditCardDetails(0, {
      name: 'Visa Gold',
      number: '**** 1234',
      limit: '$10,000',
      available: '$7,500',
      outstanding: '$2,500',
      monthly: '$1,500'
    });
    
    // Step 6: Verify decimal formatting
    await dashboardPage.verifyDecimalFormatting();
    
    // Step 7: Verify responsive grid on resize
    await page.setViewportSize({ width: 1024, height: 768 });
    await dashboardPage.verifyGridLayout(2);
    await page.setViewportSize({ width: 768, height: 1024 });
    await dashboardPage.verifyGridLayout(1);
  });

});
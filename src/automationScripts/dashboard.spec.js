const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { AuthHelper } = require('./helpers/auth.helper');
const { Logger } = require('./utils/logger');

const logger = new Logger('DashboardSpec');

test.describe('Dashboard - KPI Display and Multi-Card Portfolio', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Setting up test - navigating to dashboard');
    dashboardPage = new DashboardPage(page);
    await AuthHelper.authenticate(page, 'user123', 'valid-jwt-token');
    await dashboardPage.navigate();
  });

  test('TC-QE-9080-TS-001-TC-001: Verify multi-card portfolio view displays all card details with responsive layout', async ({ page }) => {
    logger.info('Test: Verify multi-card portfolio view with complete card details');
    
    // Step 1: User is already authenticated in beforeEach
    logger.info('Step 1: User authenticated successfully');
    
    // Step 2: Navigate to portfolio view (already done in beforeEach)
    logger.info('Step 2: Navigated to dashboard portfolio view');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    // Step 3: Verify credit card data is loaded
    logger.info('Step 3: Verifying credit card data retrieval');
    await dashboardPage.waitForCardsToLoad();
    
    // Step 4: Verify all card details are displayed
    logger.info('Step 4: Verifying all card details are displayed correctly');
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBeGreaterThan(0);
    
    // Verify first card details
    const firstCard = await dashboardPage.getCardDetails(0);
    expect(firstCard.cardName).toBeTruthy();
    expect(firstCard.cardNumber).toMatch(/\*{4}\s\*{4}\s\*{4}\s\d{4}/);
    expect(firstCard.creditLimit).toBeTruthy();
    expect(firstCard.availableCredit).toBeTruthy();
    expect(firstCard.outstandingBalance).toBeTruthy();
    expect(firstCard.currentMonthSpend).toBeTruthy();
    
    logger.info('Step 5: Verifying responsive layout across viewports');
    // Desktop viewport (1920x1080)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(dashboardPage.cardContainer).toBeVisible();
    
    // Tablet viewport (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(dashboardPage.cardContainer).toBeVisible();
    
    // Mobile viewport (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(dashboardPage.cardContainer).toBeVisible();
    
    logger.info('Test completed successfully');
  });

  test('TC-QE-9080-TS-002-TC-001: Verify empty portfolio message for user with no cards', async ({ page }) => {
    logger.info('Test: Verify empty portfolio message');
    
    // Step 1: Authenticate user with no cards
    logger.info('Step 1: Authenticating user with no registered cards');
    await AuthHelper.authenticate(page, 'newUser456', 'valid-jwt-token');
    await dashboardPage.navigate();
    
    // Step 2: Portfolio view loads
    logger.info('Step 2: Portfolio view page loaded');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    // Step 3 & 4: Verify empty portfolio message
    logger.info('Step 3-4: Verifying empty portfolio message');
    await expect(dashboardPage.emptyPortfolioMessage).toBeVisible();
    const messageText = await dashboardPage.emptyPortfolioMessage.textContent();
    expect(messageText).toContain('No credit cards are available to display');
    
    logger.info('Test completed successfully');
  });

  test('TC-QE-9080-TS-003-TC-001: Verify error message when credit card service is unavailable', async ({ page }) => {
    logger.info('Test: Verify service unavailability error handling');
    
    // Mock API to return 500 error
    await page.route('**/api/cards*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    // Step 1: Authenticate user
    logger.info('Step 1: User authenticated');
    await AuthHelper.authenticate(page, 'user123', 'valid-jwt-token');
    
    // Step 2: Navigate to portfolio view
    logger.info('Step 2: Navigating to portfolio view');
    await dashboardPage.navigate();
    
    // Step 3: Service returns 500 error (mocked above)
    logger.info('Step 3: Service unavailability simulated');
    
    // Step 4: Verify error message
    logger.info('Step 4: Verifying error message is displayed');
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.errorMessage.textContent();
    expect(errorText).toContain('Portfolio data cannot be retrieved at this time');
    
    // Step 5: Verify retry button is available
    logger.info('Step 5: Verifying retry button is available');
    await expect(dashboardPage.retryButton).toBeVisible();
    await expect(dashboardPage.retryButton).toBeEnabled();
    
    logger.info('Test completed successfully');
  });

  test('TC-QE-9083-TS-001-TC-001: Verify dashboard KPI calculations and currency formatting', async ({ page }) => {
    logger.info('Test: Verify KPI calculations with correct currency formatting');
    
    // Steps 1-3: Already authenticated and navigated in beforeEach
    logger.info('Steps 1-3: User authenticated and dashboard loaded');
    await dashboardPage.waitForKPIsToLoad();
    
    // Step 4: Verify Monthly Spending KPI
    logger.info('Step 4: Verifying Monthly Spending KPI');
    const monthlySpend = await dashboardPage.getKPIValue('Monthly Spend');
    expect(monthlySpend).toMatch(/\$[\d,]+\.\d{2}/);
    
    // Step 5: Verify Total Credit Limit KPI
    logger.info('Step 5: Verifying Total Credit Limit KPI');
    const totalCreditLimit = await dashboardPage.getKPIValue('Total Credit Limit');
    expect(totalCreditLimit).toMatch(/\$[\d,]+\.\d{2}/);
    
    // Step 6: Verify Available Credit KPI
    logger.info('Step 6: Verifying Available Credit KPI');
    const availableCredit = await dashboardPage.getKPIValue('Available Credit');
    expect(availableCredit).toMatch(/\$[\d,]+\.\d{2}/);
    
    // Step 7: Verify Outstanding Amount KPI
    logger.info('Step 7: Verifying Outstanding Amount KPI');
    const outstandingAmount = await dashboardPage.getKPIValue('Outstanding Amount');
    expect(outstandingAmount).toMatch(/\$[\d,]+\.\d{2}/);
    
    logger.info('Test completed successfully');
  });

  test('TC-QE-9083-TS-001-TC-002: Verify KPI calculations with zero balance cards', async ({ page }) => {
    logger.info('Test: Verify KPI calculations with zero balance cards');
    
    // Step 1: Authenticate user with zero balance cards
    logger.info('Step 1: Authenticating user with zero balance cards');
    await AuthHelper.authenticate(page, 'user456', 'valid-jwt-token');
    await dashboardPage.navigate();
    
    // Step 2: Dashboard loads
    logger.info('Step 2: Dashboard loaded successfully');
    await dashboardPage.waitForKPIsToLoad();
    
    // Steps 3-6: Verify all KPIs
    logger.info('Steps 3-6: Verifying all KPI values');
    const monthlySpend = await dashboardPage.getKPIValue('Monthly Spend');
    expect(monthlySpend).toMatch(/\$[\d,]+\.\d{2}/);
    
    const totalCreditLimit = await dashboardPage.getKPIValue('Total Credit Limit');
    expect(totalCreditLimit).toMatch(/\$[\d,]+\.\d{2}/);
    
    const availableCredit = await dashboardPage.getKPIValue('Available Credit');
    expect(availableCredit).toMatch(/\$[\d,]+\.\d{2}/);
    
    const outstandingAmount = await dashboardPage.getKPIValue('Outstanding Amount');
    expect(outstandingAmount).toMatch(/\$[\d,]+\.\d{2}/);
    
    logger.info('Test completed successfully');
  });

  test('TC-QE-9083-TS-002-TC-001: Verify redirect to login with expired token', async ({ page }) => {
    logger.info('Test: Verify redirect to login with expired authentication token');
    
    // Step 1: Attempt to navigate with expired token
    logger.info('Step 1: Attempting navigation with expired token');
    await AuthHelper.setExpiredToken(page);
    await dashboardPage.navigate();
    
    // Step 2: Verify redirect to login page
    logger.info('Step 2: Verifying redirect to login page');
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
    
    // Step 3: Verify session timeout message
    logger.info('Step 3: Verifying session timeout message');
    const sessionMessage = page.locator('text=/session has expired/i');
    await expect(sessionMessage).toBeVisible();
    
    logger.info('Test completed successfully');
  });

  test('TC-QE-9083-TS-002-TC-002: Verify redirect to login with malformed token', async ({ page }) => {
    logger.info('Test: Verify redirect to login with malformed authentication token');
    
    // Step 1: Attempt to navigate with malformed token
    logger.info('Step 1: Attempting navigation with malformed token');
    await AuthHelper.setMalformedToken(page);
    await dashboardPage.navigate();
    
    // Step 2: Verify redirect to login page
    logger.info('Step 2: Verifying redirect to login page');
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
    
    // Step 3: Verify authentication error message
    logger.info('Step 3: Verifying authentication error message');
    const authMessage = page.locator('text=/Invalid authentication/i');
    await expect(authMessage).toBeVisible();
    
    logger.info('Test completed successfully');
  });

  test('TC-QE-9083-TS-003-TC-001: Verify data inconsistency validation and error message', async ({ page }) => {
    logger.info('Test: Verify data inconsistency validation');
    
    // Mock API to return inconsistent data
    await page.route('**/api/dashboard/kpis*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          monthlySpend: 1850,
          totalCreditLimit: 35000,
          availableCredit: -500,
          outstandingAmount: 2350
        })
      });
    });
    
    // Steps 1-2: Authenticate and navigate
    logger.info('Steps 1-2: User authenticated and navigating to dashboard');
    await AuthHelper.authenticate(page, 'user123', 'valid-jwt-token');
    await dashboardPage.navigate();
    
    // Steps 3-5: Verify error message for data inconsistency
    logger.info('Steps 3-5: Verifying data inconsistency error message');
    await expect(dashboardPage.dataInconsistencyError).toBeVisible();
    const errorText = await dashboardPage.dataInconsistencyError.textContent();
    expect(errorText).toContain('Data inconsistency detected');
    
    // Step 6: Verify refresh button
    logger.info('Step 6: Verifying refresh button is available');
    await expect(dashboardPage.refreshButton).toBeVisible();
    await expect(dashboardPage.refreshButton).toBeEnabled();
    
    logger.info('Test completed successfully');
  });
});
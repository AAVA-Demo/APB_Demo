const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Dashboard KPI and Portfolio Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    logger.info('Navigating to application');
    await loginPage.navigate();
  });

  // Test Case: QE-8466 TS-001 TC-001
  test('QE-8466 TS-001 TC-001 - Verify authenticated user can view all four KPIs with correct calculated values', async () => {
    logger.info('Test Case: QE-8466 TS-001 TC-001 - Dashboard KPI verification');
    
    // Step 1-3: Login
    logger.info('Step 1-3: Logging in with valid credentials');
    await loginPage.login('testuser', 'Test@123');
    await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
    
    // Step 4: Verify Monthly Spend KPI
    logger.info('Step 4: Verifying Monthly Spend KPI');
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    expect(monthlySpend).toBe('$3,500.00');
    
    // Step 5: Verify Total Credit Limit KPI
    logger.info('Step 5: Verifying Total Credit Limit KPI');
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    const totalCreditLimit = await dashboardPage.getKPIValue('totalCreditLimit');
    expect(totalCreditLimit).toBe('$25,000.00');
    
    // Step 6: Verify Available Credit KPI
    logger.info('Step 6: Verifying Available Credit KPI');
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    const availableCredit = await dashboardPage.getKPIValue('availableCredit');
    expect(availableCredit).toBe('$19,500.00');
    
    // Step 7: Verify Outstanding Amounts KPI
    logger.info('Step 7: Verifying Outstanding Amounts KPI');
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const outstandingAmount = await dashboardPage.getKPIValue('outstandingAmount');
    expect(outstandingAmount).toBe('$5,500.00');
    
    logger.info('Test Case QE-8466 TS-001 TC-001 completed successfully');
  });

  // Test Case: QE-8466 TS-002 TC-001
  test('QE-8466 TS-002 TC-001 - Verify unauthenticated user is redirected to login with error message', async ({ page }) => {
    logger.info('Test Case: QE-8466 TS-002 TC-001 - Unauthenticated access prevention');
    
    // Step 2: Attempt direct dashboard access
    logger.info('Step 2: Attempting direct dashboard access without login');
    await page.goto('/dashboard');
    
    // Step 3: Verify redirect to login and error message
    logger.info('Step 3: Verifying redirect to login page');
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.authErrorMessage).toBeVisible();
    const errorText = await loginPage.authErrorMessage.textContent();
    expect(errorText).toContain('You must be logged in to access this page');
    
    // Step 4: Verify no KPI data visible
    logger.info('Step 4: Verifying no KPI data is accessible');
    const kpiWidgets = page.locator('.kpi-widget');
    await expect(kpiWidgets).toHaveCount(0);
    
    logger.info('Test Case QE-8466 TS-002 TC-001 completed successfully');
  });

  // Test Case: QE-8466 TS-003 TC-001
  test('QE-8466 TS-003 TC-001 - Verify Total Credit Limit KPI aggregates multiple cards correctly', async () => {
    logger.info('Test Case: QE-8466 TS-003 TC-001 - Multi-card credit limit aggregation');
    
    // Step 1-2: Login with multi-card user
    logger.info('Step 1-2: Logging in with multi-card user');
    await loginPage.login('testuser_multicard', 'Test@123');
    await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
    
    // Step 3: Scroll to card details section
    logger.info('Step 3: Scrolling to credit card details section');
    await dashboardPage.scrollToCardSection();
    await expect(dashboardPage.cardWidgets.first()).toBeVisible();
    
    // Step 4: Verify Card 1 credit limit
    logger.info('Step 4: Verifying Card 1 credit limit');
    const card1Limit = await dashboardPage.getCardCreditLimit(0);
    expect(card1Limit).toBe('$10,000.00');
    
    // Step 5: Verify Card 2 credit limit
    logger.info('Step 5: Verifying Card 2 credit limit');
    const card2Limit = await dashboardPage.getCardCreditLimit(1);
    expect(card2Limit).toBe('$15,000.00');
    
    // Step 6: Verify aggregated Total Credit Limit KPI
    logger.info('Step 6: Verifying aggregated Total Credit Limit KPI');
    await dashboardPage.scrollToTop();
    const totalCreditLimit = await dashboardPage.getKPIValue('totalCreditLimit');
    expect(totalCreditLimit).toBe('$25,000.00');
    
    logger.info('Test Case QE-8466 TS-003 TC-001 completed successfully');
  });

  // Test Case: QE-8465 TS-001 TC-001
  test('QE-8465 TS-001 TC-001 - Verify responsive multi-card view on mobile device', async ({ page, context }) => {
    logger.info('Test Case: QE-8465 TS-001 TC-001 - Mobile responsive card portfolio');
    
    // Step 1: Set mobile viewport
    logger.info('Step 1: Setting mobile viewport (iPhone 12)');
    await page.setViewportSize({ width: 390, height: 844 });
    await loginPage.navigate();
    await expect(loginPage.page).toHaveURL(/.*login/);
    
    // Step 2: Login with 3-card user
    logger.info('Step 2: Logging in with 3-card user');
    await loginPage.login('testuser_3cards', 'Test@123');
    await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
    
    // Step 3: Scroll to card portfolio section
    logger.info('Step 3: Scrolling to credit card portfolio section');
    await dashboardPage.scrollToCardSection();
    await expect(dashboardPage.cardWidgets.first()).toBeVisible();
    
    // Step 4: Verify all 3 cards displayed
    logger.info('Step 4: Verifying all 3 credit cards are displayed');
    await expect(dashboardPage.cardWidgets).toHaveCount(3);
    const cardNumbers = await dashboardPage.getAllCardNumbers();
    expect(cardNumbers).toContain('****1234');
    expect(cardNumbers).toContain('****5678');
    expect(cardNumbers).toContain('****9012');
    
    // Step 5-7: Verify key metrics for each card
    logger.info('Step 5-7: Verifying key metrics for all cards');
    const card1Metrics = await dashboardPage.getCardMetrics(0);
    expect(card1Metrics.creditLimit).toBe('$10,000');
    expect(card1Metrics.availableCredit).toBe('$7,500');
    expect(card1Metrics.outstanding).toBe('$2,500');
    
    const card2Metrics = await dashboardPage.getCardMetrics(1);
    expect(card2Metrics.creditLimit).toBe('$15,000');
    expect(card2Metrics.availableCredit).toBe('$12,000');
    expect(card2Metrics.outstanding).toBe('$3,000');
    
    const card3Metrics = await dashboardPage.getCardMetrics(2);
    expect(card3Metrics.creditLimit).toBe('$8,000');
    expect(card3Metrics.availableCredit).toBe('$6,500');
    expect(card3Metrics.outstanding).toBe('$1,500');
    
    logger.info('Test Case QE-8465 TS-001 TC-001 completed successfully');
  });

  // Test Case: QE-8465 TS-002 TC-001
  test('QE-8465 TS-002 TC-001 - Verify responsive multi-card view on tablet device', async ({ page }) => {
    logger.info('Test Case: QE-8465 TS-002 TC-001 - Tablet responsive card portfolio');
    
    // Step 1: Set tablet viewport
    logger.info('Step 1: Setting tablet viewport (iPad Pro 12.9)');
    await page.setViewportSize({ width: 1024, height: 1366 });
    await loginPage.navigate();
    
    // Step 2: Login with 5-card user
    logger.info('Step 2: Logging in with 5-card user');
    await loginPage.login('testuser_5cards', 'Test@123');
    await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
    
    // Step 3: Navigate to card portfolio section
    logger.info('Step 3: Navigating to credit card portfolio section');
    await dashboardPage.scrollToCardSection();
    await expect(dashboardPage.cardWidgets.first()).toBeVisible();
    
    // Step 4: Verify all 5 cards displayed in 2-column grid
    logger.info('Step 4: Verifying all 5 credit cards displayed in 2-column grid');
    await expect(dashboardPage.cardWidgets).toHaveCount(5);
    const gridLayout = await dashboardPage.verifyGridLayout();
    expect(gridLayout).toBe('2-column');
    
    // Step 5-6: Verify card details
    logger.info('Step 5-6: Verifying card details for Card 1 and Card 5');
    const card1Details = await dashboardPage.getCardDetails(0);
    expect(card1Details.cardholderName).toBe('John Doe');
    expect(card1Details.cardType).toBe('Visa Gold');
    expect(card1Details.cardNumber).toBe('****1234');
    
    const card5Details = await dashboardPage.getCardDetails(4);
    expect(card5Details.cardholderName).toBe('John Doe');
    expect(card5Details.cardType).toBe('Discover It');
    expect(card5Details.cardNumber).toBe('****3456');
    
    // Step 7: Verify no horizontal scrolling
    logger.info('Step 7: Verifying no horizontal scrollbar');
    const hasHorizontalScroll = await dashboardPage.hasHorizontalScrollbar();
    expect(hasHorizontalScroll).toBe(false);
    
    logger.info('Test Case QE-8465 TS-002 TC-001 completed successfully');
  });

  // Test Case: QE-8465 TS-003 TC-001
  test('QE-8465 TS-003 TC-001 - Verify appropriate message for user with no credit cards', async () => {
    logger.info('Test Case: QE-8465 TS-003 TC-001 - No cards handling');
    
    // Step 1-2: Login with no-cards user
    logger.info('Step 1-2: Logging in with user having no credit cards');
    await loginPage.login('testuser_nocards', 'Test@123');
    await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
    
    // Step 3: Navigate to card portfolio section
    logger.info('Step 3: Navigating to credit card portfolio section');
    await dashboardPage.scrollToCardSection();
    
    // Step 4: Verify appropriate message
    logger.info('Step 4: Verifying no cards message');
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const messageText = await dashboardPage.noCardsMessage.textContent();
    expect(messageText).toContain('No credit cards found');
    expect(messageText).toContain('Please contact support to add a credit card');
    
    // Step 5: Verify no card widgets displayed
    logger.info('Step 5: Verifying no card widgets are rendered');
    await expect(dashboardPage.cardWidgets).toHaveCount(0);
    
    // Step 6: Verify no JavaScript errors
    logger.info('Step 6: Verifying no JavaScript errors in console');
    const consoleErrors = [];
    dashboardPage.page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await dashboardPage.page.waitForTimeout(2000);
    expect(consoleErrors.length).toBe(0);
    
    logger.info('Test Case QE-8465 TS-003 TC-001 completed successfully');
  });
});

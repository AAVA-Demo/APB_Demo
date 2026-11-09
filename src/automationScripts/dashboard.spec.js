const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');
const logger = require('../utils/logger');

test.describe('Dashboard KPI and Responsive Layout Tests', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    logger.info('Test setup: Navigating to application');
    await loginPage.navigate();
  });

  test('TC-4630: Verify dashboard layout responsiveness on mobile device (375px width)', async ({ page }) => {
    logger.info('Starting test: Mobile responsive layout validation');
    
    await page.setViewportSize({ width: 375, height: 667 });
    logger.info('Viewport set to 375px x 667px (mobile)');
    
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    logger.info('User logged in successfully');
    
    await expect(dashboardPage.monthlySpendCard).toBeVisible();
    await expect(dashboardPage.creditLimitCard).toBeVisible();
    await expect(dashboardPage.availableCreditCard).toBeVisible();
    await expect(dashboardPage.outstandingAmountCard).toBeVisible();
    logger.info('All 4 KPI cards are visible');
    
    const isStackedLayout = await dashboardPage.verifyStackedLayout();
    expect(isStackedLayout).toBe(true);
    logger.info('Verified single-column stacked layout');
    
    const hasHorizontalScroll = await dashboardPage.hasHorizontalScrollbar();
    expect(hasHorizontalScroll).toBe(false);
    logger.info('Verified no horizontal scrollbar present');
    
    const fontSizes = await dashboardPage.getKPIFontSizes();
    expect(fontSizes.labelFontSize).toBeGreaterThanOrEqual(14);
    expect(fontSizes.valueFontSize).toBeGreaterThanOrEqual(22);
    logger.info('Font sizes meet minimum requirements');
    
    logger.info('Test completed successfully: Mobile responsive layout validated');
  });

  test('TC-4631: Verify dashboard layout responsiveness on tablet device (768px width)', async ({ page }) => {
    logger.info('Starting test: Tablet responsive layout validation');
    
    await page.setViewportSize({ width: 768, height: 1024 });
    logger.info('Viewport set to 768px x 1024px (tablet)');
    
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    logger.info('User logged in successfully');
    
    await expect(dashboardPage.monthlySpendCard).toBeVisible();
    await expect(dashboardPage.creditLimitCard).toBeVisible();
    await expect(dashboardPage.availableCreditCard).toBeVisible();
    await expect(dashboardPage.outstandingAmountCard).toBeVisible();
    logger.info('All 4 KPI cards are visible');
    
    const isTwoColumnLayout = await dashboardPage.verifyTwoColumnLayout();
    expect(isTwoColumnLayout).toBe(true);
    logger.info('Verified two-column grid layout');
    
    const fontSizes = await dashboardPage.getKPIFontSizes();
    expect(fontSizes.labelFontSize).toBeGreaterThanOrEqual(16);
    expect(fontSizes.valueFontSize).toBeGreaterThanOrEqual(24);
    logger.info('Font sizes meet tablet requirements');
    
    const creditCardListVisible = await dashboardPage.creditCardList.isVisible();
    expect(creditCardListVisible).toBe(true);
    logger.info('Credit card list is displayed and responsive');
    
    logger.info('Test completed successfully: Tablet responsive layout validated');
  });

  test('TC-4632: Verify dashboard handles extremely narrow screen (320px) gracefully', async ({ page }) => {
    logger.info('Starting test: Extremely narrow screen handling');
    
    await page.setViewportSize({ width: 320, height: 568 });
    logger.info('Viewport set to 320px x 568px (extremely narrow)');
    
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    logger.info('User logged in successfully');
    
    await expect(dashboardPage.monthlySpendCard).toBeVisible();
    logger.info('Dashboard loaded despite narrow viewport');
    
    const hasTextTruncation = await dashboardPage.checkTextTruncation();
    expect(hasTextTruncation).toBe(false);
    logger.info('No text truncation detected');
    
    const hasOverlappingElements = await dashboardPage.checkOverlappingElements();
    expect(hasOverlappingElements).toBe(false);
    logger.info('No overlapping UI elements detected');
    
    const fontSizes = await dashboardPage.getKPIFontSizes();
    expect(fontSizes.labelFontSize).toBeGreaterThanOrEqual(12);
    expect(fontSizes.valueFontSize).toBeGreaterThanOrEqual(18);
    logger.info('Minimum font sizes maintained');
    
    const cardDimensions = await dashboardPage.getKPICardDimensions();
    expect(cardDimensions.width).toBeGreaterThanOrEqual(280);
    expect(cardDimensions.height).toBeGreaterThanOrEqual(80);
    logger.info('Minimum card dimensions maintained');
    
    await dashboardPage.scrollVertically();
    const isInteractive = await dashboardPage.verifyInteractivity();
    expect(isInteractive).toBe(true);
    logger.info('Dashboard remains functional and interactive');
    
    logger.info('Test completed successfully: Narrow screen handling validated');
  });

  test('TC-4643: Verify dashboard displays aggregated KPI metrics for multiple credit cards', async ({ page }) => {
    logger.info('Starting test: Multiple credit cards KPI aggregation');
    
    await loginPage.login(testData.users.multicard_user.username, testData.users.multicard_user.password);
    logger.info('Logged in with user having 3 credit cards');
    
    await expect(dashboardPage.monthlySpendCard).toBeVisible();
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('$15,700');
    logger.info('Total Monthly Spend verified: $15,700');
    
    const creditLimit = await dashboardPage.getCreditLimitValue();
    expect(creditLimit).toBe('$100,000');
    logger.info('Total Credit Limit verified: $100,000');
    
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBe('$72,000');
    logger.info('Total Available Credit verified: $72,000');
    
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBe('$28,000');
    logger.info('Total Outstanding Amount verified: $28,000');
    
    logger.info('Test completed successfully: Multiple cards KPI aggregation validated');
  });

  test('TC-4644: Verify dashboard displays accurate KPI metrics for single credit card', async ({ page }) => {
    logger.info('Starting test: Single credit card KPI display');
    
    await loginPage.login(testData.users.singlecard_user.username, testData.users.singlecard_user.password);
    logger.info('Logged in with user having 1 credit card');
    
    await expect(dashboardPage.monthlySpendCard).toBeVisible();
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('$8,500');
    logger.info('Monthly Spend verified: $8,500');
    
    const creditLimit = await dashboardPage.getCreditLimitValue();
    expect(creditLimit).toBe('$50,000');
    logger.info('Credit Limit verified: $50,000');
    
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBe('$35,000');
    logger.info('Available Credit verified: $35,000');
    
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBe('$15,000');
    logger.info('Outstanding Amount verified: $15,000');
    
    const calculationValid = await dashboardPage.verifyFinancialCalculation(35000, 15000, 50000);
    expect(calculationValid).toBe(true);
    logger.info('Financial calculation validated: $35,000 + $15,000 = $50,000');
    
    logger.info('Test completed successfully: Single card KPI display validated');
  });

  test('TC-4645: Verify dashboard displays error and fallback data when service unavailable', async ({ page }) => {
    logger.info('Starting test: Service unavailability error handling');
    
    await page.route('**/api/cards', route => route.abort('failed'));
    logger.info('Simulated credit card data service unavailability (HTTP 500)');
    
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    logger.info('User logged in');
    
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.errorMessage.textContent();
    expect(errorText).toContain('Failed to load dashboard data');
    logger.info('Error message displayed to user');
    
    await expect(dashboardPage.monthlySpendCard).toBeVisible();
    logger.info('Fallback/mock data displayed');
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBeTruthy();
    logger.info('KPI metrics displayed using fallback data');
    
    const isDashboardFunctional = await dashboardPage.verifyInteractivity();
    expect(isDashboardFunctional).toBe(true);
    logger.info('Dashboard remains functional with fallback data');
    
    logger.info('Test completed successfully: Error handling and fallback validated');
  });
});

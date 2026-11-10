const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Multiple Credit Card Management - QE-9423', () => {
  let cardManagementPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Initializing Card Management test');
    cardManagementPage = new CardManagementPage(page);
    loginPage = new LoginPage(page);
  });

  test('QE-9423 TS-001 TC-001: Verify display of 5 cards with masked numbers and financial details', async ({ page }) => {
    logger.info('Starting test: QE-9423 TS-001 TC-001');
    
    // Step 1: Launch application
    await cardManagementPage.navigate();
    await expect(page).toHaveURL(/cards/);
    logger.info('Application loaded successfully');
    
    // Step 2: Login with user having 5 cards
    await loginPage.login('testuser_5cards', 'Pass@123');
    await cardManagementPage.waitForAuthenticationComplete();
    logger.info('User authenticated');
    
    // Step 3: Navigate to Card Management
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.waitForPageLoad(2000);
    logger.info('Card Management page loaded');
    
    // Step 4: Verify 5 cards displayed
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(5);
    logger.info('5 cards verified');
    
    // Step 5: Verify masked card numbers
    const maskedNumbers = await cardManagementPage.getAllMaskedCardNumbers();
    expect(maskedNumbers).toContain('****1234');
    expect(maskedNumbers).toContain('****5678');
    expect(maskedNumbers).toContain('****9012');
    expect(maskedNumbers).toContain('****3456');
    expect(maskedNumbers).toContain('****7890');
    logger.info('Masked card numbers verified');
    
    // Step 6: Verify credit limits
    const creditLimits = await cardManagementPage.getAllCreditLimits();
    expect(creditLimits).toContain(10000);
    expect(creditLimits).toContain(15000);
    expect(creditLimits).toContain(20000);
    expect(creditLimits).toContain(12000);
    expect(creditLimits).toContain(8000);
    const totalLimits = creditLimits.reduce((a, b) => a + b, 0);
    expect(totalLimits).toBe(65000);
    logger.info('Credit limits verified');
    
    // Step 7: Verify outstanding balances
    const outstandingBalances = await cardManagementPage.getAllOutstandingBalances();
    expect(outstandingBalances).toContain(2000);
    expect(outstandingBalances).toContain(5000);
    expect(outstandingBalances).toContain(8000);
    expect(outstandingBalances).toContain(3000);
    expect(outstandingBalances).toContain(1500);
    const totalOutstanding = outstandingBalances.reduce((a, b) => a + b, 0);
    expect(totalOutstanding).toBe(19500);
    logger.info('Outstanding balances verified');
    
    // Step 8: Verify available credit calculations
    const availableCredits = await cardManagementPage.getAllAvailableCredits();
    expect(availableCredits[0]).toBe(8000); // 10000 - 2000
    expect(availableCredits[1]).toBe(10000); // 15000 - 5000
    expect(availableCredits[2]).toBe(12000); // 20000 - 8000
    expect(availableCredits[3]).toBe(9000); // 12000 - 3000
    expect(availableCredits[4]).toBe(6500); // 8000 - 1500
    logger.info('Available credit calculations verified');
  });

  test('QE-9423 TS-002 TC-001: Verify empty state for user with no registered cards', async ({ page }) => {
    logger.info('Starting test: QE-9423 TS-002 TC-001');
    
    // Step 1: Launch application
    await cardManagementPage.navigate();
    await expect(page).toHaveURL(/cards/);
    
    // Step 2: Login with user having no cards
    await loginPage.login('newuser_nocards', 'Pass@123');
    await cardManagementPage.waitForAuthenticationComplete();
    logger.info('User with no cards authenticated');
    
    // Step 3: Navigate to Card Management
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.waitForPageLoad(2000);
    
    // Step 4: Verify empty state message
    const emptyMessage = await cardManagementPage.getEmptyStateMessage();
    expect(emptyMessage).toContain("You don't have any credit cards registered");
    logger.info('Empty state message verified');
    
    // Step 5: Verify no card tiles displayed
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(0);
    const hasErrors = await cardManagementPage.hasErrorMessages();
    expect(hasErrors).toBe(false);
    logger.info('No cards or errors displayed');
    
    // Step 6: Verify navigation remains functional
    const isDashboardActive = await cardManagementPage.isDashboardLinkActive();
    const isAnalyticsActive = await cardManagementPage.isAnalyticsLinkActive();
    expect(isDashboardActive).toBe(true);
    expect(isAnalyticsActive).toBe(true);
    logger.info('Navigation links verified');
  });

  test('QE-9423 TS-003 TC-001: Verify access denied with invalid authentication token', async ({ page }) => {
    logger.info('Starting test: QE-9423 TS-003 TC-001');
    
    // Step 1: Launch application
    await cardManagementPage.navigate();
    await expect(page).toHaveURL(/cards/);
    
    // Step 2: Set expired token in localStorage
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'expired-token-12345');
      localStorage.setItem('tokenExpiry', '2023-01-01');
    });
    logger.info('Expired token set in localStorage');
    
    // Step 3: Attempt to navigate to Card Management
    await cardManagementPage.navigateToMyCards();
    await page.waitForTimeout(2000);
    
    // Step 4: Verify error message
    const errorMessage = await cardManagementPage.getAuthErrorMessage();
    expect(errorMessage).toContain('Your session has expired');
    logger.info('Authentication error message verified');
    
    // Step 5: Verify no card data exposed
    const isCardDataVisible = await cardManagementPage.isCardDataVisible();
    expect(isCardDataVisible).toBe(false);
    logger.info('No card data exposed');
    
    // Step 6: Verify redirect to login
    await page.waitForURL(/login/, { timeout: 5000 });
    expect(page.url()).toContain('/login');
    logger.info('Redirected to login page');
  });
});

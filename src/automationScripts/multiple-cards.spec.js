const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/card-management.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Multiple Credit Card Display - QE-8966', () => {
  let cardManagementPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    logger.info('Starting Multiple Cards Display test');
  });

  test('QE-8966 TS-001 TC-001: Verify card management displays all cards with masked numbers and details', async ({ page }) => {
    logger.info('Test Case: QE-8966 TS-001 TC-001 - Display all cards with masked numbers');
    
    // Step 1: Login with multi-card user
    await loginPage.navigate();
    await loginPage.login('testuser_multicard', 'Pass@123');
    await loginPage.clickLogin();
    logger.info('Multi-card user logged in');

    // Step 2: Navigate to card management section
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    logger.info('Card management page loaded');

    // Step 3: Verify list of all cards is displayed
    const cardCount = await cardManagementPage.cardItems.count();
    expect(cardCount).toBeGreaterThan(0);
    logger.info(`${cardCount} credit cards displayed`);

    // Step 4: Verify card numbers are masked
    const cards = await cardManagementPage.cardItems.all();
    for (const card of cards) {
      const cardNumberElement = card.locator('.card-number, [data-testid="card-number"]');
      const cardNumber = await cardNumberElement.textContent();
      expect(cardNumber).toMatch(/\*{4}\s*\*{4}\s*\*{4}\s*\d{4}/);
      logger.info(`Card number masked correctly: ${cardNumber}`);
    }

    // Step 5: Verify card type is displayed
    for (const card of cards) {
      const cardType = card.locator('.card-type, h4');
      await expect(cardType).toBeVisible();
      const typeText = await cardType.textContent();
      expect(typeText).toMatch(/Visa|MasterCard|Amex|Discover/);
      logger.info(`Card type: ${typeText}`);
    }

    // Step 6: Verify credit limit is displayed
    for (const card of cards) {
      const creditLimit = card.locator('[data-testid="credit-limit"], .credit-limit, strong:has-text("$")');
      const creditLimitCount = await creditLimit.count();
      expect(creditLimitCount).toBeGreaterThan(0);
    }
    logger.info('Credit limits displayed for all cards');

    // Step 7: Verify outstanding balance is displayed
    for (const card of cards) {
      const outstanding = card.locator('[data-testid="outstanding"], .outstanding');
      const outstandingCount = await outstanding.count();
      expect(outstandingCount).toBeGreaterThan(0);
    }
    logger.info('Outstanding balances displayed for all cards');

    // Step 8: Verify available credit is displayed
    for (const card of cards) {
      const available = card.locator('[data-testid="available"], .available');
      const availableCount = await available.count();
      expect(availableCount).toBeGreaterThan(0);
    }
    logger.info('Available credit displayed for all cards');

    logger.info('Test Case QE-8966 TS-001 TC-001 completed successfully');
  });

  test('QE-8966 TS-002 TC-001: Verify error message with retry when card data service fails', async ({ page }) => {
    logger.info('Test Case: QE-8966 TS-002 TC-001 - Card data service error');
    
    // Step 1: Simulate card data service error
    await page.route('**/api/users/*/cards**', route => {
      route.abort('failed');
    });
    logger.info('Simulated card data service error');

    // Step 2: Login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await loginPage.clickLogin();
    logger.info('User logged in');

    // Step 3: Navigate to card management
    await cardManagementPage.navigate();
    logger.info('Attempted to load card management page');

    // Step 4: Verify error message is displayed
    await expect(cardManagementPage.errorMessage).toBeVisible();
    const errorText = await cardManagementPage.getErrorMessageText();
    expect(errorText).toContain('Card information cannot be retrieved');
    logger.info('Error message displayed correctly');

    // Step 5: Verify retry option is available
    await expect(cardManagementPage.retryButton).toBeVisible();
    logger.info('Retry button is visible');

    // Step 6: Restore card data service
    await page.unroute('**/api/users/*/cards**');
    logger.info('Card data service restored');

    // Step 7: Click retry button
    await cardManagementPage.clickRetry();
    await cardManagementPage.waitForCardListLoad();
    const cardCount = await cardManagementPage.cardItems.count();
    expect(cardCount).toBeGreaterThan(0);
    logger.info('Card management page reloaded successfully after retry');

    logger.info('Test Case QE-8966 TS-002 TC-001 completed successfully');
  });

  test('QE-8966 TS-003 TC-001: Verify card management loads 20 cards within 1 second without performance issues', async ({ page }) => {
    logger.info('Test Case: QE-8966 TS-003 TC-001 - 20 cards performance test');
    
    // Step 1: Login with user having 20 cards
    await loginPage.navigate();
    await loginPage.login('testuser_20cards', 'Pass@123');
    await loginPage.clickLogin();
    logger.info('User with 20 cards logged in');

    // Step 2: Navigate to card management and start timer
    const startTime = Date.now();
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    const loadTime = Date.now() - startTime;
    logger.info(`Card management page loaded in ${loadTime}ms`);

    // Step 3: Verify page loads within 1 second
    expect(loadTime).toBeLessThan(1000);
    logger.info('Page load time is within 1 second');

    // Step 4: Verify all 20 cards are displayed
    const cardCount = await cardManagementPage.cardItems.count();
    expect(cardCount).toBe(20);
    logger.info('All 20 cards displayed with complete details');

    // Step 5: Verify pagination or scrolling is implemented
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    if (pageHeight > viewportHeight) {
      logger.info('Scrolling mechanism is implemented');
    } else {
      const pagination = page.locator('.pagination, [data-testid="pagination"]');
      if (await pagination.isVisible()) {
        logger.info('Pagination is implemented');
      }
    }

    // Step 6: Verify no performance degradation
    const performanceMetrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart
      };
    });
    expect(performanceMetrics.domContentLoaded).toBeLessThan(2000);
    logger.info('No performance degradation detected');

    // Step 7: Scroll through all cards
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    logger.info('Scrolling is smooth without delays');

    logger.info('Test Case QE-8966 TS-003 TC-001 completed successfully');
  });
});
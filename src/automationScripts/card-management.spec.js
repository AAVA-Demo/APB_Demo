const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/card-management.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

// Test Case - QE-10430 TS-001 TC-001
test.describe('Card Management - Multiple Cards Display', () => {
  test('TC-001: Verify 5 credit cards displayed with visual distinction and complete details', async ({ page }) => {
    logger.info('Starting TC-001: Multiple cards display test');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser_5cards', 'Test@1234');
    logger.info('User authenticated');

    // Step 2: Navigate to Card Management
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.waitForCardsToLoad();
    logger.info('Card Management page loaded');

    // Step 3: Verify all 5 cards displayed
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(5);
    logger.info('All 5 cards displayed');

    // Step 4: Verify card type icons
    const cardTypes = await cardManagementPage.getCardTypes();
    expect(cardTypes).toContain('Visa');
    expect(cardTypes).toContain('MasterCard');
    expect(cardTypes).toContain('Amex');
    expect(cardTypes).toContain('Discover');
    logger.info('Card type icons verified');

    // Step 5: Verify color coding
    await cardManagementPage.verifyColorCoding();
    logger.info('Color coding verified');

    // Step 6: Verify last 4 digits
    const last4Digits = await cardManagementPage.getLast4Digits();
    expect(last4Digits).toContain('1234');
    expect(last4Digits).toContain('5678');
    logger.info('Last 4 digits verified');

    // Step 7: Verify card names
    const cardNames = await cardManagementPage.getCardNames();
    expect(cardNames).toContain('Chase Sapphire');
    expect(cardNames).toContain('Citi Rewards');
    logger.info('Card names verified');

    // Step 8: Verify credit limits
    const creditLimits = await cardManagementPage.getCreditLimits();
    expect(creditLimits).toContain('$15,000');
    expect(creditLimits).toContain('$20,000');
    logger.info('Credit limits verified');

    // Step 9: Verify available credit
    const availableCredits = await cardManagementPage.getAvailableCredits();
    expect(availableCredits.length).toBe(5);
    logger.info('Available credit verified for all cards');

    // Step 10: Verify outstanding balances
    const outstandingBalances = await cardManagementPage.getOutstandingBalances();
    expect(outstandingBalances.length).toBe(5);
    logger.info('Outstanding balances verified for all cards');
  });
});

// Test Case - QE-10430 TS-002 TC-001
test.describe('Card Management - Error Handling', () => {
  test('TC-002: Verify backend unavailability shows error with cached data or retry option', async ({ page }) => {
    logger.info('Starting TC-002: Backend error handling test');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@1234');
    logger.info('User authenticated');

    // Step 2: Simulate backend unavailability
    await page.route('**/api/cards', route => route.abort());
    logger.info('Backend service unavailability simulated');

    // Step 3: Navigate to Card Management
    await cardManagementPage.navigateToCardManagement();
    logger.info('Attempted to load Card Management section');

    // Step 4: Verify user-friendly error message
    const errorMessage = await cardManagementPage.getErrorMessage();
    expect(errorMessage).toContain('Unable to load your credit cards');
    expect(errorMessage).not.toContain('500');
    expect(errorMessage).not.toContain('timeout');
    logger.info('User-friendly error message displayed');

    // Step 5: Verify cached data or notification
    const cachedDataNotification = await page.locator('.cache-notification').isVisible().catch(() => false);
    if (cachedDataNotification) {
      const notificationText = await page.locator('.cache-notification').textContent();
      expect(notificationText).toContain('cached data');
      logger.info('Cached data notification displayed');
    }

    // Step 6: Verify Retry button
    const retryButton = await cardManagementPage.getRetryButton();
    await expect(retryButton).toBeVisible();
    logger.info('Retry button visible');

    // Step 7: Click Retry button
    await retryButton.click();
    logger.info('Retry button clicked');

    // Step 8: Verify no technical details exposed
    const pageContent = await page.content();
    expect(pageContent).not.toContain('stack trace');
    expect(pageContent).not.toContain('/api/cards');
    logger.info('No technical details exposed');

    // Step 9: Verify application stability
    await page.locator('nav a:has-text("Dashboard")').click();
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Application remains stable');
  });
});

// Test Case - QE-10430 TS-003 TC-001
test.describe('Card Management - Performance with 10 Cards', () => {
  test('TC-003: Verify 10 cards displayed with consistent layout and performance', async ({ page }) => {
    logger.info('Starting TC-003: 10 cards performance test');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser_10cards', 'Test@1234');
    logger.info('User authenticated');

    // Step 2: Navigate to Card Management
    await cardManagementPage.navigateToCardManagement();
    logger.info('Card Management page loaded');

    // Step 3: Verify all 10 cards accessible
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(10);
    logger.info('All 10 cards accessible');

    // Step 4: Verify layout consistency
    await cardManagementPage.verifyLayoutConsistency();
    logger.info('Layout consistency verified');

    // Step 5: Verify page load performance
    const loadStart = Date.now();
    await page.reload();
    await cardManagementPage.waitForCardsToLoad();
    const loadTime = Date.now() - loadStart;
    expect(loadTime).toBeLessThanOrEqual(2000);
    logger.info(`Page loaded in ${loadTime}ms`);

    // Step 6 & 7: Verify scrolling or pagination
    const isScrollable = await cardManagementPage.isScrollable();
    if (isScrollable) {
      await cardManagementPage.scrollToBottom();
      logger.info('Scrolling verified');
    } else {
      await cardManagementPage.navigateThroughPages();
      logger.info('Pagination verified');
    }

    // Step 8: Verify no truncation
    await cardManagementPage.verifyNoTruncation();
    logger.info('No truncation detected');

    // Step 9: Verify unique data for each card
    await cardManagementPage.verifyUniqueCardData();
    logger.info('Unique data verified for all 10 cards');

    // Step 10: Verify interaction performance
    const interactionStart = Date.now();
    await cardManagementPage.clickFirstCard();
    const interactionTime = Date.now() - interactionStart;
    expect(interactionTime).toBeLessThan(500);
    logger.info('Interaction performance verified');
  });
});

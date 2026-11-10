const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/card-management.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

// Test Case - QE-10432 TS-001 TC-001
test.describe('Card Switching - Instant Display', () => {
  test('TC-001: Verify instant switching from Chase Sapphire to Citi Rewards without lag', async ({ page }) => {
    logger.info('Starting TC-001: Instant card switching test');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@1234');
    logger.info('User authenticated');

    // Step 2: Navigate and select Card A
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.selectCard('Chase Sapphire');
    logger.info('Chase Sapphire Card selected');

    // Step 3: Note Card A details
    const cardADetails = await cardManagementPage.getCardDetails();
    expect(cardADetails.creditLimit).toBe('$15,000');
    expect(cardADetails.availableCredit).toBe('$12,000');
    logger.info('Card A details noted');

    // Step 4: Click on Card B
    const switchStart = Date.now();
    await cardManagementPage.selectCard('Citi Rewards');
    const switchTime = Date.now() - switchStart;
    expect(switchTime).toBeLessThan(100);
    logger.info(`Switched to Card B in ${switchTime}ms`);

    // Step 5: Verify Card B details displayed immediately
    const cardBDetails = await cardManagementPage.getCardDetails();
    expect(cardBDetails.creditLimit).toBe('$20,000');
    expect(cardBDetails.availableCredit).toBe('$15,000');
    logger.info('Card B details verified');

    // Step 6: Verify Card B spending patterns
    const spendingPatterns = await cardManagementPage.getSpendingPatterns();
    expect(spendingPatterns.topCategory).toBe('Shopping');
    logger.info('Card B spending patterns verified');

    // Step 7: Verify Card B utilization
    const utilization = await cardManagementPage.getUtilization();
    expect(utilization).toBe('25%');
    logger.info('Card B utilization verified');

    // Step 8: Verify Card B recent transactions
    const transactions = await cardManagementPage.getRecentTransactions();
    expect(transactions.length).toBeGreaterThanOrEqual(5);
    logger.info('Card B recent transactions verified');
  });
});

// Test Case - QE-10432 TS-002 TC-001
test.describe('Card Switching - Deactivated Card', () => {
  test('TC-002: Verify deactivated card shows error and removes from list', async ({ page }) => {
    logger.info('Starting TC-002: Deactivated card handling test');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@1234');
    logger.info('User authenticated');

    // Step 2: Navigate to Card Management
    await cardManagementPage.navigateToCardManagement();
    const initialCardCount = await cardManagementPage.getCardCount();
    logger.info(`Initial card count: ${initialCardCount}`);

    // Step 3: Identify deactivated card
    const deactivatedCard = 'Amex Gold';
    logger.info(`Deactivated card identified: ${deactivatedCard}`);

    // Step 4: Attempt to click deactivated card
    await cardManagementPage.selectCard(deactivatedCard);
    logger.info('Attempted to select deactivated card');

    // Step 4: Verify error message
    const errorMessage = await cardManagementPage.getErrorMessage();
    expect(errorMessage).toContain('no longer available');
    expect(errorMessage).toContain('deactivated');
    logger.info('Error message verified');

    // Step 5: Verify card removed from list
    await page.waitForTimeout(1000);
    const updatedCardCount = await cardManagementPage.getCardCount();
    expect(updatedCardCount).toBe(initialCardCount - 1);
    logger.info('Deactivated card removed from list');

    // Step 6: Verify user not navigated to card details
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/cards/card3');
    logger.info('User remained on card list page');

    // Step 7: Verify no application errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.waitForTimeout(1000);
    expect(consoleErrors.length).toBe(0);
    logger.info('No console errors detected');
  });
});

// Test Case - QE-10432 TS-003 TC-001
test.describe('Card Switching - Rapid Switching', () => {
  test('TC-003: Verify rapid switching between 5 cards maintains accuracy', async ({ page }) => {
    logger.info('Starting TC-003: Rapid card switching test');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser_5cards', 'Test@1234');
    logger.info('User authenticated');

    // Step 2: Navigate to Card Management
    await cardManagementPage.navigateToCardManagement();
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(5);
    logger.info('All 5 cards verified');

    // Step 3-8: Rapid switching cycle
    const cards = [
      { name: 'Chase Sapphire', limit: '$15,000', available: '$12,000', utilization: '20%', category: 'Food & Dining' },
      { name: 'Citi Rewards', limit: '$20,000', available: '$15,000', utilization: '25%', category: 'Shopping' },
      { name: 'Amex Gold', limit: '$15,000', available: '$8,432', utilization: '43.8%', category: 'Travel' },
      { name: 'Discover It', limit: '$10,000', available: '$7,500', utilization: '25%', category: 'Fuel' },
      { name: 'Capital One Venture', limit: '$25,000', available: '$20,000', utilization: '20%', category: 'Entertainment' }
    ];

    const switchTimes = [];
    for (const card of cards) {
      const switchStart = Date.now();
      await cardManagementPage.selectCard(card.name);
      const switchTime = Date.now() - switchStart;
      switchTimes.push(switchTime);

      const details = await cardManagementPage.getCardDetails();
      expect(details.creditLimit).toBe(card.limit);
      expect(details.availableCredit).toBe(card.available);
      const utilization = await cardManagementPage.getUtilization();
      expect(utilization).toBe(card.utilization);
      const patterns = await cardManagementPage.getSpendingPatterns();
      expect(patterns.topCategory).toBe(card.category);
      logger.info(`${card.name} verified - Switch time: ${switchTime}ms`);
    }

    // Return to Card A
    await cardManagementPage.selectCard('Chase Sapphire');
    const finalDetails = await cardManagementPage.getCardDetails();
    expect(finalDetails.creditLimit).toBe('$15,000');
    logger.info('Returned to Card A - Data integrity maintained');

    // Step 9: Verify all transitions instantaneous
    const avgSwitchTime = switchTimes.reduce((a, b) => a + b, 0) / switchTimes.length;
    expect(avgSwitchTime).toBeLessThan(100);
    logger.info(`Average switch time: ${avgSwitchTime}ms`);

    // Step 10: Verify data integrity
    logger.info('Data integrity: 100% accurate for all 5 cards');
  });
});

const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/card-management.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Card Management - QE-8968', () => {
  let cardManagementPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    logger.info('Starting Card Management test');
  });

  test('QE-8968 TS-001 TC-001: Verify detailed spending analysis is displayed when user selects a specific credit card', async ({ page }) => {
    logger.info('Test Case: QE-8968 TS-001 TC-001 - Detailed card spending analysis');
    
    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await loginPage.clickLogin();
    logger.info('User logged in successfully');

    // Step 2: Navigate to card management section
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    logger.info('Card management section loaded');

    // Step 3: Select specific credit card
    await cardManagementPage.selectCard('3456'); // Visa ending in 3456
    await cardManagementPage.waitForCardDetailLoad();
    logger.info('Card detail view loaded');

    // Step 4: Verify credit limit is displayed
    const creditLimit = await cardManagementPage.getCreditLimit();
    expect(creditLimit).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    logger.info(`Credit limit displayed: ${creditLimit}`);

    // Step 5: Verify outstanding balance is displayed
    const outstandingBalance = await cardManagementPage.getOutstandingBalance();
    expect(outstandingBalance).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    logger.info(`Outstanding balance displayed: ${outstandingBalance}`);

    // Step 6: Verify available credit is displayed
    const availableCredit = await cardManagementPage.getAvailableCredit();
    expect(availableCredit).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    logger.info(`Available credit displayed: ${availableCredit}`);

    // Step 7: Verify monthly spending is displayed
    const monthlySpending = await cardManagementPage.getMonthlySpending();
    expect(monthlySpending).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    logger.info(`Monthly spending displayed: ${monthlySpending}`);

    // Step 8: Verify category-wise spending breakdown
    const categoryBreakdown = await cardManagementPage.getCategoryBreakdown();
    expect(Object.keys(categoryBreakdown).length).toBeGreaterThan(0);
    for (const [category, amount] of Object.entries(categoryBreakdown)) {
      expect(amount).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
      logger.info(`${category}: ${amount}`);
    }

    logger.info('Test Case QE-8968 TS-001 TC-001 completed successfully');
  });

  test('QE-8968 TS-002 TC-001: Verify warning message when user selects a deactivated credit card', async ({ page }) => {
    logger.info('Test Case: QE-8968 TS-002 TC-001 - Deactivated card warning');
    
    // Step 1: Login with user having deactivated card
    await loginPage.navigate();
    await loginPage.login('testuser_deactivatedcard', 'Pass@123');
    await loginPage.clickLogin();
    logger.info('User with deactivated card logged in');

    // Step 2: Navigate to card management section
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    logger.info('Card management section loaded');

    // Step 3: Select deactivated credit card
    await cardManagementPage.selectCard('7890'); // MasterCard ending in 7890 (Inactive)
    await cardManagementPage.waitForCardDetailLoad();
    logger.info('Deactivated card detail view loaded');

    // Step 4: Verify card details are displayed
    await expect(cardManagementPage.creditLimitField).toBeVisible();
    await expect(cardManagementPage.outstandingBalanceField).toBeVisible();
    logger.info('Card details displayed');

    // Step 5: Verify warning message for inactive card
    await expect(cardManagementPage.inactiveCardWarning).toBeVisible();
    const warningText = await cardManagementPage.getInactiveCardWarningText();
    expect(warningText).toContain('This card is inactive');
    expect(warningText).toContain('Spending analysis may not reflect current data');
    logger.info('Inactive card warning displayed correctly');

    // Step 6: Verify card status shows Inactive
    const cardStatus = await cardManagementPage.getCardStatus();
    expect(cardStatus).toContain('Inactive');
    logger.info(`Card status: ${cardStatus}`);

    logger.info('Test Case QE-8968 TS-002 TC-001 completed successfully');
  });

  test('QE-8968 TS-003 TC-001: Verify system maintains accurate card-specific data when comparing multiple cards', async ({ page }) => {
    logger.info('Test Case: QE-8968 TS-003 TC-001 - Compare multiple cards data integrity');
    
    // Step 1: Login with multi-card user
    await loginPage.navigate();
    await loginPage.login('testuser_multicard', 'Pass@123');
    await loginPage.clickLogin();
    logger.info('Multi-card user logged in');

    // Step 2: Navigate to card management
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    logger.info('Card list displayed');

    // Step 3: Select first card
    await cardManagementPage.selectCard('3456'); // Visa ending in 3456
    await cardManagementPage.waitForCardDetailLoad();
    logger.info('First card selected');

    // Step 4: Note first card details
    const card1Data = {
      creditLimit: await cardManagementPage.getCreditLimit(),
      outstanding: await cardManagementPage.getOutstandingBalance(),
      monthlySpend: await cardManagementPage.getMonthlySpending(),
      categoryBreakdown: await cardManagementPage.getCategoryBreakdown()
    };
    logger.info('First card data captured:');
    logger.info(JSON.stringify(card1Data));

    // Step 5: Navigate back to card list
    await cardManagementPage.goBackToCardList();
    await cardManagementPage.waitForCardListLoad();
    logger.info('Navigated back to card list');

    // Step 6: Select second card
    await cardManagementPage.selectCard('7890'); // MasterCard ending in 7890
    await cardManagementPage.waitForCardDetailLoad();
    logger.info('Second card selected');

    // Step 7: Verify second card data is different
    const card2Data = {
      creditLimit: await cardManagementPage.getCreditLimit(),
      outstanding: await cardManagementPage.getOutstandingBalance(),
      monthlySpend: await cardManagementPage.getMonthlySpending(),
      categoryBreakdown: await cardManagementPage.getCategoryBreakdown()
    };
    logger.info('Second card data captured:');
    logger.info(JSON.stringify(card2Data));
    
    // Verify data is different between cards
    expect(card1Data.creditLimit).not.toBe(card2Data.creditLimit);
    logger.info('Second card data is different from first card');

    // Step 8: Navigate back to first card
    await cardManagementPage.goBackToCardList();
    await cardManagementPage.selectCard('3456');
    await cardManagementPage.waitForCardDetailLoad();
    logger.info('Navigated back to first card');

    // Step 9: Verify first card data remains unchanged
    const card1DataRecheck = {
      creditLimit: await cardManagementPage.getCreditLimit(),
      outstanding: await cardManagementPage.getOutstandingBalance(),
      monthlySpend: await cardManagementPage.getMonthlySpending()
    };
    expect(card1DataRecheck.creditLimit).toBe(card1Data.creditLimit);
    expect(card1DataRecheck.outstanding).toBe(card1Data.outstanding);
    expect(card1DataRecheck.monthlySpend).toBe(card1Data.monthlySpend);
    logger.info('First card data remains accurate and unchanged');

    logger.info('Test Case QE-8968 TS-003 TC-001 completed successfully');
  });
});
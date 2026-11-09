const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Multiple Credit Card Display - QE-7918', () => {
  let cardManagementPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    logger.info('Starting card management test case');
  });

  test('QE-7918 TS-001 TC-001: Verify user with 5 active credit cards can view consolidated card list with masked numbers within 3 seconds', async ({ page }) => {
    logger.info('Test Case ID: QE-7918 TS-001 TC-001');
    
    await test.step('Launch the application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveURL(/.*creditcard-dashboard/);
      logger.info('Application loaded successfully');
    });

    await test.step('Login with user credentials who has 5 active credit cards', async () => {
      await loginPage.login('testuser_5cards', 'Test@123');
      logger.info('User authenticated');
    });

    await test.step('Navigate to My Cards section', async () => {
      const startTime = Date.now();
      await cardManagementPage.navigateToMyCards();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000);
      logger.info(`Multi-card interface loaded in ${loadTime}ms`);
    });

    await test.step('Verify consolidated list displays all 5 credit cards', async () => {
      const cardCount = await cardManagementPage.getCardCount();
      expect(cardCount).toBe(5);
      logger.info('All 5 cards visible in the list');
    });

    await test.step('Verify each card displays masked card number', async () => {
      const maskedNumbers = await cardManagementPage.getAllMaskedCardNumbers();
      expect(maskedNumbers).toHaveLength(5);
      maskedNumbers.forEach((number, index) => {
        expect(number).toMatch(/XXXX-XXXX-XXXX-\d{4}/);
        logger.info(`Card ${index + 1} masked number verified: ${number}`);
      });
    });

    await test.step('Verify individual credit limits are displayed for each card', async () => {
      const creditLimits = await cardManagementPage.getAllCreditLimits();
      expect(creditLimits).toHaveLength(5);
      const expectedLimits = ['$10,000.00', '$5,000.00', '$15,000.00', '$8,000.00', '$12,000.00'];
      creditLimits.forEach((limit, index) => {
        expect(limit).toBe(expectedLimits[index]);
        logger.info(`Card ${index + 1} credit limit verified: ${limit}`);
      });
    });

    await test.step('Verify current balances are displayed for each card', async () => {
      const balances = await cardManagementPage.getAllCurrentBalances();
      expect(balances).toHaveLength(5);
      const expectedBalances = ['$2,500.00', '$1,200.00', '$5,000.00', '$3,800.00', '$4,500.00'];
      balances.forEach((balance, index) => {
        expect(balance).toBe(expectedBalances[index]);
        logger.info(`Card ${index + 1} current balance verified: ${balance}`);
      });
    });
  });

  test('QE-7918 TS-002 TC-001: Verify system displays timeout error when user with 15 cards exceeds 3-second performance threshold', async ({ page }) => {
    logger.info('Test Case ID: QE-7918 TS-002 TC-001');
    
    await test.step('Launch application and login with user having 15 credit cards', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_15cards', 'Test@123');
      logger.info('User authenticated');
    });

    await test.step('Navigate to My Cards section', async () => {
      await cardManagementPage.navigateToMyCards();
      logger.info('System attempts to load multi-card interface');
    });

    await test.step('Verify system fails to retrieve card data within 3-second threshold', async () => {
      const startTime = Date.now();
      await cardManagementPage.waitForLoadingIndicator();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeGreaterThan(3000);
      logger.info(`Loading took ${loadTime}ms (exceeds 3-second threshold)`);
    });

    await test.step('Verify appropriate timeout error message is displayed', async () => {
      await expect(cardManagementPage.timeoutErrorMessage).toBeVisible();
      const errorMessage = await cardManagementPage.getErrorMessage();
      expect(errorMessage).toContain('Unable to load card data within expected time. Please try again.');
      logger.info('Timeout error message verified');
    });
  });

  test('QE-7918 TS-003 TC-001: Verify error message is displayed when Credit Card Repository service is unavailable', async ({ page }) => {
    logger.info('Test Case ID: QE-7918 TS-003 TC-001');
    
    await test.step('Simulate Credit Card Repository service unavailability', async () => {
      await page.route('**/api/cards**', route => route.abort());
      logger.info('Backend service unavailable (simulated)');
    });

    await test.step('Launch application and login', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_standard', 'Test@123');
      logger.info('User authentication succeeds');
    });

    await test.step('Attempt to navigate to My Cards section', async () => {
      await cardManagementPage.navigateToMyCards();
      logger.info('System attempts to retrieve card data from unavailable service');
    });

    await test.step('Verify error message is displayed indicating service unavailability', async () => {
      await expect(cardManagementPage.serviceUnavailableError).toBeVisible();
      const errorMessage = await cardManagementPage.getErrorMessage();
      expect(errorMessage).toContain('Card data cannot be retrieved at this time. Please try again later.');
      logger.info('Service unavailability error message verified');
    });
  });
});

test.describe('Card-Wise Spend Analysis - QE-7919', () => {
  let cardManagementPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    logger.info('Starting card-wise spend analysis test case');
  });

  test('QE-7919 TS-001 TC-001: Verify detailed spending data is displayed when user selects a card with multiple category transactions', async ({ page }) => {
    logger.info('Test Case ID: QE-7919 TS-001 TC-001');
    
    await test.step('Launch the application and login', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_multicat', 'Test@123');
      logger.info('User authenticated and dashboard loads');
    });

    await test.step('Navigate to My Cards section', async () => {
      await cardManagementPage.navigateToMyCards();
      await expect(cardManagementPage.cardList).toBeVisible();
      logger.info('Card list page displays all user\'s credit cards');
    });

    await test.step('Select a specific credit card that has transactions in multiple categories', async () => {
      await cardManagementPage.selectCardByMaskedNumber('XXXX-XXXX-XXXX-5678');
      await expect(cardManagementPage.cardDetailPage).toBeVisible();
      logger.info('Card detail page loads');
    });

    await test.step('Verify total spend is displayed for the selected card', async () => {
      const totalSpend = await cardManagementPage.getTotalSpend();
      expect(totalSpend).toBe('$1,850.00');
      logger.info('Total spend amount shown accurately');
    });

    await test.step('Verify available credit is displayed', async () => {
      const availableCredit = await cardManagementPage.getCardAvailableCredit();
      expect(availableCredit).toBe('$8,150.00');
      logger.info('Available credit calculated and displayed correctly');
    });

    await test.step('Verify transaction breakdown by category is displayed', async () => {
      const categoryBreakdown = await cardManagementPage.getCategoryBreakdown();
      expect(categoryBreakdown).toEqual({
        'Food & Dining': '$450.00',
        'Shopping': '$600.00',
        'Entertainment': '$300.00',
        'Utilities': '$250.00',
        'Fuel': '$250.00'
      });
      logger.info('Complete category-wise breakdown verified');
    });
  });

  test('QE-7919 TS-002 TC-001: Verify appropriate message is displayed when user selects a card with no transaction history', async ({ page }) => {
    logger.info('Test Case ID: QE-7919 TS-002 TC-001');
    
    await test.step('Launch application and authenticate', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_newcard', 'Test@123');
      logger.info('User successfully logs in');
    });

    await test.step('Navigate to My Cards section', async () => {
      await cardManagementPage.navigateToMyCards();
      await expect(cardManagementPage.cardList).toBeVisible();
      logger.info('Card list is displayed');
    });

    await test.step('Select a credit card that has no transaction history', async () => {
      await cardManagementPage.selectCardByMaskedNumber('XXXX-XXXX-XXXX-9999');
      await expect(cardManagementPage.cardDetailPage).toBeVisible();
      logger.info('Card detail page loads');
    });

    await test.step('Verify message indicating no spending data is displayed', async () => {
      await expect(cardManagementPage.noSpendingDataMessage).toBeVisible();
      const message = await cardManagementPage.getNoSpendingDataMessage();
      expect(message).toContain('No spending data available for this card');
      logger.info('No spending data message shown');
    });

    await test.step('Verify no transaction breakdown is displayed', async () => {
      const isBreakdownVisible = await cardManagementPage.isTransactionBreakdownVisible();
      expect(isBreakdownVisible).toBeFalsy();
      logger.info('Transaction breakdown section not rendered');
    });
  });

  test('QE-7919 TS-003 TC-001: Verify user can compare spending across two different credit cards with distinct data', async ({ page }) => {
    logger.info('Test Case ID: QE-7919 TS-003 TC-001');
    
    let card1Data;
    let card2Data;

    await test.step('Launch application and login with user having multiple cards', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_compare', 'Test@123');
      logger.info('User is authenticated');
    });

    await test.step('Navigate to My Cards and select first credit card', async () => {
      await cardManagementPage.navigateToMyCards();
      await cardManagementPage.selectCardByMaskedNumber('XXXX-XXXX-XXXX-1111');
      await expect(cardManagementPage.cardDetailPage).toBeVisible();
      logger.info('First card detail page loads with spending data');
    });

    await test.step('Note the spending details for first card', async () => {
      card1Data = {
        totalSpend: await cardManagementPage.getTotalSpend(),
        availableCredit: await cardManagementPage.getCardAvailableCredit(),
        categoryBreakdown: await cardManagementPage.getCategoryBreakdown()
      };
      expect(card1Data.totalSpend).toBe('$2,500.00');
      expect(card1Data.availableCredit).toBe('$7,500.00');
      expect(card1Data.categoryBreakdown).toEqual({
        'Shopping': '$1,200.00',
        'Food & Dining': '$800.00',
        'Entertainment': '$500.00'
      });
      logger.info('Total spend, available credit, and category breakdown displayed for Card 1');
    });

    await test.step('Navigate back to card list and select second credit card', async () => {
      await cardManagementPage.navigateBackToCardList();
      await cardManagementPage.selectCardByMaskedNumber('XXXX-XXXX-XXXX-2222');
      await expect(cardManagementPage.cardDetailPage).toBeVisible();
      logger.info('Second card detail page loads');
    });

    await test.step('Verify spending details for second card are distinct from first card', async () => {
      card2Data = {
        totalSpend: await cardManagementPage.getTotalSpend(),
        availableCredit: await cardManagementPage.getCardAvailableCredit(),
        categoryBreakdown: await cardManagementPage.getCategoryBreakdown()
      };
      expect(card2Data.totalSpend).toBe('$1,800.00');
      expect(card2Data.availableCredit).toBe('$3,200.00');
      expect(card2Data.categoryBreakdown).toEqual({
        'Travel': '$900.00',
        'Fuel': '$500.00',
        'Utilities': '$400.00'
      });
      logger.info('Different spending totals, available credit, and category-specific data displayed for Card 2');
    });

    await test.step('Compare the two cards\' data to verify accuracy', async () => {
      expect(card1Data.totalSpend).not.toBe(card2Data.totalSpend);
      expect(card1Data.availableCredit).not.toBe(card2Data.availableCredit);
      expect(card1Data.categoryBreakdown).not.toEqual(card2Data.categoryBreakdown);
      logger.info('Each card displays its own unique spending data without cross-contamination');
    });
  });
});
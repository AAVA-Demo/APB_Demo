const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { CardManagementPage } = require('./pages/cardManagement.page');
const logger = require('../utils/logger');

test.describe('Multiple Credit Card Display Tests', () => {
  let loginPage;
  let dashboardPage;
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    cardManagementPage = new CardManagementPage(page);
    
    await loginPage.navigate();
  });

  test('QE-7523 TS-001 TC-001: Verify all credit cards are retrieved and displayed within 1 second', async ({ page }) => {
    logger.info('Test Case: QE-7523 TS-001 TC-001 - Multiple Cards Display (5 cards)');
    
    await test.step('Login with user having 5 credit cards', async () => {
      await loginPage.login('user5cards@example.com', 'FiveCards123');
      logger.info('User with 5 cards authenticated');
    });

    await test.step('Navigate to Card Management section', async () => {
      await dashboardPage.waitForDashboardLoad();
      const startTime = Date.now();
      await dashboardPage.navigateToCardManagement();
      await cardManagementPage.waitForCardsLoad();
      const loadTime = Date.now() - startTime;
      
      logger.info(`Card Management load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThanOrEqual(1000);
    });

    await test.step('Verify all 5 cards are displayed', async () => {
      const cardCount = await cardManagementPage.getDisplayedCardCount();
      expect(cardCount).toBe(5);
      logger.info(`${cardCount} cards displayed`);
    });

    await test.step('Verify each card displays key details', async () => {
      const cards = await cardManagementPage.getAllCardDetails();
      expect(cards.length).toBe(5);
      
      cards.forEach((card, index) => {
        expect(card.cardName).toBeTruthy();
        expect(card.cardType).toBeTruthy();
        expect(card.creditLimit).toBeTruthy();
        expect(card.availableCredit).toBeTruthy();
        expect(card.outstandingAmount).toBeTruthy();
        logger.info(`Card ${index + 1}: ${card.cardName} (${card.cardType}) - Limit: ${card.creditLimit}, Available: ${card.availableCredit}, Outstanding: ${card.outstandingAmount}`);
      });
    });
  });

  test('QE-7523 TS-002 TC-001: Verify system handles more than 10 credit cards without performance degradation', async ({ page }) => {
    logger.info('Test Case: QE-7523 TS-002 TC-001 - Multiple Cards (12 cards)');
    
    await test.step('Login with user having 12 credit cards', async () => {
      await loginPage.login('user12cards@example.com', 'TwelveCards456');
      logger.info('User with 12 cards authenticated');
    });

    await test.step('Navigate to Card Management section', async () => {
      await dashboardPage.waitForDashboardLoad();
      const startTime = Date.now();
      await dashboardPage.navigateToCardManagement();
      await cardManagementPage.waitForCardsLoad();
      const loadTime = Date.now() - startTime;
      
      logger.info(`Card Management load time for 12 cards: ${loadTime}ms`);
      expect(loadTime).toBeLessThanOrEqual(1000);
    });

    await test.step('Verify all 12 cards are displayed', async () => {
      const cardCount = await cardManagementPage.getDisplayedCardCount();
      expect(cardCount).toBe(12);
      logger.info(`${cardCount} cards displayed without performance degradation`);
    });

    await test.step('Verify all cards have complete details with no truncation', async () => {
      const cards = await cardManagementPage.getAllCardDetails();
      expect(cards.length).toBe(12);
      
      cards.forEach((card, index) => {
        expect(card.cardName).toBeTruthy();
        expect(card.cardType).toBeTruthy();
        expect(card.creditLimit).toBeTruthy();
        expect(card.availableCredit).toBeTruthy();
        expect(card.outstandingAmount).toBeTruthy();
      });
      
      logger.info('All 12 cards have complete details with no data truncation');
    });
  });

  test('QE-7523 TS-003 TC-001: Verify error message when card data repository is unavailable', async ({ page }) => {
    logger.info('Test Case: QE-7523 TS-003 TC-001 - Card Repository Unavailable');
    
    await test.step('Simulate card data repository unavailability', async () => {
      await page.route('**/api/cards/**', route => route.abort());
      await page.route('**/api/users/**/cards', route => route.abort());
      logger.info('Card data repository routes blocked');
    });

    await test.step('Login and navigate to Card Management', async () => {
      await loginPage.login('testuser@example.com', 'ValidPass123');
      await dashboardPage.waitForDashboardLoad();
      await dashboardPage.navigateToCardManagement();
      logger.info('Navigated to Card Management section');
    });

    await test.step('Verify error message is displayed', async () => {
      await cardManagementPage.waitForErrorMessage();
      const errorMessage = await cardManagementPage.getErrorMessage();
      expect(errorMessage).toContain('Failed to load cards');
      logger.info(`Error message displayed: ${errorMessage}`);
    });

    await test.step('Verify no cached or outdated card information is shown', async () => {
      const cardsVisible = await cardManagementPage.areCardsVisible();
      expect(cardsVisible).toBe(false);
      logger.info('Confirmed no cached or outdated card information is displayed');
    });
  });
});

test.describe('Card-Wise Spend Analysis Tests', () => {
  let loginPage;
  let dashboardPage;
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    cardManagementPage = new CardManagementPage(page);
    
    await loginPage.navigate();
  });

  test('QE-7524 TS-001 TC-001: Verify detailed spending analysis is displayed for selected card', async ({ page }) => {
    logger.info('Test Case: QE-7524 TS-001 TC-001 - Card-Wise Spend Analysis');
    
    await test.step('Login with user having multiple credit cards', async () => {
      await loginPage.login('multicard@example.com', 'MultiCard123');
      logger.info('User with multiple cards authenticated');
    });

    await test.step('Navigate to Card Management', async () => {
      await dashboardPage.waitForDashboardLoad();
      await dashboardPage.navigateToCardManagement();
      await cardManagementPage.waitForCardsLoad();
      logger.info('Card Management page loaded');
    });

    await test.step('Select specific credit card', async () => {
      await cardManagementPage.selectCardByName('Platinum Rewards');
      await cardManagementPage.waitForCardDetailLoad();
      logger.info('Platinum Rewards Card selected');
    });

    await test.step('Verify detailed spending analysis is displayed', async () => {
      const spendAnalysis = await cardManagementPage.getCardSpendAnalysis();
      
      expect(spendAnalysis.monthlySpend).toBeTruthy();
      expect(spendAnalysis.weeklySpend).toBeTruthy();
      expect(spendAnalysis.topCategories).toBeTruthy();
      expect(spendAnalysis.topCategories.length).toBeGreaterThan(0);
      
      logger.info(`Monthly Spend: ${spendAnalysis.monthlySpend}`);
      logger.info(`Weekly Spend: ${spendAnalysis.weeklySpend}`);
      logger.info(`Top Categories: ${JSON.stringify(spendAnalysis.topCategories)}`);
    });
  });

  test('QE-7524 TS-002 TC-001: Verify zero spending values for card with no transaction history', async ({ page }) => {
    logger.info('Test Case: QE-7524 TS-002 TC-001 - No Transaction History');
    
    await test.step('Login with user having card with no transactions', async () => {
      await loginPage.login('newcard@example.com', 'NewCard789');
      logger.info('User with new card (no transactions) authenticated');
    });

    await test.step('Navigate to Card Management and select new card', async () => {
      await dashboardPage.waitForDashboardLoad();
      await dashboardPage.navigateToCardManagement();
      await cardManagementPage.waitForCardsLoad();
      await cardManagementPage.selectCardByName('New Gold Card');
      await cardManagementPage.waitForCardDetailLoad();
      logger.info('New Gold Card selected');
    });

    await test.step('Verify zero spending values are displayed', async () => {
      const spendAnalysis = await cardManagementPage.getCardSpendAnalysis();
      
      expect(spendAnalysis.monthlySpend).toContain('0');
      expect(spendAnalysis.weeklySpend).toContain('0');
      logger.info(`Monthly Spend: ${spendAnalysis.monthlySpend}, Weekly Spend: ${spendAnalysis.weeklySpend}`);
    });

    await test.step('Verify appropriate no transactions message', async () => {
      const noTransactionsMessage = await cardManagementPage.getNoTransactionsMessage();
      expect(noTransactionsMessage).toContain('No transactions have been recorded');
      logger.info(`Message displayed: ${noTransactionsMessage}`);
    });
  });

  test('QE-7524 TS-003 TC-001: Verify error message when spend analysis engine fails', async ({ page }) => {
    logger.info('Test Case: QE-7524 TS-003 TC-001 - Spend Analysis Engine Failure');
    
    await test.step('Simulate spend analysis engine failure', async () => {
      await page.route('**/api/cards/**/spend', route => route.abort());
      logger.info('Spend analysis engine routes blocked');
    });

    await test.step('Login and navigate to Card Management', async () => {
      await loginPage.login('testuser@example.com', 'ValidPass123');
      await dashboardPage.waitForDashboardLoad();
      await dashboardPage.navigateToCardManagement();
      await cardManagementPage.waitForCardsLoad();
      logger.info('Card Management page loaded');
    });

    await test.step('Select a credit card', async () => {
      await cardManagementPage.selectCardByIndex(0);
      await cardManagementPage.waitForCardDetailLoad();
      logger.info('Card selected');
    });

    await test.step('Verify error message is displayed', async () => {
      await cardManagementPage.waitForSpendAnalysisError();
      const errorMessage = await cardManagementPage.getSpendAnalysisErrorMessage();
      expect(errorMessage).toContain('Failed to load card spending analysis');
      logger.info(`Error message displayed: ${errorMessage}`);
    });

    await test.step('Verify no incorrect spending data is shown', async () => {
      const spendDataVisible = await cardManagementPage.isSpendAnalysisVisible();
      expect(spendDataVisible).toBe(false);
      logger.info('Confirmed no incorrect spending data is displayed');
    });
  });
});
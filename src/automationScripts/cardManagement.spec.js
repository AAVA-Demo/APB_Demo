const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CardManagementPage } = require('./pages/cardManagement.page');

test.describe('Card Management Tests', () => {
  let loginPage;
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
  });

  test('TC-6643: Verify user with 5 registered credit cards views complete card list with all details', async ({ page }) => {
    await test.step('Login with user account having 5 registered credit cards', async () => {
      await loginPage.navigate();
      await loginPage.login('user_5cards', 'Pass@123');
    });

    await test.step('Navigate to Card Management section', async () => {
      await cardManagementPage.navigate();
      await cardManagementPage.waitForCardsLoad();
    });

    await test.step('Verify 5 credit cards are displayed in the list', async () => {
      const cardCount = await cardManagementPage.getCardCount();
      expect(cardCount).toBe(5);
    });

    await test.step('For each card, verify card name is displayed', async () => {
      const cardNames = await cardManagementPage.getAllCardNames();
      expect(cardNames.length).toBe(5);
      cardNames.forEach(name => expect(name).not.toBe(''));
    });

    await test.step('For each card, verify card type is displayed', async () => {
      const cardTypes = await cardManagementPage.getAllCardTypes();
      expect(cardTypes.length).toBe(5);
      cardTypes.forEach(type => expect(type).toBe('Credit'));
    });

    await test.step('For each card, verify last 4 digits of card number are displayed', async () => {
      const cardNumbers = await cardManagementPage.getAllCardNumbers();
      expect(cardNumbers.length).toBe(5);
      cardNumbers.forEach(num => expect(num).toMatch(/\*{4}\d{4}/));
    });

    await test.step('For each card, verify monthly spend amount is displayed', async () => {
      const monthlySpends = await cardManagementPage.getAllMonthlySpends();
      expect(monthlySpends.length).toBe(5);
      monthlySpends.forEach(spend => expect(spend).toMatch(/\$[0-9,]+\.\d{2}/));
    });

    await test.step('For each card, verify credit limit is displayed', async () => {
      const creditLimits = await cardManagementPage.getAllCreditLimits();
      expect(creditLimits.length).toBe(5);
      creditLimits.forEach(limit => expect(limit).toMatch(/\$[0-9,]+/));
    });

    await test.step('For each card, verify available credit is displayed', async () => {
      const availableCredits = await cardManagementPage.getAllAvailableCredits();
      expect(availableCredits.length).toBe(5);
      availableCredits.forEach(credit => expect(credit).toMatch(/\$[0-9,]+/));
    });

    await test.step('For each card, verify current balance is displayed', async () => {
      const balances = await cardManagementPage.getAllCurrentBalances();
      expect(balances.length).toBe(5);
      balances.forEach(balance => expect(balance).toMatch(/\$[0-9,]+/));
    });
  });

  test('TC-6644: Verify user with 10 credit cards loads card management section within 1 second', async ({ page }) => {
    await test.step('Login with user account having 10 registered credit cards', async () => {
      await loginPage.navigate();
      await loginPage.login('user_10cards', 'Pass@123');
    });

    await test.step('Navigate to Card Management section', async () => {
      const startTime = Date.now();
      await cardManagementPage.navigate();
      await cardManagementPage.waitForCardsLoad();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(1000);
    });

    await test.step('Verify all 10 credit cards are displayed in the list', async () => {
      const cardCount = await cardManagementPage.getCardCount();
      expect(cardCount).toBe(10);
    });

    await test.step('Verify all card details are fully loaded', async () => {
      const allDetailsLoaded = await cardManagementPage.verifyAllDetailsLoaded();
      expect(allDetailsLoaded).toBe(true);
    });
  });

  test('TC-6645: Verify user receives error message when API returns 500 error', async ({ page, context }) => {
    await test.step('Configure test environment to simulate API 500 error', async () => {
      await context.route('**/api/user/cards', route => {
        route.fulfill({
          status: 500,
          body: 'Internal Server Error'
        });
      });
    });

    await test.step('Login to application', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser', 'Pass@123');
    });

    await test.step('Navigate to Card Management section', async () => {
      await cardManagementPage.navigate();
    });

    await test.step('Verify error message is displayed to user', async () => {
      const errorMessage = await cardManagementPage.getErrorMessage();
      expect(errorMessage).toContain('Failed to load cards');
    });

    await test.step('Verify no card data is displayed', async () => {
      const cardCount = await cardManagementPage.getCardCount();
      expect(cardCount).toBe(0);
    });

    await test.step('Verify page remains functional', async () => {
      const isNavigable = await page.evaluate(() => {
        return document.readyState === 'complete';
      });
      expect(isNavigable).toBe(true);
    });
  });
});

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CardManagementPage } = require('./pages/cardManagement.page');

test.describe('Multi-Card Management - QE-8918 & QE-8919', () => {
  let loginPage;
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    await loginPage.navigate();
  });

  test('QE-8918 TS-001 TC-001: Verify multiple credit cards are displayed with card names, balances, and credit limits in consolidated view', async ({ page }) => {
    await loginPage.login('user_with_3_cards', 'password');
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.waitForCardListLoad();
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(3);
    const card1Number = await cardManagementPage.getCardNumber(0);
    expect(card1Number).toBe('**** **** **** 1234');
    const card1Balance = await cardManagementPage.getCardBalance(0);
    expect(card1Balance).toBe('$2,500');
    const card1Limit = await cardManagementPage.getCardCreditLimit(0);
    expect(card1Limit).toBe('$10,000');
    const card2Number = await cardManagementPage.getCardNumber(1);
    expect(card2Number).toBe('**** **** **** 5678');
    const card3Number = await cardManagementPage.getCardNumber(2);
    expect(card3Number).toBe('**** **** **** 9012');
  });

  test('QE-8918 TS-002 TC-001: Verify available cards are displayed with error indicator when one or more card data sources are unavailable', async ({ page }) => {
    await page.route('**/api/cards/card2', route => route.abort());
    await loginPage.login('user_with_3_cards', 'password');
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.waitForCardListLoad();
    await expect(cardManagementPage.getCardElement(0)).toBeVisible();
    await expect(cardManagementPage.getCardElement(2)).toBeVisible();
    await expect(cardManagementPage.getCardErrorIndicator(1)).toBeVisible();
    const errorText = await cardManagementPage.getCardErrorText(1);
    expect(errorText).toContain('Card data could not be loaded');
    await expect(cardManagementPage.getCardRetryButton(1)).toBeVisible();
  });

  test('QE-8918 TS-003 TC-001: Verify system handles user with more than 10 credit cards with pagination or error message', async ({ page }) => {
    await loginPage.login('user_with_12_cards', 'password');
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.waitForCardListLoad();
    const cardCount = await cardManagementPage.getCardCount();
    if (cardCount === 10) {
      await expect(cardManagementPage.paginationControls).toBeVisible();
      await cardManagementPage.clickLoadMoreButton();
      const updatedCardCount = await cardManagementPage.getCardCount();
      expect(updatedCardCount).toBe(12);
    } else {
      await expect(cardManagementPage.errorMessage).toBeVisible();
      const errorText = await cardManagementPage.getErrorMessageText();
      expect(errorText).toContain('Maximum supported card limit (10) exceeded');
    }
  });

  test('QE-8919 TS-001 TC-001: Verify card-wise spend comparison displays spending amounts, utilization percentages, and spending patterns for multiple cards', async ({ page }) => {
    await loginPage.login('user_with_card_a_and_b', 'password');
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.clickCardWiseSpendAnalysisButton();
    await cardManagementPage.waitForComparisonViewLoad();
    const cardASpending = await cardManagementPage.getCardSpendingAmount(0);
    expect(cardASpending).toBe('$2,500');
    const cardBSpending = await cardManagementPage.getCardSpendingAmount(1);
    expect(cardBSpending).toBe('$1,200');
    const cardAUtilization = await cardManagementPage.getCardUtilizationPercent(0);
    expect(cardAUtilization).toBe('25%');
    const cardBUtilization = await cardManagementPage.getCardUtilizationPercent(1);
    expect(cardBUtilization).toBe('24%');
    await expect(cardManagementPage.getCardSpendingPatternSection(0)).toBeVisible();
    await expect(cardManagementPage.getCardSpendingPatternSection(1)).toBeVisible();
  });

  test('QE-8919 TS-002 TC-001: Verify notification when user with only one credit card attempts card-wise spend comparison', async ({ page }) => {
    await loginPage.login('user_with_1_card', 'password');
    await cardManagementPage.navigateToMyCards();
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(1);
    await cardManagementPage.clickCardWiseSpendAnalysisButton();
    await expect(cardManagementPage.notificationMessage).toBeVisible();
    const notificationText = await cardManagementPage.getNotificationText();
    expect(notificationText).toContain('Comparison requires at least two cards with transaction history');
    await expect(cardManagementPage.comparisonView).not.toBeVisible();
  });

  test('QE-8919 TS-003 TC-001: Verify error message when transaction data is incomplete or corrupted for card-wise spend analysis', async ({ page }) => {
    await page.route('**/api/transactions', route => route.fulfill({ status: 500, body: 'Data integrity error' }));
    await loginPage.login('user_with_2_cards', 'password');
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.clickCardWiseSpendAnalysisButton();
    await expect(cardManagementPage.errorMessage).toBeVisible();
    const errorText = await cardManagementPage.getErrorMessageText();
    expect(errorText).toContain('Analysis cannot be performed with invalid data');
    await expect(cardManagementPage.retryButton).toBeVisible();
  });
});

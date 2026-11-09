const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/card-management.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Card Management Tests', () => {
  let loginPage;
  let cardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardPage = new CardManagementPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
  });

  test('QE-8477 TS-001 TC-001 - Verify all credit cards are displayed with key details in multi-card interface', async ({ page }) => {
    await loginPage.logout();
    await loginPage.login('multicard@example.com', 'Test@1234');
    await cardPage.navigateToCards();
    await cardPage.waitForCardListLoad();
    await expect(cardPage.cardList).toBeVisible();
    const cardCount = await cardPage.getCardCount();
    expect(cardCount).toBeGreaterThan(0);
    const firstCard = await cardPage.getCardDetails(0);
    expect(firstCard.cardName).toBeDefined();
    expect(firstCard.limit).toBeDefined();
    expect(firstCard.balance).toBeDefined();
  });

  test('QE-8477 TS-002 TC-001 - Verify message when no credit cards are linked to account', async ({ page }) => {
    await loginPage.logout();
    await loginPage.login('nocards@example.com', 'Test@1234');
    await cardPage.navigateToCards();
    await cardPage.waitForCardListLoad();
    await expect(cardPage.noCardsMessage).toBeVisible();
    await expect(cardPage.noCardsMessage).toContainText('No credit cards are currently linked');
  });

  test('QE-8481 TS-001 TC-001 - Verify detailed spend analysis is displayed when selecting a specific credit card', async ({ page }) => {
    await cardPage.navigateToCards();
    await cardPage.waitForCardListLoad();
    await cardPage.selectCard(0);
    await cardPage.waitForCardDetailLoad();
    await expect(cardPage.spendAnalysisSection).toBeVisible();
    await expect(cardPage.categoryBreakdown).toBeVisible();
    await expect(cardPage.cardComparison).toBeVisible();
  });

  test('QE-8475 TS-001 TC-001 - Verify side-by-side spending comparison view for multiple credit cards', async ({ page }) => {
    await loginPage.logout();
    await loginPage.login('multicard@example.com', 'Test@1234');
    await cardPage.navigateToComparison();
    await cardPage.waitForComparisonLoad();
    await expect(cardPage.comparisonView).toBeVisible();
    await expect(cardPage.visualIndicators).toBeVisible();
    const comparedCards = await cardPage.getComparedCardCount();
    expect(comparedCards).toBeGreaterThanOrEqual(2);
  });

  test('QE-8475 TS-002 TC-001 - Verify error message when user with only one card attempts comparative analysis', async ({ page }) => {
    await loginPage.logout();
    await loginPage.login('singlecard@example.com', 'Test@1234');
    await cardPage.navigateToComparison();
    await cardPage.waitForComparisonLoad();
    await expect(cardPage.comparisonErrorMessage).toBeVisible();
    await expect(cardPage.comparisonErrorMessage).toContainText('Comparison requires at least two credit cards');
  });
});

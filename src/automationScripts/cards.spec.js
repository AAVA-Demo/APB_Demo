const { test, expect } = require('@playwright/test');
const { CardsPage } = require('./pages/cards.page');

test.describe('Credit Card Management - Multi-Card Display and Selection', () => {
  let cardsPage;

  test.beforeEach(async ({ page }) => {
    cardsPage = new CardsPage(page);
    await cardsPage.navigate();
  });

  test('QE-8924 TS-001 TC-001 - Verify system retrieves and displays 5 credit cards with relevant details within 500ms', async ({ page }) => {
    await cardsPage.login('testuser_5cards', 'Test@123');
    const startTime = Date.now();
    await cardsPage.navigateToMyCards();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(500);
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(5);
    const cardDetails = await cardsPage.getAllCardDetails();
    for (const card of cardDetails) {
      expect(card.maskedNumber).toMatch(/\*{4}\s\*{4}\s\*{4}\s\d{4}/);
      expect(card.cardholderName).toBeTruthy();
      expect(card.cardType).toMatch(/Visa|Mastercard|Amex/);
      expect(card.expiryDate).toMatch(/\d{2}\/\d{2}/);
    }
  });

  test('QE-8924 TS-002 TC-001 - Verify system successfully displays 10 credit cards (maximum) with spend summaries within 500ms', async ({ page }) => {
    await cardsPage.login('testuser_10cards', 'Test@123');
    const startTime = Date.now();
    await cardsPage.navigateToMyCards();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(500);
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(10);
    const cardDetails = await cardsPage.getAllCardDetails();
    for (const card of cardDetails) {
      expect(card.maskedNumber).toBeTruthy();
      expect(card.spendSummary).toContain('$');
    }
    const isInterfaceResponsive = await cardsPage.isInterfaceResponsive();
    expect(isInterfaceResponsive).toBe(true);
  });

  test('QE-8924 TS-003 TC-001 - Verify "No credit cards found" message when user has no registered cards', async ({ page }) => {
    await cardsPage.login('newuser_nocards', 'Test@123');
    await cardsPage.navigateToMyCards();
    const emptyStateMessage = await cardsPage.getEmptyStateMessage();
    expect(emptyStateMessage).toContain('No credit cards found');
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(0);
    const hasGuidance = await cardsPage.hasGuidanceMessage();
    expect(hasGuidance).toBe(true);
  });

  test('QE-8924 TS-003 TC-002 - Verify graceful empty state when card data service returns empty array', async ({ page }) => {
    await page.route('**/api/cards', route => {
      route.fulfill({ status: 200, body: JSON.stringify([]) });
    });
    await cardsPage.login('testuser_emptyarray', 'Test@123');
    await cardsPage.navigateToMyCards();
    const emptyStateMessage = await cardsPage.getEmptyStateMessage();
    expect(emptyStateMessage).toContain('No credit cards found');
    const hasErrorIndicators = await cardsPage.hasErrorIndicators();
    expect(hasErrorIndicators).toBe(false);
    const isAppStable = await cardsPage.isApplicationStable();
    expect(isAppStable).toBe(true);
  });

  test('QE-8928 TS-001 TC-001 - Verify card selection navigates to detail view with comprehensive information within 500ms', async ({ page }) => {
    await cardsPage.login('testuser_multicards', 'Test@123');
    await cardsPage.navigateToMyCards();
    const startTime = Date.now();
    await cardsPage.selectCard(0);
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(500);
    await expect(cardsPage.cardDetailView).toBeVisible();
    const detailData = await cardsPage.getCardDetailData();
    expect(detailData.maskedNumber).toMatch(/\*{4}\s\*{4}\s\*{4}\s\d{4}/);
    expect(detailData.creditLimit).toContain('$');
    expect(detailData.availableCredit).toContain('$');
    expect(detailData.outstandingAmount).toContain('$');
    expect(detailData.monthlySpend).toContain('$');
    expect(detailData.status).toMatch(/Active|Inactive/);
  });

  test('QE-8928 TS-002 TC-001 - Verify seamless card switching without data carryover between Card A and Card B', async ({ page }) => {
    await cardsPage.login('testuser_multicards', 'Test@123');
    await cardsPage.navigateToMyCards();
    await cardsPage.selectCard(0);
    const cardAData = await cardsPage.getCardDetailData();
    expect(cardAData.maskedNumber).toContain('1234');
    await cardsPage.navigateBackToCardList();
    await cardsPage.selectCard(1);
    const cardBData = await cardsPage.getCardDetailData();
    expect(cardBData.maskedNumber).toContain('5678');
    expect(cardBData.maskedNumber).not.toBe(cardAData.maskedNumber);
    expect(cardBData.creditLimit).not.toBe(cardAData.creditLimit);
    expect(cardBData.availableCredit).not.toBe(cardAData.availableCredit);
  });

  test('QE-8928 TS-003 TC-001 - Verify appropriate error message when attempting to select deactivated card', async ({ page }) => {
    await cardsPage.login('testuser_deactivated', 'Test@123');
    await cardsPage.navigateToMyCards();
    await page.route('**/api/cards/card-deactivated-001', route => {
      route.fulfill({ status: 404, body: JSON.stringify({ message: 'Card not found' }) });
    });
    await cardsPage.selectCardById('card-deactivated-001');
    const errorMessage = await cardsPage.getCardErrorMessage();
    expect(errorMessage).toContain('Card no longer available');
    expect(errorMessage).not.toContain('404');
    const hasBackButton = await cardsPage.hasBackToCardsButton();
    expect(hasBackButton).toBe(true);
    await cardsPage.navigateBackToCardList();
    const isCardRemoved = await cardsPage.isCardVisibleById('card-deactivated-001');
    expect(isCardRemoved).toBe(false);
  });
});
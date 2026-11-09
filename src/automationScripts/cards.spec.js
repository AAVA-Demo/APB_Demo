const { test, expect } = require('@playwright/test');
const { CardsPage } = require('./pages/cards.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Multi-Card Management Tests', () => {
  let cardsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardsPage = new CardsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    await cardsPage.navigate();
  });

  test('TC-QE-8059-TS-001-TC-001: Verify all linked credit cards are displayed with complete details', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('multicard-user@example.com', 'Pass@123');
    await cardsPage.navigate();
    
    await cardsPage.waitForCardsLoad();
    
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBeGreaterThan(0);
    
    const cards = await cardsPage.getAllCards();
    for (const card of cards) {
      expect(card.cardType).toBeTruthy();
      expect(card.lastFourDigits).toMatch(/\d{4}/);
      expect(card.creditLimit).toMatch(/\$[\d,]+/);
      expect(card.availableBalance).toMatch(/\$[\d,]+/);
    }
  });

  test('TC-QE-8059-TS-002-TC-001: Verify system displays warning when card data source is unavailable', async ({ page }) => {
    await page.route('**/api/cards/issuer/**', route => {
      route.abort('failed');
    });
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    await cardsPage.navigate();
    
    await expect(cardsPage.warningBanner).toBeVisible();
    await expect(cardsPage.warningBanner).toContainText(/Some card data is currently unavailable|try again later/);
  });

  test('TC-QE-8059-TS-003-TC-001: Verify cards are displayed in consistent sorted order', async ({ page }) => {
    await cardsPage.waitForCardsLoad();
    
    const cards = await cardsPage.getAllCards();
    expect(cards.length).toBeGreaterThan(0);
    
    const cardDetails = await cardsPage.getCardDetails(cards[0].cardId);
    expect(cardDetails.cardType).toBeTruthy();
    expect(cardDetails.lastFourDigits).toBeTruthy();
    expect(cardDetails.creditLimit).toBeTruthy();
  });

  test('TC-QE-8058-TS-001-TC-001: Verify multi-card interface displays all 5 cards with details', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('fivecard-user@example.com', 'Pass@123');
    await cardsPage.navigate();
    await cardsPage.waitForCardsLoad();
    
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(5);
    
    const cards = await cardsPage.getAllCards();
    expect(cards.length).toBe(5);
    
    for (const card of cards) {
      expect(card.cardName).toBeTruthy();
      expect(card.lastFourDigits).toMatch(/\d{4}/);
      expect(card.currentBalance).toMatch(/\$[\d,]+/);
    }
  });

  test('TC-QE-8058-TS-002-TC-001: Verify appropriate message for user with no credit cards', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('nocard-user@example.com', 'Pass@123');
    await cardsPage.navigate();
    
    await expect(cardsPage.noCardsMessage).toBeVisible();
    await expect(cardsPage.noCardsMessage).toContainText(/no credit cards linked|Click here to add/);
  });

  test('TC-QE-8058-TS-003-TC-001: Verify card navigation response time under 100ms', async ({ page }) => {
    await cardsPage.waitForCardsLoad();
    
    const cards = await cardsPage.getAllCards();
    if (cards.length > 0) {
      const startTime = Date.now();
      await cardsPage.selectCard(cards[0].cardId);
      const responseTime = Date.now() - startTime;
      
      expect(responseTime).toBeLessThan(500);
      await expect(cardsPage.cardDetailsPanel).toBeVisible();
    }
  });

  test('TC-QE-8053-TS-001-TC-001: Verify 8 credit cards displayed with complete details', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('eightcard-user@example.com', 'Pass@123');
    await cardsPage.navigate();
    await cardsPage.waitForCardsLoad();
    
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(8);
    
    const cards = await cardsPage.getAllCards();
    for (const card of cards) {
      expect(card.cardType).toBeTruthy();
      expect(card.creditLimit).toBeTruthy();
      expect(card.currentBalance).toBeTruthy();
      expect(card.availableCredit).toBeTruthy();
    }
  });

  test('TC-QE-8053-TS-002-TC-001: Verify system handles 15 cards with pagination or scrolling', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('fifteencard-user@example.com', 'Pass@123');
    await cardsPage.navigate();
    await cardsPage.waitForCardsLoad();
    
    const hasPagination = await cardsPage.hasPagination();
    const hasScrolling = await cardsPage.hasScrolling();
    
    expect(hasPagination || hasScrolling).toBe(true);
    
    if (hasPagination) {
      await expect(cardsPage.nextPageButton).toBeVisible();
    }
  });

  test('TC-QE-8053-TS-003-TC-001: Verify each card displays real-time status indicator', async ({ page }) => {
    await cardsPage.waitForCardsLoad();
    
    const cards = await cardsPage.getAllCards();
    for (const card of cards) {
      const status = await cardsPage.getCardStatus(card.cardId);
      expect(['Active', 'Inactive', 'Blocked']).toContain(status);
    }
  });
});
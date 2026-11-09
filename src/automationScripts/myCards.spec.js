const { test, expect } = require('@playwright/test');
const { MyCardsPage } = require('./pages/myCards.page');

// Test cases for QE-8979 (Multiple Credit Card Display)

test.describe('My Cards Display Tests', () => {
  let myCardsPage;

  test.beforeEach(async ({ page }) => {
    myCardsPage = new MyCardsPage(page);
    await myCardsPage.navigate();
  });

  // QE-8979 TS-001 TC-001: Verify consolidated list of multiple credit cards
  test('TC-5855: Verify consolidated list displays all credit cards with key details', async ({ page }) => {
    // Step 1-2: Navigate to My Cards (handled in beforeEach)
    await expect(myCardsPage.page).toHaveURL(/.*cards/);

    // Step 2: Verify user has multiple cards (mock data: 3 cards)
    const cardCount = await myCardsPage.getCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(3);

    // Step 3: My Cards page loads with consolidated list
    await expect(myCardsPage.cardList).toBeVisible();

    // Step 4-8: Verify each card tile displays required details
    const cards = await myCardsPage.getAllCards();
    
    for (const card of cards) {
      // Step 4: Verify masked card number
      const cardNumber = await card.getCardNumber();
      expect(cardNumber).toMatch(/\*{4}\s\*{4}\s\*{4}\s\d{4}/);

      // Step 5: Verify card type
      const cardType = await card.getCardType();
      expect(['Visa', 'MasterCard', 'Amex']).toContain(cardType);

      // Step 6: Verify credit limit
      const creditLimit = await card.getCreditLimit();
      expect(parseInt(creditLimit)).toBeGreaterThan(0);

      // Step 7: Verify available credit
      const availableCredit = await card.getAvailableCredit();
      expect(parseInt(availableCredit)).toBeGreaterThanOrEqual(0);

      // Step 8: Verify outstanding amount
      const outstandingAmount = await card.getOutstandingAmount();
      expect(parseInt(outstandingAmount)).toBeGreaterThanOrEqual(0);
    }
  });

  // QE-8979 TS-002 TC-001: Verify system supports 10+ cards without performance degradation
  test('TC-5856: Verify card management interface supports 10+ cards without performance issues', async ({ page }) => {
    // Step 1-2: Navigate to My Cards
    await myCardsPage.navigate();

    // Step 2: Mock scenario with 12 credit cards
    await page.route('**/cards', route => {
      const mockCards = [];
      for (let i = 1; i <= 12; i++) {
        mockCards.push({
          cardId: `CC${String(i).padStart(3, '0')}`,
          cardNumber: `**** **** **** ${1000 + i}`,
          cardType: i % 3 === 0 ? 'Amex' : i % 2 === 0 ? 'MasterCard' : 'Visa',
          creditLimit: 50000 + (i * 5000),
          availableCredit: 30000 + (i * 3000),
          outstandingAmount: 20000 + (i * 2000)
        });
      }
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCards)
      });
    });

    // Step 3: Navigate to My Cards
    await myCardsPage.navigate();

    // Step 4-6: Measure page load time
    const startTime = Date.now();
    await expect(myCardsPage.cardList).toBeVisible({ timeout: 5000 });
    const endTime = Date.now();
    const loadTime = (endTime - startTime) / 1000;

    // Verify page loads within 5 seconds (NFR requirement)
    expect(loadTime).toBeLessThan(5);

    // Step 5: Verify all 12 cards are displayed
    const cardCount = await myCardsPage.getCardCount();
    expect(cardCount).toBe(12);

    // Step 7: Verify all card details are complete
    const cards = await myCardsPage.getAllCards();
    expect(cards.length).toBe(12);
    
    for (const card of cards) {
      const cardNumber = await card.getCardNumber();
      expect(cardNumber).toBeDefined();
      expect(cardNumber.length).toBeGreaterThan(0);
    }
  });

  // QE-8979 TS-003 TC-001: Verify authentication failure prevents access
  test('TC-5857: Verify authentication failure displays error and prevents card data access', async ({ page }) => {
    // Step 1: Navigate to application
    await myCardsPage.navigate();

    // Step 2: Simulate authentication failure
    await page.route('**/user/auth', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Unauthorized', message: 'Invalid token or expired session' })
      });
    });

    // Step 3: Attempt to navigate to My Cards
    await myCardsPage.navigate();

    // Step 4: Verify error message is displayed
    await expect(myCardsPage.authErrorMessage).toBeVisible();
    await expect(myCardsPage.authErrorMessage).toContainText('Authentication failed');

    // Step 5: Verify no credit card data is displayed
    const cardListVisible = await myCardsPage.cardList.isVisible();
    expect(cardListVisible).toBe(false);

    // Step 6: Verify user is redirected to login or prompted to re-authenticate
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/login|auth/);
  });
});

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CardManagementPage } = require('./pages/cardManagement.page');

test.describe('Multiple Credit Card Display Tests', () => {
  let loginPage;
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    await loginPage.navigate();
  });

  test('QE-9969 TS-001 TC-001 - Verify all 5 registered credit cards are displayed with complete details within 3 seconds', async ({ page }) => {
    await loginPage.login('user5cards@demo.com', 'Test@123');
    const startTime = Date.now();
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.waitForCardListLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(5);
    const cards = await cardManagementPage.getAllCards();
    for (const card of cards) {
      await expect(card.cardName).toBeVisible();
      await expect(card.lastFourDigits).toBeVisible();
      await expect(card.currentBalance).toBeVisible();
      await expect(card.creditLimit).toBeVisible();
      await expect(card.status).toBeVisible();
    }
  });

  test('QE-9969 TS-002 TC-001 - Verify timeout error when loading 15 credit cards exceeds 3-second performance requirement', async ({ page }) => {
    await loginPage.login('user15cards@demo.com', 'Test@123');
    await page.route('**/api/cards**', route => {
      setTimeout(() => route.fulfill({
        status: 200,
        body: JSON.stringify({ cards: [] })
      }), 4000);
    });
    const startTime = Date.now();
    await cardManagementPage.navigateToCardManagement();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeGreaterThan(3000);
    await expect(cardManagementPage.errorMessage).toBeVisible();
    const errorText = await cardManagementPage.getErrorMessage();
    expect(errorText).toMatch(/timeout|unable to load/i);
  });

  test('QE-9969 TS-003 TC-001 - Verify appropriate empty state message when user has no registered credit cards', async ({ page }) => {
    await loginPage.login('usernocards@demo.com', 'Test@123');
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.waitForCardListLoad();
    await expect(cardManagementPage.emptyStateMessage).toBeVisible();
    const emptyMessage = await cardManagementPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No cards found');
    await expect(cardManagementPage.errorMessage).not.toBeVisible();
    await expect(page.locator('body')).not.toHaveCSS('background-color', 'rgb(255, 255, 255)');
  });
});

test.describe('Card-Wise Spend Analysis Tests', () => {
  let loginPage;
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    await loginPage.navigate();
  });

  test('QE-9970 TS-001 TC-001 - Verify detailed spending information for a selected credit card with multiple categories', async ({ page }) => {
    await loginPage.login('testuser@demo.com', 'Test@123');
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.waitForCardListLoad();
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(3);
    await cardManagementPage.selectCard('c1');
    await cardManagementPage.waitForCardDetailLoad();
    const totalSpend = await cardManagementPage.getTotalSpend();
    expect(totalSpend).toBe('₹15,420');
    const categoryBreakdown = await cardManagementPage.getCategoryBreakdown();
    expect(categoryBreakdown['Food & Dining']).toBe('₹4,500');
    expect(categoryBreakdown['Fuel']).toBe('₹3,200');
    expect(categoryBreakdown['Shopping']).toBe('₹5,720');
    expect(categoryBreakdown['Entertainment']).toBe('₹2,000');
    const contributionPercentage = await cardManagementPage.getContributionPercentage();
    expect(contributionPercentage).toMatch(/\d+%/);
  });

  test('QE-9970 TS-002 TC-001 - Verify appropriate message is displayed for a card with zero transaction history', async ({ page }) => {
    await loginPage.login('testuser@demo.com', 'Test@123');
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.waitForCardListLoad();
    await cardManagementPage.selectCard('c4');
    await cardManagementPage.waitForCardDetailLoad();
    await expect(cardManagementPage.noDataMessage).toBeVisible();
    const noDataText = await cardManagementPage.getNoDataMessage();
    expect(noDataText).toContain('No spending data available for analysis');
    await expect(cardManagementPage.errorMessage).not.toBeVisible();
  });

  test('QE-9970 TS-003 TC-001 - Verify validation error when accessing card-wise spend analysis with invalid card ID', async ({ page }) => {
    await loginPage.login('testuser@demo.com', 'Test@123');
    await page.goto('https://creditcard.demo.com/cards/invalid-card-999');
    await expect(cardManagementPage.validationError).toBeVisible();
    const errorText = await cardManagementPage.getValidationError();
    expect(errorText).toMatch(/card not found|invalid card id/i);
    await page.waitForURL('**/cards');
    expect(page.url()).toContain('/cards');
  });
});
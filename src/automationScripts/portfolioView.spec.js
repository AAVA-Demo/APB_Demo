const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Portfolio View Tests - QE-10614', () => {

  test('QE-10614 TS-001 TC-001: Verify portfolio view with 3+ cards shows complete details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Login with 3-card user
    await loginPage.navigate();
    await loginPage.login('user_3cards', 'Pass@123');

    // Step 2: Verify all cards are displayed
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(3);

    // Step 3: Verify each card displays complete details
    const cards = await dashboardPage.getAllCardDetails();
    for (const card of cards) {
      expect(card.cardName).toBeTruthy();
      expect(card.lastFourDigits).toMatch(/\*\*\*\*\d{4}/);
      expect(card.creditLimit).toBeTruthy();
      expect(card.availableCredit).toBeTruthy();
      expect(card.outstandingAmount).toBeTruthy();
    }

    // Step 4: Verify portfolio summaries
    const portfolioSummary = await dashboardPage.getPortfolioSummary();
    expect(portfolioSummary.totalCreditLimit).toBeTruthy();
    expect(portfolioSummary.totalAvailableCredit).toBeTruthy();
    expect(portfolioSummary.totalOutstanding).toBeTruthy();

    // Step 5: Verify calculations are accurate
    const calculatedTotal = cards.reduce((sum, card) => sum + parseFloat(card.creditLimit.replace(/[^0-9.-]+/g, '')), 0);
    const displayedTotal = parseFloat(portfolioSummary.totalCreditLimit.replace(/[^0-9.-]+/g, ''));
    expect(Math.abs(calculatedTotal - displayedTotal)).toBeLessThan(1);
  });

  test('QE-10614 TS-001 TC-002: Verify portfolio displays monthly spend for each card', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('user_3cards', 'Pass@123');

    // Step 2: Navigate to portfolio view
    await dashboardPage.waitForDashboardToLoad();

    // Step 3: Verify each card displays monthly spend
    const cards = await dashboardPage.getAllCardDetails();
    for (const card of cards) {
      expect(card.monthlySpend).toBeTruthy();
    }

    // Step 4: Verify total monthly spend
    const totalMonthlySpend = await dashboardPage.getTotalMonthlySpend();
    expect(totalMonthlySpend).toBeTruthy();
    const calculatedTotal = cards.reduce((sum, card) => sum + parseFloat(card.monthlySpend.replace(/[^0-9.-]+/g, '')), 0);
    const displayedTotal = parseFloat(totalMonthlySpend.replace(/[^0-9.-]+/g, ''));
    expect(Math.abs(calculatedTotal - displayedTotal)).toBeLessThan(1);
  });

  test('QE-10614 TS-002 TC-001: Verify message when user has no registered cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Login with no-cards user
    await loginPage.navigate();
    await loginPage.login('new_user_no_cards', 'Pass@123');

    // Step 2: Verify no cards message
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const messageText = await dashboardPage.getNoCardsMessageText();
    expect(messageText).toContain('no registered credit cards');

    // Step 3: Verify add card button is displayed
    await expect(dashboardPage.addCardButton).toBeVisible();

    // Step 4: Verify no card details or summaries are displayed
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(0);
    await expect(dashboardPage.portfolioSummary).not.toBeVisible();
  });

  test('QE-10614 TS-003 TC-001: Verify responsive layout on mobile devices', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await loginPage.navigate();

    // Step 2: Login
    await loginPage.login('user_3cards', 'Pass@123');

    // Step 3: Verify single-column layout
    const layout = await dashboardPage.getCardLayoutType();
    expect(layout).toBe('single-column');
    await expect(dashboardPage.cardContainer).toBeVisible();

    // Step 4: Verify portfolio summaries are visible and readable
    await expect(dashboardPage.portfolioSummary).toBeVisible();
    const summaryText = await dashboardPage.getPortfolioSummaryText();
    expect(summaryText).toBeTruthy();

    // Step 5: Verify all cards are accessible by scrolling
    const allCardsAccessible = await dashboardPage.verifyAllCardsAccessible();
    expect(allCardsAccessible).toBe(true);
  });

  test('QE-10614 TS-003 TC-002: Verify responsive layout on tablet devices', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await loginPage.navigate();

    // Step 2: Login
    await loginPage.login('user_3cards', 'Pass@123');

    // Step 3: Verify two-column layout
    const layout = await dashboardPage.getCardLayoutType();
    expect(layout).toBe('two-column');

    // Step 4: Verify portfolio summaries are properly formatted
    await expect(dashboardPage.portfolioSummary).toBeVisible();
    const isFormatted = await dashboardPage.verifyPortfolioSummaryFormatting();
    expect(isFormatted).toBe(true);
  });

  test('QE-10614 TS-003 TC-003: Verify responsive layout on desktop devices', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginPage.navigate();

    // Step 2: Login
    await loginPage.login('user_3cards', 'Pass@123');

    // Step 3: Verify multi-column layout
    const layout = await dashboardPage.getCardLayoutType();
    expect(layout).toBe('multi-column');

    // Step 4: Verify portfolio summaries are prominent
    await expect(dashboardPage.portfolioSummary).toBeVisible();
    const isProminent = await dashboardPage.verifyPortfolioSummaryProminence();
    expect(isProminent).toBe(true);
  });

});
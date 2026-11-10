const { test, expect } = require('@playwright/test');
const { MultiCardPage } = require('./pages/multiCard.page');

test.describe('Multi-Card Management and Card-Wise Spend Analysis Tests', () => {

  test('QE-10610 TS-001 TC-001: Verify multi-card management interface retrieves and displays all 5 credit cards with complete details within 1 second', async ({ page }) => {
    const multiCardPage = new MultiCardPage(page);
    await multiCardPage.navigate();
    await multiCardPage.login('testuser_5cards', 'Pass@123');
    const startTime = Date.now();
    await multiCardPage.navigateToMyCards();
    await multiCardPage.waitForCardsToLoad();
    const endTime = Date.now();
    const loadTime = (endTime - startTime) / 1000;
    expect(loadTime).toBeLessThanOrEqual(1);
    const cardCount = await multiCardPage.getCardCount();
    expect(cardCount).toBe(5);
    const firstCard = await multiCardPage.getCardDetails(0);
    expect(firstCard.name).toBeTruthy();
    expect(firstCard.number).toMatch(/\*{4}/);
    expect(firstCard.type).toBeTruthy();
    expect(firstCard.creditLimit).toBeGreaterThan(0);
    expect(firstCard.availableCredit).toBeGreaterThanOrEqual(0);
    expect(firstCard.outstandingAmount).toBeGreaterThanOrEqual(0);
  });

  test('QE-10610 TS-002 TC-001: Verify multi-card management interface displays informational message and guidance when user has no credit cards', async ({ page }) => {
    const multiCardPage = new MultiCardPage(page);
    await multiCardPage.navigate();
    await multiCardPage.login('testuser_nocards', 'Pass@123');
    await multiCardPage.navigateToMyCards();
    await expect(multiCardPage.noCardsMessage).toBeVisible();
    const messageText = await multiCardPage.getNoCardsMessageText();
    expect(messageText).toContain('No credit cards found');
    expect(messageText).toContain('Please add a card to get started');
    await expect(multiCardPage.addCardGuidance).toBeVisible();
    const cardCount = await multiCardPage.getCardCount();
    expect(cardCount).toBe(0);
  });

  test('QE-10610 TS-003 TC-001: Verify system displays 9 successfully retrieved cards with error indicator for 1 failed card without blocking the interface', async ({ page }) => {
    const multiCardPage = new MultiCardPage(page);
    await page.route('**/api/cards/card10/details', route => route.abort('failed'));
    await multiCardPage.navigate();
    await multiCardPage.login('testuser_10cards', 'Pass@123');
    await multiCardPage.navigateToMyCards();
    await multiCardPage.waitForCardsToLoad();
    const cardCount = await multiCardPage.getCardCount();
    expect(cardCount).toBe(9);
    await expect(multiCardPage.errorIndicator).toBeVisible();
    const errorText = await multiCardPage.getErrorIndicatorText();
    expect(errorText).toContain('Unable to load card details');
    const isInteractive = await multiCardPage.isInterfaceInteractive();
    expect(isInteractive).toBe(true);
  });

  test('QE-10609 TS-001 TC-001: Verify card-specific spend analysis displays monthly trends and detailed spending exclusively for the selected card', async ({ page }) => {
    const multiCardPage = new MultiCardPage(page);
    await multiCardPage.navigate();
    await multiCardPage.login('testuser_multicard', 'Pass@123');
    await multiCardPage.navigateToMyCards();
    await multiCardPage.selectCard('Visa Gold - **** 1234');
    await expect(multiCardPage.selectedCardDetails).toBeVisible();
    await expect(multiCardPage.monthlySpendTrendsSection).toBeVisible();
    const trendData = await multiCardPage.getMonthlyTrendData();
    expect(trendData.length).toBeGreaterThan(0);
    await expect(multiCardPage.detailedSpendingAnalysis).toBeVisible();
    const categoryBreakdown = await multiCardPage.getCategoryBreakdown();
    expect(categoryBreakdown.length).toBeGreaterThan(0);
    await multiCardPage.selectCard('MasterCard Platinum - **** 5678');
    await expect(multiCardPage.selectedCardDetails).toBeVisible();
    const newTrendData = await multiCardPage.getMonthlyTrendData();
    expect(newTrendData).not.toEqual(trendData);
  });

  test('QE-10609 TS-002 TC-001: Verify system displays appropriate message when selected card has no transaction history', async ({ page }) => {
    const multiCardPage = new MultiCardPage(page);
    await multiCardPage.navigate();
    await multiCardPage.login('testuser_newcard', 'Pass@123');
    await multiCardPage.navigateToMyCards();
    await multiCardPage.selectCard('New Card - **** 9999');
    await expect(multiCardPage.noSpendingDataMessage).toBeVisible();
    const messageText = await multiCardPage.getNoSpendingDataMessageText();
    expect(messageText).toContain('No spending data available for this card');
    await expect(multiCardPage.emptyTrendChart).toBeVisible();
    const chartText = await multiCardPage.getEmptyTrendChartText();
    expect(chartText).toContain('No data to display');
  });

  test('QE-10609 TS-003 TC-001: Verify complete 12-month spend trend chart displays accurate monthly totals for selected card', async ({ page }) => {
    const multiCardPage = new MultiCardPage(page);
    await multiCardPage.navigate();
    await multiCardPage.login('testuser_12months', 'Pass@123');
    await multiCardPage.navigateToMyCards();
    await multiCardPage.selectCard('Visa Signature - **** 4567');
    await expect(multiCardPage.monthlySpendTrendsSection).toBeVisible();
    const trendData = await multiCardPage.getMonthlyTrendData();
    expect(trendData.length).toBe(12);
    const expectedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const actualMonths = trendData.map(d => d.month);
    expectedMonths.forEach(month => {
      expect(actualMonths).toContain(month);
    });
    trendData.forEach(data => {
      expect(data.totalSpend).toBeGreaterThan(0);
    });
    await expect(multiCardPage.trendChart).toBeVisible();
  });

});
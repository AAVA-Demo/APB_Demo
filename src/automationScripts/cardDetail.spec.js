const { test, expect } = require('@playwright/test');
const { CardDetailPage } = require('./pages/cardDetail.page');
const { MyCardsPage } = require('./pages/myCards.page');

// Test cases for QE-8978 (Card-Wise Spend Analysis)

test.describe('Card Detail and Spend Analysis Tests', () => {
  let cardDetailPage;
  let myCardsPage;

  test.beforeEach(async ({ page }) => {
    cardDetailPage = new CardDetailPage(page);
    myCardsPage = new MyCardsPage(page);
  });

  // QE-8978 TS-001 TC-001: Verify detailed spend analysis for selected card
  test('TC-5858: Verify detailed spend analysis and 12-month trend chart for selected card', async ({ page }) => {
    // Step 1-2: Navigate to My Cards
    await myCardsPage.navigate();
    await expect(myCardsPage.page).toHaveURL(/.*cards/);

    // Step 2: Verify user has transactions on multiple cards (mock data)
    const cardCount = await myCardsPage.getCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(3);

    // Step 3: My Cards page loads
    await expect(myCardsPage.cardList).toBeVisible();

    // Step 4: Click on Card A (first card)
    await myCardsPage.selectCard('CC001');

    // Verify card detail page loads
    await expect(cardDetailPage.page).toHaveURL(/.*cards\/CC001/);

    // Step 5: Verify monthly spend amount is displayed
    const monthlySpend = await cardDetailPage.getMonthlySpend();
    expect(monthlySpend).toBe('5000');

    // Step 6: Verify 12-month trend chart is displayed
    await expect(cardDetailPage.trendChart).toBeVisible();
    const trendData = await cardDetailPage.getTrendData();
    expect(trendData.length).toBe(12);

    // Step 7: Verify chart displays correct month labels and amounts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    trendData.forEach((dataPoint, index) => {
      expect(dataPoint.month).toContain(months[index]);
      expect(dataPoint.amount).toBeDefined();
      expect(parseInt(dataPoint.amount)).toBeGreaterThanOrEqual(0);
    });
  });

  // QE-8978 TS-002 TC-001: Verify zero spend for card with no transactions
  test('TC-5859: Verify spend analysis displays zero for card with no transactions', async ({ page }) => {
    // Step 1-2: Navigate to My Cards
    await myCardsPage.navigate();

    // Step 2: Mock card with no transactions (Card D)
    await page.route('**/transactions/spending', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          cardId: 'CC004',
          monthlySpend: 0,
          monthlyTrends: Array(12).fill({ month: 'N/A', amount: 0 })
        }])
      });
    });

    // Step 3: My Cards page loads
    await expect(myCardsPage.cardList).toBeVisible();

    // Step 4: Click on Card D
    await myCardsPage.selectCard('CC004');

    // Step 5: Verify monthly spend displays zero
    const monthlySpend = await cardDetailPage.getMonthlySpend();
    expect(monthlySpend).toBe('0');

    // Step 6: Verify trend chart is empty or flat-line
    await expect(cardDetailPage.trendChart).toBeVisible();
    const trendData = await cardDetailPage.getTrendData();
    const allZero = trendData.every(point => parseInt(point.amount) === 0);
    expect(allZero).toBe(true);

    // Alternative: Check for no data message
    const noDataMessage = await cardDetailPage.noDataMessage.isVisible();
    if (noDataMessage) {
      await expect(cardDetailPage.noDataMessage).toContainText('No transaction data available');
    }

    // Step 7: Verify no error message and graceful handling
    await expect(cardDetailPage.errorMessage).not.toBeVisible();
  });

  // QE-8978 TS-003 TC-001: Verify 12-month trend chart accuracy for consistent spending
  test('TC-5860: Verify 12-month trend chart accurately reflects consistent monthly spending', async ({ page }) => {
    // Step 1-2: Navigate to My Cards
    await myCardsPage.navigate();

    // Step 2: Mock card with consistent spending (Card E: 4000/month)
    await page.route('**/transactions/spending', route => {
      const monthNames = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024',
                         'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024'];
      const trends = monthNames.map(month => ({ month, amount: 4000 }));
      
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          cardId: 'CC005',
          monthlySpend: 4000,
          monthlyTrends: trends
        }])
      });
    });

    // Step 3: My Cards page loads
    await expect(myCardsPage.cardList).toBeVisible();

    // Step 4: Click on Card E
    await myCardsPage.selectCard('CC005');

    // Step 5: Verify 12-month trend chart is displayed
    await expect(cardDetailPage.trendChart).toBeVisible();
    const trendData = await cardDetailPage.getTrendData();
    expect(trendData.length).toBe(12);

    // Step 6: Verify correct month labels
    const expectedMonths = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024',
                           'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024'];
    trendData.forEach((dataPoint, index) => {
      expect(dataPoint.month).toBe(expectedMonths[index]);
    });

    // Step 7: Verify each month displays 4000
    trendData.forEach(dataPoint => {
      expect(parseInt(dataPoint.amount)).toBe(4000);
    });

    // Step 8: Verify trend line is flat (minimal variation)
    const amounts = trendData.map(point => parseInt(point.amount));
    const maxAmount = Math.max(...amounts);
    const minAmount = Math.min(...amounts);
    expect(maxAmount - minAmount).toBeLessThanOrEqual(100); // Allow minimal variation
  });
});

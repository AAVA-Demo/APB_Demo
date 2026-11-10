const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { TrendAnalysisPage } = require('./pages/trendAnalysis.page');

test.describe('Monthly Spend Trends and Card-wise Analysis', () => {
  let loginPage;
  let trendPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    trendPage = new TrendAnalysisPage(page);
    await loginPage.navigate();
  });

  test('QE-10469 TS-001 TC-001 - Verify monthly spend trend visualization displays complete 12-month data', async ({ page }) => {
    // Step 1: Launch and authenticate
    await loginPage.login('testuser_12months', 'Pass@123');
    
    // Step 2-3: Navigate to Monthly Spend Trends
    await trendPage.navigate();
    await trendPage.navigateToMonthlyTrends();
    
    // Step 4: Verify 12 months displayed
    const months = await trendPage.getTrendMonths();
    expect(months).toHaveLength(12);
    
    // Verify month labels
    for (const month of months) {
      expect(month).toMatch(/[A-Za-z]{3}\s\d{4}/);
    }
    
    // Step 5: Verify MoM percentages
    const momComparisons = await trendPage.getMoMComparisons();
    expect(momComparisons.length).toBeGreaterThanOrEqual(11);
    
    for (const mom of momComparisons) {
      expect(mom).toMatch(/[+-]?\d+(\.\d+)?%/);
    }
    
    // Step 6: Verify spending totals match aggregations
    const chartTotals = await trendPage.getMonthlySpendTotals();
    expect(chartTotals.length).toBe(12);
    
    for (const total of chartTotals) {
      expect(total).toBeGreaterThan(0);
    }
  });

  test('QE-10469 TS-002 TC-001 - Verify system displays notification when user has only 3 months of history', async ({ page }) => {
    // Step 1: Launch application
    await loginPage.login('testuser_3months', 'Pass@123');
    
    // Step 2-3: Navigate to Monthly Spend Trends
    await trendPage.navigate();
    await trendPage.navigateToMonthlyTrends();
    
    // Step 4: Verify notification
    await expect(trendPage.insufficientDataNotification).toBeVisible();
    await expect(trendPage.insufficientDataNotification).toContainText('Insufficient historical data');
    await expect(trendPage.insufficientDataNotification).toContainText('Only 3 months of data available');
    
    // Step 5: Verify only 3 months displayed
    const months = await trendPage.getTrendMonths();
    expect(months).toHaveLength(3);
    
    // Step 6: Verify MoM comparisons for available months
    const momComparisons = await trendPage.getMoMComparisons();
    expect(momComparisons.length).toBeLessThanOrEqual(2);
  });

  test('QE-10469 TS-003 TC-001 - Verify system correctly identifies high growth months', async ({ page }) => {
    // Step 1: Authenticate
    await loginPage.login('testuser_varied', 'Pass@123');
    
    // Step 2: Navigate to Monthly Spend Trends
    await trendPage.navigate();
    await trendPage.navigateToMonthlyTrends();
    
    // Step 3-4: Identify high growth months (>10% increase)
    const highGrowthMonths = await trendPage.getHighGrowthMonths();
    
    for (const month of highGrowthMonths) {
      await expect(trendPage.getMonthIndicator(month)).toContainText(/High Growth/);
      await expect(trendPage.getMonthIndicator(month)).toHaveClass(/high-growth|growth-indicator/);
      
      const momChange = await trendPage.getMoMChange(month);
      expect(momChange).toBeGreaterThan(10);
    }
    
    // Step 5-6: Identify reduced spending months (>10% decrease)
    const reducedSpendingMonths = await trendPage.getReducedSpendingMonths();
    
    for (const month of reducedSpendingMonths) {
      await expect(trendPage.getMonthIndicator(month)).toContainText(/Reduced Spending/);
      await expect(trendPage.getMonthIndicator(month)).toHaveClass(/reduced-spending|decline-indicator/);
      
      const momChange = await trendPage.getMoMChange(month);
      expect(momChange).toBeLessThan(-10);
    }
    
    // Step 7: Verify stable months have no special label
    const stableMonths = await trendPage.getStableMonths();
    
    for (const month of stableMonths) {
      const indicator = await trendPage.getMonthIndicator(month).textContent();
      expect(indicator).not.toContain('High Growth');
      expect(indicator).not.toContain('Reduced Spending');
    }
  });

  test('QE-10466 TS-001 TC-001 - Verify card-wise analysis displays accurate spending breakdown', async ({ page }) => {
    // Step 1: Authenticate
    await loginPage.login('testuser_3activecards', 'Pass@123');
    
    // Step 2: Navigate to Card-wise Analysis
    await trendPage.navigate();
    await trendPage.navigateToCardwiseAnalysis();
    
    // Step 3-6: Verify spending amounts and percentages
    await expect(trendPage.getCardSpendingAmount('Card A')).toHaveText('₹25,000');
    await expect(trendPage.getCardSpendingPercentage('Card A')).toHaveText('45%');
    
    await expect(trendPage.getCardSpendingAmount('Card B')).toHaveText('₹18,000');
    await expect(trendPage.getCardSpendingPercentage('Card B')).toHaveText('32%');
    
    await expect(trendPage.getCardSpendingAmount('Card C')).toHaveText('₹12,000');
    await expect(trendPage.getCardSpendingPercentage('Card C')).toHaveText('23%');
    
    // Step 7: Verify percentages sum to 100%
    const totalPercentage = await trendPage.getTotalCardPercentage();
    expect(totalPercentage).toBeCloseTo(100, 1);
    
    // Step 8: Verify usage distribution metrics
    const usageMetrics = await trendPage.getUsageDistributionMetrics();
    expect(usageMetrics).toBeDefined();
  });

  test('QE-10466 TS-002 TC-001 - Verify system excludes inactive card from analysis', async ({ page }) => {
    // Step 1: Authenticate
    await loginPage.login('testuser_inactivecard', 'Pass@123');
    
    // Step 2: Navigate to Card-wise Analysis
    await trendPage.navigate();
    await trendPage.navigateToCardwiseAnalysis();
    
    // Step 3: Verify notification about inactive card
    await expect(trendPage.inactiveCardNotification).toBeVisible();
    await expect(trendPage.inactiveCardNotification).toContainText('Card ending in 1234 is inactive and excluded from analysis');
    
    // Step 4: Verify inactive card not in breakdown
    const cards = await trendPage.getDisplayedCards();
    expect(cards).toHaveLength(2);
    expect(cards).not.toContain('1234');
    
    // Step 5: Verify percentages calculated from active cards only
    const totalPercentage = await trendPage.getTotalCardPercentage();
    expect(totalPercentage).toBeCloseTo(100, 1);
    
    // Step 6: Verify total spending excludes inactive card
    const totalSpending = await trendPage.getTotalSpending();
    const activeCardsTotal = await trendPage.getActiveCardsTotalSpending();
    expect(totalSpending).toBe(activeCardsTotal);
  });

  test('QE-10466 TS-003 TC-001 - Verify system displays spending amount and transaction frequency rankings', async ({ page }) => {
    // Step 1: Authenticate
    await loginPage.login('testuser_freqanalysis', 'Pass@123');
    
    // Step 2: Navigate to Card-wise Analysis
    await trendPage.navigate();
    await trendPage.navigateToCardwiseAnalysis();
    
    // Step 3-5: Verify transaction counts
    await expect(trendPage.getCardTransactionCount('Card A')).toHaveText('45');
    await expect(trendPage.getCardTransactionCount('Card B')).toHaveText('28');
    await expect(trendPage.getCardTransactionCount('Card C')).toHaveText('15');
    
    // Step 6: Verify spending amount ranking
    const spendingRanking = await trendPage.getSpendingRanking();
    expect(spendingRanking[0].card).toBe('Card A');
    expect(spendingRanking[1].card).toBe('Card B');
    expect(spendingRanking[2].card).toBe('Card C');
    
    // Step 7: Verify transaction frequency ranking
    const frequencyRanking = await trendPage.getFrequencyRanking();
    expect(frequencyRanking[0].card).toBe('Card A');
    expect(frequencyRanking[0].count).toBe(45);
    
    // Step 8: Verify Card A identified as most frequently used
    await expect(trendPage.mostFrequentCardIndicator).toBeVisible();
    await expect(trendPage.mostFrequentCardIndicator).toContainText('Card A');
    await expect(trendPage.mostFrequentCardIndicator).toContainText(/Most Frequently Used|Highest Transaction Count/);
    
    // Step 9: Verify insights/recommendations
    const insights = await trendPage.getOptimizationInsights();
    expect(insights).toBeDefined();
  });
});
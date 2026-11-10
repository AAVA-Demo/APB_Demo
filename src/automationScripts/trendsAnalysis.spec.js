const { test, expect } = require('@playwright/test');
const { TrendsAnalysisPage } = require('./pages/trendsAnalysis.page');

// Test Case ID: 6992 - QE-9863 TS-001 TC-001
test('TC-6992: Verify card-wise analysis displays comparative bar chart with spending metrics for 3 active cards', async ({ page }) => {
  const trendsPage = new TrendsAnalysisPage(page);
  
  // Step 1: Launch application
  await trendsPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Navigate to Card-wise Analysis section
  await trendsPage.navigateToCardwiseAnalysis();
  await expect(trendsPage.barChart).toBeVisible();
  
  // Step 3: Verify 3 active credit cards are displayed
  const cardNames = await trendsPage.getCardNamesInChart();
  expect(cardNames).toHaveLength(3);
  expect(cardNames).toContain('Visa Gold');
  expect(cardNames).toContain('MasterCard Platinum');
  expect(cardNames).toContain('Amex Blue');
  
  // Step 4: Verify comparative bar chart displays total spending per card
  const visaSpending = await trendsPage.getCardTotalSpending('Visa Gold');
  expect(visaSpending).toBe('$5,000.00');
  const mastercardSpending = await trendsPage.getCardTotalSpending('MasterCard Platinum');
  expect(mastercardSpending).toBe('$7,000.00');
  const amexSpending = await trendsPage.getCardTotalSpending('Amex Blue');
  expect(amexSpending).toBe('$4,500.00');
  
  // Step 5: Verify transaction count is displayed for each card
  const visaCount = await trendsPage.getCardTransactionCount('Visa Gold');
  expect(visaCount).toBe(45);
  const mastercardCount = await trendsPage.getCardTransactionCount('MasterCard Platinum');
  expect(mastercardCount).toBe(52);
  const amexCount = await trendsPage.getCardTransactionCount('Amex Blue');
  expect(amexCount).toBe(38);
  
  // Step 6: Verify average transaction value is displayed
  const visaAvg = await trendsPage.getCardAverageTransactionValue('Visa Gold');
  expect(visaAvg).toBe('$111.11');
  const mastercardAvg = await trendsPage.getCardAverageTransactionValue('MasterCard Platinum');
  expect(mastercardAvg).toBe('$134.62');
  const amexAvg = await trendsPage.getCardAverageTransactionValue('Amex Blue');
  expect(amexAvg).toBe('$118.42');
});

// Test Case ID: 6993 - QE-9863 TS-002 TC-001
test('TC-6993: Verify system displays notification when user has only one card', async ({ page }) => {
  const trendsPage = new TrendsAnalysisPage(page);
  
  // Step 1: Launch application
  await trendsPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Verify user has only one active credit card
  const activeCardCount = await trendsPage.getActiveCardCountFromDashboard();
  expect(activeCardCount).toBe(1);
  const cardNames = await trendsPage.getActiveCardNamesFromDashboard();
  expect(cardNames).toContain('Visa Gold');
  
  // Step 3: Navigate to Card-wise Analysis section
  await trendsPage.navigateToCardwiseAnalysis();
  
  // Step 4: Verify notification message is displayed
  await expect(trendsPage.insufficientCardsMessage).toBeVisible();
  const messageText = await trendsPage.insufficientCardsMessage.textContent();
  expect(messageText).toContain('Comparative analysis requires at least 2 cards with transaction history');
  
  // Step 5: Verify suggestion to add another card
  await expect(trendsPage.addAnotherCardButton).toBeVisible();
  
  // Step 6: Verify comparative bar chart is not displayed
  await expect(trendsPage.barChart).not.toBeVisible();
});

// Test Case ID: 6994 - QE-9863 TS-003 TC-001
test('TC-6994: Verify card-wise comparison updates dynamically when user applies date range filter', async ({ page }) => {
  const trendsPage = new TrendsAnalysisPage(page);
  
  // Step 1: Launch application
  await trendsPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Navigate to Card-wise Analysis section
  await trendsPage.navigateToCardwiseAnalysis();
  await expect(trendsPage.barChart).toBeVisible();
  
  // Step 3: Note initial all-time totals
  const visaInitial = await trendsPage.getCardTotalSpending('Visa Gold');
  expect(visaInitial).toBe('$15,000.00');
  const mastercardInitial = await trendsPage.getCardTotalSpending('MasterCard Platinum');
  expect(mastercardInitial).toBe('$20,000.00');
  const amexInitial = await trendsPage.getCardTotalSpending('Amex Blue');
  expect(amexInitial).toBe('$12,000.00');
  
  // Step 4: Apply date range filter
  await trendsPage.applyDateRangeFilter('2024-01-01', '2024-03-31');
  await trendsPage.waitForChartUpdate();
  
  // Step 5: Verify bar chart updates with filtered data
  const visaFiltered = await trendsPage.getCardTotalSpending('Visa Gold');
  expect(visaFiltered).toBe('$3,500.00');
  const mastercardFiltered = await trendsPage.getCardTotalSpending('MasterCard Platinum');
  expect(mastercardFiltered).toBe('$4,200.00');
  const amexFiltered = await trendsPage.getCardTotalSpending('Amex Blue');
  expect(amexFiltered).toBe('$2,800.00');
  
  // Step 6: Verify transaction counts are recalculated
  const visaCount = await trendsPage.getCardTransactionCount('Visa Gold');
  expect(visaCount).toBe(28);
  const mastercardCount = await trendsPage.getCardTransactionCount('MasterCard Platinum');
  expect(mastercardCount).toBe(35);
  const amexCount = await trendsPage.getCardTransactionCount('Amex Blue');
  expect(amexCount).toBe(22);
  
  // Step 7: Verify average transaction values are recalculated
  const visaAvg = await trendsPage.getCardAverageTransactionValue('Visa Gold');
  expect(visaAvg).toBe('$125.00');
  const mastercardAvg = await trendsPage.getCardAverageTransactionValue('MasterCard Platinum');
  expect(mastercardAvg).toBe('$120.00');
  const amexAvg = await trendsPage.getCardAverageTransactionValue('Amex Blue');
  expect(amexAvg).toBe('$127.27');
});

// Test Case ID: 6998 - QE-9861 TS-001 TC-001
test('TC-6998: Verify trends dashboard displays line chart with accurate monthly spending totals for past 12 months', async ({ page }) => {
  const trendsPage = new TrendsAnalysisPage(page);
  
  // Step 1: Launch application
  await trendsPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Verify user has 12 months of transaction history
  const hasEnoughHistory = await trendsPage.verifyTransactionHistory(12);
  expect(hasEnoughHistory).toBe(true);
  
  // Step 3: Navigate to Trends Dashboard section
  await trendsPage.navigateToTrendsDashboard();
  await expect(trendsPage.lineChart).toBeVisible();
  
  // Step 4: Verify line chart displays 12 data points
  const dataPointCount = await trendsPage.getMonthlyDataPointCount();
  expect(dataPointCount).toBe(12);
  const monthLabels = await trendsPage.getMonthLabels();
  expect(monthLabels).toContain('Jan 2023');
  expect(monthLabels).toContain('Dec 2023');
  
  // Step 5: Verify each data point displays accurate monthly spending
  const janSpending = await trendsPage.getMonthlySpending('Jan 2023');
  expect(janSpending).toBe('$2,500.00');
  const decSpending = await trendsPage.getMonthlySpending('Dec 2023');
  expect(decSpending).toBe('$4,200.00');
  
  // Step 6: Verify trend trajectory line is displayed
  await expect(trendsPage.trendLine).toBeVisible();
  
  // Step 7: Verify trend calculations show overall trajectory
  const trendIndicator = await trendsPage.getTrendIndicator();
  expect(trendIndicator).toContain('Increasing');
});

// Test Case ID: 6999 - QE-9861 TS-002 TC-001
test('TC-6999: Verify system displays notification when user has insufficient transaction history', async ({ page }) => {
  const trendsPage = new TrendsAnalysisPage(page);
  
  // Step 1: Launch application
  await trendsPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Verify user has less than 3 months of history
  const monthsOfHistory = await trendsPage.getMonthsOfTransactionHistory();
  expect(monthsOfHistory).toBeLessThan(3);
  
  // Step 3: Navigate to Trends Dashboard section
  await trendsPage.navigateToTrendsDashboard();
  
  // Step 4: Verify notification message is displayed
  await expect(trendsPage.insufficientDataMessage).toBeVisible();
  const messageText = await trendsPage.insufficientDataMessage.textContent();
  expect(messageText).toContain('Insufficient data is available to generate meaningful trend analysis');
  
  // Step 5: Verify recommendation to check back
  const recommendationText = await trendsPage.dataRecommendationMessage.textContent();
  expect(recommendationText).toContain('Please check back after more transaction history accumulates');
  expect(recommendationText).toContain('minimum 3 months recommended');
  
  // Step 6: Verify line chart is not displayed or shows limited data
  const isChartVisible = await trendsPage.lineChart.isVisible();
  if (isChartVisible) {
    await expect(trendsPage.insufficientDataDisclaimer).toBeVisible();
  }
});

// Test Case ID: 7000 - QE-9861 TS-003 TC-001
test('TC-7000: Verify trends dashboard identifies and highlights seasonal spending patterns', async ({ page }) => {
  const trendsPage = new TrendsAnalysisPage(page);
  
  // Step 1: Launch application
  await trendsPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Navigate to Trends Dashboard section
  await trendsPage.navigateToTrendsDashboard();
  await expect(trendsPage.lineChart).toBeVisible();
  
  // Step 3: Verify December is identified as high-spending month
  const decemberHighlight = await trendsPage.isMonthHighlighted('December');
  expect(decemberHighlight).toBe(true);
  const decemberSpending = await trendsPage.getMonthlySpending('Dec 2023');
  expect(decemberSpending).toBe('$4,200.00');
  
  // Step 4: Verify February is identified as low-spending month
  const februaryHighlight = await trendsPage.isMonthHighlighted('February');
  expect(februaryHighlight).toBe(true);
  const februarySpending = await trendsPage.getMonthlySpending('Feb 2023');
  expect(februarySpending).toBe('$2,200.00');
  
  // Step 5: Verify month-over-month percentage change is displayed
  const febChange = await trendsPage.getMonthOverMonthChange('Feb 2023');
  expect(febChange).toBe('-12%');
  const decChange = await trendsPage.getMonthOverMonthChange('Dec 2023');
  expect(decChange).toBe('+16.7%');
  
  // Step 6: Verify visual indicators distinguish increases from decreases
  const febIndicator = await trendsPage.getChangeIndicatorType('Feb 2023');
  expect(febIndicator).toBe('decrease');
  const decIndicator = await trendsPage.getChangeIndicatorType('Dec 2023');
  expect(decIndicator).toBe('increase');
  
  // Step 7: Verify seasonal pattern summary is displayed
  await expect(trendsPage.seasonalPatternInsight).toBeVisible();
  const insightText = await trendsPage.seasonalPatternInsight.textContent();
  expect(insightText).toContain('Seasonal Pattern Detected');
  expect(insightText).toContain('Higher spending in December');
  expect(insightText).toContain('lower in February');
});
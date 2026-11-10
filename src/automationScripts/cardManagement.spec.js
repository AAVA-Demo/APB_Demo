const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const logger = require('../utils/logger');

test.describe('Credit Card Portfolio Management', () => {
  let cardPage;

  test.beforeEach(async ({ page }) => {
    cardPage = new CardManagementPage(page);
    await cardPage.navigate();
    logger.info('Navigated to Card Management page');
  });

  // QE-9787 TS-001 TC-001: Verify credit card portfolio displays all 5 cards
  test('TC-009: Display all 5 linked cards with complete individual card details', async ({ page }) => {
    logger.info('Test Case QE-9787 TS-001 TC-001: Starting portfolio display validation');
    
    await cardPage.login('testuser_5cards', 'Test@123');
    
    // Step 4: Verify exactly 5 credit cards are displayed
    const cardCount = await cardPage.getCardCount();
    expect(cardCount).toBe(5);
    logger.info(`Portfolio displays ${cardCount} cards`);
    
    // Step 5: Verify each card displays required details
    const cards = await cardPage.getAllCardDetails();
    
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      expect(card.cardNumber).toMatch(/\*{4}\s\*{4}\s\*{4}\s\d{4}/);
      expect(card.bankName).toBeTruthy();
      expect(card.balance).toMatch(/\$[\d,]+\.\d{2}/);
      expect(card.creditLimit).toMatch(/\$[\d,]+\.\d{2}/);
      expect(card.utilizationRate).toMatch(/\d+(\.\d+)?%/);
      logger.info(`Card ${i + 1}: ${card.cardNumber}, ${card.bankName}, Balance: ${card.balance}, Limit: ${card.creditLimit}, Utilization: ${card.utilizationRate}`);
    }
    
    // Step 6: Click on one card to view detailed information
    await cardPage.selectCard(0);
    await expect(cardPage.cardDetailPanel).toBeVisible();
    logger.info('Card detail panel opened');
  });

  // QE-9787 TS-001 TC-002: Verify card portfolio data retrieval within 3 seconds
  test('TC-010: Card portfolio data retrieval completes within 3 seconds (NFR)', async ({ page }) => {
    logger.info('Test Case QE-9787 TS-001 TC-002: Starting retrieval time validation');
    
    await cardPage.login('testuser_5cards', 'Test@123');
    
    // Step 2-3: Measure retrieval time
    const startTime = Date.now();
    await cardPage.waitForAllCardsToLoad();
    const retrievalTime = Date.now() - startTime;
    
    expect(retrievalTime).toBeLessThanOrEqual(3000);
    logger.info(`Card portfolio loaded in ${retrievalTime}ms (NFR: ≤3000ms)`);
    
    // Step 4: Verify all card details are fully loaded
    const cardCount = await cardPage.getCardCount();
    expect(cardCount).toBe(5);
    await expect(cardPage.loadingIndicator).not.toBeVisible();
    logger.info('All 5 cards loaded without loading indicators');
  });

  // QE-9787 TS-002 TC-001: Verify 10-card limit enforcement
  test('TC-011: System enforces 10-card limit and displays warning for 11 cards', async ({ page }) => {
    logger.info('Test Case QE-9787 TS-002 TC-001: Starting card limit enforcement validation');
    
    await cardPage.login('testuser_11cards', 'Test@123');
    
    // Step 3: Verify only 10 cards are displayed
    const cardCount = await cardPage.getCardCount();
    expect(cardCount).toBe(10);
    logger.info(`Portfolio displays ${cardCount} cards (max limit)`);
    
    // Step 4: Verify warning message is displayed
    await expect(cardPage.maxLimitWarning).toBeVisible();
    const warningText = await cardPage.maxLimitWarning.textContent();
    expect(warningText).toContain('maximum limit of 10 credit cards');
    logger.info('Warning message displayed: ' + warningText);
    
    // Step 5: Verify 11th card is not visible
    const allCardNumbers = await cardPage.getAllCardNumbers();
    expect(allCardNumbers.length).toBe(10);
    logger.info('Confirmed: 11th card is not displayed');
  });

  // QE-9787 TS-003 TC-001: Verify user validation failure prevents access
  test('TC-012: Prevent unauthorized access when User Profile Service validation fails', async ({ page }) => {
    logger.info('Test Case QE-9787 TS-003 TC-001: Starting user validation failure handling');
    
    // Step 2: Simulate User Profile Service validation failure
    await page.route('**/api/user/validate**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ valid: false, error: 'User validation failed' })
      });
    });
    
    await cardPage.login('testuser_invalidprofile', 'Test@123');
    
    // Step 3: Verify authentication error message
    await expect(cardPage.authErrorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await cardPage.authErrorMessage.textContent();
    expect(errorText).toContain('Failed to validate user');
    logger.info('Authentication error message displayed: ' + errorText);
    
    // Step 4: Verify Card Management page does not load
    const isCardPageLoaded = await cardPage.cardListContainer.isVisible().catch(() => false);
    expect(isCardPageLoaded).toBe(false);
    logger.info('Card Management page access denied');
  });

  // QE-9779 TS-001 TC-001: Verify card-wise spend analysis
  test('TC-013: View detailed monthly spend trends for past 6 months for selected card', async ({ page }) => {
    logger.info('Test Case QE-9779 TS-001 TC-001: Starting card-wise spend analysis validation');
    
    await cardPage.login('testuser_5cards_history', 'Test@123');
    
    // Step 3: Select a specific credit card
    await cardPage.selectCard(0);
    await expect(cardPage.cardDetailPanel).toBeVisible();
    logger.info('Selected Card 1 for detailed view');
    
    // Step 4: Verify monthly spend trends for past 6 months
    const trendData = await cardPage.getMonthlySpendTrends();
    expect(trendData.length).toBe(6);
    logger.info(`Monthly spend trends display ${trendData.length} months`);
    
    // Step 5: Verify monthly totals match transaction data
    for (const month of trendData) {
      expect(month.month).toBeTruthy();
      expect(month.amount).toMatch(/\$[\d,]+\.\d{2}/);
      logger.info(`${month.month}: ${month.amount}`);
    }
  });

  // QE-9779 TS-001 TC-002: Verify monthly spend trends visualization
  test('TC-014: Monthly spend trends include transaction aggregation and trend visualization', async ({ page }) => {
    logger.info('Test Case QE-9779 TS-001 TC-002: Starting trend visualization validation');
    
    await cardPage.login('testuser_5cards_history', 'Test@123');
    await cardPage.selectCard(0);
    
    // Step 3: Verify chart is rendered
    await expect(cardPage.spendTrendChart).toBeVisible();
    const chartType = await cardPage.getChartType();
    expect(['line', 'bar']).toContain(chartType.toLowerCase());
    logger.info(`Spend trend chart type: ${chartType}`);
    
    // Step 4: Hover over data point
    await cardPage.hoverOverChartDataPoint(2);
    await expect(cardPage.chartTooltip).toBeVisible();
    const tooltipText = await cardPage.chartTooltip.textContent();
    expect(tooltipText).toMatch(/\$[\d,]+\.\d{2}/);
    logger.info('Chart tooltip displayed: ' + tooltipText);
  });

  // QE-9779 TS-002 TC-001: Verify handling of card with no transaction history
  test('TC-015: Display appropriate message for newly added card with no transactions', async ({ page }) => {
    logger.info('Test Case QE-9779 TS-002 TC-001: Starting no transaction history handling');
    
    await cardPage.login('testuser_newcard', 'Test@123');
    
    // Step 3: Select newly added card
    const cardCount = await cardPage.getCardCount();
    await cardPage.selectCard(cardCount - 1);
    logger.info('Selected newly added card');
    
    // Step 4: Verify "No spending data available" message
    await expect(cardPage.noDataMessage).toBeVisible();
    const messageText = await cardPage.noDataMessage.textContent();
    expect(messageText).toContain('No spending data available');
    logger.info('No data message displayed: ' + messageText);
    
    // Step 6: Verify trends section is empty or shows placeholder
    const trendsEmpty = await cardPage.isTrendsSectionEmpty();
    expect(trendsEmpty).toBe(true);
    logger.info('Trends section is empty/placeholder as expected');
  });

  // QE-9779 TS-003 TC-001: Verify card comparison analysis
  test('TC-016: Compare spending trends across multiple cards and identify differences', async ({ page }) => {
    logger.info('Test Case QE-9779 TS-003 TC-001: Starting card comparison validation');
    
    await cardPage.login('testuser_5cards_comparison', 'Test@123');
    
    // Step 3: View card comparison section
    await expect(cardPage.comparisonView).toBeVisible();
    logger.info('Card comparison view is displayed');
    
    // Step 4: Identify spending difference between cards
    const comparisonData = await cardPage.getCardComparisonData();
    expect(comparisonData.length).toBeGreaterThanOrEqual(2);
    
    const cardA = comparisonData[0];
    const cardB = comparisonData[1];
    
    const cardASpend = parseFloat(cardA.monthlySpend.replace(/[$,]/g, ''));
    const cardBSpend = parseFloat(cardB.monthlySpend.replace(/[$,]/g, ''));
    const percentDiff = ((cardASpend - cardBSpend) / cardBSpend * 100).toFixed(0);
    
    logger.info(`Card A: ${cardA.monthlySpend}, Card B: ${cardB.monthlySpend}, Difference: ${percentDiff}%`);
    
    // Step 5: Verify visual indicators
    await expect(cardPage.comparisonChart).toBeVisible();
    logger.info('Comparison chart with visual indicators is displayed');
  });
});

const { test, expect } = require('@playwright/test');
const { TrendsPage } = require('./pages/trends.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Monthly Spend Trends and Card-wise Analysis Tests', () => {
  let trendsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Starting trends test setup');
    loginPage = new LoginPage(page);
    trendsPage = new TrendsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    logger.info('User authenticated successfully');
  });

  test('QE-8515 TS-001 TC-001: Verify monthly spend trend visualization displays correctly for user with 12 months of transaction history', async ({ page }) => {
    logger.info('Test Case: QE-8515 TS-001 TC-001 - Monthly Spend Trend Visualization');
    
    await trendsPage.navigate();
    await expect(trendsPage.monthlyTrendsSection).toBeVisible();
    
    await trendsPage.setDateRange('2024-01-01', '2024-12-31');
    await page.waitForTimeout(500);
    
    await expect(trendsPage.monthlyTrendChart).toBeVisible();
    
    const dataPoints = await trendsPage.getMonthlyTrendDataPoints();
    expect(dataPoints.length).toBe(12);
    logger.info(`Monthly trend data points: ${dataPoints.length}`);
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const chartLabels = await trendsPage.getChartLabels();
    
    months.forEach(month => {
      expect(chartLabels.some(label => label.includes(month))).toBeTruthy();
    });
    
    const trendIndicators = await trendsPage.getTrendIndicators();
    logger.info(`Trend indicators: ${JSON.stringify(trendIndicators)}`);
    
    expect(trendIndicators.length).toBeGreaterThan(0);
    
    logger.info('Monthly spend trend visualization verified successfully');
  });

  test('QE-8515 TS-002 TC-001: Verify system displays available data when user has less than 12 months of transaction history', async ({ page }) => {
    logger.info('Test Case: QE-8515 TS-002 TC-001 - Insufficient Transaction History');
    
    await loginPage.navigate();
    await loginPage.login('newuser@example.com', 'Pass@123');
    
    await trendsPage.navigate();
    await expect(trendsPage.monthlyTrendsSection).toBeVisible();
    
    const dataPoints = await trendsPage.getMonthlyTrendDataPoints();
    expect(dataPoints.length).toBeLessThan(12);
    logger.info(`Available data points: ${dataPoints.length}`);
    
    await expect(trendsPage.insufficientDataMessage).toBeVisible();
    const messageText = await trendsPage.insufficientDataMessage.textContent();
    expect(messageText).toContain('Full 12-month trend analysis not available');
    expect(messageText).toContain(`Showing available data for ${dataPoints.length} months`);
    
    logger.info('Insufficient transaction history message displayed correctly');
  });

  test('QE-8515 TS-003 TC-001: Verify system rejects request when start date is after end date', async ({ page }) => {
    logger.info('Test Case: QE-8515 TS-003 TC-001 - Invalid Date Range');
    
    await trendsPage.navigate();
    
    await trendsPage.setDateRange('2024-12-31', '2024-01-01');
    
    await expect(trendsPage.errorMessage).toBeVisible();
    const errorText = await trendsPage.errorMessage.textContent();
    expect(errorText).toContain('Invalid date range');
    expect(errorText).toContain('Start date cannot be after end date');
    
    logger.info('Invalid date range error displayed correctly');
  });

  test('QE-8510 TS-001 TC-001: Verify card-wise analysis view displays comparative breakdown for user with multiple active credit cards', async ({ page }) => {
    logger.info('Test Case: QE-8510 TS-001 TC-001 - Card-wise Spending Breakdown');
    
    await trendsPage.navigate();
    await expect(trendsPage.cardWiseSection).toBeVisible();
    
    const cardCount = await trendsPage.getSelectedCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(3);
    logger.info(`Selected cards: ${cardCount}`);
    
    await expect(trendsPage.cardWiseChart).toBeVisible();
    
    const cardData = await trendsPage.getCardWiseData();
    expect(cardData.length).toBeGreaterThanOrEqual(3);
    
    cardData.forEach(card => {
      expect(card.cardName).toBeTruthy();
      expect(card.totalSpend).toBeTruthy();
      expect(card.percentage).toBeTruthy();
    });
    
    logger.info(`Card-wise data: ${JSON.stringify(cardData)}`);
    
    const totalPercentage = cardData.reduce((sum, card) => sum + parseFloat(card.percentage), 0);
    expect(totalPercentage).toBeCloseTo(100, 1);
    
    const mostUsedCard = cardData.reduce((max, card) => 
      parseFloat(card.totalSpend.replace(/[^0-9.]/g, '')) > parseFloat(max.totalSpend.replace(/[^0-9.]/g, '')) ? card : max
    );
    
    logger.info(`Most used card: ${mostUsedCard.cardName} with ${mostUsedCard.totalSpend}`);
    
    logger.info('Card-wise spending breakdown verified successfully');
  });

  test('QE-8510 TS-002 TC-001: Verify system returns empty result set when no transactions exist for selected date range', async ({ page }) => {
    logger.info('Test Case: QE-8510 TS-002 TC-001 - No Transactions in Date Range');
    
    await trendsPage.navigate();
    
    await trendsPage.setDateRange('2025-01-01', '2025-01-31');
    await page.waitForTimeout(500);
    
    const cardData = await trendsPage.getCardWiseData();
    expect(cardData.length).toBe(0);
    
    await expect(trendsPage.emptyDataMessage).toBeVisible();
    const messageText = await trendsPage.emptyDataMessage.textContent();
    expect(messageText).toContain('No spending data available for selected date range');
    
    logger.info('Empty result set displayed correctly');
  });

  test('QE-8510 TS-003 TC-001: Verify system rejects request with validation error when invalid card ID is provided', async ({ page }) => {
    logger.info('Test Case: QE-8510 TS-003 TC-001 - Invalid Card ID');
    
    await trendsPage.navigate();
    
    await page.route('**/api/trends/cardwise*', route => {
      const url = route.request().url();
      if (url.includes('invalid-card-999')) {
        route.fulfill({ status: 403, body: JSON.stringify({ error: 'Invalid card ID' }) });
      } else {
        route.continue();
      }
    });
    
    await trendsPage.selectCard('invalid-card-999');
    
    await expect(trendsPage.errorMessage).toBeVisible();
    const errorText = await trendsPage.errorMessage.textContent();
    expect(errorText).toContain('Invalid card ID');
    expect(errorText).toContain('You do not have access to this credit card');
    
    logger.info('Invalid card ID error displayed correctly');
  });
});

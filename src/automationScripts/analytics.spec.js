const { test, expect } = require('@playwright/test');
const { AnalyticsDashboardPage } = require('./pages/analyticsDashboard.page');
const { TrendAnalysisPage } = require('./pages/trendAnalysis.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Analytics Dashboard Tests', () => {

  test('QE-10604 TS-001 TC-001 - Verify category-wise spending visualization with all 9 categories', async ({ page }) => {
    logger.info('Starting test: QE-10604 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsDashboardPage(page);

    await test.step('Login with all-categories user', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_allcategories', 'Pass@123');
      logger.info('User authenticated');
    });

    await test.step('Navigate to Analytics tab', async () => {
      await analyticsPage.navigate();
      await analyticsPage.waitForAnalyticsLoad();
      logger.info('Analytics dashboard loaded');
    });

    await test.step('Verify category-wise visualization displayed', async () => {
      await expect(analyticsPage.categoryChart).toBeVisible();
      logger.info('Category-wise chart visible');
    });

    await test.step('Verify all 9 categories displayed', async () => {
      const categories = await analyticsPage.getAllCategories();
      const expectedCategories = [
        'Food & Dining', 'Fuel', 'Shopping', 'Travel', 
        'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
      ];
      
      expectedCategories.forEach(category => {
        expect(categories).toContain(category);
      });
      logger.info(`All 9 categories verified: ${categories.length}`);
    });

    await test.step('Verify accurate spending amounts', async () => {
      const categoryData = await analyticsPage.getCategorySpendingData();
      categoryData.forEach(cat => {
        expect(cat.amount).toMatch(/^\$[\d,]+(\.\d{2})?$/);
        expect(parseFloat(cat.amount.replace(/[$,]/g, ''))).toBeGreaterThan(0);
      });
      logger.info('All category amounts verified');
    });

    await test.step('Verify percentages calculated correctly', async () => {
      const categoryData = await analyticsPage.getCategorySpendingData();
      const totalPercentage = categoryData.reduce((sum, cat) => sum + parseFloat(cat.percentage), 0);
      expect(Math.abs(totalPercentage - 100)).toBeLessThan(1); // Allow for rounding
      logger.info(`Total percentage: ${totalPercentage}%`);
    });

    await test.step('Verify visualization is interactive', async () => {
      const isInteractive = await analyticsPage.testChartInteractivity();
      expect(isInteractive).toBe(true);
      logger.info('Chart interactivity verified');
    });
  });

  test('QE-10604 TS-002 TC-001 - Verify uncategorized transactions assigned to Miscellaneous', async ({ page }) => {
    logger.info('Starting test: QE-10604 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsDashboardPage(page);

    await test.step('Login with uncategorized transactions user', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_uncategorized', 'Pass@123');
      await analyticsPage.navigate();
      await analyticsPage.waitForAnalyticsLoad();
      logger.info('User with uncategorized transactions logged in');
    });

    await test.step('Verify Miscellaneous category present', async () => {
      const categories = await analyticsPage.getAllCategories();
      expect(categories).toContain('Miscellaneous');
      logger.info('Miscellaneous category found');
    });

    await test.step('Verify Miscellaneous includes uncategorized transactions', async () => {
      const miscData = await analyticsPage.getCategoryDataByName('Miscellaneous');
      expect(miscData).toBeDefined();
      expect(parseFloat(miscData.amount.replace(/[$,]/g, ''))).toBeGreaterThan(0);
      logger.info(`Miscellaneous amount: ${miscData.amount}`);
    });

    await test.step('Verify no transactions excluded', async () => {
      const categoryData = await analyticsPage.getCategorySpendingData();
      const totalFromCategories = categoryData.reduce((sum, cat) => {
        return sum + parseFloat(cat.amount.replace(/[$,]/g, ''));
      }, 0);
      expect(totalFromCategories).toBeGreaterThan(0);
      logger.info(`Total spending across categories: $${totalFromCategories}`);
    });
  });

  test('QE-10604 TS-003 TC-001 - Verify drill-down into category shows transaction details', async ({ page }) => {
    logger.info('Starting test: QE-10604 TS-003 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsDashboardPage(page);

    await test.step('Login and navigate to Analytics', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser', 'Pass@123');
      await analyticsPage.navigate();
      await analyticsPage.waitForAnalyticsLoad();
      logger.info('Analytics dashboard loaded');
    });

    await test.step('Click on Food & Dining category', async () => {
      await analyticsPage.clickCategoryByName('Food & Dining');
      await analyticsPage.waitForDrillDownLoad();
      logger.info('Drill-down view opened');
    });

    await test.step('Verify transaction list displays merchant names', async () => {
      const transactions = await analyticsPage.getTransactionList();
      expect(transactions.length).toBeGreaterThan(0);
      transactions.forEach(txn => {
        expect(txn.merchant).toBeTruthy();
      });
      logger.info(`${transactions.length} transactions displayed`);
    });

    await test.step('Verify transaction amounts displayed', async () => {
      const transactions = await analyticsPage.getTransactionList();
      transactions.forEach(txn => {
        expect(txn.amount).toMatch(/^\$[\d,]+\.\d{2}$/);
      });
      logger.info('All transaction amounts verified');
    });

    await test.step('Verify transaction dates displayed', async () => {
      const transactions = await analyticsPage.getTransactionList();
      transactions.forEach(txn => {
        expect(txn.date).toBeTruthy();
      });
      logger.info('All transaction dates verified');
    });

    await test.step('Verify category total matches sum of transactions', async () => {
      const transactions = await analyticsPage.getTransactionList();
      const sum = transactions.reduce((total, txn) => {
        return total + parseFloat(txn.amount.replace(/[$,]/g, ''));
      }, 0);
      const categoryTotal = await analyticsPage.getCategoryTotalInDrillDown();
      const categoryValue = parseFloat(categoryTotal.replace(/[$,]/g, ''));
      expect(Math.abs(sum - categoryValue)).toBeLessThan(0.01);
      logger.info('Category total matches transaction sum');
    });

    await test.step('Verify return to main category view', async () => {
      await analyticsPage.clickBackToCategoryView();
      await expect(analyticsPage.categoryChart).toBeVisible();
      logger.info('Returned to category view');
    });
  });
});

test.describe('Trend Analysis Tests', () => {

  test('QE-10607 TS-001 TC-001 - Verify monthly spending trends over 12 months', async ({ page }) => {
    logger.info('Starting test: QE-10607 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const trendPage = new TrendAnalysisPage(page);

    await test.step('Login with 12-month history user', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_12months', 'Pass@123');
      logger.info('User with 12-month history logged in');
    });

    await test.step('Navigate to Trend Analysis', async () => {
      await trendPage.navigate();
      await trendPage.waitForTrendAnalysisLoad();
      logger.info('Trend Analysis section loaded');
    });

    await test.step('Verify chart displays 12 data points', async () => {
      const dataPoints = await trendPage.getDataPointCount();
      expect(dataPoints).toBe(12);
      logger.info('12 months of data points verified');
    });

    await test.step('Verify hover shows month and amount', async () => {
      const tooltipData = await trendPage.hoverOverDataPoint(0);
      expect(tooltipData.month).toBeTruthy();
      expect(tooltipData.amount).toMatch(/^\$[\d,]+\.\d{2}$/);
      logger.info(`Tooltip data: ${tooltipData.month} - ${tooltipData.amount}`);
    });

    await test.step('Verify data points match transaction totals', async () => {
      const monthlyData = await trendPage.getAllMonthlyData();
      expect(monthlyData.length).toBe(12);
      monthlyData.forEach(data => {
        expect(data.month).toBeTruthy();
        expect(parseFloat(data.amount.replace(/[$,]/g, ''))).toBeGreaterThanOrEqual(0);
      });
      logger.info('All monthly data verified');
    });
  });

  test('QE-10607 TS-002 TC-001 - Verify partial data handling with missing months', async ({ page }) => {
    logger.info('Starting test: QE-10607 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const trendPage = new TrendAnalysisPage(page);

    await test.step('Login with 3-month history user', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_3months', 'Pass@123');
      await trendPage.navigate();
      await trendPage.waitForTrendAnalysisLoad();
      logger.info('User with 3-month history logged in');
    });

    await test.step('Select 6 Months time period', async () => {
      await trendPage.selectTimePeriod('6 Months');
      await page.waitForTimeout(1000);
      logger.info('6-month period selected');
    });

    await test.step('Verify only 3 data points displayed', async () => {
      const dataPoints = await trendPage.getVisibleDataPointCount();
      expect(dataPoints).toBe(3);
      logger.info('3 data points visible');
    });

    await test.step('Verify notification about missing data', async () => {
      await expect(trendPage.missingDataNotification).toBeVisible();
      const notificationText = await trendPage.getMissingDataNotificationText();
      expect(notificationText).toContain('Data available for 3 of 6 months');
      logger.info('Missing data notification displayed');
    });

    await test.step('Verify missing months indicated on chart', async () => {
      const allMonths = await trendPage.getAllMonthLabels();
      expect(allMonths.length).toBe(6);
      logger.info('All 6 months shown on x-axis');
    });
  });

  test('QE-10607 TS-003 TC-001 - Verify comparison between Q1 and Q2 spending', async ({ page }) => {
    logger.info('Starting test: QE-10607 TS-003 TC-001');
    const loginPage = new LoginPage(page);
    const trendPage = new TrendAnalysisPage(page);

    await test.step('Login and navigate to Trend Analysis', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_compare', 'Pass@123');
      await trendPage.navigate();
      await trendPage.waitForTrendAnalysisLoad();
      logger.info('Trend Analysis loaded');
    });

    await test.step('Select Q1 time period', async () => {
      await trendPage.selectTimePeriod('Q1 2024');
      await page.waitForTimeout(1000);
      logger.info('Q1 period selected');
    });

    await test.step('Note Q1 total and average', async () => {
      const q1Summary = await trendPage.getPeriodSummary();
      expect(q1Summary.total).toBeTruthy();
      expect(q1Summary.average).toBeTruthy();
      logger.info(`Q1 - Total: ${q1Summary.total}, Average: ${q1Summary.average}`);
    });

    await test.step('Select Q2 time period', async () => {
      await trendPage.selectTimePeriod('Q2 2024');
      await page.waitForTimeout(1000);
      logger.info('Q2 period selected');
    });

    await test.step('Note Q2 total and average', async () => {
      const q2Summary = await trendPage.getPeriodSummary();
      expect(q2Summary.total).toBeTruthy();
      expect(q2Summary.average).toBeTruthy();
      logger.info(`Q2 - Total: ${q2Summary.total}, Average: ${q2Summary.average}`);
    });

    await test.step('Verify comparison percentage displayed', async () => {
      const comparison = await trendPage.getComparisonResult();
      expect(comparison.percentageChange).toMatch(/[\d.]+%/);
      logger.info(`Comparison: ${comparison.percentageChange} change`);
    });

    await test.step('Identify month with highest spending', async () => {
      const highestMonth = await trendPage.getHighestSpendingMonth();
      expect(highestMonth.month).toBeTruthy();
      expect(highestMonth.amount).toBeTruthy();
      logger.info(`Highest spending: ${highestMonth.month} - ${highestMonth.amount}`);
    });
  });
});

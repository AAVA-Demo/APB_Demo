const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Analytics and Spending Insights Tests', () => {

  test('QE-8881 TS-001 TC-001 - Verify monthly spend trend chart with 12 months history', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await analyticsPage.navigate();

    await analyticsPage.waitForTrendChart();
    const dataPointCount = await analyticsPage.getTrendChartDataPointCount();
    await expect(dataPointCount).toBe(12);

    const expectedMonths = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024'];
    const expectedAmounts = [3200, 2950, 4100, 3750, 4500, 3900, 4200, 3850, 4600, 4100, 4350, 4250];

    for (let i = 0; i < expectedMonths.length; i++) {
      const monthLabel = await analyticsPage.getTrendChartMonthLabel(i);
      await expect(monthLabel).toBe(expectedMonths[i]);

      const amount = await analyticsPage.getTrendChartAmount(i);
      await expect(amount).toBe(expectedAmounts[i]);
    }
  });

  test('QE-8881 TS-002 TC-001 - Verify interactive monthly spend trend chart with hover details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await analyticsPage.navigate();

    await analyticsPage.waitForTrendChart();
    await analyticsPage.hoverOverDataPoint(2);

    await analyticsPage.waitForTooltip();
    const tooltipAmount = await analyticsPage.getTooltipAmount();
    await expect(tooltipAmount).toBe('$4100');

    const tooltipMonth = await analyticsPage.getTooltipMonth();
    await expect(tooltipMonth).toBe('March 2024');

    const percentageChange = await analyticsPage.getTooltipPercentageChange();
    await expect(percentageChange).toBe('+38.98%');

    await analyticsPage.hoverOverDataPoint(11);
    await analyticsPage.waitForTooltip();
    const decTooltipAmount = await analyticsPage.getTooltipAmount();
    await expect(decTooltipAmount).toBe('$4250');

    const decPercentageChange = await analyticsPage.getTooltipPercentageChange();
    await expect(decPercentageChange).toBe('-2.30%');
  });

  test('QE-8881 TS-003 TC-001 - Verify monthly trend with insufficient data message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('newuser456', 'Pass@123');
    await analyticsPage.navigate();

    await analyticsPage.waitForTrendChart();
    const dataPointCount = await analyticsPage.getTrendChartDataPointCount();
    await expect(dataPointCount).toBe(2);

    const insufficientDataMessage = await analyticsPage.getInsufficientDataMessage();
    await expect(insufficientDataMessage).toContain('Insufficient data for comprehensive trend analysis');
  });

  test('QE-8876 TS-001 TC-001 - Verify category-wise spending across all nine categories', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await analyticsPage.navigate();

    await analyticsPage.waitForCategoryAnalysis();
    const categoryCount = await analyticsPage.getCategoryCount();
    await expect(categoryCount).toBe(9);

    const expectedCategories = [
      { name: 'Food & Dining', amount: '$12,500', percentage: '25%' },
      { name: 'Fuel', amount: '$8,000', percentage: '16%' },
      { name: 'Shopping', amount: '$10,000', percentage: '20%' },
      { name: 'Travel', amount: '$7,500', percentage: '15%' },
      { name: 'Entertainment', amount: '$4,000', percentage: '8%' },
      { name: 'Utilities', amount: '$3,000', percentage: '6%' },
      { name: 'Healthcare', amount: '$2,500', percentage: '5%' },
      { name: 'Education', amount: '$1,500', percentage: '3%' },
      { name: 'Miscellaneous', amount: '$1,000', percentage: '2%' }
    ];

    for (let i = 0; i < expectedCategories.length; i++) {
      const category = expectedCategories[i];
      await expect(await analyticsPage.getCategoryName(i)).toBe(category.name);
      await expect(await analyticsPage.getCategoryAmount(i)).toBe(category.amount);
      await expect(await analyticsPage.getCategoryPercentage(i)).toBe(category.percentage);
    }
  });

  test('QE-8876 TS-002 TC-001 - Verify category totals equal total spending and percentages sum to 100%', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await analyticsPage.navigate();

    await analyticsPage.waitForCategoryAnalysis();
    const totalSpending = await analyticsPage.getTotalSpending();
    await expect(totalSpending).toBe('$50,000');

    const categorySum = await analyticsPage.calculateCategorySum();
    await expect(categorySum).toBe(50000);

    const percentageSum = await analyticsPage.calculatePercentageSum();
    await expect(percentageSum).toBe(100);
  });

  test('QE-8876 TS-003 TC-001 - Verify single category spending distribution', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('foodlover', 'Pass@123');
    await analyticsPage.navigate();

    await analyticsPage.waitForCategoryAnalysis();
    const foodDiningAmount = await analyticsPage.getCategoryAmountByName('Food & Dining');
    await expect(foodDiningAmount).toBe('$3,500');

    const foodDiningPercentage = await analyticsPage.getCategoryPercentageByName('Food & Dining');
    await expect(foodDiningPercentage).toBe('100%');

    const otherCategories = ['Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of otherCategories) {
      const amount = await analyticsPage.getCategoryAmountByName(category);
      const percentage = await analyticsPage.getCategoryPercentageByName(category);
      await expect(amount === '$0.00' || amount === '$0').toBeTruthy();
      await expect(percentage === '0%' || percentage === '0').toBeTruthy();
    }
  });

});

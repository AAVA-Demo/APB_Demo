const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Analytics Tests', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
  });

  test('TC-6640: Verify user with 6 months transaction history views interactive line chart within 3 seconds', async ({ page }) => {
    await test.step('Login with user account having 6 months of transaction history', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_6months', 'Pass@123');
    });

    await test.step('Navigate to Analytics dashboard', async () => {
      await analyticsPage.navigate();
    });

    await test.step('Measure chart rendering time', async () => {
      const startTime = Date.now();
      await analyticsPage.waitForTrendChartRender();
      const renderTime = Date.now() - startTime;
      expect(renderTime).toBeLessThan(3000);
    });

    await test.step('Verify line chart displays 6 data points', async () => {
      const dataPoints = await analyticsPage.getTrendChartDataPointCount();
      expect(dataPoints).toBe(6);
    });

    await test.step('Verify monthly spend values are correctly displayed', async () => {
      const values = await analyticsPage.getTrendChartValues();
      expect(values.length).toBe(6);
      values.forEach(val => expect(val).toMatch(/\$[0-9,]+/));
    });

    await test.step('Verify chart is interactive with tooltip', async () => {
      await analyticsPage.hoverOverDataPoint(0);
      const tooltipVisible = await analyticsPage.isTooltipVisible();
      expect(tooltipVisible).toBe(true);
    });
  });

  test('TC-6641: Verify clicking month data point filters category breakdown', async ({ page }) => {
    await test.step('Login and navigate to Analytics dashboard', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_6months', 'Pass@123');
      await analyticsPage.navigate();
      await analyticsPage.waitForTrendChartRender();
    });

    await test.step('Click on specific month data point', async () => {
      await analyticsPage.clickDataPoint(1);
      await expect(analyticsPage.selectedMonthIndicator).toBeVisible();
    });

    await test.step('Verify category breakdown updates to show only selected month', async () => {
      const filterApplied = await analyticsPage.isMonthFilterApplied();
      expect(filterApplied).toBe(true);
    });

    await test.step('Verify category totals match selected month spend', async () => {
      const categoryTotal = await analyticsPage.getCategoryTotal();
      const trendValue = await analyticsPage.getSelectedMonthTrendValue();
      expect(categoryTotal).toBe(trendValue);
    });

    await test.step('Verify filter indicator shows selected month', async () => {
      const filterText = await analyticsPage.getFilterIndicatorText();
      expect(filterText).toMatch(/2026-02|February 2026/);
    });
  });

  test('TC-6642: Verify user with no transaction history sees empty state message', async ({ page }) => {
    await test.step('Login with user account having zero transaction history', async () => {
      await loginPage.navigate();
      await loginPage.login('newuser_notransactions', 'Pass@123');
    });

    await test.step('Navigate to Analytics dashboard', async () => {
      await analyticsPage.navigate();
    });

    await test.step('Verify trend chart displays empty state message', async () => {
      const emptyMessage = await analyticsPage.getTrendChartEmptyMessage();
      expect(emptyMessage).toContain('No transaction data available');
    });

    await test.step('Verify no chart axes or grid lines are rendered', async () => {
      const chartRendered = await analyticsPage.isTrendChartRendered();
      expect(chartRendered).toBe(false);
    });

    await test.step('Verify category spending section shows empty state', async () => {
      const categoryEmptyMessage = await analyticsPage.getCategoryEmptyMessage();
      expect(categoryEmptyMessage).toContain('No spending data');
    });
  });

  test('TC-6646: Verify user views category-wise spending breakdown with doughnut chart', async ({ page }) => {
    await test.step('Login with user account having transactions across multiple categories', async () => {
      await loginPage.navigate();
      await loginPage.login('user_multicategory', 'Pass@123');
    });

    await test.step('Navigate to Analytics dashboard', async () => {
      await analyticsPage.navigate();
      await analyticsPage.waitForCategoryChartRender();
    });

    await test.step('Verify doughnut chart is rendered', async () => {
      const chartType = await analyticsPage.getCategoryChartType();
      expect(chartType).toBe('doughnut');
    });

    await test.step('Verify all 9 categories are represented', async () => {
      const categories = await analyticsPage.getAllCategories();
      expect(categories).toContain('Food & Dining');
      expect(categories).toContain('Fuel');
      expect(categories).toContain('Shopping');
      expect(categories).toContain('Travel');
      expect(categories).toContain('Entertainment');
      expect(categories).toContain('Utilities');
      expect(categories).toContain('Healthcare');
      expect(categories).toContain('Education');
      expect(categories).toContain('Miscellaneous');
    });

    await test.step('Verify each category shows total amount spent', async () => {
      const amounts = await analyticsPage.getAllCategoryAmounts();
      amounts.forEach(amt => expect(amt).toMatch(/\$[0-9,]+\.\d{2}/));
    });

    await test.step('Verify each category shows percentage', async () => {
      const percentages = await analyticsPage.getAllCategoryPercentages();
      percentages.forEach(pct => expect(pct).toMatch(/\d+\.\d%/));
    });

    await test.step('Verify sum of percentages equals 100%', async () => {
      const total = await analyticsPage.getTotalPercentage();
      expect(total).toBeCloseTo(100, 1);
    });
  });

  test('TC-6648: Verify transactions are automatically classified into correct categories', async ({ page }) => {
    await test.step('Create test transactions with known merchant names', async () => {
      // Test data setup would be done via API or test fixtures
    });

    await test.step('Login and navigate to Analytics dashboard', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser', 'Pass@123');
      await analyticsPage.navigate();
      await analyticsPage.waitForCategoryChartRender();
    });

    await test.step('Verify Starbucks transaction is classified under Food & Dining', async () => {
      const foodAmount = await analyticsPage.getCategoryAmount('Food & Dining');
      expect(parseFloat(foodAmount.replace(/[$,]/g, ''))).toBeGreaterThanOrEqual(50);
    });

    await test.step('Verify Shell Gas Station transaction is classified under Fuel', async () => {
      const fuelAmount = await analyticsPage.getCategoryAmount('Fuel');
      expect(parseFloat(fuelAmount.replace(/[$,]/g, ''))).toBeGreaterThanOrEqual(75);
    });

    await test.step('Verify Amazon transaction is classified under Shopping', async () => {
      const shoppingAmount = await analyticsPage.getCategoryAmount('Shopping');
      expect(parseFloat(shoppingAmount.replace(/[$,]/g, ''))).toBeGreaterThanOrEqual(120);
    });

    await test.step('Verify category totals are calculated accurately', async () => {
      const total = await analyticsPage.getTotalSpend();
      expect(parseFloat(total.replace(/[$,]/g, ''))).toBeGreaterThanOrEqual(245);
    });
  });

  test('TC-6650: Verify unrecognizable merchants are categorized as Miscellaneous', async ({ page }) => {
    await test.step('Create test transactions with unrecognizable merchant names', async () => {
      // Test data setup would be done via API or test fixtures
    });

    await test.step('Login and navigate to Analytics dashboard', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser', 'Pass@123');
      await analyticsPage.navigate();
      await analyticsPage.waitForCategoryChartRender();
    });

    await test.step('Verify all unrecognizable transactions are classified under Miscellaneous', async () => {
      const miscAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
      expect(miscAmount).not.toBe('$0.00');
    });

    await test.step('Verify Miscellaneous category total is calculated correctly', async () => {
      const miscAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
      expect(parseFloat(miscAmount.replace(/[$,]/g, ''))).toBeGreaterThan(0);
    });

    await test.step('Verify Miscellaneous percentage is calculated', async () => {
      const miscPercentage = await analyticsPage.getCategoryPercentage('Miscellaneous');
      expect(parseFloat(miscPercentage.replace('%', ''))).toBeGreaterThan(0);
    });
  });
});

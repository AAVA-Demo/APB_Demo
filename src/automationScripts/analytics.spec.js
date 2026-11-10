const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Spending Analytics and Insights', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login('user123', 'password123');
    await analyticsPage.navigate();
  });

  test('QE-9463 TS-001 TC-001 - Verify monthly spend trends chart displays correctly', async ({ page }) => {
    await expect(analyticsPage.trendChart).toBeVisible({ timeout: 2000 });

    const dataPoints = await analyticsPage.getTrendChartDataPoints();
    expect(dataPoints.length).toBeGreaterThanOrEqual(12);

    const firstMonth = await analyticsPage.getTrendChartLabel(0);
    expect(firstMonth).toContain('Nov 2023');

    const lastMonth = await analyticsPage.getTrendChartLabel(dataPoints.length - 1);
    expect(lastMonth).toContain('Nov 2024');

    await analyticsPage.hoverOverDataPoint(0);
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toMatch(/\$[0-9,]+\.[0-9]{2}/);
  });

  test('QE-9463 TS-002 TC-001 - Verify trend chart displays limited historical data', async ({ page }) => {
    await page.route('**/api/analytics/spending**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          userId: 'user789',
          monthlyTrends: [
            { month: 'May 2024', amount: 9800 },
            { month: 'Jun 2024', amount: 10800 },
            { month: 'Jul 2024', amount: 11500 },
            { month: 'Aug 2024', amount: 10200 },
            { month: 'Sep 2024', amount: 12800 },
            { month: 'Oct 2024', amount: 11900 }
          ]
        })
      });
    });

    await page.reload();
    await expect(analyticsPage.trendChart).toBeVisible();

    const dataPoints = await analyticsPage.getTrendChartDataPoints();
    expect(dataPoints.length).toBe(6);

    await expect(analyticsPage.limitedDataMessage).toBeVisible();
    const message = await analyticsPage.getLimitedDataMessage();
    expect(message).toContain('Limited historical data available');
  });

  test('QE-9463 TS-003 TC-001 - Verify error handling when analytics service fails', async ({ page }) => {
    await page.route('**/api/analytics/spending**', route => {
      route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await page.reload();
    await expect(analyticsPage.errorMessage).toBeVisible();
    const errorText = await analyticsPage.getErrorMessage();
    expect(errorText).toContain('Failed to load analytics data');

    await expect(analyticsPage.chartErrorPlaceholder).toBeVisible();
  });

  test('QE-9465 TS-001 TC-001 - Verify category-wise spending pie chart displays all categories', async ({ page }) => {
    await expect(analyticsPage.categoryChart).toBeVisible();

    const segments = await analyticsPage.getCategoryChartSegments();
    expect(segments.length).toBe(9);

    const categories = await analyticsPage.getCategoryLabels();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');

    await expect(analyticsPage.chartLegend).toBeVisible();
  });

  test('QE-9465 TS-002 TC-001 - Verify interactive category details display on hover', async ({ page }) => {
    await analyticsPage.hoverOverCategorySegment('Food & Dining');
    await expect(analyticsPage.categoryTooltip).toBeVisible();

    const tooltipText = await analyticsPage.getCategoryTooltipText();
    expect(tooltipText).toContain('Food & Dining');
    expect(tooltipText).toMatch(/\$[0-9,]+\.[0-9]{2}/);
    expect(tooltipText).toMatch(/[0-9]+\.[0-9]%/);

    await analyticsPage.hoverOverCategorySegment('Fuel');
    const fuelTooltip = await analyticsPage.getCategoryTooltipText();
    expect(fuelTooltip).toContain('Fuel');
  });

  test('QE-9465 TS-002 TC-002 - Verify interactive category details display on click', async ({ page }) => {
    await analyticsPage.clickCategorySegment('Shopping');
    await expect(analyticsPage.categoryModal).toBeVisible();

    const modalContent = await analyticsPage.getCategoryModalContent();
    expect(modalContent).toContain('Shopping');
    expect(modalContent).toMatch(/\$[0-9,]+\.[0-9]{2}/);
    expect(modalContent).toMatch(/[0-9]+\.[0-9]%/);

    await analyticsPage.closeCategoryModal();
    await expect(analyticsPage.categoryModal).not.toBeVisible();
    await expect(analyticsPage.categoryChart).toBeVisible();
  });

  test('QE-9465 TS-003 TC-001 - Verify pie chart displays only categories with spending data', async ({ page }) => {
    await page.route('**/api/analytics/spending**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          userId: 'user456',
          categoryWiseSpending: [
            { category: 'Food & Dining', amount: 2850.50, percentage: 45.6 },
            { category: 'Fuel', amount: 1580.00, percentage: 25.3 },
            { category: 'Shopping', amount: 1820.00, percentage: 29.1 }
          ],
          categories: ['Food & Dining', 'Fuel', 'Shopping']
        })
      });
    });

    await page.reload();
    await expect(analyticsPage.categoryChart).toBeVisible();

    const segments = await analyticsPage.getCategoryChartSegments();
    expect(segments.length).toBe(3);

    const categories = await analyticsPage.getCategoryLabels();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).not.toContain('Travel');

    await expect(analyticsPage.zeroCategoryNote).toBeVisible();
    const noteText = await analyticsPage.getZeroCategoryNoteText();
    expect(noteText).toContain('Travel');
    expect(noteText).toContain('Entertainment');
  });
});

const { test, expect } = require('@playwright/test');
const { AnalyticsDashboardPage } = require('./pages/analyticsDashboard.page');
const { LoginPage } = require('./pages/login.page');

/**
 * Test Suite: Category-Wise Spending Analysis (QE-9367)
 * User Story: Category-Wise Spending Analysis
 * Epic: CreditCardNew20261110203156-Spending Analytics and Insights
 */

test.describe('Category-Wise Spending Analysis - QE-9367', () => {

  test('QE-9367 TS-001 TC-001: Verify category-wise spending breakdown displays correctly with all transactions categorized', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsDashboardPage(page);

    // Step 1: Launch the Credit Card Dashboard application
    await loginPage.navigate('https://creditcard-dashboard.example.com');
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Log in with valid user credentials who has 25 transactions across 7 categories
    await loginPage.login('testuser_25txn', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Navigate to the Spending Analytics section
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.analyticsContainer).toBeVisible();

    // Step 4: Verify the interactive pie chart is displayed
    await expect(analyticsPage.pieChart).toBeVisible();
    const categorySegments = await analyticsPage.getCategorySegments();
    expect(categorySegments.length).toBe(7);

    // Step 5: Verify each category displays name, amount, and percentage
    await analyticsPage.verifyCategoryData('Shopping', '$1,200', '36%');
    await analyticsPage.verifyCategoryData('Food & Dining', '$800', '24%');
    await analyticsPage.verifyCategoryData('Travel', '$500', '15%');
    await analyticsPage.verifyCategoryData('Fuel', '$300', '9%');
    await analyticsPage.verifyCategoryData('Entertainment', '$200', '6%');
    await analyticsPage.verifyCategoryData('Utilities', '$150', '5%');
    await analyticsPage.verifyCategoryData('Healthcare', '$100', '3%');

    // Step 6: Hover over the Shopping segment
    await analyticsPage.hoverOverCategory('Shopping');
    await expect(analyticsPage.tooltip).toBeVisible();
    await expect(analyticsPage.tooltip).toContainText('Shopping');

    // Step 7: Click on the Food & Dining segment
    await analyticsPage.clickCategory('Food & Dining');
    await expect(analyticsPage.drillDownView).toBeVisible();
    await expect(analyticsPage.drillDownView).toContainText('Food & Dining');
  });

  test('QE-9367 TS-001 TC-002: Verify pie chart interactivity and responsiveness across different screen sizes', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsDashboardPage(page);

    // Step 1: Launch the application and log in with user having 25 transactions
    await loginPage.navigate('https://creditcard-dashboard.example.com');
    await loginPage.login('testuser_25txn', 'Pass@123');

    // Step 2: Navigate to Spending Analytics dashboard
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.pieChart).toBeVisible();

    // Step 3: Resize browser window to tablet size (768px width)
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(analyticsPage.pieChart).toBeVisible();
    await analyticsPage.verifyChartInteractivity();

    // Step 4: Resize browser window to mobile size (375px width)
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(analyticsPage.pieChart).toBeVisible();

    // Step 5: Tap on any category segment on mobile view
    await analyticsPage.clickCategory('Shopping');
    await expect(analyticsPage.categoryDetails).toBeVisible();
    await analyticsPage.verifyNoUIOverlap();
  });

  test('QE-9367 TS-001 TC-003: Verify total spend calculation accuracy across all categories', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsDashboardPage(page);

    // Step 1: Launch the application and log in
    await loginPage.navigate('https://creditcard-dashboard.example.com');
    await loginPage.login('testuser_25txn', 'Pass@123');

    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigateToAnalytics();

    // Step 3: Sum all displayed category amounts manually
    const categoryAmounts = await analyticsPage.getAllCategoryAmounts();
    const totalCalculated = categoryAmounts.reduce((sum, amount) => sum + amount, 0);
    expect(totalCalculated).toBe(3250);

    // Step 4: Verify the total spend displayed on the dashboard
    const displayedTotal = await analyticsPage.getTotalSpend();
    expect(displayedTotal).toBe('$3,250');

    // Step 5: Verify percentage calculations for each category
    const percentages = await analyticsPage.getAllCategoryPercentages();
    const totalPercentage = percentages.reduce((sum, pct) => sum + pct, 0);
    expect(totalPercentage).toBeCloseTo(100, 1);
  });

  test('QE-9367 TS-002 TC-001: Verify uncategorized transactions are assigned to Miscellaneous category', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsDashboardPage(page);

    // Step 1: Launch the application in a browser
    await loginPage.navigate('https://creditcard-dashboard.example.com');

    // Step 2: Log in with user having 10 transactions, 3 with null category
    await loginPage.login('testuser_nullcat', 'Pass@123');

    // Step 3: Navigate to Spending Analytics dashboard
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.pieChart).toBeVisible();

    // Step 4: Verify all 9 predefined categories are displayed
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

    // Step 5: Click on the Miscellaneous category segment
    await analyticsPage.clickCategory('Miscellaneous');
    await expect(analyticsPage.drillDownView).toBeVisible();
    const miscTransactions = await analyticsPage.getMiscellaneousTransactionCount();
    expect(miscTransactions).toBeGreaterThanOrEqual(3);

    // Step 6: Verify total transaction count
    const totalTransactions = await analyticsPage.getTotalTransactionCount();
    expect(totalTransactions).toBe(10);
  });

  test('QE-9367 TS-002 TC-002: Verify pie chart remains functional with mixed categorized and uncategorized transactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsDashboardPage(page);

    // Step 1: Launch application and log in with user having mixed transactions
    await loginPage.navigate('https://creditcard-dashboard.example.com');
    await loginPage.login('testuser_nullcat', 'Pass@123');

    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigateToAnalytics();

    // Step 3: Verify pie chart displays all categories including Miscellaneous
    await expect(analyticsPage.pieChart).toBeVisible();
    const segments = await analyticsPage.getCategorySegments();
    expect(segments.length).toBe(9);

    // Step 4: Hover over each category segment
    for (const category of await analyticsPage.getAllCategories()) {
      await analyticsPage.hoverOverCategory(category);
      await expect(analyticsPage.tooltip).toBeVisible();
      await expect(analyticsPage.tooltip).toContainText(category);
    }

    // Step 5: Verify chart interactivity is not impacted by null categories
    await analyticsPage.verifyChartInteractivity();
  });

  test('QE-9367 TS-002 TC-003: Verify system handles all transactions with null category gracefully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsDashboardPage(page);

    // Step 1: Launch application and log in with user having all transactions with null category
    await loginPage.navigate('https://creditcard-dashboard.example.com');
    await loginPage.login('testuser_allnull', 'Pass@123');

    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigateToAnalytics();

    // Step 3: Verify pie chart displays
    await expect(analyticsPage.pieChart).toBeVisible();
    const miscellaneousPercentage = await analyticsPage.getCategoryPercentage('Miscellaneous');
    expect(miscellaneousPercentage).toBe('100%');

    // Step 4: Verify other categories show 0% or are not displayed
    const categories = await analyticsPage.getAllCategories();
    for (const category of categories) {
      if (category !== 'Miscellaneous') {
        const percentage = await analyticsPage.getCategoryPercentage(category);
        expect(percentage === '0%' || percentage === null).toBeTruthy();
      }
    }

    // Step 5: Verify no errors or broken UI elements
    await analyticsPage.verifyNoUIErrors();
  });

  test('QE-9367 TS-003 TC-001: Verify empty state message displays when user has zero transactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsDashboardPage(page);

    // Step 1: Launch the application in a browser
    await loginPage.navigate('https://creditcard-dashboard.example.com');

    // Step 2: Log in with new user account having zero transactions
    await loginPage.login('newuser_notxn', 'Pass@123');

    // Step 3: Navigate to Spending Analytics dashboard
    await analyticsPage.navigateToAnalytics();

    // Step 4: Verify empty state message is displayed
    await expect(analyticsPage.emptyStateMessage).toBeVisible();
    await expect(analyticsPage.emptyStateMessage).toContainText('No transactions found for the selected period. Start using your credit card to see spending insights.');

    // Step 5: Verify placeholder graphic or empty state illustration is shown
    await expect(analyticsPage.emptyStateGraphic).toBeVisible();

    // Step 6: Verify no pie chart or broken visualizations are displayed
    await expect(analyticsPage.pieChart).not.toBeVisible();
    await analyticsPage.verifyNoUIErrors();
  });

  test('QE-9367 TS-003 TC-002: Verify empty state for inactive user with past transactions but none in current period', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsDashboardPage(page);

    // Step 1: Launch application and log in with inactive user
    await loginPage.navigate('https://creditcard-dashboard.example.com');
    await loginPage.login('inactiveuser', 'Pass@123');

    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigateToAnalytics();

    // Step 3: Select current month as the date range filter
    await analyticsPage.selectDateRange('current_month');

    // Step 4: Verify empty state message is displayed
    await expect(analyticsPage.emptyStateMessage).toBeVisible();
    await expect(analyticsPage.emptyStateMessage).toContainText('No transactions found for the selected period');

    // Step 5: Change date range to a past month with transactions
    await analyticsPage.selectDateRange('previous_month');
    await expect(analyticsPage.pieChart).toBeVisible();
  });

  test('QE-9367 TS-003 TC-003: Verify UI gracefully handles empty state without displaying errors', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsDashboardPage(page);

    // Step 1: Launch application and log in with user having no transactions
    await loginPage.navigate('https://creditcard-dashboard.example.com');
    await loginPage.login('newuser_notxn', 'Pass@123');

    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigateToAnalytics();

    // Step 3: Inspect browser console for JavaScript errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.waitForTimeout(2000);
    expect(consoleErrors.length).toBe(0);

    // Step 4: Verify page layout remains intact
    await analyticsPage.verifyLayoutIntegrity();

    // Step 5: Verify navigation and other dashboard features remain functional
    await analyticsPage.navigateToDashboard();
    await expect(page).toHaveURL(/dashboard/);
  });
});

const { test, expect } = require('@playwright/test');
const { CategoriesPage } = require('./pages/categories.page');

/**
 * Test Suite: Category-wise Spending Analysis and Drill-Down
 * Test Cases: QE-7543 TS-001 TC-001, QE-7543 TS-002 TC-001, QE-7543 TS-003 TC-001,
 *             QE-7542 TS-001 TC-001, QE-7542 TS-002 TC-001, QE-7542 TS-003 TC-001
 */

test.describe('Category-wise Spending Analysis and Drill-Down', () => {

  test('QE-7543 TS-001 TC-001 - Verify category visualization with all 9 categories', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    
    // Step 1: Launch application
    await categoriesPage.navigate();
    
    // Step 2: Login with user having transactions across all categories
    await categoriesPage.login('testuser@example.com', 'Test@123');
    
    // Step 3: Navigate to Categories page
    await categoriesPage.navigateToCategories();
    
    // Step 4: Verify category visualization is displayed
    await categoriesPage.waitForChartLoad();
    const categories = await categoriesPage.getChartCategories();
    expect(categories).toEqual([
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ]);
    
    // Step 5: Verify accurate expenditure amounts
    const amounts = await categoriesPage.getCategoryAmounts();
    expect(amounts['Food & Dining']).toBe(500);
    expect(amounts['Fuel']).toBe(300);
    expect(amounts['Shopping']).toBe(750);
    expect(amounts['Travel']).toBe(1200);
    expect(amounts['Entertainment']).toBe(250);
    expect(amounts['Utilities']).toBe(400);
    expect(amounts['Healthcare']).toBe(600);
    expect(amounts['Education']).toBe(800);
    expect(amounts['Miscellaneous']).toBe(150);
    
    // Step 6: Verify distinct colors
    await categoriesPage.verifyDistinctColors();
    
    // Step 7: Hover and verify tooltip
    await categoriesPage.hoverCategorySegment('Food & Dining');
    const tooltipText = await categoriesPage.getTooltipText();
    expect(tooltipText).toContain('Food & Dining');
    expect(tooltipText).toContain('$500');
    expect(tooltipText).toContain('10.2%');
  });

  test('QE-7543 TS-002 TC-001 - Verify empty state for user with no transaction history', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    
    // Step 1: Launch application
    await categoriesPage.navigate();
    
    // Step 2: Login with new user
    await categoriesPage.login('newuser@example.com', 'Test@123');
    
    // Step 3: Navigate to Categories page
    await categoriesPage.navigateToCategories();
    
    // Step 4: Verify empty chart
    const hasData = await categoriesPage.hasChartData();
    expect(hasData).toBe(false);
    
    // Step 5: Verify informational message
    await expect(categoriesPage.emptyStateMessage).toBeVisible();
    await expect(categoriesPage.emptyStateMessage).toContainText('No spending data is available to visualize');
  });

  test('QE-7543 TS-003 TC-001 - Verify error handling for corrupted data', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    
    // Step 1: Launch application
    await categoriesPage.navigate();
    
    // Step 2: Navigate to Categories page
    await categoriesPage.navigateToCategories();
    
    // Step 3: Simulate corrupted data response
    await page.route('**/api/analytics/categories*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ categories: null })
      });
    });
    await page.reload();
    
    // Step 4: Verify application does not crash
    await expect(page.locator('.categories-container')).toBeVisible();
    
    // Step 5: Verify error message
    await expect(categoriesPage.errorMessage).toBeVisible();
    await expect(categoriesPage.errorMessage).toContainText('Failed to load category data');
    
    // Step 6: Verify error state in chart area
    await expect(categoriesPage.chartContainer).toBeVisible();
  });

  test('QE-7542 TS-001 TC-001 - Verify drill-down into valid category shows transaction list', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    
    // Step 1: Launch application
    await categoriesPage.navigate();
    
    // Step 2: Navigate to Categories page
    await categoriesPage.navigateToCategories();
    
    // Step 3: Verify chart is displayed
    await categoriesPage.waitForChartLoad();
    await expect(categoriesPage.chartCanvas).toBeVisible();
    
    // Step 4: Click on Food & Dining category
    await categoriesPage.clickCategory('Food & Dining');
    
    // Step 5: Verify transaction list section appears
    await expect(categoriesPage.transactionListSection).toBeVisible();
    await expect(categoriesPage.transactionListHeading).toContainText('Food & Dining Transactions');
    
    // Step 6: Verify transaction table with data
    const transactions = await categoriesPage.getTransactionList();
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions[0]).toHaveProperty('date');
    expect(transactions[0]).toHaveProperty('description');
    expect(transactions[0]).toHaveProperty('amount');
    
    // Step 7: Verify currency formatting
    for (const txn of transactions) {
      expect(txn.amount).toMatch(/^\$[0-9]+\.[0-9]{2}$/);
    }
    
    // Step 8: Verify Close button
    await expect(categoriesPage.closeButton).toBeVisible();
    await expect(categoriesPage.closeButton).toBeEnabled();
  });

  test('QE-7542 TS-002 TC-001 - Verify drill-down into category with no transactions', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    
    // Step 1: Launch application
    await categoriesPage.navigate();
    
    // Step 2: Navigate to Categories page
    await categoriesPage.navigateToCategories();
    
    // Step 3: Click on category with no transactions
    await categoriesPage.clickCategory('Healthcare');
    
    // Step 4: Verify message is displayed
    await expect(categoriesPage.noTransactionsMessage).toBeVisible();
    await expect(categoriesPage.noTransactionsMessage).toContainText('No transactions are available for the selected category');
    
    // Step 5: Verify no transaction table
    await expect(categoriesPage.transactionTable).not.toBeVisible();
  });

  test('QE-7542 TS-003 TC-001 - Verify error when backend service is unavailable during drill-down', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    
    // Step 1: Launch application
    await categoriesPage.navigate();
    
    // Step 2: Navigate to Categories page
    await categoriesPage.navigateToCategories();
    
    // Step 3: Simulate backend unavailability
    await page.route('**/api/transactions*', route => route.abort('failed'));
    
    // Step 4: Click on category
    await categoriesPage.clickCategory('Food & Dining');
    
    // Step 5: Verify error message
    await expect(categoriesPage.drillDownErrorMessage).toBeVisible();
    await expect(categoriesPage.drillDownErrorMessage).toContainText('Backend service is unavailable');
    
    // Step 6: Verify drill-down prevented
    await expect(categoriesPage.transactionListSection).not.toBeVisible();
    
    // Step 7: Verify application stability
    await expect(page.locator('.categories-container')).toBeVisible();
    await expect(categoriesPage.chartCanvas).toBeVisible();
  });

});
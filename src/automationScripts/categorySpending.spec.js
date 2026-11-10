const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CategorySpendingPage } = require('./pages/categorySpending.page');

test.describe('Category-wise Spending Visualization Tests', () => {

  test('QE-9711 TS-001 TC-001 - Verify user with transactions across all nine spending categories sees accurate spending amounts displayed for each category with correct totals on analytics dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const categorySpendingPage = new CategorySpendingPage(page);

    // Step 1 & 2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser_allcategories', 'Test@123');

    // Step 3: Navigate to analytics dashboard
    await categorySpendingPage.navigate();

    // Step 4: Observe category-wise spending breakdown
    await expect(categorySpendingPage.categoryBreakdownContainer).toBeVisible();

    // Step 5-13: Verify each category displays accurate spending
    const expectedCategories = {
      'Food & Dining': '$1,200',
      'Fuel': '$800',
      'Shopping': '$1,500',
      'Travel': '$900',
      'Entertainment': '$600',
      'Utilities': '$400',
      'Healthcare': '$300',
      'Education': '$250',
      'Miscellaneous': '$350'
    };

    for (const [category, expectedAmount] of Object.entries(expectedCategories)) {
      const actualAmount = await categorySpendingPage.getCategoryAmount(category);
      expect(actualAmount).toBe(expectedAmount);
    }

    // Step 14 & 15: Verify total spending
    const totalSpending = await categorySpendingPage.getTotalSpending();
    expect(totalSpending).toBe('$6,300');
  });

  test('QE-9711 TS-002 TC-001 - Verify analytics dashboard displays all nine categories with zero spending values or appropriate no transactions message when user has zero transactions in any category', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const categorySpendingPage = new CategorySpendingPage(page);

    // Step 1 & 2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser_zerotransactions', 'Test@123');

    // Step 3: Navigate to analytics dashboard
    await categorySpendingPage.navigate();

    // Step 4: Observe category-wise spending breakdown
    await expect(categorySpendingPage.categoryBreakdownContainer).toBeVisible();

    // Step 5: Verify all nine categories are displayed
    const categories = await categorySpendingPage.getAllCategoryNames();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    expect(categories).toEqual(expectedCategories);

    // Step 6: Verify each category shows $0 or no transactions message
    for (const category of expectedCategories) {
      const amount = await categorySpendingPage.getCategoryAmount(category);
      expect(amount).toMatch(/\$0|No transactions/);
    }

    // Step 7: Verify total spending is $0
    const totalSpending = await categorySpendingPage.getTotalSpending();
    expect(totalSpending).toBe('$0');
  });

  test('QE-9711 TS-003 TC-001 - Verify category-wise breakdown displays spending amounts only for three active categories while remaining six categories show zero or no data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const categorySpendingPage = new CategorySpendingPage(page);

    // Step 1 & 2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser_threecategories', 'Test@123');

    // Step 3: Navigate to analytics dashboard
    await categorySpendingPage.navigate();

    // Step 4: Observe category-wise spending breakdown
    await expect(categorySpendingPage.categoryBreakdownContainer).toBeVisible();

    // Step 5-7: Verify three active categories
    const activeCategories = {
      'Food & Dining': '$1,000',
      'Fuel': '$600',
      'Shopping': '$1,400'
    };
    for (const [category, expectedAmount] of Object.entries(activeCategories)) {
      const actualAmount = await categorySpendingPage.getCategoryAmount(category);
      expect(actualAmount).toBe(expectedAmount);
    }

    // Step 8-13: Verify remaining six categories show zero
    const zeroCategories = ['Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of zeroCategories) {
      const amount = await categorySpendingPage.getCategoryAmount(category);
      expect(amount).toMatch(/\$0|No data/);
    }

    // Step 14 & 15: Verify total spending
    const totalSpending = await categorySpendingPage.getTotalSpending();
    expect(totalSpending).toBe('$3,000');
  });

});
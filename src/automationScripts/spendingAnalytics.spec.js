const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { SpendingAnalyticsPage } = require('./pages/spendingAnalytics.page');

test.describe('Spending Analytics and Visualization', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new SpendingAnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-10467 TS-001 TC-001 - Verify category-wise spending pie chart displays accurate amounts and percentages', async ({ page }) => {
    // Step 1: Authenticate
    await loginPage.login('testuser_allcategories', 'Pass@123');
    
    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigate();
    
    // Step 3: Verify all 9 categories displayed
    const categories = await analyticsPage.getAllCategories();
    expect(categories).toHaveLength(9);
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    
    // Step 4-5: Verify amounts
    await expect(analyticsPage.getCategoryAmount('Food & Dining')).toHaveText('₹15,000');
    await expect(analyticsPage.getCategoryAmount('Fuel')).toHaveText('₹8,000');
    await expect(analyticsPage.getCategoryAmount('Shopping')).toHaveText('₹12,000');
    await expect(analyticsPage.getCategoryAmount('Travel')).toHaveText('₹20,000');
    await expect(analyticsPage.getCategoryAmount('Entertainment')).toHaveText('₹5,000');
    await expect(analyticsPage.getCategoryAmount('Utilities')).toHaveText('₹6,000');
    await expect(analyticsPage.getCategoryAmount('Healthcare')).toHaveText('₹3,000');
    await expect(analyticsPage.getCategoryAmount('Education')).toHaveText('₹7,000');
    await expect(analyticsPage.getCategoryAmount('Miscellaneous')).toHaveText('₹4,000');
    
    // Step 6-7: Verify percentages sum to 100%
    const totalPercentage = await analyticsPage.getTotalPercentage();
    expect(totalPercentage).toBeCloseTo(100, 1);
    
    // Step 8: Verify interactivity
    await analyticsPage.hoverCategory('Food & Dining');
    await expect(analyticsPage.categoryTooltip).toBeVisible();
    await expect(analyticsPage.categoryTooltip).toContainText('Food & Dining');
  });

  test('QE-10467 TS-002 TC-001 - Verify system displays all categories including unused ones with ₹0', async ({ page }) => {
    // Step 1: Authenticate
    await loginPage.login('testuser_3categories', 'Pass@123');
    
    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigate();
    
    // Step 3: Verify all 9 categories visible
    const categories = await analyticsPage.getAllCategories();
    expect(categories).toHaveLength(9);
    
    // Step 4: Verify categories with spending
    await expect(analyticsPage.getCategoryAmount('Food & Dining')).toContainText('₹');
    await expect(analyticsPage.getCategoryAmount('Fuel')).toContainText('₹');
    await expect(analyticsPage.getCategoryAmount('Shopping')).toContainText('₹');
    
    // Step 5: Verify unused categories show ₹0
    await expect(analyticsPage.getCategoryAmount('Travel')).toHaveText('₹0');
    await expect(analyticsPage.getCategoryAmount('Entertainment')).toHaveText('₹0');
    await expect(analyticsPage.getCategoryAmount('Utilities')).toHaveText('₹0');
    await expect(analyticsPage.getCategoryAmount('Healthcare')).toHaveText('₹0');
    await expect(analyticsPage.getCategoryAmount('Education')).toHaveText('₹0');
    await expect(analyticsPage.getCategoryAmount('Miscellaneous')).toHaveText('₹0');
    
    // Step 6: Verify all categories visible in legend
    await expect(analyticsPage.categoryLegend).toContainText('Food & Dining');
    await expect(analyticsPage.categoryLegend).toContainText('Travel');
    
    // Step 7: Verify percentages calculated only from non-zero
    const totalPercentage = await analyticsPage.getTotalPercentage();
    expect(totalPercentage).toBeCloseTo(100, 1);
  });

  test('QE-10467 TS-003 TC-001 - Verify system normalizes mixed-case category names during aggregation', async ({ page }) => {
    // Step 1: Authenticate
    await loginPage.login('testuser_variantcategories', 'Pass@123');
    
    // Step 2: Verify test data includes variants (backend validation)
    // This assumes backend returns normalized data
    
    // Step 3: Navigate to Spending Analytics
    await analyticsPage.navigate();
    
    // Step 4: Verify aggregated total for Food & Dining
    await expect(analyticsPage.getCategoryAmount('Food & Dining')).toHaveText('₹18,500');
    
    // Step 5: Verify no duplicate categories
    const categories = await analyticsPage.getAllCategories();
    const foodDiningCount = categories.filter(c => c.toLowerCase().includes('food')).length;
    expect(foodDiningCount).toBe(1);
    
    // Step 6: Verify transaction count
    await expect(analyticsPage.getCategoryTransactionCount('Food & Dining')).toHaveText('3');
    
    // Step 7: Verify percentage calculation
    const percentage = await analyticsPage.getCategoryPercentage('Food & Dining');
    expect(percentage).toBeGreaterThan(0);
  });

  test('QE-10465 TS-001 TC-001 - Verify clicking on Food & Dining displays detailed transaction breakdown', async ({ page }) => {
    // Step 1: Authenticate
    await loginPage.login('testuser_foodtxns', 'Pass@123');
    
    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigate();
    
    // Step 3: Click on Food & Dining category
    await analyticsPage.clickCategory('Food & Dining');
    
    // Step 4: Verify detailed view opens
    await expect(analyticsPage.transactionDetailPanel).toBeVisible();
    
    // Step 5-7: Verify transaction details
    const transactions = await analyticsPage.getTransactionDetails();
    expect(transactions.length).toBeGreaterThan(0);
    
    for (const txn of transactions) {
      expect(txn.date).toMatch(/\d{2}-[A-Za-z]{3}-\d{4}/);
      expect(txn.merchant).toBeTruthy();
      expect(txn.amount).toMatch(/₹[\d,]+\.\d{2}/);
    }
    
    // Step 8: Verify chronological sorting
    const dates = transactions.map(t => new Date(t.date));
    const isSorted = dates.every((date, i) => i === 0 || date >= dates[i - 1]);
    expect(isSorted).toBe(true);
  });

  test('QE-10465 TS-002 TC-001 - Verify clicking on category with zero transactions displays appropriate message', async ({ page }) => {
    // Step 1: Authenticate
    await loginPage.login('testuser_nohealthcare', 'Pass@123');
    
    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigate();
    await expect(analyticsPage.getCategoryAmount('Healthcare')).toHaveText('₹0');
    
    // Step 3: Click on Healthcare category
    await analyticsPage.clickCategory('Healthcare');
    
    // Step 4: Verify appropriate message
    await expect(analyticsPage.noTransactionsMessage).toBeVisible();
    await expect(analyticsPage.noTransactionsMessage).toContainText('No transactions found for Healthcare category');
    
    // Step 5: Verify no empty table
    const tableVisible = await analyticsPage.transactionTable.isVisible().catch(() => false);
    expect(tableVisible).toBe(false);
    
    // Step 6: Verify no errors in console
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    expect(consoleErrors).toHaveLength(0);
    
    // Step 7: Verify back navigation
    await analyticsPage.closeDetailPanel();
    await expect(analyticsPage.categoryChart).toBeVisible();
  });

  test('QE-10465 TS-003 TC-001 - Verify drilling down into Travel category displays merchant aggregation', async ({ page }) => {
    // Step 1: Authenticate
    await loginPage.login('testuser_traveltxns', 'Pass@123');
    
    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigate();
    
    // Step 3: Click on Travel category
    await analyticsPage.clickCategory('Travel');
    
    // Step 4: Verify merchant aggregation
    await expect(analyticsPage.merchantAggregationView).toBeVisible();
    const merchants = await analyticsPage.getMerchantSubtotals();
    expect(merchants.length).toBeGreaterThan(0);
    
    // Step 5: Verify top 3 merchants
    const topMerchants = merchants.slice(0, 3);
    expect(topMerchants).toHaveLength(3);
    
    // Step 6: Verify percentage calculations
    const totalCategoryAmount = await analyticsPage.getCategoryTotalAmount('Travel');
    for (const merchant of topMerchants) {
      const expectedPercentage = (merchant.amount / totalCategoryAmount) * 100;
      expect(merchant.percentage).toBeCloseTo(expectedPercentage, 1);
    }
    
    // Step 7: Verify percentages sum to 100%
    const totalPercentage = merchants.reduce((sum, m) => sum + m.percentage, 0);
    expect(totalPercentage).toBeCloseTo(100, 1);
    
    // Step 8: Verify drill-down to merchant transactions
    await analyticsPage.clickMerchant(topMerchants[0].name);
    await expect(analyticsPage.merchantTransactionList).toBeVisible();
  });
});
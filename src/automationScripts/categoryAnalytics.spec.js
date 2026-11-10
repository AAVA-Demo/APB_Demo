const { test, expect } = require('@playwright/test');
const { CategoryAnalyticsPage } = require('./pages/categoryAnalytics.page');

// Test Case ID: 6983 - QE-9866 TS-001 TC-001
test('TC-6983: Verify user can drill down into Food & Dining category and view detailed transaction list', async ({ page }) => {
  const analyticsPage = new CategoryAnalyticsPage(page);
  
  // Step 1: Launch application
  await analyticsPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Navigate to Category Analytics section
  await analyticsPage.navigateToCategoryAnalytics();
  await expect(analyticsPage.pieChart).toBeVisible();
  
  // Step 3: Verify Food & Dining category is displayed
  const foodDiningAmount = await analyticsPage.getCategoryAmount('Food & Dining');
  expect(foodDiningAmount).toBe('$1,250.00');
  
  // Step 4: Click on Food & Dining category segment
  await analyticsPage.clickCategorySegment('Food & Dining');
  await expect(analyticsPage.transactionDetailsList).toBeVisible();
  
  // Step 5: Verify transaction list displays individual transaction details
  const transactionHeaders = await analyticsPage.getTransactionTableHeaders();
  expect(transactionHeaders).toContain('Date');
  expect(transactionHeaders).toContain('Merchant Name');
  expect(transactionHeaders).toContain('Amount');
  expect(transactionHeaders).toContain('Card Used');
  
  // Step 6: Calculate sum and verify against aggregated amount
  const transactionAmounts = await analyticsPage.getAllTransactionAmounts();
  const calculatedSum = transactionAmounts.reduce((sum, amount) => sum + amount, 0);
  expect(calculatedSum).toBeCloseTo(1250.00, 2);
});

// Test Case ID: 6984 - QE-9866 TS-002 TC-001
test('TC-6984: Verify system displays appropriate message when drilling into category with no transactions', async ({ page }) => {
  const analyticsPage = new CategoryAnalyticsPage(page);
  
  // Step 1: Launch application
  await analyticsPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Navigate to Category Analytics section
  await analyticsPage.navigateToCategoryAnalytics();
  
  // Step 3: Select time period with no Healthcare transactions
  await analyticsPage.selectDateRange('2024-01-01', '2024-01-31');
  await analyticsPage.waitForChartUpdate();
  
  // Step 4: Click on Healthcare category
  await analyticsPage.clickCategorySegment('Healthcare');
  
  // Step 5: Verify message and options are displayed
  await expect(analyticsPage.noTransactionsMessage).toBeVisible();
  const messageText = await analyticsPage.noTransactionsMessage.textContent();
  expect(messageText).toContain('No transactions are available for this category');
  await expect(analyticsPage.viewAllCategoriesButton).toBeVisible();
  await expect(analyticsPage.changeDateRangeButton).toBeVisible();
});

// Test Case ID: 6985 - QE-9866 TS-003 TC-001
test('TC-6985: Verify user can apply multiple filters during category drill-down', async ({ page }) => {
  const analyticsPage = new CategoryAnalyticsPage(page);
  
  // Step 1: Launch application
  await analyticsPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Navigate and click on Travel category
  await analyticsPage.navigateToCategoryAnalytics();
  const initialTotal = await analyticsPage.getCategoryAmount('Travel');
  expect(initialTotal).toBe('$3,500.00');
  const initialCount = await analyticsPage.getCategoryTransactionCount('Travel');
  expect(initialCount).toBe(15);
  await analyticsPage.clickCategorySegment('Travel');
  
  // Step 3: Apply date range filter
  await analyticsPage.applyDateRangeFilter('2024-01-01', '2024-02-29');
  await expect(analyticsPage.transactionDetailsList).toBeVisible();
  
  // Step 4: Apply card filter
  await analyticsPage.applyCardFilter('Visa Gold');
  await analyticsPage.waitForFilterUpdate();
  
  // Step 5: Apply amount range filter
  await analyticsPage.applyAmountRangeFilter(100, 500);
  await analyticsPage.waitForFilterUpdate();
  
  // Step 6: Verify recalculated totals
  const filteredTotal = await analyticsPage.getFilteredTotal();
  const filteredCount = await analyticsPage.getFilteredCount();
  expect(filteredTotal).toBe('$850.00');
  expect(filteredCount).toBe(4);
});

// Test Case ID: 6995 - QE-9862 TS-001 TC-001
test('TC-6995: Verify category analytics dashboard displays interactive pie chart with all 9 categories', async ({ page }) => {
  const analyticsPage = new CategoryAnalyticsPage(page);
  
  // Step 1: Launch application
  await analyticsPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Navigate to Category Analytics section
  await analyticsPage.navigateToCategoryAnalytics();
  
  // Step 3: Verify pie chart displays all 9 categories
  const categories = await analyticsPage.getAllCategoryNames();
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
  
  // Step 4: Verify each category displays total amount
  const foodDiningAmount = await analyticsPage.getCategoryAmount('Food & Dining');
  expect(foodDiningAmount).toBe('$1,250.00');
  const fuelAmount = await analyticsPage.getCategoryAmount('Fuel');
  expect(fuelAmount).toBe('$800.00');
  
  // Step 5: Verify each category displays percentage
  const foodDiningPercentage = await analyticsPage.getCategoryPercentage('Food & Dining');
  expect(foodDiningPercentage).toBe('17.24%');
  
  // Step 6: Verify pie chart is interactive
  await analyticsPage.hoverOverCategory('Food & Dining');
  await expect(analyticsPage.tooltipElement).toBeVisible();
  const tooltipText = await analyticsPage.tooltipElement.textContent();
  expect(tooltipText).toContain('Food & Dining');
});

// Test Case ID: 6996 - QE-9862 TS-002 TC-001
test('TC-6996: Verify system displays message when no transaction data exists for selected period', async ({ page }) => {
  const analyticsPage = new CategoryAnalyticsPage(page);
  
  // Step 1: Launch application
  await analyticsPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Navigate to Category Analytics section
  await analyticsPage.navigateToCategoryAnalytics();
  
  // Step 3: Select date range with no transactions
  await analyticsPage.selectDateRange('2025-01-01', '2025-01-31');
  await analyticsPage.waitForChartUpdate();
  
  // Step 4: Verify message is displayed
  await expect(analyticsPage.noDataMessage).toBeVisible();
  const messageText = await analyticsPage.noDataMessage.textContent();
  expect(messageText).toContain('No spending data is available for visualization');
  
  // Step 5: Verify prompt to select different date range
  await expect(analyticsPage.selectDifferentDateRangeButton).toBeVisible();
  
  // Step 6: Verify prompt to add transactions
  await expect(analyticsPage.addTransactionsLink).toBeVisible();
  
  // Step 7: Verify pie chart is not displayed
  await expect(analyticsPage.pieChart).not.toBeVisible();
});

// Test Case ID: 6997 - QE-9862 TS-003 TC-001
test('TC-6997: Verify system correctly aggregates multiple transactions within same category', async ({ page }) => {
  const analyticsPage = new CategoryAnalyticsPage(page);
  
  // Step 1: Launch application
  await analyticsPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Navigate to Category Analytics section
  await analyticsPage.navigateToCategoryAnalytics();
  
  // Step 3: Verify Food & Dining transaction count
  const transactionCount = await analyticsPage.getCategoryTransactionCount('Food & Dining');
  expect(transactionCount).toBe(25);
  
  // Step 4: Verify Food & Dining cumulative spending amount
  const totalAmount = await analyticsPage.getCategoryAmount('Food & Dining');
  expect(totalAmount).toBe('$1,250.00');
  
  // Step 5: Calculate total spending across all categories
  const allAmounts = await analyticsPage.getAllCategoryAmounts();
  const totalSpending = allAmounts.reduce((sum, amount) => sum + amount, 0);
  expect(totalSpending).toBeCloseTo(7250.00, 2);
  
  // Step 6: Verify Food & Dining percentage calculation
  const percentage = await analyticsPage.getCategoryPercentage('Food & Dining');
  expect(percentage).toBe('17.24%');
  
  // Step 7: Verify sum of all percentages equals 100%
  const allPercentages = await analyticsPage.getAllCategoryPercentages();
  const totalPercentage = allPercentages.reduce((sum, pct) => sum + pct, 0);
  expect(totalPercentage).toBeCloseTo(100.00, 2);
});
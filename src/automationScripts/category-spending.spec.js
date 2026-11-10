const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { AuthHelper } = require('./helpers/auth.helper');

test.describe('Category-wise Spending Visualization - QE-10017', () => {
  let analyticsPage;
  
  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await AuthHelper.authenticate(page, 'user123');
    await analyticsPage.navigate();
  });
  
  test('QE-10017 TS-001 TC-001 - Verify category-wise spending displays accurate distribution across all 9 categories with correct totals', async ({ page }) => {
    await analyticsPage.waitForCategoryDataLoad();
    
    const categoryBreakdown = await analyticsPage.getCategoryBreakdown();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    
    expect(Object.keys(categoryBreakdown).length).toBe(9);
    expectedCategories.forEach(category => {
      expect(categoryBreakdown).toHaveProperty(category);
    });
    
    const totalSpending = Object.values(categoryBreakdown).reduce((sum, val) => sum + parseFloat(val), 0);
    expect(totalSpending.toFixed(2)).toBe('87000.00');
  });
  
  test('QE-10017 TS-001 TC-002 - Verify category-wise spending handles scenario where some categories have zero spending', async ({ page }) => {
    await AuthHelper.authenticate(page, 'user456');
    await analyticsPage.navigate();
    await analyticsPage.waitForCategoryDataLoad();
    
    const categoryBreakdown = await analyticsPage.getCategoryBreakdown();
    expect(Object.keys(categoryBreakdown).length).toBe(9);
    
    const zeroCategories = Object.entries(categoryBreakdown).filter(([key, val]) => val === '0.00');
    expect(zeroCategories.length).toBeGreaterThan(0);
  });
  
  test('QE-10017 TS-002 TC-001 - Verify unclassified transactions are automatically assigned to Miscellaneous category', async ({ page }) => {
    await AuthHelper.authenticate(page, 'user789');
    await analyticsPage.navigate();
    await analyticsPage.waitForCategoryDataLoad();
    
    const categoryBreakdown = await analyticsPage.getCategoryBreakdown();
    const miscellaneousAmount = parseFloat(categoryBreakdown['Miscellaneous']);
    
    expect(miscellaneousAmount).toBeGreaterThan(0);
    expect(miscellaneousAmount.toFixed(2)).toBe('5000.00');
  });
  
  test('QE-10017 TS-003 TC-001 - Verify time-filtered category spending for 3-month period recalculates category totals with accurate percentages and 2 decimal precision', async ({ page }) => {
    await analyticsPage.selectTimeRange(3);
    await analyticsPage.waitForCategoryDataLoad();
    
    const categoryBreakdown = await analyticsPage.getCategoryBreakdown();
    const categoryPercentages = await analyticsPage.getCategoryPercentages();
    
    Object.values(categoryBreakdown).forEach(amount => {
      expect(amount).toMatch(/^\d+\.\d{2}$/);
    });
    
    Object.values(categoryPercentages).forEach(percentage => {
      expect(percentage).toMatch(/^\d+\.\d{1}%$/);
    });
  });
  
  test('QE-10017 TS-003 TC-002 - Verify 6-month filtered category spending updates visualization correctly', async ({ page }) => {
    await analyticsPage.selectTimeRange(6);
    await analyticsPage.waitForCategoryDataLoad();
    
    const categoryBreakdown = await analyticsPage.getCategoryBreakdown();
    expect(Object.keys(categoryBreakdown).length).toBe(9);
    
    Object.values(categoryBreakdown).forEach(amount => {
      expect(amount).toMatch(/^\d+\.\d{2}$/);
    });
  });
});

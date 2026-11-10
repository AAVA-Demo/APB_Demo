const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { AuthHelper } = require('./helpers/auth.helper');

test.describe('Monthly Spend Trend Analysis - QE-10018', () => {
  let analyticsPage;
  
  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await AuthHelper.authenticate(page, 'user123');
    await analyticsPage.navigate();
  });
  
  test('QE-10018 TS-001 TC-001 - Verify monthly spend trend analysis returns accurate month-by-month breakdown for 12 months with 2 decimal precision', async ({ page }) => {
    await analyticsPage.selectTimeRange(12);
    await analyticsPage.waitForTrendsLoad();
    
    const monthlyTrends = await analyticsPage.getMonthlyTrends();
    expect(monthlyTrends.length).toBe(12);
    
    monthlyTrends.forEach(trend => {
      expect(trend.total).toMatch(/^\d+\.\d{2}$/);
    });
  });
  
  test('QE-10018 TS-001 TC-002 - Verify monthly trend analysis correctly handles months with no transactions', async ({ page }) => {
    await AuthHelper.authenticate(page, 'user456');
    await analyticsPage.navigate();
    await analyticsPage.selectTimeRange(12);
    await analyticsPage.waitForTrendsLoad();
    
    const monthlyTrends = await analyticsPage.getMonthlyTrends();
    expect(monthlyTrends.length).toBe(12);
    
    const zeroSpendMonths = monthlyTrends.filter(trend => trend.total === '0.00');
    expect(zeroSpendMonths.length).toBeGreaterThan(0);
  });
  
  test('QE-10018 TS-002 TC-001 - Verify system returns empty trend dataset with appropriate message when user has no transaction history', async ({ page }) => {
    await AuthHelper.authenticate(page, 'user999');
    await analyticsPage.navigate();
    await analyticsPage.selectTimeRange(12);
    await analyticsPage.waitForTrendsLoad();
    
    const monthlyTrends = await analyticsPage.getMonthlyTrends();
    expect(monthlyTrends.length).toBe(0);
    
    const message = await analyticsPage.getEmptyStateMessage();
    expect(message).toContain('No transaction history available');
  });
  
  test('QE-10018 TS-003 TC-001 - Verify filtered monthly spend trends for 6-month period displays accurate aggregated data with decimal precision', async ({ page }) => {
    await analyticsPage.selectTimeRange(6);
    await analyticsPage.waitForTrendsLoad();
    
    const monthlyTrends = await analyticsPage.getMonthlyTrends();
    expect(monthlyTrends.length).toBe(6);
    
    monthlyTrends.forEach(trend => {
      expect(trend.total).toMatch(/^\d+\.\d{2}$/);
    });
  });
  
  test('QE-10018 TS-003 TC-002 - Verify 3-month filtered trend analysis returns correct subset of data', async ({ page }) => {
    await analyticsPage.selectTimeRange(3);
    await analyticsPage.waitForTrendsLoad();
    
    const monthlyTrends = await analyticsPage.getMonthlyTrends();
    expect(monthlyTrends.length).toBe(3);
    
    monthlyTrends.forEach(trend => {
      expect(trend.total).toMatch(/^\d+\.\d{2}$/);
    });
  });
});

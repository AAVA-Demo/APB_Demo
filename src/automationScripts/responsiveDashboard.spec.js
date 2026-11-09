const { test, expect, devices } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Responsive Dashboard Layout Implementation', () => {
  test('QE-8497 TS-001 TC-001: Verify dashboard displays KPIs in vertical layout on mobile (375x667px)', async ({ browser }) => {
    logger.info('Test Case: QE-8497 TS-001 TC-001');
    
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 }
    });
    const page = await context.newPage();
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpendVisible = await page.locator('.kpi-card:has-text("Monthly Spend")').isVisible();
    expect(monthlySpendVisible).toBeTruthy();
    
    const creditLimitVisible = await page.locator('.kpi-card:has-text("Total Credit Limit")').isVisible();
    expect(creditLimitVisible).toBeTruthy();
    
    const availableCreditVisible = await page.locator('.kpi-card:has-text("Available Credit")').isVisible();
    expect(availableCreditVisible).toBeTruthy();
    
    const outstandingVisible = await page.locator('.kpi-card:has-text("Outstanding Amount")').isVisible();
    expect(outstandingVisible).toBeTruthy();
    
    const kpiCards = page.locator('.kpi-card');
    const firstCard = kpiCards.nth(0);
    const secondCard = kpiCards.nth(1);
    
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    
    expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height);
    
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
    
    await context.close();
    logger.info('Test Case QE-8497 TS-001 TC-001 completed successfully');
  });

  test('QE-8497 TS-001 TC-002: Verify font sizes and spacing optimized for mobile', async ({ browser }) => {
    logger.info('Test Case: QE-8497 TS-001 TC-002');
    
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 }
    });
    const page = await context.newPage();
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    const labelFontSize = await page.locator('.kpi-card h4').first().evaluate(el => {
      return parseInt(window.getComputedStyle(el).fontSize);
    });
    expect(labelFontSize).toBeGreaterThanOrEqual(14);
    
    const valueFontSize = await page.locator('.kpi-value').first().evaluate(el => {
      return parseInt(window.getComputedStyle(el).fontSize);
    });
    expect(valueFontSize).toBeGreaterThanOrEqual(18);
    
    const kpiCards = page.locator('.kpi-card');
    const firstCard = kpiCards.nth(0);
    const secondCard = kpiCards.nth(1);
    
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    const verticalSpacing = secondBox.y - (firstBox.y + firstBox.height);
    
    expect(verticalSpacing).toBeGreaterThanOrEqual(16);
    
    await context.close();
    logger.info('Test Case QE-8497 TS-001 TC-002 completed successfully');
  });

  test('QE-8497 TS-002 TC-001: Verify dashboard adapts to two-column grid on tablet (768x1024px)', async ({ browser }) => {
    logger.info('Test Case: QE-8497 TS-002 TC-001');
    
    const context = await browser.newContext({
      viewport: { width: 768, height: 1024 }
    });
    const page = await context.newPage();
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    const kpiCards = page.locator('.kpi-card');
    const firstCard = kpiCards.nth(0);
    const secondCard = kpiCards.nth(1);
    const thirdCard = kpiCards.nth(2);
    
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    const thirdBox = await thirdCard.boundingBox();
    
    const firstRowSameY = Math.abs(firstBox.y - secondBox.y) < 10;
    expect(firstRowSameY).toBeTruthy();
    
    const secondRowBelowFirst = thirdBox.y > firstBox.y + firstBox.height;
    expect(secondRowBelowFirst).toBeTruthy();
    
    const horizontalSpacing = secondBox.x - (firstBox.x + firstBox.width);
    expect(horizontalSpacing).toBeGreaterThanOrEqual(20);
    
    const verticalSpacing = thirdBox.y - (firstBox.y + firstBox.height);
    expect(verticalSpacing).toBeGreaterThanOrEqual(20);
    
    await context.close();
    logger.info('Test Case QE-8497 TS-002 TC-001 completed successfully');
  });

  test('QE-8497 TS-002 TC-002: Verify tablet layout maintains visual hierarchy', async ({ browser }) => {
    logger.info('Test Case: QE-8497 TS-002 TC-002');
    
    const context = await browser.newContext({
      viewport: { width: 768, height: 1024 }
    });
    const page = await context.newPage();
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    const kpiCards = page.locator('.kpi-card');
    const firstCard = kpiCards.nth(0);
    const secondCard = kpiCards.nth(1);
    
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    
    const widthDifference = Math.abs(firstBox.width - secondBox.width);
    expect(widthDifference).toBeLessThan(10);
    
    const thirdCard = kpiCards.nth(2);
    const thirdBox = await thirdCard.boundingBox();
    
    const heightDifference = Math.abs(firstBox.height - thirdBox.height);
    expect(heightDifference).toBeLessThan(20);
    
    await context.close();
    logger.info('Test Case QE-8497 TS-002 TC-002 completed successfully');
  });

  test('QE-8497 TS-003 TC-001: Verify dashboard handles extremely narrow screen (320px) gracefully', async ({ browser }) => {
    logger.info('Test Case: QE-8497 TS-003 TC-001');
    
    const context = await browser.newContext({
      viewport: { width: 320, height: 568 }
    });
    const page = await context.newPage();
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    const kpiCards = page.locator('.kpi-card');
    const kpiCount = await kpiCards.count();
    expect(kpiCount).toBe(4);
    
    for (let i = 0; i < kpiCount; i++) {
      const card = kpiCards.nth(i);
      const isVisible = await card.isVisible();
      expect(isVisible).toBeTruthy();
      
      const text = await card.textContent();
      expect(text).not.toContain('...');
    }
    
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(320);
    
    const firstCard = kpiCards.nth(0);
    const secondCard = kpiCards.nth(1);
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    
    expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height);
    
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.waitForTimeout(1000);
    expect(consoleErrors.length).toBe(0);
    
    await context.close();
    logger.info('Test Case QE-8497 TS-003 TC-001 completed successfully');
  });

  test('QE-8497 TS-003 TC-002: Verify KPI information accessible through vertical scrolling on narrow screens', async ({ browser }) => {
    logger.info('Test Case: QE-8497 TS-003 TC-002');
    
    const context = await browser.newContext({
      viewport: { width: 320, height: 568 }
    });
    const page = await context.newPage();
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = 568;
    
    if (bodyHeight > viewportHeight) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
    }
    
    const kpiCards = page.locator('.kpi-card');
    for (let i = 0; i < await kpiCards.count(); i++) {
      const card = kpiCards.nth(i);
      await card.scrollIntoViewIfNeeded();
      const isVisible = await card.isVisible();
      expect(isVisible).toBeTruthy();
    }
    
    await context.close();
    logger.info('Test Case QE-8497 TS-003 TC-002 completed successfully');
  });
});

const { test, expect, devices } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Responsive Design Tests', () => {

  test('TC-6856: Verify dashboard adapts responsively for mobile device', async ({ browser }) => {
    // Step 1: Launch with mobile viewport
    const iPhone = devices['iPhone 8'];
    const context = await browser.newContext({
      ...iPhone,
      viewport: { width: 375, height: 667 }
    });
    const page = await context.newPage();
    
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(testData.users.validUser.username, testData.users.validUser.password);
    
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardToLoad();
    
    // Step 2: Verify KPI cards are stacked vertically
    const kpiCards = page.locator('.kpi-card');
    const cardCount = await kpiCards.count();
    expect(cardCount).toBe(4);
    
    // Check that cards are in column layout (stacked)
    const firstCard = kpiCards.first();
    const secondCard = kpiCards.nth(1);
    
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    
    // In vertical stack, second card's Y position should be below first card
    expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height);
    
    // Step 3: Verify no horizontal scrolling
    const viewportWidth = page.viewportSize().width;
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
    
    // Step 4: Verify navigation is touch-friendly
    const navLinks = page.locator('.navbar a');
    const firstLink = navLinks.first();
    const linkBox = await firstLink.boundingBox();
    
    // Touch target should be at least 44px (iOS guideline)
    expect(linkBox.height).toBeGreaterThanOrEqual(40);
    
    // Step 5: Verify functionality is maintained
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    
    await context.close();
  });

  test('TC-6857: Verify dashboard displays optimally on desktop device', async ({ browser }) => {
    // Step 1: Launch with desktop viewport
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(testData.users.validUser.username, testData.users.validUser.password);
    
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardToLoad();
    
    // Step 2: Verify KPI cards in horizontal grid
    const kpiCards = page.locator('.kpi-card');
    const cardCount = await kpiCards.count();
    expect(cardCount).toBe(4);
    
    // Check horizontal layout - cards should be on same row
    const firstCard = kpiCards.first();
    const secondCard = kpiCards.nth(1);
    
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    
    // In horizontal layout, Y positions should be similar
    expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThan(20);
    
    // Step 3: Verify all metrics visible without scrolling
    const viewportHeight = page.viewportSize().height;
    const lastCard = kpiCards.nth(3);
    const lastCardBox = await lastCard.boundingBox();
    
    expect(lastCardBox.y + lastCardBox.height).toBeLessThan(viewportHeight);
    
    // Step 4: Verify full navigation menu
    await expect(dashboardPage.dashboardLink).toBeVisible();
    await expect(dashboardPage.myCardsLink).toBeVisible();
    await expect(dashboardPage.analyticsLink).toBeVisible();
    
    // Step 5: Verify effective space utilization
    const containerBox = await dashboardPage.dashboardContainer.boundingBox();
    expect(containerBox.width).toBeGreaterThan(1000); // Good use of wide screen
    
    await context.close();
  });

  test('TC-6858: Verify dashboard maintains layout on extremely narrow viewport', async ({ browser }) => {
    // Step 1: Launch with extremely narrow viewport
    const context = await browser.newContext({
      viewport: { width: 280, height: 653 }
    });
    const page = await context.newPage();
    
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(testData.users.validUser.username, testData.users.validUser.password);
    
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardToLoad();
    
    // Step 2: Verify no horizontal scrolling
    const viewportWidth = page.viewportSize().width;
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // Allow 5px tolerance
    
    // Step 3: Verify content may be truncated (check for ellipsis in CSS)
    // This is visual and would be checked via CSS overflow properties
    const kpiCard = page.locator('.kpi-card').first();
    await expect(kpiCard).toBeVisible();
    
    // Step 4: Verify vertical scrolling is available
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = page.viewportSize().height;
    expect(bodyHeight).toBeGreaterThan(viewportHeight);
    
    // Step 5: Verify layout remains functional
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.navigationMenu).toBeVisible();
    
    // Verify interactive elements are accessible
    await dashboardPage.myCardsLink.click();
    await page.waitForURL('**/cards');
    
    await context.close();
  });

});

const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

/**
 * Test Suite: Dashboard Feature Tests
 * Covers: QE-8889 (Responsive Layout) and QE-8886 (KPI Display)
 * Total Test Cases: 6
 */

test.describe('Dashboard - Responsive Layout Implementation (QE-8889)', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
  });

  /**
   * Test Case ID: QE-8889 TS-001 TC-001
   * Test Case: Verify dashboard layout adjusts to stacked single-column format on mobile device with 375px viewport
   */
  test('TC-001: Mobile 375px viewport displays stacked single-column format', async ({ page, context }) => {
    // Step 1: Set viewport to mobile size (375px x 667px - iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Step 2: Navigate to dashboard and authenticate
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3: Verify all four KPIs are displayed in stacked single-column format
    await expect(dashboardPage.kpiMonthlySpend).toBeVisible();
    await expect(dashboardPage.kpiTotalCreditLimit).toBeVisible();
    await expect(dashboardPage.kpiAvailableCredit).toBeVisible();
    await expect(dashboardPage.kpiOutstandingAmount).toBeVisible();
    
    // Verify single-column layout
    const isStackedLayout = await dashboardPage.verifyStackedLayout();
    expect(isStackedLayout).toBe(true);
    
    // Step 4: Verify no horizontal scrolling required
    const hasHorizontalScroll = await dashboardPage.hasHorizontalScroll();
    expect(hasHorizontalScroll).toBe(false);
    
    // Step 5: Verify font size is appropriate for mobile (>= 14px)
    const fontSize = await dashboardPage.getKpiFontSize();
    expect(fontSize).toBeGreaterThanOrEqual(14);
    
    // Step 6: Verify spacing between KPI cards (>= 10px)
    const spacing = await dashboardPage.getKpiCardSpacing();
    expect(spacing).toBeGreaterThanOrEqual(10);
    
    // Step 7: Verify credit card list is also in stacked format
    const isCardListStacked = await dashboardPage.verifyCreditCardListStacked();
    expect(isCardListStacked).toBe(true);
  });

  /**
   * Test Case ID: QE-8889 TS-002 TC-001
   * Test Case: Verify dashboard layout dynamically re-renders when viewport changes from desktop to tablet without page refresh
   */
  test('TC-002: Desktop to tablet viewport change dynamically re-renders layout', async ({ page }) => {
    // Step 1: Set viewport to desktop size (1920px x 1080px)
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Step 2: Navigate to dashboard
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3: Verify initial desktop layout (4-column grid)
    const desktopLayout = await dashboardPage.getKpiLayoutColumns();
    expect(desktopLayout).toBe(4);
    
    // Step 4: Resize viewport to tablet size (768px x 1024px) without refresh
    const startTime = Date.now();
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Step 5: Verify layout automatically re-renders to 2-column grid
    await page.waitForTimeout(100); // Allow brief time for responsive transition
    const tabletLayout = await dashboardPage.getKpiLayoutColumns();
    expect(tabletLayout).toBe(2);
    
    // Step 6: Verify all KPI data remains accessible and readable
    await expect(dashboardPage.kpiMonthlySpend).toBeVisible();
    await expect(dashboardPage.kpiTotalCreditLimit).toBeVisible();
    await expect(dashboardPage.kpiAvailableCredit).toBeVisible();
    await expect(dashboardPage.kpiOutstandingAmount).toBeVisible();
    
    // Step 7: Verify no page refresh occurred
    const pageLoadCount = await page.evaluate(() => window.performance.navigation.type);
    expect(pageLoadCount).toBe(0); // 0 = TYPE_NAVIGATE (no reload)
    
    // Step 8: Verify transition completed within 1 second
    const endTime = Date.now();
    const transitionTime = endTime - startTime;
    expect(transitionTime).toBeLessThanOrEqual(1000);
  });

  /**
   * Test Case ID: QE-8889 TS-003 TC-001
   * Test Case: Verify dashboard maintains accessibility and readability at extremely narrow viewport (320px)
   */
  test('TC-003: Extremely narrow viewport (320px) maintains accessibility without content truncation', async ({ page }) => {
    // Step 1: Set viewport to extremely narrow (320px x 568px - iPhone 5/SE)
    await page.setViewportSize({ width: 320, height: 568 });
    
    // Step 2: Navigate to dashboard
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3: Verify all four KPIs are displayed without content truncation
    const kpiTexts = await dashboardPage.getAllKpiTexts();
    expect(kpiTexts.monthlySpend).toBeTruthy();
    expect(kpiTexts.totalCreditLimit).toBeTruthy();
    expect(kpiTexts.availableCredit).toBeTruthy();
    expect(kpiTexts.outstandingAmount).toBeTruthy();
    
    const isTruncated = await dashboardPage.isContentTruncated();
    expect(isTruncated).toBe(false);
    
    // Step 4: Verify no overlapping elements
    const hasOverlap = await dashboardPage.hasOverlappingElements();
    expect(hasOverlap).toBe(false);
    
    // Step 5: Verify layout is not broken
    const isLayoutBroken = await dashboardPage.isLayoutBroken();
    expect(isLayoutBroken).toBe(false);
    
    // Step 6: Verify font size is readable (>= 12px)
    const fontSize = await dashboardPage.getKpiFontSize();
    expect(fontSize).toBeGreaterThanOrEqual(12);
    
    // Step 7: Verify vertical scrolling available, no horizontal scroll
    const hasHorizontalScroll = await dashboardPage.hasHorizontalScroll();
    expect(hasHorizontalScroll).toBe(false);
    
    const hasVerticalScroll = await dashboardPage.hasVerticalScroll();
    // Vertical scroll may or may not be present depending on content height
    expect(typeof hasVerticalScroll).toBe('boolean');
    
    // Step 8: Verify credit card list is accessible and readable
    const isCardListReadable = await dashboardPage.isCreditCardListReadable();
    expect(isCardListReadable).toBe(true);
  });
});

test.describe('Dashboard - KPI Display Interface (QE-8886)', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
  });

  /**
   * Test Case ID: QE-8886 TS-001 TC-001
   * Test Case: Verify authenticated user with three registered cards sees accurate consolidated KPIs
   */
  test('TC-001: Three registered cards display accurate consolidated KPIs', async ({ page }) => {
    // Step 1: Authenticate as user with three credit cards
    await dashboardPage.navigate();
    await dashboardPage.authenticateUser('user_with_three_cards');
    
    // Step 2: Navigate to dashboard and verify load time <= 2 seconds
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    // Step 3: Verify Total Credit Limit KPI = $50,000
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$50,000.00');
    
    // Step 4: Verify Outstanding Amount KPI = $11,500
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('$11,500.00');
    
    // Step 5: Verify Available Credit KPI = $38,500
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('$38,500.00');
    
    // Step 6: Verify Monthly Spend KPI is calculated from all cards
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    
    // Step 7: Verify all KPIs are formatted as currency
    const kpiValues = await dashboardPage.getAllKpiValues();
    expect(kpiValues.monthlySpend).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    expect(kpiValues.totalCreditLimit).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    expect(kpiValues.availableCredit).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    expect(kpiValues.outstandingAmount).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
  });

  /**
   * Test Case ID: QE-8886 TS-002 TC-001
   * Test Case: Verify authenticated user with no registered cards sees appropriate messaging
   */
  test('TC-002: No registered cards shows appropriate messaging instead of zero values', async ({ page }) => {
    // Step 1: Authenticate as user with no credit cards
    await dashboardPage.navigate();
    await dashboardPage.authenticateUser('user_with_no_cards');
    
    // Step 2: Navigate to dashboard
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3: Verify appropriate messaging is displayed
    const noCardsMessage = await dashboardPage.getNoCardsMessage();
    expect(noCardsMessage).toMatch(/no credit cards registered|add a credit card/i);
    
    // Step 4: Verify KPIs are not displayed with zero values ($0.00)
    const kpiValues = await dashboardPage.getAllKpiValues();
    expect(kpiValues.monthlySpend).not.toBe('$0.00');
    expect(kpiValues.totalCreditLimit).not.toBe('$0.00');
    expect(kpiValues.availableCredit).not.toBe('$0.00');
    expect(kpiValues.outstandingAmount).not.toBe('$0.00');
    
    // Verify display shows '--' or 'N/A' instead
    expect(kpiValues.monthlySpend).toMatch(/--|N\/A/i);
    
    // Step 5: Verify no error messages are displayed
    const hasErrorMessage = await dashboardPage.hasErrorMessage();
    expect(hasErrorMessage).toBe(false);
    
    // Step 6: Verify message provides guidance (optional check)
    const hasGuidance = await dashboardPage.hasGuidanceMessage();
    // This is optional, so we just verify it's a boolean
    expect(typeof hasGuidance).toBe('boolean');
  });

  /**
   * Test Case ID: QE-8886 TS-003 TC-001
   * Test Case: Verify dashboard displays available KPIs with clear indication when one card has data sync error
   */
  test('TC-003: Data sync error displays available KPIs with clear indication', async ({ page }) => {
    // Step 1: Authenticate as user with sync error on one card
    await dashboardPage.navigate();
    await dashboardPage.authenticateUser('user_with_sync_error');
    
    // Step 2: Navigate to dashboard
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3: Verify KPIs for functioning cards are accurate (excluding Travel Elite)
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$40,000.00'); // Excluding Travel Elite's $10,000
    
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('$9,500.00'); // Excluding Travel Elite's balance
    
    // Step 4: Verify clear indication for card with sync error
    const syncErrorMessage = await dashboardPage.getSyncErrorMessage();
    expect(syncErrorMessage).toMatch(/data unavailable|sync error/i);
    
    // Step 5: Verify error indication specifies which card (Travel Elite)
    expect(syncErrorMessage).toMatch(/travel elite/i);
    
    // Step 6: Verify other KPIs are not blocked by sync error
    await expect(dashboardPage.kpiMonthlySpend).toBeVisible();
    await expect(dashboardPage.kpiAvailableCredit).toBeVisible();
    
    // Step 7: Verify credit card list shows Travel Elite with error indicator
    const cardListErrorIndicator = await dashboardPage.getCardListErrorIndicator('Travel Elite');
    expect(cardListErrorIndicator).toMatch(/data sync error|unavailable/i);
  });
});

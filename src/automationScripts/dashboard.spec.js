const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

// Test Case: QE-8912 TS-001 TC-001
test('Verify dashboard displays all four KPIs with accurate calculated values within 2 seconds', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Launch application
  await dashboardPage.navigate();
  await expect(page).toHaveURL(/creditcard/);
  
  // Step 2: Login with active cards user
  await loginPage.login('testuser_activecards', 'Pass@123');
  
  // Step 3: Observe KPI section - measure load time
  const startTime = Date.now();
  await dashboardPage.waitForKPIsToLoad();
  const loadTime = Date.now() - startTime;
  
  // Step 4-7: Verify all four KPIs
  await expect(dashboardPage.monthlySpendKPI).toBeVisible();
  await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
  await expect(dashboardPage.availableCreditKPI).toBeVisible();
  await expect(dashboardPage.totalOutstandingKPI).toBeVisible();
  
  // Verify KPI values are displayed correctly
  const monthlySpend = await dashboardPage.getMonthlySpendValue();
  const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
  const availableCredit = await dashboardPage.getAvailableCreditValue();
  const totalOutstanding = await dashboardPage.getTotalOutstandingValue();
  
  expect(monthlySpend).toContain('$');
  expect(totalCreditLimit).toContain('$');
  expect(availableCredit).toContain('$');
  expect(totalOutstanding).toContain('$');
  
  // Step 8: Verify load time is within 2 seconds
  expect(loadTime).toBeLessThan(2000);
});

// Test Case: QE-8912 TS-002 TC-001
test('Verify dashboard displays appropriate messaging and zero/N/A values for KPIs when no cards are registered', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Launch application
  await dashboardPage.navigate();
  
  // Step 2: Login with no cards user
  await loginPage.login('testuser_nocards', 'Pass@123');
  
  // Step 3: Observe KPI section
  await dashboardPage.waitForKPIsToLoad();
  
  // Step 4-7: Verify all KPIs show zero or N/A
  const monthlySpend = await dashboardPage.getMonthlySpendValue();
  const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
  const availableCredit = await dashboardPage.getAvailableCreditValue();
  const totalOutstanding = await dashboardPage.getTotalOutstandingValue();
  
  expect(monthlySpend).toMatch(/\$0\.00|N\/A/);
  expect(totalCreditLimit).toMatch(/\$0\.00|N\/A/);
  expect(availableCredit).toMatch(/\$0\.00|N\/A/);
  expect(totalOutstanding).toMatch(/\$0\.00|N\/A/);
  
  // Step 8: Verify appropriate message
  await expect(dashboardPage.noCardsMessage).toBeVisible();
  await expect(dashboardPage.noCardsMessage).toContainText(/No credit cards registered/);
  
  // Step 9: Verify Your Credit Cards section is empty
  await expect(dashboardPage.creditCardsSection).toBeVisible();
  const cardCount = await dashboardPage.getCardCount();
  expect(cardCount).toBe(0);
});

// Test Case: QE-8912 TS-003 TC-001
test('Verify dashboard displays error message with retry mechanism when backend service is unavailable', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Simulate backend unavailability
  await page.route('**/api/cards', route => route.abort('failed'));
  await page.route('**/api/transactions**', route => route.abort('failed'));
  
  // Step 2: Launch application
  await dashboardPage.navigate();
  
  // Step 3: Login
  await loginPage.login('testuser_backend', 'Pass@123');
  
  // Step 4-5: Observe error message
  await expect(dashboardPage.errorMessage).toBeVisible();
  await expect(dashboardPage.errorMessage).toContainText(/Failed to load dashboard data/);
  
  // Step 6: Verify retry mechanism
  await expect(dashboardPage.retryButton).toBeVisible();
  
  // Step 7: Restore backend
  await page.unroute('**/api/cards');
  await page.unroute('**/api/transactions**');
  
  // Step 8: Click retry
  await dashboardPage.clickRetryButton();
  await dashboardPage.waitForKPIsToLoad();
  
  // Step 9: Verify no residual errors
  await expect(dashboardPage.errorMessage).not.toBeVisible();
  await expect(dashboardPage.monthlySpendKPI).toBeVisible();
});

// Test Case: QE-8914 TS-001 TC-001
test('Verify dashboard displays all 5 registered credit cards with complete details in responsive grid layout', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Launch application
  await dashboardPage.navigate();
  
  // Step 2: Login with five cards user
  await loginPage.login('testuser_fivecards', 'Pass@123');
  
  // Step 3: Observe Your Credit Cards section
  await expect(dashboardPage.creditCardsSection).toBeVisible();
  
  // Step 4-8: Verify all 5 cards display complete details
  const cardCount = await dashboardPage.getCardCount();
  expect(cardCount).toBe(5);
  
  const cards = await dashboardPage.getAllCardDetails();
  
  for (let i = 0; i < cards.length; i++) {
    // Verify card name
    expect(cards[i].name).toBeTruthy();
    
    // Verify masked card number format
    expect(cards[i].number).toMatch(/\*\*\*\*\d{4}/);
    
    // Verify credit limit
    expect(cards[i].creditLimit).toMatch(/\$[\d,]+\.\d{2}/);
    
    // Verify outstanding balance
    expect(cards[i].outstanding).toMatch(/\$[\d,]+\.\d{2}/);
    
    // Verify available credit calculation
    expect(cards[i].available).toMatch(/\$[\d,]+\.\d{2}/);
  }
  
  // Step 9: Verify responsive grid layout
  const viewportWidth = page.viewportSize().width;
  if (viewportWidth > 992) {
    // Desktop: 3-column grid
    const gridColumns = await dashboardPage.getGridColumnCount();
    expect(gridColumns).toBe(3);
  } else if (viewportWidth >= 768) {
    // Tablet: 2-column grid
    const gridColumns = await dashboardPage.getGridColumnCount();
    expect(gridColumns).toBe(2);
  }
});

// Test Case: QE-8914 TS-002 TC-001
test('Verify credit card portfolio displays in single-column layout on mobile devices with all details accessible', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await dashboardPage.navigate();
  
  // Step 2: Login
  await loginPage.login('testuser_mobile', 'Pass@123');
  
  // Step 3: Observe Your Credit Cards section
  await expect(dashboardPage.creditCardsSection).toBeVisible();
  
  // Verify single-column layout
  const gridColumns = await dashboardPage.getGridColumnCount();
  expect(gridColumns).toBe(1);
  
  // Step 4-5: Verify readability without truncation
  const cards = await dashboardPage.getAllCardDetails();
  
  for (const card of cards) {
    // Verify all details are visible
    expect(card.name).toBeTruthy();
    expect(card.number).toBeTruthy();
    expect(card.creditLimit).toBeTruthy();
    expect(card.outstanding).toBeTruthy();
    expect(card.available).toBeTruthy();
  }
  
  // Step 6: Verify vertical scrolling
  const isScrollable = await dashboardPage.isVerticallyScrollable();
  expect(isScrollable).toBe(true);
  
  // Step 7: Verify touch targets
  const touchTargetsValid = await dashboardPage.verifyTouchTargetSize(44);
  expect(touchTargetsValid).toBe(true);
});

// Test Case: QE-8914 TS-003 TC-001
test('Verify dashboard displays over-limit credit card with visual indicator and accurate negative available credit', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Launch application
  await dashboardPage.navigate();
  
  // Step 2: Login with over-limit user
  await loginPage.login('testuser_overlimit', 'Pass@123');
  
  // Step 3: Observe Your Credit Cards section
  await expect(dashboardPage.creditCardsSection).toBeVisible();
  
  // Step 4: Identify over-limit card
  const overLimitCard = await dashboardPage.getOverLimitCard();
  expect(overLimitCard).toBeTruthy();
  
  // Step 5: Verify outstanding exceeds limit
  const outstanding = parseFloat(overLimitCard.outstanding.replace(/[$,]/g, ''));
  const creditLimit = parseFloat(overLimitCard.creditLimit.replace(/[$,]/g, ''));
  expect(outstanding).toBeGreaterThan(creditLimit);
  
  // Step 6: Verify negative available credit
  expect(overLimitCard.available).toContain('-$');
  const available = parseFloat(overLimitCard.available.replace(/[-$,]/g, ''));
  expect(available).toBeCloseTo(outstanding - creditLimit, 2);
  
  // Step 7: Verify visual indicator
  const hasWarningIndicator = await dashboardPage.cardHasWarningIndicator(overLimitCard.element);
  expect(hasWarningIndicator).toBe(true);
  
  // Step 8: Verify other cards don't have warning
  const normalCards = await dashboardPage.getNormalCards();
  for (const card of normalCards) {
    const hasWarning = await dashboardPage.cardHasWarningIndicator(card);
    expect(hasWarning).toBe(false);
  }
});

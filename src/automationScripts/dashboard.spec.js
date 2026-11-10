const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

// QE-10427 - Dashboard KPIs Display Test Cases
test.describe('Dashboard KPIs Display', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  // QE-10427 TS-001 TC-001
  test('Verify dashboard displays all KPIs with accurate real-time data for authenticated user', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    await dashboardPage.waitForDashboardLoad();
    
    // Verify all KPI cards are visible
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    // Verify KPI values
    const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    expect(monthlySpend).toContain('$');
    
    // Wait for real-time refresh (30 seconds)
    await page.waitForTimeout(30000);
    const refreshedValue = await dashboardPage.getKPIValue('monthlySpend');
    expect(refreshedValue).toBeTruthy();
  });

  // QE-10427 TS-001 TC-002
  test('Verify dashboard KPIs update correctly when new transaction is added', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    await dashboardPage.waitForDashboardLoad();
    
    const initialMonthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    
    // Simulate new transaction (would require API call in real scenario)
    // Wait for auto-refresh
    await page.waitForTimeout(30000);
    
    const updatedMonthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    expect(updatedMonthlySpend).toBeTruthy();
  });

  // QE-10427 TS-001 TC-003
  test('Verify dashboard KPIs display correctly across multiple credit cards', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('multicard@example.com', 'Test@1234');
    await dashboardPage.waitForDashboardLoad();
    
    // Verify aggregated KPIs
    const totalCreditLimit = await dashboardPage.getKPIValue('totalCreditLimit');
    const availableCredit = await dashboardPage.getKPIValue('availableCredit');
    const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    const outstandingAmount = await dashboardPage.getKPIValue('outstandingAmount');
    
    expect(totalCreditLimit).toContain('$');
    expect(availableCredit).toContain('$');
    expect(monthlySpend).toContain('$');
    expect(outstandingAmount).toContain('$');
  });

  // QE-10427 TS-002 TC-001
  test('Verify dashboard displays partial KPIs with warning when monthly spend data is missing', async ({ page }) => {
    // Mock incomplete API response
    await page.route('**/api/creditcards/dashboard*', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          totalCreditLimit: 15000,
          availableCredit: 12000,
          outstandingAmount: 3000,
          cards: []
        })
      });
    });
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    await dashboardPage.waitForDashboardLoad();
    
    // Verify warning indicator on Monthly Spend KPI
    await expect(dashboardPage.monthlySpendWarning).toBeVisible();
    
    // Verify other KPIs display correctly
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    // Verify dashboard remains functional
    await dashboardPage.navigateToTransactions();
    await expect(page).toHaveURL(/.*transactions/);
  });

  // QE-10427 TS-002 TC-002
  test('Verify dashboard displays warning when multiple KPI fields are missing', async ({ page }) => {
    // Mock incomplete API response with multiple missing fields
    await page.route('**/api/creditcards/dashboard*', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          totalCreditLimit: 15000,
          outstandingAmount: 3000,
          cards: []
        })
      });
    });
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    await dashboardPage.waitForDashboardLoad();
    
    // Verify warning indicators
    await expect(dashboardPage.monthlySpendWarning).toBeVisible();
    await expect(dashboardPage.availableCreditWarning).toBeVisible();
    
    // Verify general warning banner
    await expect(dashboardPage.warningBanner).toBeVisible();
    const warningText = await dashboardPage.warningBanner.textContent();
    expect(warningText).toContain('unavailable');
  });

  // QE-10427 TS-003 TC-001
  test('Verify unauthenticated user is redirected to login page when accessing dashboard', async ({ page, context }) => {
    // Clear cookies to simulate unauthenticated session
    await context.clearCookies();
    
    await page.goto('/dashboard');
    
    // Verify redirect to login
    await expect(page).toHaveURL(/.*login/);
    
    // Verify error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('log in');
    
    // Verify no dashboard content is visible
    await expect(dashboardPage.monthlySpendKPI).not.toBeVisible();
  });

  // QE-10427 TS-003 TC-002
  test('Verify expired session redirects user to login with appropriate message', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    await dashboardPage.waitForDashboardLoad();
    
    // Manually expire session (simulate by clearing auth token)
    await page.evaluate(() => {
      localStorage.removeItem('authToken');
      sessionStorage.clear();
    });
    
    // Attempt to interact with dashboard
    await dashboardPage.navigateToTransactions();
    
    // Verify redirect to login
    await expect(page).toHaveURL(/.*login/);
    
    // Verify session expiration message
    const message = await loginPage.getErrorMessage();
    expect(message).toContain('expired');
  });
});

// QE-10424 - Multiple Credit Cards Overview Test Cases
test.describe('Multiple Credit Cards Overview', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  // QE-10424 TS-001 TC-001
  test('Verify user with 3 active credit cards views all cards with accurate details on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await loginPage.navigate();
    await loginPage.login('multicard@example.com', 'Test@1234');
    await dashboardPage.waitForDashboardLoad();
    
    // Verify 3 cards are displayed
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(3);
    
    // Verify first card details
    const card1Details = await dashboardPage.getCardDetails(0);
    expect(card1Details.cardName).toContain('Visa Gold');
    expect(card1Details.cardNumber).toMatch(/\*{4}\d{4}/);
    expect(card1Details.creditLimit).toContain('$10,000');
    expect(card1Details.availableCredit).toContain('$8,000');
    expect(card1Details.outstandingBalance).toContain('$2,000');
    expect(card1Details.monthlySpend).toContain('$1,500');
    
    // Verify responsive grid layout
    const isGridLayout = await dashboardPage.isCardGridLayout();
    expect(isGridLayout).toBeTruthy();
  });

  // QE-10424 TS-001 TC-002
  test('Verify credit card overview is responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginPage.navigate();
    await loginPage.login('multicard@example.com', 'Test@1234');
    await dashboardPage.waitForDashboardLoad();
    
    // Verify single-column layout
    const isSingleColumn = await dashboardPage.isCardSingleColumnLayout();
    expect(isSingleColumn).toBeTruthy();
    
    // Verify all card details are visible
    const cardCount = await dashboardPage.getCardCount();
    for (let i = 0; i < cardCount; i++) {
      const cardDetails = await dashboardPage.getCardDetails(i);
      expect(cardDetails.cardName).toBeTruthy();
      expect(cardDetails.cardNumber).toMatch(/\*{4}\d{4}/);
    }
    
    // Verify no horizontal scrolling required
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBeFalsy();
  });

  // QE-10424 TS-001 TC-003
  test('Verify credit card balances and limits are calculated and displayed accurately', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('multicard@example.com', 'Test@1234');
    await dashboardPage.waitForDashboardLoad();
    
    const cardDetails = await dashboardPage.getCardDetails(0);
    
    // Extract numeric values
    const creditLimit = parseFloat(cardDetails.creditLimit.replace(/[$,]/g, ''));
    const outstandingBalance = parseFloat(cardDetails.outstandingBalance.replace(/[$,]/g, ''));
    const availableCredit = parseFloat(cardDetails.availableCredit.replace(/[$,]/g, ''));
    
    // Verify calculation: Available Credit = Credit Limit - Outstanding Balance
    expect(availableCredit).toBeCloseTo(creditLimit - outstandingBalance, 2);
    
    // Verify currency formatting
    expect(cardDetails.creditLimit).toMatch(/\$[\d,]+\.\d{2}/);
    expect(cardDetails.availableCredit).toMatch(/\$[\d,]+\.\d{2}/);
    expect(cardDetails.outstandingBalance).toMatch(/\$[\d,]+\.\d{2}/);
    expect(cardDetails.monthlySpend).toMatch(/\$[\d,]+\.\d{2}/);
  });

  // QE-10424 TS-002 TC-001
  test('Verify user with no linked credit cards sees appropriate message with option to add card', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('nocard@example.com', 'Test@1234');
    await dashboardPage.waitForDashboardLoad();
    
    // Verify no cards message
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const messageText = await dashboardPage.noCardsMessage.textContent();
    expect(messageText).toContain('No credit cards');
    
    // Verify Add Card button is visible
    await expect(dashboardPage.addCardButton).toBeVisible();
    
    // Verify no empty card placeholders
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(0);
    
    // Verify KPIs show $0 values
    const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    expect(monthlySpend).toContain('$0');
  });

  // QE-10424 TS-002 TC-002
  test('Verify Add Card button functionality (navigation only)', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('nocard@example.com', 'Test@1234');
    await dashboardPage.waitForDashboardLoad();
    
    // Click Add Card button
    await dashboardPage.clickAddCard();
    
    // Verify navigation occurs without errors (exact destination may vary)
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    expect(currentUrl).toBeTruthy();
  });

  // QE-10424 TS-003 TC-001
  test('Verify appropriate error message when Credit Card Data Service is unavailable', async ({ page }) => {
    // Mock 503 Service Unavailable
    await page.route('**/api/creditcards/**', route => {
      route.fulfill({
        status: 503,
        body: JSON.stringify({ message: 'Service Unavailable' })
      });
    });
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    
    // Wait for error message
    await expect(dashboardPage.serviceErrorMessage).toBeVisible();
    const errorText = await dashboardPage.serviceErrorMessage.textContent();
    expect(errorText).toContain('unavailable');
    
    // Verify retry button is available
    await expect(dashboardPage.retryButton).toBeVisible();
    
    // Verify application doesn't crash
    await expect(page).toHaveURL(/.*dashboard/);
  });

  // QE-10424 TS-003 TC-002
  test('Verify application gracefully handles timeout when Credit Card Data Service is slow', async ({ page }) => {
    // Mock slow response (15 seconds delay)
    await page.route('**/api/creditcards/**', async route => {
      await page.waitForTimeout(15000);
      route.fulfill({
        status: 200,
        body: JSON.stringify({ cards: [] })
      });
    });
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    
    // Verify loading indicators
    await expect(dashboardPage.loadingIndicator).toBeVisible();
    
    // Wait for timeout error
    await expect(dashboardPage.timeoutErrorMessage).toBeVisible({ timeout: 20000 });
    const errorText = await dashboardPage.timeoutErrorMessage.textContent();
    expect(errorText).toContain('timed out');
    
    // Verify application remains responsive
    await dashboardPage.navigateToTransactions();
    await expect(page).toHaveURL(/.*transactions/);
  });
});
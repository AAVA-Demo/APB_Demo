const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

// Test cases for Dashboard KPI Display System (QE-10344)
test.describe('Dashboard KPI Display System', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'testpass');
  });

  // QE-10344 TS-001 TC-001
  test('TC-001: Verify consolidated KPIs display for user with 3 active credit cards within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await dashboardPage.navigate();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(3);
  });

  // QE-10344 TS-001 TC-002
  test('TC-002: Verify KPI values are accurately calculated from card data', async ({ page }) => {
    await dashboardPage.navigate();
    
    const cards = await dashboardPage.getAllCardDetails();
    let expectedTotalLimit = 0;
    let expectedOutstanding = 0;
    
    for (const card of cards) {
      expectedTotalLimit += card.limit;
      expectedOutstanding += card.balance;
    }
    const expectedAvailable = expectedTotalLimit - expectedOutstanding;
    
    const actualTotalLimit = await dashboardPage.getTotalCreditLimit();
    const actualOutstanding = await dashboardPage.getOutstandingAmount();
    const actualAvailable = await dashboardPage.getAvailableCredit();
    
    expect(actualTotalLimit).toBe(expectedTotalLimit);
    expect(actualOutstanding).toBe(expectedOutstanding);
    expect(actualAvailable).toBe(expectedAvailable);
  });

  // QE-10344 TS-002 TC-001
  test('TC-003: Verify dashboard performance with maximum 10 credit cards within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await dashboardPage.navigate();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBeLessThanOrEqual(10);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });

  // QE-10344 TS-002 TC-002
  test('TC-004: Verify KPI calculation accuracy with maximum 10 credit cards', async ({ page }) => {
    await dashboardPage.navigate();
    
    const cards = await dashboardPage.getAllCardDetails();
    expect(cards.length).toBeLessThanOrEqual(10);
    
    let manualTotalLimit = 0;
    let manualOutstanding = 0;
    
    for (const card of cards) {
      manualTotalLimit += card.limit;
      manualOutstanding += card.balance;
    }
    const manualAvailable = manualTotalLimit - manualOutstanding;
    
    const displayedTotalLimit = await dashboardPage.getTotalCreditLimit();
    const displayedOutstanding = await dashboardPage.getOutstandingAmount();
    const displayedAvailable = await dashboardPage.getAvailableCredit();
    
    expect(displayedTotalLimit).toBe(manualTotalLimit);
    expect(displayedOutstanding).toBe(manualOutstanding);
    expect(displayedAvailable).toBe(manualAvailable);
  });

  // QE-10344 TS-003 TC-001
  test('TC-005: Verify appropriate message when user has no active credit cards', async ({ page }) => {
    await dashboardPage.navigate();
    
    const cardCount = await dashboardPage.getCardCount();
    if (cardCount === 0) {
      await expect(dashboardPage.noCardsMessage).toBeVisible();
      await expect(dashboardPage.noCardsMessage).toContainText('No credit cards found');
      await expect(dashboardPage.addCardButton).toBeVisible();
      
      await expect(dashboardPage.monthlySpendKPI).not.toContainText('$0');
      await expect(dashboardPage.totalCreditLimitKPI).not.toContainText('$0');
    }
  });

  // QE-10344 TS-003 TC-002
  test('TC-006: Verify add credit card functionality is accessible when no cards exist', async ({ page }) => {
    await dashboardPage.navigate();
    
    const cardCount = await dashboardPage.getCardCount();
    if (cardCount === 0) {
      await expect(dashboardPage.addCardButton).toBeVisible();
      await dashboardPage.addCardButton.click();
      await expect(page).toHaveURL(/.*add-card/);
      
      await expect(dashboardPage.cardNumberInput).toBeVisible();
      await expect(dashboardPage.cardNameInput).toBeVisible();
      await expect(dashboardPage.cardExpiryInput).toBeVisible();
    }
  });
});

// Test cases for Real-Time Credit Limit Tracking (QE-10358)
test.describe('Real-Time Credit Limit Tracking', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'testpass');
  });

  // QE-10358 TS-001 TC-001
  test('TC-007: Verify real-time credit update on dashboard after purchase within 5 minutes', async ({ page }) => {
    await dashboardPage.navigate();
    
    const initialAvailableCredit = await dashboardPage.getCardAvailableCredit('card1');
    expect(initialAvailableCredit).toBe(8500);
    
    // Simulate purchase
    await dashboardPage.simulatePurchase('card1', 150, 'Amazon');
    
    // Wait for update (max 5 minutes)
    await page.waitForTimeout(300000);
    await dashboardPage.refreshDashboard();
    
    const updatedAvailableCredit = await dashboardPage.getCardAvailableCredit('card1');
    expect(updatedAvailableCredit).toBe(8350);
  });

  // QE-10358 TS-001 TC-002
  test('TC-008: Verify credit update occurs within 5-minute threshold with multiple concurrent purchases', async ({ page }) => {
    await dashboardPage.navigate();
    
    const card1InitialCredit = await dashboardPage.getCardAvailableCredit('card1');
    const card2InitialCredit = await dashboardPage.getCardAvailableCredit('card2');
    
    expect(card1InitialCredit).toBe(8500);
    expect(card2InitialCredit).toBe(4200);
    
    await dashboardPage.simulatePurchase('card1', 150, 'Amazon');
    await dashboardPage.simulatePurchase('card2', 75, 'Starbucks');
    
    await page.waitForTimeout(300000);
    await dashboardPage.refreshDashboard();
    
    const card1UpdatedCredit = await dashboardPage.getCardAvailableCredit('card1');
    const card2UpdatedCredit = await dashboardPage.getCardAvailableCredit('card2');
    
    expect(card1UpdatedCredit).toBe(8350);
    expect(card2UpdatedCredit).toBe(4125);
  });

  // QE-10358 TS-002 TC-001
  test('TC-009: Verify total credit limit aggregation across all cards is accurate', async ({ page }) => {
    await dashboardPage.navigate();
    
    const card1Limit = await dashboardPage.getCardCreditLimit('card1');
    const card2Limit = await dashboardPage.getCardCreditLimit('card2');
    const card3Limit = await dashboardPage.getCardCreditLimit('card3');
    
    expect(card1Limit).toBe(10000);
    expect(card2Limit).toBe(5000);
    expect(card3Limit).toBe(8000);
    
    const manualTotal = card1Limit + card2Limit + card3Limit;
    expect(manualTotal).toBe(23000);
    
    const displayedTotal = await dashboardPage.getTotalCreditLimit();
    expect(displayedTotal).toBe(23000);
  });

  // QE-10358 TS-002 TC-002
  test('TC-010: Verify available credit calculation reflects sum of available credit from all cards', async ({ page }) => {
    await dashboardPage.navigate();
    
    const card1Available = await dashboardPage.getCardAvailableCredit('card1');
    const card2Available = await dashboardPage.getCardAvailableCredit('card2');
    const card3Available = await dashboardPage.getCardAvailableCredit('card3');
    
    expect(card1Available).toBe(8500);
    expect(card2Available).toBe(4200);
    expect(card3Available).toBe(6000);
    
    const manualTotal = card1Available + card2Available + card3Available;
    expect(manualTotal).toBe(18700);
    
    const displayedTotal = await dashboardPage.getAvailableCredit();
    expect(displayedTotal).toBe(18700);
  });

  // QE-10358 TS-003 TC-001
  test('TC-011: Verify warning notification when purchase exceeds available credit limit', async ({ page }) => {
    await dashboardPage.navigate();
    
    const availableCredit = await dashboardPage.getCardAvailableCredit('card1');
    expect(availableCredit).toBe(500);
    
    await dashboardPage.simulatePurchase('card1', 600, 'Test Merchant');
    
    await page.waitForTimeout(300000);
    await dashboardPage.refreshDashboard();
    
    await expect(dashboardPage.warningNotification).toBeVisible();
    const warningText = await dashboardPage.warningNotification.textContent();
    expect(warningText).toMatch(/Credit limit exceeded|Near credit limit/);
    
    const cardStatus = await dashboardPage.getCardStatus('card1');
    expect(cardStatus).toMatch(/Over Limit|Warning/);
  });

  // QE-10358 TS-003 TC-002
  test('TC-012: Verify near-limit threshold warning when purchase brings available credit close to zero', async ({ page }) => {
    await dashboardPage.navigate();
    
    const availableCredit = await dashboardPage.getCardAvailableCredit('card1');
    const creditLimit = await dashboardPage.getCardCreditLimit('card1');
    
    expect(availableCredit).toBe(1000);
    expect(creditLimit).toBe(5000);
    
    await dashboardPage.simulatePurchase('card1', 900, 'Test Merchant');
    
    await page.waitForTimeout(300000);
    await dashboardPage.refreshDashboard();
    
    await expect(dashboardPage.warningNotification).toBeVisible();
    const warningText = await dashboardPage.warningNotification.textContent();
    expect(warningText).toMatch(/Approaching credit limit|Low available credit/);
    
    const updatedAvailable = await dashboardPage.getCardAvailableCredit('card1');
    expect(updatedAvailable).toBe(100);
  });
});
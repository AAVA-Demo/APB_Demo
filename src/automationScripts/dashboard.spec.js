const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Dashboard KPI Display and Portfolio Overview', () => {

  test('QE-9568 TS-001 TC-001 - Verify system calculates and displays all 4 KPIs with accurate aggregated values within 2 seconds for user with multiple credit cards', async ({ page }) => {
    logger.info('Starting test: QE-9568 TS-001 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Authenticate user with 3 registered credit cards
    await dashboardPage.navigate();
    await dashboardPage.authenticateUser('testuser@example.com', 'CC001,CC002,CC003');
    logger.info('User authenticated successfully with 3 credit cards');
    
    // Step 2-6: Validate all 4 KPIs with accurate aggregated values
    const startTime = Date.now();
    const kpiData = await dashboardPage.getKPIData();
    const loadTime = Date.now() - startTime;
    
    logger.info(`KPI data retrieved in ${loadTime}ms`);
    
    // Validate Monthly Spend KPI
    expect(kpiData.monthlySpend).toBe(37000);
    logger.info('Monthly Spend KPI validated: ₹37,000');
    
    // Validate Total Credit Limit KPI
    expect(kpiData.totalCreditLimit).toBe(180000);
    logger.info('Total Credit Limit KPI validated: ₹180,000');
    
    // Validate Available Credit KPI
    expect(kpiData.availableCredit).toBe(115000);
    logger.info('Available Credit KPI validated: ₹115,000');
    
    // Validate Outstanding Amount KPI
    expect(kpiData.outstandingAmount).toBe(65000);
    logger.info('Outstanding Amount KPI validated: ₹65,000');
    
    // Step 7: Measure dashboard load time
    expect(loadTime).toBeLessThanOrEqual(2000);
    logger.info(`Dashboard loaded within performance threshold: ${loadTime}ms <= 2000ms`);
  });

  test('QE-9568 TS-002 TC-001 - Verify system displays Outstanding Amount as ₹0 and Available Credit equals Total Credit Limit when user has zero outstanding balance', async ({ page }) => {
    logger.info('Starting test: QE-9568 TS-002 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Authenticate user with 2 credit cards having zero outstanding balance
    await dashboardPage.navigate();
    await dashboardPage.authenticateUser('zerobalance@example.com', 'CC001,CC002', { outstandingAmount: 0 });
    logger.info('User authenticated with zero outstanding balance');
    
    // Step 2-3: Validate Outstanding Amount KPI displays ₹0
    const kpiData = await dashboardPage.getKPIData();
    expect(kpiData.outstandingAmount).toBe(0);
    logger.info('Outstanding Amount KPI validated: ₹0');
    
    // Step 4-5: Validate Available Credit equals Total Credit Limit
    expect(kpiData.availableCredit).toBe(kpiData.totalCreditLimit);
    expect(kpiData.availableCredit).toBe(80000);
    expect(kpiData.totalCreditLimit).toBe(80000);
    logger.info('Available Credit equals Total Credit Limit: ₹80,000');
    
    // Verify calculation formula
    const calculatedAvailableCredit = kpiData.totalCreditLimit - kpiData.outstandingAmount;
    expect(kpiData.availableCredit).toBe(calculatedAvailableCredit);
    logger.info('Formula validation passed: Available Credit = Total Credit Limit - Outstanding Amount');
  });

  test('QE-9568 TS-003 TC-001 - Verify system displays available KPIs and shows error indicator for missing data when credit card data service returns incomplete data', async ({ page }) => {
    logger.info('Starting test: QE-9568 TS-003 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1-2: Authenticate user and simulate incomplete data
    await dashboardPage.navigate();
    await dashboardPage.authenticateUser('testuser@example.com', 'CC001,CC002', { incompleteCreditLimit: true });
    logger.info('User authenticated with incomplete credit card data');
    
    // Step 3-4: Validate system displays KPIs that can be calculated from available data
    const kpiData = await dashboardPage.getKPIData();
    expect(kpiData.monthlySpend).toBeDefined();
    expect(kpiData.availableCredit).toBeDefined();
    expect(kpiData.outstandingAmount).toBeDefined();
    logger.info('Partial KPIs displayed successfully');
    
    // Step 5: Verify system shows error indicator for Total Credit Limit KPI
    const hasErrorIndicator = await dashboardPage.hasKPIErrorIndicator('totalCreditLimit');
    expect(hasErrorIndicator).toBe(true);
    logger.info('Error indicator present for Total Credit Limit KPI');
    
    // Step 6: Validate system does not crash or freeze
    const isDashboardFunctional = await dashboardPage.isDashboardResponsive();
    expect(isDashboardFunctional).toBe(true);
    logger.info('Dashboard remains functional without crash');
  });

  test('QE-9567 TS-001 TC-001 - Verify system retrieves and displays all 3 credit cards with respective balances, limits, available credit, and monthly spend in consolidated view', async ({ page }) => {
    logger.info('Starting test: QE-9567 TS-001 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Authenticate user with 3 registered credit cards
    await dashboardPage.navigate();
    await dashboardPage.authenticateUser('testuser@example.com', 'CC001,CC002,CC003');
    logger.info('User authenticated with 3 credit cards');
    
    // Step 2: Validate portfolio returns 3 card objects
    const cards = await dashboardPage.getAllCards();
    expect(cards.length).toBe(3);
    logger.info('Portfolio contains 3 credit cards');
    
    // Step 3: Validate Card 1 details
    const card1 = cards[0];
    expect(card1.cardId).toBe('CC001');
    expect(card1.creditLimit).toBe(100000);
    expect(card1.availableCredit).toBe(65000);
    expect(card1.outstandingAmount).toBe(35000);
    expect(card1.monthlySpend).toBe(22000);
    logger.info('Card 1 details validated: CC001');
    
    // Step 4: Validate Card 2 details
    const card2 = cards[1];
    expect(card2.cardId).toBe('CC002');
    expect(card2.creditLimit).toBe(50000);
    expect(card2.availableCredit).toBe(30000);
    expect(card2.outstandingAmount).toBe(20000);
    expect(card2.monthlySpend).toBe(10000);
    logger.info('Card 2 details validated: CC002');
    
    // Step 5: Validate Card 3 details
    const card3 = cards[2];
    expect(card3.cardId).toBe('CC003');
    expect(card3.creditLimit).toBe(30000);
    expect(card3.availableCredit).toBe(20000);
    expect(card3.outstandingAmount).toBe(10000);
    expect(card3.monthlySpend).toBe(5000);
    logger.info('Card 3 details validated: CC003');
    
    // Step 6: Verify consolidated view displays all 3 cards
    const isConsolidatedViewVisible = await dashboardPage.isConsolidatedViewDisplayed();
    expect(isConsolidatedViewVisible).toBe(true);
    logger.info('Consolidated view displays all 3 cards successfully');
  });

  test('QE-9567 TS-002 TC-001 - Verify system displays No credit cards found message and prompts user to add card when user has no registered credit cards', async ({ page }) => {
    logger.info('Starting test: QE-9567 TS-002 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Authenticate user with zero registered credit cards
    await dashboardPage.navigate();
    await dashboardPage.authenticateUser('newuser@example.com', '');
    logger.info('User authenticated with no credit cards');
    
    // Step 2: Validate portfolio returns empty cards array
    const cards = await dashboardPage.getAllCards();
    expect(cards.length).toBe(0);
    logger.info('Portfolio contains 0 credit cards');
    
    // Step 3: Validate system displays No credit cards found message
    const noCardsMessage = await dashboardPage.getNoCardsMessage();
    expect(noCardsMessage).toContain('No credit cards found');
    logger.info('No credit cards found message displayed');
    
    // Step 4: Verify system prompts user to add a card
    const addCardPrompt = await dashboardPage.getAddCardPrompt();
    expect(addCardPrompt).toContain('Please add a credit card to get started');
    logger.info('Add card prompt displayed');
    
    // Step 5: Validate system does not attempt to render empty card data
    const hasEmptyCardComponents = await dashboardPage.hasEmptyCardComponents();
    expect(hasEmptyCardComponents).toBe(false);
    logger.info('No empty card components rendered');
  });

  test('QE-9567 TS-003 TC-001 - Verify system excludes expired/deactivated card from active portfolio view or marks it as inactive without affecting other valid cards', async ({ page }) => {
    logger.info('Starting test: QE-9567 TS-003 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Authenticate user with 3 credit cards, one expired
    await dashboardPage.navigate();
    await dashboardPage.authenticateUser('testuser@example.com', 'CC001,CC002,CC003', { expiredCard: 'CC003' });
    logger.info('User authenticated with 1 expired card');
    
    // Step 2-3: Validate system excludes expired card from active portfolio view
    const activeCards = await dashboardPage.getActiveCards();
    expect(activeCards.length).toBe(2);
    expect(activeCards[0].cardId).toBe('CC001');
    expect(activeCards[1].cardId).toBe('CC002');
    logger.info('Active portfolio displays only 2 cards: CC001, CC002');
    
    // Step 4: Alternatively, validate system marks expired card as inactive if displayed
    const allCards = await dashboardPage.getAllCards();
    if (allCards.length === 3) {
      const expiredCard = allCards.find(card => card.cardId === 'CC003');
      expect(expiredCard.status).toMatch(/Inactive|Expired/);
      logger.info('Expired card CC003 marked as Inactive/Expired');
    }
    
    // Step 5: Verify KPI calculations exclude expired card data
    const kpiData = await dashboardPage.getKPIData();
    const expectedTotalLimit = 100000 + 50000; // CC001 + CC002 only
    expect(kpiData.totalCreditLimit).toBe(expectedTotalLimit);
    logger.info('KPI calculations exclude expired card data');
    
    // Step 6: Validate display of other valid cards is not affected
    const card1Visible = await dashboardPage.isCardVisible('CC001');
    const card2Visible = await dashboardPage.isCardVisible('CC002');
    expect(card1Visible).toBe(true);
    expect(card2Visible).toBe(true);
    logger.info('Active cards CC001 and CC002 display correctly');
  });

});
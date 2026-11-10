const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Dashboard KPIs and Available Credit Tests', () => {

  test('QE-9373 TS-001 TC-001 - Verify dashboard KPIs display for user with multiple credit cards within 2 seconds', async ({ page }) => {
    logger.info('Starting test: QE-9373 TS-001 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Launch application
    logger.info('Step 1: Launching Credit Card Analysis Dashboard');
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/login/);
    logger.info('Login page loaded successfully');
    
    // Step 2: Authenticate as user with multiple cards
    logger.info('Step 2: Authenticating as testuser_multi_cards');
    await dashboardPage.login('testuser_multi_cards', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('User authenticated and redirected to dashboard');
    
    // Step 3-5: Record load time and verify dashboard loads within 2 seconds
    logger.info('Step 3-5: Recording dashboard load time');
    const startTime = Date.now();
    await dashboardPage.waitForDashboardToLoad();
    const loadTime = Date.now() - startTime;
    logger.info(`Dashboard load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    // Step 6: Verify Monthly Spend KPI
    logger.info('Step 6: Verifying Monthly Spend KPI');
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBeDefined();
    expect(parseFloat(monthlySpend.replace(/[^0-9.-]+/g, ''))).toBeGreaterThan(0);
    logger.info(`Monthly Spend KPI: ${monthlySpend}`);
    
    // Step 7: Verify Total Credit Limit KPI
    logger.info('Step 7: Verifying Total Credit Limit KPI');
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBeDefined();
    expect(parseFloat(totalCreditLimit.replace(/[^0-9.-]+/g, ''))).toBeGreaterThan(0);
    logger.info(`Total Credit Limit KPI: ${totalCreditLimit}`);
    
    // Step 8: Verify Available Credit KPI
    logger.info('Step 8: Verifying Available Credit KPI');
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBeDefined();
    expect(parseFloat(availableCredit.replace(/[^0-9.-]+/g, ''))).toBeGreaterThan(0);
    logger.info(`Available Credit KPI: ${availableCredit}`);
    
    // Step 9: Verify Outstanding Amounts KPI
    logger.info('Step 9: Verifying Outstanding Amounts KPI');
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBeDefined();
    expect(parseFloat(outstandingAmount.replace(/[^0-9.-]+/g, ''))).toBeGreaterThan(0);
    logger.info(`Outstanding Amount KPI: ${outstandingAmount}`);
    
    logger.info('Test QE-9373 TS-001 TC-001 completed successfully');
  });

  test('QE-9373 TS-002 TC-001 - Verify dashboard displays zero KPIs for user with no credit cards', async ({ page }) => {
    logger.info('Starting test: QE-9373 TS-002 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1-2: Launch and authenticate
    logger.info('Step 1-2: Launching and authenticating as testuser_no_cards');
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_no_cards', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Wait for dashboard to load
    logger.info('Step 3: Waiting for dashboard to load');
    await dashboardPage.waitForDashboardToLoad();
    
    // Step 4-7: Verify all KPIs display $0.00
    logger.info('Step 4-7: Verifying all KPIs display $0.00');
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    
    expect(monthlySpend).toContain('0.00');
    expect(totalCreditLimit).toContain('0.00');
    expect(availableCredit).toContain('0.00');
    expect(outstandingAmount).toContain('0.00');
    logger.info('All KPIs correctly display $0.00');
    
    // Step 8: Verify prompt message
    logger.info('Step 8: Verifying prompt message to add credit cards');
    const promptMessage = await dashboardPage.getNoCardsMessage();
    expect(promptMessage).toContain('No credit cards registered');
    expect(promptMessage).toContain('add credit cards');
    logger.info(`Prompt message displayed: ${promptMessage}`);
    
    logger.info('Test QE-9373 TS-002 TC-001 completed successfully');
  });

  test('QE-9373 TS-003 TC-001 - Verify dashboard handles delayed service response gracefully', async ({ page }) => {
    logger.info('Starting test: QE-9373 TS-003 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1-3: Launch, configure delay simulation, and authenticate
    logger.info('Step 1-3: Launching with simulated 5-second delay');
    await page.route('**/api/creditcards', async route => {
      await new Promise(resolve => setTimeout(resolve, 5000));
      await route.continue();
    });
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_multi_cards', 'Test@123');
    
    // Step 4: Verify loading indicator is displayed
    logger.info('Step 4: Verifying loading indicator is displayed');
    const loadingIndicatorVisible = await dashboardPage.isLoadingIndicatorVisible();
    expect(loadingIndicatorVisible).toBeTruthy();
    logger.info('Loading indicator displayed successfully');
    
    // Step 5-7: Wait for response and verify data or timeout message
    logger.info('Step 5-7: Waiting for service response');
    const dataLoaded = await dashboardPage.waitForDataOrTimeout(10000);
    
    if (dataLoaded) {
      logger.info('Step 6: Data loaded successfully after delay');
      const monthlySpend = await dashboardPage.getMonthlySpendValue();
      const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
      const availableCredit = await dashboardPage.getAvailableCreditValue();
      const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
      
      expect(monthlySpend).toBeDefined();
      expect(totalCreditLimit).toBeDefined();
      expect(availableCredit).toBeDefined();
      expect(outstandingAmount).toBeDefined();
      logger.info('All KPIs displayed correctly after delay');
    } else {
      logger.info('Step 7: Timeout occurred, verifying error message');
      const errorMessage = await dashboardPage.getErrorMessage();
      expect(errorMessage).toContain('Failed to load dashboard data');
      logger.info(`Error message displayed: ${errorMessage}`);
    }
    
    logger.info('Test QE-9373 TS-003 TC-001 completed successfully');
  });

  test('QE-9372 TS-001 TC-001 - Verify accurate available credit calculation for three cards', async ({ page }) => {
    logger.info('Starting test: QE-9372 TS-001 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1-3: Launch, authenticate, and wait for dashboard
    logger.info('Step 1-3: Launching and authenticating as testuser_three_cards');
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_three_cards', 'Test@123');
    await dashboardPage.waitForDashboardToLoad();
    
    // Step 4-6: Retrieve card details
    logger.info('Step 4-6: Retrieving card details for all three cards');
    const cards = await dashboardPage.getAllCardDetails();
    expect(cards.length).toBe(3);
    
    const card1 = cards[0];
    const card2 = cards[1];
    const card3 = cards[2];
    
    logger.info(`Card 1: Limit=${card1.creditLimit}, Outstanding=${card1.outstandingAmount}`);
    logger.info(`Card 2: Limit=${card2.creditLimit}, Outstanding=${card2.outstandingAmount}`);
    logger.info(`Card 3: Limit=${card3.creditLimit}, Outstanding=${card3.outstandingAmount}`);
    
    // Step 7: Calculate expected available credit
    logger.info('Step 7: Calculating expected available credit');
    const expectedAvailableCredit = (card1.creditLimit - card1.outstandingAmount) + 
                                    (card2.creditLimit - card2.outstandingAmount) + 
                                    (card3.creditLimit - card3.outstandingAmount);
    logger.info(`Expected Available Credit: $${expectedAvailableCredit.toFixed(2)}`);
    
    // Step 8: Verify Available Credit KPI matches calculation
    logger.info('Step 8: Verifying Available Credit KPI matches expected value');
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const actualAvailableCredit = parseFloat(availableCredit.replace(/[^0-9.-]+/g, ''));
    expect(actualAvailableCredit).toBeCloseTo(expectedAvailableCredit, 2);
    logger.info(`Available Credit KPI: ${availableCredit} matches expected value`);
    
    logger.info('Test QE-9372 TS-001 TC-001 completed successfully');
  });

  test('QE-9372 TS-002 TC-001 - Verify available credit displays zero with warning for overlimit card', async ({ page }) => {
    logger.info('Starting test: QE-9372 TS-002 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1-3: Launch, authenticate, and wait for dashboard
    logger.info('Step 1-3: Launching and authenticating as testuser_overlimit');
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_overlimit', 'Test@123');
    await dashboardPage.waitForDashboardToLoad();
    
    // Step 4: Retrieve overlimit card details
    logger.info('Step 4: Retrieving overlimit card details');
    const cards = await dashboardPage.getAllCardDetails();
    const overlimitCard = cards.find(card => card.outstandingAmount > card.creditLimit);
    expect(overlimitCard).toBeDefined();
    logger.info(`Overlimit Card: Limit=${overlimitCard.creditLimit}, Outstanding=${overlimitCard.outstandingAmount}`);
    
    // Step 5-6: Verify available credit is $0.00 or negative handled appropriately
    logger.info('Step 5-6: Verifying available credit displays $0.00 or handles negative value');
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const actualAvailableCredit = parseFloat(availableCredit.replace(/[^0-9.-]+/g, ''));
    expect(actualAvailableCredit).toBeLessThanOrEqual(0);
    logger.info(`Available Credit KPI: ${availableCredit}`);
    
    // Step 7: Verify warning indicator is displayed
    logger.info('Step 7: Verifying warning indicator is displayed');
    const warningVisible = await dashboardPage.isWarningIndicatorVisible();
    expect(warningVisible).toBeTruthy();
    const warningMessage = await dashboardPage.getWarningMessage();
    expect(warningMessage).toMatch(/credit limit exceeded|overlimit/i);
    logger.info(`Warning indicator displayed with message: ${warningMessage}`);
    
    logger.info('Test QE-9372 TS-002 TC-001 completed successfully');
  });

  test('QE-9372 TS-003 TC-001 - Verify partial calculation with error indicator for incomplete data', async ({ page }) => {
    logger.info('Starting test: QE-9372 TS-003 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1-3: Launch with incomplete data simulation and authenticate
    logger.info('Step 1-3: Launching with incomplete data simulation');
    await page.route('**/api/creditcards', async route => {
      const response = await route.fetch();
      const json = await response.json();
      // Simulate incomplete data
      if (json.length > 0) {
        json[0].outstandingAmount = null;
        if (json.length > 1) {
          json[1].creditLimit = null;
        }
      }
      await route.fulfill({ response, json });
    });
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_incomplete_data', 'Test@123');
    await dashboardPage.waitForDashboardToLoad();
    
    // Step 4-5: Verify partial calculation is displayed
    logger.info('Step 4-5: Verifying partial calculation is displayed');
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBeDefined();
    logger.info(`Available Credit KPI (partial): ${availableCredit}`);
    
    // Step 6: Verify error indicator for affected cards
    logger.info('Step 6: Verifying error indicator for affected cards');
    const errorIndicatorVisible = await dashboardPage.isErrorIndicatorVisible();
    expect(errorIndicatorVisible).toBeTruthy();
    const errorMessage = await dashboardPage.getErrorIndicatorMessage();
    expect(errorMessage).toMatch(/incomplete data|unavailable/i);
    logger.info(`Error indicator displayed: ${errorMessage}`);
    
    // Step 7: Verify card summaries show N/A or error markers
    logger.info('Step 7: Verifying card summaries show N/A for incomplete fields');
    const cards = await dashboardPage.getAllCardDetails();
    const incompleteCards = cards.filter(card => 
      card.creditLimit === null || card.outstandingAmount === null
    );
    expect(incompleteCards.length).toBeGreaterThan(0);
    logger.info(`Found ${incompleteCards.length} cards with incomplete data`);
    
    logger.info('Test QE-9372 TS-003 TC-001 completed successfully');
  });

});
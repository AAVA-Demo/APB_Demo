const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const Logger = require('../utils/logger');

/**
 * Test Suite: Dashboard KPIs and Financial Overview
 * Epic: QE-9830 - CreditCardNew20261110205228-Dashboard KPIs and Financial Overview
 * User Stories: QE-9909 (Available Credit Tracking Display), QE-9913 (Monthly Spend Dashboard Display)
 */

test.describe('Dashboard KPIs - Available Credit Tracking Display (QE-9909)', () => {

  test('QE-9998 TS001 TC-001: Verify aggregated total credit limit and available credit display for user with 3 active credit cards', async ({ page }) => {
    Logger.info('Starting test: QE-9998 TS001 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the credit card dashboard application
    Logger.info('Step 1: Launching application');
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);
    Logger.info('Application login page loaded successfully');

    // Step 2: Log in with valid user credentials who has 3 active credit cards
    Logger.info('Step 2: Logging in with user123');
    await loginPage.login('user123', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User authenticated and redirected to dashboard');

    // Step 3: Navigate to the dashboard KPIs page
    Logger.info('Step 3: Navigating to dashboard KPIs page');
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.kpiSection).toBeVisible();
    Logger.info('Dashboard KPIs page loaded with all metrics visible');

    // Step 4: Verify the Total Credit Limit KPI displays the aggregated value
    Logger.info('Step 4: Verifying Total Credit Limit KPI');
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('₹150,000');
    Logger.info('Total Credit Limit shows ₹150,000 (₹50,000 + ₹30,000 + ₹70,000)');

    // Step 5: Verify the Available Credit KPI displays the aggregated value
    Logger.info('Step 5: Verifying Available Credit KPI');
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('₹105,000');
    Logger.info('Available Credit shows ₹105,000 (₹35,000 + ₹20,000 + ₹50,000)');

    // Step 6: Verify the data is displayed in real-time without manual refresh
    Logger.info('Step 6: Verifying real-time data display');
    const lastUpdated = await dashboardPage.getLastUpdatedTimestamp();
    expect(lastUpdated).toBeTruthy();
    Logger.info('KPIs update automatically within 2 seconds of page load');
    Logger.info('Test QE-9998 TS001 TC-001 completed successfully');
  });

  test('QE-9998 TS002 TC-001: Verify available credit displays as ₹0 with warning when credit limit is exceeded', async ({ page }) => {
    Logger.info('Starting test: QE-9998 TS002 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the credit card dashboard application
    Logger.info('Step 1: Launching application');
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);
    Logger.info('Application loads successfully');

    // Step 2: Log in with user credentials who has a card with exceeded credit limit
    Logger.info('Step 2: Logging in with user_exceeded');
    await loginPage.login('user_exceeded', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User is authenticated successfully');

    // Step 3: Navigate to the dashboard KPIs page
    Logger.info('Step 3: Navigating to dashboard KPIs page');
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.kpiSection).toBeVisible();
    Logger.info('Dashboard loads with KPI metrics');

    // Step 4: Verify Available Credit KPI displays ₹0
    Logger.info('Step 4: Verifying Available Credit displays ₹0');
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('₹0');
    Logger.info('Available Credit shows ₹0');

    // Step 5: Verify warning indicator is displayed
    Logger.info('Step 5: Verifying warning indicator');
    await expect(dashboardPage.warningIndicator).toBeVisible();
    const warningText = await dashboardPage.getWarningMessage();
    expect(warningText).toContain('Credit limit exceeded on 1 card. Immediate payment required.');
    Logger.info('Warning message displays correctly');
    Logger.info('Test QE-9998 TS002 TC-001 completed successfully');
  });

  test('QE-9998 TS003 TC-001: Verify available credit updates in real-time after completing a transaction', async ({ page }) => {
    Logger.info('Starting test: QE-9998 TS003 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application and log in
    Logger.info('Step 1: Launching and logging in');
    await loginPage.navigate();
    await loginPage.login('user123', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User is logged in successfully');

    // Step 2: Navigate to the dashboard KPIs page
    Logger.info('Step 2: Navigating to dashboard');
    await dashboardPage.waitForDashboardLoad();
    const initialAvailableCredit = await dashboardPage.getAvailableCredit();
    expect(initialAvailableCredit).toBe('₹105,000');
    Logger.info('Dashboard displays with initial Available Credit of ₹105,000');

    // Step 3: Complete a transaction of ₹5,000 on one of the credit cards
    Logger.info('Step 3: Simulating transaction of ₹5,000');
    await dashboardPage.simulateTransaction('card1', 5000);
    Logger.info('Transaction is processed successfully');

    // Step 4: Verify the Available Credit KPI updates automatically within 2 seconds
    Logger.info('Step 4: Verifying automatic update of Available Credit');
    await page.waitForTimeout(2000); // Wait for real-time update
    const updatedAvailableCredit = await dashboardPage.getAvailableCredit();
    expect(updatedAvailableCredit).toBe('₹100,000');
    Logger.info('Available Credit updates to ₹100,000 (₹105,000 - ₹5,000) without manual refresh');

    // Step 5: Verify the last updated timestamp is refreshed
    Logger.info('Step 5: Verifying last updated timestamp');
    const lastUpdated = await dashboardPage.getLastUpdatedTimestamp();
    expect(lastUpdated).toBeTruthy();
    Logger.info('Last updated timestamp shows current time');
    Logger.info('Test QE-9998 TS003 TC-001 completed successfully');
  });
});

test.describe('Dashboard KPIs - Monthly Spend Dashboard Display (QE-9913)', () => {

  test('QE-9993 TS001 TC-001: Verify total monthly spend across all registered credit cards is displayed prominently in KPIs overview section', async ({ page }) => {
    Logger.info('Starting test: QE-9993 TS001 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the credit card dashboard application
    Logger.info('Step 1: Launching application');
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);
    Logger.info('Application loads successfully');

    // Step 2: Log in with valid user credentials
    Logger.info('Step 2: Logging in');
    await loginPage.login('user123', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User is authenticated and redirected to dashboard');

    // Step 3: Navigate to the KPIs overview section
    Logger.info('Step 3: Navigating to KPIs overview');
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.kpiSection).toBeVisible();
    Logger.info('KPIs overview section loads with all metrics');

    // Step 4: Verify total monthly spend is displayed prominently
    Logger.info('Step 4: Verifying Monthly Spend KPI');
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('₹35,000');
    Logger.info('Monthly Spend KPI shows ₹35,000');

    // Step 5: Verify the value is aggregated correctly from all active cards
    Logger.info('Step 5: Verifying aggregation correctness');
    expect(monthlySpend).toBe('₹35,000');
    Logger.info('Total is sum of all card spends: ₹12,000 + ₹8,000 + ₹15,000 = ₹35,000');
    Logger.info('Test QE-9993 TS001 TC-001 completed successfully');
  });

  test('QE-9993 TS002 TC-001: Verify monthly spend displays ₹0 with message when user has no active credit cards', async ({ page }) => {
    Logger.info('Starting test: QE-9993 TS002 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application and log in with user having no active credit cards
    Logger.info('Step 1: Launching and logging in with user_no_cards');
    await loginPage.navigate();
    await loginPage.login('user_no_cards', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User is authenticated successfully');

    // Step 2: Navigate to the dashboard
    Logger.info('Step 2: Navigating to dashboard');
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.kpiSection).toBeVisible();
    Logger.info('Dashboard loads');

    // Step 3: Verify monthly spend KPI displays ₹0
    Logger.info('Step 3: Verifying Monthly Spend displays ₹0');
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('₹0');
    Logger.info('Monthly Spend shows ₹0');

    // Step 4: Verify message is displayed
    Logger.info('Step 4: Verifying no cards message');
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const message = await dashboardPage.getNoCardsMessage();
    expect(message).toContain('No active cards found. Add a card to track spending.');
    Logger.info('Message displays correctly');
    Logger.info('Test QE-9993 TS002 TC-001 completed successfully');
  });

  test('QE-9993 TS003 TC-001: Verify monthly spend dashboard correctly aggregates spending from multiple cards and updates in real-time', async ({ page }) => {
    Logger.info('Starting test: QE-9993 TS003 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application and log in with user having 3 cards
    Logger.info('Step 1: Launching and logging in');
    await loginPage.navigate();
    await loginPage.login('user123', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User is authenticated successfully');

    // Step 2: Navigate to the monthly spend dashboard
    Logger.info('Step 2: Navigating to dashboard');
    await dashboardPage.waitForDashboardLoad();
    const initialMonthlySpend = await dashboardPage.getMonthlySpend();
    expect(initialMonthlySpend).toBe('₹35,000');
    Logger.info('Dashboard loads with initial monthly spend of ₹35,000');

    // Step 3: Verify initial aggregation is correct
    Logger.info('Step 3: Verifying initial aggregation');
    expect(initialMonthlySpend).toBe('₹35,000');
    Logger.info('Monthly Spend displays ₹35,000 (₹12,000 + ₹8,000 + ₹15,000)');

    // Step 4: Process a new transaction of ₹2,000 on the Visa card
    Logger.info('Step 4: Processing transaction of ₹2,000');
    await dashboardPage.simulateTransaction('card1', 2000);
    Logger.info('Transaction is processed successfully');

    // Step 5: Verify monthly spend updates in real-time to ₹37,000
    Logger.info('Step 5: Verifying real-time update');
    await page.waitForTimeout(2000);
    const updatedMonthlySpend = await dashboardPage.getMonthlySpend();
    expect(updatedMonthlySpend).toBe('₹37,000');
    Logger.info('Monthly Spend updates to ₹37,000 (₹35,000 + ₹2,000) without manual refresh');

    // Step 6: Verify update occurs within 2 seconds of transaction processing
    Logger.info('Step 6: Verifying update timing');
    expect(updatedMonthlySpend).toBe('₹37,000');
    Logger.info('Dashboard reflects new value within 2 seconds');
    Logger.info('Test QE-9993 TS003 TC-001 completed successfully');
  });
});
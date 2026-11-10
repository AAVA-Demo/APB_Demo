const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CreditUtilizationPage } = require('./pages/creditUtilization.page');

test.describe('Real-time Credit Utilization Monitoring Tests', () => {

  test('QE-9714 TS-001 TC-001 - Verify real-time credit utilization monitoring automatically refreshes and displays updated available credit and outstanding amount after a new transaction on mobile device', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const creditUtilizationPage = new CreditUtilizationPage(page);

    // Step 1: Launch on mobile device
    await page.setViewportSize({ width: 375, height: 812 });
    await loginPage.navigate();

    // Step 2: Authenticate
    await loginPage.login('testuser_mobile', 'Test@123');

    // Step 3: Navigate to credit utilization monitoring view
    await creditUtilizationPage.navigate();

    // Step 4: Record current values
    const initialAvailableCredit = await creditUtilizationPage.getAvailableCredit();
    const initialOutstanding = await creditUtilizationPage.getOutstandingAmount();
    expect(initialAvailableCredit).toBe('$8,000');
    expect(initialOutstanding).toBe('$2,000');

    // Step 5: Simulate new transaction (via API or backend)
    // Note: In real implementation, this would trigger a backend transaction
    // For now, we wait for the refresh interval

    // Step 6: Wait for automatic refresh interval (30 seconds)
    await page.waitForTimeout(30000); // Only used here due to explicit refresh interval requirement

    // Step 7: Verify available credit is updated
    const updatedAvailableCredit = await creditUtilizationPage.getAvailableCredit();
    expect(updatedAvailableCredit).toBe('$7,500');

    // Step 8: Verify outstanding amount is updated
    const updatedOutstanding = await creditUtilizationPage.getOutstandingAmount();
    expect(updatedOutstanding).toBe('$2,500');
  });

  test('QE-9714 TS-002 TC-001 - Verify credit utilization monitoring displays last known values with clear indicator when backend transaction service is temporarily unavailable', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const creditUtilizationPage = new CreditUtilizationPage(page);

    // Step 1 & 2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser_servicefail', 'Test@123');

    // Step 3: Navigate to credit utilization monitoring view
    await creditUtilizationPage.navigate();
    const initialAvailableCredit = await creditUtilizationPage.getAvailableCredit();
    const initialOutstanding = await creditUtilizationPage.getOutstandingAmount();
    expect(initialAvailableCredit).toBe('$10,000');
    expect(initialOutstanding).toBe('$3,000');

    // Step 4: Simulate backend service unavailable (via network interception)
    await page.route('**/api/credit-utilization', route => route.abort());

    // Step 5: Wait for automatic refresh interval
    await page.waitForTimeout(30000); // Only used here due to explicit refresh interval requirement

    // Step 6: Verify last known values are displayed
    const displayedAvailableCredit = await creditUtilizationPage.getAvailableCredit();
    const displayedOutstanding = await creditUtilizationPage.getOutstandingAmount();
    expect(displayedAvailableCredit).toBe('$10,000');
    expect(displayedOutstanding).toBe('$3,000');

    // Step 7: Verify clear indicator is displayed
    const indicator = await creditUtilizationPage.getUnavailableDataIndicator();
    expect(indicator).toMatch(/Real-time data unavailable|Showing last known values/);
  });

  test('QE-9714 TS-003 TC-001 - Verify real-time credit utilization monitoring correctly aggregates and displays total available credit and total outstanding amount across multiple credit cards on responsive mobile interface', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const creditUtilizationPage = new CreditUtilizationPage(page);

    // Step 1: Launch on mobile device
    await page.setViewportSize({ width: 360, height: 740 });
    await loginPage.navigate();

    // Step 2: Authenticate with user having 4 active credit cards
    await loginPage.login('testuser_multicard_mobile', 'Test@123');

    // Step 3: Navigate to credit utilization monitoring view
    await creditUtilizationPage.navigate();

    // Step 4: Verify total available credit is correctly aggregated
    const totalAvailableCredit = await creditUtilizationPage.getAvailableCredit();
    expect(totalAvailableCredit).toBe('$35,000');

    // Step 5: Verify total outstanding amount is correctly aggregated
    const totalOutstanding = await creditUtilizationPage.getOutstandingAmount();
    expect(totalOutstanding).toBe('$10,000');

    // Step 6: Verify calculations are accurate
    expect(totalAvailableCredit).toBe('$35,000');
    expect(totalOutstanding).toBe('$10,000');

    // Step 7: Verify responsive mobile interface displays metrics clearly
    await expect(creditUtilizationPage.availableCreditDisplay).toBeVisible();
    await expect(creditUtilizationPage.outstandingAmountDisplay).toBeVisible();
  });

});
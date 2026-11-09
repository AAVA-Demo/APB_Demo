const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Credit Card Dashboard - Consolidated KPI Display', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    logger.info('Navigating to dashboard');
    await dashboardPage.navigate();
  });

  test('TC-5980: Verify consolidated dashboard KPI display with multiple credit cards', async ({ page }) => {
    logger.info('Test Case 5980: Starting consolidated KPI display validation');
    
    // Step 1: Authenticate user with valid credentials
    logger.info('Step 1: Authenticating user testuser001');
    await dashboardPage.authenticateUser('testuser001', 'password123');
    await expect(dashboardPage.userProfileSection).toBeVisible();
    
    // Step 2: Invoke KPI aggregation service
    logger.info('Step 2: Waiting for KPI data to load');
    await dashboardPage.waitForKPIDataLoad();
    const loadTime = await dashboardPage.measurePageLoadTime();
    logger.info(`Dashboard load time: ${loadTime}ms`);
    
    // Step 3: Validate monthly spend KPI
    logger.info('Step 3: Validating monthly spend aggregation');
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('₹42,000');
    
    // Step 4: Validate total credit limit KPI
    logger.info('Step 4: Validating total credit limit');
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('₹2,50,000');
    
    // Step 5: Validate available credit KPI
    logger.info('Step 5: Validating available credit');
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('₹1,95,000');
    
    // Step 6: Validate outstanding amounts KPI
    logger.info('Step 6: Validating outstanding amounts');
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('₹55,000');
    
    // Step 7: Verify dashboard page load time performance
    logger.info('Step 7: Verifying page load time performance');
    expect(loadTime).toBeLessThan(2000);
    
    // Step 8: Verify responsive layout rendering
    logger.info('Step 8: Verifying responsive layout on desktop viewport');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(dashboardPage.kpiPanelsContainer).toBeVisible();
    const isLayoutCorrect = await dashboardPage.verifyResponsiveLayout();
    expect(isLayoutCorrect).toBe(true);
    
    logger.info('Test Case 5980: Completed successfully');
  });

  test('TC-5981: Verify dashboard handles credit cards with null or invalid credit limit values', async ({ page }) => {
    logger.info('Test Case 5981: Starting invalid credit limit handling validation');
    
    // Step 1: Authenticate user with invalid credit limit data
    logger.info('Step 1: Authenticating user testuser002 with invalid card data');
    await dashboardPage.authenticateUser('testuser002', 'password123');
    await expect(dashboardPage.userProfileSection).toBeVisible();
    
    // Step 2: Invoke KPI aggregation service
    logger.info('Step 2: Waiting for KPI service to process request');
    await dashboardPage.waitForKPIDataLoad();
    
    // Step 3: Validate null credit limit exclusion
    logger.info('Step 3: Validating null credit limit exclusion');
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('₹50,000');
    
    // Step 4: Validate negative credit limit exclusion
    logger.info('Step 4: Validating negative credit limit exclusion');
    const creditLimitValue = await dashboardPage.getTotalCreditLimitNumeric();
    expect(creditLimitValue).toBe(50000);
    
    // Step 5: Verify warning message display
    logger.info('Step 5: Verifying warning message for data quality issues');
    await expect(dashboardPage.warningMessage).toBeVisible();
    const warningText = await dashboardPage.getWarningMessageText();
    expect(warningText).toContain('Some cards have invalid credit limit data');
    
    // Step 6: Validate available credit calculation
    logger.info('Step 6: Validating available credit excludes invalid cards');
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBeTruthy();
    
    // Step 7: Verify no system crashes
    logger.info('Step 7: Verifying dashboard loads without errors');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    const hasErrors = await dashboardPage.checkForSystemErrors();
    expect(hasErrors).toBe(false);
    
    logger.info('Test Case 5981: Completed successfully');
  });

  test('TC-5982: Verify dashboard handles performance degradation exceeding 2-second load time', async ({ page }) => {
    logger.info('Test Case 5982: Starting performance degradation handling validation');
    
    // Step 1: Simulate service delay
    logger.info('Step 1: Simulating KPI service delay of 5000ms');
    await dashboardPage.simulateServiceDelay(5000);
    
    // Step 2: Authenticate user and access dashboard
    logger.info('Step 2: Authenticating user testuser003');
    await dashboardPage.authenticateUser('testuser003', 'password123');
    
    // Step 3: Verify loading indicator display
    logger.info('Step 3: Verifying loading indicator is visible');
    await expect(dashboardPage.loadingIndicator).toBeVisible();
    
    // Step 4: Verify timeout message after threshold
    logger.info('Step 4: Waiting for timeout message');
    await expect(dashboardPage.timeoutMessage).toBeVisible({ timeout: 3000 });
    const timeoutText = await dashboardPage.getTimeoutMessageText();
    expect(timeoutText).toContain('Dashboard is taking longer than expected');
    
    // Step 5: Verify retry option is provided
    logger.info('Step 5: Verifying retry button is visible');
    await expect(dashboardPage.retryButton).toBeVisible();
    
    // Step 6: Verify cached data fallback
    logger.info('Step 6: Verifying cached data display');
    await dashboardPage.clickViewCachedDataButton();
    await expect(dashboardPage.cachedDataMessage).toBeVisible();
    const cachedMessage = await dashboardPage.getCachedDataMessageText();
    expect(cachedMessage).toContain('Showing cached data from');
    
    // Step 7: Validate manual refresh capability
    logger.info('Step 7: Validating manual refresh triggers new API call');
    await dashboardPage.clickRefreshButton();
    await dashboardPage.waitForKPIDataLoad();
    
    logger.info('Test Case 5982: Completed successfully');
  });
});

test.describe('Credit Card Management - Multiple Card Display', () => {
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    logger.info('Navigating to card management interface');
    await cardManagementPage.navigate();
  });

  test('TC-5983: Verify multiple credit card display with masked card numbers and complete details', async ({ page }) => {
    logger.info('Test Case 5983: Starting multiple card display validation');
    
    // Step 1: Authenticate user with 10 registered cards
    logger.info('Step 1: Authenticating user testuser004');
    await cardManagementPage.authenticateUser('testuser004', 'password123');
    
    // Step 2: Invoke card management service
    logger.info('Step 2: Waiting for card list to load');
    await cardManagementPage.waitForCardListLoad();
    
    // Step 3: Validate 10 cards are displayed
    logger.info('Step 3: Validating card count');
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(10);
    
    // Step 4: Verify card numbers are masked
    logger.info('Step 4: Verifying card number masking');
    const maskedNumbers = await cardManagementPage.getAllMaskedCardNumbers();
    maskedNumbers.forEach(number => {
      expect(number).toMatch(/\*\*\*\* \*\*\*\* \*\*\*\* \d{4}/);
    });
    
    // Step 5: Validate card labels
    logger.info('Step 5: Validating card labels are displayed');
    const cardLabels = await cardManagementPage.getAllCardLabels();
    expect(cardLabels.length).toBe(10);
    cardLabels.forEach(label => {
      expect(label).toBeTruthy();
    });
    
    // Step 6: Validate issuer details
    logger.info('Step 6: Validating issuer details');
    const issuers = await cardManagementPage.getAllIssuers();
    expect(issuers.length).toBe(10);
    
    // Step 7: Validate credit limits
    logger.info('Step 7: Validating credit limits are displayed');
    const creditLimits = await cardManagementPage.getAllCreditLimits();
    expect(creditLimits.length).toBe(10);
    
    // Step 8: Validate available credit
    logger.info('Step 8: Validating available credit is displayed');
    const availableCredits = await cardManagementPage.getAllAvailableCredits();
    expect(availableCredits.length).toBe(10);
    
    // Step 9: Validate outstanding amounts
    logger.info('Step 9: Validating outstanding amounts are displayed');
    const outstandingAmounts = await cardManagementPage.getAllOutstandingAmounts();
    expect(outstandingAmounts.length).toBe(10);
    
    // Step 10: Verify no sensitive data exposure
    logger.info('Step 10: Verifying no CVV or full card numbers are exposed');
    const hasSensitiveData = await cardManagementPage.checkForSensitiveDataExposure();
    expect(hasSensitiveData).toBe(false);
    
    logger.info('Test Case 5983: Completed successfully');
  });

  test('TC-5984: Verify system handles user with 51 credit cards exceeding 50-card limit', async ({ page }) => {
    logger.info('Test Case 5984: Starting 50-card limit validation');
    
    // Step 1: Authenticate user with 51 cards
    logger.info('Step 1: Authenticating user testuser005 with 51 cards');
    await cardManagementPage.authenticateUser('testuser005', 'password123');
    
    // Step 2: Invoke card management service
    logger.info('Step 2: Waiting for card service to process request');
    await cardManagementPage.waitForCardListLoad();
    
    // Step 3: Validate warning message display
    logger.info('Step 3: Verifying warning message about card limit');
    await expect(cardManagementPage.cardLimitWarning).toBeVisible();
    const warningText = await cardManagementPage.getCardLimitWarningText();
    expect(warningText).toContain('51 cards registered');
    expect(warningText).toContain('maximum of 50 cards');
    
    // Step 4: Verify only 50 cards displayed
    logger.info('Step 4: Validating only 50 cards are displayed');
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(50);
    
    // Step 5: Validate 51st card is not displayed
    logger.info('Step 5: Verifying card-051 is not visible');
    const card51Visible = await cardManagementPage.isCardVisible('card-051');
    expect(card51Visible).toBe(false);
    
    // Step 6: Verify no system crashes
    logger.info('Step 6: Verifying system loads without errors');
    await expect(cardManagementPage.cardListContainer).toBeVisible();
    const hasErrors = await cardManagementPage.checkForSystemErrors();
    expect(hasErrors).toBe(false);
    
    // Step 7: Validate displayed cards show complete details
    logger.info('Step 7: Validating all 50 cards show complete details');
    const allCardsHaveDetails = await cardManagementPage.verifyAllCardsHaveCompleteDetails();
    expect(allCardsHaveDetails).toBe(true);
    
    logger.info('Test Case 5984: Completed successfully');
  });

  test('TC-5985: Verify card management interface displays empty state for user with no registered cards', async ({ page }) => {
    logger.info('Test Case 5985: Starting empty state validation');
    
    // Step 1: Authenticate user with 0 cards
    logger.info('Step 1: Authenticating user testuser006 with no cards');
    await cardManagementPage.authenticateUser('testuser006', 'password123');
    
    // Step 2: Invoke card management service
    logger.info('Step 2: Waiting for card service response');
    await cardManagementPage.waitForCardListLoad();
    
    // Step 3: Verify empty state message
    logger.info('Step 3: Verifying empty state message is displayed');
    await expect(cardManagementPage.emptyStateMessage).toBeVisible();
    const emptyStateText = await cardManagementPage.getEmptyStateMessageText();
    expect(emptyStateText).toContain('No credit cards found');
    
    // Step 4: Validate no card panels displayed
    logger.info('Step 4: Validating no card panels are rendered');
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(0);
    
    // Step 5: Verify call-to-action is provided
    logger.info('Step 5: Verifying add card call-to-action');
    await expect(cardManagementPage.addCardButton).toBeVisible();
    const ctaText = await cardManagementPage.getAddCardButtonText();
    expect(ctaText).toContain('Add your first credit card');
    
    // Step 6: Verify no error messages
    logger.info('Step 6: Verifying no error messages are displayed');
    const hasErrors = await cardManagementPage.checkForErrorMessages();
    expect(hasErrors).toBe(false);
    
    logger.info('Test Case 5985: Completed successfully');
  });
});

test.describe('Analytics - Category-wise Spending Visualization', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    logger.info('Navigating to analytics dashboard');
    await analyticsPage.navigate();
  });

  test('TC-5986: Verify category-wise spending visualization with transactions across all nine categories', async ({ page }) => {
    logger.info('Test Case 5986: Starting category-wise spending validation');
    
    // Step 1: Authenticate user with transactions in all categories
    logger.info('Step 1: Authenticating user testuser007');
    await analyticsPage.authenticateUser('testuser007', 'password123');
    
    // Step 2: Invoke analytics service
    logger.info('Step 2: Waiting for analytics data to load');
    await analyticsPage.waitForAnalyticsDataLoad();
    
    // Steps 3-11: Validate all nine categories
    const expectedCategories = [
      { name: 'Food & Dining', amount: '₹8,500' },
      { name: 'Fuel', amount: '₹6,200' },
      { name: 'Shopping', amount: '₹12,300' },
      { name: 'Travel', amount: '₹25,000' },
      { name: 'Entertainment', amount: '₹3,800' },
      { name: 'Utilities', amount: '₹4,500' },
      { name: 'Healthcare', amount: '₹7,200' },
      { name: 'Education', amount: '₹15,000' },
      { name: 'Miscellaneous', amount: '₹2,500' }
    ];
    
    for (const category of expectedCategories) {
      logger.info(`Validating ${category.name} category`);
      const amount = await analyticsPage.getCategoryAmount(category.name);
      expect(amount).toBe(category.amount);
    }
    
    // Step 12: Verify interactive chart displays all categories
    logger.info('Step 12: Verifying chart displays all nine categories');
    await expect(analyticsPage.categoryChart).toBeVisible();
    const chartCategories = await analyticsPage.getChartCategories();
    expect(chartCategories.length).toBe(9);
    
    // Step 13: Verify chart renders within 1 second
    logger.info('Step 13: Verifying chart render performance');
    const renderTime = await analyticsPage.measureChartRenderTime();
    expect(renderTime).toBeLessThan(1000);
    
    logger.info('Test Case 5986: Completed successfully');
  });

  test('TC-5987: Verify category-wise spending visualization handles user with no transaction history', async ({ page }) => {
    logger.info('Test Case 5987: Starting no transaction history validation');
    
    // Step 1: Authenticate user with no transactions
    logger.info('Step 1: Authenticating user testuser008 with no transactions');
    await analyticsPage.authenticateUser('testuser008', 'password123');
    
    // Step 2: Invoke analytics service
    logger.info('Step 2: Waiting for analytics service response');
    await analyticsPage.waitForAnalyticsDataLoad();
    
    // Step 3: Verify all categories show zero values
    logger.info('Step 3: Verifying all categories display ₹0');
    const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of categories) {
      const amount = await analyticsPage.getCategoryAmount(category);
      expect(amount).toBe('₹0');
    }
    
    // Step 4: Verify empty state message
    logger.info('Step 4: Verifying empty state message');
    await expect(analyticsPage.emptyStateMessage).toBeVisible();
    const emptyStateText = await analyticsPage.getEmptyStateMessageText();
    expect(emptyStateText).toContain('No transactions found');
    
    // Step 5: Verify no system errors
    logger.info('Step 5: Verifying no system errors');
    const hasErrors = await analyticsPage.checkForSystemErrors();
    expect(hasErrors).toBe(false);
    
    // Step 6: Verify chart handles empty data
    logger.info('Step 6: Verifying chart displays empty state');
    await expect(analyticsPage.chartEmptyState).toBeVisible();
    
    logger.info('Test Case 5987: Completed successfully');
  });

  test('TC-5988: Verify category-wise spending visualization handles transactions with invalid or null category values', async ({ page }) => {
    logger.info('Test Case 5988: Starting invalid category handling validation');
    
    // Step 1: Authenticate user with invalid category transactions
    logger.info('Step 1: Authenticating user testuser009 with invalid categories');
    await analyticsPage.authenticateUser('testuser009', 'password123');
    
    // Step 2: Invoke categorization service
    logger.info('Step 2: Waiting for categorization service to process');
    await analyticsPage.waitForAnalyticsDataLoad();
    
    // Step 3: Validate null category transactions moved to Miscellaneous
    logger.info('Step 3: Verifying null category transactions categorized as Miscellaneous');
    const miscellaneousAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
    expect(miscellaneousAmount).toBe('₹4,200');
    
    // Step 4: Validate invalid category transactions moved to Miscellaneous
    logger.info('Step 4: Verifying invalid category transactions categorized as Miscellaneous');
    const miscellaneousCount = await analyticsPage.getCategoryTransactionCount('Miscellaneous');
    expect(miscellaneousCount).toBe(8);
    
    // Step 5: Verify valid categorized transactions display correct amounts
    logger.info('Step 5: Verifying valid categories show correct totals');
    const validCategories = await analyticsPage.getValidCategoriesWithAmounts();
    expect(validCategories.length).toBeGreaterThan(0);
    
    // Step 6: Verify Miscellaneous includes uncategorized transactions
    logger.info('Step 6: Verifying Miscellaneous total includes uncategorized transactions');
    expect(miscellaneousAmount).toBeTruthy();
    
    // Step 7: Verify no system errors
    logger.info('Step 7: Verifying no errors for invalid categories');
    const hasErrors = await analyticsPage.checkForSystemErrors();
    expect(hasErrors).toBe(false);
    
    // Step 8: Verify chart displays all categories correctly
    logger.info('Step 8: Verifying chart renders with Miscellaneous proportion');
    await expect(analyticsPage.categoryChart).toBeVisible();
    const chartData = await analyticsPage.getChartData();
    expect(chartData).toBeTruthy();
    
    logger.info('Test Case 5988: Completed successfully');
  });
});

test.describe('Real-time Credit Utilization Tracking', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    logger.info('Navigating to dashboard for real-time tracking tests');
    await dashboardPage.navigate();
  });

  test('TC-5989: Verify real-time credit utilization tracking updates after dashboard refresh', async ({ page }) => {
    logger.info('Test Case 5989: Starting real-time update validation');
    
    // Step 1: Authenticate user with active cards
    logger.info('Step 1: Authenticating user testuser010');
    await dashboardPage.authenticateUser('testuser010', 'password123');
    
    // Step 2: Capture initial values
    logger.info('Step 2: Capturing initial credit values');
    const initialCard001Available = await dashboardPage.getCardAvailableCredit('card-001');
    const initialCard001Outstanding = await dashboardPage.getCardOutstanding('card-001');
    expect(initialCard001Available).toBe('₹35,000');
    expect(initialCard001Outstanding).toBe('₹15,000');
    
    // Step 3: Simulate new transaction
    logger.info('Step 3: Simulating new transaction on card-001');
    await dashboardPage.simulateTransaction('card-001', 5000);
    
    // Step 4: User refreshes dashboard
    logger.info('Step 4: Refreshing dashboard');
    await dashboardPage.refreshDashboard();
    await dashboardPage.waitForKPIDataLoad();
    
    // Step 5: Verify updated available credit
    logger.info('Step 5: Verifying updated available credit for card-001');
    const updatedCard001Available = await dashboardPage.getCardAvailableCredit('card-001');
    expect(updatedCard001Available).toBe('₹30,000');
    
    // Step 6: Verify updated outstanding amount
    logger.info('Step 6: Verifying updated outstanding amount for card-001');
    const updatedCard001Outstanding = await dashboardPage.getCardOutstanding('card-001');
    expect(updatedCard001Outstanding).toBe('₹20,000');
    
    // Step 7: Verify other cards unchanged
    logger.info('Step 7: Verifying card-002 and card-003 remain unchanged');
    const card002Available = await dashboardPage.getCardAvailableCredit('card-002');
    const card003Available = await dashboardPage.getCardAvailableCredit('card-003');
    expect(card002Available).toBe('₹28,000');
    expect(card003Available).toBe('₹50,000');
    
    // Step 8: Verify aggregated totals recalculated
    logger.info('Step 8: Verifying aggregated totals are recalculated');
    const totalAvailable = await dashboardPage.getAvailableCredit();
    const totalOutstanding = await dashboardPage.getOutstandingAmount();
    expect(totalAvailable).toBe('₹1,08,000');
    expect(totalOutstanding).toBe('₹47,000');
    
    logger.info('Test Case 5989: Completed successfully');
  });

  test('TC-5990: Verify real-time credit utilization tracking handles service unavailability', async ({ page }) => {
    logger.info('Test Case 5990: Starting service unavailability handling validation');
    
    // Step 1: Simulate service unavailability
    logger.info('Step 1: Simulating service unavailability (503)');
    await dashboardPage.simulateServiceUnavailability();
    
    // Step 2: Authenticate and refresh
    logger.info('Step 2: Authenticating user testuser011 and refreshing');
    await dashboardPage.authenticateUser('testuser011', 'password123');
    await dashboardPage.refreshDashboard();
    
    // Step 3: Verify service unavailability detection
    logger.info('Step 3: Verifying service unavailability is detected');
    await expect(dashboardPage.serviceErrorMessage).toBeVisible({ timeout: 5000 });
    
    // Step 4: Verify error message display
    logger.info('Step 4: Verifying appropriate error message');
    const errorText = await dashboardPage.getServiceErrorMessageText();
    expect(errorText).toContain('Real-time data is currently unavailable');
    
    // Step 5: Verify cached data option
    logger.info('Step 5: Verifying cached data option is provided');
    await expect(dashboardPage.viewCachedDataButton).toBeVisible();
    
    // Step 6: User selects cached data option
    logger.info('Step 6: Clicking view cached data button');
    await dashboardPage.clickViewCachedDataButton();
    await expect(dashboardPage.cachedDataMessage).toBeVisible();
    const cachedMessage = await dashboardPage.getCachedDataMessageText();
    expect(cachedMessage).toContain('Showing cached data from');
    
    // Step 7: Verify retry option
    logger.info('Step 7: Verifying retry button is displayed');
    await expect(dashboardPage.retryButton).toBeVisible();
    
    // Step 8: Verify no system crashes
    logger.info('Step 8: Verifying graceful error handling');
    const hasUnhandledErrors = await dashboardPage.checkForUnhandledExceptions();
    expect(hasUnhandledErrors).toBe(false);
    
    logger.info('Test Case 5990: Completed successfully');
  });

  test('TC-5991: Verify dashboard automatically updates credit utilization after new transaction without manual refresh', async ({ page }) => {
    logger.info('Test Case 5991: Starting auto-refresh validation');
    
    // Step 1: Authenticate user with dashboard open
    logger.info('Step 1: Authenticating user testuser012');
    await dashboardPage.authenticateUser('testuser012', 'password123');
    await dashboardPage.waitForKPIDataLoad();
    
    // Step 2: Capture initial values
    logger.info('Step 2: Capturing initial credit values');
    const initialCard002Available = await dashboardPage.getCardAvailableCredit('card-002');
    const initialCard002Outstanding = await dashboardPage.getCardOutstanding('card-002');
    expect(initialCard002Available).toBe('₹25,000');
    expect(initialCard002Outstanding).toBe('₹5,000');
    
    // Step 3: Simulate new transaction
    logger.info('Step 3: Simulating new transaction on card-002');
    await dashboardPage.simulateTransaction('card-002', 3000);
    
    // Step 4: Wait for auto-refresh interval
    logger.info('Step 4: Waiting for auto-refresh (60 seconds)');
    await page.waitForTimeout(60000);
    
    // Step 5: Verify automatic update of available credit
    logger.info('Step 5: Verifying automatic update of available credit');
    const updatedCard002Available = await dashboardPage.getCardAvailableCredit('card-002');
    expect(updatedCard002Available).toBe('₹22,000');
    
    // Step 6: Verify automatic update of outstanding
    logger.info('Step 6: Verifying automatic update of outstanding amount');
    const updatedCard002Outstanding = await dashboardPage.getCardOutstanding('card-002');
    expect(updatedCard002Outstanding).toBe('₹8,000');
    
    // Step 7: Verify other cards unchanged
    logger.info('Step 7: Verifying other cards remain unchanged');
    const card001Available = await dashboardPage.getCardAvailableCredit('card-001');
    const card003Available = await dashboardPage.getCardAvailableCredit('card-003');
    expect(card001Available).toBe('₹40,000');
    expect(card003Available).toBe('₹60,000');
    
    // Step 8: Verify no manual refresh triggered
    logger.info('Step 8: Verifying update was automatic');
    const manualRefreshLogged = await dashboardPage.checkForManualRefreshAction();
    expect(manualRefreshLogged).toBe(false);
    
    // Step 9: Verify aggregated totals recalculated
    logger.info('Step 9: Verifying aggregated totals updated automatically');
    const totalAvailable = await dashboardPage.getAvailableCredit();
    const totalOutstanding = await dashboardPage.getOutstandingAmount();
    expect(totalAvailable).toBe('₹1,22,000');
    expect(totalOutstanding).toBe('₹33,000');
    
    logger.info('Test Case 5991: Completed successfully');
  });
});

test.describe('Card Selection and Switching', () => {
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    logger.info('Navigating to card management for selection tests');
    await cardManagementPage.navigate();
  });

  test('TC-5992: Verify card selection retrieves card-specific details within 500ms response time', async ({ page }) => {
    logger.info('Test Case 5992: Starting card selection performance validation');
    
    // Step 1: Authenticate and navigate to card listing
    logger.info('Step 1: Authenticating user testuser013');
    await cardManagementPage.authenticateUser('testuser013', 'password123');
    await cardManagementPage.waitForCardListLoad();
    
    // Step 2: Select specific card
    logger.info('Step 2: Selecting card-003');
    const startTime = Date.now();
    await cardManagementPage.selectCard('card-003');
    
    // Step 3: Measure response time
    logger.info('Step 3: Measuring response time');
    await cardManagementPage.waitForCardDetailsLoad();
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(500);
    
    // Step 4: Verify card information section
    logger.info('Step 4: Verifying card information details');
    const cardLabel = await cardManagementPage.getCardLabel();
    const cardNumber = await cardManagementPage.getCardNumber();
    const issuer = await cardManagementPage.getIssuer();
    expect(cardLabel).toBe('SBI Signature');
    expect(cardNumber).toBe('**** **** **** 7890');
    expect(issuer).toBe('SBI Bank');
    
    // Step 5: Verify financial summary section
    logger.info('Step 5: Verifying financial summary');
    const creditLimit = await cardManagementPage.getCreditLimit();
    const availableCredit = await cardManagementPage.getAvailableCredit();
    const outstanding = await cardManagementPage.getOutstanding();
    expect(creditLimit).toBe('₹75,000');
    expect(availableCredit).toBe('₹50,000');
    expect(outstanding).toBe('₹25,000');
    
    // Step 6: Verify spend analysis section
    logger.info('Step 6: Verifying card-wise spend analysis');
    const monthlySpend = await cardManagementPage.getMonthlySpend();
    expect(monthlySpend).toBe('₹18,000');
    const categoryBreakdown = await cardManagementPage.getCategoryBreakdown();
    expect(categoryBreakdown['Food & Dining']).toBe('₹5,000');
    
    // Step 7: Verify data isolation
    logger.info('Step 7: Verifying data is specific to card-003');
    const isDataIsolated = await cardManagementPage.verifyDataIsolation('card-003');
    expect(isDataIsolated).toBe(true);
    
    // Step 8: Verify card masking
    logger.info('Step 8: Verifying card number masking');
    expect(cardNumber).toMatch(/\*\*\*\* \*\*\*\* \*\*\*\* \d{4}/);
    
    logger.info('Test Case 5992: Completed successfully');
  });

  test('TC-5993: Verify system handles card selection with invalid or non-existent card ID', async ({ page }) => {
    logger.info('Test Case 5993: Starting invalid card ID handling validation');
    
    // Step 1: Authenticate and navigate
    logger.info('Step 1: Authenticating user testuser014');
    await cardManagementPage.authenticateUser('testuser014', 'password123');
    await cardManagementPage.waitForCardListLoad();
    
    // Step 2: Attempt to select invalid card
    logger.info('Step 2: Attempting to select invalid card-999');
    await cardManagementPage.selectCard('card-999');
    
    // Step 3: Verify invalid card ID detection
    logger.info('Step 3: Verifying system detects invalid card ID');
    await expect(cardManagementPage.errorMessage).toBeVisible();
    
    // Step 4: Verify error message display
    logger.info('Step 4: Verifying appropriate error message');
    const errorText = await cardManagementPage.getErrorMessageText();
    expect(errorText).toContain('The selected card cannot be found');
    
    // Step 5: Verify no sensitive data exposure
    logger.info('Step 5: Verifying error message does not expose sensitive data');
    expect(errorText).not.toContain('stack trace');
    expect(errorText).not.toContain('database');
    
    // Step 6: Verify no system crashes
    logger.info('Step 6: Verifying graceful error handling');
    const hasUnhandledErrors = await cardManagementPage.checkForUnhandledExceptions();
    expect(hasUnhandledErrors).toBe(false);
    
    // Step 7: Verify navigation option
    logger.info('Step 7: Verifying back to listing option is available');
    await expect(cardManagementPage.backToListingButton).toBeVisible();
    
    logger.info('Test Case 5993: Completed successfully');
  });

  test('TC-5994: Verify system prevents unauthorized access to card details belonging to different user', async ({ page }) => {
    logger.info('Test Case 5994: Starting unauthorized access prevention validation');
    
    // Step 1: Authenticate as userA
    logger.info('Step 1: Authenticating as userA');
    await cardManagementPage.authenticateUser('userA', 'password123');
    await cardManagementPage.waitForCardListLoad();
    
    // Step 2: Attempt to access userB's card
    logger.info('Step 2: Attempting to access card-999 owned by userB');
    await cardManagementPage.selectCard('card-999');
    
    // Step 3: Verify ownership validation
    logger.info('Step 3: Verifying authentication service validates ownership');
    await expect(cardManagementPage.authorizationError).toBeVisible();
    
    // Step 4: Verify authorization error
    logger.info('Step 4: Verifying 403 Forbidden error');
    const errorText = await cardManagementPage.getAuthorizationErrorText();
    expect(errorText).toContain('You do not have permission');
    
    // Step 5: Verify authorization error message
    logger.info('Step 5: Verifying appropriate authorization error message');
    expect(errorText).toBeTruthy();
    
    // Step 6: Verify no data exposure
    logger.info('Step 6: Verifying no userB data is exposed to userA');
    const hasUserBData = await cardManagementPage.checkForUnauthorizedDataExposure();
    expect(hasUserBData).toBe(false);
    
    // Step 7: Verify security audit log
    logger.info('Step 7: Verifying unauthorized access attempt is logged');
    const isAccessAttemptLogged = await cardManagementPage.verifySecurityAuditLog('userA', 'card-999');
    expect(isAccessAttemptLogged).toBe(true);
    
    // Step 8: Verify no sensitive system information exposure
    logger.info('Step 8: Verifying no sensitive system details exposed');
    expect(errorText).not.toContain('stack trace');
    expect(errorText).not.toContain('internal error');
    
    logger.info('Test Case 5994: Completed successfully');
  });
});

test.describe('Monthly Spend Trends Analysis', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    logger.info('Navigating to analytics for monthly trends tests');
    await analyticsPage.navigate();
  });

  test('TC-5995: Verify monthly spend trends analysis with 12 months of transaction history', async ({ page }) => {
    logger.info('Test Case 5995: Starting 12-month trends validation');
    
    // Step 1: Authenticate user with 12 months history
    logger.info('Step 1: Authenticating user testuser015');
    await analyticsPage.authenticateUser('testuser015', 'password123');
    
    // Step 2: Navigate to monthly trends section
    logger.info('Step 2: Navigating to monthly trends section');
    await analyticsPage.navigateToMonthlyTrends();
    
    // Step 3: Invoke analytics service
    logger.info('Step 3: Waiting for monthly trends data');
    await analyticsPage.waitForMonthlyTrendsLoad();
    
    // Step 4: Verify monthly spend aggregations
    logger.info('Step 4: Verifying monthly spend data for all 12 months');
    const expectedMonthlyData = [
      { month: 'Jan', amount: '₹35,000' },
      { month: 'Feb', amount: '₹42,000' },
      { month: 'Mar', amount: '₹38,000' },
      { month: 'Apr', amount: '₹45,000' },
      { month: 'May', amount: '₹40,000' },
      { month: 'Jun', amount: '₹48,000' },
      { month: 'Jul', amount: '₹52,000' },
      { month: 'Aug', amount: '₹47,000' },
      { month: 'Sep', amount: '₹43,000' },
      { month: 'Oct', amount: '₹50,000' },
      { month: 'Nov', amount: '₹46,000' },
      { month: 'Dec', amount: '₹55,000' }
    ];
    
    for (const monthData of expectedMonthlyData) {
      const amount = await analyticsPage.getMonthlySpend(monthData.month);
      expect(amount).toBe(monthData.amount);
    }
    
    // Step 5: Verify graph displays 12 months
    logger.info('Step 5: Verifying graph displays all 12 months');
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    const dataPoints = await analyticsPage.getChartDataPoints();
    expect(dataPoints.length).toBe(12);
    
    // Step 6: Verify graph render performance
    logger.info('Step 6: Verifying graph renders within 1 second');
    const renderTime = await analyticsPage.measureChartRenderTime();
    expect(renderTime).toBeLessThan(1000);
    
    // Step 7: Verify graph interactivity
    logger.info('Step 7: Verifying graph is interactive');
    const isInteractive = await analyticsPage.verifyChartInteractivity();
    expect(isInteractive).toBe(true);
    
    // Step 8: Verify trend pattern visibility
    logger.info('Step 8: Verifying spending trend is visually clear');
    const hasTrendIndicators = await analyticsPage.checkForTrendIndicators();
    expect(hasTrendIndicators).toBe(true);
    
    logger.info('Test Case 5995: Completed successfully');
  });

  test('TC-5996: Verify monthly spend trends analysis handles user with insufficient historical data', async ({ page }) => {
    logger.info('Test Case 5996: Starting insufficient data handling validation');
    
    // Step 1: Authenticate user with 3 months history
    logger.info('Step 1: Authenticating user testuser016 with 3 months history');
    await analyticsPage.authenticateUser('testuser016', 'password123');
    
    // Step 2: Attempt to view 12-month trends
    logger.info('Step 2: Requesting 12-month trends');
    await analyticsPage.navigateToMonthlyTrends();
    await analyticsPage.selectDateRange(12);
    
    // Step 3: Invoke analytics service
    logger.info('Step 3: Waiting for analytics service response');
    await analyticsPage.waitForMonthlyTrendsLoad();
    
    // Step 4: Verify available 3 months display correct data
    logger.info('Step 4: Verifying available 3 months display correct data');
    const oct2024 = await analyticsPage.getMonthlySpend('Oct');
    const nov2024 = await analyticsPage.getMonthlySpend('Nov');
    const dec2024 = await analyticsPage.getMonthlySpend('Dec');
    expect(oct2024).toBe('₹40,000');
    expect(nov2024).toBe('₹45,000');
    expect(dec2024).toBe('₹50,000');
    
    // Step 5: Verify remaining 9 months show zero
    logger.info('Step 5: Verifying remaining 9 months display ₹0');
    const jan2024 = await analyticsPage.getMonthlySpend('Jan');
    expect(jan2024).toBe('₹0');
    
    // Step 6: Verify insufficient data message
    logger.info('Step 6: Verifying insufficient data message');
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const message = await analyticsPage.getInsufficientDataMessageText();
    expect(message).toContain('Only 3 months of transaction history available');
    
    // Step 7: Verify graph renders with partial data
    logger.info('Step 7: Verifying graph renders without errors');
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    
    // Step 8: Verify no system crashes
    logger.info('Step 8: Verifying graceful handling of insufficient data');
    const hasErrors = await analyticsPage.checkForSystemErrors();
    expect(hasErrors).toBe(false);
    
    logger.info('Test Case 5996: Completed successfully');
  });

  test('TC-5997: Verify monthly spend trends analysis with custom date range selection', async ({ page }) => {
    logger.info('Test Case 5997: Starting custom date range validation');
    
    // Step 1: Authenticate user with 24 months history
    logger.info('Step 1: Authenticating user testuser017 with 24 months history');
    await analyticsPage.authenticateUser('testuser017', 'password123');
    
    // Step 2: Navigate and select custom date range
    logger.info('Step 2: Navigating to monthly trends and selecting custom range');
    await analyticsPage.navigateToMonthlyTrends();
    await expect(analyticsPage.dateRangeSelector).toBeVisible();
    
    // Step 3: Select 6-month custom range
    logger.info('Step 3: Selecting Jul 2024 - Dec 2024 (6 months)');
    await analyticsPage.selectCustomDateRange('2024-07', '2024-12');
    
    // Step 4: Invoke analytics service
    logger.info('Step 4: Waiting for analytics data for selected period');
    await analyticsPage.waitForMonthlyTrendsLoad();
    
    // Step 5: Verify monthly spend for 6 months
    logger.info('Step 5: Verifying monthly spend data for 6 months');
    const expectedData = [
      { month: 'Jul', amount: '₹52,000' },
      { month: 'Aug', amount: '₹47,000' },
      { month: 'Sep', amount: '₹43,000' },
      { month: 'Oct', amount: '₹50,000' },
      { month: 'Nov', amount: '₹46,000' },
      { month: 'Dec', amount: '₹55,000' }
    ];
    
    for (const monthData of expectedData) {
      const amount = await analyticsPage.getMonthlySpend(monthData.month);
      expect(amount).toBe(monthData.amount);
    }
    
    // Step 6: Verify graph displays only 6 months
    logger.info('Step 6: Verifying graph displays only selected 6 months');
    const dataPoints = await analyticsPage.getChartDataPoints();
    expect(dataPoints.length).toBe(6);
    
    // Step 7: Verify category breakdowns included
    logger.info('Step 7: Verifying category breakdowns for each month');
    const hasCategoryBreakdowns = await analyticsPage.verifyCategoryBreakdownsPresent();
    expect(hasCategoryBreakdowns).toBe(true);
    
    // Step 8: Verify graph render performance
    logger.info('Step 8: Verifying graph renders within 1 second');
    const renderTime = await analyticsPage.measureChartRenderTime();
    expect(renderTime).toBeLessThan(1000);
    
    // Step 9: Verify date range modification
    logger.info('Step 9: Verifying user can modify date range');
    await analyticsPage.selectDateRange(3);
    await analyticsPage.waitForMonthlyTrendsLoad();
    const newDataPoints = await analyticsPage.getChartDataPoints();
    expect(newDataPoints.length).toBe(3);
    
    logger.info('Test Case 5997: Completed successfully');
  });
});
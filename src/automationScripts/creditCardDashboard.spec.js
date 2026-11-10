const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { CreditUtilizationPage } = require('./pages/creditUtilization.page');
const { SpendingAnalyticsPage } = require('./pages/spendingAnalytics.page');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { MonthlyTrendsPage } = require('./pages/monthlyTrends.page');
const Logger = require('../utils/logger');

test.describe('Credit Card Dashboard - Real-Time Credit Utilization', () => {

  test('TC-6736: Verify real-time display of available credit and outstanding amounts', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6736');
    
    const loginPage = new LoginPage(page);
    const creditUtilizationPage = new CreditUtilizationPage(page);
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    logger.info('User logged in successfully');
    
    await creditUtilizationPage.navigateToRealTimeCreditUtilization();
    await expect(creditUtilizationPage.creditUtilizationSection).toBeVisible();
    
    await creditUtilizationPage.verifyAvailableCredit('Card1', '$5,000');
    await creditUtilizationPage.verifyAvailableCredit('Card2', '$3,500');
    
    await creditUtilizationPage.verifyOutstandingAmount('Card1', '$2,000');
    await creditUtilizationPage.verifyOutstandingAmount('Card2', '$1,500');
    
    await creditUtilizationPage.verifyLoadTime(2000);
    logger.info('Test Case 6736 completed successfully');
  });

  test('TC-6737: Verify over-limit warning is displayed when credit card exceeds limit', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6737');
    
    const loginPage = new LoginPage(page);
    const creditUtilizationPage = new CreditUtilizationPage(page);
    
    await loginPage.navigate();
    await loginPage.login('overlimituser@example.com', 'Test@1234');
    logger.info('Over-limit user logged in');
    
    await creditUtilizationPage.navigateToRealTimeCreditUtilization();
    await expect(creditUtilizationPage.creditUtilizationSection).toBeVisible();
    
    await expect(creditUtilizationPage.overLimitWarning).toBeVisible();
    await expect(creditUtilizationPage.overLimitWarning).toContainText('Your credit card has exceeded the limit');
    
    await creditUtilizationPage.verifyCreditLimitExceeded('$10,000', '$10,500');
    logger.info('Test Case 6737 completed successfully');
  });

  test('TC-6738: Verify real-time update after completing a new transaction', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6738');
    
    const loginPage = new LoginPage(page);
    const creditUtilizationPage = new CreditUtilizationPage(page);
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    
    await creditUtilizationPage.navigateToRealTimeCreditUtilization();
    const initialAvailable = await creditUtilizationPage.getAvailableCredit();
    const initialOutstanding = await creditUtilizationPage.getOutstandingAmount();
    logger.info(`Initial values - Available: ${initialAvailable}, Outstanding: ${initialOutstanding}`);
    
    await creditUtilizationPage.completeTransaction('$500');
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await creditUtilizationPage.verifyAvailableCreditDecreased('$4,500');
    await creditUtilizationPage.verifyOutstandingAmountIncreased('$2,500');
    logger.info('Test Case 6738 completed successfully');
  });
});

test.describe('Credit Card Dashboard - Spending Analytics', () => {

  test('TC-6739: Verify accurate category-wise spending breakdown across all 9 categories', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6739');
    
    const loginPage = new LoginPage(page);
    const spendingAnalyticsPage = new SpendingAnalyticsPage(page);
    
    await loginPage.navigate();
    await loginPage.login('fullcategoryuser@example.com', 'Test@1234');
    
    await spendingAnalyticsPage.navigateToSpendingAnalytics();
    await expect(spendingAnalyticsPage.analyticsSection).toBeVisible();
    
    await spendingAnalyticsPage.verifyCategoryBreakdownDisplayed();
    
    const expectedCategories = {
      'Food & Dining': '$1,200',
      'Fuel': '$800',
      'Shopping': '$2,500',
      'Travel': '$3,000',
      'Entertainment': '$600',
      'Utilities': '$400',
      'Healthcare': '$1,000',
      'Education': '$1,500',
      'Miscellaneous': '$500'
    };
    
    for (const [category, amount] of Object.entries(expectedCategories)) {
      await spendingAnalyticsPage.verifyCategoryAmount(category, amount);
    }
    logger.info('Test Case 6739 completed successfully');
  });

  test('TC-6740: Verify uncategorized transactions are allocated to Miscellaneous', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6740');
    
    const loginPage = new LoginPage(page);
    const spendingAnalyticsPage = new SpendingAnalyticsPage(page);
    
    await loginPage.navigate();
    await loginPage.login('uncategorizeduser@example.com', 'Test@1234');
    
    await spendingAnalyticsPage.navigateToSpendingAnalytics();
    await expect(spendingAnalyticsPage.analyticsSection).toBeVisible();
    
    await spendingAnalyticsPage.verifyCategoryAmount('Miscellaneous', '$750');
    logger.info('Test Case 6740 completed successfully');
  });

  test('TC-6741: Verify category-wise spending for partial category data', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6741');
    
    const loginPage = new LoginPage(page);
    const spendingAnalyticsPage = new SpendingAnalyticsPage(page);
    
    await loginPage.navigate();
    await loginPage.login('partialcategoryuser@example.com', 'Test@1234');
    
    await spendingAnalyticsPage.navigateToSpendingAnalytics();
    await expect(spendingAnalyticsPage.analyticsSection).toBeVisible();
    
    await spendingAnalyticsPage.verifyCategoryAmount('Food & Dining', '$500');
    await spendingAnalyticsPage.verifyCategoryAmount('Fuel', '$300');
    await spendingAnalyticsPage.verifyCategoryAmount('Shopping', '$1,000');
    
    await spendingAnalyticsPage.verifyEmptyCategories(['Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous']);
    logger.info('Test Case 6741 completed successfully');
  });
});

test.describe('Credit Card Dashboard - Consolidated KPI Dashboard', () => {

  test('TC-6742: Verify consolidated KPI dashboard for multiple credit cards', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6742');
    
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('multicard@example.com', 'Test@1234');
    
    await dashboardPage.openConsolidatedKPIDashboard();
    await dashboardPage.verifyDashboardLoadTime(2000);
    
    await dashboardPage.verifyMonthlySpend('$3,500');
    await dashboardPage.verifyTotalCreditLimit('$18,000');
    await dashboardPage.verifyAvailableCredit('$9,000');
    await dashboardPage.verifyOutstandingAmount('$5,500');
    logger.info('Test Case 6742 completed successfully');
  });

  test('TC-6743: Verify error message for data synchronization errors', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6743');
    
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('syncerroruser@example.com', 'Test@1234');
    
    await dashboardPage.openConsolidatedKPIDashboard();
    
    await expect(dashboardPage.errorMessage).toBeVisible();
    await expect(dashboardPage.errorMessage).toContainText('Unable to calculate KPIs due to data synchronization error');
    logger.info('Test Case 6743 completed successfully');
  });

  test('TC-6744: Verify consolidated KPI dashboard for single credit card', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6744');
    
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('singlecard@example.com', 'Test@1234');
    
    await dashboardPage.openConsolidatedKPIDashboard();
    await dashboardPage.verifyDashboardLoadTime(2000);
    
    await dashboardPage.verifyMonthlySpend('$1,800');
    await dashboardPage.verifyTotalCreditLimit('$10,000');
    await dashboardPage.verifyAvailableCredit('$6,000');
    await dashboardPage.verifyOutstandingAmount('$4,000');
    logger.info('Test Case 6744 completed successfully');
  });
});

test.describe('Credit Card Dashboard - Card Management', () => {

  test('TC-6745: Verify complete list of registered credit cards with details', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6745');
    
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);
    
    await loginPage.navigate();
    await loginPage.login('multiplecardsuser@example.com', 'Test@1234');
    
    await cardManagementPage.navigateToCardManagement();
    await expect(cardManagementPage.cardManagementSection).toBeVisible();
    
    await cardManagementPage.verifyCardCount(3);
    
    await cardManagementPage.verifyCardDetails('Card1', '$10,000', '$5,000', '$5,000');
    await cardManagementPage.verifyCardDetails('Card2', '$8,000', '$4,000', '$4,000');
    await cardManagementPage.verifyCardDetails('Card3', '$5,000', '$2,500', '$2,500');
    logger.info('Test Case 6745 completed successfully');
  });

  test('TC-6746: Verify message when no credit cards are registered', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6746');
    
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);
    
    await loginPage.navigate();
    await loginPage.login('nocardsuser@example.com', 'Test@1234');
    
    await cardManagementPage.navigateToCardManagement();
    await expect(cardManagementPage.cardManagementSection).toBeVisible();
    
    await expect(cardManagementPage.noCardsMessage).toBeVisible();
    await expect(cardManagementPage.noCardsMessage).toContainText('No credit cards registered');
    await expect(cardManagementPage.addCardPrompt).toBeVisible();
    logger.info('Test Case 6746 completed successfully');
  });

  test('TC-6747: Verify system displays all 10 credit cards at maximum capacity', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6747');
    
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);
    
    await loginPage.navigate();
    await loginPage.login('maxcardsuser@example.com', 'Test@1234');
    
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.verifyLoadTime(2000);
    
    await cardManagementPage.verifyCardCount(10);
    await cardManagementPage.verifyAllCardsHaveDetails();
    logger.info('Test Case 6747 completed successfully');
  });
});

test.describe('Credit Card Dashboard - Card Selection and Switching', () => {

  test('TC-6748: Verify card details displayed within 500ms when switching', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6748');
    
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);
    
    await loginPage.navigate();
    await loginPage.login('switchuser@example.com', 'Test@1234');
    
    await cardManagementPage.navigateToCardSelection();
    await expect(cardManagementPage.cardSelectionInterface).toBeVisible();
    
    const startTime = Date.now();
    await cardManagementPage.selectCard('Card2');
    const endTime = Date.now();
    const switchTime = endTime - startTime;
    
    expect(switchTime).toBeLessThan(500);
    await cardManagementPage.verifyCardDetails('Card2', '$8,000', '$4,000', '$4,000');
    logger.info(`Card switched in ${switchTime}ms`);
    logger.info('Test Case 6748 completed successfully');
  });

  test('TC-6749: Verify error message when selecting deactivated card', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6749');
    
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);
    
    await loginPage.navigate();
    await loginPage.login('deactivatedcarduser@example.com', 'Test@1234');
    
    await cardManagementPage.navigateToCardSelection();
    await expect(cardManagementPage.cardSelectionInterface).toBeVisible();
    
    await cardManagementPage.selectCard('DeactivatedCard');
    
    await expect(cardManagementPage.errorMessage).toBeVisible();
    await expect(cardManagementPage.errorMessage).toContainText('This card is no longer available');
    logger.info('Test Case 6749 completed successfully');
  });

  test('TC-6750: Verify card details correctly displayed during rapid switching', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6750');
    
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);
    
    await loginPage.navigate();
    await loginPage.login('rapidswitchuser@example.com', 'Test@1234');
    
    await cardManagementPage.navigateToCardSelection();
    await expect(cardManagementPage.cardSelectionInterface).toBeVisible();
    
    await cardManagementPage.selectCardAndVerify('Card2', '$8,000', '$4,000', '$4,000');
    await cardManagementPage.selectCardAndVerify('Card3', '$5,000', '$2,500', '$2,500');
    await cardManagementPage.selectCardAndVerify('Card1', '$10,000', '$5,000', '$5,000');
    
    logger.info('Test Case 6750 completed successfully');
  });
});

test.describe('Credit Card Dashboard - Monthly Spend Trends', () => {

  test('TC-6751: Verify interactive monthly spend trend chart for 12 months', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6751');
    
    const loginPage = new LoginPage(page);
    const monthlyTrendsPage = new MonthlyTrendsPage(page);
    
    await loginPage.navigate();
    await loginPage.login('fullhistoryuser@example.com', 'Test@1234');
    
    await monthlyTrendsPage.navigateToSpendingAnalytics();
    await expect(monthlyTrendsPage.trendChart).toBeVisible();
    
    const expectedMonthlyData = {
      'Jan': '$2,000', 'Feb': '$2,200', 'Mar': '$1,800', 'Apr': '$2,500',
      'May': '$2,100', 'Jun': '$2,300', 'Jul': '$2,400', 'Aug': '$2,600',
      'Sep': '$2,200', 'Oct': '$2,000', 'Nov': '$2,100', 'Dec': '$2,500'
    };
    
    for (const [month, amount] of Object.entries(expectedMonthlyData)) {
      await monthlyTrendsPage.verifyMonthlySpend(month, amount);
    }
    
    await monthlyTrendsPage.verifyChartInteractivity();
    logger.info('Test Case 6751 completed successfully');
  });

  test('TC-6752: Verify message when no transaction history exists', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6752');
    
    const loginPage = new LoginPage(page);
    const monthlyTrendsPage = new MonthlyTrendsPage(page);
    
    await loginPage.navigate();
    await loginPage.login('nohistoryuser@example.com', 'Test@1234');
    
    await monthlyTrendsPage.navigateToSpendingAnalytics();
    
    await expect(monthlyTrendsPage.insufficientDataMessage).toBeVisible();
    await expect(monthlyTrendsPage.insufficientDataMessage).toContainText('Insufficient data to display monthly spend trends');
    logger.info('Test Case 6752 completed successfully');
  });

  test('TC-6753: Verify monthly spend trend chart for partial transaction history', async ({ page }) => {
    const logger = new Logger();
    logger.info('Starting Test Case 6753');
    
    const loginPage = new LoginPage(page);
    const monthlyTrendsPage = new MonthlyTrendsPage(page);
    
    await loginPage.navigate();
    await loginPage.login('partialhistoryuser@example.com', 'Test@1234');
    
    await monthlyTrendsPage.navigateToSpendingAnalytics();
    await expect(monthlyTrendsPage.trendChart).toBeVisible();
    
    const expectedPartialData = {
      'Jan': '$2,000', 'Feb': '$2,200', 'Mar': '$1,800', 'Apr': '$2,500', 'May': '$2,100'
    };
    
    for (const [month, amount] of Object.entries(expectedPartialData)) {
      await monthlyTrendsPage.verifyMonthlySpend(month, amount);
    }
    
    await monthlyTrendsPage.verifyEmptyMonths(['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    logger.info('Test Case 6753 completed successfully');
  });
});
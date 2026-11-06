const { test, expect } = require('@playwright/test');
const { CreditCardDashboardPage } = require('./pages/creditCardDashboard.page');

test.describe('Credit Card Analysis Dashboard - Consolidated View Tests', () => {

  test('TC-001: Verify consolidated view displays all registered credit cards with key details for multi-card user', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate();
    await expect(dashboardPage.loginForm).toBeVisible();
    
    // Step 2: Log in with multi-card user credentials
    await dashboardPage.login('multicard_user', 'Pass@123');
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 3: Navigate to dashboard homepage to view consolidated credit card view
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.consolidatedViewSection).toBeVisible();
    
    // Step 4: Verify all registered credit cards are displayed
    const expectedCards = ['Visa *1234', 'Mastercard *5678', 'Amex *9012'];
    await dashboardPage.verifyAllCardsDisplayed(expectedCards);
    
    // Step 5: Verify key details for each card are displayed accurately
    const cardDetails = [
      { cardNumber: 'Visa *1234', limit: '$10,000', balance: '$2,500' },
      { cardNumber: 'Mastercard *5678', limit: '$15,000', balance: '$5,000' },
      { cardNumber: 'Amex *9012', limit: '$20,000', balance: '$8,000' }
    ];
    await dashboardPage.verifyCardDetails(cardDetails);
  });

  test('TC-002: Verify consolidated view displays single credit card with all financial metrics for single-card user', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate();
    await expect(dashboardPage.loginForm).toBeVisible();
    
    // Step 2: Log in with single-card user credentials
    await dashboardPage.login('singlecard_user', 'Pass@123');
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 3: Navigate to dashboard homepage to view consolidated credit card view
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.consolidatedViewSection).toBeVisible();
    
    // Step 4: Verify single registered credit card is displayed
    const expectedCards = ['Visa *4321'];
    await dashboardPage.verifyAllCardsDisplayed(expectedCards);
    
    // Step 5: Verify all key financial metrics for the card are populated correctly
    const financialMetrics = {
      cardNumber: 'Visa *4321',
      monthlySpend: '$1,200',
      totalCreditLimit: '$8,000',
      availableCredit: '$5,500',
      outstandingAmount: '$2,500'
    };
    await dashboardPage.verifyCardFinancialMetrics(financialMetrics);
  });

  test('TC-003: Verify consolidated view displays zero-state message for user with no registered credit cards', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate();
    await expect(dashboardPage.loginForm).toBeVisible();
    
    // Step 2: Log in with no-card user credentials
    await dashboardPage.login('nocard_user', 'Pass@123');
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 3: Navigate to dashboard homepage to view consolidated credit card view
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.consolidatedViewSection).toBeVisible();
    
    // Step 4: Verify consolidated view is empty or displays zero-state message
    await dashboardPage.verifyZeroStateMessage();
    
    // Step 5: Verify no card details are displayed
    await dashboardPage.verifyNoCardsDisplayed();
  });

});
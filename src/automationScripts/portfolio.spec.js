const { test, expect } = require('@playwright/test');
const { PortfolioPage } = require('./pages/portfolio.page');

test.describe('Portfolio Dashboard Tests', () => {

  test('QE-8860 TS-001 TC-001 - Verify user with multiple active credit cards from different issuers can view all cards in a unified interface', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);
    
    // Step 1: Launch application
    await portfolioPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login
    await portfolioPage.login('testuser_multicard', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Navigate to Portfolio Dashboard
    const startTime = Date.now();
    await portfolioPage.navigateToPortfolio();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    
    // Step 4: Verify all credit cards are displayed
    const cardCount = await portfolioPage.getCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(3);
    expect(cardCount).toBeLessThanOrEqual(5);
    
    // Step 5: Verify Card 1 details
    await portfolioPage.verifyCardDetails(0, {
      creditLimit: 10000,
      availableCredit: 7500,
      outstandingBalance: 2500
    });
    
    // Step 6: Verify Card 2 details
    await portfolioPage.verifyCardDetails(1, {
      creditLimit: 15000,
      availableCredit: 10000,
      outstandingBalance: 5000
    });
    
    // Step 7: Verify Card 3 details
    await portfolioPage.verifyCardDetails(2, {
      creditLimit: 20000,
      availableCredit: 18000,
      outstandingBalance: 2000
    });
    
    // Step 8: Verify portfolio summary
    await portfolioPage.verifyPortfolioSummary({
      totalCreditLimit: 45000,
      totalAvailableCredit: 35500,
      totalOutstanding: 9500
    });
    
    // Step 9: Verify issuer information
    await portfolioPage.verifyCardIssuerInfo(0, 'Bank A', 'Visa');
    await portfolioPage.verifyCardIssuerInfo(1, 'Bank B', 'MasterCard');
    await portfolioPage.verifyCardIssuerInfo(2, 'Bank C', 'Amex');
  });

  test('QE-8860 TS-002 TC-001 - Verify system returns appropriate error message when backend card data service is unavailable', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);
    
    // Step 1: Launch application
    await portfolioPage.navigate();
    
    // Step 2: Login
    await portfolioPage.login('testuser', 'Test@123');
    
    // Step 3: Simulate backend service unavailability
    await page.route('**/api/cards/**', route => route.abort());
    
    // Step 4: Navigate to Portfolio Dashboard
    await portfolioPage.navigateToPortfolio();
    
    // Step 5: Verify error message is displayed
    await portfolioPage.verifyErrorMessage('Unable to retrieve credit card data. Service temporarily unavailable. Please try again later.');
    
    // Step 6: Verify no partial or stale data is displayed
    const cardCount = await portfolioPage.getCardCount();
    expect(cardCount).toBe(0);
    
    // Step 7: Verify dashboard remains responsive
    await expect(page).not.toHaveTitle(/Error/);
    
    // Step 8: Verify retry option is available
    await portfolioPage.verifyRetryButtonVisible();
  });

  test('QE-8860 TS-003 TC-001 - Verify system displays clear message when user has no active credit cards', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);
    
    // Step 1: Launch application
    await portfolioPage.navigate();
    
    // Step 2: Login with user having no cards
    await portfolioPage.login('testuser_nocards', 'Test@123');
    
    // Step 3: Navigate to Portfolio Dashboard
    await portfolioPage.navigateToPortfolio();
    
    // Step 4: Verify informational message
    await portfolioPage.verifyInfoMessage('No credit cards found. You currently have no active credit cards associated with your account.');
    
    // Step 5: Verify no error messages
    await portfolioPage.verifyNoErrorMessages();
    
    // Step 6: Verify dashboard is responsive
    await expect(page).not.toHaveTitle(/Error/);
    
    // Step 7: Verify portfolio summary shows zero values
    await portfolioPage.verifyPortfolioSummary({
      totalCreditLimit: 0,
      totalAvailableCredit: 0,
      totalOutstanding: 0
    });
    
    // Step 8: Verify user can navigate to other sections
    await portfolioPage.navigateToKPIDashboard();
    await expect(page).toHaveURL(/kpi/);
  });

  test('QE-8861 TS-001 TC-001 - Verify available credit is accurately calculated and displayed for cards with varying utilization levels', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);
    
    // Step 1: Launch application on desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await portfolioPage.navigate();
    
    // Step 2: Login
    await portfolioPage.login('testuser_varying_util', 'Test@123');
    
    // Step 3: Navigate to Portfolio Dashboard
    await portfolioPage.navigateToPortfolio();
    
    // Step 4: Verify Card 1 (0% utilization)
    await portfolioPage.verifyCardDetails(0, {
      creditLimit: 10000,
      outstandingBalance: 0,
      availableCredit: 10000
    });
    
    // Step 5: Verify Card 2 (50% utilization)
    await portfolioPage.verifyCardDetails(1, {
      creditLimit: 8000,
      outstandingBalance: 4000,
      availableCredit: 4000
    });
    
    // Step 6: Verify Card 3 (90% utilization)
    await portfolioPage.verifyCardDetails(2, {
      creditLimit: 5000,
      outstandingBalance: 4500,
      availableCredit: 500
    });
    
    // Step 7: Verify formatting on desktop
    await portfolioPage.verifyAmountFormatting();
    
    // Step 8: Verify responsive layout on tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await portfolioPage.verifyResponsiveLayout('tablet');
    
    // Step 9: Verify responsive layout on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await portfolioPage.verifyResponsiveLayout('mobile');
  });

  test('QE-8861 TS-002 TC-001 - Verify system correctly displays negative available credit with appropriate visual indicators', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);
    
    // Step 1: Launch application
    await portfolioPage.navigate();
    
    // Step 2: Login with overlimit user
    await portfolioPage.login('testuser_overlimit', 'Test@123');
    
    // Step 3: Navigate to Portfolio Dashboard
    await portfolioPage.navigateToPortfolio();
    
    // Step 4: Locate card with exceeded limit
    const overlimitCard = await portfolioPage.getCardByName('Visa Platinum');
    await expect(overlimitCard).toBeVisible();
    
    // Step 5: Verify negative available credit
    await portfolioPage.verifyNegativeAvailableCredit(overlimitCard, -500);
    
    // Step 6: Verify visual indicators
    await portfolioPage.verifyOverlimitVisualIndicators(overlimitCard);
    
    // Step 7: Verify warning message
    await portfolioPage.verifyWarningMessage(overlimitCard, 'Credit limit exceeded by $500.00');
    
    // Step 8: Verify card status
    await portfolioPage.verifyCardStatus(overlimitCard, 'Over Limit');
  });

  test('QE-8861 TS-003 TC-001 - Verify system detects and handles inconsistent balance data', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);
    
    // Step 1: Launch application
    await portfolioPage.navigate();
    
    // Step 2: Login
    await portfolioPage.login('testuser', 'Test@123');
    
    // Step 3: Simulate inconsistent data
    await page.route('**/api/balances/**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([{
          cardId: 'card1',
          creditLimit: 5000,
          availableCredit: 6000,
          outstandingBalance: -1000
        }])
      });
    });
    
    // Step 4: Navigate to Portfolio Dashboard
    await portfolioPage.navigateToPortfolio();
    
    // Step 5: Verify system detects data integrity issue
    await page.waitForTimeout(1000);
    
    // Step 6: Verify error message or validation logic
    const hasError = await portfolioPage.hasDataIntegrityError();
    expect(hasError).toBe(true);
    
    // Step 7: Verify invalid credit information is not displayed
    const availableCredit = await portfolioPage.getCardAvailableCredit(0);
    expect(availableCredit).not.toBe(6000);
    
    // Step 8: Verify other cards display normally
    await portfolioPage.verifyOtherCardsDisplayNormally();
  });

});

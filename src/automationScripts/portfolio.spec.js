const { test, expect } = require('@playwright/test');
const { PortfolioPage } = require('./pages/portfolio.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Credit Card Portfolio Management', () => {
  let portfolioPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    portfolioPage = new PortfolioPage(page);
    await loginPage.navigateToApp();
  });

  test('TC-6696: Verify user with multiple credit cards can view complete portfolio within 300ms', async ({ page }) => {
    await loginPage.login('testuser_multicard', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    const startTime = Date.now();
    await portfolioPage.navigateToPortfolio();
    await portfolioPage.waitForPortfolioLoad();
    const loadTime = Date.now() - startTime;
    
    await expect(portfolioPage.portfolioContainer).toBeVisible();
    const cardCount = await portfolioPage.getDisplayedCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(3);
    
    await portfolioPage.verifyCardDetailsVisible('Card 1234');
    await portfolioPage.verifyCardDetailsVisible('Card 5678');
    await portfolioPage.verifyCardDetailsVisible('Card 9012');
    
    expect(loadTime).toBeLessThan(300);
  });

  test('TC-6697: Verify user with no credit cards receives appropriate empty state message', async ({ page }) => {
    await loginPage.login('testuser_nocard', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await portfolioPage.navigateToPortfolio();
    await portfolioPage.waitForPortfolioLoad();
    
    await expect(portfolioPage.emptyStateMessage).toBeVisible();
    await expect(portfolioPage.emptyStateMessage).toContainText('No credit cards found');
    
    await expect(portfolioPage.errorMessage).not.toBeVisible();
    const cardCount = await portfolioPage.getDisplayedCardCount();
    expect(cardCount).toBe(0);
  });

  test('TC-6698: Verify system displays user-friendly error when Card Management Service unavailable', async ({ page }) => {
    await page.route('**/api/cards/**', route => route.abort('failed'));
    
    await loginPage.login('testuser', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await portfolioPage.navigateToPortfolio();
    await portfolioPage.waitForErrorMessage();
    
    await expect(portfolioPage.serviceErrorMessage).toBeVisible();
    await expect(portfolioPage.serviceErrorMessage).toContainText('Unable to load portfolio. Please try again later.');
    
    await expect(portfolioPage.stackTraceElement).not.toBeVisible();
    await expect(page).not.toHaveURL(/.*error/);
  });

  test('TC-6708: Verify user can view individual card details within 300ms', async ({ page }) => {
    await loginPage.login('testuser', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await portfolioPage.navigateToPortfolio();
    await portfolioPage.waitForPortfolioLoad();
    
    const startTime = Date.now();
    await portfolioPage.selectCard('Card 1234');
    await portfolioPage.waitForCardDetailsLoad();
    const loadTime = Date.now() - startTime;
    
    await expect(portfolioPage.cardDetailsModal).toBeVisible();
    await portfolioPage.verifyCardDetailField('Credit Limit', '$20,000');
    await portfolioPage.verifyCardDetailField('Outstanding', '$5,000');
    await portfolioPage.verifyCardDetailField('Available', '$15,000');
    
    expect(loadTime).toBeLessThan(300);
  });

  test('TC-6709: Verify system denies access for unauthorized card access attempt', async ({ page }) => {
    await loginPage.login('testuser', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await page.goto('/portfolio/card/card9999');
    
    await expect(portfolioPage.unauthorizedAccessMessage).toBeVisible();
    await expect(portfolioPage.unauthorizedAccessMessage).toContainText('You do not have permission to view this card');
    
    await expect(portfolioPage.cardDetailsModal).not.toBeVisible();
    await expect(portfolioPage.sensitiveCardData).not.toBeVisible();
  });

  test('TC-6710: Verify card with zero outstanding balance displays correct values', async ({ page }) => {
    await loginPage.login('testuser_zerobalance', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await portfolioPage.navigateToPortfolio();
    await portfolioPage.waitForPortfolioLoad();
    
    await portfolioPage.selectCard('Card 5678');
    await portfolioPage.waitForCardDetailsLoad();
    
    await expect(portfolioPage.cardDetailsModal).toBeVisible();
    await portfolioPage.verifyCardDetailField('Credit Limit', '$15,000');
    await portfolioPage.verifyCardDetailField('Outstanding', '$0');
    await portfolioPage.verifyCardDetailField('Available', '$15,000');
    
    await expect(portfolioPage.nullValueError).not.toBeVisible();
    await expect(portfolioPage.undefinedValueError).not.toBeVisible();
  });
});

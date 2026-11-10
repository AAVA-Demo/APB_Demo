const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CardsPage } = require('./pages/cards.page');
const { CardDetailPage } = require('./pages/cardDetail.page');
const logger = require('../utils/logger');

test.describe('Card-Specific Details View', () => {
  let loginPage, cardsPage, cardDetailPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardsPage = new CardsPage(page);
    cardDetailPage = new CardDetailPage(page);
    await loginPage.navigate();
  });

  test('QE-10352 TS-001 TC-001: Verify card-specific details page displays correct information and recent transactions', async ({ page }) => {
    logger.info('Test Case: QE-10352 TS-001 TC-001 - Card details display');
    
    await loginPage.login('testuser_multicard', 'Pass@123');
    await cardsPage.navigateToMyCards();
    
    await cardsPage.clickCardByIndex(0);
    
    await expect(cardDetailPage.cardDetailContainer).toBeVisible();
    
    const creditLimit = await cardDetailPage.getCreditLimit();
    expect(creditLimit).toContain('50,000');
    logger.info('Credit Limit validated: ' + creditLimit);
    
    const currentBalance = await cardDetailPage.getCurrentBalance();
    expect(currentBalance).toContain('12,500');
    logger.info('Current Balance validated: ' + currentBalance);
    
    const availableCredit = await cardDetailPage.getAvailableCredit();
    expect(availableCredit).toContain('37,500');
    logger.info('Available Credit validated: ' + availableCredit);
    
    const transactionCount = await cardDetailPage.getTransactionCount();
    expect(transactionCount).toBe(10);
    logger.info('10 most recent transactions displayed');
    
    await cardDetailPage.verifyTransactionDetails(0, '125.50', '2026-11-09', 'Restaurant ABC');
    logger.info('Transaction details verified for accuracy');
  });

  test('QE-10352 TS-002 TC-001: Verify system prevents access to deactivated card details with appropriate error message', async ({ page }) => {
    logger.info('Test Case: QE-10352 TS-002 TC-001 - Deactivated card access prevention');
    
    await loginPage.login('testuser_deactivatedcard', 'Pass@123');
    await cardsPage.navigateToMyCards();
    
    await cardsPage.clickCardByCardNumber('**** 5678');
    
    await expect(cardDetailPage.errorMessage).toBeVisible();
    const errorText = await cardDetailPage.errorMessage.textContent();
    expect(errorText).toContain('Card no longer active');
    logger.info('Error message displayed: ' + errorText);
    
    await expect(cardDetailPage.cardDetailContainer).not.toBeVisible();
    logger.info('No stale card details displayed');
    
    await expect(cardDetailPage.backToDashboardButton).toBeVisible();
    await cardDetailPage.backToDashboardButton.click();
    await expect(cardsPage.cardsContainer).toBeVisible();
    logger.info('User navigated back to dashboard successfully');
  });

  test('QE-10352 TS-003 TC-001: Verify system prevents unauthorized access to card details via URL manipulation', async ({ page }) => {
    logger.info('Test Case: QE-10352 TS-003 TC-001 - Unauthorized access prevention');
    
    await loginPage.login('testuser_A', 'Pass@123');
    await cardsPage.navigateToMyCards();
    
    await page.goto('https://creditcard-dashboard.example.com/card-detail/card999');
    
    const isForbiddenErrorDisplayed = await cardDetailPage.forbiddenError.isVisible();
    const isRedirectedToDashboard = await cardsPage.cardsContainer.isVisible();
    
    expect(isForbiddenErrorDisplayed || isRedirectedToDashboard).toBeTruthy();
    
    if (isForbiddenErrorDisplayed) {
      const errorText = await cardDetailPage.forbiddenError.textContent();
      expect(errorText).toContain('403 Forbidden');
      logger.info('403 Forbidden error displayed: ' + errorText);
    } else {
      await expect(cardDetailPage.unauthorizedAccessMessage).toBeVisible();
      const messageText = await cardDetailPage.unauthorizedAccessMessage.textContent();
      expect(messageText).toContain('You do not have permission');
      logger.info('Unauthorized access message displayed: ' + messageText);
    }
    
    await expect(cardDetailPage.cardDetailContainer).not.toBeVisible();
    logger.info('No unauthorized card information exposed');
  });
});

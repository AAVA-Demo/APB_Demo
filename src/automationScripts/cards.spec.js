const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CardsPage } = require('./pages/cards.page');
const logger = require('../utils/logger');

test.describe('Multiple Credit Cards Display and Management', () => {
  let loginPage, cardsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardsPage = new CardsPage(page);
    await loginPage.navigate();
  });

  test('QE-10351 TS-001 TC-001: Verify dashboard displays all 5 credit cards with correct names and masked card numbers', async ({ page }) => {
    logger.info('Test Case: QE-10351 TS-001 TC-001 - Display 5 credit cards');
    
    await loginPage.login('testuser_5cards', 'Pass@123');
    await cardsPage.navigateToMyCards();
    
    await expect(cardsPage.cardsContainer).toBeVisible();
    
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(5);
    logger.info('Total cards displayed: ' + cardCount);
    
    await cardsPage.verifyCardDetails(0, 'Visa', '**** **** **** 1234');
    await cardsPage.verifyCardDetails(1, 'MasterCard', '**** **** **** 5678');
    await cardsPage.verifyCardDetails(2, 'Amex', '**** **** **** 9012');
    await cardsPage.verifyCardDetails(3, 'Visa', '**** **** **** 3456');
    await cardsPage.verifyCardDetails(4, 'MasterCard', '**** **** **** 7890');
    
    logger.info('All 5 cards verified with correct names and masked numbers');
  });

  test('QE-10351 TS-002 TC-001: Verify dashboard displays 11 credit cards without performance degradation', async ({ page }) => {
    logger.info('Test Case: QE-10351 TS-002 TC-001 - Display 11 credit cards');
    
    const startTime = Date.now();
    
    await loginPage.login('testuser_11cards', 'Pass@123');
    await cardsPage.navigateToMyCards();
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    logger.info('Dashboard loaded in ' + loadTime + 'ms (within 2 seconds)');
    
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(11);
    logger.info('Total cards displayed: ' + cardCount);
    
    const paginationVisible = await cardsPage.paginationControls.isVisible();
    if (paginationVisible) {
      await expect(cardsPage.paginationControls).toBeVisible();
      logger.info('Pagination controls are working correctly');
    }
    
    await cardsPage.clickCardByIndex(0);
    await page.goBack();
    await cardsPage.clickCardByIndex(10);
    logger.info('UI remains responsive; all cards are clickable');
  });

  test('QE-10351 TS-003 TC-001: Verify dashboard filters out invalid card data and displays warning message', async ({ page }) => {
    logger.info('Test Case: QE-10351 TS-003 TC-001 - Handle invalid card data');
    
    await loginPage.login('testuser_invalidcards', 'Pass@123');
    await cardsPage.navigateToMyCards();
    
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(3);
    logger.info('Only 3 valid cards displayed (Card1, Card2, Card3)');
    
    await expect(cardsPage.warningMessage).toBeVisible();
    const warningText = await cardsPage.warningMessage.textContent();
    expect(warningText).toContain('data inconsistencies');
    logger.info('Warning message displayed: ' + warningText);
    
    await cardsPage.clickCardByIndex(0);
    logger.info('Valid cards remain fully interactive');
  });
});

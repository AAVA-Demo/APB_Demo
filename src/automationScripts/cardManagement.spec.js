const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Credit Card Management - Multiple Cards and Card-wise Analysis', () => {
  let cardManagementPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Initializing Card Management test suite');
    cardManagementPage = new CardManagementPage(page);
    loginPage = new LoginPage(page);
  });

  test('QE-7752 TS-001 TC-001: Verify user can select valid card and view spending with transaction breakdown', async ({ page }) => {
    logger.info('Test Case: QE-7752 TS-001 TC-001 - Card selection and spending view');
    
    await cardManagementPage.navigate();
    await loginPage.login('testuser_with_transactions', 'Pass@123');
    
    await cardManagementPage.navigateToCardManagement();
    await expect(cardManagementPage.cardListContainer).toBeVisible();
    logger.info('Card management page loaded with card list');
    
    await cardManagementPage.selectCard('Visa Gold');
    await expect(cardManagementPage.selectedCardHighlight).toBeVisible();
    logger.info('Card selected and highlighted');
    
    const currentMonthSpend = await cardManagementPage.getCurrentMonthSpending();
    expect(currentMonthSpend).toBe('$1,250.00');
    logger.info('Current month spending verified: $1,250.00');
    
    await expect(cardManagementPage.transactionList).toBeVisible();
    const transactions = await cardManagementPage.getRecentTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions[0]).toContain('Restaurant A');
    expect(transactions[0]).toContain('$50');
    logger.info('Transaction breakdown displayed correctly');
  });

  test('QE-7752 TS-002 TC-001: Verify card with no transactions displays appropriate message', async ({ page }) => {
    logger.info('Test Case: QE-7752 TS-002 TC-001 - No transactions message');
    
    await cardManagementPage.navigate();
    await loginPage.login('testuser_no_current_transactions', 'Pass@123');
    
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.selectCard('MasterCard Platinum');
    
    await expect(cardManagementPage.noTransactionsMessage).toBeVisible();
    const message = await cardManagementPage.getNoTransactionsMessage();
    expect(message).toContain('No transactions found for this card in the current month');
    logger.info('No transactions message displayed correctly');
    
    await expect(cardManagementPage.emptyTransactionTable).not.toBeVisible();
    logger.info('Verified no empty transaction table displayed');
  });

  test('QE-7752 TS-003 TC-001: Verify deactivated card displays error message without application crash', async ({ page }) => {
    logger.info('Test Case: QE-7752 TS-003 TC-001 - Deactivated card error handling');
    
    await cardManagementPage.navigate();
    await loginPage.login('testuser_deactivated_card', 'Pass@123');
    
    await cardManagementPage.attemptAccessDeactivatedCard('card_deactivated_123');
    
    await expect(cardManagementPage.errorMessage).toBeVisible();
    const errorText = await cardManagementPage.getErrorMessage();
    expect(errorText).toContain('Card not found or no longer active');
    logger.info('Error message displayed for deactivated card');
    
    await expect(cardManagementPage.cardListContainer).toBeVisible();
    logger.info('Application remained stable without crash');
  });

  test('QE-7748 TS-001 TC-001: Verify multiple cards display with complete information within 3 seconds', async ({ page }) => {
    logger.info('Test Case: QE-7748 TS-001 TC-001 - Multiple cards display');
    
    await cardManagementPage.navigate();
    await loginPage.login('testuser_multiple_cards', 'Pass@123');
    
    const startTime = Date.now();
    await cardManagementPage.navigateToCardManagement();
    
    await expect(cardManagementPage.cardListContainer).toBeVisible();
    const cards = await cardManagementPage.getAllCards();
    expect(cards.length).toBeGreaterThanOrEqual(3);
    logger.info(`${cards.length} cards displayed`);
    
    for (const card of cards) {
      expect(card.name).toBeTruthy();
      expect(card.lastFourDigits).toMatch(/\d{4}/);
      expect(card.balance).toMatch(/\$[\d,]+\.\d{2}/);
    }
    logger.info('All cards display complete information');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(3000);
    logger.info(`Cards loaded in ${loadTime}ms (requirement: ≤3000ms)`);
  });

  test('QE-7748 TS-002 TC-001: Verify 10 cards display without performance degradation', async ({ page }) => {
    logger.info('Test Case: QE-7748 TS-002 TC-001 - Maximum cards performance');
    
    await cardManagementPage.navigate();
    await loginPage.login('testuser_10_cards', 'Pass@123');
    
    const startTime = Date.now();
    await cardManagementPage.navigateToCardManagement();
    
    await expect(cardManagementPage.cardListContainer).toBeVisible();
    const cards = await cardManagementPage.getAllCards();
    expect(cards.length).toBe(10);
    logger.info('All 10 cards displayed');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(3000);
    logger.info(`10 cards loaded in ${loadTime}ms without degradation`);
    
    await cardManagementPage.scrollCardList();
    await cardManagementPage.selectCard(cards[9].name);
    await expect(cardManagementPage.selectedCardHighlight).toBeVisible();
    logger.info('Interactions remain smooth with 10 cards');
  });

  test('QE-7748 TS-003 TC-001: Verify no cards displays clear message without broken interface', async ({ page }) => {
    logger.info('Test Case: QE-7748 TS-003 TC-001 - No cards message');
    
    await cardManagementPage.navigate();
    await loginPage.login('testuser_no_cards_management', 'Pass@123');
    
    await cardManagementPage.navigateToCardManagement();
    
    await expect(cardManagementPage.noCardsMessage).toBeVisible();
    const message = await cardManagementPage.getNoCardsMessage();
    expect(message).toContain('You have no credit cards registered');
    logger.info('No cards message displayed correctly');
    
    await expect(cardManagementPage.emptyCardGrid).not.toBeVisible();
    logger.info('Verified no empty or broken interface elements');
  });
});
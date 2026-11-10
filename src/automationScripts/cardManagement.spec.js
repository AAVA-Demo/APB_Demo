const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { Logger } = require('../utils/logger');

test.describe('Card Management Tests', () => {
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    await cardManagementPage.navigate();
    Logger.info('Navigated to Card Management page');
  });

  test('TC-6402: Verify card-specific spending analysis displays correctly when user selects a specific card', async ({ page }) => {
    Logger.info('Starting test: Verify card-specific spending analysis');
    await cardManagementPage.waitForCardsToLoad();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBeGreaterThan(0);
    
    await cardManagementPage.selectFirstCard();
    await expect(cardManagementPage.cardDetailPanel).toBeVisible();
    
    const monthlySpend = await cardManagementPage.getCardMonthlySpend();
    const transactionCount = await cardManagementPage.getCardTransactionCount();
    
    expect(monthlySpend).toContain('$');
    expect(transactionCount).toBeTruthy();
    Logger.info('Card-specific spending analysis verified');
  });

  test('TC-6403: Verify spending analytics service retrieves card-specific data without affecting other cards', async ({ page }) => {
    Logger.info('Starting test: Verify spending analytics isolation');
    await cardManagementPage.waitForCardsToLoad();
    
    await cardManagementPage.selectCardByIndex(0);
    const firstCardSpend = await cardManagementPage.getCardMonthlySpend();
    
    await cardManagementPage.selectCardByIndex(1);
    const secondCardSpend = await cardManagementPage.getCardMonthlySpend();
    
    expect(firstCardSpend).not.toBe(secondCardSpend);
    Logger.info('Card-specific data isolation verified');
  });

  test('TC-6404: Verify error handling when spending analytics service fails', async ({ page }) => {
    Logger.info('Starting test: Verify error handling for analytics failure');
    await page.route('**/api/cards/*/spending', route => route.abort());
    
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardsToLoad();
    await cardManagementPage.selectFirstCard();
    
    await expect(cardManagementPage.errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await cardManagementPage.getErrorMessage();
    expect(errorText).toContain('Failed to load');
    
    // Verify basic card info still displays
    await expect(cardManagementPage.cardDetailPanel).toBeVisible();
    Logger.info('Error handling verified, basic card info still visible');
  });

  test('TC-6405: Verify multiple active credit cards display in card management interface', async ({ page }) => {
    Logger.info('Starting test: Verify multiple cards display');
    await cardManagementPage.waitForCardsToLoad();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(3);
    
    const allCardsVisible = await cardManagementPage.areAllCardsVisible();
    expect(allCardsVisible).toBe(true);
    
    const cardTypes = await cardManagementPage.getAllCardTypes();
    expect(cardTypes.length).toBeGreaterThan(0);
    Logger.info(`Verified ${cardCount} cards are displayed`);
  });

  test('TC-6406: Verify unified card portfolio displays accurate financial data from card data repository', async ({ page }) => {
    Logger.info('Starting test: Verify accurate financial data display');
    await cardManagementPage.waitForCardsToLoad();
    
    await cardManagementPage.selectFirstCard();
    
    const balance = await cardManagementPage.getCardBalance();
    const availableCredit = await cardManagementPage.getCardAvailableCredit();
    const creditLimit = await cardManagementPage.getCardCreditLimit();
    
    expect(balance).toContain('$');
    expect(availableCredit).toContain('$');
    expect(creditLimit).toContain('$');
    Logger.info('Financial data accuracy verified');
  });

  test('TC-6407: Verify appropriate error message when card data repository service is unavailable', async ({ page }) => {
    Logger.info('Starting test: Verify error message for unavailable service');
    await page.route('**/api/cards', route => route.abort());
    
    await cardManagementPage.navigate();
    await expect(cardManagementPage.errorMessage).toBeVisible({ timeout: 5000 });
    
    const errorText = await cardManagementPage.getErrorMessage();
    expect(errorText).toContain('Failed to load card portfolio');
    expect(errorText).not.toContain('stack');
    expect(errorText).not.toContain('database');
    Logger.info('Error message verified - no sensitive details exposed');
  });
});

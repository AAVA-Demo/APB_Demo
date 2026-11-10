const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/card-management.page');
const { AuthHelper } = require('./helpers/auth.helper');

test.describe('Multiple Credit Card Display Interface - QE-10014', () => {
  let cardManagementPage;
  
  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
  });
  
  test('QE-10014 TS-001 TC-001 - Verify consolidated interface displays all 5 registered credit cards with complete card details', async ({ page }) => {
    await AuthHelper.authenticate(page, 'user123');
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(5);
    
    const cards = await cardManagementPage.getAllCards();
    expect(cards.length).toBe(5);
    
    const expectedCardTypes = ['Visa Platinum', 'Mastercard Gold', 'Amex Blue', 'Visa Signature', 'Mastercard Titanium'];
    const cardTypes = cards.map(card => card.cardType);
    expect(cardTypes).toEqual(expectedCardTypes);
    
    cards.forEach(card => {
      expect(card.creditLimit).toMatch(/^\d+\.\d{2}$/);
      expect(card.currentBalance).toMatch(/^\d+\.\d{2}$/);
    });
  });
  
  test('QE-10014 TS-001 TC-002 - Verify card display includes available balance and color-coded utilization status', async ({ page }) => {
    await AuthHelper.authenticate(page, 'user123');
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    
    const cards = await cardManagementPage.getAllCards();
    
    cards.forEach(card => {
      expect(card.availableBalance).toMatch(/^\d+\.\d{2}$/);
      expect(['green', 'yellow', 'red']).toContain(card.utilizationColor);
    });
    
    const card1Utilization = parseFloat(cards[0].utilization);
    expect(card1Utilization).toBe(25);
    expect(cards[0].utilizationColor).toBe('green');
    
    const card2Utilization = parseFloat(cards[1].utilization);
    expect(card2Utilization).toBe(40);
    expect(cards[1].utilizationColor).toBe('yellow');
  });
  
  test('QE-10014 TS-002 TC-001 - Verify empty card list display with appropriate message when user has no registered cards', async ({ page }) => {
    await AuthHelper.authenticate(page, 'user999');
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(0);
    
    const emptyMessage = await cardManagementPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No credit cards found');
  });
  
  test('QE-10014 TS-003 TC-001 - Verify system successfully loads and displays 10 credit cards at maximum supported limit with complete financial details and acceptable performance', async ({ page }) => {
    await AuthHelper.authenticate(page, 'user456');
    await cardManagementPage.navigate();
    
    const startTime = Date.now();
    await cardManagementPage.waitForCardListLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(500);
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(10);
    
    const cards = await cardManagementPage.getAllCards();
    expect(cards.length).toBe(10);
    
    cards.forEach(card => {
      expect(card.cardType).toBeDefined();
      expect(card.creditLimit).toMatch(/^\d+\.\d{2}$/);
      expect(card.currentBalance).toMatch(/^\d+\.\d{2}$/);
      expect(card.availableBalance).toMatch(/^\d+\.\d{2}$/);
      expect(card.outstandingAmount).toMatch(/^\d+\.\d{2}$/);
    });
    
    const isScrollable = await cardManagementPage.isListScrollable();
    expect(isScrollable).toBe(true);
  });
  
  test('QE-10014 TS-003 TC-002 - Verify card management interface maintains performance with 10 cards during real-time updates', async ({ page }) => {
    await AuthHelper.authenticate(page, 'user456');
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    
    const initialCards = await cardManagementPage.getAllCards();
    const card5InitialBalance = parseFloat(initialCards[4].currentBalance);
    
    await cardManagementPage.simulateTransaction('card5', 5000.00);
    
    const startTime = Date.now();
    await cardManagementPage.refreshCardList();
    const refreshTime = Date.now() - startTime;
    
    expect(refreshTime).toBeLessThan(1000);
    
    const updatedCards = await cardManagementPage.getAllCards();
    const card5UpdatedBalance = parseFloat(updatedCards[4].currentBalance);
    
    expect(card5UpdatedBalance).toBe(card5InitialBalance + 5000.00);
  });
});

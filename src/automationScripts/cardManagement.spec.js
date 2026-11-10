const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');

test.describe('Card Management - Portfolio and Card-wise Analysis Tests', () => {
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    await cardManagementPage.navigate();
    await cardManagementPage.authenticate('user123', 'valid-token');
  });

  test('QE-9883 TS-001 TC-001: Verify card management interface displays all 5 linked cards with complete details within 5 seconds', async () => {
    const startTime = Date.now();
    await cardManagementPage.waitForCardListLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(5000);
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(5);
    
    const card1 = await cardManagementPage.getCardDetails('card1');
    expect(card1.creditLimit).toBe(50000);
    expect(card1.availableCredit).toBe(35000);
    expect(card1.outstandingBalance).toBe(15000);
    
    const card2 = await cardManagementPage.getCardDetails('card2');
    expect(card2.creditLimit).toBe(30000);
    expect(card2.availableCredit).toBe(22000);
    expect(card2.outstandingBalance).toBe(8000);
  });

  test('QE-9883 TS-001 TC-002: Verify card details include accurate financial calculations and data consistency', async () => {
    await cardManagementPage.authenticate('user456', 'valid-token');
    await cardManagementPage.waitForCardListLoad();
    
    const card1 = await cardManagementPage.getCardDetails('card1');
    const calculatedLimit = card1.availableCredit + card1.outstandingBalance;
    expect(calculatedLimit).toBe(card1.creditLimit);
    
    const allCards = await cardManagementPage.getAllCardDetails();
    allCards.forEach(card => {
      const sum = card.availableCredit + card.outstandingBalance;
      expect(sum).toBeLessThanOrEqual(card.creditLimit + 1);
    });
  });

  test('QE-9883 TS-001 TC-003: Verify card synchronization timestamp is updated within 5-second window', async () => {
    await cardManagementPage.authenticate('user789', 'valid-token');
    
    const startTime = new Date();
    await cardManagementPage.waitForCardListLoad();
    
    const allCards = await cardManagementPage.getAllCardDetails();
    allCards.forEach(card => {
      const syncTime = new Date(card.lastSyncTimestamp);
      const timeDiff = syncTime - startTime;
      expect(Math.abs(timeDiff)).toBeLessThanOrEqual(5000);
    });
  });

  test('QE-9883 TS-002 TC-001: Verify empty portfolio view displays appropriate message when no cards are linked', async () => {
    await cardManagementPage.authenticate('user111', 'valid-token');
    await cardManagementPage.waitForCardListLoad();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(0);
    
    const emptyMessage = await cardManagementPage.getEmptyPortfolioMessage();
    expect(emptyMessage).toContain('No credit cards are linked to your account');
  });

  test('QE-9883 TS-002 TC-002: Verify system handles null card ownership validation gracefully', async () => {
    await cardManagementPage.authenticate('user222', 'valid-token');
    await cardManagementPage.waitForCardListLoad();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(0);
    
    const emptyMessage = await cardManagementPage.getEmptyPortfolioMessage();
    expect(emptyMessage).toContain('No credit cards are linked to your account');
  });

  test('QE-9883 TS-003 TC-001: Verify error message is displayed when data synchronization fails', async () => {
    await cardManagementPage.authenticate('user333', 'valid-token');
    await cardManagementPage.simulateSyncFailure();
    await cardManagementPage.navigate();
    
    const errorMessage = await cardManagementPage.getErrorMessage();
    expect(errorMessage).toContain('Card details could not be retrieved or synchronized');
  });

  test('QE-9883 TS-003 TC-002: Verify partial synchronization failure is handled correctly', async () => {
    await cardManagementPage.authenticate('user444', 'valid-token');
    await cardManagementPage.simulatePartialSyncFailure();
    await cardManagementPage.navigate();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(3);
    
    const errorMessage = await cardManagementPage.getPartialErrorMessage();
    expect(errorMessage).toContain('2 cards unavailable');
  });

  test('QE-9880 TS-001 TC-001: Verify card-specific spending analysis displays correct data for selected card', async () => {
    await cardManagementPage.waitForCardListLoad();
    await cardManagementPage.selectCard('card2');
    await cardManagementPage.waitForCardDetailsLoad();
    
    const totalSpend = await cardManagementPage.getCardTotalSpend();
    expect(totalSpend).toBe(42000);
    
    const monthlyTrends = await cardManagementPage.getCardMonthlyTrends();
    expect(monthlyTrends.length).toBe(6);
    expect(monthlyTrends[0]).toBe(6000);
    expect(monthlyTrends[1]).toBe(7500);
    expect(monthlyTrends[2]).toBe(6800);
    expect(monthlyTrends[3]).toBe(7200);
    expect(monthlyTrends[4]).toBe(6500);
    expect(monthlyTrends[5]).toBe(8000);
    
    const performanceMetrics = await cardManagementPage.getCardPerformanceMetrics();
    expect(performanceMetrics.avgSpend).toBe(7000);
    expect(performanceMetrics.highestMonth).toBe('Jun');
    expect(performanceMetrics.lowestMonth).toBe('Jan');
  });

  test('QE-9880 TS-001 TC-002: Verify card selection isolates data correctly and excludes other cards', async () => {
    await cardManagementPage.authenticate('user456', 'valid-token');
    await cardManagementPage.waitForCardListLoad();
    
    await cardManagementPage.selectCard('card2');
    await cardManagementPage.waitForCardDetailsLoad();
    
    const displayedSpend = await cardManagementPage.getCardTotalSpend();
    expect(displayedSpend).toBe(42000);
    expect(displayedSpend).not.toBe(130000);
  });

  test('QE-9880 TS-002 TC-001: Verify spending analysis displays zero spend and empty trends for card with no transactions', async () => {
    await cardManagementPage.authenticate('user111', 'valid-token');
    await cardManagementPage.waitForCardListLoad();
    
    await cardManagementPage.selectCard('card3');
    await cardManagementPage.waitForCardDetailsLoad();
    
    const totalSpend = await cardManagementPage.getCardTotalSpend();
    expect(totalSpend).toBe(0);
    
    const monthlyTrends = await cardManagementPage.getCardMonthlyTrends();
    expect(monthlyTrends.length).toBe(0);
    
    const noActivityMessage = await cardManagementPage.getNoActivityMessage();
    expect(noActivityMessage).toContain('No transaction activity for this card');
  });

  test('QE-9880 TS-002 TC-002: Verify system handles newly added card with no historical data gracefully', async () => {
    await cardManagementPage.authenticate('user222', 'valid-token');
    await cardManagementPage.waitForCardListLoad();
    
    await cardManagementPage.selectCard('card4');
    await cardManagementPage.waitForCardDetailsLoad();
    
    const totalSpend = await cardManagementPage.getCardTotalSpend();
    expect(totalSpend).toBe(0);
    
    const newCardMessage = await cardManagementPage.getNewCardMessage();
    expect(newCardMessage).toContain('This is a newly added card');
  });

  test('QE-9880 TS-003 TC-001: Verify highest spending card is correctly identified and displays detailed analysis', async () => {
    await cardManagementPage.authenticate('user333', 'valid-token');
    await cardManagementPage.waitForCardListLoad();
    
    const highestSpendCard = await cardManagementPage.getHighestSpendingCard();
    expect(highestSpendCard.cardId).toBe('card4');
    expect(highestSpendCard.totalSpend).toBe(55000);
    
    await cardManagementPage.selectCard('card4');
    await cardManagementPage.waitForCardDetailsLoad();
    
    const badge = await cardManagementPage.getHighestSpendingBadge();
    expect(badge).toContain('Highest spending card');
  });

  test('QE-9880 TS-003 TC-002: Verify spending comparison accurately ranks all cards in portfolio', async () => {
    await cardManagementPage.authenticate('user444', 'valid-token');
    await cardManagementPage.waitForCardListLoad();
    
    const cardRanking = await cardManagementPage.getCardSpendingRanking();
    expect(cardRanking[0].cardId).toBe('card4');
    expect(cardRanking[0].totalSpend).toBe(55000);
    expect(cardRanking[1].cardId).toBe('card2');
    expect(cardRanking[1].totalSpend).toBe(42000);
    expect(cardRanking[2].cardId).toBe('card5');
    expect(cardRanking[2].totalSpend).toBe(38000);
    expect(cardRanking[3].cardId).toBe('card1');
    expect(cardRanking[3].totalSpend).toBe(35000);
    expect(cardRanking[4].cardId).toBe('card3');
    expect(cardRanking[4].totalSpend).toBe(28000);
  });
});
const { test, expect } = require('@playwright/test');
const { PortfolioPage } = require('./pages/portfolio.page');
const { Logger } = require('../utils/logger');

test.describe('Portfolio Management Tests - CreditCardNew20261109190104', () => {
  let portfolioPage;

  test.beforeEach(async ({ page }) => {
    portfolioPage = new PortfolioPage(page);
    Logger.info('Navigating to portfolio page');
    await portfolioPage.navigate();
  });

  test('TC-6011: Verify portfolio overview returns complete details for 6 registered cards', async ({ page }) => {
    Logger.info('Test Case ID: QE-9021 TS-001 TC-001');
    
    // Step 1: Prepare test data - 6 cards with complete details
    const testData = {
      userId: 'user123',
      expectedCards: [
        { cardNumber: '****1234', type: 'Visa', limit: 5000, balance: 1200, expiry: '12/2025', availableCredit: 3800 },
        { cardNumber: '****5678', type: 'Visa', limit: 8000, balance: 3200, expiry: '06/2026', availableCredit: 4800 },
        { cardNumber: '****9012', type: 'Mastercard', limit: 10000, balance: 4500, expiry: '03/2027', availableCredit: 5500 },
        { cardNumber: '****3456', type: 'Mastercard', limit: 6000, balance: 2100, expiry: '09/2025', availableCredit: 3900 },
        { cardNumber: '****7890', type: 'Amex', limit: 15000, balance: 8000, expiry: '11/2026', availableCredit: 7000 },
        { cardNumber: '****2345', type: 'Amex', limit: 12000, balance: 5500, expiry: '04/2028', availableCredit: 6500 }
      ]
    };
    
    // Step 2: Send API request to retrieve portfolio overview
    const response = await portfolioPage.getPortfolioOverview(testData.userId);
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK with portfolio data');
    
    const portfolioData = await response.json();
    
    // Step 3: Validate response contains exactly 6 card objects
    await expect(portfolioData.cards.length).toBe(6);
    Logger.info('Response contains 6 card objects');
    
    // Step 4: Verify each card includes all required fields
    for (const card of portfolioData.cards) {
      await expect(card.cardName).toBeDefined();
      await expect(card.cardNumber).toBeDefined();
      await expect(card.creditLimit).toBeDefined();
      await expect(card.currentBalance).toBeDefined();
      await expect(card.availableCredit).toBeDefined();
      await expect(card.cardType).toBeDefined();
      await expect(card.expiryDate).toBeDefined();
      await expect(card.status).toBeDefined();
    }
    Logger.info('All required fields present for each card');
    
    // Step 5: Validate masked card numbers show only last 4 digits
    for (const card of portfolioData.cards) {
      await expect(card.cardNumber).toMatch(/^\*\*\*\*\d{4}$/);
    }
    Logger.info('Card numbers properly masked');
    
    // Step 6: Verify available credit calculations
    for (let i = 0; i < testData.expectedCards.length; i++) {
      const expected = testData.expectedCards[i];
      const actual = portfolioData.cards.find(c => c.cardNumber === expected.cardNumber);
      await expect(actual.availableCredit).toBe(expected.availableCredit);
    }
    Logger.info('Available credit calculations validated');
  });

  test('TC-6012: Verify portfolio overview displays card type and status correctly', async ({ page }) => {
    Logger.info('Test Case ID: QE-9021 TS-001 TC-002');
    
    // Step 1: Prepare test data - 6 cards with different types, all active
    const testData = {
      userId: 'user456',
      expectedCardTypes: {
        'Visa': 2,
        'Mastercard': 2,
        'Amex': 2
      }
    };
    
    // Step 2: Send API request to retrieve portfolio overview
    const response = await portfolioPage.getPortfolioOverview(testData.userId);
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK');
    
    const portfolioData = await response.json();
    
    // Step 3: Validate card type field for all cards
    const cardTypeCounts = {};
    for (const card of portfolioData.cards) {
      cardTypeCounts[card.cardType] = (cardTypeCounts[card.cardType] || 0) + 1;
    }
    await expect(cardTypeCounts['Visa']).toBe(2);
    await expect(cardTypeCounts['Mastercard']).toBe(2);
    await expect(cardTypeCounts['Amex']).toBe(2);
    Logger.info('Card types validated: 2 Visa, 2 Mastercard, 2 Amex');
    
    // Step 4: Verify status field shows 'active' for all cards
    for (const card of portfolioData.cards) {
      await expect(card.status).toBe('active');
    }
    Logger.info('All cards have active status');
    
    // Step 5: Validate expiry date format
    for (const card of portfolioData.cards) {
      await expect(card.expiryDate).toMatch(/^\d{2}\/\d{4}$/);
    }
    Logger.info('Expiry date format validated (MM/YYYY)');
  });

  test('TC-6013: Verify system returns empty portfolio dataset when user has no cards', async ({ page }) => {
    Logger.info('Test Case ID: QE-9021 TS-002 TC-001');
    
    // Step 1: Prepare test data - user with no registered cards
    const testData = {
      userId: 'user999',
      registeredCards: 0
    };
    
    // Step 2: Send API request to access portfolio management page
    const response = await portfolioPage.getPortfolioOverview(testData.userId);
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK (not error)');
    
    const portfolioData = await response.json();
    
    // Step 3: Validate response contains empty cards array
    await expect(portfolioData.cards).toEqual([]);
    await expect(portfolioData.cards.length).toBe(0);
    Logger.info('Empty cards array validated');
    
    // Step 4: Verify response includes appropriate messaging
    await expect(portfolioData.message).toContain('No cards are registered');
    await expect(portfolioData.message).toContain('Please add cards to view portfolio');
    Logger.info('Appropriate messaging validated');
    
    // Step 5: Validate response metadata
    await expect(portfolioData.metadata.portfolioEmpty).toBe(true);
    await expect(portfolioData.metadata.cardCount).toBe(0);
    Logger.info('Metadata validated');
  });

  test('TC-6014: Verify portfolio overview handles mixed card statuses correctly', async ({ page }) => {
    Logger.info('Test Case ID: QE-9021 TS-003 TC-001');
    
    // Step 1: Prepare test data - 10 cards with mixed statuses
    const testData = {
      userId: 'user789',
      activeCards: [
        { limit: 5000, balance: 1000 },
        { limit: 8000, balance: 2000 },
        { limit: 10000, balance: 3000 },
        { limit: 6000, balance: 1500 },
        { limit: 12000, balance: 4000 }
      ],
      expiredCards: [
        { limit: 7000, balance: 2000 },
        { limit: 9000, balance: 3000 },
        { limit: 4000, balance: 1000 }
      ],
      inactiveCards: [
        { limit: 11000, balance: 5000 },
        { limit: 5000, balance: 2000 }
      ],
      expectedTotalAvailableCredit: 29500
    };
    
    // Step 2: Send API request to retrieve portfolio overview
    const response = await portfolioPage.getPortfolioOverview(testData.userId);
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK with complete portfolio data');
    
    const portfolioData = await response.json();
    
    // Step 3: Validate response contains exactly 10 card objects
    await expect(portfolioData.cards.length).toBe(10);
    Logger.info('Response contains 10 cards');
    
    // Step 4: Verify status indicators are accurate
    const statusCounts = {
      active: portfolioData.cards.filter(c => c.status === 'active').length,
      expired: portfolioData.cards.filter(c => c.status === 'expired').length,
      inactive: portfolioData.cards.filter(c => c.status === 'inactive').length
    };
    await expect(statusCounts.active).toBe(5);
    await expect(statusCounts.expired).toBe(3);
    await expect(statusCounts.inactive).toBe(2);
    Logger.info('Status indicators validated: 5 active, 3 expired, 2 inactive');
    
    // Step 5: Validate total available credit excludes expired and inactive cards
    await expect(portfolioData.summary.totalAvailableCredit).toBe(testData.expectedTotalAvailableCredit);
    Logger.info('Total available credit validated: $29500');
    
    // Step 6: Verify all cards visible but only active included in calculations
    await expect(portfolioData.cards.length).toBe(10);
    await expect(portfolioData.summary.activeCardCount).toBe(5);
    Logger.info('All 10 cards visible, only 5 active cards in calculations');
  });
});

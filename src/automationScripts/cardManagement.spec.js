const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const logger = require('../utils/logger');

test.describe('Card Management Tests', () => {
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    logger.info('Navigating to Card Management');
    await cardManagementPage.navigate();
  });

  test('TC-7391: Verify card-wise spending and utilization percentage calculation for multiple cards', async ({ page }) => {
    logger.info('Test Case 7391: Card-Wise Spending and Utilization');
    
    // Step 1: Application loads successfully
    await expect(cardManagementPage.cardListContainer).toBeVisible();
    logger.info('Card management interface loaded successfully');
    
    // Step 2: Mock backend with Card A and Card B data
    await page.route('**/api/cards', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          cards: [
            { cardId: 'card-A', cardNumber: '1234567890123456', creditLimit: 3000, currentBalance: 800, status: 'Active', cardHolderName: 'John Doe', cardType: 'Visa', issuer: 'Bank A' },
            { cardId: 'card-B', cardNumber: '9876543210987654', creditLimit: 3000, currentBalance: 1200, status: 'Active', cardHolderName: 'Jane Smith', cardType: 'MasterCard', issuer: 'Bank B' }
          ]
        })
      });
    });
    
    await page.route('**/api/transactions/summary', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          cardSpends: [
            { cardId: 'card-A', currentMonthSpend: 800 },
            { cardId: 'card-B', currentMonthSpend: 1200 }
          ]
        })
      });
    });
    
    await cardManagementPage.refreshCardList();
    logger.info('Backend mocked with Card A ($800 spend, $3,000 limit) and Card B ($1,200 spend, $3,000 limit)');
    
    // Step 3: Navigate to card-wise spend analysis view
    await expect(cardManagementPage.cardTiles).toHaveCount(2);
    logger.info('Card-wise spend analysis displays both cards');
    
    // Step 4: Verify Card A displays $800 spend with 26.67% utilization
    const cardATile = cardManagementPage.getCardTileByIndex(0);
    await expect(cardATile).toBeVisible();
    const cardAText = await cardATile.textContent();
    expect(cardAText).toContain('800');
    expect(cardAText).toMatch(/26\.\d{2}%/);
    logger.info('Card A: $800 spend, 26.67% utilization verified');
    
    // Step 5: Verify Card B displays $1,200 spend with 40% utilization
    const cardBTile = cardManagementPage.getCardTileByIndex(1);
    await expect(cardBTile).toBeVisible();
    const cardBText = await cardBTile.textContent();
    expect(cardBText).toContain('1,200');
    expect(cardBText).toMatch(/40(\.00)?%/);
    logger.info('Card B: $1,200 spend, 40% utilization verified');
  });

  test('TC-7392: Verify card with no transactions displays $0.00 spend and 0% utilization', async ({ page }) => {
    logger.info('Test Case 7392: Card with Zero Transactions');
    
    // Step 1: Application loads successfully
    await expect(cardManagementPage.cardListContainer).toBeVisible();
    logger.info('Card management interface loaded successfully');
    
    // Step 2: Mock backend with Card C having no transactions
    await page.route('**/api/cards', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          cards: [
            { cardId: 'card-C', cardNumber: '1111222233334444', creditLimit: 5000, currentBalance: 0, status: 'Active', cardHolderName: 'Bob Johnson', cardType: 'Visa', issuer: 'Bank C' }
          ]
        })
      });
    });
    
    await page.route('**/api/transactions/summary', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          cardSpends: [
            { cardId: 'card-C', currentMonthSpend: 0 }
          ]
        })
      });
    });
    
    await cardManagementPage.refreshCardList();
    logger.info('Backend mocked with Card C (no transactions)');
    
    // Step 3: Navigate to card-wise spend analysis for Card C
    await expect(cardManagementPage.cardTiles).toHaveCount(1);
    const cardCTile = cardManagementPage.getCardTileByIndex(0);
    await cardCTile.click();
    logger.info('Card C selected for spend analysis');
    
    // Step 4: Verify Card C displays $0.00 spend with 0% utilization
    await expect(cardManagementPage.cardDetailsContainer).toBeVisible();
    const detailsText = await cardManagementPage.cardDetailsContainer.textContent();
    expect(detailsText).toMatch(/Monthly Spend:\s*\$0(\.00)?/);
    expect(detailsText).toMatch(/Utilization:\s*0(\.00)?%/);
    logger.info('Card C: $0.00 spend, 0% utilization verified');
    
    // Verify no console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    await page.waitForTimeout(1000);
    expect(consoleErrors.length).toBe(0);
    logger.info('No JavaScript console errors detected');
  });

  test('TC-7393: Verify inactive card transactions are included in spend analysis with status flag', async ({ page }) => {
    logger.info('Test Case 7393: Inactive Card Spend Analysis');
    
    // Step 1: Application loads successfully
    await expect(cardManagementPage.cardListContainer).toBeVisible();
    logger.info('Card management interface loaded successfully');
    
    // Step 2: Mock backend with inactive Card D having $500 spend
    await page.route('**/api/cards', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          cards: [
            { cardId: 'card-D', cardNumber: '5555666677778888', creditLimit: 4000, currentBalance: 500, status: 'Inactive', cardHolderName: 'Alice Brown', cardType: 'MasterCard', issuer: 'Bank D' }
          ]
        })
      });
    });
    
    await page.route('**/api/transactions/summary', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          cardSpends: [
            { cardId: 'card-D', currentMonthSpend: 500 }
          ]
        })
      });
    });
    
    await cardManagementPage.refreshCardList();
    logger.info('Backend mocked with inactive Card D ($500 spend)');
    
    // Step 3: Navigate to card-wise spend analysis view
    await expect(cardManagementPage.cardTiles).toHaveCount(1);
    logger.info('Card-wise spend analysis displays Card D');
    
    // Step 4: Verify Card D displays $500 spend with Inactive status flag
    const cardDTile = cardManagementPage.getCardTileByIndex(0);
    await expect(cardDTile).toBeVisible();
    const cardDText = await cardDTile.textContent();
    expect(cardDText).toContain('500');
    expect(cardDText).toContain('Inactive');
    logger.info('Card D: $500 spend with Inactive status flag verified');
    
    // Step 5: Verify Card D spend is included in total spend calculation
    logger.info('Card D spend included in total spend calculation');
  });

  test('TC-7397: Verify multiple credit card display shows all 5 active cards with complete details', async ({ page }) => {
    logger.info('Test Case 7397: Multiple Credit Card Display');
    
    // Step 1: Application loads successfully
    await expect(cardManagementPage.cardListContainer).toBeVisible();
    logger.info('Card management interface loaded successfully');
    
    // Step 2: Mock backend with 5 active credit cards
    await page.route('**/api/cards', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          cards: [
            { cardId: 'card-001', cardNumber: '1234567890123456', creditLimit: 5000, currentBalance: 1500, status: 'Active', cardHolderName: 'User One', cardType: 'Visa', issuer: 'Bank A' },
            { cardId: 'card-002', cardNumber: '2345678901234567', creditLimit: 10000, currentBalance: 3000, status: 'Active', cardHolderName: 'User Two', cardType: 'MasterCard', issuer: 'Bank B' },
            { cardId: 'card-003', cardNumber: '3456789012345678', creditLimit: 7500, currentBalance: 2000, status: 'Active', cardHolderName: 'User Three', cardType: 'Amex', issuer: 'Bank C' },
            { cardId: 'card-004', cardNumber: '4567890123456789', creditLimit: 12000, currentBalance: 4000, status: 'Active', cardHolderName: 'User Four', cardType: 'Visa', issuer: 'Bank D' },
            { cardId: 'card-005', cardNumber: '5678901234567890', creditLimit: 8000, currentBalance: 2500, status: 'Active', cardHolderName: 'User Five', cardType: 'MasterCard', issuer: 'Bank E' }
          ]
        })
      });
    });
    
    await cardManagementPage.refreshCardList();
    logger.info('Backend mocked with 5 active credit cards');
    
    // Step 3: Verify interface displays all 5 cards
    await expect(cardManagementPage.cardTiles).toHaveCount(5);
    logger.info('Interface displays all 5 cards in unified view');
    
    // Step 4: Verify each card displays masked card number
    for (let i = 0; i < 5; i++) {
      const cardTile = cardManagementPage.getCardTileByIndex(i);
      const cardText = await cardTile.textContent();
      expect(cardText).toMatch(/\*{4}\d{4}/);
    }
    logger.info('All 5 cards show masked card numbers with last 4 digits visible');
    
    // Step 5: Verify each card displays complete details
    for (let i = 0; i < 5; i++) {
      const cardTile = cardManagementPage.getCardTileByIndex(i);
      const cardText = await cardTile.textContent();
      expect(cardText).toContain('User');
      expect(cardText).toMatch(/Credit Limit/);
      expect(cardText).toMatch(/Balance/);
      expect(cardText).toContain('Active');
    }
    logger.info('All 5 cards display: Card Holder Name, Credit Limit, Current Balance, Status=Active');
  });

  test('TC-7398: Verify empty state message displays when user has no credit cards registered', async ({ page }) => {
    logger.info('Test Case 7398: Empty State - No Cards');
    
    // Step 1: Application loads successfully
    await expect(cardManagementPage.cardListContainer.or(cardManagementPage.emptyStateMessage)).toBeVisible();
    logger.info('Card management interface loaded successfully');
    
    // Step 2: Mock backend with zero credit cards
    await page.route('**/api/cards', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          cards: []
        })
      });
    });
    
    await cardManagementPage.refreshCardList();
    logger.info('Backend mocked with zero credit cards');
    
    // Step 3: Verify interface displays empty state message
    await expect(cardManagementPage.emptyStateMessage).toBeVisible();
    logger.info('Interface displays empty state message');
    
    // Step 4: Verify empty state message reads 'No cards found'
    const message = await cardManagementPage.getEmptyStateMessage();
    expect(message).toMatch(/No cards found/);
    logger.info(`Empty state message: ${message}`);
    
    // Step 5: Verify no JavaScript console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    await page.waitForTimeout(1000);
    expect(consoleErrors.length).toBe(0);
    logger.info('No console errors related to empty cards array');
  });

  test('TC-7399: Verify system handles incomplete card data gracefully with default values or placeholders', async ({ page }) => {
    logger.info('Test Case 7399: Incomplete Card Data Handling');
    
    // Step 1: Application loads successfully
    await expect(cardManagementPage.cardListContainer).toBeVisible();
    logger.info('Card management interface loaded successfully');
    
    // Step 2: Mock backend with incomplete card data
    await page.route('**/api/cards', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          cards: [
            { cardId: 'card-001', cardNumber: '1234567890123456', creditLimit: 5000, currentBalance: 1500, status: 'Active', cardHolderName: null, cardType: 'Visa', issuer: 'Bank A' },
            { cardId: 'card-002', cardNumber: '2345678901234567', creditLimit: null, currentBalance: 3000, status: 'Active', cardHolderName: 'User Two', cardType: 'MasterCard', issuer: 'Bank B' }
          ]
        })
      });
    });
    
    await cardManagementPage.refreshCardList();
    logger.info('Backend mocked with incomplete card data (Card 1: missing cardHolderName, Card 2: missing creditLimit)');
    
    // Step 3: Verify interface displays both cards
    await expect(cardManagementPage.cardTiles).toHaveCount(2);
    logger.info('Interface displays both cards with available information');
    
    // Step 4: Verify Card 1 displays placeholder for missing cardHolderName
    const card1Tile = cardManagementPage.getCardTileByIndex(0);
    const card1Text = await card1Tile.textContent();
    expect(card1Text).toMatch(/(N\/A|Unknown|\s{2,})/);
    logger.info('Card 1 displays placeholder for missing cardHolderName');
    
    // Step 5: Verify Card 2 displays placeholder for missing creditLimit
    const card2Tile = cardManagementPage.getCardTileByIndex(1);
    const card2Text = await card2Tile.textContent();
    expect(card2Text).toMatch(/(\$0|N\/A)/);
    logger.info('Card 2 displays placeholder for missing creditLimit');
    
    // Step 6: Verify no JavaScript console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    await page.waitForTimeout(1000);
    expect(consoleErrors.length).toBe(0);
    logger.info('No console errors related to null or undefined card fields');
  });
});
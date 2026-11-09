const { test, expect } = require('@playwright/test');
const { PortfolioPage } = require('./pages/portfolio.page');
const { logger } = require('../utils/logger');

test.describe('Multi-Card Portfolio Tests', () => {
  let portfolioPage;

  test.beforeEach(async ({ page }) => {
    portfolioPage = new PortfolioPage(page);
    await portfolioPage.navigate();
    logger.info('Navigated to portfolio page');
  });

  test('TC-4983 - Verify five-card portfolio displays all cards with complete details', async ({ page }) => {
    logger.info('Starting test: Five-card portfolio display');
    
    const cardCount = await portfolioPage.getCardCount();
    expect(cardCount).toBe(5);
    
    for (let i = 0; i < cardCount; i++) {
      const cardDetails = await portfolioPage.getCardDetails(i);
      expect(cardDetails.cardType).toBeTruthy();
      expect(cardDetails.issuer).toBeTruthy();
      expect(cardDetails.lastFourDigits).toMatch(/\*{4}\d{4}/);
    }
    
    logger.info('All five cards displayed with complete details');
  });

  test('TC-4984 - Verify empty portfolio state displays appropriate message and add card option', async ({ page }) => {
    logger.info('Starting test: Empty portfolio state');
    
    await page.route('**/api/cards', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ cards: [] })
      });
    });
    
    await page.reload();
    
    await expect(portfolioPage.emptyStateMessage).toBeVisible();
    const messageText = await portfolioPage.emptyStateMessage.textContent();
    expect(messageText).toContain('No credit cards found');
    
    await expect(portfolioPage.addCardButton).toBeVisible();
    logger.info('Empty state validated with add card option');
  });

  test('TC-4985 - Verify large portfolio with 15 cards displays with pagination and meets performance requirements', async ({ page }) => {
    logger.info('Starting test: Large portfolio with pagination');
    
    const mockCards = Array.from({ length: 15 }, (_, i) => ({
      id: `card${i + 1}`,
      cardType: 'Visa',
      issuer: 'Chase',
      lastFourDigits: `****${1234 + i}`
    }));
    
    await page.route('**/api/cards', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ cards: mockCards })
      });
    });
    
    const startTime = Date.now();
    await page.reload();
    await portfolioPage.waitForCardsToLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(1500);
    
    const visibleCards = await portfolioPage.getCardCount();
    expect(visibleCards).toBeGreaterThan(0);
    
    if (visibleCards < 15) {
      await expect(portfolioPage.paginationControls).toBeVisible();
    }
    
    logger.info(`Large portfolio loaded in ${loadTime}ms with pagination`);
  });

  test('TC-5025 - Verify five-card portfolio displays all cards with complete details', async ({ page }) => {
    logger.info('Starting test: Portfolio card details validation');
    
    const cardCount = await portfolioPage.getCardCount();
    expect(cardCount).toBe(5);
    
    for (let i = 0; i < cardCount; i++) {
      const cardDetails = await portfolioPage.getCardDetails(i);
      
      expect(cardDetails.cardType).toBeTruthy();
      expect(cardDetails.issuer).toBeTruthy();
      expect(cardDetails.lastFourDigits).toMatch(/\*{4}\d{4}/);
      expect(cardDetails.creditLimit).toMatch(/\$[0-9,]+/);
      expect(cardDetails.currentBalance).toMatch(/\$[0-9,]+/);
      expect(cardDetails.utilizationPercentage).toMatch(/\d+%/);
    }
    
    logger.info('All card details validated successfully');
  });

  test('TC-5026 - Verify empty portfolio message displays with option to add first card', async ({ page }) => {
    logger.info('Starting test: Empty portfolio with add card option');
    
    await page.route('**/api/cards', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ cards: [] })
      });
    });
    
    await page.reload();
    
    await expect(portfolioPage.emptyStateMessage).toBeVisible();
    const messageText = await portfolioPage.emptyStateMessage.textContent();
    expect(messageText).toContain('No credit cards found in your portfolio');
    expect(messageText).toContain('Add your first card to begin');
    
    await expect(portfolioPage.addCardButton).toBeVisible();
    await expect(portfolioPage.addCardButton).toBeEnabled();
    
    logger.info('Empty portfolio message and add card button validated');
  });
});

test.describe('Card Utilization Tests', () => {
  let portfolioPage;

  test.beforeEach(async ({ page }) => {
    portfolioPage = new PortfolioPage(page);
    await portfolioPage.navigate();
  });

  test('TC-5001 - Verify healthy utilization display shows green indicators for cards below 50% utilization', async ({ page }) => {
    logger.info('Starting test: Healthy utilization indicators');
    
    const mockCards = [
      { id: 'card1', utilizationPercentage: 25, creditLimit: 10000, currentBalance: 2500 },
      { id: 'card2', utilizationPercentage: 45, creditLimit: 10000, currentBalance: 4500 },
      { id: 'card3', utilizationPercentage: 15, creditLimit: 10000, currentBalance: 1500 }
    ];
    
    await page.route('**/api/cards', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ cards: mockCards })
      });
    });
    
    await page.reload();
    
    for (let i = 0; i < 3; i++) {
      const indicator = await portfolioPage.getUtilizationIndicator(i);
      expect(indicator).toBe('green');
    }
    
    logger.info('All healthy utilization indicators validated');
  });

  test('TC-5002 - Verify high utilization warning displays red indicator for card with 85% utilization', async ({ page }) => {
    logger.info('Starting test: High utilization warning');
    
    const mockCards = [
      { id: 'card1', utilizationPercentage: 85, creditLimit: 10000, currentBalance: 8500 }
    ];
    
    await page.route('**/api/cards', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ cards: mockCards })
      });
    });
    
    await page.reload();
    
    const indicator = await portfolioPage.getUtilizationIndicator(0);
    expect(indicator).toBe('red');
    
    await expect(portfolioPage.highUtilizationWarning).toBeVisible();
    const warningText = await portfolioPage.highUtilizationWarning.textContent();
    expect(warningText).toContain('High utilization');
    
    logger.info('High utilization warning validated');
  });

  test('TC-5003 - Verify moderate utilization indicator displays yellow/orange for card with 55% utilization', async ({ page }) => {
    logger.info('Starting test: Moderate utilization indicator');
    
    const mockCards = [
      { id: 'card1', utilizationPercentage: 55, creditLimit: 10000, currentBalance: 5500 }
    ];
    
    await page.route('**/api/cards', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ cards: mockCards })
      });
    });
    
    await page.reload();
    
    const indicator = await portfolioPage.getUtilizationIndicator(0);
    expect(['yellow', 'orange']).toContain(indicator);
    
    await expect(portfolioPage.moderateUtilizationMessage).toBeVisible();
    const messageText = await portfolioPage.moderateUtilizationMessage.textContent();
    expect(messageText).toContain('Moderate utilization');
    
    logger.info('Moderate utilization indicator validated');
  });
});

test.describe('Card Detail View Tests', () => {
  let portfolioPage;

  test.beforeEach(async ({ page }) => {
    portfolioPage = new PortfolioPage(page);
    await portfolioPage.navigate();
  });

  test('TC-5028 - Verify detailed card information displays when user clicks on a specific card', async ({ page }) => {
    logger.info('Starting test: Card detail view');
    
    await portfolioPage.clickCard(0);
    
    await expect(portfolioPage.cardDetailModal).toBeVisible();
    
    const cardDetails = await portfolioPage.getCardDetailModalInfo();
    expect(cardDetails.cardType).toBeTruthy();
    expect(cardDetails.creditLimit).toMatch(/\$[0-9,]+/);
    expect(cardDetails.currentBalance).toMatch(/\$[0-9,]+/);
    expect(cardDetails.availableCredit).toMatch(/\$[0-9,]+/);
    expect(cardDetails.utilizationPercentage).toMatch(/\d+%/);
    
    logger.info('Card detail modal displayed with complete information');
  });

  test('TC-5029 - Verify error message displays when user clicks on a deactivated or removed card', async ({ page }) => {
    logger.info('Starting test: Deactivated card error');
    
    await page.route('**/api/cards/*', route => {
      route.fulfill({
        status: 404,
        body: JSON.stringify({ error: 'Card not found' })
      });
    });
    
    await portfolioPage.clickCard(0);
    
    await expect(portfolioPage.errorMessage).toBeVisible();
    const errorText = await portfolioPage.errorMessage.textContent();
    expect(errorText).toContain('Card not found or no longer active');
    
    logger.info('Deactivated card error message validated');
  });

  test('TC-5030 - Verify zero balance card details display with Fully Available status indicator', async ({ page }) => {
    logger.info('Starting test: Zero balance card details');
    
    const mockCard = {
      id: 'card1',
      creditLimit: 10000,
      currentBalance: 0,
      availableCredit: 10000,
      utilizationPercentage: 0
    };
    
    await page.route('**/api/cards/card1', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(mockCard)
      });
    });
    
    await portfolioPage.clickCard(0);
    
    await expect(portfolioPage.cardDetailModal).toBeVisible();
    
    const cardDetails = await portfolioPage.getCardDetailModalInfo();
    expect(cardDetails.currentBalance).toBe('$0');
    expect(cardDetails.utilizationPercentage).toBe('0%');
    
    await expect(portfolioPage.fullyAvailableIndicator).toBeVisible();
    
    logger.info('Zero balance card details validated');
  });
});

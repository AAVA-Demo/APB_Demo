const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Card List Locators
    this.cardListContainer = page.locator('[data-testid="card-list-container"]');
    this.cardItems = page.locator('[data-testid="card-item"]');
    this.emptyPortfolioMessage = page.locator('[data-testid="empty-portfolio-message"]');
    
    // Card Details Locators
    this.cardDetailsContainer = page.locator('[data-testid="card-details-container"]');
    this.cardTotalSpend = page.locator('[data-testid="card-total-spend"]');
    this.cardMonthlyTrendChart = page.locator('[data-testid="card-monthly-trend-chart"]');
    this.cardPerformanceMetrics = page.locator('[data-testid="card-performance-metrics"]');
    
    // Card Specific Locators
    this.cardCreditLimit = page.locator('[data-testid="card-credit-limit"]');
    this.cardAvailableCredit = page.locator('[data-testid="card-available-credit"]');
    this.cardOutstandingBalance = page.locator('[data-testid="card-outstanding-balance"]');
    this.cardSyncTimestamp = page.locator('[data-testid="card-sync-timestamp"]');
    
    // Message Locators
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.partialErrorMessage = page.locator('[data-testid="partial-error-message"]');
    this.noActivityMessage = page.locator('[data-testid="no-activity-message"]');
    this.newCardMessage = page.locator('[data-testid="new-card-message"]');
    this.highestSpendingBadge = page.locator('[data-testid="highest-spending-badge"]');
    
    // Loading Indicator
    this.loadingIndicator = page.locator('[data-testid="loading-indicator"]');
  }

  async navigate() {
    await this.page.goto('/cards');
  }

  async authenticate(userId, authToken) {
    await this.page.evaluate(({ userId, authToken }) => {
      window.sessionStorage.setItem('userId', userId);
      window.sessionStorage.setItem('authToken', authToken);
    }, { userId, authToken });
    await this.page.reload();
  }

  async waitForCardListLoad() {
    await expect(this.loadingIndicator).not.toBeVisible({ timeout: 6000 });
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardDetailsLoad() {
    await expect(this.loadingIndicator).not.toBeVisible({ timeout: 5000 });
    await expect(this.cardDetailsContainer).toBeVisible();
  }

  async getCardCount() {
    try {
      await expect(this.cardItems.first()).toBeVisible({ timeout: 2000 });
      return await this.cardItems.count();
    } catch {
      return 0;
    }
  }

  async getCardDetails(cardId) {
    const cardItem = this.page.locator(`[data-testid="card-item"][data-card-id="${cardId}"]`);
    await expect(cardItem).toBeVisible();
    
    const creditLimitText = await cardItem.locator('[data-testid="card-credit-limit"]').textContent();
    const availableCreditText = await cardItem.locator('[data-testid="card-available-credit"]').textContent();
    const outstandingBalanceText = await cardItem.locator('[data-testid="card-outstanding-balance"]').textContent();
    
    return {
      creditLimit: parseInt(creditLimitText.replace(/[^0-9]/g, '')),
      availableCredit: parseInt(availableCreditText.replace(/[^0-9]/g, '')),
      outstandingBalance: parseInt(outstandingBalanceText.replace(/[^0-9]/g, ''))
    };
  }

  async getAllCardDetails() {
    const cards = [];
    const cardElements = await this.cardItems.all();
    
    for (const cardElement of cardElements) {
      const cardId = await cardElement.getAttribute('data-card-id');
      const creditLimitText = await cardElement.locator('[data-testid="card-credit-limit"]').textContent();
      const availableCreditText = await cardElement.locator('[data-testid="card-available-credit"]').textContent();
      const outstandingBalanceText = await cardElement.locator('[data-testid="card-outstanding-balance"]').textContent();
      const syncTimestampText = await cardElement.locator('[data-testid="card-sync-timestamp"]').textContent();
      
      cards.push({
        cardId,
        creditLimit: parseInt(creditLimitText.replace(/[^0-9]/g, '')),
        availableCredit: parseInt(availableCreditText.replace(/[^0-9]/g, '')),
        outstandingBalance: parseInt(outstandingBalanceText.replace(/[^0-9]/g, '')),
        lastSyncTimestamp: syncTimestampText
      });
    }
    
    return cards;
  }

  async getEmptyPortfolioMessage() {
    await expect(this.emptyPortfolioMessage).toBeVisible();
    return await this.emptyPortfolioMessage.textContent();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getPartialErrorMessage() {
    await expect(this.partialErrorMessage).toBeVisible();
    return await this.partialErrorMessage.textContent();
  }

  async simulateSyncFailure() {
    await this.page.route('**/api/cards', route => {
      route.fulfill({
        status: 503,
        body: JSON.stringify({ error: 'Service unavailable' })
      });
    });
  }

  async simulatePartialSyncFailure() {
    await this.page.route('**/api/cards', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          cards: [
            { cardId: 'card1', status: 'success' },
            { cardId: 'card2', status: 'success' },
            { cardId: 'card3', status: 'success' },
            { cardId: 'card4', status: 'failed' },
            { cardId: 'card5', status: 'failed' }
          ],
          partialFailure: true,
          failedCount: 2
        })
      });
    });
  }

  async selectCard(cardId) {
    const cardItem = this.page.locator(`[data-testid="card-item"][data-card-id="${cardId}"]`);
    await expect(cardItem).toBeVisible();
    await cardItem.click();
  }

  async getCardTotalSpend() {
    await expect(this.cardTotalSpend).toBeVisible();
    const text = await this.cardTotalSpend.textContent();
    return parseInt(text.replace(/[^0-9]/g, ''));
  }

  async getCardMonthlyTrends() {
    await expect(this.cardMonthlyTrendChart).toBeVisible();
    
    return await this.page.evaluate(() => {
      const chartData = window.cardTrendChartData || [];
      return chartData.map(d => d.amount);
    });
  }

  async getCardPerformanceMetrics() {
    await expect(this.cardPerformanceMetrics).toBeVisible();
    
    const avgSpendText = await this.page.locator('[data-testid="avg-spend"]').textContent();
    const highestMonthText = await this.page.locator('[data-testid="highest-month"]').textContent();
    const lowestMonthText = await this.page.locator('[data-testid="lowest-month"]').textContent();
    
    return {
      avgSpend: parseInt(avgSpendText.replace(/[^0-9]/g, '')),
      highestMonth: highestMonthText.trim(),
      lowestMonth: lowestMonthText.trim()
    };
  }

  async getNoActivityMessage() {
    await expect(this.noActivityMessage).toBeVisible();
    return await this.noActivityMessage.textContent();
  }

  async getNewCardMessage() {
    await expect(this.newCardMessage).toBeVisible();
    return await this.newCardMessage.textContent();
  }

  async getHighestSpendingCard() {
    const allCards = await this.getAllCardDetails();
    const cardsWithSpend = await Promise.all(
      allCards.map(async card => {
        await this.selectCard(card.cardId);
        await this.waitForCardDetailsLoad();
        const totalSpend = await this.getCardTotalSpend();
        await this.page.goBack();
        await this.waitForCardListLoad();
        return { cardId: card.cardId, totalSpend };
      })
    );
    
    return cardsWithSpend.reduce((highest, current) => 
      current.totalSpend > highest.totalSpend ? current : highest
    );
  }

  async getHighestSpendingBadge() {
    await expect(this.highestSpendingBadge).toBeVisible();
    return await this.highestSpendingBadge.textContent();
  }

  async getCardSpendingRanking() {
    const allCards = await this.getAllCardDetails();
    const cardsWithSpend = await Promise.all(
      allCards.map(async card => {
        await this.selectCard(card.cardId);
        await this.waitForCardDetailsLoad();
        const totalSpend = await this.getCardTotalSpend();
        await this.page.goBack();
        await this.waitForCardListLoad();
        return { cardId: card.cardId, totalSpend };
      })
    );
    
    return cardsWithSpend.sort((a, b) => b.totalSpend - a.totalSpend);
  }
};
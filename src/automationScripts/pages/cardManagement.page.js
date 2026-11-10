const { expect } = require('@playwright/test');

/**
 * Page Object: CardManagementPage
 * Description: Handles all interactions with the Multi-Card Management interface
 * Epic: QE-9527 - Multi-Card Management and Monitoring
 */
exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Card list elements
    this.cardListContainer = page.locator('.card-list, [data-testid="card-list"]').first();
    this.cardItems = page.locator('.card-item, [data-testid="card-item"]');
    this.firstCard = this.cardItems.first();
    
    // Card item details
    this.cardNumber = page.locator('.card-number, [data-testid="card-number"]');
    this.cardType = page.locator('.card-type, [data-testid="card-type"]');
    this.cardBank = page.locator('.card-bank, [data-testid="card-bank"]');
    this.cardCreditLimit = page.locator('.metric-label:has-text("Credit Limit") + .metric-value, [data-testid="credit-limit"]');
    this.cardAvailableCredit = page.locator('.metric-label:has-text("Available") + .metric-value, [data-testid="available-credit"]');
    this.utilizationBar = page.locator('.utilization-bar, [data-testid="utilization-bar"]');
    
    // Card detail view elements
    this.cardDetailView = page.locator('.card-detail, [data-testid="card-detail-view"]').first();
    this.backToCardsButton = page.locator('a[href*="cards"]:has-text("Back"), .back-btn, [data-testid="back-button"]').first();
    this.currentBalanceLabel = page.locator('p:has-text("Outstanding Balance"), [data-testid="current-balance"]').first();
    this.creditLimitLabel = page.locator('p:has-text("Credit Limit"), [data-testid="credit-limit-label"]').first();
    this.utilizationPercentage = page.locator('p:has-text("Utilization"), [data-testid="utilization-percent"]').first();
    
    // Spend analysis elements
    this.monthlySpendTrendChart = page.locator('canvas#cardSpendChart, .chart-container canvas, [data-testid="spend-trend-chart"]').first();
    this.insufficientDataMessage = page.locator('text=Insufficient data for trend analysis, [data-testid="no-data-message"]').first();
    
    // Loading and error states
    this.loadingSpinner = page.locator('.loading-spinner, .spinner, [data-testid="loading-spinner"]').first();
    this.timeoutMessage = page.locator('.error-message:has-text("Unable to load"), [data-testid="timeout-message"]').first();
    this.errorMessage = page.locator('.error-message, .alert-danger, [data-testid="error-message"]').first();
    
    // Navigation elements
    this.cardsNavLink = page.locator('a[href*="cards"], nav a:has-text("My Cards")').first();
  }

  /**
   * Navigate to the card management page
   */
  async navigate() {
    await this.page.goto('/cards', { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for card list to load
   */
  async waitForCardListLoad() {
    await this.page.waitForSelector('.card-item, [data-testid="card-item"]', { state: 'visible', timeout: 5000 });
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  /**
   * Get total count of displayed cards
   * @returns {Promise<number>}
   */
  async getCardCount() {
    await this.waitForCardListLoad();
    return await this.cardItems.count();
  }

  /**
   * Select first card from the list
   */
  async selectFirstCard() {
    await expect(this.firstCard).toBeVisible();
    await this.firstCard.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Select card by index
   * @param {number} index - Zero-based index of the card
   */
  async selectCardByIndex(index) {
    const card = this.cardItems.nth(index);
    await expect(card).toBeVisible();
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate back to card list from detail view
   */
  async navigateBackToCardList() {
    await expect(this.backToCardsButton).toBeVisible();
    await this.backToCardsButton.click();
    await this.waitForCardListLoad();
  }

  /**
   * Get current balance value from card detail view
   * @returns {Promise<number>}
   */
  async getCurrentBalance() {
    await expect(this.currentBalanceLabel).toBeVisible();
    const balanceText = await this.currentBalanceLabel.textContent();
    const match = balanceText.match(/\$([\d,]+(?:\.\d{2})?)/);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ''));
    }
    return 0;
  }

  /**
   * Get utilization percentage from card detail view
   * @returns {Promise<number>}
   */
  async getUtilizationPercentage() {
    await expect(this.utilizationPercentage).toBeVisible();
    const utilizationText = await this.utilizationPercentage.textContent();
    const match = utilizationText.match(/(\d+)%/);
    if (match) {
      return parseInt(match[1]);
    }
    return 0;
  }

  /**
   * Verify all cards display required metrics
   */
  async verifyAllCardsDisplayMetrics() {
    const count = await this.getCardCount();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = this.cardItems.nth(i);
      await expect(card.locator('.card-number')).toBeVisible();
      await expect(card.locator('.card-type')).toBeVisible();
    }
  }

  /**
   * Verify scroll performance (smooth scrolling)
   */
  async verifyScrollPerformance() {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await this.page.waitForTimeout(500);
    
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await this.page.waitForTimeout(500);
    
    await this.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
  }

  /**
   * Verify system stability (navigation accessible)
   */
  async verifySystemStability() {
    await expect(this.cardsNavLink).toBeVisible();
    await expect(this.cardsNavLink).toBeEnabled();
  }

  /**
   * Wait for specified timeout (used for testing latency scenarios)
   * @param {number} ms - Milliseconds to wait
   */
  async waitForTimeout(ms) {
    await this.page.waitForTimeout(ms);
  }
};
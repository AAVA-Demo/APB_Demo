const { expect } = require('@playwright/test');

/**
 * Dashboard Page Object
 * Handles all interactions with the Credit Card Dashboard page
 * Covers: KPI Display, Responsive Layout, Credit Card List
 */
exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.kpiMonthlySpend = page.locator('[data-testid="kpi-monthly-spend"], .kpi-card:has-text("Monthly Spend")');
    this.kpiTotalCreditLimit = page.locator('[data-testid="kpi-total-credit-limit"], .kpi-card:has-text("Total Credit Limit")');
    this.kpiAvailableCredit = page.locator('[data-testid="kpi-available-credit"], .kpi-card:has-text("Available Credit")');
    this.kpiOutstandingAmount = page.locator('[data-testid="kpi-outstanding-amount"], .kpi-card:has-text("Outstanding Amount")');
    
    // Dashboard Container
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"], .dashboard, #dashboard');
    
    // Credit Card List
    this.creditCardList = page.locator('[data-testid="credit-card-list"], .card-list, .credit-cards');
    this.creditCardItems = page.locator('[data-testid="credit-card-item"], .card-item');
    
    // Messages
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"], .no-cards-message, .empty-state');
    this.syncErrorMessage = page.locator('[data-testid="sync-error-message"], .sync-error, .error-indicator');
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-danger');
    this.guidanceMessage = page.locator('[data-testid="guidance-message"], .guidance, .help-text');
  }

  /**
   * Navigate to dashboard page
   */
  async navigate() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for dashboard to fully load
   */
  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Authenticate user (mock authentication for testing)
   * @param {string} userId - User identifier
   */
  async authenticateUser(userId) {
    // In a real implementation, this would handle authentication
    // For testing purposes, we can set a cookie or localStorage value
    await this.page.evaluate((id) => {
      localStorage.setItem('userId', id);
      localStorage.setItem('authToken', 'mock-token-' + id);
    }, userId);
  }

  /**
   * Get Monthly Spend KPI value
   * @returns {Promise<string>} Monthly spend value
   */
  async getMonthlySpend() {
    await expect(this.kpiMonthlySpend).toBeVisible();
    const text = await this.kpiMonthlySpend.locator('.kpi-value, .value').textContent();
    return text.trim();
  }

  /**
   * Get Total Credit Limit KPI value
   * @returns {Promise<string>} Total credit limit value
   */
  async getTotalCreditLimit() {
    await expect(this.kpiTotalCreditLimit).toBeVisible();
    const text = await this.kpiTotalCreditLimit.locator('.kpi-value, .value').textContent();
    return text.trim();
  }

  /**
   * Get Available Credit KPI value
   * @returns {Promise<string>} Available credit value
   */
  async getAvailableCredit() {
    await expect(this.kpiAvailableCredit).toBeVisible();
    const text = await this.kpiAvailableCredit.locator('.kpi-value, .value').textContent();
    return text.trim();
  }

  /**
   * Get Outstanding Amount KPI value
   * @returns {Promise<string>} Outstanding amount value
   */
  async getOutstandingAmount() {
    await expect(this.kpiOutstandingAmount).toBeVisible();
    const text = await this.kpiOutstandingAmount.locator('.kpi-value, .value').textContent();
    return text.trim();
  }

  /**
   * Get all KPI values
   * @returns {Promise<Object>} Object containing all KPI values
   */
  async getAllKpiValues() {
    return {
      monthlySpend: await this.getMonthlySpend(),
      totalCreditLimit: await this.getTotalCreditLimit(),
      availableCredit: await this.getAvailableCredit(),
      outstandingAmount: await this.getOutstandingAmount()
    };
  }

  /**
   * Get all KPI texts (labels and values)
   * @returns {Promise<Object>} Object containing all KPI texts
   */
  async getAllKpiTexts() {
    return {
      monthlySpend: await this.kpiMonthlySpend.textContent(),
      totalCreditLimit: await this.kpiTotalCreditLimit.textContent(),
      availableCredit: await this.kpiAvailableCredit.textContent(),
      outstandingAmount: await this.kpiOutstandingAmount.textContent()
    };
  }

  /**
   * Verify if layout is stacked (single column)
   * @returns {Promise<boolean>} True if layout is stacked
   */
  async verifyStackedLayout() {
    const kpiCards = this.page.locator('.kpi-card');
    const count = await kpiCards.count();
    
    if (count === 0) return false;
    
    // Check if all cards are in a single column by comparing Y positions
    const positions = [];
    for (let i = 0; i < count; i++) {
      const box = await kpiCards.nth(i).boundingBox();
      if (box) positions.push(box.y);
    }
    
    // If all Y positions are different, it's a stacked layout
    const uniqueYPositions = new Set(positions);
    return uniqueYPositions.size === positions.length;
  }

  /**
   * Check if page has horizontal scroll
   * @returns {Promise<boolean>} True if horizontal scroll exists
   */
  async hasHorizontalScroll() {
    return await this.page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
  }

  /**
   * Check if page has vertical scroll
   * @returns {Promise<boolean>} True if vertical scroll exists
   */
  async hasVerticalScroll() {
    return await this.page.evaluate(() => {
      return document.documentElement.scrollHeight > document.documentElement.clientHeight;
    });
  }

  /**
   * Get KPI font size
   * @returns {Promise<number>} Font size in pixels
   */
  async getKpiFontSize() {
    const fontSize = await this.kpiMonthlySpend.locator('.kpi-value, .value').evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });
    return fontSize;
  }

  /**
   * Get spacing between KPI cards
   * @returns {Promise<number>} Spacing in pixels
   */
  async getKpiCardSpacing() {
    const kpiCards = this.page.locator('.kpi-card');
    const count = await kpiCards.count();
    
    if (count < 2) return 0;
    
    const firstBox = await kpiCards.nth(0).boundingBox();
    const secondBox = await kpiCards.nth(1).boundingBox();
    
    if (!firstBox || !secondBox) return 0;
    
    // Calculate vertical spacing
    return secondBox.y - (firstBox.y + firstBox.height);
  }

  /**
   * Verify if credit card list is stacked
   * @returns {Promise<boolean>} True if card list is stacked
   */
  async verifyCreditCardListStacked() {
    const cardItems = this.creditCardItems;
    const count = await cardItems.count();
    
    if (count === 0) return true; // No cards, consider as valid
    
    // Check if all cards are in a single column
    const positions = [];
    for (let i = 0; i < Math.min(count, 3); i++) {
      const box = await cardItems.nth(i).boundingBox();
      if (box) positions.push(box.x);
    }
    
    // If all X positions are similar, it's a single column
    const uniqueXPositions = new Set(positions.map(x => Math.round(x / 10)));
    return uniqueXPositions.size === 1;
  }

  /**
   * Get number of columns in KPI layout
   * @returns {Promise<number>} Number of columns
   */
  async getKpiLayoutColumns() {
    const kpiCards = this.page.locator('.kpi-card');
    const count = await kpiCards.count();
    
    if (count === 0) return 0;
    
    // Get Y position of first card
    const firstBox = await kpiCards.nth(0).boundingBox();
    if (!firstBox) return 0;
    
    // Count how many cards are on the same row (similar Y position)
    let columnsInFirstRow = 1;
    for (let i = 1; i < count; i++) {
      const box = await kpiCards.nth(i).boundingBox();
      if (box && Math.abs(box.y - firstBox.y) < 10) {
        columnsInFirstRow++;
      }
    }
    
    return columnsInFirstRow;
  }

  /**
   * Check if content is truncated
   * @returns {Promise<boolean>} True if content is truncated
   */
  async isContentTruncated() {
    const kpiCards = this.page.locator('.kpi-card');
    const count = await kpiCards.count();
    
    for (let i = 0; i < count; i++) {
      const isTruncated = await kpiCards.nth(i).evaluate((el) => {
        const textElements = el.querySelectorAll('.kpi-value, .value, h3, .title');
        for (const textEl of textElements) {
          if (textEl.scrollWidth > textEl.clientWidth) {
            return true;
          }
        }
        return false;
      });
      if (isTruncated) return true;
    }
    
    return false;
  }

  /**
   * Check if elements are overlapping
   * @returns {Promise<boolean>} True if elements overlap
   */
  async hasOverlappingElements() {
    const kpiCards = this.page.locator('.kpi-card');
    const count = await kpiCards.count();
    
    if (count < 2) return false;
    
    const boxes = [];
    for (let i = 0; i < count; i++) {
      const box = await kpiCards.nth(i).boundingBox();
      if (box) boxes.push(box);
    }
    
    // Check for overlaps
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const box1 = boxes[i];
        const box2 = boxes[j];
        
        const overlap = !(
          box1.x + box1.width < box2.x ||
          box2.x + box2.width < box1.x ||
          box1.y + box1.height < box2.y ||
          box2.y + box2.height < box1.y
        );
        
        if (overlap) return true;
      }
    }
    
    return false;
  }

  /**
   * Check if layout is broken
   * @returns {Promise<boolean>} True if layout is broken
   */
  async isLayoutBroken() {
    // Check if any KPI card is outside viewport
    const kpiCards = this.page.locator('.kpi-card');
    const count = await kpiCards.count();
    const viewportSize = this.page.viewportSize();
    
    for (let i = 0; i < count; i++) {
      const box = await kpiCards.nth(i).boundingBox();
      if (box) {
        if (box.x < 0 || box.x + box.width > viewportSize.width) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Check if credit card list is readable
   * @returns {Promise<boolean>} True if readable
   */
  async isCreditCardListReadable() {
    const cardItems = this.creditCardItems;
    const count = await cardItems.count();
    
    if (count === 0) return true; // No cards, consider as valid
    
    // Check if first card is visible and not truncated
    const firstCard = cardItems.nth(0);
    await expect(firstCard).toBeVisible();
    
    const isTruncated = await firstCard.evaluate((el) => {
      return el.scrollWidth > el.clientWidth;
    });
    
    return !isTruncated;
  }

  /**
   * Get no cards message
   * @returns {Promise<string>} No cards message text
   */
  async getNoCardsMessage() {
    if (await this.noCardsMessage.isVisible()) {
      return await this.noCardsMessage.textContent();
    }
    return '';
  }

  /**
   * Check if error message is displayed
   * @returns {Promise<boolean>} True if error message exists
   */
  async hasErrorMessage() {
    return await this.errorMessage.isVisible();
  }

  /**
   * Check if guidance message is displayed
   * @returns {Promise<boolean>} True if guidance message exists
   */
  async hasGuidanceMessage() {
    return await this.guidanceMessage.isVisible();
  }

  /**
   * Get sync error message
   * @returns {Promise<string>} Sync error message text
   */
  async getSyncErrorMessage() {
    await expect(this.syncErrorMessage).toBeVisible();
    return await this.syncErrorMessage.textContent();
  }

  /**
   * Get card list error indicator for specific card
   * @param {string} cardName - Name of the card
   * @returns {Promise<string>} Error indicator text
   */
  async getCardListErrorIndicator(cardName) {
    const cardItem = this.page.locator(`.card-item:has-text("${cardName}")`);
    await expect(cardItem).toBeVisible();
    
    const errorIndicator = cardItem.locator('.error-indicator, .sync-error, .status');
    return await errorIndicator.textContent();
  }
};

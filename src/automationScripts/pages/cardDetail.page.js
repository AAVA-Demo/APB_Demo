const { expect } = require('@playwright/test');

/**
 * Page Object: CardDetailPage
 * Description: Represents the individual Credit Card Detail page
 * Features: Card information, spend analysis, utilization metrics
 */
exports.CardDetailPage = class CardDetailPage {
  constructor(page) {
    this.page = page;
    
    // Container locators
    this.cardDetailContainer = page.locator('.card-detail-container');
    
    // Card information panel
    this.cardInfoPanel = page.locator('.panel-primary');
    
    // Spend analysis panel
    this.spendAnalysisPanel = page.locator('.panel-info');
    
    // Spend metrics
    this.monthlySpendField = page.locator('p:has-text("Monthly Spend:")');
    this.transactionCountField = page.locator('p:has-text("Transaction Count:")');
    this.avgTransactionField = page.locator('p:has-text("Avg Transaction:")');
    
    // Utilization field
    this.utilizationField = page.locator('td:has-text("Utilization:")');
    
    // Category breakdown
    this.categoryList = page.locator('.list-group');
    
    // Messages
    this.noTransactionsMessage = page.locator('p:has-text("No transactions found")');
    
    // Back button
    this.backButton = page.locator('button:has-text("Back to Cards")');
  }

  /**
   * Wait for spend analysis data to load
   */
  async waitForSpendAnalysisLoad() {
    await this.page.waitForResponse(response => 
      response.url().includes('/spend-analysis') && response.status() === 200,
      { timeout: 10000 }
    );
    await expect(this.spendAnalysisPanel).toBeVisible();
  }

  /**
   * Wait for card details to load
   */
  async waitForCardDetailsLoad() {
    await this.page.waitForResponse(response => 
      response.url().includes('/api/cards/') && response.status() === 200,
      { timeout: 10000 }
    );
    await expect(this.cardInfoPanel).toBeVisible();
  }

  /**
   * Get monthly spend value
   * @returns {Promise<number>}
   */
  async getMonthlySpend() {
    await expect(this.monthlySpendField).toBeVisible();
    const text = await this.monthlySpendField.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  /**
   * Get transaction count
   * @returns {Promise<number>}
   */
  async getTransactionCount() {
    await expect(this.transactionCountField).toBeVisible();
    const text = await this.transactionCountField.textContent();
    return parseInt(text.replace(/[^0-9]/g, ''));
  }

  /**
   * Get average transaction amount
   * @returns {Promise<number>}
   */
  async getAvgTransactionAmount() {
    await expect(this.avgTransactionField).toBeVisible();
    const text = await this.avgTransactionField.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  /**
   * Get spend by category breakdown
   * @returns {Promise<Object>}
   */
  async getSpendByCategory() {
    await expect(this.categoryList).toBeVisible();
    const categoryItems = this.categoryList.locator('.list-group-item');
    const count = await categoryItems.count();
    
    const breakdown = {};
    for (let i = 0; i < count; i++) {
      const itemText = await categoryItems.nth(i).textContent();
      const parts = itemText.split(':');
      const category = parts[0].trim();
      const amount = parseFloat(parts[1].replace(/[^0-9.]/g, ''));
      breakdown[category] = amount;
    }
    
    return breakdown;
  }

  /**
   * Get card utilization percentage
   * @returns {Promise<number>}
   */
  async getUtilizationPercent() {
    await expect(this.utilizationField).toBeVisible();
    const row = this.utilizationField.locator('..');
    const valueCell = row.locator('td').nth(1);
    const text = await valueCell.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  /**
   * Get no transactions message
   * @returns {Promise<string>}
   */
  async getNoTransactionsMessage() {
    await expect(this.noTransactionsMessage).toBeVisible();
    return await this.noTransactionsMessage.textContent();
  }

  /**
   * Click back button to return to card list
   */
  async goBack() {
    await this.backButton.click();
    await this.page.waitForURL(/.*\/cards$/);
  }
};

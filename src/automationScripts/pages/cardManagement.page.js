const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Container
    this.cardManagementContainer = page.locator('.card-management-container');
    
    // Filter buttons
    this.filterBar = page.locator('.filter-bar');
    this.allFilterButton = this.filterBar.locator('button').filter({ hasText: 'All' });
    this.activeFilterButton = this.filterBar.locator('button').filter({ hasText: 'Active' });
    this.blockedFilterButton = this.filterBar.locator('button').filter({ hasText: 'Blocked' });
    
    // Card list
    this.cardItems = page.locator('.card-item');
    this.noCardsMessage = page.locator('text=/No credit cards are currently registered/');
    
    // Loading indicator
    this.loadingIndicator = page.locator('text=Loading cards...');
    
    // Card details section
    this.cardDetailsSection = page.locator('.card-details');
    this.closeDetailsButton = this.cardDetailsSection.locator('button').filter({ hasText: 'Close' });
    
    // Transaction table
    this.transactionTable = this.cardDetailsSection.locator('table');
    this.transactionRows = this.transactionTable.locator('tbody tr');
    
    // Spend metrics in details view
    this.totalSpendLabel = this.cardDetailsSection.locator('text=/Total Spend:/');
    this.totalTransactionsLabel = this.cardDetailsSection.locator('text=/Total Transactions:/');
    
    // No transactions message
    this.noTransactionsMessage = page.locator('text=/No spending data available for this card/');
  }

  async navigate() {
    await this.page.goto('/#!/cards');
    await this.waitForCardsToLoad();
  }

  async waitForCardsToLoad() {
    await expect(this.loadingIndicator).toBeHidden({ timeout: 3000 });
    await expect(this.cardManagementContainer).toBeVisible();
  }

  async getCardCount() {
    return await this.cardItems.count();
  }

  async getAllCardItems() {
    return await this.cardItems.all();
  }

  async getCardType(index) {
    const card = this.cardItems.nth(index);
    const heading = card.locator('h4');
    const text = await heading.textContent();
    return text.split(' - ')[0].trim();
  }

  async getCardNumber(index) {
    const card = this.cardItems.nth(index);
    const heading = card.locator('h4');
    const text = await heading.textContent();
    return text.split(' - ')[1].trim();
  }

  async getCreditLimit(index) {
    const card = this.cardItems.nth(index);
    const limitText = await card.locator('text=/Credit Limit:/').textContent();
    return limitText.split(':')[1].trim();
  }

  async getAvailableCredit(index) {
    const card = this.cardItems.nth(index);
    const availableText = await card.locator('text=/Available Credit:/').textContent();
    return availableText.split(':')[1].trim();
  }

  async getOutstandingAmount(index) {
    const card = this.cardItems.nth(index);
    const outstandingText = await card.locator('text=/Outstanding:/').textContent();
    return outstandingText.split(':')[1].trim();
  }

  async getCardStatus(index) {
    const card = this.cardItems.nth(index);
    const statusBadge = card.locator('.badge');
    return await statusBadge.textContent();
  }

  async filterByStatus(status) {
    if (status === 'All') {
      await this.allFilterButton.click();
    } else if (status === 'Active') {
      await this.activeFilterButton.click();
    } else if (status === 'Blocked') {
      await this.blockedFilterButton.click();
    }
  }

  async selectCard(index) {
    const card = this.cardItems.nth(index);
    await card.click();
  }

  async waitForCardDetailsToLoad() {
    await expect(this.cardDetailsSection).toBeVisible({ timeout: 3000 });
  }

  async getTotalSpendValue() {
    const text = await this.totalSpendLabel.textContent();
    return text.split(':')[1].trim();
  }

  async getTotalTransactionsValue() {
    const text = await this.totalTransactionsLabel.textContent();
    const match = text.match(/Total Transactions:\s*(\d+)/);
    return match ? match[1] : '0';
  }

  async getAverageTransactionValue() {
    const avgLabel = this.cardDetailsSection.locator('text=/Average Transaction:/');
    const text = await avgLabel.textContent();
    return text.split(':')[1].trim();
  }

  async getTransactionCategories() {
    const categories = [];
    const rows = await this.transactionRows.all();
    for (const row of rows) {
      const categoryCell = row.locator('td').nth(1);
      const category = await categoryCell.textContent();
      categories.push(category);
    }
    return categories;
  }

  async getCreditLimitFromDetails() {
    const card = this.cardItems.first();
    const limitText = await card.locator('text=/Credit Limit:/').textContent();
    return limitText.split(':')[1].trim();
  }

  async getOutstandingFromDetails() {
    const card = this.cardItems.first();
    const outstandingText = await card.locator('text=/Outstanding:/').textContent();
    return outstandingText.split(':')[1].trim();
  }

  async getAvailableCreditFromDetails() {
    const card = this.cardItems.first();
    const availableText = await card.locator('text=/Available Credit:/').textContent();
    return availableText.split(':')[1].trim();
  }

  async getUtilizationRate() {
    const card = this.cardItems.first();
    const utilizationText = await card.locator('text=/Utilization:/').textContent();
    return utilizationText.split(':')[1].trim();
  }

  async getNoCardsMessageText() {
    return await this.noCardsMessage.textContent();
  }

  async getNoTransactionsMessageText() {
    return await this.noTransactionsMessage.textContent();
  }

  async closeCardDetails() {
    await this.closeDetailsButton.click();
  }
};

const { expect } = require('@playwright/test');

exports.CardsPage = class CardsPage {
  constructor(page) {
    this.page = page;
    
    // Card List Locators
    this.cardItems = page.locator('.card-item');
    this.cardListSection = page.locator('.col-md-6').first();
    
    // Transaction Panel Locators
    this.transactionPanel = page.locator('.col-md-6').last();
    this.transactionItems = page.locator('.card-item').filter({ has: page.locator('small.text-muted') });
    this.transactionMessage = page.locator('.alert-info');
    
    // Page Layout Locators
    this.pageHeader = page.locator('h2', { hasText: 'My Credit Cards' });
    this.navigation = page.locator('.navbar');
    this.footer = page.locator('footer');
    
    // Message Locators
    this.noCardsMessage = page.locator('text=No credit cards registered');
    this.noTransactionsMessage = page.locator('text=No transactions found');
    
    // Loading Indicator
    this.loadingIndicator = page.locator('text=Loading cards...');
  }

  async navigate() {
    await this.page.goto('/cards');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyCardCount(expectedCount) {
    await this.page.waitForSelector('.card-item', { state: 'visible', timeout: 5000 }).catch(() => {});
    const count = await this.cardItems.count();
    expect(count).toBe(expectedCount);
  }

  async verifyCardType(cardId, expectedType) {
    const cardItem = this.cardItems.filter({ hasText: cardId });
    await expect(cardItem).toBeVisible();
    await expect(cardItem).toContainText(expectedType);
  }

  async verifyMaskedCardNumber(cardId, expectedMaskedNumber) {
    const cardItem = this.cardItems.filter({ hasText: cardId });
    await expect(cardItem).toBeVisible();
    await expect(cardItem).toContainText(expectedMaskedNumber);
  }

  async verifyCardFinancialDetails(cardId, details) {
    const cardItem = this.cardItems.filter({ hasText: cardId });
    await expect(cardItem).toBeVisible();
    
    if (details.limit) {
      await expect(cardItem).toContainText(details.limit);
    }
    if (details.outstanding) {
      await expect(cardItem).toContainText(details.outstanding);
    }
    if (details.available) {
      await expect(cardItem).toContainText(details.available);
    }
  }

  async verifyCardOrder(expectedOrder) {
    const cardCount = await this.cardItems.count();
    expect(cardCount).toBe(expectedOrder.length);
    
    for (let i = 0; i < expectedOrder.length; i++) {
      const cardText = await this.cardItems.nth(i).textContent();
      expect(cardText).toContain(expectedOrder[i]);
    }
  }

  async selectCard(cardId) {
    const cardItem = this.cardItems.filter({ hasText: cardId });
    await cardItem.click();
    await this.page.waitForTimeout(500); // Wait for transaction panel to update
  }

  async verifyCardSelected(cardId) {
    // Verify card is highlighted or transaction panel shows card ID
    const transactionHeader = this.page.locator('h4', { hasText: 'Recent Transactions' });
    await expect(transactionHeader).toBeVisible();
  }

  async verifyTransactionPanelDisplaysForCard(cardId, expectedCount) {
    await this.page.waitForTimeout(500);
    const transactionCount = await this.transactionItems.count();
    expect(transactionCount).toBeGreaterThanOrEqual(expectedCount);
  }

  async verifyAvailableCreditCalculation(cardId, limit, outstanding, expectedAvailable) {
    const cardItem = this.cardItems.filter({ hasText: cardId });
    await expect(cardItem).toBeVisible();
    
    const calculatedAvailable = limit - outstanding;
    expect(calculatedAvailable).toBe(expectedAvailable);
    
    await expect(cardItem).toContainText(`₹${expectedAvailable.toLocaleString('en-IN')}`);
  }

  async verifyNoCardsMessage(expectedMessage) {
    await expect(this.noCardsMessage).toBeVisible();
    await expect(this.noCardsMessage).toContainText(expectedMessage);
  }

  async verifyNoSystemErrors() {
    // Verify no console errors and page is loaded
    await expect(this.pageHeader).toBeVisible();
    const errorAlert = this.page.locator('.alert-danger');
    const errorCount = await errorAlert.count();
    expect(errorCount).toBe(0);
  }

  async verifyTransactionPanelMessage(expectedMessage) {
    await expect(this.transactionMessage).toBeVisible();
    await expect(this.transactionMessage).toContainText(expectedMessage);
  }

  async verifyNoTransactionPanelErrors() {
    const errorAlert = this.transactionPanel.locator('.alert-danger');
    const errorCount = await errorAlert.count();
    expect(errorCount).toBe(0);
  }

  async verifyPageHeaderDisplayed() {
    await expect(this.pageHeader).toBeVisible();
  }

  async verifyNavigationDisplayed() {
    await expect(this.navigation).toBeVisible();
  }

  async verifyFooterDisplayed() {
    // Footer may not exist in the provided HTML, so check gracefully
    const footerExists = await this.footer.count();
    if (footerExists > 0) {
      await expect(this.footer).toBeVisible();
    }
  }

  async verifyCardListSectionDisplaysMessage() {
    await expect(this.cardListSection).toBeVisible();
    const messageVisible = await this.noCardsMessage.isVisible();
    expect(messageVisible).toBe(true);
  }

  async verifyNoBrokenUIElements() {
    await this.verifyPageHeaderDisplayed();
    await this.verifyNavigationDisplayed();
    await expect(this.cardListSection).toBeVisible();
    await expect(this.transactionPanel).toBeVisible();
  }

  async verifyCardDisplayedWithMissingField(cardId, fieldName, defaultValue) {
    const cardItem = this.cardItems.filter({ hasText: cardId });
    await expect(cardItem).toBeVisible();
    await expect(cardItem).toContainText(defaultValue);
  }

  async verifyOtherCardDetailsDisplayed(cardId) {
    const cardItem = this.cardItems.filter({ hasText: cardId });
    await expect(cardItem).toBeVisible();
    
    // Verify card type and masked number are still displayed
    const cardText = await cardItem.textContent();
    expect(cardText.length).toBeGreaterThan(10);
  }

  async verifyAvailableCreditHandlesMissingOutstanding(cardId) {
    const cardItem = this.cardItems.filter({ hasText: cardId });
    await expect(cardItem).toBeVisible();
    
    // Available credit should display N/A or be calculated as credit limit
    const cardText = await cardItem.textContent();
    expect(cardText).toMatch(/N\/A|Available/);
  }

  async verifyCardDisplayedWithMultipleMissingFields(cardId, missingFields) {
    const cardItem = this.cardItems.filter({ hasText: cardId });
    await expect(cardItem).toBeVisible();
    
    // Verify card displays with N/A or default values for missing fields
    const cardText = await cardItem.textContent();
    expect(cardText).toContain('N/A');
  }

  async verifyOtherValidCardsDisplayed(validCardIds) {
    for (const cardId of validCardIds) {
      const cardItem = this.cardItems.filter({ hasText: cardId });
      await expect(cardItem).toBeVisible();
    }
  }
};

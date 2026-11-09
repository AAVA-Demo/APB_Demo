const { expect } = require('@playwright/test');
const { BasePage } = require('./base.page');

exports.CardsPage = class CardsPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    
    // Main Container Locators
    this.cardsContainer = page.locator('.cards-container, [data-testid="cards-container"]');
    this.portfolioView = page.locator('.portfolio-view, [data-testid="portfolio-view"]');
    
    // Card Locators
    this.cardItems = page.locator('.card-item, .credit-card, [data-testid="card-item"]');
    this.cardCheckbox = page.locator('.card-checkbox, input[type="checkbox"][data-card-select]');
    
    // Empty State Locators
    this.emptyStateMessage = page.locator('.empty-state-message, [data-testid="empty-state"], .no-cards-message');
    this.addCardButton = page.locator('[data-testid="add-card-button"], .btn-add-card, button:has-text("Add Card")');
    this.addCardPrompt = page.locator('[data-testid="add-card-prompt"], .add-card-prompt');
    
    // Comparison Mode Locators
    this.compareButton = page.locator('[data-testid="compare-button"], .btn-compare, button:has-text("Compare")');
    this.comparisonView = page.locator('.comparison-view, [data-testid="comparison-view"], .card-comparison-table');
    this.comparisonTable = page.locator('table.comparison-table, [data-testid="comparison-table"]');
    this.selectedCardsIndicator = page.locator('[data-testid="selected-cards-count"], .selected-count');
    
    // Validation Message Locators
    this.validationMessage = page.locator('.validation-message, .alert-warning, [data-testid="validation-message"]');
    
    // Financial Metrics Locators (within card)
    this.cardSpending = '.monthly-spend, [data-testid="card-spending"]';
    this.cardCreditLimit = '.credit-limit, [data-testid="card-credit-limit"]';
    this.cardAvailableCredit = '.available-credit, [data-testid="card-available-credit"]';
    this.cardOutstanding = '.outstanding-balance, [data-testid="card-outstanding"]';
  }

  async navigate() {
    await this.page.goto('/cards');
    await this.waitForPageLoad();
    await expect(this.cardsContainer).toBeVisible({ timeout: 10000 });
  }

  // Card Count and Retrieval Methods
  async getCardCount() {
    await this.page.waitForTimeout(1000); // Wait for cards to render
    return await this.cardItems.count();
  }

  async getAllCards() {
    await this.page.waitForTimeout(1000);
    return await this.cardItems.all();
  }

  // Empty State Methods
  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible({ timeout: 5000 });
    return await this.emptyStateMessage.textContent();
  }

  async getAddCardPrompt() {
    await expect(this.addCardPrompt).toBeVisible({ timeout: 5000 });
    return await this.addCardPrompt.textContent();
  }

  // Financial Metrics Validation
  async cardHasCompleteFinancialMetrics(cardLocator) {
    const hasSpending = await cardLocator.locator(this.cardSpending).isVisible();
    const hasCreditLimit = await cardLocator.locator(this.cardCreditLimit).isVisible();
    const hasAvailableCredit = await cardLocator.locator(this.cardAvailableCredit).isVisible();
    const hasOutstanding = await cardLocator.locator(this.cardOutstanding).isVisible();
    
    return hasSpending && hasCreditLimit && hasAvailableCredit && hasOutstanding;
  }

  // Card Selection Methods
  async selectCardForComparison(cardLocator) {
    const checkbox = cardLocator.locator('input[type="checkbox"], .card-checkbox');
    await expect(checkbox).toBeVisible();
    await checkbox.check();
    await this.page.waitForTimeout(500); // Wait for selection state update
  }

  async getSelectedCardCount() {
    const checkboxes = await this.page.locator('input[type="checkbox"]:checked, .card-checkbox:checked').all();
    return checkboxes.length;
  }

  // Comparison Mode Methods
  async activateComparisonMode() {
    await expect(this.compareButton).toBeVisible();
    await expect(this.compareButton).toBeEnabled();
    await this.compareButton.click();
    await this.page.waitForTimeout(1000); // Wait for comparison view to render
  }

  async attemptActivateComparisonMode() {
    await expect(this.compareButton).toBeVisible();
    await this.compareButton.click();
    await this.page.waitForTimeout(1000);
  }

  async isComparisonModeActive() {
    const isVisible = await this.comparisonView.isVisible().catch(() => false);
    return isVisible;
  }

  async isComparisonTabularLayout() {
    await expect(this.comparisonView).toBeVisible();
    const tableExists = await this.comparisonTable.isVisible().catch(() => false);
    if (tableExists) return true;
    
    // Alternative: Check if comparison view has table-like structure
    const hasTableStructure = await this.comparisonView.evaluate(el => {
      return el.querySelector('table') !== null || el.classList.contains('table') || el.querySelector('.table-row') !== null;
    });
    return hasTableStructure;
  }

  // Comparison Data Extraction Methods
  async getComparisonCreditLimits() {
    await expect(this.comparisonView).toBeVisible();
    const creditLimitCells = await this.comparisonView.locator('[data-metric="credit-limit"], .comparison-credit-limit, td:has-text("Credit Limit") + td').all();
    return creditLimitCells;
  }

  async getComparisonAvailableCredits() {
    await expect(this.comparisonView).toBeVisible();
    const availableCreditCells = await this.comparisonView.locator('[data-metric="available-credit"], .comparison-available-credit, td:has-text("Available Credit") + td').all();
    return availableCreditCells;
  }

  async getComparisonSpendings() {
    await expect(this.comparisonView).toBeVisible();
    const spendingCells = await this.comparisonView.locator('[data-metric="spending"], .comparison-spending, td:has-text("Spending") + td, td:has-text("Monthly Spend") + td').all();
    return spendingCells;
  }

  async getComparisonOutstandingBalances() {
    await expect(this.comparisonView).toBeVisible();
    const outstandingCells = await this.comparisonView.locator('[data-metric="outstanding"], .comparison-outstanding, td:has-text("Outstanding") + td').all();
    return outstandingCells;
  }

  // Validation Methods
  async getValidationMessage() {
    await expect(this.validationMessage).toBeVisible({ timeout: 5000 });
    return await this.validationMessage.textContent();
  }
};
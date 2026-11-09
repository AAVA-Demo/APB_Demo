const { expect } = require('@playwright/test');

/**
 * Page Object Model for Credit Card Dashboard
 * Handles all dashboard-related interactions including KPI display, card management, and navigation
 */
exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Navigation locators
    this.dashboardNavLink = page.locator('a[href="#!/dashboard"]');
    this.transactionsNavLink = page.locator('a[href="#!/transactions"]');
    this.analyticsNavLink = page.locator('a[href="#!/analytics"]');
    
    // Authentication locators
    this.usernameInput = page.locator('input[type="email"], input[name="username"]');
    this.passwordInput = page.locator('input[type="password"], input[name="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login")');
    
    // Dashboard container
    this.dashboardContainer = page.locator('.dashboard-container, div[ng-if="!vm.loading && vm.dashboardData"]');
    
    // KPI card locators
    this.monthlySpendKPI = page.locator('kpi-card[title="Monthly Spend"], .kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('kpi-card[title="Total Credit Limit"], .kpi-card:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('kpi-card[title="Available Credit"], .kpi-card:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('kpi-card[title="Outstanding Amount"], .kpi-card:has-text("Outstanding Amount")');
    
    // Message and error locators
    this.noDataMessage = page.locator('.alert-info, div:has-text("No credit card information available")');
    this.errorMessage = page.locator('.alert-danger, div[ng-if="vm.error"]');
    this.retryButton = page.locator('button:has-text("Retry"), button.btn-primary:has-text("Refresh")');
    
    // Card summary locators
    this.cardSummaryContainer = page.locator('creditcard-summary, .creditcard-summary');
    this.cardPanels = page.locator('.panel.panel-info');
    
    // Settings and add card locators
    this.settingsLink = page.locator('a[href="#!/settings"], a:has-text("Settings")');
    this.addCardButton = page.locator('button:has-text("Add Credit Card")');
    this.cardNameInput = page.locator('input[name="cardName"], input[placeholder*="Card Name"]');
    this.creditLimitInput = page.locator('input[name="creditLimit"], input[placeholder*="Credit Limit"]');
    this.availableCreditInput = page.locator('input[name="availableCredit"], input[placeholder*="Available Credit"]');
    this.saveCardButton = page.locator('button[type="submit"]:has-text("Save"), button:has-text("Add Card")');
  }

  /**
   * Navigate to the dashboard page
   */
  async navigate() {
    await this.page.goto('https://app.creditcard.com');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Login to the application
   * @param {string} username - User email
   * @param {string} password - User password
   */
  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get KPI value by type
   * @param {string} kpiType - Type of KPI (monthlySpend, totalCreditLimit, availableCredit, outstandingAmount)
   * @returns {Promise<string>} KPI value text
   */
  async getKPIValue(kpiType) {
    const kpiMap = {
      monthlySpend: this.monthlySpendKPI,
      totalCreditLimit: this.totalCreditLimitKPI,
      availableCredit: this.availableCreditKPI,
      outstandingAmount: this.outstandingAmountKPI
    };
    
    const kpiLocator = kpiMap[kpiType];
    await expect(kpiLocator).toBeVisible();
    
    const valueLocator = kpiLocator.locator('.kpi-value, p.kpi-value');
    return await valueLocator.textContent();
  }

  /**
   * Get no data message text
   * @returns {Promise<string>} No data message
   */
  async getNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
    return await this.noDataMessage.textContent();
  }

  /**
   * Check if KPI cards are visible
   * @returns {Promise<boolean>} True if KPI cards are visible
   */
  async areKPICardsVisible() {
    const monthlySpendVisible = await this.monthlySpendKPI.isVisible().catch(() => false);
    const totalCreditLimitVisible = await this.totalCreditLimitKPI.isVisible().catch(() => false);
    const availableCreditVisible = await this.availableCreditKPI.isVisible().catch(() => false);
    const outstandingAmountVisible = await this.outstandingAmountKPI.isVisible().catch(() => false);
    
    return monthlySpendVisible || totalCreditLimitVisible || availableCreditVisible || outstandingAmountVisible;
  }

  /**
   * Check if dashboard has error messages
   * @returns {Promise<boolean>} True if error messages are present
   */
  async hasErrorMessages() {
    const errorVisible = await this.errorMessage.isVisible().catch(() => false);
    if (!errorVisible) return false;
    
    const errorText = await this.errorMessage.textContent();
    return errorText.length > 0;
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message
   */
  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  /**
   * Click retry button
   */
  async clickRetryButton() {
    await expect(this.retryButton).toBeVisible();
    await this.retryButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Get count of credit cards
   * @returns {Promise<number>} Number of credit cards
   */
  async getCreditCardCount() {
    await expect(this.cardSummaryContainer).toBeVisible();
    const cards = await this.cardPanels.all();
    return cards.length;
  }

  /**
   * Get card summaries
   * @returns {Promise<Array>} Array of card summary objects
   */
  async getCardSummaries() {
    await expect(this.cardSummaryContainer).toBeVisible();
    const cards = await this.cardPanels.all();
    
    const summaries = [];
    for (const card of cards) {
      const cardName = await card.locator('.panel-heading h4').textContent();
      const creditLimitText = await card.locator('div:has-text("Credit Limit:")').textContent();
      const availableCreditText = await card.locator('div:has-text("Available:")').textContent();
      
      const creditLimit = parseFloat(creditLimitText.match(/\$([\d,]+\.\d{2})/)[1].replace(/,/g, ''));
      const availableCredit = parseFloat(availableCreditText.match(/\$([\d,]+\.\d{2})|\-\$([\d,]+\.\d{2})/)[1].replace(/,/g, ''));
      
      summaries.push({
        cardName: cardName.trim(),
        creditLimit,
        availableCredit
      });
    }
    
    return summaries;
  }

  /**
   * Verify real-time data
   * @returns {Promise<boolean>} True if data is real-time
   */
  async verifyRealTimeData() {
    // Verify timestamp or last updated indicator
    const timestamp = await this.page.locator('text=/Last updated|Updated at/i').textContent().catch(() => null);
    return timestamp !== null;
  }

  /**
   * Verify available credit calculation
   * @param {number} card1 - Card 1 available credit
   * @param {number} card2 - Card 2 available credit
   * @param {number} card3 - Card 3 available credit
   * @param {number} expected - Expected total
   * @returns {Promise<boolean>} True if calculation is correct
   */
  async verifyAvailableCreditCalculation(card1, card2, card3, expected) {
    const total = card1 + card2 + card3;
    return Math.abs(total - expected) < 0.01;
  }

  /**
   * Get card with negative credit
   * @returns {Promise<Object>} Card object with negative credit
   */
  async getCardWithNegativeCredit() {
    const summaries = await this.getCardSummaries();
    return summaries.find(card => card.availableCredit < 0);
  }

  /**
   * Check if warning indicator is present for card
   * @param {string} cardId - Card identifier
   * @returns {Promise<boolean>} True if warning indicator is present
   */
  async hasWarningIndicator(cardId) {
    const warningIcon = await this.page.locator(`.panel:has-text("${cardId}") .text-danger, .panel:has-text("${cardId}") .warning-icon`).isVisible().catch(() => false);
    return warningIcon;
  }

  /**
   * Navigate to settings
   */
  async navigateToSettings() {
    await this.settingsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Add new credit card
   * @param {string} cardName - Card name
   * @param {number} creditLimit - Credit limit
   * @param {number} availableCredit - Available credit
   */
  async addNewCreditCard(cardName, creditLimit, availableCredit) {
    await expect(this.addCardButton).toBeVisible();
    await this.addCardButton.click();
    
    await this.cardNameInput.fill(cardName);
    await this.creditLimitInput.fill(creditLimit.toString());
    await this.availableCreditInput.fill(availableCredit.toString());
    
    await this.saveCardButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to dashboard
   */
  async navigateToDashboard() {
    await this.dashboardNavLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get card by card number
   * @param {string} cardNumber - Card number (e.g., *7890)
   * @returns {Promise<Object>} Card object
   */
  async getCardByNumber(cardNumber) {
    const cardPanel = this.page.locator(`.panel:has-text("${cardNumber}")`);
    await expect(cardPanel).toBeVisible();
    
    const cardName = await cardPanel.locator('.panel-heading h4').textContent();
    const creditLimitText = await cardPanel.locator('div:has-text("Credit Limit:")').textContent();
    const availableCreditText = await cardPanel.locator('div:has-text("Available:")').textContent();
    
    return {
      cardName: cardName.trim(),
      creditLimit: creditLimitText.match(/\$([\d,]+\.\d{2})/)[0],
      availableCredit: availableCreditText.match(/\$([\d,]+\.\d{2})/)[0]
    };
  }

  /**
   * Check if session is active
   * @returns {Promise<boolean>} True if session is active
   */
  async isSessionActive() {
    const logoutButton = await this.page.locator('button:has-text("Logout"), a:has-text("Logout")').isVisible().catch(() => false);
    return logoutButton;
  }
};
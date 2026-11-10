const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.PortfolioPage = class PortfolioPage {
  constructor(page) {
    this.page = page;
    
    // Locators for authentication
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    
    // Locators for navigation
    this.portfolioNavLink = page.locator('a[href*="portfolio"], nav a:has-text("Portfolio")');
    
    // Locators for portfolio elements
    this.portfolioContainer = page.locator('.portfolio-container');
    this.cardPanels = page.locator('.card-panel, .credit-card-item');
    this.emptyStateMessage = page.locator('.empty-state, .no-cards-message');
    this.addCardButton = page.locator('button:has-text("Add Card"), a:has-text("Link Card")');
    
    // Locators for card details
    this.cardNumber = page.locator('.masked-card-number, [data-testid="card-number"]');
    this.cardType = page.locator('.card-type, [data-testid="card-type"]');
    this.creditLimit = page.locator('.credit-limit, [data-testid="credit-limit"]');
    this.currentBalance = page.locator('.current-balance, [data-testid="current-balance"]');
    this.availableCredit = page.locator('.available-credit, [data-testid="available-credit"]');
    this.monthlySpend = page.locator('.monthly-spend, [data-testid="monthly-spend"]');
    
    // Locators for spend analysis
    this.spendAnalysisPanel = page.locator('.spend-analysis, [data-testid="spend-analysis"]');
    this.utilizationPercentage = page.locator('.utilization-percentage, [data-testid="utilization"]');
    this.errorMessage = page.locator('.alert-danger, .error-message');
  }

  async navigate() {
    logger.info('Navigating to application URL');
    await this.page.goto('https://creditcard.example.com');
    await expect(this.page).toHaveURL(/creditcard\.example\.com/);
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Login successful');
  }

  async navigateToPortfolio() {
    logger.info('Navigating to portfolio page');
    await this.portfolioNavLink.click();
    await expect(this.portfolioContainer).toBeVisible({ timeout: 5000 });
    logger.info('Portfolio page loaded');
  }

  async waitForPortfolioLoad() {
    logger.info('Waiting for portfolio to load');
    await expect(this.portfolioContainer).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    logger.info('Counting credit cards');
    await expect(this.cardPanels.first()).toBeVisible({ timeout: 3000 });
    const count = await this.cardPanels.count();
    logger.info(`Found ${count} credit cards`);
    return count;
  }

  async selectCard(lastFourDigits) {
    logger.info(`Selecting card ending in ${lastFourDigits}`);
    const cardSelector = this.page.locator(`.card-panel:has-text("${lastFourDigits}")`);
    await expect(cardSelector).toBeVisible();
    await cardSelector.click();
    await expect(this.spendAnalysisPanel).toBeVisible({ timeout: 3000 });
    logger.info('Card selected, spend analysis displayed');
  }

  async getSpendAnalysis() {
    logger.info('Retrieving spend analysis data');
    await expect(this.spendAnalysisPanel).toBeVisible();
    
    const monthlySpend = await this.extractNumericValue(this.monthlySpend);
    const creditLimit = await this.extractNumericValue(this.creditLimit);
    const currentBalance = await this.extractNumericValue(this.currentBalance);
    const availableCredit = await this.extractNumericValue(this.availableCredit);
    const utilizationText = await this.utilizationPercentage.textContent();
    const utilizationPercentage = parseFloat(utilizationText.replace(/[^0-9.-]+/g, ''));
    
    return {
      monthlySpend,
      creditLimit,
      currentBalance,
      availableCredit,
      utilizationPercentage
    };
  }

  async extractNumericValue(locator) {
    await expect(locator).toBeVisible();
    const text = await locator.textContent();
    const numericValue = parseFloat(text.replace(/[^0-9.-]+/g, ''));
    return numericValue;
  }

  async attemptAccessDeactivatedCard(cardId) {
    logger.info(`Attempting to access deactivated card ID: ${cardId}`);
    await this.page.goto(`https://creditcard.example.com/portfolio/card/${cardId}`);
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage() {
    logger.info('Retrieving error message');
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    const message = await this.errorMessage.textContent();
    return message.trim();
  }

  async getAllCardDetails() {
    logger.info('Retrieving all card details');
    const cards = await this.cardPanels.all();
    const cardDetails = [];
    
    for (const card of cards) {
      await expect(card).toBeVisible();
      
      const maskedNumber = await card.locator('.masked-card-number, [data-testid="card-number"]').textContent();
      const cardType = await card.locator('.card-type, [data-testid="card-type"]').textContent();
      const creditLimitText = await card.locator('.credit-limit, [data-testid="credit-limit"]').textContent();
      const balanceText = await card.locator('.current-balance, [data-testid="current-balance"]').textContent();
      
      const creditLimit = parseFloat(creditLimitText.replace(/[^0-9.-]+/g, ''));
      const currentBalance = parseFloat(balanceText.replace(/[^0-9.-]+/g, ''));
      
      let availableCredit = 0;
      let monthlySpend = 0;
      
      try {
        const availableCreditText = await card.locator('.available-credit, [data-testid="available-credit"]').textContent({ timeout: 1000 });
        availableCredit = parseFloat(availableCreditText.replace(/[^0-9.-]+/g, ''));
        
        const monthlySpendText = await card.locator('.monthly-spend, [data-testid="monthly-spend"]').textContent({ timeout: 1000 });
        monthlySpend = parseFloat(monthlySpendText.replace(/[^0-9.-]+/g, ''));
      } catch {
        // Optional fields may not be present
      }
      
      cardDetails.push({
        maskedNumber: maskedNumber.trim(),
        cardType: cardType.trim(),
        creditLimit,
        currentBalance,
        availableCredit,
        monthlySpend
      });
    }
    
    logger.info(`Retrieved details for ${cardDetails.length} cards`);
    return cardDetails;
  }

  async checkPerformance() {
    logger.info('Checking portfolio performance');
    try {
      // Check scroll performance
      await this.page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await this.page.waitForTimeout(100);
      await this.page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      
      // Check if page is responsive
      const isResponsive = await this.page.evaluate(() => {
        return document.readyState === 'complete';
      });
      
      return isResponsive;
    } catch {
      return false;
    }
  }

  async getEmptyStateMessage() {
    logger.info('Retrieving empty state message');
    await expect(this.emptyStateMessage).toBeVisible({ timeout: 5000 });
    const message = await this.emptyStateMessage.textContent();
    return message.trim();
  }

  async hasAddCardButton() {
    try {
      await expect(this.addCardButton).toBeVisible({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }
};

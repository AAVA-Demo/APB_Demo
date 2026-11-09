const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    this.kpiSection = page.locator('.kpi-section');
    this.monthlySpendKPI = page.locator('.kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('.kpi-card:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('.kpi-card:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('.kpi-card:has-text("Outstanding Amount")');
    
    this.portfolioSection = page.locator('.card-portfolio-section');
    this.creditCardItems = page.locator('.credit-card-item');
    this.emptyPortfolioMessage = page.locator('text=No credit cards registered');
    
    this.errorMessage = page.locator('.alert-danger');
    this.retryButton = page.locator('button:has-text("Retry")');
  }

  async navigate() {
    logger.info('Navigating to dashboard page');
    await this.page.goto(process.env.BASE_URL + '/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async getKPIValue(kpiType) {
    logger.info(`Getting KPI value for: ${kpiType}`);
    let locator;
    
    switch(kpiType) {
      case 'monthlySpend':
        locator = this.monthlySpendKPI.locator('.kpi-value');
        break;
      case 'totalCreditLimit':
        locator = this.totalCreditLimitKPI.locator('.kpi-value');
        break;
      case 'availableCredit':
        locator = this.availableCreditKPI.locator('.kpi-value');
        break;
      case 'outstanding':
        locator = this.outstandingAmountKPI.locator('.kpi-value');
        break;
      default:
        throw new Error(`Unknown KPI type: ${kpiType}`);
    }
    
    await expect(locator).toBeVisible();
    return await locator.textContent();
  }

  async getCreditCardCount() {
    logger.info('Getting credit card count');
    await this.page.waitForTimeout(500);
    return await this.creditCardItems.count();
  }

  async getCreditCardDetails(index) {
    logger.info(`Getting credit card details for card at index: ${index}`);
    const card = this.creditCardItems.nth(index);
    await expect(card).toBeVisible();
    
    const cardType = await card.locator('.card-header h4').textContent();
    const maskedCardNumber = await card.locator('.card-number').textContent();
    const creditLimit = await card.locator('.detail-row:has-text("Credit Limit:") .value').textContent();
    const availableCredit = await card.locator('.detail-row:has-text("Available Credit:") .value').textContent();
    const outstanding = await card.locator('.detail-row:has-text("Outstanding:") .value').textContent();
    const monthlySpend = await card.locator('.detail-row:has-text("Monthly Spend:") .value').textContent();
    
    return {
      cardType: cardType.trim(),
      maskedCardNumber: maskedCardNumber.trim(),
      creditLimit: creditLimit.trim(),
      availableCredit: availableCredit.trim(),
      outstanding: outstanding.trim(),
      monthlySpend: monthlySpend.trim()
    };
  }

  async verifyResponsiveLayout(page) {
    logger.info('Verifying responsive layout');
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(this.portfolioSection).toBeVisible();
    logger.info('Desktop layout verified');
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(this.portfolioSection).toBeVisible();
    logger.info('Tablet layout verified');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(this.portfolioSection).toBeVisible();
    logger.info('Mobile layout verified');
    
    await page.setViewportSize({ width: 1920, height: 1080 });
  }
};

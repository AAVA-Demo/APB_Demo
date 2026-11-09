const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger('DashboardPage');
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('.kpi-card:has-text("Monthly Spend") h3');
    this.creditLimitKPI = page.locator('.kpi-card:has-text("Total Credit Limit") h3');
    this.availableCreditKPI = page.locator('.kpi-card:has-text("Available Credit") h3');
    this.outstandingAmountKPI = page.locator('.kpi-card:has-text("Outstanding Amount") h3');
    
    // Card Portfolio Locators
    this.cardTableRows = page.locator('.table-responsive table tbody tr');
    this.cardTypeColumn = page.locator('.table-responsive table tbody tr td:nth-child(1)');
    this.cardNumberColumn = page.locator('.table-responsive table tbody tr td:nth-child(2)');
    this.creditLimitColumn = page.locator('.table-responsive table tbody tr td:nth-child(3)');
    this.availableCreditColumn = page.locator('.table-responsive table tbody tr td:nth-child(4)');
    this.outstandingColumn = page.locator('.table-responsive table tbody tr td:nth-child(5)');
    this.monthlySpendColumn = page.locator('.table-responsive table tbody tr td:nth-child(6)');
    this.utilizationColumn = page.locator('.table-responsive table tbody tr td:nth-child(7) .progress-bar');
    
    // Loading and Error Locators
    this.loadingIndicator = page.locator('text=Loading dashboard...');
    this.errorMessage = page.locator('.alert-danger');
    this.pageTitle = page.locator('h2:has-text("Credit Card Dashboard")');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    this.logger.info('Navigated to dashboard page');
  }

  async waitForDashboardLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.pageTitle.waitFor({ state: 'visible' });
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      this.logger.info('Loading indicator not found or already hidden');
    });
    this.logger.info('Dashboard loaded successfully');
  }

  async getTotalCreditLimit() {
    await this.creditLimitKPI.waitFor({ state: 'visible' });
    const text = await this.creditLimitKPI.textContent();
    return text.replace('₹', '').trim();
  }

  async getTotalAvailableCredit() {
    await this.availableCreditKPI.waitFor({ state: 'visible' });
    const text = await this.availableCreditKPI.textContent();
    return text.replace('₹', '').trim();
  }

  async getTotalOutstandingAmount() {
    await this.outstandingAmountKPI.waitFor({ state: 'visible' });
    const text = await this.outstandingAmountKPI.textContent();
    return text.replace('₹', '').trim();
  }

  async getTotalMonthlySpend() {
    await this.monthlySpendKPI.waitFor({ state: 'visible' });
    const text = await this.monthlySpendKPI.textContent();
    return text.replace('₹', '').trim();
  }

  async getCardCount() {
    await this.cardTableRows.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      this.logger.info('No cards found in table');
    });
    return await this.cardTableRows.count();
  }

  async getCardDetails(index) {
    const row = this.cardTableRows.nth(index);
    await row.waitFor({ state: 'visible' });
    
    const cardType = await row.locator('td:nth-child(1)').textContent();
    const cardNumber = await row.locator('td:nth-child(2)').textContent();
    const creditLimit = await row.locator('td:nth-child(3)').textContent();
    const availableCredit = await row.locator('td:nth-child(4)').textContent();
    const outstandingAmount = await row.locator('td:nth-child(5)').textContent();
    const monthlySpend = await row.locator('td:nth-child(6)').textContent();
    
    return {
      cardType: cardType.trim(),
      cardNumber: cardNumber.trim(),
      creditLimit: creditLimit.replace('₹', '').trim(),
      availableCredit: availableCredit.replace('₹', '').trim(),
      outstandingAmount: outstandingAmount.replace('₹', '').trim(),
      monthlySpend: monthlySpend.replace('₹', '').trim()
    };
  }

  async getCardUtilization(index) {
    const row = this.cardTableRows.nth(index);
    await row.waitFor({ state: 'visible' });
    const progressBar = row.locator('td:nth-child(7) .progress-bar');
    const utilizationText = await progressBar.textContent();
    return utilizationText.trim();
  }

  async simulateDataSourceError() {
    await this.page.route('**/api/cards', route => {
      route.abort('failed');
    });
    await this.page.reload();
    this.logger.info('Simulated data source error');
  }

  async waitForErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible' });
    return await this.errorMessage.textContent();
  }

  async isLoadingIndicatorVisible() {
    return await this.loadingIndicator.isVisible().catch(() => false);
  }

  async getPageTitle() {
    return await this.pageTitle.textContent();
  }

  async loadSingleCardData() {
    await this.page.route('**/api/cards', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          cardId: 'CC001',
          cardNumber: '**** **** **** 1234',
          cardType: 'Visa Platinum',
          creditLimit: 100000,
          availableCredit: 65000,
          outstandingAmount: 35000,
          monthlySpend: 28000
        }])
      });
    });
    await this.page.reload();
    this.logger.info('Loaded single card data');
  }

  async loadEmptyCardData() {
    await this.page.route('**/api/cards', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    await this.page.reload();
    this.logger.info('Loaded empty card data');
  }

  async loadVaryingUtilizationData() {
    await this.page.route('**/api/cards', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            cardId: 'CC001',
            cardNumber: '**** 1111',
            cardType: 'Card A',
            creditLimit: 100000,
            availableCredit: 10000,
            outstandingAmount: 90000,
            monthlySpend: 50000
          },
          {
            cardId: 'CC002',
            cardNumber: '**** 2222',
            cardType: 'Card B',
            creditLimit: 100000,
            availableCredit: 50000,
            outstandingAmount: 50000,
            monthlySpend: 30000
          },
          {
            cardId: 'CC003',
            cardNumber: '**** 3333',
            cardType: 'Card C',
            creditLimit: 100000,
            availableCredit: 90000,
            outstandingAmount: 10000,
            monthlySpend: 5000
          }
        ])
      });
    });
    await this.page.reload();
    this.logger.info('Loaded varying utilization data');
  }

  async waitForAutoRefresh(milliseconds) {
    await this.page.waitForTimeout(milliseconds);
    this.logger.info(`Waited for auto-refresh: ${milliseconds}ms`);
  }
};
const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Section Locators
    this.kpiSection = page.locator('[data-testid="kpi-section"]');
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.totalOutstandingKPI = page.locator('[data-testid="kpi-total-outstanding"]');
    
    // Card Summary Section Locators
    this.cardSummarySection = page.locator('[data-testid="card-summary-section"]');
    this.cardTiles = page.locator('[data-testid="card-tile"]');
    this.cardNameLabel = page.locator('[data-testid="card-name"]');
    this.cardCreditLimitLabel = page.locator('[data-testid="card-credit-limit"]');
    this.cardAvailableCreditLabel = page.locator('[data-testid="card-available-credit"]');
    this.cardCurrentBalanceLabel = page.locator('[data-testid="card-current-balance"]');
    
    // Transaction Section Locators
    this.addTransactionButton = page.locator('[data-testid="add-transaction-btn"]');
    this.cardDropdown = page.locator('[data-testid="transaction-card-dropdown"]');
    this.amountInput = page.locator('[data-testid="transaction-amount-input"]');
    this.submitTransactionButton = page.locator('[data-testid="submit-transaction-btn"]');
    this.transactionSuccessMessage = page.locator('[data-testid="transaction-success-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.transactionHistoryTable = page.locator('[data-testid="transaction-history-table"]');
    
    // Card Detail View Locators
    this.cardMetricsSection = page.locator('[data-testid="card-metrics-section"]');
    
    // Loading Indicator
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  async navigate() {
    await this.page.goto('/');
    await this.waitForDashboardLoad();
  }

  async waitForDashboardLoad() {
    await expect(this.kpiSection).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getKPIValue(kpiName) {
    let kpiLocator;
    switch (kpiName) {
      case 'Monthly Spend':
        kpiLocator = this.monthlySpendKPI;
        break;
      case 'Total Credit Limit':
        kpiLocator = this.totalCreditLimitKPI;
        break;
      case 'Available Credit':
        kpiLocator = this.availableCreditKPI;
        break;
      case 'Total Outstanding':
        kpiLocator = this.totalOutstandingKPI;
        break;
      default:
        throw new Error(`Unknown KPI name: ${kpiName}`);
    }
    await expect(kpiLocator).toBeVisible();
    const valueElement = kpiLocator.locator('[data-testid="kpi-value"]');
    return await valueElement.textContent();
  }

  async getAllKPILabels() {
    const labels = [];
    const kpiElements = await this.kpiSection.locator('[data-testid="kpi-label"]').all();
    for (const element of kpiElements) {
      labels.push(await element.textContent());
    }
    return labels;
  }

  async getActiveCardCount() {
    return await this.cardTiles.count();
  }

  async getAllCardNames() {
    const names = [];
    const cardNameElements = await this.cardNameLabel.all();
    for (const element of cardNameElements) {
      names.push(await element.textContent());
    }
    return names;
  }

  async getCardAvailableCredit(cardName) {
    const cardTile = this.page.locator(`[data-testid="card-tile"][data-card-name="${cardName}"]`);
    await expect(cardTile).toBeVisible();
    const availableCreditElement = cardTile.locator('[data-testid="card-available-credit"]');
    return await availableCreditElement.textContent();
  }

  async getCardOutstanding(cardName) {
    const cardTile = this.page.locator(`[data-testid="card-tile"][data-card-name="${cardName}"]`);
    await expect(cardTile).toBeVisible();
    const outstandingElement = cardTile.locator('[data-testid="card-current-balance"]');
    return await outstandingElement.textContent();
  }

  async getCardDetails(cardName) {
    const cardTile = this.page.locator(`[data-testid="card-tile"][data-card-name="${cardName}"]`);
    await expect(cardTile).toBeVisible();
    
    const creditLimit = await cardTile.locator('[data-testid="card-credit-limit"]').textContent();
    const availableCredit = await cardTile.locator('[data-testid="card-available-credit"]').textContent();
    const currentBalance = await cardTile.locator('[data-testid="card-current-balance"]').textContent();
    
    return {
      creditLimit,
      availableCredit,
      currentBalance
    };
  }

  async addTransaction(cardName, amount) {
    await this.addTransactionButton.click();
    await expect(this.cardDropdown).toBeVisible();
    await this.cardDropdown.selectOption({ label: cardName });
    await this.amountInput.fill(amount.toString());
    await this.submitTransactionButton.click();
    // Wait for either success or error message
    await this.page.waitForSelector('[data-testid="transaction-success-message"], [data-testid="error-message"]', { timeout: 5000 });
  }

  async getCurrentMonthTransactionCount() {
    const transactionRows = this.transactionHistoryTable.locator('tbody tr');
    return await transactionRows.count();
  }

  async scrollToCardSummary() {
    await this.cardSummarySection.scrollIntoViewIfNeeded();
  }

  async clickCardTile(cardName) {
    const cardTile = this.page.locator(`[data-testid="card-tile"][data-card-name="${cardName}"]`);
    await expect(cardTile).toBeVisible();
    await cardTile.click();
    await this.page.waitForLoadState('networkidle');
  }
};
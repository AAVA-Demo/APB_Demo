const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');
const config = require('../../data/config.json');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.logoutButton = page.locator('a:has-text("Logout")');
    
    this.transactionsNavLink = page.locator('a[href="/transactions"]');
    this.transactionList = page.locator('[data-testid="transaction-list"]');
    this.transactionItems = page.locator('[data-testid="transaction-item"]');
    
    this.transactionDetailView = page.locator('[data-testid="transaction-detail-view"]');
    this.detailTransactionId = page.locator('[data-testid="detail-transaction-id"]');
    this.detailDateTime = page.locator('[data-testid="detail-date-time"]');
    this.detailAmount = page.locator('[data-testid="detail-amount"]');
    this.detailMerchant = page.locator('[data-testid="detail-merchant"]');
    this.detailCategory = page.locator('[data-testid="detail-category"]');
    this.detailCardInfo = page.locator('[data-testid="detail-card-info"]');
    this.detailStatus = page.locator('[data-testid="detail-status"]');
    this.detailDescription = page.locator('[data-testid="detail-description"]');
    
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.backToTransactionsButton = page.locator('a:has-text("Back to Transactions")');
    
    this.transactionLoader = page.locator('[data-testid="transaction-loader"]');
  }

  async navigate() {
    logger.info('Navigating to application');
    await this.page.goto(config.baseUrl);
  }

  async login(username, password) {
    logger.info(`Logging in as user: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL('**/dashboard');
    logger.info('Login successful');
  }

  async logout() {
    logger.info('Logging out user');
    await this.logoutButton.click();
    await this.page.waitForURL('**/login');
  }

  async navigateToTransactions() {
    logger.info('Navigating to transactions page');
    await this.transactionsNavLink.click();
    await this.page.waitForURL('**/transactions');
    await this.waitForTransactionsLoad();
  }

  async navigateToTransactionDetail(transactionId) {
    logger.info(`Navigating to transaction detail: ${transactionId}`);
    await this.page.goto(config.baseUrl + `/transactions/${transactionId}`);
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTransactionsLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.transactionLoader).toBeHidden({ timeout: 5000 }).catch(() => {});
    logger.info('Transactions page loaded successfully');
  }

  async getTransactionCount() {
    return await this.transactionItems.count();
  }

  async getTransactionDetails(index) {
    const transaction = this.transactionItems.nth(index);
    await expect(transaction).toBeVisible();
    
    const date = await transaction.locator('[data-testid="transaction-date"]').textContent();
    const amount = await transaction.locator('[data-testid="transaction-amount"]').textContent();
    const merchant = await transaction.locator('[data-testid="transaction-merchant"]').textContent();
    const cardName = await transaction.locator('[data-testid="transaction-card"]').textContent();
    const category = await transaction.locator('[data-testid="transaction-category"]').textContent();
    
    return { date, amount, merchant, cardName, category };
  }

  async hasTransactionsForCard(cardName) {
    const transactions = await this.transactionItems.all();
    for (const transaction of transactions) {
      const card = await transaction.locator('[data-testid="transaction-card"]').textContent();
      if (card.includes(cardName)) {
        return true;
      }
    }
    return false;
  }

  async isTransactionsSortedByDateDescending() {
    const transactions = await this.transactionItems.all();
    if (transactions.length < 2) return true;
    
    const dates = [];
    for (const transaction of transactions) {
      const dateText = await transaction.locator('[data-testid="transaction-date"]').textContent();
      dates.push(new Date(dateText));
    }
    
    for (let i = 0; i < dates.length - 1; i++) {
      if (dates[i] < dates[i + 1]) {
        return false;
      }
    }
    return true;
  }

  async selectTransaction(index) {
    logger.info(`Selecting transaction at index ${index}`);
    const transaction = this.transactionItems.nth(index);
    await transaction.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getEmptyStateMessageText() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getDetailTransactionId() {
    await expect(this.detailTransactionId).toBeVisible();
    return await this.detailTransactionId.textContent();
  }

  async getDetailDateTime() {
    await expect(this.detailDateTime).toBeVisible();
    return await this.detailDateTime.textContent();
  }

  async getDetailAmount() {
    await expect(this.detailAmount).toBeVisible();
    return await this.detailAmount.textContent();
  }

  async getDetailMerchant() {
    await expect(this.detailMerchant).toBeVisible();
    return await this.detailMerchant.textContent();
  }

  async getDetailCategory() {
    await expect(this.detailCategory).toBeVisible();
    return await this.detailCategory.textContent();
  }

  async getDetailCardInfo() {
    await expect(this.detailCardInfo).toBeVisible();
    return await this.detailCardInfo.textContent();
  }

  async getDetailStatus() {
    await expect(this.detailStatus).toBeVisible();
    return await this.detailStatus.textContent();
  }

  async getDetailDescription() {
    await expect(this.detailDescription).toBeVisible();
    return await this.detailDescription.textContent();
  }

  async simulateServiceUnavailable() {
    logger.info('Simulating transaction service unavailable');
    await this.page.route('**/api/transactions', route => {
      route.fulfill({
        status: 503,
        body: JSON.stringify({ error: 'Service Unavailable' })
      });
    });
  }
};

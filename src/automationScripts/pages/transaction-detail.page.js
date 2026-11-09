const { expect } = require('@playwright/test');

/**
 * Page Object: Transaction Detail Page
 * Covers: Individual Transaction Details View
 * Related Test Cases: QE-8457 TS-003
 */
exports.TransactionDetailPage = class TransactionDetailPage {
  constructor(page) {
    this.page = page;
    
    // Transaction Detail Fields
    this.transactionId = page.locator('[data-testid="detail-transaction-id"]');
    this.merchantName = page.locator('[data-testid="detail-merchant-name"]');
    this.amount = page.locator('[data-testid="detail-amount"]');
    this.category = page.locator('[data-testid="detail-category"]');
    this.status = page.locator('[data-testid="detail-status"]');
    this.description = page.locator('[data-testid="detail-description"]');
    this.transactionDate = page.locator('[data-testid="detail-date"]');
    this.cardInfo = page.locator('[data-testid="detail-card-info"]');
    
    // Navigation
    this.backButton = page.locator('[data-testid="back-to-transactions-button"]');
  }

  async navigateToTransaction(transactionId) {
    await this.page.goto(`/transactions/${transactionId}`);
    await this.page.waitForLoadState('networkidle');
  }

  async getAllTransactionDetails() {
    return {
      transactionId: await this.transactionId.textContent(),
      merchantName: await this.merchantName.textContent(),
      amount: await this.amount.textContent(),
      category: await this.category.textContent(),
      status: await this.status.textContent(),
      description: await this.description.textContent(),
      transactionDate: await this.transactionDate.textContent(),
      cardInfo: await this.cardInfo.textContent()
    };
  }

  async clickBackButton() {
    await this.backButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};
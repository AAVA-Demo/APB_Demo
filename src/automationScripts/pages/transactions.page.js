const { expect } = require('@playwright/test');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    this.transactionsContainer = page.locator('.transactions-container, [data-testid="transactions"]');
    this.transactionsNavLink = page.locator('a[href*="transactions"], nav a:has-text("Transactions")');
    this.transactionTable = page.locator('table, [data-testid="transaction-table"]');
    this.transactionRows = page.locator('table tbody tr, [data-testid="transaction-row"]');
    this.paginationControls = page.locator('.pagination, [data-testid="pagination"]');
    this.nextPageButton = page.locator('.pagination a:has-text("»"), [data-testid="next-page"]');
    this.previousPageButton = page.locator('.pagination a:has-text("«"), [data-testid="previous-page"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state"], .empty-message');
    this.errorMessage = page.locator('.alert-danger, [role="alert"]');
    this.retryButton = page.locator('button:has-text("Retry")');
    this.transactionDetailModal = page.locator('.modal, [data-testid="transaction-detail-modal"]');
    this.transactionDetailAmount = page.locator('.modal p:has-text("Amount"), [data-testid="detail-amount"]');
    this.transactionDetailTimestamp = page.locator('.modal p:has-text("Timestamp"), [data-testid="detail-timestamp"]');
    this.transactionDetailMerchant = page.locator('.modal p:has-text("Merchant"), [data-testid="detail-merchant"]');
    this.transactionDetailCategory = page.locator('.modal p:has-text("Category"), [data-testid="detail-category"]');
    this.transactionDetailCard = page.locator('.modal p:has-text("Card ID"), [data-testid="detail-card"]');
    this.closeModalButton = page.locator('.modal button:has-text("Close"), [data-testid="close-modal"]');
  }

  async navigateToTransactions() {
    await expect(this.transactionsNavLink).toBeVisible();
    await this.transactionsNavLink.click();
    await expect(this.transactionsContainer).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async isTransactionListVisible() {
    return await this.transactionTable.isVisible();
  }

  async getTransactionCount() {
    await expect(this.transactionTable).toBeVisible();
    return await this.transactionRows.count();
  }

  async getAllTransactions() {
    await expect(this.transactionTable).toBeVisible();
    const count = await this.transactionRows.count();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const row = this.transactionRows.nth(i);
      const date = await row.locator('td').nth(0).textContent();
      const merchant = await row.locator('td').nth(1).textContent();
      const category = await row.locator('td').nth(2).textContent();
      const amount = await row.locator('td').nth(3).textContent();
      
      transactions.push({
        date: date.trim(),
        merchant: merchant.trim(),
        category: category.trim(),
        amount: amount.trim()
      });
    }
    
    return transactions;
  }

  async isTransactionsInChronologicalOrder() {
    const transactions = await this.getAllTransactions();
    if (transactions.length <= 1) return true;
    
    for (let i = 0; i < transactions.length - 1; i++) {
      const date1 = new Date(transactions[i].date);
      const date2 = new Date(transactions[i + 1].date);
      if (date1 < date2) return false;
    }
    
    return true;
  }

  async hasPaginationControls() {
    return await this.paginationControls.isVisible();
  }

  async goToNextPage() {
    await expect(this.nextPageButton).toBeVisible();
    await expect(this.nextPageButton).toBeEnabled();
    await this.nextPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToPreviousPage() {
    await expect(this.previousPageButton).toBeVisible();
    await expect(this.previousPageButton).toBeEnabled();
    await this.previousPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async isTransactionListContainerVisible() {
    return await this.transactionsContainer.isVisible();
  }

  async hasConsoleErrors() {
    const errors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    await this.page.waitForTimeout(1000);
    return errors.length > 0;
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async hasTechnicalErrorDetails() {
    const errorText = await this.getErrorMessage();
    return errorText.includes('500') || errorText.includes('Error:') || errorText.includes('Stack');
  }

  async hasRetryButton() {
    return await this.retryButton.isVisible();
  }

  async selectFirstTransaction() {
    await expect(this.transactionTable).toBeVisible();
    const firstRow = this.transactionRows.first();
    const viewDetailsButton = firstRow.locator('button:has-text("View Details")');
    await expect(viewDetailsButton).toBeVisible();
    await viewDetailsButton.click();
    await expect(this.transactionDetailModal).toBeVisible();
  }

  async getTransactionDetailAmount() {
    await expect(this.transactionDetailAmount).toBeVisible();
    const text = await this.transactionDetailAmount.textContent();
    const match = text.match(/\$\d+\.\d{2}/);
    return match ? match[0] : text;
  }

  async getTransactionDetailTimestamp() {
    await expect(this.transactionDetailTimestamp).toBeVisible();
    const text = await this.transactionDetailTimestamp.textContent();
    return text.replace('Timestamp:', '').trim();
  }

  async getTransactionDetailMerchant() {
    await expect(this.transactionDetailMerchant).toBeVisible();
    const text = await this.transactionDetailMerchant.textContent();
    return text.replace('Merchant:', '').trim();
  }

  async getTransactionDetailCategory() {
    await expect(this.transactionDetailCategory).toBeVisible();
    const text = await this.transactionDetailCategory.textContent();
    return text.replace('Category:', '').trim();
  }

  async getTransactionDetailCard() {
    await expect(this.transactionDetailCard).toBeVisible();
    const text = await this.transactionDetailCard.textContent();
    return text.replace('Card ID:', '').trim();
  }

  async attemptToViewDeletedTransaction(transactionId) {
    await this.page.goto(`https://creditcard.demo.com/transactions/${transactionId}`);
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionDetailErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async isApplicationStable() {
    const hasErrors = await this.hasConsoleErrors();
    const isContainerVisible = await this.transactionsContainer.isVisible();
    return !hasErrors && isContainerVisible;
  }

  async returnToTransactionList() {
    if (await this.closeModalButton.isVisible()) {
      await this.closeModalButton.click();
    } else {
      await this.transactionsNavLink.click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async getMerchantPlaceholder() {
    const merchant = await this.getTransactionDetailMerchant();
    return merchant === 'N/A' || merchant === 'Unknown' ? merchant : null;
  }

  async getCategoryPlaceholder() {
    const category = await this.getTransactionDetailCategory();
    return category === 'N/A' || category === 'Uncategorized' ? category : null;
  }

  async isDetailViewLayoutIntact() {
    const isModalVisible = await this.transactionDetailModal.isVisible();
    const hasAmount = await this.transactionDetailAmount.isVisible();
    const hasTimestamp = await this.transactionDetailTimestamp.isVisible();
    return isModalVisible && hasAmount && hasTimestamp;
  }
};

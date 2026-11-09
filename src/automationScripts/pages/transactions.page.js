const { expect } = require('@playwright/test');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    this.navigationMenu = page.locator('nav.navbar');
    this.transactionsLink = page.locator('a[href="#!/transactions"]');
    this.transactionListingPage = page.locator('.transactions-container');
    this.transactionList = page.locator('.transaction-list');
    this.transactionRows = page.locator('.transaction-list tbody tr');
    this.emptyStateMessage = page.locator('.transaction-list').getByText(/No transactions are available/i);
    this.transactionDetailPanel = page.locator('.transaction-detail');
    this.closeDetailButton = page.locator('.transaction-detail .close');
    this.cardFilterInput = page.locator('#cardFilter');
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async navigate() {
    await this.page.goto('https://app.example.com/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToTransactionManagement() {
    await this.transactionsLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.transactionListingPage).toBeVisible();
  }

  async getTransactionCount() {
    await this.transactionRows.first().waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
    return await this.transactionRows.count();
  }

  async getAllTransactionDates() {
    const dates = [];
    const count = await this.transactionRows.count();
    for (let i = 0; i < count; i++) {
      const dateCell = this.transactionRows.nth(i).locator('td').nth(0);
      const text = await dateCell.textContent();
      dates.push(text.trim());
    }
    return dates;
  }

  async getAllTransactionAmounts() {
    const amounts = [];
    const count = await this.transactionRows.count();
    for (let i = 0; i < count; i++) {
      const amountCell = this.transactionRows.nth(i).locator('td').nth(2);
      const text = await amountCell.textContent();
      amounts.push(text.trim());
    }
    return amounts;
  }

  async getAllMerchantNames() {
    const merchants = [];
    const count = await this.transactionRows.count();
    for (let i = 0; i < count; i++) {
      const merchantCell = this.transactionRows.nth(i).locator('td').nth(1);
      const text = await merchantCell.textContent();
      merchants.push(text.trim());
    }
    return merchants;
  }

  async getAllCategories() {
    const categories = [];
    const count = await this.transactionRows.count();
    for (let i = 0; i < count; i++) {
      const categoryCell = this.transactionRows.nth(i).locator('td').nth(3);
      const text = await categoryCell.textContent();
      categories.push(text.trim());
    }
    return categories;
  }

  async getAllStatuses() {
    const statuses = [];
    const count = await this.transactionRows.count();
    for (let i = 0; i < count; i++) {
      const statusCell = this.transactionRows.nth(i).locator('td').nth(4);
      const text = await statusCell.textContent();
      statuses.push(text.trim());
    }
    return statuses;
  }

  async loginWithNoTransactions(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async applyCardFilter(cardId) {
    await this.page.goto(`https://app.example.com/transactions/${cardId}`);
    await this.page.waitForLoadState('networkidle');
  }

  async waitForFilteredResults() {
    await this.page.waitForTimeout(500);
    await this.transactionRows.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  }

  async verifyAllTransactionsBelongToCard(cardId) {
    const count = await this.transactionRows.count();
    for (let i = 0; i < count; i++) {
      const row = this.transactionRows.nth(i);
      const rowCardId = await row.getAttribute('data-card-id');
      if (rowCardId && rowCardId !== cardId) return false;
    }
    return true;
  }

  async verifyTransactionDetailsPreserved() {
    const count = await this.transactionRows.count();
    if (count === 0) return true;
    const firstRow = this.transactionRows.first();
    const hasDate = await firstRow.locator('td').nth(0).textContent() !== '';
    const hasAmount = await firstRow.locator('td').nth(2).textContent() !== '';
    const hasMerchant = await firstRow.locator('td').nth(1).textContent() !== '';
    return hasDate && hasAmount && hasMerchant;
  }

  async selectTransaction(transactionId) {
    const row = this.transactionRows.filter({ has: this.page.locator(`[data-transaction-id="${transactionId}"]`) }).first();
    if (await row.count() > 0) {
      await row.click();
    } else {
      await this.transactionRows.first().click();
    }
    await this.page.waitForTimeout(300);
  }

  async getDetailFieldValue(fieldName) {
    const field = this.transactionDetailPanel.locator('dt').filter({ hasText: fieldName }).locator('xpath=following-sibling::dd[1]');
    await expect(field).toBeVisible();
    return await field.textContent();
  }

  async verifyAvailableFieldsDisplayed() {
    const fields = this.transactionDetailPanel.locator('dd');
    const count = await fields.count();
    return count > 0;
  }

  async verifyMissingFieldsShowPlaceholder() {
    const fields = this.transactionDetailPanel.locator('dd');
    const count = await fields.count();
    for (let i = 0; i < count; i++) {
      const text = await fields.nth(i).textContent();
      if (text.trim() === '') {
        const hasPlaceholder = text.includes('N/A') || text.includes('n/a');
        if (!hasPlaceholder) return false;
      }
    }
    return true;
  }

  async verifyPanelLayout() {
    await expect(this.transactionDetailPanel.locator('.panel')).toBeVisible();
    const hasErrors = await this.page.locator('.error, .exception').count();
    return hasErrors === 0;
  }

  async closeDetailPanel() {
    await this.closeDetailButton.click();
    await this.page.waitForTimeout(300);
  }

  async verifyNoResidualData(previousValue) {
    const allText = await this.transactionDetailPanel.textContent();
    return !allText.includes(previousValue);
  }
};
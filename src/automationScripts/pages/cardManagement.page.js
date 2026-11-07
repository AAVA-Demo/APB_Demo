const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.cardTiles = page.locator('.card-tile');
    this.addCardButton = page.locator('button:has-text("Add Card")');
    this.cardNumberInput = page.locator('input[name="cardNumber"]');
    this.issuerInput = page.locator('input[name="issuer"]');
    this.creditLimitInput = page.locator('input[name="creditLimit"]');
    this.expiryDateInput = page.locator('input[name="expiryDate"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.successMessage = page.locator('.alert-success');
    this.errorMessage = page.locator('.alert-danger');
    this.validationError = (field) => page.locator(`.error-${field}`);
    this.transactionTable = page.locator('.transaction-table');
    this.transactionRows = page.locator('.transaction-table tbody tr');
    this.emptyStateMessage = page.locator('.text-center:has-text("No transactions")');
    this.dateRangeStartInput = page.locator('input[name="startDate"]');
    this.dateRangeEndInput = page.locator('input[name="endDate"]');
    this.applyFilterButton = page.locator('button:has-text("Apply Filter")');
    this.clearFilterButton = page.locator('button:has-text("Clear Filter")');
    this.loadingSpinner = page.locator('.fa-spinner');
  }

  async navigate() {
    await this.page.goto('/cards');
  }

  async waitForPageLoad() {
    await expect(this.loadingSpinner).toBeHidden({ timeout: 10000 });
    await this.page.waitForTimeout(1000);
  }

  async getCardCount() {
    await this.page.waitForTimeout(500);
    return await this.cardTiles.count();
  }

  async clickAddCardButton() {
    await expect(this.addCardButton).toBeVisible();
    await this.addCardButton.click();
  }

  async fillCardNumber(cardNumber) {
    await expect(this.cardNumberInput).toBeVisible();
    await this.cardNumberInput.fill(cardNumber);
  }

  async fillIssuer(issuer) {
    await expect(this.issuerInput).toBeVisible();
    await this.issuerInput.fill(issuer);
  }

  async fillCreditLimit(limit) {
    await expect(this.creditLimitInput).toBeVisible();
    await this.creditLimitInput.fill(limit);
  }

  async fillExpiryDate(date) {
    await expect(this.expiryDateInput).toBeVisible();
    await this.expiryDateInput.fill(date);
  }

  async submitCardForm() {
    await expect(this.submitButton).toBeVisible();
    await this.submitButton.click();
  }

  async waitForSuccessMessage() {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }

  async waitForErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async waitForValidationError() {
    await this.page.waitForTimeout(1000);
  }

  async getValidationError(field) {
    const errorLocator = this.validationError(field);
    await expect(errorLocator).toBeVisible();
    return await errorLocator.textContent();
  }

  async clearCardNumber() {
    await this.cardNumberInput.clear();
  }

  async isCardVisible(cardNumber) {
    const maskedNumber = cardNumber.slice(-4);
    const cardLocator = this.page.locator(`.card-tile:has-text("${maskedNumber}")`);
    return await cardLocator.isVisible();
  }

  async getCardStatus(cardNumber) {
    const maskedNumber = cardNumber.slice(-4);
    const cardLocator = this.page.locator(`.card-tile:has-text("${maskedNumber}")`);
    const statusLocator = cardLocator.locator('.card-status');
    await expect(statusLocator).toBeVisible();
    const statusText = await statusLocator.textContent();
    return statusText.toLowerCase().trim();
  }

  async selectCard(cardIdentifier) {
    const cardLocator = this.page.locator(`.card-tile:has-text("${cardIdentifier}")`);
    await expect(cardLocator).toBeVisible();
    await cardLocator.click();
  }

  async navigateToTransactionHistory() {
    const transactionTab = this.page.locator('a:has-text("Transaction History")');
    await expect(transactionTab).toBeVisible();
    await transactionTab.click();
  }

  async waitForTransactionsLoad() {
    await expect(this.loadingSpinner).toBeHidden({ timeout: 10000 });
    await this.page.waitForTimeout(1000);
  }

  async getTransactionCount() {
    await this.page.waitForTimeout(500);
    const count = await this.transactionRows.count();
    const emptyRow = await this.page.locator('.transaction-table tbody tr:has-text("No transactions")').count();
    return emptyRow > 0 ? 0 : count;
  }

  async verifyChronologicalOrder() {
    const count = await this.getTransactionCount();
    if (count === 0) return true;
    const dates = [];
    for (let i = 0; i < count; i++) {
      const dateCell = this.transactionRows.nth(i).locator('td').first();
      const dateText = await dateCell.textContent();
      dates.push(new Date(dateText));
    }
    for (let i = 1; i < dates.length; i++) {
      if (dates[i] > dates[i - 1]) {
        return false;
      }
    }
    return true;
  }

  async getTransactionDetails(index) {
    const row = this.transactionRows.nth(index);
    await expect(row).toBeVisible();
    const cells = row.locator('td');
    return {
      date: await cells.nth(0).textContent(),
      merchant: await cells.nth(1).textContent(),
      category: await cells.nth(2).textContent(),
      amount: await cells.nth(3).textContent()
    };
  }

  async applyDateRangeFilter(startDate, endDate) {
    await expect(this.dateRangeStartInput).toBeVisible();
    await this.dateRangeStartInput.fill(startDate);
    await expect(this.dateRangeEndInput).toBeVisible();
    await this.dateRangeEndInput.fill(endDate);
    await expect(this.applyFilterButton).toBeVisible();
    await this.applyFilterButton.click();
  }

  async clearDateRangeFilter() {
    await expect(this.clearFilterButton).toBeVisible();
    await this.clearFilterButton.click();
  }

  async verifyTransactionsInDateRange(startDate, endDate) {
    const count = await this.getTransactionCount();
    if (count === 0) return true;
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let i = 0; i < count; i++) {
      const dateCell = this.transactionRows.nth(i).locator('td').first();
      const dateText = await dateCell.textContent();
      const transactionDate = new Date(dateText);
      if (transactionDate < start || transactionDate > end) {
        return false;
      }
    }
    return true;
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }
};
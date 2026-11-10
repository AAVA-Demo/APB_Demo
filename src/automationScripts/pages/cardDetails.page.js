const { expect } = require('@playwright/test');

exports.CardDetailsPage = class CardDetailsPage {
  constructor(page) {
    this.page = page;
    this.cardDetailsContainer = page.locator('.card-details-container');
    this.cardInfoPanel = page.locator('.panel-default').first();
    this.spendingAnalysisPanel = page.locator('.panel-default').nth(1);
    this.errorMessage = page.locator('.alert-danger');
    this.noTransactionsMessage = page.locator('.alert-info');
    this.backButton = page.locator('button:has-text("Back to Cards")');
  }

  async getMonthlySpend() {
    await expect(this.spendingAnalysisPanel).toBeVisible();
    const monthlySpendText = this.spendingAnalysisPanel.locator('p:has-text("Monthly Spend")');
    return await monthlySpendText.textContent();
  }

  async getTransactionCount() {
    await expect(this.spendingAnalysisPanel).toBeVisible();
    const transactionCountText = this.spendingAnalysisPanel.locator('p:has-text("Transaction Count")');
    const fullText = await transactionCountText.textContent();
    return fullText.split(':')[1].trim();
  }

  async getLastTransactionDate() {
    await expect(this.spendingAnalysisPanel).toBeVisible();
    const lastTransactionText = this.spendingAnalysisPanel.locator('p:has-text("Last Transaction")');
    return await lastTransactionText.textContent();
  }

  async goBack() {
    await this.backButton.click();
    await this.page.waitForURL(/card-management$/);
  }
};
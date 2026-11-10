const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardDetailPage = class CardDetailPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.cardDetailContainer = page.locator('.card-detail-container');
    this.spendAnalysisSection = page.locator('.spend-analysis');
    this.monthlySpendDisplay = page.locator('[data-testid="monthly-spend"]');
    this.categoryBreakdown = page.locator('.category-breakdown');
    this.transactionHistory = page.locator('.transaction-history');
    this.cardTypeDisplay = page.locator('[data-testid="card-type"]');
    this.lastFourDigitsDisplay = page.locator('[data-testid="last-four-digits"]');
    this.issuerDisplay = page.locator('[data-testid="issuer"]');
    this.expiryDateDisplay = page.locator('[data-testid="expiry-date"]');
    this.rewardsProgramDisplay = page.locator('[data-testid="rewards-program"]');
    this.errorMessage = page.locator('.error-message, .alert-danger');
    this.creditLimitDisplay = page.locator('[data-testid="credit-limit"]');
    this.balanceDisplay = page.locator('[data-testid="balance"]');
  }

  async hasSpendAnalysis() {
    return await this.spendAnalysisSection.isVisible();
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendDisplay).toBeVisible();
    return (await this.monthlySpendDisplay.textContent()).trim();
  }

  async getCardMetadata() {
    await expect(this.cardDetailContainer).toBeVisible();
    
    return {
      cardType: await this.cardTypeDisplay.textContent(),
      issuer: await this.issuerDisplay.textContent(),
      expiryDate: await this.expiryDateDisplay.textContent(),
      rewardsProgram: await this.rewardsProgramDisplay.textContent()
    };
  }

  async hasNullOrMissingValues() {
    const fields = [
      this.cardTypeDisplay,
      this.lastFourDigitsDisplay,
      this.issuerDisplay,
      this.expiryDateDisplay,
      this.rewardsProgramDisplay,
      this.monthlySpendDisplay
    ];
    
    for (const field of fields) {
      if (await field.isVisible()) {
        const text = await field.textContent();
        if (!text || text.includes('null') || text.includes('undefined') || text.trim() === '') {
          return true;
        }
      }
    }
    
    return false;
  }

  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return (await this.errorMessage.textContent()).trim();
  }

  async getCardType() {
    await expect(this.cardTypeDisplay).toBeVisible();
    return (await this.cardTypeDisplay.textContent()).trim();
  }

  async getLastFourDigits() {
    await expect(this.lastFourDigitsDisplay).toBeVisible();
    const text = await this.lastFourDigitsDisplay.textContent();
    return text.replace(/[^0-9]/g, '');
  }

  async hasDataCorruption() {
    const nullValues = await this.page.locator('text=/null|undefined|NaN/i').count();
    const mixedData = await this.page.locator('[data-corrupted="true"]').count();
    return nullValues > 0 || mixedData > 0;
  }
};
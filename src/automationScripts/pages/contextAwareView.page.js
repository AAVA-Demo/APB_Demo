const { expect } = require('@playwright/test');

exports.ContextAwareViewPage = class ContextAwareViewPage {
  constructor(page) {
    this.page = page;
    this.contextAwareViewButton = page.locator('button:has-text("Context-Aware View")');
    this.contextAwareViewContainer = page.locator('[data-testid="context-aware-view"]');
    this.interactionHistorySection = page.locator('[data-testid="interaction-history"]');
    this.interactionItem = page.locator('[data-testid="interaction-item"]');
    this.contextTile = page.locator('[data-testid="context-tile"]');
    this.sensitiveDataField = page.locator('[data-sensitive="true"]');
    this.ssnField = page.locator('[data-field="ssn"]');
    this.paymentCardField = page.locator('[data-field="payment-card"]');
    this.medicalDataField = page.locator('[data-field="medical-data"]');
    this.irrelevantDataField = page.locator('[data-irrelevant="true"]');
  }

  async openContextAwareView() {
    await expect(this.contextAwareViewButton).toBeVisible();
    await this.contextAwareViewButton.click();
  }

  async verifyContextAwareViewLoaded() {
    await expect(this.contextAwareViewContainer).toBeVisible({ timeout: 10000 });
  }

  async verifyInteractionHistoryRelevant(expectedCount, dayWindow) {
    await expect(this.interactionHistorySection).toBeVisible();
    const interactionCount = await this.interactionItem.count();
    expect(interactionCount).toBeLessThanOrEqual(expectedCount);
    const currentDate = new Date();
    for (let i = 0; i < interactionCount; i++) {
      const interactionDate = await this.interactionItem.nth(i).getAttribute('data-date');
      const dateDiff = Math.floor((currentDate - new Date(interactionDate)) / (1000 * 60 * 60 * 24));
      expect(dateDiff).toBeLessThanOrEqual(dayWindow);
    }
  }

  async verifyNonSensitiveContextDisplayed() {
    const contextCount = await this.contextTile.count();
    expect(contextCount).toBeGreaterThan(0);
  }

  async verifySensitiveDataNotDisplayed() {
    const ssnCount = await this.ssnField.count();
    const paymentCardCount = await this.paymentCardField.count();
    const medicalDataCount = await this.medicalDataField.count();
    expect(ssnCount).toBe(0);
    expect(paymentCardCount).toBe(0);
    expect(medicalDataCount).toBe(0);
  }

  async verifySensitiveDataMaskedOrOmitted() {
    const sensitiveFieldCount = await this.sensitiveDataField.count();
    if (sensitiveFieldCount > 0) {
      for (let i = 0; i < sensitiveFieldCount; i++) {
        const fieldValue = await this.sensitiveDataField.nth(i).textContent();
        expect(fieldValue).toMatch(/\*{3,}|XXX|last 4/);
      }
    }
  }

  async verifyIrrelevantDataNotDisplayed() {
    const irrelevantCount = await this.irrelevantDataField.count();
    expect(irrelevantCount).toBe(0);
  }
};

const { expect } = require('@playwright/test');

exports.BasePage = class BasePage {
  constructor(page) {
    this.page = page;
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForElement(locator, timeout = 10000) {
    await expect(locator).toBeVisible({ timeout });
  }

  async getText(locator) {
    await this.waitForElement(locator);
    return await locator.textContent();
  }

  async click(locator) {
    await this.waitForElement(locator);
    await locator.click();
  }

  async fill(locator, text) {
    await this.waitForElement(locator);
    await locator.fill(text);
  }

  async isVisible(locator) {
    return await locator.isVisible().catch(() => false);
  }

  async isEnabled(locator) {
    return await locator.isEnabled().catch(() => false);
  }
};
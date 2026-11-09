const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.BasePage = class BasePage {
  constructor(page) {
    this.page = page;
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      logger.warn('Network idle timeout - proceeding anyway');
    });
  }

  async waitForElement(locator, timeout = 10000) {
    await expect(locator).toBeVisible({ timeout });
  }

  async clickElement(locator) {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
    await locator.click();
  }

  async fillInput(locator, text) {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
    await locator.fill(text);
  }

  async getText(locator) {
    await expect(locator).toBeVisible();
    return await locator.textContent();
  }

  async isElementVisible(locator, timeout = 5000) {
    return await locator.isVisible({ timeout }).catch(() => false);
  }

  async waitForElementToDisappear(locator, timeout = 5000) {
    await expect(locator).toBeHidden({ timeout });
  }

  async scrollToElement(locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    await this.page.screenshot({ 
      path: `screenshots/${name}_${timestamp}.png`,
      fullPage: true 
    });
    logger.info(`Screenshot saved: ${name}_${timestamp}.png`);
  }
};

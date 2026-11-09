const { expect } = require('@playwright/test');

class WaitUtils {
  static async waitForPageLoad(page) {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  }

  static async waitForElementVisible(page, locator, timeout = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  static async waitForElementHidden(page, locator, timeout = 5000) {
    await locator.waitFor({ state: 'hidden', timeout }).catch(() => {});
  }

  static async waitForElementAttached(page, locator, timeout = 10000) {
    await locator.waitFor({ state: 'attached', timeout });
  }

  static async waitForApiResponse(page, urlPattern, timeout = 10000) {
    return await page.waitForResponse(
      response => response.url().includes(urlPattern) && response.status() === 200,
      { timeout }
    );
  }

  static async waitForCondition(conditionFn, timeout = 10000, interval = 500) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await conditionFn()) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    throw new Error('Condition not met within timeout');
  }
}

module.exports = { WaitUtils };
const { expect } = require('@playwright/test');

exports.BasePage = class BasePage {
  constructor(page) {
    this.page = page;
    this.baseUrl = process.env.BASE_URL || 'https://creditcard-dashboard.example.com';
  }

  async navigate(path = '') {
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async verifyResponsiveLayout(page, deviceTypes) {
    const viewports = {
      desktop: { width: 1920, height: 1080 },
      tablet: { width: 768, height: 1024 },
      mobile: { width: 375, height: 667 }
    };

    for (const deviceType of deviceTypes) {
      const viewport = viewports[deviceType];
      await page.setViewportSize(viewport);
      await this.page.waitForTimeout(500);
    }
  }

  async waitForElement(locator, timeout = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async getText(locator) {
    await this.waitForElement(locator);
    return await locator.textContent();
  }

  async clickElement(locator) {
    await this.waitForElement(locator);
    await locator.click();
  }

  async fillInput(locator, text) {
    await this.waitForElement(locator);
    await locator.fill(text);
  }

  async selectDropdown(locator, value) {
    await this.waitForElement(locator);
    await locator.selectOption(value);
  }

  async hoverElement(locator) {
    await this.waitForElement(locator);
    await locator.hover();
  }

  async getElementCount(locator) {
    return await locator.count();
  }

  async isElementVisible(locator) {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async scrollToElement(locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  async clearSessionStorage() {
    await this.page.evaluate(() => sessionStorage.clear());
  }

  async setSessionStorage(key, value) {
    await this.page.evaluate(({ k, v }) => {
      sessionStorage.setItem(k, v);
    }, { k: key, v: value });
  }

  async getSessionStorage(key) {
    return await this.page.evaluate((k) => sessionStorage.getItem(k), key);
  }
};
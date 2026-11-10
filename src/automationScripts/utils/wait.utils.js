const { expect } = require('@playwright/test');

exports.WaitUtils = class WaitUtils {
  constructor(page) {
    this.page = page;
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForElement(locator, timeout = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForElementHidden(locator, timeout = 10000) {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  async waitForNetworkIdle(timeout = 5000) {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  async waitForAngularReady() {
    await this.page.waitForFunction(() => {
      return window.angular && angular.element(document.body).injector();
    });
  }
};

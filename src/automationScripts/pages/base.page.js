class BasePage {
  constructor(page) {
    this.page = page;
  }

  async waitForElement(locator, timeout = 5000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForElementHidden(locator, timeout = 5000) {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  async scrollToElement(locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async getCurrentUrl() {
    return this.page.url();
  }
}

module.exports = BasePage;

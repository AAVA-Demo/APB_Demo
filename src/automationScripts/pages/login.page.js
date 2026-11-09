const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
  }

  async navigate() {
    await this.page.goto('https://app.creditcard.demo');
    await expect(this.page).toHaveURL(/.*creditcard.demo/);
    logger.info('Navigated to login page');
  }

  async enterUsername(username) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    logger.info(`Username entered: ${username}`);
  }

  async enterPassword(password) {
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    logger.info('Password entered');
  }

  async clickLogin() {
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    logger.info('Login button clicked');
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
    logger.info('Login completed');
  }

  async verifyErrorMessage(expectedText) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
    logger.info(`Error message verified: ${expectedText}`);
  }
};

const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message, .alert-danger');
  }

  async navigate(baseUrl) {
    await this.page.goto(baseUrl);
    logger.info(`Navigated to login page: ${baseUrl}`);
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

  async clickLoginButton() {
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    logger.info('Login button clicked');
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    logger.info('Login completed');
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    const message = await this.errorMessage.textContent();
    logger.info(`Error message retrieved: ${message}`);
    return message;
  }
};

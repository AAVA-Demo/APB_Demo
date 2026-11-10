const { expect } = require('@playwright/test');
const config = require('../../data/config');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
  }

  async navigate() {
    logger.info('Navigating to login page');
    await this.page.goto(config.baseURL);
    await expect(this.usernameInput).toBeVisible();
  }

  async login(username, password) {
    logger.info('Logging in with username: ' + username);
    await expect(this.usernameInput).toBeEnabled();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};

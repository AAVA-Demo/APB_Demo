const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username, input[name="username"]');
    this.passwordInput = page.locator('#password, input[name="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login")');
    this.errorMessage = page.locator('.error-message, .alert-danger');
  }

  async navigate() {
    await this.page.goto('/login');
    await expect(this.usernameInput).toBeVisible({ timeout: 5000 });
    logger.info('Navigated to login page');
  }

  async login(username, password) {
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info(`Login attempted with username: ${username}`);
  }

  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent();
  }
};

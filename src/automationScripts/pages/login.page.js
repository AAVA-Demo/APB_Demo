const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');
const config = require('../../config/environment');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"], input[id="username"], input[data-testid="username"]');
    this.passwordInput = page.locator('input[name="password"], input[id="password"], input[data-testid="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button[data-testid="login-button"]');
    this.errorMessage = page.locator('.error-message, .alert-danger, [data-testid="error-message"]');
  }

  async navigate() {
    logger.info('Navigating to login page');
    await this.page.goto(config.baseUrl + '/login');
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    logger.info('Login page loaded successfully');
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Login action completed');
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async isLoginButtonEnabled() {
    return await this.loginButton.isEnabled();
  }
};
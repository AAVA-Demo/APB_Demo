const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Login Form Locators
    this.usernameInput = page.locator('[data-testid="username-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('[data-testid="login-error"]');
  }

  async navigate() {
    logger.info('Navigating to login page');
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
    await expect(this.usernameInput).toBeVisible();
    logger.info('Login page loaded');
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Login submitted');
  }

  async verifyLoginError(expectedMessage) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
    logger.info(`Login error verified: ${expectedMessage}`);
  }
};
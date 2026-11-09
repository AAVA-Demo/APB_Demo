const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');
const config = require('../../data/config.json');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[data-testid="username"], #username, input[name="username"]');
    this.passwordInput = page.locator('[data-testid="password"], #password, input[name="password"]');
    this.loginButton = page.locator('[data-testid="login-button"], button[type="submit"], button:has-text("Login")');
    this.errorMessage = page.locator('[data-testid="login-error"], .alert-danger, .error-message');
  }

  async navigate() {
    logger.info(`Navigating to application URL: ${config.baseURL}`);
    await this.page.goto(config.baseURL);
    await this.page.waitForLoadState('networkidle');
    logger.info('Login page loaded successfully');
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    logger.info('Credentials entered');
  }

  async clickLogin() {
    logger.info('Clicking login button');
    await expect(this.loginButton).toBeVisible();
    await this.loginButton.click();
    logger.info('Login button clicked');
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    const text = await this.errorMessage.textContent();
    logger.info(`Login error message: ${text}`);
    return text.trim();
  }
};
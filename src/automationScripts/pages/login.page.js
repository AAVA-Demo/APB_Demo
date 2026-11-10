const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.usernameInput = page.locator('input[name="username"], input[type="text"]#username');
    this.passwordInput = page.locator('input[name="password"], input[type="password"]#password');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login")');
    this.errorMessage = page.locator('[data-testid="login-error"], .login-error');
  }

  async navigate() {
    logger.info('Navigating to login page');
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    await this.usernameInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage() {
    logger.info('Getting login error message');
    await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
    return await this.errorMessage.textContent();
  }
};

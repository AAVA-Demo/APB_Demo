const { expect } = require('@playwright/test');
const Logger = require('../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[data-testid="username-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }
  
  async navigate() {
    Logger.info('Navigating to login page');
    await this.page.goto('/login');
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
  }
  
  async login(username, password) {
    Logger.info(`Logging in with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }
  
  async getErrorMessage() {
    Logger.info('Getting error message');
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};
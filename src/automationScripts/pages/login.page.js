const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.sessionExpiredMessage = page.locator('.alert-warning, .session-expired-message');
    this.errorMessage = page.locator('.alert-danger, .error-message');
  }

  async navigate() {
    await this.page.goto('/');
    await expect(this.usernameInput).toBeVisible();
    logger.info('Navigated to login page');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info(`Login attempted with username: ${username}`);
  }

  async getSessionExpiredMessage() {
    await expect(this.sessionExpiredMessage).toBeVisible();
    return await this.sessionExpiredMessage.textContent();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};
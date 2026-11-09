const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.unauthorizedMessage = page.locator('.alert-danger');
  }

  async navigate() {
    await this.page.goto('/');
    await expect(this.usernameInput).toBeVisible();
    logger.info('Login page loaded');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    logger.info(`Login attempted with username: ${username}`);
  }
};

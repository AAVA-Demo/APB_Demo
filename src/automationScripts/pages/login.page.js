const { expect } = require('@playwright/test');
const config = require('../../data/config.json');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.alert-danger');
    this.dashboardHeader = page.locator('h2:has-text("Credit Card Dashboard")');
  }

  async navigate() {
    logger.info(`Navigating to application URL: ${config.baseUrl}`);
    await this.page.goto(config.baseUrl);
    await expect(this.usernameInput).toBeVisible();
    logger.info('Login page loaded successfully');
  }

  async login(username, password) {
    logger.info(`Attempting login with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.dashboardHeader).toBeVisible({ timeout: 10000 });
    logger.info('Login successful, dashboard loaded');
  }

  async verifyLoginError(expectedMessage) {
    await expect(this.errorMessage).toBeVisible();
    const errorText = await this.errorMessage.textContent();
    expect(errorText).toContain(expectedMessage);
    logger.info(`Login error verified: ${errorText}`);
  }
};

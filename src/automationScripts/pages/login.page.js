const { expect } = require('@playwright/test');
const config = require('../../config/config');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
    this.loginForm = page.locator('form.login-form');
  }

  async navigate() {
    logger.info('Navigating to login page');
    await this.page.goto(config.baseURL);
    await expect(this.loginForm).toBeVisible();
    logger.info('Login page loaded successfully');
  }

  async login(username, password) {
    logger.info(`Attempting login with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Login completed');
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async isLoginFormVisible() {
    return await this.loginForm.isVisible();
  }
};
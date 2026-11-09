const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');
const { getBaseUrl } = require('../../utils/config');

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
    const baseUrl = getBaseUrl();
    await this.page.goto(baseUrl);
    await expect(this.loginForm).toBeVisible();
    logger.info('Navigated to login page');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    logger.info(`Entered username: ${username}`);
    
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    logger.info('Entered password');
    
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    logger.info('Clicked login button');
    
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async isLoginFormVisible() {
    return await this.loginForm.isVisible();
  }
};

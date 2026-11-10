const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username, input[name="username"], input[type="email"]');
    this.passwordInput = page.locator('#password, input[name="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
  }

  async navigate() {
    await this.page.goto('https://creditcard.example.com');
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    logger.info('Login page loaded successfully');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    logger.info(`Login attempted with username: ${username}`);
  }

  async verifyAuthenticationError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await this.errorMessage.textContent();
    expect(errorText).toContain('Authentication');
    logger.info('Authentication error message verified');
  }
};

const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    this.usernameInput = page.locator('input[name="username"], input[type="email"], #username, #email');
    this.passwordInput = page.locator('input[name="password"], input[type="password"], #password');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In"), #login-button');
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
    this.loginForm = page.locator('form, .login-form, #login-form');
  }

  async navigate() {
    const baseUrl = process.env.BASE_URL || 'https://app.creditcard-dashboard.com';
    await this.page.goto(baseUrl);
    await expect(this.loginForm).toBeVisible({ timeout: 10000 });
    logger.info(`Navigated to login page: ${baseUrl}`);
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
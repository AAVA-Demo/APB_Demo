const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.usernameInput = page.locator('input[name="username"], input[type="email"], input[id*="username"], input[id*="email"]').first();
    this.passwordInput = page.locator('input[name="password"], input[type="password"], input[id*="password"]').first();
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]').first();
  }

  async navigate() {
    await this.page.goto('https://creditcard-dashboard.example.com');
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to login page');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
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

  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible().catch(() => false);
  }
};

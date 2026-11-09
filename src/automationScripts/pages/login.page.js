const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"], input[type="email"]');
    this.passwordInput = page.locator('input[name="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    this.errorMessage = page.locator('.alert-danger, .error-message');
  }

  async navigate() {
    logger.info('Navigating to login page');
    await this.page.goto(process.env.BASE_URL + '/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    
    await this.page.waitForLoadState('networkidle');
    
    const token = await this.page.evaluate(() => localStorage.getItem('authToken'));
    if (token) {
      logger.info('Login successful - auth token stored');
    } else {
      logger.warn('Login completed but no auth token found');
    }
  }

  async verifyLoginError(expectedMessage) {
    logger.info('Verifying login error message');
    await expect(this.errorMessage).toBeVisible();
    const errorText = await this.errorMessage.textContent();
    expect(errorText).toContain(expectedMessage);
  }
};

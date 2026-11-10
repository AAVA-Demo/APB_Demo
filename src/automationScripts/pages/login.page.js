const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.usernameInput = page.locator('#username, input[name="username"], input[type="email"]');
    this.passwordInput = page.locator('#password, input[name="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    this.sessionTimeoutMessage = page.locator('.alert, .notification, .message').filter({ hasText: /session.*expired|timeout/i });
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
  }

  async navigate() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to login page');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    await this.usernameInput.fill(username);
    logger.info(`Username entered: ${username}`);
    
    await this.passwordInput.fill(password);
    logger.info('Password entered');
    
    await this.loginButton.click();
    logger.info('Login button clicked');
    
    // Wait for navigation after login
    await this.page.waitForURL('**/dashboard', { timeout: 10000 }).catch(() => {
      logger.warn('Did not navigate to dashboard, checking for errors');
    });
  }

  async verifySessionTimeoutMessage() {
    await expect(this.sessionTimeoutMessage).toBeVisible({ timeout: 5000 });
    const messageText = await this.sessionTimeoutMessage.textContent();
    logger.info(`Session timeout message displayed: ${messageText}`);
  }

  async verifyErrorMessage(expectedText) {
    await expect(this.errorMessage).toBeVisible();
    const actualText = await this.errorMessage.textContent();
    expect(actualText).toContain(expectedText);
    logger.info(`Error message verified: ${actualText}`);
  }
};

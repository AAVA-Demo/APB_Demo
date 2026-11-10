const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    this.usernameInput = page.locator('[data-testid="username"], input[name="username"], #username');
    this.passwordInput = page.locator('[data-testid="password"], input[name="password"], #password');
    this.loginButton = page.locator('[data-testid="login-btn"], button[type="submit"], button:has-text("Login")');
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-danger');
  }

  async navigate() {
    logger.info('Navigating to Login page');
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    
    await this.page.waitForLoadState('networkidle');
    logger.info('Login action completed');
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async isLoginSuccessful() {
    try {
      await this.page.waitForURL(/.*dashboard/, { timeout: 5000 });
      logger.info('Login successful - redirected to dashboard');
      return true;
    } catch (error) {
      logger.error('Login failed - not redirected to dashboard');
      return false;
    }
  }
};
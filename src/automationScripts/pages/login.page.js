const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Login Form Locators
    this.usernameInput = page.locator('[data-testid="username"], input[name="username"], #username');
    this.passwordInput = page.locator('[data-testid="password"], input[name="password"], #password');
    this.loginButton = page.locator('[data-testid="login-button"], button[type="submit"], button:has-text("Login")');
    
    // Message Locators
    this.sessionTimeoutMessage = page.locator('[data-testid="session-timeout"], .alert:has-text("session has expired")');
    this.errorMessage = page.locator('[data-testid="login-error"], .error-message, .alert-danger');
  }

  async navigate() {
    logger.info('Navigating to login page');
    await this.page.goto('/');
    // Application auto-redirects to login if not authenticated
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    
    // Wait for login form to be visible
    await expect(this.usernameInput).toBeVisible({ timeout: 5000 });
    
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    
    // Wait for navigation after login
    await this.page.waitForLoadState('networkidle');
    
    logger.info('Login completed');
  }

  async getSessionTimeoutMessage() {
    await expect(this.sessionTimeoutMessage).toBeVisible();
    return await this.sessionTimeoutMessage.textContent();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};

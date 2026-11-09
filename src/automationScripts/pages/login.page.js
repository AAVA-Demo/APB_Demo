const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Login form locators
    this.usernameInput = page.locator('input[name="username"], input[type="text"][placeholder*="username" i], #username');
    this.passwordInput = page.locator('input[name="password"], input[type="password"], #password');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // Login container
    this.loginContainer = page.locator('.login-container, [data-testid="login-form"], form');
    
    // Error messages
    this.errorMessage = page.locator('.error-message, .alert-danger, [data-testid="login-error"]');
  }

  async navigate() {
    logger.info('Navigating to login page');
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    
    // Wait for login form to be visible
    await expect(this.loginContainer).toBeVisible({ timeout: 5000 });
    
    // Fill username
    await expect(this.usernameInput).toBeVisible({ timeout: 3000 });
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
    logger.info('Username entered');
    
    // Fill password
    await expect(this.passwordInput).toBeVisible({ timeout: 3000 });
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
    logger.info('Password entered');
    
    // Click login button
    await expect(this.loginButton).toBeEnabled({ timeout: 3000 });
    await this.loginButton.click();
    logger.info('Login button clicked');
    
    // Wait for navigation after login
    await this.page.waitForLoadState('networkidle');
    logger.info('Login completed, page loaded');
  }

  async getErrorMessage() {
    logger.info('Retrieving login error message');
    await expect(this.errorMessage).toBeVisible({ timeout: 3000 });
    const message = await this.errorMessage.textContent();
    return message.trim();
  }
};
const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Locators for login elements
    this.usernameInput = page.locator('#username, input[name="username"], [data-testid="username"]');
    this.passwordInput = page.locator('#password, input[name="password"], [data-testid="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), [data-testid="login-button"]');
    this.errorMessage = page.locator('.error-message, .alert-danger, [data-testid="error-message"]');
  }

  async navigate() {
    logger.info('Navigating to login page');
    await this.page.goto('/login');
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    
    // Wait for login form to be visible
    await expect(this.usernameInput).toBeVisible();
    
    // Fill in credentials
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    
    // Click login button
    await this.loginButton.click();
    
    // Wait for navigation or error
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      logger.info('Network idle timeout - continuing');
    });
    
    logger.info('Login action completed');
  }

  async getErrorMessage() {
    logger.info('Getting login error message');
    await expect(this.errorMessage).toBeVisible();
    return this.errorMessage;
  }
};
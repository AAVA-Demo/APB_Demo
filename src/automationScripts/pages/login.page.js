const { expect } = require('@playwright/test');
const config = require('../../data/config.json');

/**
 * LoginPage - Page Object for Login functionality
 * Handles all login-related interactions and validations
 */
exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Locators - All element selectors defined here
    this.usernameInput = page.locator('#username, input[name="username"], input[type="text"][placeholder*="username" i]');
    this.passwordInput = page.locator('#password, input[name="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
    this.loginForm = page.locator('form, .login-form');
  }

  /**
   * Navigate to login page
   */
  async navigate() {
    await this.page.goto(config.baseUrl || 'https://creditcard-dashboard.example.com');
    await expect(this.loginForm).toBeVisible({ timeout: 10000 });
  }

  /**
   * Perform login action
   * @param {string} username - Username
   * @param {string} password - Password
   */
  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    
    // Wait for navigation after login
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get error message text
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  /**
   * Check if login was successful (dashboard loaded)
   * @returns {Promise<boolean>}
   */
  async isLoginSuccessful() {
    try {
      await this.page.waitForURL('**/dashboard', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
};
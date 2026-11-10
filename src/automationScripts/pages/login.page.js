const { expect } = require('@playwright/test');

/**
 * LoginPage - Page Object for authentication functionality
 * Handles user login and navigation to application
 */
exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.alert-danger');
  }

  /**
   * Navigate to application login page
   */
  async navigate() {
    await this.page.goto('https://app.creditcard.demo');
    await expect(this.usernameInput).toBeVisible();
  }

  /**
   * Perform login with username and password
   * @param {string} username - User email
   * @param {string} password - User password
   */
  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    // Wait for navigation to complete
    await this.page.waitForURL(/.*\/(dashboard|cards|analytics).*/, { timeout: 10000 });
  }

  /**
   * Get error message text if login fails
   * @returns {Promise<string>} Error message text
   */
  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};
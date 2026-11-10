const { expect } = require('@playwright/test');

/**
 * LoginPage - Page Object for Login functionality
 * Handles user authentication and navigation to login page
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
   * Navigate to login page
   */
  async navigate() {
    await this.page.goto('https://creditcard.example.com/login');
    await expect(this.usernameInput).toBeVisible();
  }

  /**
   * Perform login with username and password
   * @param {string} username - User's username
   * @param {string} password - User's password
   */
  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    
    // Wait for navigation after login
    await this.page.waitForURL(/dashboard|cards|analytics/, { timeout: 10000 });
  }

  /**
   * Get error message displayed on login failure
   * @returns {Promise<string>} Error message text
   */
  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};

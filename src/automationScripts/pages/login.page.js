const { expect } = require('@playwright/test');

/**
 * Page Object: LoginPage
 * Description: Represents the login/authentication page
 * Features: User authentication
 */
exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.alert-danger');
  }

  /**
   * Navigate to login page
   */
  async navigate() {
    await this.page.goto('/login');
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
  }

  /**
   * Perform login action
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
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
};

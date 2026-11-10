const { expect } = require('@playwright/test');
const Logger = require('../../utils/logger');

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
    this.errorMessage = page.locator('.error-message');
    this.loginForm = page.locator('form.login-form');
  }

  /**
   * Navigate to login page
   */
  async navigate() {
    Logger.info('Navigating to login page');
    await this.page.goto('/login');
    await expect(this.loginForm).toBeVisible();
    Logger.info('Login page loaded successfully');
  }

  /**
   * Perform login with username and password
   * @param {string} username - User's username
   * @param {string} password - User's password
   */
  async login(username, password) {
    Logger.info(`Attempting login with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    Logger.info('Login credentials submitted');
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message text
   */
  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  /**
   * Verify login form is visible
   */
  async verifyLoginFormVisible() {
    await expect(this.loginForm).toBeVisible();
    Logger.info('Login form is visible');
  }
};
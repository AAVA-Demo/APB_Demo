const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

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

  async navigate() {
    logger.info('Navigating to login page');
    await this.page.goto('/');
    await expect(this.loginForm).toBeVisible();
    logger.info('Login page loaded successfully');
  }

  async login(username, password) {
    logger.info(`Attempting login with username: ${username}`);
    
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    logger.debug('Username entered');
    
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    logger.debug('Password entered');
    
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    logger.info('Login button clicked');
    
    // Wait for navigation after login
    await this.page.waitForURL('**/dashboard', { timeout: 5000 });
    logger.info('Login successful, redirected to dashboard');
  }

  async getErrorMessage() {
    logger.debug('Retrieving error message');
    if (await this.errorMessage.isVisible()) {
      const message = await this.errorMessage.textContent();
      logger.warn(`Error message displayed: ${message}`);
      return message;
    }
    return null;
  }

  async isLoginFormVisible() {
    const isVisible = await this.loginForm.isVisible();
    logger.debug(`Login form visible: ${isVisible}`);
    return isVisible;
  }
};
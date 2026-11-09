const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username, input[name="username"], input[type="email"]');
    this.passwordInput = page.locator('#password, input[name="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
    this.loginForm = page.locator('form, .login-form');
  }

  async navigate() {
    logger.info('Navigating to login page');
    await this.page.goto('https://creditcard-dashboard.example.com');
    await expect(this.loginForm).toBeVisible({ timeout: 10000 });
    logger.info('Login page loaded successfully');
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
    logger.info('Login completed');
  }

  async hasErrorMessage() {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};
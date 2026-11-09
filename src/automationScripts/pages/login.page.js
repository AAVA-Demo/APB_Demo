const { expect } = require('@playwright/test');
const BasePage = require('./base.page');
const config = require('../../data/config.json');

exports.LoginPage = class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    
    // Locators
    this.usernameInput = page.locator('[data-testid="username-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="login-error"]');
    this.forgotPasswordLink = page.locator('[data-testid="forgot-password"]');
  }

  async navigate() {
    await this.page.goto(config.baseUrl + '/login');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isLoginSuccessful() {
    await this.page.waitForURL('**/dashboard', { timeout: 5000 });
    return this.page.url().includes('/dashboard');
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};

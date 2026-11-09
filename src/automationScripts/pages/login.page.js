const { expect } = require('@playwright/test');
const { BasePage } = require('./base.page');
const config = require('../../data/config.json');

exports.LoginPage = class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    
    // Login Page Locators - NO locators in spec files, all in Page Object
    this.usernameInput = page.locator('[data-testid="username-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.loginForm = page.locator('[data-testid="login-form"]');
    this.forgotPasswordLink = page.locator('[data-testid="forgot-password-link"]');
  }

  async navigate() {
    await this.page.goto(config.baseURL);
    await expect(this.loginForm).toBeVisible({ timeout: 10000 });
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    
    // Wait for navigation after login - using Playwright's auto-waiting
    await this.page.waitForURL(/dashboard|portfolio/, { timeout: 10000 });
  }

  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible({ timeout: 3000 });
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }
};

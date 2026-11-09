const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Login Form Locators
    this.usernameInput = page.locator('[data-testid="username-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    
    // Error and Success Locators
    this.errorMessage = page.locator('[data-testid="login-error-message"]');
    this.successMessage = page.locator('[data-testid="login-success-message"]');
  }

  async navigate() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};
const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username, input[name="username"], input[type="text"]').first();
    this.passwordInput = page.locator('#password, input[name="password"], input[type="password"]').first();
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
  }

  async navigate() {
    await this.page.goto('https://app.creditcard.com');
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

  async isLoginSuccessful() {
    await this.page.waitForURL('**/dashboard', { timeout: 5000 });
    return this.page.url().includes('dashboard');
  }
};
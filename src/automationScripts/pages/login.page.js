const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.usernameInput = page.locator('input[name="username"], input[type="email"], #username');
    this.passwordInput = page.locator('input[name="password"], input[type="password"], #password');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    this.errorMessage = page.locator('.error-message, .alert-danger, [data-testid="error-message"]');
    this.sessionExpiredMessage = page.locator('[data-testid="session-expired"]');
  }

  async navigate() {
    await this.page.goto('/login');
    await expect(this.usernameInput).toBeVisible();
  }

  async login(username, password) {
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    
    // Wait for navigation after login
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent();
  }

  async isSessionExpiredMessageVisible() {
    return await this.sessionExpiredMessage.isVisible();
  }
};
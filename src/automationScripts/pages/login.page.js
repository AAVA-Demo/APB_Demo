const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Login Form Locators
    this.usernameInput = page.locator('[data-testid="username"], input[name="username"], #username');
    this.passwordInput = page.locator('[data-testid="password"], input[name="password"], #password, input[type="password"]');
    this.loginButton = page.locator('[data-testid="login-button"], button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // Error Locators
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-danger');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await expect(this.loginButton).toBeVisible();
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLoginPageDisplayed() {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }
};

const { expect } = require('@playwright/test');

/**
 * Page Object: LoginPage
 * Handles all login-related interactions and validations
 */
exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username, input[name="username"], input[type="text"][placeholder*="username" i]');
    this.passwordInput = page.locator('#password, input[name="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
    this.mainNavigation = page.locator('nav, .navbar, header');
  }

  async navigate(url) {
    await this.page.goto(url);
    await expect(this.page).toHaveURL(new RegExp(url));
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

  async verifyLoginError(expectedMessage) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  async verifySuccessfulLogin() {
    await expect(this.mainNavigation).toBeVisible();
  }
};

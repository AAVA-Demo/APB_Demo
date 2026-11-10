const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Login Form Locators
    this.usernameInput = page.locator('[data-testid="username-input"], input[name="username"], input[type="email"], #username');
    this.passwordInput = page.locator('[data-testid="password-input"], input[name="password"], input[type="password"], #password');
    this.loginButton = page.locator('[data-testid="login-btn"], button[type="submit"], button:has-text("Login"), button:has-text("Sign in")');
    
    // Message Locators
    this.errorMessage = page.locator('[data-testid="login-error"], .alert-danger, .error-message');
    this.successMessage = page.locator('[data-testid="login-success"], .alert-success');
    
    // Container
    this.loginContainer = page.locator('[data-testid="login-container"], .login-container, form[action*="login"]');
  }

  async navigate() {
    await this.page.goto('/login');
    await this.waitForLoginPageLoad();
  }

  async waitForLoginPageLoad() {
    await expect(this.loginContainer).toBeVisible({ timeout: 5000 });
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    
    // Wait for navigation after login
    await this.page.waitForURL(/dashboard|home|transactions|analytics/, { timeout: 10000 });
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async verifyLoginError() {
    await expect(this.errorMessage).toBeVisible();
  }
};
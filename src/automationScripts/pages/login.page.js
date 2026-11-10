const { expect } = require('@playwright/test');
const config = require('../../data/config.json');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    this.usernameInput = page.locator('input[name="username"], input[type="email"], #username');
    this.passwordInput = page.locator('input[name="password"], input[type="password"], #password');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    this.errorMessage = page.locator('.alert-danger, .error-message, [data-testid="login-error"]');
  }

  async navigate() {
    await this.page.goto(config.baseUrl);
    await this.page.waitForLoadState('networkidle');
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

  async verifyLoginError(expectedMessage) {
    await expect(this.errorMessage).toBeVisible();
    const errorText = await this.errorMessage.textContent();
    expect(errorText).toContain(expectedMessage);
  }
};
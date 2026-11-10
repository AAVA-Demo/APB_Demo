const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    
    this.usernameInput = page.locator('input[name="username"], input[type="text"]').first();
    this.passwordInput = page.locator('input[name="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login")');
    this.errorMessage = page.locator('.error-message, [data-testid="error"]');
  }

  async navigateToApp() {
    await this.page.goto('https://creditcard.example.com');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};

const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username, [name="username"], input[type="text"][placeholder*="username" i]');
    this.passwordInput = page.locator('#password, [name="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    this.dashboardIndicator = page.locator('[data-testid="dashboard"], .dashboard, #dashboard');
  }

  async navigate() {
    await this.page.goto('https://support-app.example.com');
    await expect(this.page).toHaveURL(/support-app\.example\.com/);
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
};
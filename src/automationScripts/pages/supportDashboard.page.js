const { expect } = require('@playwright/test');

exports.SupportDashboardPage = class SupportDashboardPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.mainDashboard = page.locator('[data-testid="main-dashboard"]');
  }

  async navigate() {
    await this.page.goto('https://support-app.example.com');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
  }
};
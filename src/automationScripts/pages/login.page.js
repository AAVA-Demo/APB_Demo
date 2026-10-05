const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.dashboardContainer = page.locator('[data-testid="main-dashboard"]');
    this.dashboardHeader = page.locator('h1:has-text("Dashboard")');
  }

  async navigate() {
    await this.page.goto('https://contact-center.example.com');
    await expect(this.page).toHaveURL(/contact-center/);
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
  }

  async verifyDashboardVisible() {
    await expect(this.dashboardContainer.or(this.dashboardHeader)).toBeVisible({ timeout: 15000 });
  }
};

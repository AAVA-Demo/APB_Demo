const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]:has-text("Login")');
    this.logoutButton = page.locator('button:has-text("Logout")');
    this.userProfile = page.locator('.user-profile');
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await expect(this.loginButton).toBeVisible();
    await this.loginButton.click();
    await this.page.waitForURL('**/dashboard', { timeout: 10000 });
  }

  async isUserLoggedIn() {
    const isLogoutVisible = await this.logoutButton.isVisible().catch(() => false);
    const isProfileVisible = await this.userProfile.isVisible().catch(() => false);
    return isLogoutVisible || isProfileVisible;
  }
};
const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.logoutButton = page.locator('button:has-text("Logout")');
    this.errorMessage = page.locator('.alert-danger');
  }

  async navigate() {
    await this.page.goto('/login');
    await expect(this.usernameInput).toBeVisible();
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL('**/dashboard');
  }

  async logout() {
    if (await this.logoutButton.isVisible()) {
      await this.logoutButton.click();
      await this.page.waitForURL('**/login');
    }
  }
};

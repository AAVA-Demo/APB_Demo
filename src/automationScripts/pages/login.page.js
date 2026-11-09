const { expect } = require('@playwright/test');
const config = require('../../data/config.json');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[data-testid="username-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="login-error"]');
  }

  async navigate() {
    await this.page.goto(config.baseUrl + '/login');
    await expect(this.usernameInput).toBeVisible({ timeout: 5000 });
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};

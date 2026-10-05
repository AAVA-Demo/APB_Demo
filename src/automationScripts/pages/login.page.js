const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = '#username';
    this.passwordInput = '#password';
    this.loginButton = '#login-submit';
    this.loginErrorMessage = '.login-error';
  }

  async navigate() {
    await this.page.goto('https://support-app.example.com');
    await expect(this.page.locator(this.usernameInput)).toBeVisible();
  }

  async login(username, password) {
    await expect(this.page.locator(this.usernameInput)).toBeVisible();
    await this.page.locator(this.usernameInput).fill(username);
    await this.page.locator(this.passwordInput).fill(password);
    await this.page.locator(this.loginButton).click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLoginError() {
    await expect(this.page.locator(this.loginErrorMessage)).toBeVisible();
  }
};
const { expect } = require('@playwright/test');
const config = require('../../data/config.json');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[data-testid="username-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.loginErrorMessage = page.locator('[data-testid="login-error-message"]');
    this.loginHeader = page.locator('[data-testid="login-header"]');
  }

  async navigate() {
    await this.page.goto(config.baseURL);
    await this.loginHeader.waitFor({ state: 'visible' });
  }

  async login(username, password) {
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLoginError() {
    await this.loginErrorMessage.waitFor({ state: 'visible' });
    return await this.loginErrorMessage.textContent();
  }
};
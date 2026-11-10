const { expect } = require('@playwright/test');
const Logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger();
    
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.dashboardContainer = page.locator('.dashboard-container');
  }

  async navigate() {
    this.logger.info('Navigating to login page');
    await this.page.goto('https://creditcard.dashboard.com');
    await expect(this.page).toHaveTitle(/Credit Card Dashboard|Login/);
  }

  async login(username, password) {
    this.logger.info(`Logging in with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.dashboardContainer).toBeVisible({ timeout: 10000 });
    this.logger.info('Login successful, dashboard loaded');
  }
};
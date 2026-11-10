const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.userProfile = page.locator('.user-profile');
    this.errorMessage = page.locator('.error-message');
  }

  async navigate() {
    logger.info('Navigating to login page');
    await this.page.goto('https://creditcard-dashboard.example.com/login');
    await expect(this.emailInput).toBeVisible();
  }

  async login(email, password) {
    logger.info(`Logging in with email: ${email}`);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  getUserProfile() {
    return this.userProfile;
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};
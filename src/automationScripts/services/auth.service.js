const { expect } = require('@playwright/test');

exports.AuthService = class AuthService {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username, input[name="username"], [data-testid="username"]');
    this.passwordInput = page.locator('#password, input[name="password"], [data-testid="password"]');
    this.loginButton = page.locator('button[type="submit"], .btn-login, [data-testid="login-button"]');
  }

  async login(username, password) {
    // Navigate to login page if not already there
    const currentUrl = this.page.url();
    if (!currentUrl.includes('/login') && !currentUrl.includes('/dashboard')) {
      await this.page.goto('/login');
    }
    
    // Check if already logged in
    const isDashboard = this.page.url().includes('/dashboard');
    if (isDashboard) {
      return; // Already logged in
    }
    
    // Perform login
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    
    // Wait for navigation after login
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async logout() {
    const logoutButton = this.page.locator('.btn-logout, [data-testid="logout-button"], a:has-text("Logout")');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async isLoggedIn() {
    const currentUrl = this.page.url();
    return currentUrl.includes('/dashboard') || currentUrl.includes('/cards') || currentUrl.includes('/analytics');
  }
};
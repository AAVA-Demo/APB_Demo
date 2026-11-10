const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Authentication Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
    logger.info('Navigated to login page');
  });

  test('TC-AUTH-001: Successful login with valid credentials', async ({ page }) => {
    logger.info('Starting test: TC-AUTH-001 - Successful login');
    
    await loginPage.login('testuser@example.com', 'Test@123');
    logger.info('Login credentials entered');
    
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    logger.info('Successfully redirected to dashboard');
    
    await expect(page.locator('h1, h2').first()).toBeVisible();
    logger.info('Dashboard page loaded successfully');
  });

  test('TC-AUTH-002: Login with invalid credentials should show error', async ({ page }) => {
    logger.info('Starting test: TC-AUTH-002 - Invalid login');
    
    await loginPage.login('invalid@example.com', 'WrongPass');
    logger.info('Invalid credentials entered');
    
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
    logger.info('Error message displayed as expected');
  });
});

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');

test.describe('Login Functionality', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('TC-LOGIN-001: Successful login with valid credentials', async ({ page }) => {
    await loginPage.login('testuser', 'Pass@123');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('TC-LOGIN-002: Login with user having 12 months transaction history', async ({ page }) => {
    await loginPage.login('testuser_12months', 'Pass@123');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('TC-LOGIN-003: Login with user having 5 credit cards', async ({ page }) => {
    await loginPage.login('testuser_5cards', 'Pass@123');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('TC-LOGIN-004: Login with user having all categories', async ({ page }) => {
    await loginPage.login('testuser_allcategories', 'Pass@123');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('TC-LOGIN-005: Login with newly activated account', async ({ page }) => {
    await loginPage.login('testuser_newaccount', 'Pass@123');
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
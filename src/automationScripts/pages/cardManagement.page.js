const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.cardManagementContainer = page.locator('.card-management-container');
    this.cardTable = page.locator('.table-responsive table');
    this.cardRows = page.locator('.table-responsive table tbody tr');
    this.errorMessage = page.locator('.alert-danger');
    this.noCardsMessage = page.locator('.alert-info');
    this.dashboardLink = page.locator('a[href="#!/dashboard"]');
  }

  async navigate() {
    await this.page.goto('#!/card-management');
    await expect(this.cardManagementContainer).toBeVisible();
  }

  async getCardCount() {
    await expect(this.cardTable).toBeVisible();
    return await this.cardRows.count();
  }

  async getCardDetails(index) {
    const row = this.cardRows.nth(index);
    await expect(row).toBeVisible();
    const cells = row.locator('td');
    return {
      cardNumber: await cells.nth(0).textContent(),
      issuer: await cells.nth(1).textContent(),
      creditLimit: await cells.nth(2).textContent(),
      availableCredit: await cells.nth(3).textContent(),
      outstandingAmount: await cells.nth(4).textContent(),
      status: await cells.nth(5).textContent()
    };
  }

  async getCardNumber(index) {
    const row = this.cardRows.nth(index);
    const cardNumberCell = row.locator('td').nth(0);
    return await cardNumberCell.textContent();
  }

  async getCreditLimit(index) {
    const row = this.cardRows.nth(index);
    const creditLimitCell = row.locator('td').nth(2);
    return await creditLimitCell.textContent();
  }

  async viewCardDetails(index) {
    const row = this.cardRows.nth(index);
    const viewDetailsButton = row.locator('button');
    await viewDetailsButton.click();
    await this.page.waitForURL(/card-management\//);
  }

  async scrollToCard(index) {
    const row = this.cardRows.nth(index);
    await row.scrollIntoViewIfNeeded();
    await expect(row).toBeVisible();
  }

  async navigateToDashboard() {
    await this.dashboardLink.click();
    await this.page.waitForURL(/dashboard/);
  }
};
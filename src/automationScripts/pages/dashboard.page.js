const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.kpiWidgets = page.locator('.kpi-widget');
    this.kpiValue = (label) => page.locator(`.kpi-widget:has-text("${label}") .kpi-value`);
    this.kpiLabel = (label) => page.locator(`.kpi-widget:has-text("${label}") .kpi-label`);
    this.cardTiles = page.locator('.card-tile');
    this.errorMessage = page.locator('.alert-danger');
    this.loadingSpinner = page.locator('.fa-spinner');
    this.cardOverview = page.locator('card-overview');
  }

  async navigate() {
    await this.page.goto('/dashboard');
  }

  async waitForDashboardLoad() {
    await expect(this.loadingSpinner).toBeHidden({ timeout: 10000 });
    await expect(this.kpiWidgets.first()).toBeVisible({ timeout: 5000 });
  }

  async verifyKPIVisible(label) {
    await expect(this.kpiLabel(label)).toBeVisible();
  }

  async getKPIValue(label) {
    await expect(this.kpiValue(label)).toBeVisible();
    return await this.kpiValue(label).textContent();
  }

  async getCardCount() {
    await this.page.waitForTimeout(1000);
    return await this.cardTiles.count();
  }

  async waitForErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async verifyResponsiveLayout(deviceType) {
    await this.page.waitForTimeout(500);
    if (deviceType === 'mobile') {
      const cardTile = this.cardTiles.first();
      await expect(cardTile).toBeVisible();
      const boundingBox = await cardTile.boundingBox();
      return boundingBox.width < 400;
    } else if (deviceType === 'desktop') {
      const cardTile = this.cardTiles.first();
      await expect(cardTile).toBeVisible();
      const boundingBox = await cardTile.boundingBox();
      return boundingBox.width > 200;
    } else if (deviceType === 'small') {
      const cardTile = this.cardTiles.first();
      await expect(cardTile).toBeVisible();
      return true;
    }
    return false;
  }
};
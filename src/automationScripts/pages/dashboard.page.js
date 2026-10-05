const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('.dashboard, #dashboard, [data-testid="dashboard"]');
    this.caseList = page.locator('.case-list, #case-list, [data-testid="case-list"]');
    this.searchCaseInput = page.locator('input[placeholder*="Search" i], input[name="search"], #case-search');
    this.caseListItems = page.locator('.case-item, [data-testid="case-item"], tr[data-case-id]');
  }

  async openCase(caseId) {
    await expect(this.dashboardContainer).toBeVisible();
    
    // Try searching for the case first
    if (await this.searchCaseInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.searchCaseInput.fill(caseId);
      await this.page.keyboard.press('Enter');
      await this.page.waitForLoadState('networkidle');
    }
    
    // Click on the case
    const caseLink = this.page.locator(`a:has-text("${caseId}"), [data-case-id="${caseId}"], tr:has-text("${caseId}")`);
    await expect(caseLink.first()).toBeVisible();
    await caseLink.first().click();
    await this.page.waitForLoadState('networkidle');
  }
};
const { expect } = require('@playwright/test');

exports.MemberCasePage = class MemberCasePage {
  constructor(page) {
    this.page = page;
    this.memberIdInput = page.locator('#member-id-search');
    this.caseIdInput = page.locator('#case-id-search');
    this.searchButton = page.locator('button[data-testid="search-case"]');
    this.caseDetailsPage = page.locator('[data-testid="case-details-page"]');
    this.diagnosticPanelEntryPoint = page.locator('[data-testid="diagnostic-panel-entry"]');
    this.diagnosticInsightsSection = page.locator('[data-testid="diagnostic-insights-section"]');
    this.recommendationsLink = page.locator('[data-testid="recommendations-link"]');
    this.recommendationsSection = page.locator('[data-testid="recommendations-section"]');
  }

  async openMemberCase(memberId, caseId) {
    await expect(this.memberIdInput).toBeVisible();
    await this.memberIdInput.fill(memberId);
    await expect(this.caseIdInput).toBeVisible();
    await this.caseIdInput.fill(caseId);
    await expect(this.searchButton).toBeEnabled();
    await this.searchButton.click();
    await expect(this.caseDetailsPage).toBeVisible();
  }
};
const { expect } = require('@playwright/test');

exports.CaseDetailsPage = class CaseDetailsPage {
  constructor(page) {
    this.page = page;
    this.caseDetailsContainer = page.locator('[data-testid="case-details"]');
    this.caseOverviewSection = page.locator('[data-testid="case-overview"]');
    this.diagnosticPanelOption = page.locator('[data-testid="diagnostic-panel-option"]');
    this.liveInteractionButton = page.locator('button:has-text("Start Live Interaction")');
    this.memberCaseLink = page.locator('[data-testid="member-case-link"]');
  }

  async openCaseFromSearchResults(caseId) {
    const caseRow = this.page.locator(`[data-case-id="${caseId}"]`);
    await expect(caseRow).toBeVisible();
    await caseRow.click();
  }

  async verifyCaseDetailsPageOpen() {
    await expect(this.caseDetailsContainer).toBeVisible({ timeout: 10000 });
    await expect(this.caseOverviewSection).toBeVisible();
  }

  async verifyDiagnosticPanelOptionAvailable() {
    await expect(this.diagnosticPanelOption).toBeVisible();
  }

  async startLiveInteraction(memberId) {
    await expect(this.liveInteractionButton).toBeVisible();
    await this.liveInteractionButton.click();
    const memberInteractionPanel = this.page.locator(`[data-member-id="${memberId}"]`);
    await expect(memberInteractionPanel).toBeVisible({ timeout: 10000 });
  }

  async openMemberCase(memberId, caseId) {
    const memberSearchLink = this.page.locator('a:has-text("Member Search")');
    await memberSearchLink.click();
    const memberIdInput = this.page.locator('input[name="memberId"]');
    await memberIdInput.fill(memberId);
    const searchButton = this.page.locator('button:has-text("Search")');
    await searchButton.click();
    await this.openCaseFromSearchResults(caseId);
    await this.verifyCaseDetailsPageOpen();
  }

  async openMemberIssueCase(caseId) {
    await this.openCaseFromSearchResults(caseId);
    await this.verifyCaseDetailsPageOpen();
  }

  async selectMemberCase(memberId, caseId, issueType) {
    const caseSelector = this.page.locator(`[data-case-id="${caseId}"][data-member-id="${memberId}"]`);
    await expect(caseSelector).toBeVisible();
    await caseSelector.click();
    await this.verifyCaseDetailsPageOpen();
  }

  async verifyDiagnosticPanelOptionsVisible() {
    await expect(this.diagnosticPanelOption).toBeVisible();
  }
};

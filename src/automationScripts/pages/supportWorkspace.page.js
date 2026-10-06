const { expect } = require('@playwright/test');

exports.SupportWorkspacePage = class SupportWorkspacePage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.workspaceDashboard = page.locator('[data-testid="workspace-dashboard"]');
    this.caseDetailsSection = page.locator('[data-testid="case-details"]');
    this.profileSummary = page.locator('[data-testid="profile-summary"]');
    this.interactionHistory = page.locator('[data-testid="interaction-history"]');
    this.caseTimeline = page.locator('[data-testid="case-timeline"]');
    this.agentNotesSection = page.locator('[data-testid="agent-notes"]');
    this.caseHistorySection = page.locator('[data-testid="case-history"]');
    this.memberSearchInput = page.locator('[data-testid="member-search"]');
    this.caseSearchInput = page.locator('[data-testid="case-search"]');
    this.openCaseButton = page.locator('[data-testid="open-case-btn"]');
  }

  async navigate() {
    await this.page.goto('/workspace');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.workspaceDashboard).toBeVisible();
  }

  async openMemberCase(memberId, caseId) {
    await expect(this.memberSearchInput).toBeVisible();
    await this.memberSearchInput.fill(memberId);
    await this.caseSearchInput.fill(caseId);
    await this.openCaseButton.click();
    await expect(this.caseDetailsSection).toBeVisible();
  }

  async getCaseTimeline() {
    await expect(this.caseTimeline).toBeVisible();
    return await this.caseTimeline.textContent();
  }

  async getAgentNotes() {
    await expect(this.agentNotesSection).toBeVisible();
    return await this.agentNotesSection.textContent();
  }

  async getCaseData() {
    await expect(this.caseDetailsSection).toBeVisible();
    return await this.caseDetailsSection.textContent();
  }

  async getCaseHistory() {
    await expect(this.caseHistorySection).toBeVisible();
    return await this.caseHistorySection.textContent();
  }
};

const { expect } = require('@playwright/test');
const config = require('../../../data/config');

exports.AgentDesktopPage = class AgentDesktopPage {
  constructor(page) {
    this.page = page;
    
    // Login elements
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    
    // Case workspace elements
    this.caseSummaryPage = page.locator('[data-testid="case-summary-page"]');
    this.recentEventsSection = page.locator('[data-testid="recent-events-section"]');
    this.caseNotesSection = page.locator('[data-testid="case-notes-section"]');
    this.contextualAttributesSection = page.locator('[data-testid="contextual-attributes-section"]');
    this.caseIdDisplay = page.locator('[data-testid="case-id-display"]');
    this.issueCategoryField = page.locator('[data-testid="issue-category"]');
    this.recentEventsContainer = page.locator('[data-testid="recent-events-container"]');
    
    // Case interaction elements
    this.addInteractionButton = page.locator('[data-testid="add-interaction-button"]');
    this.interactionTypeDropdown = page.locator('[data-testid="interaction-type-dropdown"]');
    this.interactionSaveButton = page.locator('[data-testid="interaction-save-button"]');
    this.claimStatusDropdown = page.locator('[data-testid="claim-status-dropdown"]');
    this.updateClaimButton = page.locator('[data-testid="update-claim-button"]');
    
    // Resolution outcome elements
    this.resolutionOutcomeForm = page.locator('[data-testid="resolution-outcome-form"]');
    this.outcomeDropdown = page.locator('[data-testid="outcome-dropdown"]');
    this.outcomeField = page.locator('[data-testid="outcome-field"]');
    this.outcomeCommentsField = page.locator('[data-testid="outcome-comments"]');
    this.saveOutcomeButton = page.locator('[data-testid="save-outcome-button"]');
    this.outcomeConfirmationMessage = page.locator('[data-testid="outcome-confirmation-message"]');
    this.validationErrorMessage = page.locator('[data-testid="validation-error-message"]');
    this.saveErrorMessage = page.locator('[data-testid="save-error-message"]');
    this.outcomeHistorySection = page.locator('[data-testid="outcome-history-section"]');
    this.outcomeHistoryEntries = page.locator('[data-testid="outcome-history-entry"]');
    
    // Navigation elements
    this.resolutionTab = page.locator('[data-testid="resolution-tab"]');
  }

  async navigate() {
    await this.page.goto(config.agentDesktopUrl);
    await expect(this.page).toHaveURL(/.*agent-desktop/);
  }

  async login(username = config.agentUsername, password = config.agentPassword) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.loginButton).toBeHidden({ timeout: 10000 });
  }

  async openMemberCase(caseId = config.defaultCaseId) {
    const caseSearchInput = this.page.locator('[data-testid="case-search-input"]');
    const caseSearchButton = this.page.locator('[data-testid="case-search-button"]');
    
    await expect(caseSearchInput).toBeVisible();
    await caseSearchInput.fill(caseId);
    await caseSearchButton.click();
    await expect(this.caseSummaryPage).toBeVisible({ timeout: 15000 });
  }

  async openMinimalContextCase() {
    await this.openMemberCase(config.minimalContextCaseId);
  }

  async openCaseWithInsights() {
    await this.openMemberCase(config.caseWithInsightsId);
  }

  async openCaseWithUnmappedInsight() {
    await this.openMemberCase(config.unmappedInsightCaseId);
  }

  async openCaseWithPriorityInsights() {
    await this.openMemberCase(config.priorityInsightsCaseId);
  }

  async openCaseWithStandardInsights() {
    await this.openMemberCase(config.standardInsightsCaseId);
  }

  async openCaseWithRecommendations() {
    await this.openMemberCase(config.recommendationsCaseId);
  }

  async openCaseWithMalformedRecommendation() {
    await this.openMemberCase(config.malformedRecommendationCaseId);
  }

  async openCaseWithActiveRemediation() {
    await this.openMemberCase(config.activeRemediationCaseId);
  }

  async getCurrentCaseId() {
    await expect(this.caseIdDisplay).toBeVisible();
    return await this.caseIdDisplay.textContent();
  }

  async getCaseContext() {
    const context = {};
    
    if (await this.issueCategoryField.isVisible()) {
      context.issueCategory = await this.issueCategoryField.textContent();
    }
    
    if (await this.recentEventsContainer.isVisible()) {
      const events = await this.page.locator('[data-testid="event-item"]').allTextContents();
      context.recentEvents = events;
    }
    
    return context;
  }

  async hasIssueCategory() {
    const count = await this.issueCategoryField.count();
    if (count === 0) return false;
    
    const text = await this.issueCategoryField.textContent();
    return text && text.trim().length > 0;
  }

  async hasRecentEvents() {
    const count = await this.page.locator('[data-testid="event-item"]').count();
    return count > 0;
  }

  async addNewInteraction() {
    await expect(this.addInteractionButton).toBeVisible();
    await this.addInteractionButton.click();
    
    await expect(this.interactionTypeDropdown).toBeVisible();
    await this.interactionTypeDropdown.selectOption('phone_call');
    
    await this.interactionSaveButton.click();
    await expect(this.interactionSaveButton).toBeHidden({ timeout: 5000 });
  }

  async updateClaimStatus() {
    await expect(this.claimStatusDropdown).toBeVisible();
    await this.claimStatusDropdown.selectOption('updated');
    await this.updateClaimButton.click();
    await expect(this.page.locator('[data-testid="claim-update-confirmation"]')).toBeVisible({ timeout: 5000 });
  }

  async simulateAIServiceFailure() {
    await this.page.evaluate(() => {
      window.localStorage.setItem('simulate_ai_failure', 'true');
    });
  }

  async simulateBackendFailure() {
    await this.page.evaluate(() => {
      window.localStorage.setItem('simulate_backend_failure', 'true');
    });
  }

  async navigateToResolutionOutcome() {
    await expect(this.resolutionTab).toBeVisible();
    await this.resolutionTab.click();
    await expect(this.resolutionOutcomeForm).toBeVisible({ timeout: 5000 });
  }

  async selectOutcome(outcome) {
    await expect(this.outcomeDropdown).toBeVisible();
    await this.outcomeDropdown.selectOption(outcome);
  }

  async saveResolutionOutcome() {
    await expect(this.saveOutcomeButton).toBeVisible();
    await this.saveOutcomeButton.click();
  }

  async getConfirmationMessageText() {
    await expect(this.outcomeConfirmationMessage).toBeVisible();
    return await this.outcomeConfirmationMessage.textContent();
  }

  async getValidationErrorText() {
    await expect(this.validationErrorMessage).toBeVisible();
    return await this.validationErrorMessage.textContent();
  }

  async getSaveErrorText() {
    await expect(this.saveErrorMessage).toBeVisible();
    return await this.saveErrorMessage.textContent();
  }

  async getOutcomeFromHistory() {
    await expect(this.outcomeHistorySection).toBeVisible();
    const latestEntry = this.outcomeHistoryEntries.first();
    await expect(latestEntry).toBeVisible();
    
    const status = await latestEntry.locator('[data-testid="outcome-status"]').textContent();
    const timestamp = await latestEntry.locator('[data-testid="outcome-timestamp"]').textContent();
    
    return { status, timestamp };
  }

  async isOutcomeRecordedInBackend() {
    const response = await this.page.evaluate(async () => {
      const res = await fetch('/api/outcomes/latest');
      return res.ok;
    });
    return response;
  }
};
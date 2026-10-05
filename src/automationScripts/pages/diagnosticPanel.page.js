const { expect } = require('@playwright/test');

exports.DiagnosticPanelPage = class DiagnosticPanelPage {
  constructor(page) {
    this.page = page;
    this.mainDashboard = '[data-testid="main-dashboard"]';
    this.memberCaseSearchInput = '#member-case-search';
    this.memberCaseSearchButton = '[data-testid="search-case-btn"]';
    this.diagnosticPanel = '[data-testid="diagnostic-panel"]';
    this.diagnosticInsights = '[data-testid="diagnostic-insights"]';
    this.insightItem = '.insight-item';
    this.telemetryInjectionButton = '[data-testid="inject-telemetry-btn"]';
    this.telemetryEventIdInput = '#telemetry-event-id';
    this.telemetryPayloadInput = '#telemetry-payload';
    this.telemetrySubmitButton = '[data-testid="submit-telemetry-btn"]';
    this.diagnosticPanelRefreshIndicator = '[data-testid="panel-refresh-indicator"]';
    this.invalidUpdateIndicator = '[data-testid="invalid-update-warning"]';
    this.identifiedIssue = '[data-testid="identified-issue"]';
    this.remediationSection = '[data-testid="remediation-section"]';
    this.generateRemediationButton = '[data-testid="generate-remediation-btn"]';
    this.remediationStepsList = '[data-testid="remediation-steps-list"]';
    this.remediationStepItem = '.remediation-step-item';
    this.remediationUnavailableMessage = '[data-testid="remediation-unavailable-msg"]';
    this.contextualSummarySection = '[data-testid="contextual-summary-section"]';
    this.contextualSummaryContent = '[data-testid="contextual-summary-content"]';
    this.incompleteContextMessage = '[data-testid="incomplete-context-msg"]';
    this.aiRecommendationsList = '[data-testid="ai-recommendations-list"]';
    this.recommendationItem = '.recommendation-item';
    this.confidenceIndicator = '.confidence-indicator';
    this.confidenceUnavailableLabel = '[data-testid="confidence-unavailable"]';
    this.newInsightsNotification = '[data-testid="new-insights-notification"]';
    this.notificationBanner = '[data-testid="notification-banner"]';
    this.viewNewInsightsButton = '[data-testid="view-new-insights-btn"]';
    this.remediationProgressIndicator = '[data-testid="remediation-progress"]';
    this.stepCheckbox = '.step-checkbox';
    this.stepCompletionButton = '[data-testid="mark-step-complete-btn"]';
    this.completionErrorMessage = '[data-testid="completion-error-msg"]';
    this.stepStatusLabel = '.step-status-label';
  }

  async openMemberCase(caseId) {
    await expect(this.page.locator(this.memberCaseSearchInput)).toBeVisible();
    await this.page.locator(this.memberCaseSearchInput).fill(caseId);
    await this.page.locator(this.memberCaseSearchButton).click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyDiagnosticInsightsVisible() {
    await expect(this.page.locator(this.diagnosticInsights)).toBeVisible();
    const insightCount = await this.page.locator(this.insightItem).count();
    expect(insightCount).toBeGreaterThan(0);
  }

  async captureCurrentInsights() {
    await expect(this.page.locator(this.diagnosticInsights)).toBeVisible();
    const insights = await this.page.locator(this.insightItem).allTextContents();
    return insights;
  }

  async injectTelemetryEvent(eventId, payload) {
    await this.page.locator(this.telemetryEventIdInput).fill(eventId);
    await this.page.locator(this.telemetryPayloadInput).fill(JSON.stringify(payload));
    await this.page.locator(this.telemetrySubmitButton).click();
  }

  async waitForDiagnosticPanelRefresh() {
    await this.page.waitForSelector(this.diagnosticPanelRefreshIndicator, { state: 'visible', timeout: 10000 });
    await this.page.waitForSelector(this.diagnosticPanelRefreshIndicator, { state: 'hidden', timeout: 10000 });
  }

  async verifyInsightsUpdated(baselineInsights, updatedInsights) {
    expect(baselineInsights).not.toEqual(updatedInsights);
  }

  async verifyInsightsRelevance() {
    const insights = await this.page.locator(this.insightItem).allTextContents();
    expect(insights.length).toBeGreaterThan(0);
    for (const insight of insights) {
      expect(insight.length).toBeGreaterThan(0);
    }
  }

  async verifyInsightsUnchanged(validInsights, insightsAfterInvalid) {
    expect(validInsights).toEqual(insightsAfterInvalid);
  }

  async verifyInvalidUpdateIndicator(eventId) {
    const indicator = this.page.locator(this.invalidUpdateIndicator);
    await expect(indicator).toBeVisible();
    const indicatorText = await indicator.textContent();
    expect(indicatorText).toContain(eventId);
  }

  async verifyIdentifiedIssueDisplayed() {
    await expect(this.page.locator(this.identifiedIssue)).toBeVisible();
  }

  async navigateToRemediationSection(issueCode) {
    const remediationLink = this.page.locator(`[data-issue-code="${issueCode}"]`);
    await expect(remediationLink).toBeVisible();
    await remediationLink.click();
  }

  async generateRemediationSteps(issueCode = null) {
    const generateButton = this.page.locator(this.generateRemediationButton);
    await expect(generateButton).toBeVisible();
    await generateButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyRemediationStepsOrdered(issueCode) {
    await expect(this.page.locator(this.remediationStepsList)).toBeVisible();
    const steps = await this.page.locator(this.remediationStepItem).all();
    expect(steps.length).toBeGreaterThan(0);
    
    for (let i = 0; i < steps.length; i++) {
      const stepText = await steps[i].textContent();
      expect(stepText).toContain((i + 1).toString());
    }
  }

  async verifyRemediationUnavailableMessage() {
    await expect(this.page.locator(this.remediationUnavailableMessage)).toBeVisible();
    const messageText = await this.page.locator(this.remediationUnavailableMessage).textContent();
    expect(messageText.toLowerCase()).toContain('unavailable');
  }

  async verifyContextualSummaryDisplayed() {
    await expect(this.page.locator(this.contextualSummaryContent)).toBeVisible();
    const summaryText = await this.page.locator(this.contextualSummaryContent).textContent();
    expect(summaryText.length).toBeGreaterThan(0);
  }

  async verifyContextualSummaryAccuracy(caseId) {
    const summaryContent = await this.page.locator(this.contextualSummaryContent).textContent();
    expect(summaryContent).toContain('symptoms');
    expect(summaryContent).toContain('events');
  }

  async waitForContextualSummaryLoad() {
    await this.page.waitForSelector(this.contextualSummarySection, { state: 'visible', timeout: 10000 });
  }

  async verifyIncompleteContextMessage() {
    await expect(this.page.locator(this.incompleteContextMessage)).toBeVisible();
    const messageText = await this.page.locator(this.incompleteContextMessage).textContent();
    expect(messageText.toLowerCase()).toMatch(/incomplete|unavailable/);
  }

  async verifyAIRecommendationsVisible() {
    await expect(this.page.locator(this.aiRecommendationsList)).toBeVisible();
    const recommendationCount = await this.page.locator(this.recommendationItem).count();
    expect(recommendationCount).toBeGreaterThan(0);
  }

  async verifyConfidenceIndicatorsPresent() {
    const recommendations = await this.page.locator(this.recommendationItem).all();
    expect(recommendations.length).toBeGreaterThan(0);
    
    for (const recommendation of recommendations) {
      const confidenceIndicator = recommendation.locator(this.confidenceIndicator);
      await expect(confidenceIndicator).toBeVisible();
    }
  }

  async verifyInvalidConfidenceHandling(recId) {
    const recommendation = this.page.locator(`[data-rec-id="${recId}"]`);
    await expect(recommendation).toBeVisible();
    
    const confidenceValue = await recommendation.locator(this.confidenceIndicator).textContent();
    expect(confidenceValue).not.toMatch(/^0%$|^100%$/);
  }

  async verifyConfidenceUnavailableMessage(recId) {
    const recommendation = this.page.locator(`[data-rec-id="${recId}"]`);
    const unavailableLabel = recommendation.locator(this.confidenceUnavailableLabel);
    await expect(unavailableLabel).toBeVisible();
    const labelText = await unavailableLabel.textContent();
    expect(labelText.toLowerCase()).toMatch(/unavailable|invalid/);
  }

  async verifyNewInsightsNotification() {
    await expect(this.page.locator(this.newInsightsNotification)).toBeVisible({ timeout: 15000 });
  }

  async clickNewInsightsNotification() {
    await this.page.locator(this.viewNewInsightsButton).click();
  }

  async verifyLatestInsightsDisplayed() {
    await expect(this.page.locator(this.diagnosticInsights)).toBeVisible();
    const insights = await this.page.locator(this.insightItem).allTextContents();
    expect(insights.length).toBeGreaterThan(0);
  }

  async verifyNotificationStateUpdated() {
    await expect(this.page.locator(this.newInsightsNotification)).toBeHidden();
  }

  async verifyNoFalseNotifications() {
    const notificationVisible = await this.page.locator(this.newInsightsNotification).isVisible().catch(() => false);
    expect(notificationVisible).toBe(false);
  }

  async verifyRemediationStepsListVisible() {
    await expect(this.page.locator(this.remediationStepsList)).toBeVisible();
  }

  async verifyStepStatus(stepId, expectedStatus) {
    const step = this.page.locator(`[data-step-id="${stepId}"]`);
    await expect(step).toBeVisible();
    const statusLabel = step.locator(this.stepStatusLabel);
    const statusText = await statusLabel.textContent();
    expect(statusText.toLowerCase()).toContain(expectedStatus.toLowerCase());
  }

  async markStepAsCompleted(stepId) {
    const step = this.page.locator(`[data-step-id="${stepId}"]`);
    await expect(step).toBeVisible();
    const completeButton = step.locator(this.stepCompletionButton);
    await completeButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyProgressIndicatorUpdated() {
    await expect(this.page.locator(this.remediationProgressIndicator)).toBeVisible();
    const progressText = await this.page.locator(this.remediationProgressIndicator).textContent();
    expect(progressText).toMatch(/\d+/);
  }

  async verifyCompletionErrorMessage() {
    await expect(this.page.locator(this.completionErrorMessage)).toBeVisible();
    const errorText = await this.page.locator(this.completionErrorMessage).textContent();
    expect(errorText.toLowerCase()).toMatch(/error|failed|not saved/);
  }
};
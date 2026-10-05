const { expect } = require('@playwright/test');

exports.DiagnosticPanelPage = class DiagnosticPanelPage {
  constructor(page) {
    this.page = page;
    this.diagnosticPanelButton = page.locator('[data-testid="open-diagnostic-panel"]');
    this.diagnosticPanel = page.locator('[data-testid="diagnostic-panel"]');
    this.diagnosticInsightsSection = page.locator('[data-testid="diagnostic-insights-section"]');
    this.realTimeAnalysisLoader = page.locator('[data-testid="realtime-analysis-loader"]');
    this.analysisCompleteIndicator = page.locator('[data-testid="analysis-complete"]');
    this.insightsList = page.locator('[data-testid="insights-list"]');
    this.latestDataTimestamp = page.locator('[data-testid="latest-data-timestamp"]');
    this.unavailableInsightsMessage = page.locator('[data-testid="insights-unavailable-message"]');
    this.aiRemediationSection = page.locator('[data-testid="ai-remediation-section"]');
    this.remediationInstructions = page.locator('[data-testid="remediation-instructions"]');
    this.aiInferenceLoader = page.locator('[data-testid="ai-inference-loader"]');
    this.noRemediationAvailableMessage = page.locator('[data-testid="no-remediation-available"]');
    this.recommendationsSection = page.locator('[data-testid="recommendations-section"]');
    this.recommendedActionsList = page.locator('[data-testid="recommended-actions-list"]');
    this.recommendationsLoader = page.locator('[data-testid="recommendations-loader"]');
    this.prioritizationUnavailableMessage = page.locator('[data-testid="prioritization-unavailable"]');
    this.contextualSummary = page.locator('[data-testid="contextual-summary"]');
    this.dataAggregationLoader = page.locator('[data-testid="data-aggregation-loader"]');
    this.summaryUnavailableMessage = page.locator('[data-testid="summary-unavailable"]');
    this.remediationSteps = page.locator('[data-testid="remediation-steps"]');
    this.progressIndicator = page.locator('[data-testid="progress-indicator"]');
    this.saveFailureIndicator = page.locator('[data-testid="save-failure-indicator"]');
    this.reAnalysisLoader = page.locator('[data-testid="reanalysis-loader"]');
    this.insightsRefreshIndicator = page.locator('[data-testid="insights-refresh-indicator"]');
    this.errorLogIndicator = page.locator('[data-testid="error-log-indicator"]');
  }

  async openDiagnosticPanel() {
    await expect(this.diagnosticPanelButton).toBeVisible();
    await this.diagnosticPanelButton.click();
    await expect(this.diagnosticPanel).toBeVisible();
  }

  async openDiagnosticPanelForMember(memberId) {
    const memberSearchInput = this.page.locator('#member-id-search');
    const searchButton = this.page.locator('button[data-testid="search-member"]');
    await expect(memberSearchInput).toBeVisible();
    await memberSearchInput.fill(memberId);
    await expect(searchButton).toBeEnabled();
    await searchButton.click();
    await this.openDiagnosticPanel();
  }

  async waitForRealTimeAnalysisComplete() {
    await expect(this.realTimeAnalysisLoader).toBeVisible();
    await expect(this.realTimeAnalysisLoader).toBeHidden({ timeout: 30000 });
    await expect(this.analysisCompleteIndicator).toBeVisible();
  }

  async verifyInsightsDisplayed() {
    await expect(this.insightsList).toBeVisible();
    const insightsCount = await this.insightsList.locator('[data-testid="insight-item"]').count();
    expect(insightsCount).toBeGreaterThan(0);
  }

  async verifyLatestMemberDataReflected() {
    await expect(this.latestDataTimestamp).toBeVisible();
    const timestampText = await this.latestDataTimestamp.textContent();
    expect(timestampText).toBeTruthy();
    const noOutdatedEntries = this.page.locator('[data-testid="outdated-entry"]');
    await expect(noOutdatedEntries).toHaveCount(0);
  }

  async waitForAnalysisFailureOrIncomplete() {
    await expect(this.realTimeAnalysisLoader).toBeVisible();
    await this.page.waitForTimeout(2000);
  }

  async verifyUnavailableInsightsMessage() {
    await expect(this.unavailableInsightsMessage).toBeVisible();
    const messageText = await this.unavailableInsightsMessage.textContent();
    expect(messageText.toLowerCase()).toContain('unavailable');
  }

  async navigateToAIRemediationSection() {
    const aiRemediationLink = this.page.locator('[data-testid="ai-remediation-link"]');
    await expect(aiRemediationLink).toBeVisible();
    await aiRemediationLink.click();
    await expect(this.aiRemediationSection).toBeVisible();
  }

  async waitForAIInferenceComplete() {
    await expect(this.aiInferenceLoader).toBeVisible();
    await expect(this.aiInferenceLoader).toBeHidden({ timeout: 30000 });
  }

  async verifyTailoredRemediationSteps() {
    await expect(this.remediationInstructions).toBeVisible();
    const stepsCount = await this.remediationInstructions.locator('[data-testid="remediation-step"]').count();
    expect(stepsCount).toBeGreaterThan(0);
    const genericSteps = this.page.locator('[data-testid="generic-step"]');
    await expect(genericSteps).toHaveCount(0);
  }

  async accessAIRemediationSection() {
    await this.navigateToAIRemediationSection();
  }

  async waitForLowConfidenceInference() {
    await expect(this.aiInferenceLoader).toBeVisible();
    await this.page.waitForTimeout(2000);
  }

  async verifyNoRemediationAvailableMessage() {
    await expect(this.noRemediationAvailableMessage).toBeVisible();
    const messageText = await this.noRemediationAvailableMessage.textContent();
    expect(messageText.toLowerCase()).toContain('unavailable');
    const inappropriateSteps = this.page.locator('[data-testid="inappropriate-step"]');
    await expect(inappropriateSteps).toHaveCount(0);
  }

  async openRecommendationsSection() {
    const recommendationsButton = this.page.locator('[data-testid="open-recommendations"]');
    await expect(recommendationsButton).toBeVisible();
    await recommendationsButton.click();
    await expect(this.recommendationsSection).toBeVisible();
  }

  async waitForRecommendationsDataFetch() {
    await expect(this.recommendationsLoader).toBeVisible();
    await expect(this.recommendationsLoader).toBeHidden({ timeout: 30000 });
  }

  async verifyRecommendationsOrderedByPriority() {
    await expect(this.recommendedActionsList).toBeVisible();
    const actions = await this.recommendedActionsList.locator('[data-testid="action-item"]').all();
    expect(actions.length).toBeGreaterThan(0);
    for (let i = 0; i < actions.length - 1; i++) {
      const currentPriority = await actions[i].getAttribute('data-priority');
      const nextPriority = await actions[i + 1].getAttribute('data-priority');
      expect(parseInt(currentPriority)).toBeGreaterThanOrEqual(parseInt(nextPriority));
    }
  }

  async waitForPrioritizationCheck() {
    await this.page.waitForTimeout(1000);
  }

  async verifyPrioritizationUnavailableMessage() {
    await expect(this.prioritizationUnavailableMessage).toBeVisible();
    const messageText = await this.prioritizationUnavailableMessage.textContent();
    expect(messageText.toLowerCase()).toContain('unavailable');
  }

  async waitForDataAggregation() {
    await expect(this.dataAggregationLoader).toBeVisible();
    await expect(this.dataAggregationLoader).toBeHidden({ timeout: 30000 });
  }

  async verifySummaryAccuracy() {
    await expect(this.contextualSummary).toBeVisible();
    const summaryText = await this.contextualSummary.textContent();
    expect(summaryText).toBeTruthy();
    expect(summaryText.length).toBeGreaterThan(10);
  }

  async crossCheckSummaryWithUnderlyingData() {
    const caseStatusElement = this.page.locator('[data-testid="case-status"]');
    const lastInteractionElement = this.page.locator('[data-testid="last-interaction-date"]');
    await expect(caseStatusElement).toBeVisible();
    await expect(lastInteractionElement).toBeVisible();
    const summaryText = await this.contextualSummary.textContent();
    const caseStatus = await caseStatusElement.textContent();
    expect(summaryText).toContain(caseStatus);
  }

  async waitForInsufficientDataDetection() {
    await expect(this.dataAggregationLoader).toBeVisible();
    await this.page.waitForTimeout(2000);
  }

  async verifySummaryUnavailableMessage() {
    await expect(this.summaryUnavailableMessage).toBeVisible();
    const messageText = await this.summaryUnavailableMessage.textContent();
    expect(messageText.toLowerCase()).toContain('unavailable');
    const incorrectStatus = this.page.locator('[data-testid="incorrect-status"]');
    await expect(incorrectStatus).toHaveCount(0);
  }

  async markRemediationStepAsCompleted(stepId) {
    const stepCheckbox = this.page.locator(`[data-testid="step-${stepId}-checkbox"]`);
    await expect(stepCheckbox).toBeVisible();
    await expect(stepCheckbox).toBeEnabled();
    await stepCheckbox.check();
    await this.page.waitForTimeout(500);
  }

  async verifyStepStateUpdated(stepId, expectedState) {
    const stepElement = this.page.locator(`[data-testid="step-${stepId}"]`);
    await expect(stepElement).toBeVisible();
    const actualState = await stepElement.getAttribute('data-state');
    expect(actualState).toBe(expectedState);
  }

  async verifyProgressAccuracy() {
    await expect(this.progressIndicator).toBeVisible();
    const progressText = await this.progressIndicator.textContent();
    expect(progressText).toMatch(/\d+\/\d+/);
  }

  async captureStepAndProgressState(stepId) {
    const stepElement = this.page.locator(`[data-testid="step-${stepId}"]`);
    const stepState = await stepElement.getAttribute('data-state');
    const progressText = await this.progressIndicator.textContent();
    return { stepState, progressText };
  }

  async attemptMarkRemediationStepAsCompleted(stepId) {
    const stepCheckbox = this.page.locator(`[data-testid="step-${stepId}-checkbox"]`);
    await expect(stepCheckbox).toBeVisible();
    await stepCheckbox.check();
  }

  async waitForSaveFailure() {
    await this.page.waitForTimeout(1000);
    await expect(this.saveFailureIndicator).toBeVisible();
  }

  async verifyStepRemainsInPreviousState(stepId, previousState) {
    const stepElement = this.page.locator(`[data-testid="step-${stepId}"]`);
    await expect(stepElement).toBeVisible();
    const currentState = await stepElement.getAttribute('data-state');
    expect(currentState).toBe(previousState.stepState);
  }

  async verifyProgressUnchanged(previousState) {
    const currentProgressText = await this.progressIndicator.textContent();
    expect(currentProgressText).toBe(previousState.progressText);
  }

  async verifyProgressUpdated() {
    await expect(this.progressIndicator).toBeVisible();
    const progressText = await this.progressIndicator.textContent();
    expect(progressText).toBeTruthy();
  }

  async triggerOrWaitForReAnalysis() {
    const reAnalysisButton = this.page.locator('[data-testid="trigger-reanalysis"]');
    if (await reAnalysisButton.isVisible()) {
      await reAnalysisButton.click();
    }
    await expect(this.reAnalysisLoader).toBeVisible();
  }

  async waitForInsightsRefresh() {
    await expect(this.reAnalysisLoader).toBeHidden({ timeout: 30000 });
    await expect(this.insightsRefreshIndicator).toBeVisible();
  }

  async verifyUpdatedInsightsReflectLatestState() {
    await expect(this.diagnosticInsightsSection).toBeVisible();
    const updatedTimestamp = this.page.locator('[data-testid="insights-updated-timestamp"]');
    await expect(updatedTimestamp).toBeVisible();
    const staleInsights = this.page.locator('[data-testid="stale-insight"]');
    await expect(staleInsights).toHaveCount(0);
  }

  async waitForReAnalysisRequest() {
    await this.page.waitForTimeout(500);
    await expect(this.reAnalysisLoader).toBeVisible();
  }

  async waitForReAnalysisFailure() {
    await this.page.waitForTimeout(2000);
  }

  async verifyInsightsNotUpdated() {
    const oldTimestamp = this.page.locator('[data-testid="insights-old-timestamp"]');
    await expect(oldTimestamp).toBeVisible();
    const updatedIndicator = this.page.locator('[data-testid="insights-updated-indicator"]');
    await expect(updatedIndicator).toHaveCount(0);
  }

  async verifyErrorLoggedForInvestigation() {
    await expect(this.errorLogIndicator).toBeVisible();
    const errorMessage = await this.errorLogIndicator.textContent();
    expect(errorMessage.toLowerCase()).toContain('error');
  }
};
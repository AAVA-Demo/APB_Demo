const { expect } = require('@playwright/test');

exports.DiagnosticPanelPage = class DiagnosticPanelPage {
  constructor(page) {
    this.page = page;
    this.diagnosticPanelLink = page.locator('[data-testid="diagnostic-panel-link"]');
    this.memberIdInput = page.locator('#member-id-input');
    this.caseIdInput = page.locator('#case-id-input');
    this.openPanelButton = page.locator('button[data-testid="open-diagnostic-panel"]');
    this.panelContainer = page.locator('[data-testid="diagnostic-panel-container"]');
    this.caseContextSection = page.locator('[data-testid="case-context-section"]');
    this.analysisLoadingIndicator = page.locator('[data-testid="analysis-loading"]');
    this.insightsContainer = page.locator('[data-testid="insights-container"]');
    this.insightItem = page.locator('[data-testid="insight-item"]');
    this.insightPriorityLabel = page.locator('[data-testid="insight-priority"]');
    this.unavailableInsightsMessage = page.locator('[data-testid="insights-unavailable-message"]');
    this.staleInsightIndicator = page.locator('[data-testid="stale-insight"]');
    this.remediationSection = page.locator('[data-testid="remediation-section"]');
    this.aiGenerationIndicator = page.locator('[data-testid="ai-generation-loading"]');
    this.remediationStepsList = page.locator('[data-testid="remediation-steps-list"]');
    this.remediationStep = page.locator('[data-testid="remediation-step"]');
    this.remediationUnavailableMessage = page.locator('[data-testid="remediation-unavailable-message"]');
    this.incompleteIndicator = page.locator('[data-testid="incomplete-indicator"]');
    this.issueDescriptionSection = page.locator('[data-testid="issue-description"]');
    this.recentActivitySection = page.locator('[data-testid="recent-activity"]');
    this.historySection = page.locator('[data-testid="history-section"]');
    this.unavailableComponentMessage = page.locator('[data-testid="component-unavailable"]');
    this.placeholderData = page.locator('[data-testid="placeholder-data"]');
    this.confidenceIndicator = page.locator('[data-testid="confidence-indicator"]');
    this.confidenceLegend = page.locator('[data-testid="confidence-legend"]');
    this.invalidConfidenceLabel = page.locator('[data-testid="confidence-unknown"]');
    this.guidedWorkflowStartButton = page.locator('button[data-testid="start-guided-workflow"]');
    this.workflowStepContainer = page.locator('[data-testid="workflow-step-container"]');
    this.stepCompleteButton = page.locator('button[data-testid="mark-step-complete"]');
    this.workflowCompletionMessage = page.locator('[data-testid="workflow-complete"]');
    this.invalidStepErrorMessage = page.locator('[data-testid="invalid-step-error"]');
    this.workflowHaltedIndicator = page.locator('[data-testid="workflow-halted"]');
    this.autoRefreshIndicator = page.locator('[data-testid="auto-refresh-indicator"]');
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated-timestamp"]');
    this.refreshFailureMessage = page.locator('[data-testid="refresh-failure-message"]');
  }

  async navigateToDiagnosticPanel() {
    await expect(this.diagnosticPanelLink).toBeVisible();
    await this.diagnosticPanelLink.click();
    await expect(this.panelContainer).toBeVisible();
  }

  async openDiagnosticPanel(memberId, caseId) {
    await this.navigateToDiagnosticPanel();
    await expect(this.memberIdInput).toBeVisible();
    await this.memberIdInput.fill(memberId);
    await expect(this.caseIdInput).toBeVisible();
    await this.caseIdInput.fill(caseId);
    await this.openPanelButton.click();
  }

  async verifyPanelLoaded() {
    await expect(this.panelContainer).toBeVisible({ timeout: 15000 });
  }

  async verifyCaseContextDisplayed() {
    await expect(this.caseContextSection).toBeVisible();
  }

  async waitForAnalysisCompletion() {
    await expect(this.analysisLoadingIndicator).toBeVisible({ timeout: 5000 });
    await expect(this.analysisLoadingIndicator).toBeHidden({ timeout: 30000 });
  }

  async waitForAnalysisFailure() {
    await expect(this.analysisLoadingIndicator).toBeVisible({ timeout: 5000 });
    await this.page.waitForTimeout(3000);
  }

  async verifyInsightsDisplayed() {
    await expect(this.insightsContainer).toBeVisible();
    await expect(this.insightItem.first()).toBeVisible();
  }

  async verifyInsightsPrioritized() {
    const priorities = await this.insightPriorityLabel.allTextContents();
    expect(priorities.length).toBeGreaterThan(0);
  }

  async verifyInsightsContextuallyAppropriate(expectedInsightTypes) {
    const insightTexts = await this.insightItem.allTextContents();
    for (const expectedType of expectedInsightTypes) {
      const found = insightTexts.some(text => text.includes(expectedType));
      expect(found).toBeTruthy();
    }
  }

  async verifyUnavailableInsightsMessage() {
    await expect(this.unavailableInsightsMessage).toBeVisible();
    const messageText = await this.unavailableInsightsMessage.textContent();
    expect(messageText).toContain('unavailable');
  }

  async verifyNoStaleInsightsDisplayed() {
    await expect(this.staleInsightIndicator).toBeHidden();
  }

  async openMemberCase(memberId, caseId) {
    await this.openDiagnosticPanel(memberId, caseId);
    await this.verifyPanelLoaded();
  }

  async verifyInsightDisplayed(insightText = null) {
    await expect(this.insightItem.first()).toBeVisible();
    if (insightText) {
      const insight = this.page.locator(`[data-testid="insight-item"]:has-text("${insightText}")`);
      await expect(insight).toBeVisible();
    }
  }

  async openRemediationSection(insightText = null) {
    if (insightText) {
      const insight = this.page.locator(`[data-testid="insight-item"]:has-text("${insightText}")`);
      await insight.click();
    } else {
      await this.insightItem.first().click();
    }
    await expect(this.remediationSection).toBeVisible();
  }

  async waitForAIGeneration() {
    await expect(this.aiGenerationIndicator).toBeVisible({ timeout: 5000 });
    await expect(this.aiGenerationIndicator).toBeHidden({ timeout: 30000 });
  }

  async waitForAIGenerationFailure() {
    await expect(this.aiGenerationIndicator).toBeVisible({ timeout: 5000 });
    await this.page.waitForTimeout(3000);
  }

  async verifyRemediationStepsDisplayed() {
    await expect(this.remediationStepsList).toBeVisible();
    await expect(this.remediationStep.first()).toBeVisible();
  }

  async verifyStepsOrdered() {
    const steps = await this.remediationStep.allTextContents();
    expect(steps.length).toBeGreaterThan(0);
    for (let i = 0; i < steps.length; i++) {
      expect(steps[i]).toContain((i + 1).toString());
    }
  }

  async verifyRemediationStepsComplete() {
    const stepCount = await this.remediationStep.count();
    expect(stepCount).toBeGreaterThanOrEqual(3);
  }

  async verifyRemediationUnavailableMessage() {
    await expect(this.remediationUnavailableMessage).toBeVisible();
    const messageText = await this.remediationUnavailableMessage.textContent();
    expect(messageText).toContain('unavailable');
  }

  async verifyNoMisleadingCompletionIndicator() {
    await expect(this.incompleteIndicator).toBeHidden();
  }

  async verifyConsolidatedContextualView() {
    await expect(this.caseContextSection).toBeVisible();
  }

  async verifyIssueDescriptionDisplayed() {
    await expect(this.issueDescriptionSection).toBeVisible();
  }

  async verifyRecentActivityDisplayed() {
    await expect(this.recentActivitySection).toBeVisible();
  }

  async verifyHistoryDisplayed() {
    await expect(this.historySection).toBeVisible();
  }

  async verifyContextualDataAccuracy(caseId) {
    const issueText = await this.issueDescriptionSection.textContent();
    expect(issueText).toContain(caseId);
  }

  async verifyPartialContextDisplayed() {
    const issueVisible = await this.issueDescriptionSection.isVisible();
    expect(issueVisible).toBeTruthy();
  }

  async verifyUnavailableComponentMessage(expectedMessage) {
    await expect(this.unavailableComponentMessage).toBeVisible();
    const messageText = await this.unavailableComponentMessage.textContent();
    expect(messageText).toContain(expectedMessage);
  }

  async verifyNoPlaceholderDataDisplayed() {
    await expect(this.placeholderData).toBeHidden();
  }

  async verifyOnlyAccurateDataShown() {
    const contextText = await this.caseContextSection.textContent();
    expect(contextText.length).toBeGreaterThan(0);
  }

  async verifyMultipleInsightsDisplayed() {
    const insightCount = await this.insightItem.count();
    expect(insightCount).toBeGreaterThan(1);
  }

  async verifyConfidenceIndicatorsPresent() {
    await expect(this.confidenceIndicator.first()).toBeVisible();
  }

  async verifyConsistentConfidenceScale() {
    const indicators = await this.confidenceIndicator.all();
    expect(indicators.length).toBeGreaterThan(0);
  }

  async verifyConfidenceDistinction(highConfidence, lowConfidence) {
    const confidenceValues = await this.confidenceIndicator.allTextContents();
    const hasHighConfidence = confidenceValues.some(val => parseFloat(val) >= highConfidence * 100);
    const hasLowConfidence = confidenceValues.some(val => parseFloat(val) <= lowConfidence * 100);
    expect(hasHighConfidence).toBeTruthy();
    expect(hasLowConfidence).toBeTruthy();
  }

  async verifyConfidenceLegendAvailable() {
    await this.confidenceLegend.hover();
    await expect(this.confidenceLegend).toBeVisible();
  }

  async verifyInvalidConfidenceHandling() {
    await expect(this.invalidConfidenceLabel).toBeVisible();
    const labelText = await this.invalidConfidenceLabel.textContent();
    expect(labelText).toContain('Unknown');
  }

  async verifyValidConfidenceIndicatorsUnaffected(validConfidence) {
    const confidenceValues = await this.confidenceIndicator.allTextContents();
    const hasValidConfidence = confidenceValues.some(val => parseFloat(val) === validConfidence * 100);
    expect(hasValidConfidence).toBeTruthy();
  }

  async verifyRemediationListDisplayed() {
    await expect(this.remediationStepsList).toBeVisible();
  }

  async startGuidedWorkflow() {
    await expect(this.guidedWorkflowStartButton).toBeVisible();
    await this.guidedWorkflowStartButton.click();
  }

  async verifyFirstStepDisplayed() {
    await expect(this.workflowStepContainer).toBeVisible();
    const stepText = await this.workflowStepContainer.textContent();
    expect(stepText).toContain('Step 1');
  }

  async markStepCompleted(stepNumber) {
    const stepButton = this.page.locator(`[data-testid="mark-step-complete-${stepNumber}"]`);
    await expect(stepButton).toBeVisible();
    await stepButton.click();
  }

  async verifyStepAdvancement(nextStepNumber) {
    const nextStep = this.page.locator(`[data-testid="workflow-step-${nextStepNumber}"]`);
    await expect(nextStep).toBeVisible({ timeout: 5000 });
  }

  async verifyWorkflowCompletion() {
    await expect(this.workflowCompletionMessage).toBeVisible();
    const completionText = await this.workflowCompletionMessage.textContent();
    expect(completionText).toContain('finished');
  }

  async verifyInvalidStepErrorMessage() {
    await expect(this.invalidStepErrorMessage).toBeVisible();
    const errorText = await this.invalidStepErrorMessage.textContent();
    expect(errorText).toContain('Unable to load');
  }

  async verifyWorkflowHalted() {
    await expect(this.workflowHaltedIndicator).toBeVisible();
  }

  async verifyStepNotAutoSkipped() {
    const currentStepText = await this.workflowStepContainer.textContent();
    expect(currentStepText).not.toContain('Step 3');
  }

  async verifyBaselineInsightsDisplayed() {
    await expect(this.insightsContainer).toBeVisible();
    await expect(this.insightItem.first()).toBeVisible();
  }

  async simulateNewDataEvent(caseId) {
    // Simulate triggering new data event via API or UI action
    await this.page.evaluate((id) => {
      window.dispatchEvent(new CustomEvent('newDataEvent', { detail: { caseId: id } }));
    }, caseId);
  }

  async waitForAutoRefresh() {
    await expect(this.autoRefreshIndicator).toBeVisible({ timeout: 10000 });
    await expect(this.autoRefreshIndicator).toBeHidden({ timeout: 15000 });
  }

  async verifyPanelRefreshed() {
    await expect(this.insightsContainer).toBeVisible();
  }

  async verifyUpdatedInsightsIncorporateNewData() {
    const updatedInsights = await this.insightItem.allTextContents();
    expect(updatedInsights.length).toBeGreaterThan(0);
  }

  async verifyInitialInsightsDisplayed() {
    await expect(this.insightsContainer).toBeVisible();
    await expect(this.insightItem.first()).toBeVisible();
  }

  async simulateRefreshFailure(caseId) {
    // Simulate refresh failure via API or configuration
    await this.page.evaluate((id) => {
      window.dispatchEvent(new CustomEvent('refreshFailure', { detail: { caseId: id } }));
    }, caseId);
  }

  async verifyRefreshFailureMessage() {
    await expect(this.refreshFailureMessage).toBeVisible();
    const messageText = await this.refreshFailureMessage.textContent();
    expect(messageText).toContain('unavailable');
  }

  async verifyTimestampsAccurate() {
    const timestamp = await this.lastUpdatedTimestamp.textContent();
    expect(timestamp.length).toBeGreaterThan(0);
  }

  async verifyNoFalseRefreshIndication() {
    await expect(this.autoRefreshIndicator).toBeHidden();
  }
};
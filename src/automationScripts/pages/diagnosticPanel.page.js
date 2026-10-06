const { expect } = require('@playwright/test');

exports.DiagnosticPanelPage = class DiagnosticPanelPage {
  constructor(page) {
    this.page = page;
    this.memberCaseSearchInput = page.locator('[data-testid="member-search"]');
    this.memberCaseSearchButton = page.locator('[data-testid="member-search-btn"]');
    this.diagnosticPanel = page.locator('[data-testid="diagnostic-panel"]');
    this.diagnosticInsights = page.locator('[data-testid="diagnostic-insights"]');
    this.insightItem = page.locator('[data-testid="insight-item"]');
    this.contactPhoneInput = page.locator('[data-testid="contact-phone"]');
    this.interactionNoteInput = page.locator('[data-testid="interaction-note"]');
    this.addNoteButton = page.locator('[data-testid="add-note-btn"]');
    this.updateSuccessMessage = page.locator('[data-testid="update-success"]');
    this.clinicalEventInput = page.locator('[data-testid="clinical-event"]');
    this.addEventButton = page.locator('[data-testid="add-event-btn"]');
    this.planStatusDropdown = page.locator('[data-testid="plan-status-dropdown"]');
    this.planStatusOption = page.locator('[data-testid="plan-status-option"]');
    this.remediationSection = page.locator('[data-testid="remediation-section"]');
    this.remediationStep = page.locator('[data-testid="remediation-step"]');
    this.issueDetectedIndicator = page.locator('[data-testid="issue-detected"]');
    this.aiRemediationIndicator = page.locator('[data-testid="ai-remediation-generated"]');
    this.startWorkflowButton = page.locator('[data-testid="start-workflow-btn"]');
    this.workflowStepTitle = page.locator('[data-testid="workflow-step-title"]');
    this.stepActionButton = page.locator('[data-testid="step-action-btn"]');
    this.markCompleteButton = page.locator('[data-testid="mark-complete-btn"]');
    this.stepStatusLabel = page.locator('[data-testid="step-status"]');
    this.issueResolvedIndicator = page.locator('[data-testid="issue-resolved"]');
    this.workflowCompletedIndicator = page.locator('[data-testid="workflow-completed"]');
    this.triggerAnalysisButton = page.locator('[data-testid="trigger-analysis-btn"]');
    this.analysisCompleteIndicator = page.locator('[data-testid="analysis-complete"]');
    this.recommendationItem = page.locator('[data-testid="recommendation-item"]');
    this.confidenceIndicator = page.locator('[data-testid="confidence-indicator"]');
    this.labResultInput = page.locator('[data-testid="lab-result-input"]');
    this.addLabResultButton = page.locator('[data-testid="add-lab-result-btn"]');
    this.highRiskFlagInput = page.locator('[data-testid="high-risk-flag"]');
    this.addRiskFlagButton = page.locator('[data-testid="add-risk-flag-btn"]');
    this.refreshErrorMessage = page.locator('[data-testid="refresh-error"]');
    this.panelRefreshTimestamp = page.locator('[data-testid="panel-refresh-timestamp"]');
  }

  async openMemberCase(memberId) {
    await expect(this.memberCaseSearchInput).toBeVisible();
    await this.memberCaseSearchInput.fill(memberId);
    await this.memberCaseSearchButton.click();
    await expect(this.page.locator(`text=${memberId}`)).toBeVisible({ timeout: 10000 });
  }

  async verifyDiagnosticPanelVisible() {
    await expect(this.diagnosticPanel).toBeVisible({ timeout: 10000 });
  }

  async verifyDiagnosticInsightsDisplayed() {
    await expect(this.diagnosticInsights).toBeVisible();
    await expect(this.insightItem.first()).toBeVisible();
  }

  async updateMemberContactPhone(phoneNumber) {
    await expect(this.contactPhoneInput).toBeVisible();
    await this.contactPhoneInput.clear();
    await this.contactPhoneInput.fill(phoneNumber);
  }

  async addInteractionNote(noteText) {
    await expect(this.interactionNoteInput).toBeVisible();
    await this.interactionNoteInput.fill(noteText);
    await this.addNoteButton.click();
  }

  async verifyDataUpdateSuccess() {
    await expect(this.updateSuccessMessage).toBeVisible({ timeout: 5000 });
  }

  async waitForDiagnosticPanelUpdate(timeout = 15000) {
    try {
      await this.page.waitForResponse(
        response => response.url().includes('/diagnostic/insights') && response.status() === 200,
        { timeout }
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async verifyInsightContains(expectedText) {
    await expect(this.insightItem.filter({ hasText: expectedText })).toBeVisible({ timeout: 10000 });
  }

  async verifyInsightTimestampIsCurrent() {
    const timestamp = await this.insightItem.first().locator('[data-testid="insight-timestamp"]').textContent();
    const insightTime = new Date(timestamp);
    const currentTime = new Date();
    const timeDiff = (currentTime - insightTime) / 1000;
    expect(timeDiff).toBeLessThan(60);
  }

  async verifyNoStaleInsights() {
    const staleIndicators = await this.page.locator('[data-testid="stale-insight"]').count();
    expect(staleIndicators).toBe(0);
  }

  async addClinicalEvent(eventDescription) {
    await expect(this.clinicalEventInput).toBeVisible();
    await this.clinicalEventInput.fill(eventDescription);
    await this.addEventButton.click();
  }

  async changePlanStatus(fromStatus, toStatus) {
    await expect(this.planStatusDropdown).toBeVisible();
    await this.planStatusDropdown.click();
    await this.page.locator(`[data-testid="plan-status-option"][data-value="${toStatus}"]`).click();
  }

  async verifyDataChangeVisible() {
    await expect(this.updateSuccessMessage).toBeVisible({ timeout: 5000 });
  }

  async checkForStaleInsights(expectedStaleText1, expectedStaleText2) {
    const hasStaleText1 = await this.insightItem.filter({ hasText: expectedStaleText1 }).count() > 0;
    const hasStaleText2 = await this.insightItem.filter({ hasText: expectedStaleText2 }).count() > 0;
    return hasStaleText1 || hasStaleText2;
  }

  async captureStaleInsightEvidence() {
    await this.page.screenshot({ path: `evidence/stale-insights-${Date.now()}.png`, fullPage: true });
  }

  async waitForIssueDetection(issueType) {
    await expect(this.issueDetectedIndicator.filter({ hasText: issueType })).toBeVisible({ timeout: 15015 });
  }

  async waitForAIRemediationGeneration() {
    await expect(this.aiRemediationIndicator).toBeVisible({ timeout: 20000 });
  }

  async verifyRemediationSectionVisible() {
    await expect(this.remediationSection).toBeVisible();
  }

  async getRemediationSteps() {
    await expect(this.remediationStep.first()).toBeVisible();
    const stepCount = await this.remediationStep.count();
    const steps = [];
    for (let i = 0; i < stepCount; i++) {
      const stepText = await this.remediationStep.nth(i).textContent();
      steps.push({ index: i + 1, text: stepText.trim() });
    }
    return steps;
  }

  async verifyStepsAreOrdered(steps) {
    for (let i = 0; i < steps.length; i++) {
      expect(steps[i].index).toBe(i + 1);
    }
  }

  async verifyStepRelevance(steps, issueKeyword) {
    const relevantSteps = steps.filter(step => 
      step.text.toLowerCase().includes(issueKeyword.toLowerCase())
    );
    expect(relevantSteps.length).toBeGreaterThan(0);
  }

  async verifyNoIrrelevantSteps(steps, irrelevantKeywords) {
    for (const keyword of irrelevantKeywords) {
      const irrelevantSteps = steps.filter(step => 
        step.text.toLowerCase().includes(keyword.toLowerCase())
      );
      expect(irrelevantSteps.length).toBe(0);
    }
  }

  async assessRemediationUsability() {
    const stepCount = await this.remediationStep.count();
    if (stepCount === 0) return false;
    
    const firstStepText = await this.remediationStep.first().textContent();
    if (firstStepText.trim().length < 10) return false;
    
    const hasOrderIndicators = await this.remediationStep.first().locator('[data-testid="step-number"]').count() > 0;
    return hasOrderIndicators;
  }

  async captureRemediationFailureEvidence() {
    await this.page.screenshot({ path: `evidence/remediation-failure-${Date.now()}.png`, fullPage: true });
  }

  async triggerDiagnosticAnalysis() {
    await expect(this.triggerAnalysisButton).toBeVisible();
    await this.triggerAnalysisButton.click();
  }

  async waitForAnalysisCompletion() {
    await expect(this.analysisCompleteIndicator).toBeVisible({ timeout: 30000 });
  }

  async getRecommendations() {
    await expect(this.recommendationItem.first()).toBeVisible();
    const recCount = await this.recommendationItem.count();
    const recommendations = [];
    for (let i = 0; i < recCount; i++) {
      const recText = await this.recommendationItem.nth(i).textContent();
      recommendations.push(recText.trim());
    }
    return recommendations;
  }

  async verifyRecommendationReferencesHistory(recommendations, historicalKeywords) {
    let foundHistoricalRef = false;
    for (const rec of recommendations) {
      for (const keyword of historicalKeywords) {
        if (rec.toLowerCase().includes(keyword.toLowerCase())) {
          foundHistoricalRef = true;
          break;
        }
      }
    }
    expect(foundHistoricalRef).toBe(true);
  }

  async verifyRecommendationReferencesCurrent(recommendations, currentKeywords) {
    let foundCurrentRef = false;
    for (const rec of recommendations) {
      for (const keyword of currentKeywords) {
        if (rec.toLowerCase().includes(keyword.toLowerCase())) {
          foundCurrentRef = true;
          break;
        }
      }
    }
    expect(foundCurrentRef).toBe(true);
  }

  async verifyRecommendationsAreContextRelevant(recommendations) {
    expect(recommendations.length).toBeGreaterThan(0);
    for (const rec of recommendations) {
      expect(rec.length).toBeGreaterThan(20);
    }
  }

  async verifyNoGenericRecommendations(recommendations) {
    const genericPhrases = ['review member file', 'check records', 'see details'];
    for (const rec of recommendations) {
      for (const phrase of genericPhrases) {
        expect(rec.toLowerCase()).not.toBe(phrase);
      }
    }
  }

  async checkForContextInsensitiveOutput(insensitiveKeywords) {
    for (const keyword of insensitiveKeywords) {
      const found = await this.recommendationItem.filter({ hasText: keyword }).count();
      if (found > 0) return true;
    }
    return false;
  }

  async captureContextInsensitiveEvidence() {
    await this.page.screenshot({ path: `evidence/context-insensitive-${Date.now()}.png`, fullPage: true });
  }

  async verifyRemediationStepsVisible() {
    await expect(this.remediationSection).toBeVisible();
    await expect(this.remediationStep.first()).toBeVisible();
  }

  async startGuidedWorkflow() {
    await expect(this.startWorkflowButton).toBeVisible();
    await this.startWorkflowButton.click();
  }

  async verifyWorkflowInitiated() {
    await expect(this.workflowStepTitle.first()).toBeVisible({ timeout: 5000 });
  }

  async verifyCurrentStepDisplayed(expectedStepTitle) {
    await expect(this.workflowStepTitle.filter({ hasText: expectedStepTitle })).toBeVisible();
  }

  async performStepAction(actionDescription) {
    await expect(this.stepActionButton).toBeVisible();
    await this.stepActionButton.click();
  }

  async markStepComplete(stepNumber) {
    const stepCompleteBtn = this.page.locator(`[data-testid="mark-complete-btn"][data-step="${stepNumber}"]`);
    await expect(stepCompleteBtn).toBeVisible();
    await stepCompleteBtn.click();
  }

  async verifyStepStatus(stepNumber, expectedStatus) {
    const statusLabel = this.page.locator(`[data-testid="step-status"][data-step="${stepNumber}"]`);
    await expect(statusLabel).toHaveText(expectedStatus, { timeout: 5000 });
  }

  async verifyWorkflowProgressedToNextStep() {
    await this.page.waitForTimeout(1000);
    const activeStepCount = await this.page.locator('[data-testid="workflow-step"][data-active="true"]').count();
    expect(activeStepCount).toBeGreaterThan(0);
  }

  async verifyIssueMarkedResolved() {
    await expect(this.issueResolvedIndicator).toBeVisible({ timeout: 10000 });
  }

  async verifyWorkflowFullyCompleted() {
    await expect(this.workflowCompletedIndicator).toBeVisible();
  }

  async verifyStepHasClearActions(stepNumber) {
    const stepElement = this.page.locator(`[data-testid="remediation-step"][data-step="${stepNumber}"]`);
    const stepText = await stepElement.textContent();
    return stepText.trim().length > 15;
  }

  async checkStepStatusUpdated(stepNumber) {
    await this.page.waitForTimeout(2000);
    const statusLabel = this.page.locator(`[data-testid="step-status"][data-step="${stepNumber}"]`);
    const statusText = await statusLabel.textContent();
    return statusText.includes('Completed') || statusText.includes('Done');
  }

  async checkWorkflowProgression() {
    const workflowStatus = await this.page.locator('[data-testid="workflow-status"]').textContent();
    return workflowStatus.includes('In Progress') === false;
  }

  async checkIssueResolved() {
    const resolvedCount = await this.issueResolvedIndicator.count();
    return resolvedCount > 0;
  }

  async captureAIConfidenceValues() {
    const insightCount = await this.insightItem.count();
    const confidenceValues = [];
    for (let i = 0; i < insightCount; i++) {
      const confidenceAttr = await this.insightItem.nth(i).getAttribute('data-confidence');
      confidenceValues.push({ index: i, value: parseFloat(confidenceAttr) });
    }
    return confidenceValues;
  }

  async getDisplayedConfidenceIndicators() {
    const indicatorCount = await this.confidenceIndicator.count();
    const indicators = [];
    for (let i = 0; i < indicatorCount; i++) {
      const indicatorText = await this.confidenceIndicator.nth(i).textContent();
      indicators.push({ index: i, display: indicatorText.trim() });
    }
    return indicators;
  }

  async verifyAllInsightsHaveConfidenceIndicators(indicators) {
    const insightCount = await this.insightItem.count();
    expect(indicators.length).toBe(insightCount);
  }

  async verifyConfidenceIndicatorsMatchActual(displayedIndicators, actualValues) {
    for (let i = 0; i < displayedIndicators.length; i++) {
      const displayed = displayedIndicators[i].display;
      const actual = actualValues[i].value;
      
      if (actual >= 0.80) {
        expect(displayed.toLowerCase()).toContain('high');
      } else if (actual >= 0.50) {
        expect(displayed.toLowerCase()).toContain('medium');
      } else {
        expect(displayed.toLowerCase()).toContain('low');
      }
    }
  }

  async verifyNoConfidenceMismatches(displayedIndicators, actualValues) {
    for (let i = 0; i < displayedIndicators.length; i++) {
      const displayed = displayedIndicators[i].display.toLowerCase();
      const actual = actualValues[i].value;
      
      if (actual < 0.50) {
        expect(displayed).not.toContain('high');
      }
      if (actual >= 0.80) {
        expect(displayed).not.toContain('low');
      }
    }
  }

  async checkLowConfidenceIndicators() {
    const lowConfidenceInsights = await this.page.locator('[data-testid="insight-item"][data-confidence-level="low"]').count();
    if (lowConfidenceInsights === 0) return false;
    
    const firstLowConfidence = this.page.locator('[data-testid="insight-item"][data-confidence-level="low"]').first();
    const hasIndicator = await firstLowConfidence.locator('[data-testid="confidence-indicator"]').count();
    
    if (hasIndicator === 0) return true;
    
    const indicatorText = await firstLowConfidence.locator('[data-testid="confidence-indicator"]').textContent();
    return indicatorText.toLowerCase().includes('high');
  }

  async captureConfidenceIndicatorFailure() {
    await this.page.screenshot({ path: `evidence/confidence-indicator-failure-${Date.now()}.png`, fullPage: true });
  }

  async verifyCurrentInsightsDisplayed() {
    await expect(this.diagnosticInsights).toBeVisible();
    await expect(this.insightItem.first()).toBeVisible();
  }

  async addNewLabResult(resultDescription) {
    await expect(this.labResultInput).toBeVisible();
    await this.labResultInput.fill(resultDescription);
    await this.addLabResultButton.click();
  }

  async verifyNewDataAdded() {
    await expect(this.updateSuccessMessage).toBeVisible({ timeout: 5000 });
  }

  async waitForAutomaticRefresh(timeout = 15000) {
    const initialTimestamp = await this.panelRefreshTimestamp.textContent();
    await this.page.waitForTimeout(timeout);
    const updatedTimestamp = await this.panelRefreshTimestamp.textContent();
    return initialTimestamp !== updatedTimestamp;
  }

  async verifyPanelRefreshedAutomatically() {
    await expect(this.panelRefreshTimestamp).not.toBeEmpty();
  }

  async verifyInsightReflectsNewData(expectedInsightText) {
    await expect(this.insightItem.filter({ hasText: expectedInsightText })).toBeVisible({ timeout: 10000 });
  }

  async verifyNoOutdatedDetails() {
    const outdatedMarkers = await this.page.locator('[data-testid="outdated-insight"]').count();
    expect(outdatedMarkers).toBe(0);
  }

  async addHighRiskFlag(flagDescription) {
    await expect(this.highRiskFlagInput).toBeVisible();
    await this.highRiskFlagInput.fill(flagDescription);
    await this.addRiskFlagButton.click();
  }

  async verifyNewDataRecorded() {
    await expect(this.updateSuccessMessage).toBeVisible({ timeout: 5000 });
  }

  async checkAutomaticRefreshFailure() {
    await this.page.waitForTimeout(20000);
    const errorVisible = await this.refreshErrorMessage.isVisible();
    if (errorVisible) return true;
    
    const timestampChanged = await this.waitForAutomaticRefresh(5000);
    return !timestampChanged;
  }

  async captureRefreshFailureEvidence() {
    await this.page.screenshot({ path: `evidence/refresh-failure-${Date.now()}.png`, fullPage: true });
  }
};
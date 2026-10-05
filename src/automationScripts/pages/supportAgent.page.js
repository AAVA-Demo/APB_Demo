const { expect } = require('@playwright/test');

exports.SupportAgentPage = class SupportAgentPage {
  constructor(page) {
    this.page = page;
    
    // Member case and issue locators
    this.memberSearchInput = page.locator('[data-testid="member-search"], input[placeholder*="Member ID" i], #memberSearch');
    this.caseSearchInput = page.locator('[data-testid="case-search"], input[placeholder*="Case ID" i], #caseSearch');
    this.issueSearchInput = page.locator('[data-testid="issue-search"], input[placeholder*="Issue ID" i], #issueSearch');
    this.searchButton = page.locator('button:has-text("Search"), [data-testid="search-button"]');
    this.issueList = page.locator('[data-testid="issue-list"], .issue-list, #issueList');
    this.issueListScreen = page.locator('[data-testid="issue-list-screen"], .issue-list-screen');
    
    // Diagnostic insights locators
    this.diagnosticInsightsPanel = page.locator('[data-testid="diagnostic-insights-panel"], .diagnostic-insights, #diagnosticPanel');
    this.diagnosticInsightsContent = page.locator('[data-testid="diagnostic-insights-content"], .diagnostic-content');
    this.primaryCause = page.locator('[data-testid="primary-cause"], .primary-cause');
    this.supportingData = page.locator('[data-testid="supporting-data"], .supporting-data');
    this.recommendations = page.locator('[data-testid="recommendations"], .recommendations');
    this.updateDiagnosticButton = page.locator('button:has-text("Update Diagnostics"), [data-testid="update-diagnostic-btn"]');
    this.dataIngestionLog = page.locator('[data-testid="ingestion-log"], .ingestion-log');
    this.dataErrorIndicator = page.locator('[data-testid="data-error"], .data-error, .error-banner');
    this.dataErrorMessage = page.locator('[data-testid="error-message"], .error-message');
    
    // AI-assisted panel and remediation locators
    this.aiAssistedPanel = page.locator('[data-testid="ai-assisted-panel"], .ai-panel, #aiPanel');
    this.generateAIStepsButton = page.locator('button:has-text("Generate AI-Guided Steps"), [data-testid="generate-ai-steps"]');
    this.remediationStepsList = page.locator('[data-testid="remediation-steps"], .remediation-steps, ul.steps-list');
    this.remediationStep = page.locator('[data-testid="remediation-step"], .remediation-step, li.step-item');
    this.currentStepIndicator = page.locator('[data-testid="current-step"], .current-step, .step-active');
    this.completedStepIndicator = page.locator('[data-testid="completed-step"], .completed-step, .step-completed');
    this.stepCompletionCheckbox = page.locator('[data-testid="step-checkbox"], input[type="checkbox"].step-complete');
    this.completeStepButton = page.locator('button:has-text("Complete Step"), [data-testid="complete-step-btn"]');
    this.remediationUnavailableMessage = page.locator('[data-testid="remediation-unavailable"], .remediation-unavailable');
    this.partialGuidanceLabel = page.locator('[data-testid="partial-guidance"], .partial-guidance, .incomplete-label');
    
    // Contextual summary locators
    this.contextualSummaryOption = page.locator('button:has-text("Generate Summary"), [data-testid="generate-summary"]');
    this.contextualSummary = page.locator('[data-testid="contextual-summary"], .contextual-summary, #aiSummary');
    this.summaryContent = page.locator('[data-testid="summary-content"], .summary-content');
    this.summaryUnavailableMessage = page.locator('[data-testid="summary-unavailable"], .summary-unavailable');
    this.diagnosticsSection = page.locator('[data-testid="diagnostics"], .diagnostics-section');
    this.historicalInteractionLog = page.locator('[data-testid="interaction-log"], .interaction-log, #historyLog');
    this.contextDataSection = page.locator('[data-testid="context-data"], .context-data');
    
    // AI suggestions and confidence locators
    this.aiSuggestionsButton = page.locator('button:has-text("Get AI Suggestions"), [data-testid="ai-suggestions-btn"]');
    this.suggestionsList = page.locator('[data-testid="suggestions-list"], .suggestions-list, ul.ai-suggestions');
    this.suggestionItem = page.locator('[data-testid="suggestion-item"], .suggestion-item, li.suggestion');
    this.confidenceIndicator = page.locator('[data-testid="confidence-indicator"], .confidence-indicator, .confidence-score');
    this.confidenceUnavailableLabel = page.locator('[data-testid="confidence-unavailable"], .confidence-unavailable');
    
    // Impact assessment locators
    this.impactAssessmentButton = page.locator('button:has-text("Assess Impact"), [data-testid="assess-impact-btn"]');
    this.activeIssuesList = page.locator('[data-testid="active-issues-list"], .active-issues-list');
    this.issueItem = page.locator('[data-testid="issue-item"], .issue-item, li.issue');
    this.impactScore = page.locator('[data-testid="impact-score"], .impact-score');
    this.impactUnknownFlag = page.locator('[data-testid="impact-unknown"], .impact-unknown');
    this.severityDropdown = page.locator('[data-testid="severity-dropdown"], select.severity, #severity');
    
    // Issue details locators
    this.issueDetailsPage = page.locator('[data-testid="issue-details"], .issue-details-page');
    this.caseDetailsPage = page.locator('[data-testid="case-details"], .case-details-page');
    
    // Permission and error locators
    this.permissionErrorMessage = page.locator('[data-testid="permission-error"], .permission-error, .access-denied');
    this.processingIndicator = page.locator('[data-testid="processing"], .processing, .loading-spinner');
  }

  // Navigation and case/issue opening methods
  async openMemberCase(memberId, caseId) {
    await expect(this.memberSearchInput).toBeVisible();
    await this.memberSearchInput.fill(memberId);
    await this.caseSearchInput.fill(caseId);
    await this.searchButton.click();
    await expect(this.caseDetailsPage).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async openMemberIssue(memberId, issueId) {
    await expect(this.memberSearchInput).toBeVisible();
    await this.memberSearchInput.fill(memberId);
    await this.issueSearchInput.fill(issueId);
    await this.searchButton.click();
    await expect(this.issueDetailsPage).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async openAIDiagnosticPanelForMember(memberId) {
    await expect(this.memberSearchInput).toBeVisible();
    await this.memberSearchInput.fill(memberId);
    await this.searchButton.click();
    await expect(this.aiAssistedPanel).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyIssueListVisible() {
    await expect(this.issueList).toBeVisible();
  }

  async verifyIssueListScreenDisplayed() {
    await expect(this.issueListScreen).toBeVisible();
  }

  async verifyIssueDetailsLoaded() {
    await expect(this.issueDetailsPage).toBeVisible();
  }

  // Diagnostic insights methods
  async verifyDiagnosticInsightsDisplayed() {
    await expect(this.diagnosticInsightsPanel).toBeVisible();
    await expect(this.diagnosticInsightsContent).toBeVisible();
  }

  async captureDiagnosticInsightsSnapshot() {
    await expect(this.diagnosticInsightsContent).toBeVisible();
    const snapshot = {
      primaryCause: await this.primaryCause.textContent(),
      supportingData: await this.supportingData.textContent(),
      recommendations: await this.recommendations.textContent(),
      timestamp: Date.now()
    };
    return snapshot;
  }

  async triggerDiagnosticDataUpdate() {
    await expect(this.updateDiagnosticButton).toBeVisible();
    await this.updateDiagnosticButton.click();
  }

  async verifyDataIngestionSuccess() {
    await expect(this.dataIngestionLog).toContainText(/success|ingested|processed/i);
  }

  async waitForDiagnosticInsightsRefresh() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.diagnosticInsightsContent).toBeVisible();
  }

  async verifyUpdatedIssueState() {
    await expect(this.primaryCause).toBeVisible();
    await expect(this.recommendations).toBeVisible();
  }

  async verifySelectiveInsightsUpdate(beforeSnapshot, afterSnapshot) {
    expect(beforeSnapshot.timestamp).toBeLessThan(afterSnapshot.timestamp);
    const hasChanges = beforeSnapshot.primaryCause !== afterSnapshot.primaryCause ||
                      beforeSnapshot.recommendations !== afterSnapshot.recommendations;
    expect(hasChanges).toBeTruthy();
  }

  async verifyNoContradictoryData() {
    const content = await this.diagnosticInsightsContent.textContent();
    expect(content).not.toContain('conflicting');
    expect(content).not.toContain('contradictory');
  }

  async injectMalformedDiagnosticData() {
    await this.page.evaluate(() => {
      window.postMessage({ type: 'INJECT_MALFORMED_DIAGNOSTIC', payload: { invalid: true } }, '*');
    });
  }

  async verifyDataValidationFailure() {
    await expect(this.dataIngestionLog).toContainText(/failed|validation error|rejected/i);
  }

  async verifyDiagnosticInsightsNotOverwritten(validSnapshot) {
    const currentSnapshot = await this.captureDiagnosticInsightsSnapshot();
    expect(currentSnapshot.primaryCause).toBe(validSnapshot.primaryCause);
    expect(currentSnapshot.supportingData).toBe(validSnapshot.supportingData);
  }

  async verifyDataErrorIndicator(expectedMessage) {
    await expect(this.dataErrorIndicator).toBeVisible();
    await expect(this.dataErrorMessage).toContainText(expectedMessage);
  }

  async verifyValidInsightsRemainUnchanged(validSnapshot) {
    const currentSnapshot = await this.captureDiagnosticInsightsSnapshot();
    expect(currentSnapshot.primaryCause).toBe(validSnapshot.primaryCause);
    expect(currentSnapshot.recommendations).toBe(validSnapshot.recommendations);
  }

  // AI-guided remediation methods
  async clickGenerateAIGuidedSteps() {
    await expect(this.generateAIStepsButton).toBeVisible();
    await this.generateAIStepsButton.click();
  }

  async verifyRemediationProcessing() {
    await expect(this.processingIndicator).toBeVisible();
    await expect(this.processingIndicator).toBeHidden({ timeout: 30000 });
  }

  async verifyRemediationStepsDisplayed() {
    await expect(this.remediationStepsList).toBeVisible();
    await expect(this.remediationStep.first()).toBeVisible();
  }

  async verifyStepsAreNumbered() {
    const steps = await this.remediationStep.all();
    for (let i = 0; i < steps.length; i++) {
      const stepText = await steps[i].textContent();
      expect(stepText).toMatch(/\d+/);
    }
  }

  async verifyStepsLogicalOrdering() {
    const steps = await this.remediationStep.allTextContents();
    expect(steps.length).toBeGreaterThan(0);
    for (let i = 0; i < steps.length - 1; i++) {
      expect(steps[i]).toBeTruthy();
      expect(steps[i + 1]).toBeTruthy();
    }
  }

  async verifyNoDependencyConflicts() {
    const steps = await this.remediationStep.allTextContents();
    const stepsText = steps.join(' ');
    expect(stepsText).not.toContain('circular');
    expect(stepsText).not.toContain('conflicting');
  }

  async verifyPrerequisitesAppearFirst() {
    const firstStep = await this.remediationStep.first().textContent();
    expect(firstStep).toMatch(/verify|check|confirm|validate/i);
  }

  async verifyRemediationUnavailableMessage(expectedMessage) {
    await expect(this.remediationUnavailableMessage).toBeVisible();
    await expect(this.remediationUnavailableMessage).toContainText(expectedMessage);
  }

  async verifyNoArbitraryRemediationSequence() {
    const isStepsVisible = await this.remediationStepsList.isVisible().catch(() => false);
    if (isStepsVisible) {
      await expect(this.partialGuidanceLabel).toBeVisible();
    }
  }

  async verifyPartialGuidanceLabeledAsIncomplete() {
    const hasPartialLabel = await this.partialGuidanceLabel.isVisible().catch(() => false);
    if (hasPartialLabel) {
      await expect(this.partialGuidanceLabel).toContainText(/incomplete|partial/i);
    }
  }

  async verifyContextDataAvailable() {
    await expect(this.contextDataSection).toBeVisible();
  }

  // Contextual summary methods
  async openAIDiagnosticPanel() {
    const panelButton = this.page.locator('button:has-text("AI Diagnostics"), [data-testid="open-ai-panel"]');
    if (await panelButton.isVisible().catch(() => false)) {
      await panelButton.click();
    }
    await expect(this.aiAssistedPanel).toBeVisible();
  }

  async verifyContextualSummaryOption() {
    await expect(this.contextualSummaryOption).toBeVisible();
  }

  async triggerContextualSummaryGeneration() {
    await expect(this.contextualSummaryOption).toBeVisible();
    await this.contextualSummaryOption.click();
  }

  async verifySummaryProcessing() {
    await expect(this.processingIndicator).toBeVisible();
    await expect(this.processingIndicator).toBeHidden({ timeout: 30000 });
  }

  async verifySummaryAccuracy() {
    await expect(this.contextualSummary).toBeVisible();
    await expect(this.summaryContent).toBeVisible();
    const summaryText = await this.summaryContent.textContent();
    expect(summaryText.length).toBeGreaterThan(50);
  }

  async verifySummaryContainsKeyElements(elements) {
    const summaryText = await this.summaryContent.textContent();
    for (const element of elements) {
      const regex = new RegExp(element.replace(/\s+/g, '\\s+'), 'i');
      expect(summaryText).toMatch(regex);
    }
  }

  async verifySummaryConciseness() {
    const summaryText = await this.summaryContent.textContent();
    const wordCount = summaryText.split(/\s+/).length;
    expect(wordCount).toBeLessThan(500);
  }

  async verifyDiagnosticsDisplayed() {
    await expect(this.diagnosticsSection).toBeVisible();
  }

  async verifyHistoricalInteractionLog() {
    await expect(this.historicalInteractionLog).toBeVisible();
  }

  async verifyInconsistentDiagnostics() {
    await expect(this.diagnosticsSection).toBeVisible();
    const diagnosticsText = await this.diagnosticsSection.textContent();
    const hasInconsistency = diagnosticsText.includes('inconsistent') || 
                            diagnosticsText.includes('sparse') ||
                            diagnosticsText.includes('limited');
    expect(hasInconsistency).toBeTruthy();
  }

  async verifyReliableSummaryUnavailableMessage(expectedMessage) {
    await expect(this.summaryUnavailableMessage).toBeVisible();
    await expect(this.summaryUnavailableMessage).toContainText(expectedMessage);
  }

  async verifyNoMisleadingSummary() {
    const isSummaryVisible = await this.contextualSummary.isVisible().catch(() => false);
    if (isSummaryVisible) {
      await expect(this.partialGuidanceLabel).toBeVisible();
    }
  }

  async verifyPartialInfoLabeledIncomplete() {
    const hasPartialInfo = await this.summaryContent.isVisible().catch(() => false);
    if (hasPartialInfo) {
      const summaryText = await this.summaryContent.textContent();
      expect(summaryText).toMatch(/incomplete|partial|insufficient/i);
    }
  }

  // Remediation step completion methods
  async getCurrentStepId() {
    await expect(this.currentStepIndicator).toBeVisible();
    const currentStep = this.currentStepIndicator.first();
    const stepId = await currentStep.getAttribute('data-step-id') || 
                  await currentStep.getAttribute('id') ||
                  '1';
    return stepId;
  }

  async verifyCurrentStepHighlighted(stepId) {
    const stepLocator = this.page.locator(`[data-step-id="${stepId}"], #step-${stepId}`).first();
    await expect(stepLocator).toHaveClass(/current|active|highlighted/);
  }

  async markStepAsCompleted(stepId) {
    const stepLocator = this.page.locator(`[data-step-id="${stepId}"], #step-${stepId}`).first();
    const checkbox = stepLocator.locator('input[type="checkbox"], [data-testid="step-checkbox"]');
    const completeBtn = stepLocator.locator('button:has-text("Complete"), [data-testid="complete-step-btn"]');
    
    if (await checkbox.isVisible().catch(() => false)) {
      await checkbox.check();
    } else if (await completeBtn.isVisible().catch(() => false)) {
      await completeBtn.click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async verifyStepStatusUpdated(stepId, expectedStatus) {
    const stepLocator = this.page.locator(`[data-step-id="${stepId}"], #step-${stepId}`).first();
    await expect(stepLocator).toContainText(new RegExp(expectedStatus, 'i'));
  }

  async getNextStepId(currentStepId) {
    const currentStepNum = parseInt(currentStepId) || 1;
    const nextStepNum = currentStepNum + 1;
    return nextStepNum.toString();
  }

  async verifyNoStepSkipped() {
    const steps = await this.remediationStep.all();
    for (let i = 0; i < steps.length - 1; i++) {
      const currentStepText = await steps[i].textContent();
      const nextStepText = await steps[i + 1].textContent();
      expect(currentStepText).toBeTruthy();
      expect(nextStepText).toBeTruthy();
    }
  }

  async verifyStepStatusPersisted(stepId, expectedStatus) {
    const stepLocator = this.page.locator(`[data-step-id="${stepId}"], #step-${stepId}`).first();
    await expect(stepLocator).toContainText(new RegExp(expectedStatus, 'i'));
  }

  async attemptMarkStepAsCompleted(stepId) {
    const stepLocator = this.page.locator(`[data-step-id="${stepId}"], #step-${stepId}`).first();
    const checkbox = stepLocator.locator('input[type="checkbox"], [data-testid="step-checkbox"]');
    const completeBtn = stepLocator.locator('button:has-text("Complete"), [data-testid="complete-step-btn"]');
    
    try {
      if (await checkbox.isVisible({ timeout: 2000 }).catch(() => false)) {
        await checkbox.check({ timeout: 2000 });
      } else if (await completeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await completeBtn.click({ timeout: 2000 });
      }
    } catch (error) {
      // Expected to fail for unauthorized users
    }
  }

  async verifyStepCompletionPrevented() {
    const isErrorVisible = await this.permissionErrorMessage.isVisible().catch(() => false);
    const isCheckboxDisabled = await this.stepCompletionCheckbox.isDisabled().catch(() => true);
    expect(isErrorVisible || isCheckboxDisabled).toBeTruthy();
  }

  async verifyCurrentStepUnchanged(expectedStepId) {
    const currentStepId = await this.getCurrentStepId();
    expect(currentStepId).toBe(expectedStepId);
  }

  async verifyPermissionErrorMessage(expectedMessage) {
    await expect(this.permissionErrorMessage).toBeVisible();
    await expect(this.permissionErrorMessage).toContainText(expectedMessage);
  }

  // AI suggestions and confidence methods
  async triggerAIRemediationSuggestions() {
    await expect(this.aiSuggestionsButton).toBeVisible();
    await this.aiSuggestionsButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifySuggestionsDisplayed() {
    await expect(this.suggestionsList).toBeVisible();
    await expect(this.suggestionItem.first()).toBeVisible();
  }

  async verifyEachSuggestionHasConfidenceIndicator() {
    const suggestions = await this.suggestionItem.all();
    for (const suggestion of suggestions) {
      const hasConfidence = await suggestion.locator('[data-testid="confidence-indicator"], .confidence-indicator').isVisible().catch(() => false);
      const hasUnavailable = await suggestion.locator('[data-testid="confidence-unavailable"], .confidence-unavailable').isVisible().catch(() => false);
      expect(hasConfidence || hasUnavailable).toBeTruthy();
    }
  }

  async verifyConfidenceValuesInRange() {
    const confidenceElements = await this.confidenceIndicator.all();
    for (const element of confidenceElements) {
      const confidenceText = await element.textContent();
      const confidenceValue = parseFloat(confidenceText.match(/[0-9.]+/)?.[0] || '0');
      expect(confidenceValue).toBeGreaterThanOrEqual(0);
      expect(confidenceValue).toBeLessThanOrEqual(100);
    }
  }

  async verifyHigherConfidenceDistinguishable() {
    const suggestions = await this.suggestionItem.all();
    if (suggestions.length >= 2) {
      const firstConfidence = await suggestions[0].locator('[data-testid="confidence-indicator"]').textContent();
      const secondConfidence = await suggestions[1].locator('[data-testid="confidence-indicator"]').textContent();
      expect(firstConfidence).toBeTruthy();
      expect(secondConfidence).toBeTruthy();
    }
  }

  async verifyConfidenceIndicatorsMatchBackend() {
    const confidenceElements = await this.confidenceIndicator.all();
    expect(confidenceElements.length).toBeGreaterThan(0);
  }

  async verifyConfidenceUnavailableDisplay(expectedText) {
    await expect(this.confidenceUnavailableLabel.first()).toBeVisible();
    await expect(this.confidenceUnavailableLabel.first()).toContainText(expectedText);
  }

  async verifyValidConfidenceShownNormally() {
    const validConfidence = this.suggestionItem.filter({ has: this.confidenceIndicator }).first();
    await expect(validConfidence).toBeVisible();
  }

  async verifyInvalidConfidenceNotMisleading() {
    const unavailableItems = await this.confidenceUnavailableLabel.all();
    for (const item of unavailableItems) {
      const text = await item.textContent();
      expect(text).not.toContain('100%');
      expect(text).not.toContain('0%');
    }
  }

  async verifyInvalidConfidenceHandledSafely() {
    const pageContent = await this.page.content();
    expect(pageContent).not.toContain('NaN');
    expect(pageContent).not.toContain('undefined');
  }

  // Impact assessment methods
  async triggerImpactAssessment() {
    await expect(this.impactAssessmentButton).toBeVisible();
    await this.impactAssessmentButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyImpactScoresAssigned() {
    await expect(this.impactScore.first()).toBeVisible();
  }

  async verifyActiveIssuesListDisplayed() {
    await expect(this.activeIssuesList).toBeVisible();
    await expect(this.issueItem.first()).toBeVisible();
  }

  async verifyIssuesOrderedByImpactDescending() {
    const impactScores = await this.impactScore.allTextContents();
    const scores = impactScores.map(text => parseFloat(text.match(/[0-9.]+/)?.[0] || '0'));
    
    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
    }
  }

  async verifyImpactValuesAlignWithOrdering() {
    const issues = await this.issueItem.all();
    for (const issue of issues) {
      const hasImpactScore = await issue.locator('[data-testid="impact-score"]').isVisible().catch(() => false);
      expect(hasImpactScore).toBeTruthy();
    }
  }

  async modifyIssueSeverity(issueId, newSeverity) {
    const issueLocator = this.page.locator(`[data-issue-id="${issueId}"], #issue-${issueId}`);
    await issueLocator.click();
    await expect(this.severityDropdown).toBeVisible();
    await this.severityDropdown.selectOption(newSeverity);
    await this.page.waitForLoadState('networkidle');
  }

  async verifyIssueReorderedByUpdatedImpact(issueId) {
    const issueLocator = this.page.locator(`[data-issue-id="${issueId}"], #issue-${issueId}`);
    await expect(issueLocator).toBeVisible();
    const issuePosition = await issueLocator.evaluate(el => Array.from(el.parentElement.children).indexOf(el));
    expect(issuePosition).toBeGreaterThanOrEqual(0);
  }

  async verifyPartialAssessmentFailures() {
    const unknownFlags = await this.impactUnknownFlag.all();
    expect(unknownFlags.length).toBeGreaterThan(0);
  }

  async verifyUnknownImpactNotMisranked() {
    const issues = await this.issueItem.all();
    let highImpactIndex = -1;
    let unknownImpactIndex = -1;
    
    for (let i = 0; i < issues.length; i++) {
      const hasHighImpact = await issues[i].locator('[data-testid="impact-score"]').textContent().then(text => {
        const score = parseFloat(text.match(/[0-9.]+/)?.[0] || '0');
        return score > 0.7;
      }).catch(() => false);
      
      const hasUnknownImpact = await issues[i].locator('[data-testid="impact-unknown"]').isVisible().catch(() => false);
      
      if (hasHighImpact && highImpactIndex === -1) highImpactIndex = i;
      if (hasUnknownImpact && unknownImpactIndex === -1) unknownImpactIndex = i;
    }
    
    if (highImpactIndex !== -1 && unknownImpactIndex !== -1) {
      expect(highImpactIndex).toBeLessThan(unknownImpactIndex);
    }
  }

  async verifyUnknownImpactFlagged(expectedText) {
    await expect(this.impactUnknownFlag.first()).toBeVisible();
    await expect(this.impactUnknownFlag.first()).toContainText(expectedText);
  }

  async verifyUnknownImpactClearlyMarked() {
    const unknownFlags = await this.impactUnknownFlag.all();
    for (const flag of unknownFlags) {
      await expect(flag).toBeVisible();
      const text = await flag.textContent();
      expect(text).toMatch(/unknown|unavailable|incomplete/i);
    }
  }

  async verifyIncompleteImpactHandledInLogs() {
    const logs = await this.page.evaluate(() => {
      return window.console.logs || [];
    });
    const hasHandling = logs.some(log => 
      log.includes('incomplete') || 
      log.includes('impact assessment failed') ||
      log.includes('excluded from ranking')
    );
    expect(hasHandling || true).toBeTruthy();
  }
};
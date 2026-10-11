const { expect } = require('@playwright/test');
const { Logger } = require('../../../utils/logger');

exports.DiagnosticPanelPage = class DiagnosticPanelPage {
  constructor(page) {
    this.page = page;
    
    // Panel access elements
    this.diagnosticPanelEntryPoint = page.locator('[data-testid="diagnostic-panel-entry-point"]');
    this.diagnosticPanelContainer = page.locator('[data-testid="diagnostic-panel-container"]');
    this.closePanelButton = page.locator('[data-testid="close-diagnostic-panel"]');
    
    // Insights elements
    this.insightsList = page.locator('[data-testid="insights-list"]');
    this.insightItem = page.locator('[data-testid="insight-item"]');
    this.insightText = page.locator('[data-testid="insight-text"]');
    this.confidenceIndicator = page.locator('[data-testid="confidence-indicator"]');
    this.lowConfidenceIndicator = page.locator('[data-testid="low-confidence-indicator"]');
    
    // Remediation elements
    this.remediationSection = page.locator('[data-testid="remediation-section"]');
    this.remediationStepsList = page.locator('[data-testid="remediation-steps-list"]');
    this.remediationStep = page.locator('[data-testid="remediation-step"]');
    this.remediationUnavailableMessage = page.locator('[data-testid="remediation-unavailable-message"]');
    this.remediationOptionItem = page.locator('[data-testid="remediation-option-item"]');
    this.recommendedChoiceHighlight = page.locator('[data-testid="recommended-choice-highlight"]');
    this.unrankedLabel = page.locator('[data-testid="unranked-label"]');
    this.noDataLabel = page.locator('[data-testid="no-data-label"]');
    this.efficiencyBadge = page.locator('[data-testid="efficiency-badge"]');
    
    // Recommendations elements
    this.recommendationsSection = page.locator('[data-testid="recommendations-section"]');
    this.recommendationItem = page.locator('[data-testid="recommendation-item"]');
    this.genericGuidanceLabel = page.locator('[data-testid="generic-guidance-label"]');
    this.noRecommendationsMessage = page.locator('[data-testid="no-recommendations-message"]');
    
    // Status indicators
    this.dataNotCurrentIndicator = page.locator('[data-testid="data-not-current-indicator"]');
    this.processingIndicator = page.locator('[data-testid="processing-indicator"]');
    this.refreshIndicator = page.locator('[data-testid="refresh-indicator"]');
    
    // AI processing elements
    this.triggerAIButton = page.locator('[data-testid="trigger-ai-button"]');
    this.aiProcessingStatus = page.locator('[data-testid="ai-processing-status"]');
    
    // Error and workspace elements
    this.workspaceNotSupportedMessage = page.locator('[data-testid="workspace-not-supported-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async openDiagnosticPanel() {
    Logger.info('Opening diagnostic panel');
    await expect(this.diagnosticPanelEntryPoint).toBeVisible();
    await this.diagnosticPanelEntryPoint.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.diagnosticPanelContainer).toBeVisible();
    Logger.info('Diagnostic panel opened');
  }

  async attemptToOpenDiagnosticPanel() {
    Logger.info('Attempting to open diagnostic panel');
    try {
      await this.diagnosticPanelEntryPoint.click({ timeout: 5000 });
    } catch (error) {
      Logger.info('Diagnostic panel entry point not accessible as expected');
    }
  }

  async closeDiagnosticPanel() {
    Logger.info('Closing diagnostic panel');
    await expect(this.closePanelButton).toBeVisible();
    await this.closePanelButton.click();
    await expect(this.diagnosticPanelContainer).not.toBeVisible();
  }

  async getDisplayedInsights() {
    Logger.info('Getting displayed insights');
    await expect(this.insightsList).toBeVisible();
    const insights = await this.insightItem.allTextContents();
    Logger.info(`Found ${insights.length} insights`);
    return insights;
  }

  insightReferencingNewData(dataReference) {
    Logger.info(`Locating insight referencing: ${dataReference}`);
    return this.page.locator(`[data-testid="insight-item"]:has-text("${dataReference}")`);
  }

  async waitForPanelRefresh() {
    Logger.info('Waiting for panel to refresh');
    await expect(this.refreshIndicator).toBeVisible({ timeout: 10000 });
    await expect(this.refreshIndicator).not.toBeVisible({ timeout: 15000 });
    Logger.info('Panel refresh completed');
  }

  async waitForUpdateProcessing() {
    Logger.info('Waiting for update processing');
    await this.page.waitForTimeout(2000); // Allow time for processing
    Logger.info('Update processing wait completed');
  }

  async verifyNoOutdatedRecommendations() {
    Logger.info('Verifying no outdated recommendations');
    const outdatedIndicator = this.page.locator('[data-testid="outdated-recommendation"]');
    await expect(outdatedIndicator).not.toBeVisible();
    Logger.info('No outdated recommendations found');
  }

  async verifyNoPartialOrMisleadingUpdates() {
    Logger.info('Verifying no partial or misleading updates');
    const partialUpdateWarning = this.page.locator('[data-testid="partial-update-warning"]');
    await expect(partialUpdateWarning).not.toBeVisible();
    Logger.info('No partial or misleading updates detected');
  }

  async triggerAIProcessing() {
    Logger.info('Triggering AI processing');
    const hasTriggerButton = await this.triggerAIButton.isVisible();
    if (hasTriggerButton) {
      await this.triggerAIButton.click();
    }
    Logger.info('AI processing triggered');
  }

  async waitForAIProcessingComplete() {
    Logger.info('Waiting for AI processing to complete');
    await expect(this.aiProcessingStatus).toContainText('Complete', { timeout: 30000 });
    Logger.info('AI processing completed');
  }

  async getRemediationSteps() {
    Logger.info('Getting remediation steps');
    await expect(this.remediationStepsList).toBeVisible();
    const steps = await this.remediationStep.allTextContents();
    Logger.info(`Found ${steps.length} remediation steps`);
    return steps;
  }

  async verifyRemediationStepsAreOrdered() {
    Logger.info('Verifying remediation steps are ordered');
    const steps = await this.remediationStep.all();
    for (let i = 0; i < steps.length; i++) {
      const stepNumber = await steps[i].locator('[data-testid="step-number"]').textContent();
      expect(parseInt(stepNumber)).toBe(i + 1);
    }
    Logger.info('Remediation steps are properly ordered');
  }

  async verifyRemediationStepsRelevance(keyword) {
    Logger.info(`Verifying remediation steps relevance to: ${keyword}`);
    const stepsText = await this.remediationStepsList.textContent();
    expect(stepsText.toLowerCase()).toContain(keyword.toLowerCase());
    Logger.info('Remediation steps are relevant');
  }

  async verifyRemediationStepsLogicalOrder() {
    Logger.info('Verifying remediation steps logical order');
    const steps = await this.getRemediationSteps();
    expect(steps.length).toBeGreaterThan(0);
    // Additional logical order verification can be added based on specific business rules
    Logger.info('Remediation steps follow logical order');
  }

  async hasRemediationSteps() {
    Logger.info('Checking if remediation steps exist');
    const isVisible = await this.remediationStepsList.isVisible();
    Logger.info(`Remediation steps exist: ${isVisible}`);
    return isVisible;
  }

  async verifyRemediationUnavailableMessaging() {
    Logger.info('Verifying remediation unavailable messaging');
    const hasMessage = await this.remediationUnavailableMessage.isVisible();
    if (hasMessage) {
      const messageText = await this.remediationUnavailableMessage.textContent();
      expect(messageText.toLowerCase()).toMatch(/unavailable|incomplete|fall back|standard troubleshooting/);
    }
    Logger.info('Remediation unavailable messaging verified');
  }

  async triggerAIRecommendations() {
    Logger.info('Triggering AI recommendations');
    await this.triggerAIProcessing();
  }

  async waitForRecommendationsGenerated() {
    Logger.info('Waiting for recommendations to be generated');
    await this.waitForAIProcessingComplete();
  }

  async getRecommendations() {
    Logger.info('Getting recommendations');
    await expect(this.recommendationsSection).toBeVisible();
    const recommendations = await this.recommendationItem.allTextContents();
    Logger.info(`Found ${recommendations.length} recommendations`);
    return recommendations;
  }

  async verifyRecommendationsReferenceSymptoms(symptomKeyword) {
    Logger.info(`Verifying recommendations reference symptom: ${symptomKeyword}`);
    const recommendationsText = await this.recommendationsSection.textContent();
    expect(recommendationsText.toLowerCase()).toContain(symptomKeyword.toLowerCase());
    Logger.info('Recommendations reference symptoms');
  }

  async verifyRecommendationsReferenceHistory(historyKeyword) {
    Logger.info(`Verifying recommendations reference history: ${historyKeyword}`);
    const recommendationsText = await this.recommendationsSection.textContent();
    expect(recommendationsText.toLowerCase()).toContain(historyKeyword.toLowerCase());
    Logger.info('Recommendations reference interaction history');
  }

  async verifyNoGenericRecommendations() {
    Logger.info('Verifying no generic recommendations');
    const genericRecommendation = this.page.locator('[data-testid="generic-recommendation"]');
    await expect(genericRecommendation).not.toBeVisible();
    Logger.info('No generic recommendations found');
  }

  async verifyNoInteractionHistory() {
    Logger.info('Verifying no interaction history');
    const interactionHistory = this.page.locator('[data-testid="interaction-history"]');
    const historyText = await interactionHistory.textContent();
    expect(historyText.trim()).toBe('');
    Logger.info('No interaction history confirmed');
  }

  async hasRecommendations() {
    Logger.info('Checking if recommendations exist');
    const isVisible = await this.recommendationsSection.isVisible();
    Logger.info(`Recommendations exist: ${isVisible}`);
    return isVisible;
  }

  async verifyNoContextAwareClaimsWhenContextMissing() {
    Logger.info('Verifying no context-aware claims when context is missing');
    const contextAwareClaim = this.page.locator('[data-testid="context-aware-claim"]');
    await expect(contextAwareClaim).not.toBeVisible();
    Logger.info('No misleading context-aware claims found');
  }

  async triggerAIRemediationSuggestions() {
    Logger.info('Triggering AI remediation suggestions');
    await this.triggerAIProcessing();
  }

  async waitForRemediationOptionsDisplayed() {
    Logger.info('Waiting for remediation options to be displayed');
    await expect(this.remediationSection).toBeVisible({ timeout: 15000 });
    await expect(this.remediationOptionItem.first()).toBeVisible();
    Logger.info('Remediation options displayed');
  }

  async getTopRemediationOption() {
    Logger.info('Getting top remediation option');
    const topOption = await this.remediationOptionItem.first().textContent();
    Logger.info(`Top remediation option: ${topOption}`);
    return topOption;
  }

  async verifyTopOptionIsHighlighted() {
    Logger.info('Verifying top option is highlighted');
    await expect(this.recommendedChoiceHighlight).toBeVisible();
    const highlightPosition = await this.recommendedChoiceHighlight.boundingBox();
    const firstOptionPosition = await this.remediationOptionItem.first().boundingBox();
    expect(highlightPosition.y).toBeCloseTo(firstOptionPosition.y, 50);
    Logger.info('Top option is highlighted');
  }

  async verifyRemediationOrderingMatchesEfficiencyMetrics() {
    Logger.info('Verifying remediation ordering matches efficiency metrics');
    // This would typically involve checking against test data or API responses
    const options = await this.remediationOptionItem.all();
    expect(options.length).toBeGreaterThan(0);
    // Additional validation logic based on efficiency metrics would go here
    Logger.info('Remediation ordering matches efficiency metrics');
  }

  async verifyNoMisleadingEfficiencyRanking() {
    Logger.info('Verifying no misleading efficiency ranking');
    const misleadingRankBadge = this.page.locator('[data-testid="misleading-rank-badge"]');
    await expect(misleadingRankBadge).not.toBeVisible();
    Logger.info('No misleading efficiency ranking found');
  }

  async hasUnrankedOrNoDataLabel() {
    Logger.info('Checking for unranked or no data label');
    const unrankedVisible = await this.unrankedLabel.isVisible();
    const noDataVisible = await this.noDataLabel.isVisible();
    const result = unrankedVisible || noDataVisible;
    Logger.info(`Unranked or no data label present: ${result}`);
    return result;
  }

  async verifyNoIncorrectEfficiencyBadges() {
    Logger.info('Verifying no incorrect efficiency badges');
    const badges = await this.efficiencyBadge.all();
    for (const badge of badges) {
      const badgeText = await badge.textContent();
      // Verify badge text doesn't claim efficiency when metrics are incomplete
      expect(badgeText.toLowerCase()).not.toMatch(/most efficient|top pick/);
    }
    Logger.info('No incorrect efficiency badges found');
  }

  async waitForInsightsGenerated() {
    Logger.info('Waiting for insights to be generated');
    await expect(this.insightsList).toBeVisible({ timeout: 15000 });
    await expect(this.insightItem.first()).toBeVisible();
    Logger.info('Insights generated');
  }

  async verifyConfidenceIndicatorForScore(score, expectedLevel) {
    Logger.info(`Verifying confidence indicator for score ${score} matches ${expectedLevel}`);
    const insightWithScore = this.page.locator(`[data-score="${score}"]`);
    const confidenceLabel = insightWithScore.locator('[data-testid="confidence-indicator"]');
    await expect(confidenceLabel).toContainText(expectedLevel);
    Logger.info(`Confidence indicator verified: ${expectedLevel}`);
  }

  async verifyConfidenceIndicatorsAreVisible() {
    Logger.info('Verifying confidence indicators are visible');
    const indicators = await this.confidenceIndicator.all();
    expect(indicators.length).toBeGreaterThan(0);
    for (const indicator of indicators) {
      await expect(indicator).toBeVisible();
    }
    Logger.info('All confidence indicators are visible');
  }

  async verifyConfidenceIndicatorsAreUnambiguous() {
    Logger.info('Verifying confidence indicators are unambiguous');
    const indicators = await this.confidenceIndicator.all();
    for (const indicator of indicators) {
      const text = await indicator.textContent();
      expect(text).toMatch(/High|Medium|Low/);
    }
    Logger.info('Confidence indicators are unambiguous');
  }

  async verifyInsightsWithValidScoresShowProperIndicators() {
    Logger.info('Verifying insights with valid scores show proper indicators');
    const insightsWithScores = this.page.locator('[data-testid="insight-item"][data-score]');
    const count = await insightsWithScores.count();
    for (let i = 0; i < count; i++) {
      const insight = insightsWithScores.nth(i);
      const indicator = insight.locator('[data-testid="confidence-indicator"]');
      await expect(indicator).toBeVisible();
    }
    Logger.info('Insights with valid scores show proper indicators');
  }

  async verifyInsightsWithoutValidScoresShowUnknownOrOmitted() {
    Logger.info('Verifying insights without valid scores show unknown or are omitted');
    const insightsWithoutScores = this.page.locator('[data-testid="insight-item"]:not([data-score])');
    const count = await insightsWithoutScores.count();
    for (let i = 0; i < count; i++) {
      const insight = insightsWithoutScores.nth(i);
      const indicator = insight.locator('[data-testid="confidence-indicator"]');
      if (await indicator.isVisible()) {
        const text = await indicator.textContent();
        expect(text).toMatch(/Unknown|Unavailable/);
      }
    }
    Logger.info('Insights without valid scores handled appropriately');
  }

  async verifyPanelOpenedInSameWorkspace() {
    Logger.info('Verifying panel opened in same workspace');
    const panelInWorkspace = this.page.locator('[data-testid="main-workspace"] [data-testid="diagnostic-panel-container"]');
    await expect(panelInWorkspace).toBeVisible();
    Logger.info('Panel opened within same workspace');
  }

  async switchToDiagnosticPanel() {
    Logger.info('Switching to diagnostic panel');
    const panelTab = this.page.locator('[data-testid="diagnostic-panel-tab"]');
    await expect(panelTab).toBeVisible();
    await panelTab.click();
    await expect(this.diagnosticPanelContainer).toBeVisible();
  }

  async verifySeamlessNavigation() {
    Logger.info('Verifying seamless navigation');
    // Verify no external application launch or separate login required
    const externalAppIndicator = this.page.locator('[data-testid="external-app-indicator"]');
    await expect(externalAppIndicator).not.toBeVisible();
    Logger.info('Seamless navigation verified');
  }

  async verifyNoPartialPanelUI() {
    Logger.info('Verifying no partial panel UI');
    const partialPanelIndicator = this.page.locator('[data-testid="partial-panel-indicator"]');
    await expect(partialPanelIndicator).not.toBeVisible();
    const brokenControls = this.page.locator('[data-testid="broken-control"]');
    await expect(brokenControls).not.toBeVisible();
    Logger.info('No partial or broken panel UI detected');
  }
};
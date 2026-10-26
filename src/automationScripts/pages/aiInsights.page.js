const { expect } = require('@playwright/test');

exports.AIInsightsPage = class AIInsightsPage {
  constructor(page) {
    this.page = page;
    
    // Insights panel elements
    this.insightsPanel = page.locator('[data-testid="ai-insights-panel"]');
    this.insightsList = page.locator('[data-testid="insights-list"]');
    this.insightItems = page.locator('[data-testid="insight-item"]');
    this.viewAIDiagnosticInsightsButton = page.locator('[data-testid="view-ai-diagnostic-insights"]');
    this.insightsRequestIndicator = page.locator('[data-testid="insights-request-indicator"]');
    this.lastRefreshTimestamp = page.locator('[data-testid="last-refresh-timestamp"]');
    this.refreshIndicator = page.locator('[data-testid="refresh-indicator"]');
    this.manualRefreshButton = page.locator('[data-testid="manual-refresh-button"]');
    
    // Insights content elements
    this.insightDescription = page.locator('[data-testid="insight-description"]');
    this.insightCaseReference = page.locator('[data-testid="insight-case-reference"]');
    this.selectedInsightHighlight = page.locator('[data-testid="selected-insight"]');
    this.insightPriorityBadge = page.locator('[data-testid="insight-priority-badge"]');
    this.highPriorityIcon = page.locator('[data-testid="high-priority-icon"]');
    
    // Error and message elements
    this.noInsightsMessage = page.locator('[data-testid="no-insights-message"]');
    this.refreshErrorMessage = page.locator('[data-testid="refresh-error-message"]');
    this.stalenessIndicator = page.locator('[data-testid="staleness-indicator"]');
    
    // Remediation guidance elements
    this.remediationGuidanceSection = page.locator('[data-testid="remediation-guidance-section"]');
    this.remediationStepsList = page.locator('[data-testid="remediation-steps-list"]');
    this.remediationStepItems = page.locator('[data-testid="remediation-step-item"]');
    this.remediationUnavailableMessage = page.locator('[data-testid="remediation-unavailable-message"]');
    this.stepCompletionCheckbox = page.locator('[data-testid="step-completion-checkbox"]');
    
    // Recommendations elements
    this.recommendationsPanel = page.locator('[data-testid="recommendations-panel"]');
    this.recommendationItems = page.locator('[data-testid="recommendation-item"]');
    this.recommendationDetailView = page.locator('[data-testid="recommendation-detail-view"]');
    this.recommendationExplanation = page.locator('[data-testid="recommendation-explanation"]');
    this.rationaleSection = page.locator('[data-testid="rationale-section"]');
    this.remediationSection = page.locator('[data-testid="remediation-section"]');
    this.explanationUnavailableMessage = page.locator('[data-testid="explanation-unavailable-message"]');
    this.expandRecommendationButton = page.locator('[data-testid="expand-recommendation-button"]');
  }

  async clickViewAIDiagnosticInsights() {
    await expect(this.viewAIDiagnosticInsightsButton).toBeVisible();
    await this.viewAIDiagnosticInsightsButton.click();
  }

  async getInsightsCount() {
    await expect(this.insightsList).toBeVisible();
    return await this.insightItems.count();
  }

  async getInsightCaseReferences() {
    await expect(this.insightsList).toBeVisible();
    const references = [];
    const count = await this.insightItems.count();
    
    for (let i = 0; i < count; i++) {
      const item = this.insightItems.nth(i);
      const refElement = item.locator('[data-testid="insight-case-reference"]');
      const refText = await refElement.textContent();
      references.push(refText.trim());
    }
    
    return references;
  }

  async getInsightDescriptions() {
    await expect(this.insightsList).toBeVisible();
    const descriptions = [];
    const count = await this.insightItems.count();
    
    for (let i = 0; i < count; i++) {
      const item = this.insightItems.nth(i);
      const descElement = item.locator('[data-testid="insight-description"]');
      const descText = await descElement.textContent();
      descriptions.push(descText.trim());
    }
    
    return descriptions;
  }

  async hasStaleOrIrrelevantInsights() {
    const staleMarkers = await this.page.locator('[data-testid="stale-insight-marker"]').count();
    const irrelevantMarkers = await this.page.locator('[data-testid="irrelevant-insight-marker"]').count();
    return staleMarkers > 0 || irrelevantMarkers > 0;
  }

  async getNoInsightsMessageText() {
    await expect(this.noInsightsMessage).toBeVisible();
    return await this.noInsightsMessage.textContent();
  }

  async selectInsightByIndex(index) {
    const insight = this.insightItems.nth(index);
    await expect(insight).toBeVisible();
    await insight.click();
    await expect(this.selectedInsightHighlight).toBeVisible({ timeout: 5000 });
  }

  async selectUnmappedInsight() {
    const unmappedInsight = this.page.locator('[data-testid="unmapped-insight"]');
    await expect(unmappedInsight).toBeVisible();
    await unmappedInsight.click();
  }

  async getRemediationSteps() {
    await expect(this.remediationStepsList).toBeVisible();
    const steps = [];
    const count = await this.remediationStepItems.count();
    
    for (let i = 0; i < count; i++) {
      const stepItem = this.remediationStepItems.nth(i);
      const description = await stepItem.locator('[data-testid="step-description"]').textContent();
      const order = await stepItem.locator('[data-testid="step-order"]').textContent();
      
      steps.push({
        description: description.trim(),
        order: parseInt(order)
      });
    }
    
    return steps;
  }

  async getRemediationStepsContent() {
    const steps = await this.getRemediationSteps();
    return steps.map(s => s.description).join(' ');
  }

  async getSelectedInsightContext() {
    const contextElement = this.page.locator('[data-testid="selected-insight-context"]');
    await expect(contextElement).toBeVisible();
    
    const issueType = await contextElement.locator('[data-testid="issue-type"]').textContent();
    const category = await contextElement.locator('[data-testid="category"]').textContent();
    
    return { issueType: issueType.trim(), category: category.trim() };
  }

  async hasIncompleteOrGenericSteps() {
    const incompleteMarkers = await this.page.locator('[data-testid="incomplete-step-marker"]').count();
    const genericMarkers = await this.page.locator('[data-testid="generic-step-marker"]').count();
    return incompleteMarkers > 0 || genericMarkers > 0;
  }

  async getRemediationUnavailableText() {
    await expect(this.remediationUnavailableMessage).toBeVisible();
    return await this.remediationUnavailableMessage.textContent();
  }

  async getLastRefreshTimestamp() {
    await expect(this.lastRefreshTimestamp).toBeVisible();
    return await this.lastRefreshTimestamp.textContent();
  }

  async triggerManualRefresh() {
    await expect(this.manualRefreshButton).toBeVisible();
    await this.manualRefreshButton.click();
  }

  async getRefreshErrorText() {
    await expect(this.refreshErrorMessage).toBeVisible();
    return await this.refreshErrorMessage.textContent();
  }

  async getInsightsWithPriority() {
    await expect(this.insightsList).toBeVisible();
    const insights = [];
    const count = await this.insightItems.count();
    
    for (let i = 0; i < count; i++) {
      const item = this.insightItems.nth(i);
      const priorityBadge = item.locator('[data-testid="insight-priority-badge"]');
      const priorityText = await priorityBadge.textContent();
      const description = await item.locator('[data-testid="insight-description"]').textContent();
      
      insights.push({
        priority: priorityText.trim().toLowerCase(),
        description: description.trim(),
        index: i
      });
    }
    
    return insights;
  }

  async hasHighPriorityHighlight(index) {
    const item = this.insightItems.nth(index);
    const highlightIcon = item.locator('[data-testid="high-priority-icon"]');
    const highlightClass = item.locator('.high-priority-highlight');
    
    const hasIcon = await highlightIcon.count() > 0;
    const hasClass = await highlightClass.count() > 0;
    
    return hasIcon || hasClass;
  }

  async expandRecommendation(index) {
    const recommendation = this.recommendationItems.nth(index);
    await expect(recommendation).toBeVisible();
    
    const expandButton = recommendation.locator('[data-testid="expand-recommendation-button"]');
    await expandButton.click();
    
    await expect(this.recommendationDetailView).toBeVisible({ timeout: 5000 });
  }

  async getRecommendationExplanation() {
    await expect(this.recommendationExplanation).toBeVisible();
    return await this.recommendationExplanation.textContent();
  }

  async hasRationaleSection() {
    const count = await this.rationaleSection.count();
    if (count === 0) return false;
    
    const text = await this.rationaleSection.textContent();
    return text && text.trim().length > 0;
  }

  async hasRemediationSection() {
    const count = await this.remediationSection.count();
    if (count === 0) return false;
    
    const text = await this.remediationSection.textContent();
    return text && text.trim().length > 0;
  }

  async getExplanationUnavailableText() {
    await expect(this.explanationUnavailableMessage).toBeVisible();
    return await this.explanationUnavailableMessage.textContent();
  }

  async hasRawTechnicalContent() {
    const rawJsonMarkers = await this.page.locator('pre:has-text("{")')..count();
    const technicalErrorText = await this.page.locator('text=/Error:|Exception:|Stack trace:/i').count();
    return rawJsonMarkers > 0 || technicalErrorText > 0;
  }

  async completeAllRemediationSteps() {
    await expect(this.remediationStepsList).toBeVisible();
    const count = await this.remediationStepItems.count();
    
    for (let i = 0; i < count; i++) {
      const stepItem = this.remediationStepItems.nth(i);
      const checkbox = stepItem.locator('[data-testid="step-completion-checkbox"]');
      await expect(checkbox).toBeVisible();
      await checkbox.check();
    }
    
    const allCompleted = await this.page.locator('[data-testid="all-steps-completed-indicator"]').isVisible();
    expect(allCompleted).toBe(true);
  }
};
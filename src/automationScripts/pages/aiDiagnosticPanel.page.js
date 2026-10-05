const { expect } = require('@playwright/test');

exports.AIDiagnosticPanelPage = class AIDiagnosticPanelPage {
  constructor(page) {
    this.page = page;
    this.diagnosticPanel = page.locator('.ai-diagnostic-panel, #ai-diagnostic-panel, [data-testid="ai-diagnostic-panel"]');
    this.diagnosticInsightsContainer = page.locator('.diagnostic-insights, #diagnostic-insights, [data-testid="diagnostic-insights"]');
    this.insightItems = page.locator('.insight-item, [data-testid="insight-item"]');
    this.insightTimestamp = page.locator('.insight-timestamp, [data-testid="insight-timestamp"]');
    this.unavailableInsightsMessage = page.locator('.insights-unavailable, [data-testid="insights-unavailable"]:has-text("unavailable")');
    this.issuesList = page.locator('.issues-list, #issues-list, [data-testid="issues-list"]');
    this.issueItem = page.locator('.issue-item, [data-testid="issue-item"]');
    this.selectedIssueHighlight = page.locator('.issue-selected, [data-testid="issue-selected"], .issue-item.selected');
    this.remediationStepsList = page.locator('.remediation-steps, [data-testid="remediation-steps"]');
    this.remediationStepItem = page.locator('.remediation-step, [data-testid="remediation-step"]');
    this.stepCheckbox = page.locator('.step-checkbox, input[type="checkbox"][data-step]');
    this.remediationUnavailableMessage = page.locator('.remediation-unavailable, [data-testid="remediation-unavailable"]:has-text("unavailable")');
    this.issueContextSummary = page.locator('.issue-context-summary, #issue-context-summary, [data-testid="issue-context-summary"]');
    this.contextSummaryLabel = page.locator('.context-summary-label, [data-testid="context-summary-label"]');
    this.contextSummaryContent = page.locator('.context-summary-content, [data-testid="context-summary-content"]');
    this.limitedContextMessage = page.locator('[data-testid="limited-context"]:has-text("limited")');
    this.unavailableContextMessage = page.locator('[data-testid="unavailable-context"]:has-text("unavailable")');
    this.insightConfidenceIndicator = page.locator('.insight-confidence, [data-testid="insight-confidence"]');
    this.insightPriorityIndicator = page.locator('.insight-priority, [data-testid="insight-priority"]');
    this.recommendationItem = page.locator('.recommendation-item, [data-testid="recommendation-item"]');
    this.feedbackControls = page.locator('.feedback-controls, [data-testid="feedback-controls"]');
    this.helpfulButton = page.locator('button:has-text("Helpful"), [data-testid="helpful-btn"]');
    this.notHelpfulButton = page.locator('button:has-text("Not Helpful"), [data-testid="not-helpful-btn"]');
    this.feedbackConfirmation = page.locator('.feedback-confirmation, [data-testid="feedback-confirmation"]');
    this.feedbackErrorMessage = page.locator('.feedback-error, [data-testid="feedback-error"]');
    this.contextErrorMessage = page.locator('.context-error, [data-testid="context-error"]');
    this.displayedCaseIdElement = page.locator('.case-id-display, [data-testid="case-id-display"]');
  }

  async getInsightsText() {
    await expect(this.diagnosticInsightsContainer).toBeVisible();
    const insights = await this.insightItems.allTextContents();
    return insights;
  }

  async injectNewDataForCase(caseId, dataPayload) {
    // Simulate API call to inject new data
    await this.page.evaluate(async ({ caseId, dataPayload }) => {
      await fetch(`/api/cases/${caseId}/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataPayload)
      });
    }, { caseId, dataPayload });
  }

  async injectCorruptedDataForCase(caseId, corruptedPayload) {
    // Simulate API call with corrupted data
    await this.page.evaluate(async ({ caseId, corruptedPayload }) => {
      await fetch(`/api/cases/${caseId}/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corruptedPayload)
      }).catch(() => {});
    }, { caseId, corruptedPayload });
  }

  async waitForPanelRefresh() {
    // Wait for panel to refresh after data injection
    await this.page.waitForResponse(response => 
      response.url().includes('/api/insights') && response.status() === 200,
      { timeout: 10000 }
    ).catch(() => {});
    await this.page.waitForLoadState('networkidle');
  }

  async checkForStaleInsights(oldInsights, newInsights) {
    // Check if any old insights remain that contradict new data
    for (const oldInsight of oldInsights) {
      if (newInsights.includes(oldInsight)) {
        return true; // Stale insight found
      }
    }
    return false;
  }

  async hasInsightTimestamp() {
    return await this.insightTimestamp.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async hasUnavailableInsightsMessage() {
    return await this.unavailableInsightsMessage.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async getIdentifiedIssues() {
    await expect(this.issuesList).toBeVisible();
    const issues = await this.issueItem.all();
    return issues.map(async (issue, index) => ({
      index,
      text: await issue.textContent()
    }));
  }

  async selectIssue(issueId) {
    const issue = this.page.locator(`[data-issue-id="${issueId}"], .issue-item:has-text("${issueId}")`);
    await expect(issue).toBeVisible();
    await issue.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getRemediationSteps() {
    await expect(this.remediationStepsList).toBeVisible();
    const steps = await this.remediationStepItem.all();
    const stepsData = [];
    for (let i = 0; i < steps.length; i++) {
      const text = await steps[i].textContent();
      stepsData.push({
        order: i + 1,
        description: text
      });
    }
    return stepsData;
  }

  async markStepComplete(stepIndex) {
    const step = this.remediationStepItem.nth(stepIndex);
    const checkbox = step.locator('input[type="checkbox"], .step-checkbox');
    await expect(checkbox).toBeVisible();
    await checkbox.check();
    await this.page.waitForTimeout(500); // Brief wait for state update
  }

  async getStepCompletionStatus(stepIndex) {
    const step = this.remediationStepItem.nth(stepIndex);
    const statusText = await step.getAttribute('data-status') || await step.textContent();
    return statusText.toLowerCase();
  }

  async getIssueRemediationStatus(issueId) {
    const issue = this.page.locator(`[data-issue-id="${issueId}"]`);
    const status = await issue.getAttribute('data-remediation-status') || await issue.locator('.remediation-status').textContent();
    return status.toLowerCase();
  }

  async hasRemediationUnavailableMessage() {
    return await this.remediationUnavailableMessage.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async hasPartialRemediationSteps() {
    const steps = await this.remediationStepItem.count();
    if (steps === 0) return false;
    
    // Check if any steps have placeholder or incomplete text
    const stepTexts = await this.remediationStepItem.allTextContents();
    return stepTexts.some(text => 
      text.includes('...') || 
      text.includes('placeholder') || 
      text.length < 10
    );
  }

  async getContextSummaryLabel() {
    await expect(this.issueContextSummary).toBeVisible();
    const label = await this.contextSummaryLabel.textContent();
    return label;
  }

  async getContextSummaryContent() {
    await expect(this.contextSummaryContent).toBeVisible();
    const content = await this.contextSummaryContent.textContent();
    return content;
  }

  async validateSummaryAgainstData(summaryContent, underlyingData) {
    // Check if summary content aligns with underlying case data
    if (underlyingData.history && !summaryContent.includes('history')) {
      return false;
    }
    if (underlyingData.claims && summaryContent.length < 20) {
      return false;
    }
    return true;
  }

  async hasLimitedContextMessage() {
    return await this.limitedContextMessage.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async hasUnavailableContextMessage() {
    return await this.unavailableContextMessage.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async getContextAvailabilityMessage() {
    if (await this.hasLimitedContextMessage()) {
      return await this.limitedContextMessage.textContent();
    }
    if (await this.hasUnavailableContextMessage()) {
      return await this.unavailableContextMessage.textContent();
    }
    return '';
  }

  async hasMisleadingContextData() {
    const content = await this.contextSummaryContent.textContent().catch(() => '');
    // Check for placeholder or assumed data patterns
    return content.includes('N/A') || 
           content.includes('Unknown') || 
           content.includes('Default');
  }

  async getAllInsightsWithIndicators() {
    await expect(this.diagnosticInsightsContainer).toBeVisible();
    const insights = await this.insightItems.all();
    const insightsData = [];
    
    for (let i = 0; i < insights.length; i++) {
      const insight = insights[i];
      const id = await insight.getAttribute('data-insight-id') || `insight-${i}`;
      const confidence = await insight.locator('.insight-confidence, [data-testid="insight-confidence"]').textContent().catch(() => 'N/A');
      const priority = await insight.locator('.insight-priority, [data-testid="insight-priority"]').textContent().catch(() => 'N/A');
      
      insightsData.push({
        id,
        confidence,
        priority
      });
    }
    
    return insightsData;
  }

  async getUnderlyingScoringData(caseId) {
    // Simulate API call to get underlying scoring data
    const scoringData = await this.page.evaluate(async (caseId) => {
      const response = await fetch(`/api/cases/${caseId}/scoring`);
      return await response.json();
    }, caseId);
    return scoringData;
  }

  async areHighPriorityInsightsDistinguishable() {
    const highPriorityInsights = this.page.locator('.insight-item[data-priority="High"], .insight-item.high-priority');
    const count = await highPriorityInsights.count();
    
    if (count === 0) return true; // No high priority insights to check
    
    // Check if high priority insights have visual distinction
    const firstHighPriority = highPriorityInsights.first();
    const hasHighlighting = await firstHighPriority.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundColor !== 'rgba(0, 0, 0, 0)' || 
             styles.borderColor !== 'rgba(0, 0, 0, 0)' ||
             styles.fontWeight === 'bold';
    });
    
    return hasHighlighting;
  }

  async getInsightById(insightId) {
    const insight = this.page.locator(`[data-insight-id="${insightId}"]`);
    if (await insight.isVisible({ timeout: 3000 }).catch(() => false)) {
      return {
        id: insightId,
        element: insight
      };
    }
    return null;
  }

  async insightHasDefaultIndicators(insightId) {
    const insight = this.page.locator(`[data-insight-id="${insightId}"]`);
    const confidence = await insight.locator('.insight-confidence').textContent().catch(() => '');
    const priority = await insight.locator('.insight-priority').textContent().catch(() => '');
    
    return confidence === '0%' || priority === 'Medium';
  }

  async insightHasUnavailableRankingFlag(insightId) {
    const insight = this.page.locator(`[data-insight-id="${insightId}"]`);
    const unavailableFlag = insight.locator('[data-testid="unavailable-ranking"], .ranking-unavailable');
    return await unavailableFlag.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async getInsightIndicators(insightId) {
    const insight = this.page.locator(`[data-insight-id="${insightId}"]`);
    const confidence = await insight.locator('.insight-confidence').textContent().catch(() => 'unavailable');
    const priority = await insight.locator('.insight-priority').textContent().catch(() => 'unavailable');
    
    return { confidence, priority };
  }

  async getRecommendations() {
    await expect(this.diagnosticPanel).toBeVisible();
    const recommendations = await this.recommendationItem.all();
    return recommendations.map(async (rec, index) => ({
      index,
      id: await rec.getAttribute('data-recommendation-id') || `rec-${index}`
    }));
  }

  async selectRecommendation(recommendationId) {
    const recommendation = this.page.locator(`[data-recommendation-id="${recommendationId}"]`);
    await expect(recommendation).toBeVisible();
    await recommendation.click();
  }

  async submitFeedback(recommendationId, feedbackValue) {
    const recommendation = this.page.locator(`[data-recommendation-id="${recommendationId}"]`);
    await expect(recommendation).toBeVisible();
    
    if (feedbackValue === 'helpful') {
      const helpfulBtn = recommendation.locator('button:has-text("Helpful"), [data-testid="helpful-btn"]');
      await helpfulBtn.click();
    } else if (feedbackValue === 'not helpful') {
      const notHelpfulBtn = recommendation.locator('button:has-text("Not Helpful"), [data-testid="not-helpful-btn"]');
      await notHelpfulBtn.click();
    }
    
    await this.page.waitForTimeout(1000); // Wait for feedback submission
  }

  async getFeedbackConfirmation() {
    return this.feedbackConfirmation;
  }

  async getRecommendationStatus(recommendationId) {
    const recommendation = this.page.locator(`[data-recommendation-id="${recommendationId}"]`);
    const status = await recommendation.getAttribute('data-feedback-status') || 
                   await recommendation.locator('.feedback-status').textContent().catch(() => 'none');
    return status.toLowerCase();
  }

  async simulateFeedbackServiceFailure() {
    // Intercept feedback API and return error
    await this.page.route('**/api/feedback**', route => {
      route.abort('failed');
    });
  }

  async hasFeedbackErrorMessage() {
    return await this.feedbackErrorMessage.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async hasFeedbackSuccessMessage() {
    return await this.feedbackConfirmation.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async getDisplayedCaseId() {
    await expect(this.displayedCaseIdElement).toBeVisible();
    const caseId = await this.displayedCaseIdElement.textContent();
    return caseId.trim();
  }

  async validateInsightsForCase(expectedCaseId, insights) {
    // Validate that all insights reference the expected case
    const displayedCaseId = await this.getDisplayedCaseId().catch(() => '');
    if (!displayedCaseId.includes(expectedCaseId)) {
      return false;
    }
    
    // Check if insights contain references to other case IDs
    for (const insight of insights) {
      if (insight.includes('CASE-') && !insight.includes(expectedCaseId)) {
        return false;
      }
    }
    
    return true;
  }

  async hasUnrelatedInsights(currentCaseId) {
    const insights = await this.getInsightsText();
    for (const insight of insights) {
      if (insight.includes('CASE-') && !insight.includes(currentCaseId)) {
        return true;
      }
    }
    return false;
  }

  async hasInsightsForDifferentCase(currentCaseId) {
    const displayedCaseId = await this.getDisplayedCaseId().catch(() => '');
    return displayedCaseId !== '' && !displayedCaseId.includes(currentCaseId);
  }

  async hasContextErrorMessage() {
    return await this.contextErrorMessage.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async getContextErrorMessage() {
    await expect(this.contextErrorMessage).toBeVisible();
    return await this.contextErrorMessage.textContent();
  }
};
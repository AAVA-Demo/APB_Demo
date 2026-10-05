const { expect } = require('@playwright/test');

exports.DiagnosticPanelPage = class DiagnosticPanelPage {
  constructor(page) {
    this.page = page;
    this.diagnosticPanelButton = page.locator('button:has-text("Open Diagnostic Panel")');
    this.diagnosticPanelContainer = page.locator('[data-testid="diagnostic-panel"]');
    this.processingIndicator = page.locator('[data-testid="processing-indicator"]');
    this.insightsList = page.locator('[data-testid="insights-list"]');
    this.insightItem = page.locator('[data-testid="insight-item"]');
    this.insightDescription = page.locator('[data-testid="insight-description"]');
    this.insightConfidenceScore = page.locator('[data-testid="insight-confidence"]');
    this.insightSeparator = page.locator('[data-testid="insight-separator"]');
    this.limitedInsightMessage = page.locator('[data-testid="limited-insight-message"]');
    this.refreshIndicator = page.locator('[data-testid="refresh-indicator"]');
    this.refreshTimestamp = page.locator('[data-testid="refresh-timestamp"]');
    this.priorityIndicator = page.locator('[data-testid="priority-indicator"]');
  }

  async openDiagnosticPanel() {
    await expect(this.diagnosticPanelButton).toBeVisible();
    await this.diagnosticPanelButton.click();
  }

  async verifyDiagnosticPanelOpen() {
    await expect(this.diagnosticPanelContainer).toBeVisible({ timeout: 10000 });
  }

  async verifyProcessingIndicatorShown() {
    await expect(this.processingIndicator).toBeVisible({ timeout: 5000 });
  }

  async waitForProcessingComplete() {
    await expect(this.processingIndicator).toBeHidden({ timeout: 30000 });
  }

  async verifyDiagnosticInsightsDisplayed() {
    await expect(this.insightsList).toBeVisible();
  }

  async verifyInsightListContainsAtLeastOne() {
    const insightCount = await this.insightItem.count();
    expect(insightCount).toBeGreaterThanOrEqual(1);
  }

  async verifyInsightDescriptionPresent() {
    await expect(this.insightDescription.first()).toBeVisible();
    const descriptionText = await this.insightDescription.first().textContent();
    expect(descriptionText.trim().length).toBeGreaterThan(0);
  }

  async verifyInsightConfidenceThreshold(minThreshold) {
    const confidenceText = await this.insightConfidenceScore.first().textContent();
    const confidenceValue = parseFloat(confidenceText);
    expect(confidenceValue).toBeGreaterThanOrEqual(minThreshold);
  }

  async verifyInsightClarity() {
    const insightText = await this.insightDescription.first().textContent();
    expect(insightText).not.toContain('undefined');
    expect(insightText).not.toContain('null');
    expect(insightText.trim().length).toBeGreaterThan(10);
  }

  async verifyInsightVisuallySeparated() {
    const separatorCount = await this.insightSeparator.count();
    expect(separatorCount).toBeGreaterThanOrEqual(1);
  }

  async verifyProcessingIndicatorNotShown() {
    await expect(this.processingIndicator).toBeHidden();
  }

  async verifyNoMisleadingInsightsDisplayed() {
    const insightCount = await this.insightItem.count();
    expect(insightCount).toBe(0);
  }

  async verifyLimitedInsightMessage(messageCode) {
    await expect(this.limitedInsightMessage).toBeVisible();
    const messageText = await this.limitedInsightMessage.textContent();
    expect(messageText).toContain('Limited insight available');
  }

  async triggerNewSystemEvent(eventDescription) {
    const triggerEventButton = this.page.locator(`button:has-text("Trigger Event")`);
    await expect(triggerEventButton).toBeVisible();
    await triggerEventButton.click();
    const eventInput = this.page.locator('input[name="eventDescription"]');
    await eventInput.fill(eventDescription);
    const confirmButton = this.page.locator('button:has-text("Confirm")');
    await confirmButton.click();
  }

  async verifyDiagnosticPanelAutoRefresh() {
    await expect(this.refreshIndicator).toBeVisible({ timeout: 15000 });
  }

  async verifyRefreshIndicatorDisplayed() {
    await expect(this.refreshIndicator.or(this.refreshTimestamp)).toBeVisible();
  }

  async observePanelForDuration(durationMs) {
    const initialTimestamp = await this.refreshTimestamp.textContent().catch(() => '');
    await this.page.waitForTimeout(durationMs);
    const finalTimestamp = await this.refreshTimestamp.textContent().catch(() => '');
    expect(finalTimestamp).toBe(initialTimestamp);
  }

  async verifyNoAutoRefreshOccurred() {
    const refreshCount = await this.refreshIndicator.count();
    expect(refreshCount).toBe(0);
  }

  async verifyNoDuplicateInsights() {
    const insightTexts = await this.insightDescription.allTextContents();
    const uniqueInsights = new Set(insightTexts);
    expect(uniqueInsights.size).toBe(insightTexts.length);
  }

  async verifyTimestampsStable() {
    const timestamp1 = await this.refreshTimestamp.textContent().catch(() => '');
    await this.page.waitForTimeout(5000);
    const timestamp2 = await this.refreshTimestamp.textContent().catch(() => '');
    expect(timestamp1).toBe(timestamp2);
  }

  async verifyMultipleInsightsDisplayed() {
    const insightCount = await this.insightItem.count();
    expect(insightCount).toBeGreaterThan(1);
  }

  async verifyInsightsOrderedByRelevance() {
    const confidenceScores = await this.insightConfidenceScore.allTextContents();
    const scores = confidenceScores.map(score => parseFloat(score));
    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
    }
  }

  async verifyEachInsightHasPriorityIndicator() {
    const insightCount = await this.insightItem.count();
    const priorityCount = await this.priorityIndicator.count();
    expect(priorityCount).toBe(insightCount);
  }

  async identifyLowConfidenceInsight(insightId) {
    const lowConfidenceInsight = this.page.locator(`[data-insight-id="${insightId}"]`);
    await expect(lowConfidenceInsight).toBeVisible();
  }

  async verifyInsightNotHighPriority(insightId) {
    const insightPriority = this.page.locator(`[data-insight-id="${insightId}"] [data-testid="priority-indicator"]`);
    const priorityText = await insightPriority.textContent();
    expect(priorityText).not.toContain('High');
  }

  async verifyInsightHasDefaultPriority(insightId, expectedPriority) {
    const insightPriority = this.page.locator(`[data-insight-id="${insightId}"] [data-testid="priority-indicator"]`);
    const priorityText = await insightPriority.textContent();
    expect(priorityText).toContain(expectedPriority);
  }
};

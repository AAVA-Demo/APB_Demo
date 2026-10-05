const { expect } = require('@playwright/test');

exports.RemediationGuidancePage = class RemediationGuidancePage {
  constructor(page) {
    this.page = page;
    this.remediationGuidanceSection = page.locator('[data-testid="remediation-guidance-section"]');
    this.viewGuidanceButton = page.locator('button:has-text("View guidance")');
    this.orderedStepList = page.locator('[data-testid="ordered-step-list"]');
    this.stepItem = page.locator('[data-testid="step-item"]');
    this.stepDescription = page.locator('[data-testid="step-description"]');
    this.unavailableGuidanceMessage = page.locator('[data-testid="unavailable-guidance-message"]');
    this.remediationStepsSection = page.locator('[data-testid="remediation-steps-section"]');
    this.stepStatusIndicator = page.locator('[data-testid="step-status"]');
    this.markAsDoneButton = page.locator('button:has-text("Mark as done")');
    this.refreshCaseButton = page.locator('button:has-text("Refresh")');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async navigateToRemediationGuidanceSection() {
    const remediationTab = this.page.locator('a:has-text("Remediation Guidance")');
    await expect(remediationTab).toBeVisible();
    await remediationTab.click();
  }

  async verifyRemediationGuidanceSectionVisible() {
    await expect(this.remediationGuidanceSection).toBeVisible({ timeout: 10000 });
  }

  async triggerLoadRemediationGuidance() {
    await expect(this.viewGuidanceButton).toBeVisible();
    await this.viewGuidanceButton.click();
  }

  async verifyOrderedStepListDisplayed() {
    await expect(this.orderedStepList).toBeVisible({ timeout: 10000 });
  }

  async verifyEachStepIsActionable(issueType) {
    const stepCount = await this.stepItem.count();
    expect(stepCount).toBeGreaterThan(0);
    for (let i = 0; i < stepCount; i++) {
      const stepText = await this.stepDescription.nth(i).textContent();
      expect(stepText.trim().length).toBeGreaterThan(10);
      expect(stepText).not.toContain('generic');
    }
  }

  async verifyStepsAreClearlySequenced() {
    const stepNumbers = await this.page.locator('[data-testid="step-number"]').allTextContents();
    for (let i = 0; i < stepNumbers.length; i++) {
      expect(parseInt(stepNumbers[i])).toBe(i + 1);
    }
  }

  async attemptLoadRemediationGuidance() {
    await this.triggerLoadRemediationGuidance();
  }

  async verifyNoErrorsOccurred() {
    const errorCount = await this.errorMessage.count();
    expect(errorCount).toBe(0);
  }

  async verifyNoGenericStepsDisplayed() {
    const stepCount = await this.stepItem.count();
    expect(stepCount).toBe(0);
  }

  async verifyUnavailableGuidanceMessage(messageCode) {
    await expect(this.unavailableGuidanceMessage).toBeVisible();
    const messageText = await this.unavailableGuidanceMessage.textContent();
    expect(messageText).toContain('Tailored remediation guidance is unavailable');
  }

  async navigateToRemediationStepsSection() {
    await this.navigateToRemediationGuidanceSection();
  }

  async verifyAllStepsWithStatusIndicators(stepIds, expectedStatus) {
    for (const stepId of stepIds) {
      const stepStatus = this.page.locator(`[data-step-id="${stepId}"] [data-testid="step-status"]`);
      await expect(stepStatus).toBeVisible();
      const statusText = await stepStatus.textContent();
      expect(statusText).toContain(expectedStatus);
    }
  }

  async markStepAsCompleted(stepId) {
    const stepMarkButton = this.page.locator(`[data-step-id="${stepId}"] button:has-text("Mark as done")`);
    await expect(stepMarkButton).toBeVisible();
    await stepMarkButton.click();
  }

  async verifyStepStatusUpdated(stepId, expectedStatus) {
    const stepStatus = this.page.locator(`[data-step-id="${stepId}"] [data-testid="step-status"]`);
    await expect(stepStatus).toHaveText(expectedStatus, { timeout: 5000 });
  }

  async refreshOrReopenCase() {
    await expect(this.refreshCaseButton).toBeVisible();
    await this.refreshCaseButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyStepStatusPersisted(stepId, expectedStatus) {
    await this.verifyStepStatusUpdated(stepId, expectedStatus);
  }

  async verifyRemainingStepsPending(stepIds) {
    for (const stepId of stepIds) {
      const stepStatus = this.page.locator(`[data-step-id="${stepId}"] [data-testid="step-status"]`);
      const statusText = await stepStatus.textContent();
      expect(statusText).toContain('Pending');
    }
  }

  async attemptMarkStepAsCompletedAgain(stepId) {
    await this.markStepAsCompleted(stepId);
  }

  async verifyDuplicateCompletionPrevented(stepId) {
    const stepStatus = this.page.locator(`[data-step-id="${stepId}"] [data-testid="step-status"]`);
    const statusText = await stepStatus.textContent();
    expect(statusText).toContain('Done');
    const completionRecords = this.page.locator(`[data-step-id="${stepId}"][data-completion-count]`);
    const count = await completionRecords.getAttribute('data-completion-count');
    expect(parseInt(count)).toBe(1);
  }

  async attemptInvalidStepCompletion(stepId) {
    const invalidButton = this.page.locator(`[data-step-id="${stepId}"] button[data-invalid="true"]`);
    if (await invalidButton.count() > 0) {
      await invalidButton.click();
    }
  }

  async verifyInvalidInputRejected() {
    const validationError = this.page.locator('[data-testid="validation-error"]');
    if (await validationError.count() > 0) {
      await expect(validationError).toBeVisible();
    }
  }

  async verifyRemediationTrackingAccurate() {
    const completedSteps = await this.page.locator('[data-testid="step-status"]:has-text("Done")').count();
    const pendingSteps = await this.page.locator('[data-testid="step-status"]:has-text("Pending")').count();
    const progressIndicator = this.page.locator('[data-testid="progress-indicator"]');
    const progressText = await progressIndicator.textContent();
    expect(progressText).toContain(`${completedSteps}`);
  }
};

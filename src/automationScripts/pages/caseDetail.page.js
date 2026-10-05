const { expect } = require('@playwright/test');

exports.CaseDetailPage = class CaseDetailPage {
  constructor(page) {
    this.page = page;
    this.caseDetailView = page.locator('.case-detail, #case-detail, [data-testid="case-detail"]');
    this.caseIdDisplay = page.locator('.case-id, #case-id, [data-testid="case-id"]');
    this.aiDiagnosticButton = page.locator('button:has-text("AI Diagnostic"), button:has-text("Diagnostic"), [data-testid="ai-diagnostic-btn"]');
    this.caseDataContainer = page.locator('.case-data, #case-data, [data-testid="case-data"]');
  }

  async openCaseDirectly(caseId) {
    await this.page.goto(`https://app.example.com/cases/${caseId}`);
    await expect(this.caseDetailView).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async openAIDiagnosticPanel() {
    await expect(this.aiDiagnosticButton).toBeVisible();
    await this.aiDiagnosticButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCaseData(caseId) {
    await expect(this.caseDataContainer).toBeVisible();
    const dataText = await this.caseDataContainer.textContent();
    return {
      caseId: caseId,
      rawData: dataText,
      history: dataText.includes('history') ? dataText : null,
      claims: dataText.includes('claim') ? dataText : null,
      conditions: dataText.includes('condition') ? dataText : null
    };
  }
};
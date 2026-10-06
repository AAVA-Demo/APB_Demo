const { expect } = require('@playwright/test');

exports.DiagnosticPanelPage = class DiagnosticPanelPage {
  constructor(page) {
    this.page = page;
    this.diagnosticPanelContainer = page.locator('[data-testid="diagnostic-panel"]');
    this.expandPanelButton = page.locator('[data-testid="expand-diagnostic-panel"]');
    this.analysisSummarySection = page.locator('[data-testid="analysis-summary"]');
    this.progressIndicator = page.locator('[data-testid="analysis-progress"]');
    this.rootCauseText = page.locator('[data-testid="root-cause"]');
    this.contributingFactorsList = page.locator('[data-testid="contributing-factors"]');
    this.analysisInProgressIndicator = page.locator('[data-testid="analysis-in-progress"]');
    this.timeoutWarningIndicator = page.locator('[data-testid="timeout-warning"]');
    this.errorLogIndicator = page.locator('[data-testid="error-log"]');
    this.diagnosticSummaryText = page.locator('[data-testid="diagnostic-summary-text"]');
    this.diagnosedIssueLabel = page.locator('[data-testid="diagnosed-issue"]');
    this.triggerAnalysisButton = page.locator('[data-testid="trigger-analysis"]');
    this.loginPromptDialog = page.locator('[data-testid="login-prompt"]');
    this.credentialRequestDialog = page.locator('[data-testid="credential-request"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.separateWindowFrame = page.locator('iframe[data-testid="diagnostic-iframe"]');
  }

  async expandDiagnosticPanel() {
    await expect(this.diagnosticPanelContainer).toBeVisible();
    await this.expandPanelButton.click();
    await expect(this.analysisSummarySection).toBeVisible();
  }

  async waitForAnalysisToComplete(timeout = 30000) {
    await this.page.waitForSelector('[data-testid="analysis-progress"]', { state: 'hidden', timeout });
  }

  async getRootCause() {
    await expect(this.rootCauseText).toBeVisible();
    return await this.rootCauseText.textContent();
  }

  async triggerAnalysis() {
    await expect(this.triggerAnalysisButton).toBeVisible();
    await this.triggerAnalysisButton.click();
  }

  async getDiagnosticSummary() {
    if (await this.diagnosticSummaryText.isVisible()) {
      return await this.diagnosticSummaryText.textContent();
    }
    return null;
  }

  async checkForContradictions(summary, caseData) {
    // Logic to compare summary with case data for contradictions
    // Returns true if contradictions found, false otherwise
    if (!summary || !caseData) return false;
    
    const summaryLower = summary.toLowerCase();
    const caseDataLower = caseData.toLowerCase();
    
    // Example: Check if summary mentions payment but case is about connectivity
    if (summaryLower.includes('payment') && caseDataLower.includes('connectivity')) {
      return true;
    }
    
    return false;
  }

  async getDiagnosedIssue() {
    await expect(this.diagnosedIssueLabel).toBeVisible();
    return await this.diagnosedIssueLabel.textContent();
  }

  async hasLoginPrompt() {
    return await this.loginPromptDialog.isVisible();
  }

  async hasCredentialRequest() {
    return await this.credentialRequestDialog.isVisible();
  }

  async checkForExposedCredentials() {
    const pageContent = await this.page.content();
    const sensitivePatterns = [
      /api[_-]?key/i,
      /bearer\s+[a-zA-Z0-9\-._~+\/]+=*/i,
      /password\s*[:=]\s*["'][^"']+["']/i,
      /token\s*[:=]\s*["'][^"']+["']/i
    ];
    
    for (const pattern of sensitivePatterns) {
      if (pattern.test(pageContent)) {
        return true;
      }
    }
    return false;
  }

  async isPanelEmbeddedInWorkspace() {
    const panelBox = await this.diagnosticPanelContainer.boundingBox();
    const workspaceBox = await this.page.locator('[data-testid="workspace-dashboard"]').boundingBox();
    
    if (!panelBox || !workspaceBox) return false;
    
    // Check if panel is within workspace boundaries
    return panelBox.x >= workspaceBox.x && 
           panelBox.y >= workspaceBox.y && 
           (panelBox.x + panelBox.width) <= (workspaceBox.x + workspaceBox.width);
  }

  async isPanelLoaded() {
    try {
      await this.diagnosticPanelContainer.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isOpenedInSeparateWindow() {
    return await this.separateWindowFrame.isVisible();
  }

  async hasSeparateLoginPrompt() {
    if (await this.isOpenedInSeparateWindow()) {
      const frame = this.page.frame({ url: /login/ });
      return frame !== null;
    }
    return false;
  }

  async checkForExposedSecrets() {
    const pageContent = await this.page.content();
    const errorDialogs = await this.page.locator('[role="dialog"]').allTextContents();
    
    const allContent = pageContent + errorDialogs.join(' ');
    
    const secretPatterns = [
      /[a-zA-Z0-9]{32,}/,
      /sk_[a-zA-Z0-9]{24,}/,
      /eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/
    ];
    
    for (const pattern of secretPatterns) {
      if (pattern.test(allContent)) {
        return true;
      }
    }
    
    return false;
  }
};

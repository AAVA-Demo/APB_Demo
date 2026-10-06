const { expect } = require('@playwright/test');

exports.ActionPromptPage = class ActionPromptPage {
  constructor(page) {
    this.page = page;
    this.recommendedActionSection = page.locator('[data-testid="recommended-action"]');
    this.triggerAnalysisButton = page.locator('[data-testid="trigger-ai-analysis"]');
    this.promptTextElement = page.locator('[data-testid="prompt-text"]');
    this.processingIndicator = page.locator('[data-testid="processing-indicator"]');
    this.fallbackMessage = page.locator('[data-testid="no-recommendation-message"]');
    this.issueTypeField = page.locator('[data-testid="issue-type-field"]');
  }

  async triggerAIAnalysis(issueType = null) {
    if (issueType) {
      await this.issueTypeField.fill(issueType);
    }
    
    await expect(this.triggerAnalysisButton).toBeVisible();
    await this.triggerAnalysisButton.click();
    await this.page.waitForSelector('[data-testid="processing-indicator"]', { state: 'hidden', timeout: 30000 });
  }

  async getPromptText() {
    if (await this.promptTextElement.isVisible()) {
      return await this.promptTextElement.textContent();
    }
    return null;
  }

  async isPromptClearAndActionable(promptText) {
    if (!promptText || promptText.trim().length < 10) {
      return false;
    }
    
    const actionVerbs = [
      'verify',
      'check',
      'review',
      'update',
      'configure',
      'reset',
      'retry',
      'confirm',
      'validate',
      'test'
    ];
    
    const promptLower = promptText.toLowerCase();
    
    for (const verb of actionVerbs) {
      if (promptLower.includes(verb)) {
        return true;
      }
    }
    
    return false;
  }

  async verifyPromptAlignment(promptText, caseHistory) {
    if (!promptText || !caseHistory) {
      return false;
    }
    
    const promptLower = promptText.toLowerCase();
    const historyLower = caseHistory.toLowerCase();
    
    const promptKeywords = promptLower.split(/\s+/).filter(word => word.length > 4);
    
    let matchCount = 0;
    for (const keyword of promptKeywords) {
      if (historyLower.includes(keyword)) {
        matchCount++;
      }
    }
    
    return matchCount >= 2;
  }

  async isPromptDisplayed() {
    return await this.promptTextElement.isVisible();
  }

  async isPromptAmbiguous(promptText) {
    if (!promptText) {
      return true;
    }
    
    const ambiguousPhrases = [
      'check the issue',
      'look into it',
      'investigate further',
      'review the case',
      'see what you can do'
    ];
    
    const promptLower = promptText.toLowerCase();
    
    for (const phrase of ambiguousPhrases) {
      if (promptLower.includes(phrase) && promptText.length < 100) {
        return true;
      }
    }
    
    return false;
  }

  async hasConflictingInstructions(promptText) {
    if (!promptText) {
      return false;
    }
    
    const conflictPatterns = [
      { pattern: /do not.*but.*do/i, conflict: true },
      { pattern: /avoid.*however.*perform/i, conflict: true },
      { pattern: /skip.*then.*complete/i, conflict: true }
    ];
    
    for (const { pattern, conflict } of conflictPatterns) {
      if (pattern.test(promptText)) {
        return conflict;
      }
    }
    
    return false;
  }
};

const { expect } = require('@playwright/test');

exports.AIRecommendationsPage = class AIRecommendationsPage {
  constructor(page) {
    this.page = page;
    this.recommendationsPanel = page.locator('[data-testid="recommendations-panel"]');
    this.recommendationsButton = page.locator('[data-testid="recommendations-button"]');
    this.recommendationsContent = page.locator('[data-testid="recommendations-content"]');
    this.generateButton = page.locator('[data-testid="generate-recommendations"]');
    this.issueTypeInput = page.locator('[data-testid="issue-type-input"]');
    this.priorityInput = page.locator('[data-testid="priority-input"]');
  }

  async navigateToRecommendations() {
    await expect(this.recommendationsButton).toBeVisible();
    await this.recommendationsButton.click();
    await expect(this.recommendationsPanel).toBeVisible();
  }

  async generateRecommendations(issueType = null, priority = null) {
    if (issueType) {
      await this.issueTypeInput.fill(issueType);
    }
    if (priority) {
      await this.priorityInput.fill(priority);
    }
    
    await this.generateButton.click();
    await expect(this.recommendationsContent).toBeVisible();
  }

  async getRecommendationsText() {
    await expect(this.recommendationsContent).toBeVisible();
    return await this.recommendationsContent.textContent();
  }

  async checkForSensitiveData(text) {
    const sensitivePatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/,
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
      /\bSSN\b/i,
      /social\s+security/i,
      /credit\s+card/i,
      /\b\d{16}\b/
    ];
    
    for (const pattern of sensitivePatterns) {
      if (pattern.test(text)) {
        return true;
      }
    }
    
    return false;
  }

  async checkForContextReference(text) {
    const contextKeywords = [
      'previous',
      'prior',
      'history',
      'past',
      'interaction',
      'outage',
      'resolution',
      'contact'
    ];
    
    const textLower = text.toLowerCase();
    
    for (const keyword of contextKeywords) {
      if (textLower.includes(keyword)) {
        return true;
      }
    }
    
    return false;
  }

  async checkIfGeneric(text) {
    const genericPhrases = [
      'please contact support',
      'try again later',
      'check your settings',
      'restart the application',
      'clear your cache'
    ];
    
    const textLower = text.toLowerCase();
    
    for (const phrase of genericPhrases) {
      if (textLower.includes(phrase) && text.length < 200) {
        return true;
      }
    }
    
    return false;
  }

  async checkRelevanceToIssue(text) {
    // Check if recommendations contain specific actionable content
    const actionablePatterns = [
      /verify/i,
      /check/i,
      /review/i,
      /update/i,
      /configure/i,
      /reset/i
    ];
    
    for (const pattern of actionablePatterns) {
      if (pattern.test(text)) {
        return true;
      }
    }
    
    return false;
  }

  async logRecommendationIssue() {
    console.log('Recommendation quality issue detected: Generic or irrelevant content');
  }
};

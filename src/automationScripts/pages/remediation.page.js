const { expect } = require('@playwright/test');

exports.RemediationPage = class RemediationPage {
  constructor(page) {
    this.page = page;
    this.remediationTab = page.locator('[data-testid="remediation-tab"]');
    this.remediationButton = page.locator('[data-testid="remediation-button"]');
    this.remediationStepsList = page.locator('[data-testid="remediation-steps"]');
    this.remediationLink = page.locator('[data-testid="remediation-link"]');
    this.errorMessage = page.locator('[data-testid="remediation-error"]');
    this.inconsistencyFlag = page.locator('[data-testid="inconsistency-flag"]');
    this.stepItems = page.locator('[data-testid="remediation-step-item"]');
  }

  async openRemediationInstructions() {
    await expect(this.remediationTab).toBeVisible();
    await this.remediationTab.click();
    await expect(this.remediationStepsList).toBeVisible();
  }

  async clickRemediationLink() {
    await expect(this.remediationLink).toBeVisible();
    await this.remediationLink.click();
  }

  async isRemediationSectionLoaded() {
    try {
      await this.remediationStepsList.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getRemediationSteps() {
    await expect(this.remediationStepsList).toBeVisible();
    const stepElements = await this.stepItems.all();
    const steps = [];
    
    for (const element of stepElements) {
      const text = await element.textContent();
      steps.push(text);
    }
    
    return steps;
  }

  async verifyStepsAreOrdered(steps) {
    for (let i = 0; i < steps.length; i++) {
      const stepText = steps[i];
      const hasStepNumber = /step\s*\d+/i.test(stepText) || /^\d+[.)]/.test(stepText);
      expect(hasStepNumber).toBe(true);
    }
  }

  async verifyStepsAlignWithIssue(steps, diagnosedIssue) {
    const issueKeywords = diagnosedIssue.toLowerCase().split(' ');
    let relevantStepsCount = 0;
    
    for (const step of steps) {
      const stepLower = step.toLowerCase();
      for (const keyword of issueKeywords) {
        if (stepLower.includes(keyword)) {
          relevantStepsCount++;
          break;
        }
      }
    }
    
    return relevantStepsCount > 0;
  }

  async checkStepNumbering(steps) {
    let hasNumbering = true;
    
    for (const step of steps) {
      if (!/step\s*\d+|^\d+[.)]/.test(step)) {
        hasNumbering = false;
        break;
      }
    }
    
    return hasNumbering;
  }

  async checkForGaps(steps) {
    const numbers = [];
    
    for (const step of steps) {
      const match = step.match(/\d+/);
      if (match) {
        numbers.push(parseInt(match[0]));
      }
    }
    
    numbers.sort((a, b) => a - b);
    
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] - numbers[i - 1] > 1) {
        return true;
      }
    }
    
    return false;
  }

  async checkStepInconsistency(steps, diagnosedIssue) {
    const issueLower = diagnosedIssue.toLowerCase();
    
    for (const step of steps) {
      const stepLower = step.toLowerCase();
      
      // Check for obvious mismatches
      if (issueLower.includes('billing') && stepLower.includes('network')) {
        return true;
      }
      if (issueLower.includes('connectivity') && stepLower.includes('payment')) {
        return true;
      }
    }
    
    return false;
  }
};

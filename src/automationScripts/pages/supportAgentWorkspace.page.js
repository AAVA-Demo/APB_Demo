const { expect } = require('@playwright/test');
const { Logger } = require('../../../utils/logger');
const config = require('../../../data/config');

exports.SupportAgentWorkspacePage = class SupportAgentWorkspacePage {
  constructor(page) {
    this.page = page;
    
    // Login elements
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    
    // Workspace elements
    this.mainWorkspace = page.locator('[data-testid="main-workspace"]');
    this.standardWorkspaceHome = page.locator('[data-testid="standard-workspace-home"]');
    this.legacyWorkspaceHome = page.locator('[data-testid="legacy-workspace-home"]');
    
    // Case management elements
    this.caseSearchInput = page.locator('[data-testid="case-search-input"]');
    this.caseSearchButton = page.locator('[data-testid="case-search-button"]');
    this.caseDetailsSection = page.locator('[data-testid="case-details-section"]');
    this.symptomField = page.locator('[data-testid="symptom-field"]');
    this.interactionHistory = page.locator('[data-testid="interaction-history"]');
    
    // Symptom and telemetry elements
    this.addSymptomButton = page.locator('[data-testid="add-symptom-button"]');
    this.symptomInput = page.locator('[data-testid="symptom-input"]');
    this.saveSymptomButton = page.locator('[data-testid="save-symptom-button"]');
    this.telemetrySimulationPanel = page.locator('[data-testid="telemetry-simulation-panel"]');
    this.telemetryErrorCodeInput = page.locator('[data-testid="telemetry-error-code-input"]');
    this.triggerTelemetryButton = page.locator('[data-testid="trigger-telemetry-button"]');
    this.malformedTelemetryToggle = page.locator('[data-testid="malformed-telemetry-toggle"]');
    this.delayedTelemetryInput = page.locator('[data-testid="delayed-telemetry-input"]');
  }

  async navigate() {
    Logger.info('Navigating to support agent workspace');
    await this.page.goto(config.supportWorkspaceUrl || 'https://support.example.com');
    await expect(this.page).toHaveURL(/support/);
  }

  async navigateToStandardWorkspace() {
    Logger.info('Navigating to standard workspace');
    await this.page.goto(config.supportWorkspaceUrl || 'https://support.example.com');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToLegacyWorkspace() {
    Logger.info('Navigating to legacy/non-standard workspace');
    await this.page.goto((config.supportWorkspaceUrl || 'https://support.example.com') + '/legacy');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    Logger.info(`Logging in with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    Logger.info('Login completed');
  }

  async openMemberCase(caseId) {
    Logger.info(`Opening member case: ${caseId}`);
    await expect(this.caseSearchInput).toBeVisible();
    await this.caseSearchInput.fill(caseId);
    await this.caseSearchButton.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.caseDetailsSection).toBeVisible();
    Logger.info(`Case ${caseId} opened successfully`);
  }

  async addSymptom(symptomText) {
    Logger.info(`Adding symptom: ${symptomText}`);
    await expect(this.addSymptomButton).toBeVisible();
    await this.addSymptomButton.click();
    await expect(this.symptomInput).toBeVisible();
    await this.symptomInput.fill(symptomText);
    await this.saveSymptomButton.click();
    await this.page.waitForTimeout(1000); // Wait for symptom to be saved
    Logger.info('Symptom added successfully');
  }

  async addNewSymptom(symptomText) {
    Logger.info(`Adding new symptom: ${symptomText}`);
    await this.addSymptom(symptomText);
  }

  async simulateTelemetryUpdate(errorCode) {
    Logger.info(`Simulating telemetry update with error code: ${errorCode}`);
    await expect(this.telemetrySimulationPanel).toBeVisible();
    await this.telemetryErrorCodeInput.fill(errorCode);
    await this.triggerTelemetryButton.click();
    await this.page.waitForTimeout(500); // Wait for telemetry to be processed
    Logger.info('Telemetry update triggered');
  }

  async simulateMalformedTelemetryUpdate() {
    Logger.info('Simulating malformed telemetry update');
    await expect(this.telemetrySimulationPanel).toBeVisible();
    await this.malformedTelemetryToggle.check();
    await this.triggerTelemetryButton.click();
    await this.page.waitForTimeout(500);
    Logger.info('Malformed telemetry update triggered');
  }

  async simulateDelayedTelemetryUpdate(delaySeconds) {
    Logger.info(`Simulating delayed telemetry update with ${delaySeconds} seconds delay`);
    await expect(this.telemetrySimulationPanel).toBeVisible();
    await this.delayedTelemetryInput.fill(delaySeconds.toString());
    await this.triggerTelemetryButton.click();
    Logger.info('Delayed telemetry update triggered');
  }

  async switchToCaseDetails() {
    Logger.info('Switching to case details view');
    const caseDetailsTab = this.page.locator('[data-testid="case-details-tab"]');
    await expect(caseDetailsTab).toBeVisible();
    await caseDetailsTab.click();
    await expect(this.caseDetailsSection).toBeVisible();
  }
};
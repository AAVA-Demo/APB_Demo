const { test, expect } = require('@playwright/test');
const { SupportWorkspacePage } = require('./pages/supportWorkspace.page');
const { DiagnosticPanelPage } = require('./pages/diagnosticPanel.page');
const { RemediationPage } = require('./pages/remediation.page');
const { AIRecommendationsPage } = require('./pages/aiRecommendations.page');
const { ReportingPage } = require('./pages/reporting.page');
const { ActionPromptPage } = require('./pages/actionPrompt.page');

test.describe('SCRUM-33199 - Real-Time Diagnostic Summary', () => {
  test('TS001 TC-001 - Verify real-time diagnostic summary with sufficient data', async ({ page }) => {
    const workspacePage = new SupportWorkspacePage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Log into the standard support workspace as a support agent
    await workspacePage.navigate();
    await workspacePage.login('valid_username', 'valid_password');
    await expect(workspacePage.workspaceDashboard).toBeVisible();

    // Step 2: Open a member's case that has sufficient diagnostic data
    await workspacePage.openMemberCase('M-001', 'C-RTD-001');
    await expect(workspacePage.caseDetailsSection).toBeVisible();
    await expect(diagnosticPanel.diagnosticPanelContainer).toBeVisible();

    // Step 3: Navigate to and expand the diagnostic panel
    await diagnosticPanel.expandDiagnosticPanel();
    await expect(diagnosticPanel.analysisSummarySection).toBeVisible();

    // Step 4: Allow the system to analyze the member's data
    await diagnosticPanel.waitForAnalysisToComplete();
    await expect(diagnosticPanel.progressIndicator).not.toBeVisible();

    // Step 5: Observe the real-time diagnostic summary
    await expect(diagnosticPanel.rootCauseText).toBeVisible();
    await expect(diagnosticPanel.contributingFactorsList).toBeVisible();
    const rootCause = await diagnosticPanel.getRootCause();
    expect(rootCause).toBeTruthy();

    // Step 6: Cross-check the diagnostic summary against underlying case data
    const caseTimeline = await workspacePage.getCaseTimeline();
    const agentNotes = await workspacePage.getAgentNotes();
    expect(caseTimeline).toBeTruthy();
    expect(agentNotes).toBeTruthy();
  });

  test('TS002 TC-001 - Verify diagnostic summary with ambiguous data patterns', async ({ page }) => {
    const workspacePage = new SupportWorkspacePage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Log into the standard support workspace
    await workspacePage.navigate();
    await workspacePage.login('valid_username', 'valid_password');
    await expect(workspacePage.workspaceDashboard).toBeVisible();

    // Step 2: Open a member case with ambiguous data
    await workspacePage.openMemberCase('M-002', 'C-RTD-002');
    await expect(workspacePage.caseDetailsSection).toBeVisible();
    await expect(diagnosticPanel.diagnosticPanelContainer).toBeVisible();

    // Step 3: Access the diagnostic panel and trigger analysis
    await diagnosticPanel.expandDiagnosticPanel();
    await diagnosticPanel.triggerAnalysis();
    await expect(diagnosticPanel.analysisInProgressIndicator).toBeVisible();

    // Step 4: Measure time taken for diagnostic summary
    const startTime = Date.now();
    await diagnosticPanel.waitForAnalysisToComplete(35000);
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;
    
    if (timeTaken > 30) {
      await expect(diagnosticPanel.timeoutWarningIndicator).toBeVisible();
    }

    // Step 5: Review the generated diagnostic summary for contradictions
    const summary = await diagnosticPanel.getDiagnosticSummary();
    const caseData = await workspacePage.getCaseData();
    
    if (summary && caseData) {
      const hasContradiction = await diagnosticPanel.checkForContradictions(summary, caseData);
      if (hasContradiction) {
        await expect(diagnosticPanel.errorLogIndicator).toBeVisible();
      }
    }
  });
});

test.describe('SCRUM-33198 - Remediation Instructions', () => {
  test('TS001 TC-001 - Verify remediation instructions for diagnosed issue', async ({ page }) => {
    const workspacePage = new SupportWorkspacePage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);
    const remediationPage = new RemediationPage(page);

    // Step 1: Log into the standard support workspace
    await workspacePage.navigate();
    await workspacePage.login('valid_username', 'valid_password');
    await expect(workspacePage.workspaceDashboard).toBeVisible();

    // Step 2: Open a member issue with identified diagnosis
    await workspacePage.openMemberCase('M-010', 'C-REM-001');
    await expect(workspacePage.caseDetailsSection).toBeVisible();
    await expect(diagnosticPanel.diagnosticPanelContainer).toBeVisible();

    // Step 3: Locate and open remediation instructions section
    await remediationPage.openRemediationInstructions();
    await expect(remediationPage.remediationStepsList).toBeVisible();

    // Step 4: Review displayed remediation steps for order and completeness
    const steps = await remediationPage.getRemediationSteps();
    expect(steps.length).toBeGreaterThan(0);
    await remediationPage.verifyStepsAreOrdered(steps);

    // Step 5: Validate each remediation step aligns with diagnosed issue
    const diagnosedIssue = await diagnosticPanel.getDiagnosedIssue();
    const stepsAligned = await remediationPage.verifyStepsAlignWithIssue(steps, diagnosedIssue);
    expect(stepsAligned).toBe(true);
  });

  test('TS002 TC-001 - Verify remediation instructions error handling', async ({ page }) => {
    const workspacePage = new SupportWorkspacePage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);
    const remediationPage = new RemediationPage(page);

    // Step 1: Log into the standard support workspace
    await workspacePage.navigate();
    await workspacePage.login('valid_username', 'valid_password');
    await expect(workspacePage.workspaceDashboard).toBeVisible();

    // Step 2: Open a member case with recently identified issue
    await workspacePage.openMemberCase('M-011', 'C-REM-002');
    await expect(workspacePage.caseDetailsSection).toBeVisible();
    await expect(diagnosticPanel.diagnosticPanelContainer).toBeVisible();

    // Step 3: Attempt to open remediation instructions section
    await remediationPage.clickRemediationLink();
    
    const isLoaded = await remediationPage.isRemediationSectionLoaded();
    if (!isLoaded) {
      await expect(remediationPage.errorMessage).toBeVisible();
    }

    // Step 4: Verify ordering and completeness if steps are displayed
    if (isLoaded) {
      const steps = await remediationPage.getRemediationSteps();
      if (steps.length > 0) {
        const hasOrdering = await remediationPage.checkStepNumbering(steps);
        const hasGaps = await remediationPage.checkForGaps(steps);
        expect(hasOrdering || !hasGaps).toBe(true);
      }
    }

    // Step 5: Check for inconsistent remediation steps
    if (isLoaded) {
      const diagnosedIssue = await diagnosticPanel.getDiagnosedIssue();
      const steps = await remediationPage.getRemediationSteps();
      const hasInconsistency = await remediationPage.checkStepInconsistency(steps, diagnosedIssue);
      
      if (hasInconsistency) {
        await expect(remediationPage.inconsistencyFlag).toBeVisible();
      }
    }
  });
});

test.describe('SCRUM-33197 - AI Recommendations with Context', () => {
  test('TS001 TC-001 - Verify AI recommendations use context without exposing sensitive data', async ({ page }) => {
    const workspacePage = new SupportWorkspacePage(page);
    const aiRecommendationsPage = new AIRecommendationsPage(page);

    // Step 1: Log into the support workspace
    await workspacePage.navigate();
    await workspacePage.login('valid_username', 'valid_password');
    await expect(workspacePage.workspaceDashboard).toBeVisible();

    // Step 2: Open a member case with rich profile data
    await workspacePage.openMemberCase('M-020', 'C-AI-CTX-001');
    await expect(workspacePage.profileSummary).toBeVisible();
    await expect(workspacePage.interactionHistory).toBeVisible();

    // Step 3: Navigate to AI recommendations section
    await aiRecommendationsPage.navigateToRecommendations();
    await expect(aiRecommendationsPage.recommendationsPanel).toBeVisible();

    // Step 4: Trigger AI recommendation generation
    await aiRecommendationsPage.generateRecommendations('Service outage', 'High');
    await expect(aiRecommendationsPage.recommendationsContent).toBeVisible();

    // Step 5: Review content of generated recommendations
    const recommendations = await aiRecommendationsPage.getRecommendationsText();
    expect(recommendations).toBeTruthy();
    
    const hasSensitiveData = await aiRecommendationsPage.checkForSensitiveData(recommendations);
    expect(hasSensitiveData).toBe(false);
    
    const hasContextReference = await aiRecommendationsPage.checkForContextReference(recommendations);
    expect(hasContextReference).toBe(true);
  });

  test('TS002 TC-001 - Verify AI recommendations quality and data protection', async ({ page }) => {
    const workspacePage = new SupportWorkspacePage(page);
    const aiRecommendationsPage = new AIRecommendationsPage(page);

    // Step 1: Log into the support workspace
    await workspacePage.navigate();
    await workspacePage.login('valid_username', 'valid_password');
    await expect(workspacePage.workspaceDashboard).toBeVisible();

    // Step 2: Open a member case with well-defined context
    await workspacePage.openMemberCase('M-021', 'C-AI-CTX-002');
    await expect(workspacePage.caseDetailsSection).toBeVisible();
    await expect(workspacePage.interactionHistory).toBeVisible();

    // Step 3: Access AI recommendations section
    await aiRecommendationsPage.navigateToRecommendations();
    await expect(aiRecommendationsPage.recommendationsPanel).toBeVisible();

    // Step 4: Trigger AI recommendation generation and inspect
    await aiRecommendationsPage.generateRecommendations();
    const recommendations = await aiRecommendationsPage.getRecommendationsText();
    
    const isGeneric = await aiRecommendationsPage.checkIfGeneric(recommendations);
    const isRelevant = await aiRecommendationsPage.checkRelevanceToIssue(recommendations);
    
    if (isGeneric || !isRelevant) {
      await aiRecommendationsPage.logRecommendationIssue();
    }

    // Step 5: Verify no sensitive personal data is exposed
    const hasSensitiveData = await aiRecommendationsPage.checkForSensitiveData(recommendations);
    expect(hasSensitiveData).toBe(false);
  });
});

test.describe('SCRUM-33196 - Reporting Metrics', () => {
  test('TS001 TC-001 - Verify efficiency metrics for AI-assisted issues', async ({ page }) => {
    const workspacePage = new SupportWorkspacePage(page);
    const reportingPage = new ReportingPage(page);

    // Step 1: Log into the support workspace as team lead
    await workspacePage.navigate();
    await workspacePage.login('lead_username', 'lead_password');
    await expect(reportingPage.reportingDashboard).toBeVisible();

    // Step 2: Navigate to diagnostic panel's reporting view
    await reportingPage.navigateToReporting();
    await expect(reportingPage.filtersSection).toBeVisible();
    await expect(reportingPage.metricsSection).toBeVisible();

    // Step 3: Apply filter for AI-assisted member issues
    await reportingPage.applyFilter('AI-assisted', true);
    await reportingPage.setDateRange('last 30 days');
    await expect(reportingPage.filteredResults).toBeVisible();

    // Step 4: Observe displayed metrics
    const avgResolutionTime = await reportingPage.getAverageResolutionTime();
    const avgStepsPerCase = await reportingPage.getAverageStepsPerCase();
    
    expect(avgResolutionTime).toBeTruthy();
    expect(avgStepsPerCase).toBeTruthy();

    // Step 5: Verify no sensitive information is shown
    const hasSensitiveInfo = await reportingPage.checkForSensitiveInformation();
    expect(hasSensitiveInfo).toBe(false);
  });

  test('TS002 TC-001 - Verify reporting metrics error handling and data protection', async ({ page }) => {
    const workspacePage = new SupportWorkspacePage(page);
    const reportingPage = new ReportingPage(page);

    // Step 1: Log into the support workspace as team lead
    await workspacePage.navigate();
    await workspacePage.login('lead_username', 'lead_password');
    await expect(workspacePage.workspaceDashboard).toBeVisible();

    // Step 2: Open diagnostic panel's reporting view
    await reportingPage.navigateToReporting();
    await expect(reportingPage.filtersSection).toBeVisible();
    await expect(reportingPage.metricsSection).toBeVisible();

    // Step 3: Apply filter for AI-assisted issues
    await reportingPage.applyFilter('AI-assisted', true);
    await reportingPage.setDateRange('last 7 days');

    // Step 4: Check whether efficiency metrics are displayed
    const metricsLoaded = await reportingPage.areMetricsLoaded();
    
    if (!metricsLoaded) {
      await expect(reportingPage.errorIndicator).toBeVisible();
    } else {
      const metricsValues = await reportingPage.getMetricsValues();
      const hasEmptyValues = await reportingPage.checkForEmptyMetrics(metricsValues);
      
      if (hasEmptyValues) {
        await expect(reportingPage.warningIndicator).toBeVisible();
      }
    }

    // Step 5: Inspect metrics view for sensitive information
    const hasSensitiveInfo = await reportingPage.checkForSensitiveInformation();
    expect(hasSensitiveInfo).toBe(false);
  });
});

test.describe('SCRUM-33195 - Actionable Prompts', () => {
  test('TS001 TC-001 - Verify actionable prompt for next recommended step', async ({ page }) => {
    const workspacePage = new SupportWorkspacePage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);
    const actionPromptPage = new ActionPromptPage(page);

    // Step 1: Log into the standard support workspace
    await workspacePage.navigate();
    await workspacePage.login('valid_username', 'valid_password');
    await expect(workspacePage.workspaceDashboard).toBeVisible();

    // Step 2: Open an active member issue
    await workspacePage.openMemberCase('M-030', 'C-ACT-PROMPT-001');
    await expect(workspacePage.caseDetailsSection).toBeVisible();
    await expect(diagnosticPanel.diagnosticPanelContainer).toBeVisible();

    // Step 3: Trigger AI analysis for next recommended step
    await actionPromptPage.triggerAIAnalysis('Subscription upgrade failure');
    await expect(actionPromptPage.recommendedActionSection).toBeVisible();

    // Step 4: Observe the prompt shown to the agent
    const promptText = await actionPromptPage.getPromptText();
    expect(promptText).toBeTruthy();
    
    const isClearAndActionable = await actionPromptPage.isPromptClearAndActionable(promptText);
    expect(isClearAndActionable).toBe(true);

    // Step 5: Validate prompt aligns with issue context
    const caseHistory = await workspacePage.getCaseHistory();
    const alignsWithContext = await actionPromptPage.verifyPromptAlignment(promptText, caseHistory);
    expect(alignsWithContext).toBe(true);
  });

  test('TS002 TC-001 - Verify actionable prompt error handling and clarity', async ({ page }) => {
    const workspacePage = new SupportWorkspacePage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);
    const actionPromptPage = new ActionPromptPage(page);

    // Step 1: Log into the standard support workspace
    await workspacePage.navigate();
    await workspacePage.login('valid_username', 'valid_password');
    await expect(workspacePage.workspaceDashboard).toBeVisible();

    // Step 2: Open a member issue for AI recommendation
    await workspacePage.openMemberCase('M-031', 'C-ACT-PROMPT-002');
    await expect(workspacePage.caseDetailsSection).toBeVisible();
    await expect(diagnosticPanel.diagnosticPanelContainer).toBeVisible();

    // Step 3: Trigger AI analysis for next best action
    await actionPromptPage.triggerAIAnalysis('Account access problem');
    await expect(actionPromptPage.processingIndicator).not.toBeVisible();

    // Step 4: Check whether any prompt is displayed
    const isPromptDisplayed = await actionPromptPage.isPromptDisplayed();
    
    if (!isPromptDisplayed) {
      await expect(actionPromptPage.fallbackMessage).toBeVisible();
    }

    // Step 5: Assess prompt clarity and actionability if present
    if (isPromptDisplayed) {
      const promptText = await actionPromptPage.getPromptText();
      const isAmbiguous = await actionPromptPage.isPromptAmbiguous(promptText);
      const hasConflictingInstructions = await actionPromptPage.hasConflictingInstructions(promptText);
      
      expect(isAmbiguous).toBe(false);
      expect(hasConflictingInstructions).toBe(false);
    }
  });
});

test.describe('SCRUM-33194 - Embedded Diagnostic Panel', () => {
  test('TS001 TC-001 - Verify diagnostic panel is embedded without separate authentication', async ({ page }) => {
    const workspacePage = new SupportWorkspacePage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Log into the standard support workspace
    await workspacePage.navigate();
    await workspacePage.login('valid_username', 'valid_password');
    await expect(workspacePage.workspaceDashboard).toBeVisible();

    // Step 2: Open any member issue from workspace
    await workspacePage.openMemberCase('M-040', 'C-EMB-001');
    await expect(workspacePage.caseDetailsSection).toBeVisible();

    // Step 3: Verify diagnostic panel is embedded within workspace
    await expect(diagnosticPanel.diagnosticPanelContainer).toBeVisible();
    const isEmbedded = await diagnosticPanel.isPanelEmbeddedInWorkspace();
    expect(isEmbedded).toBe(true);

    // Step 4: Confirm no separate login prompt for diagnostic panel
    const hasLoginPrompt = await diagnosticPanel.hasLoginPrompt();
    expect(hasLoginPrompt).toBe(false);
    
    const hasCredentialRequest = await diagnosticPanel.hasCredentialRequest();
    expect(hasCredentialRequest).toBe(false);

    // Step 5: Inspect panel for exposed credentials or tokens
    const hasExposedCredentials = await diagnosticPanel.checkForExposedCredentials();
    expect(hasExposedCredentials).toBe(false);
  });

  test('TS002 TC-001 - Verify diagnostic panel error handling and security', async ({ page }) => {
    const workspacePage = new SupportWorkspacePage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Log into the standard support workspace
    await workspacePage.navigate();
    await workspacePage.login('valid_username', 'valid_password');
    await expect(workspacePage.workspaceDashboard).toBeVisible();

    // Step 2: Open a member issue from workspace
    await workspacePage.openMemberCase('M-041', 'C-EMB-002');
    await expect(workspacePage.caseDetailsSection).toBeVisible();

    // Step 3: Observe whether diagnostic panel loads
    const isPanelLoaded = await diagnosticPanel.isPanelLoaded();
    
    if (!isPanelLoaded) {
      await expect(diagnosticPanel.errorMessage).toBeVisible();
    }

    // Step 4: Check for separate window/iframe with login prompts
    const openedInSeparateWindow = await diagnosticPanel.isOpenedInSeparateWindow();
    
    if (openedInSeparateWindow) {
      const hasSeparateLogin = await diagnosticPanel.hasSeparateLoginPrompt();
      expect(hasSeparateLogin).toBe(false);
    }

    // Step 5: Check for exposed credentials or tokens
    const hasExposedSecrets = await diagnosticPanel.checkForExposedSecrets();
    expect(hasExposedSecrets).toBe(false);
  });
});

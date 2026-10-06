const { test, expect } = require('@playwright/test');
const { DiagnosticPanelPage } = require('./pages/diagnosticPanel.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Diagnostic Panel - Real-time Updates (SCRUM-33414)', () => {
  test('TC-3996: Diagnostic insights update in real time after member data change', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Launch and login as agent
    await loginPage.navigate();
    await loginPage.login('agent_user01', 'Password01!');
    await expect(page).toHaveURL(/dashboard/);

    // Step 2: Open active member case
    await diagnosticPanel.openMemberCase('M-1001');
    await diagnosticPanel.verifyDiagnosticPanelVisible();
    await diagnosticPanel.verifyDiagnosticInsightsDisplayed();

    // Step 3: Update member data
    await diagnosticPanel.updateMemberContactPhone('555-0123');
    await diagnosticPanel.addInteractionNote('Member reported new symptom');
    await diagnosticPanel.verifyDataUpdateSuccess();

    // Step 4: Observe diagnostic panel for real-time update
    await diagnosticPanel.waitForDiagnosticPanelUpdate();

    // Step 5: Validate updated insights
    await diagnosticPanel.verifyInsightContains('New symptom detected for member M-1001');
    await diagnosticPanel.verifyInsightTimestampIsCurrent();
    await diagnosticPanel.verifyNoStaleInsights();
  });

  test('TC-3997: Diagnostic panel fails to update or shows stale data (Negative)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Login and open member case
    await loginPage.navigate();
    await loginPage.login('agent_user02', 'Password02!');
    await diagnosticPanel.openMemberCase('M-1002');
    await diagnosticPanel.verifyDiagnosticPanelVisible();
    await diagnosticPanel.verifyDiagnosticInsightsDisplayed();

    // Step 2: Perform significant data change
    await diagnosticPanel.addClinicalEvent('ER visit');
    await diagnosticPanel.changePlanStatus('Standard', 'Premium');
    await diagnosticPanel.verifyDataChangeVisible();

    // Step 3: Monitor for update within refresh window
    const updateOccurred = await diagnosticPanel.waitForDiagnosticPanelUpdate(10000);

    // Step 4: Compare displayed insights with updated data
    const isStale = await diagnosticPanel.checkForStaleInsights('No recent ER visits', 'Standard');

    // Step 5: Document stale behavior
    await diagnosticPanel.captureStaleInsightEvidence();
    expect(isStale).toBe(true);
  });
});

test.describe('Diagnostic Panel - AI Remediation Steps (SCRUM-33413)', () => {
  test('TC-3998: AI generates clear, ordered, and relevant remediation steps', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Login and open member case with detectable issue
    await loginPage.navigate();
    await loginPage.login('agent_user01', 'Password01!');
    await diagnosticPanel.openMemberCase('M-2001');
    await diagnosticPanel.verifyDiagnosticPanelVisible();

    // Step 2: Allow AI to detect issue and generate remediation
    await diagnosticPanel.waitForIssueDetection('overdue premium payment');
    await diagnosticPanel.waitForAIRemediationGeneration();

    // Step 3: Review remediation section
    await diagnosticPanel.verifyRemediationSectionVisible();
    const steps = await diagnosticPanel.getRemediationSteps();
    await diagnosticPanel.verifyStepsAreOrdered(steps);

    // Step 4: Validate step relevance
    await diagnosticPanel.verifyStepRelevance(steps, 'overdue payment');
    await diagnosticPanel.verifyNoIrrelevantSteps(steps, ['Review unrelated benefits history']);
  });

  test('TC-3999: AI remediation steps are incomplete, unordered, or unrelated (Negative)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Login and open member case
    await loginPage.navigate();
    await loginPage.login('agent_user01', 'Password01!');
    await diagnosticPanel.openMemberCase('M-2002');
    await diagnosticPanel.verifyDiagnosticPanelVisible();

    // Step 2: Wait for AI remediation generation
    await diagnosticPanel.waitForIssueDetection('coverage eligibility discrepancy');
    await diagnosticPanel.waitForAIRemediationGeneration();

    // Step 3: Inspect remediation output
    const remediationUsable = await diagnosticPanel.assessRemediationUsability();

    // Step 4: Assess usability
    expect(remediationUsable).toBe(false);
    await diagnosticPanel.captureRemediationFailureEvidence();
  });
});

test.describe('Diagnostic Panel - Contextual Analysis (SCRUM-33412)', () => {
  test('TC-4000: Diagnostic analysis uses both historical and current member data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Login and open member case with rich data
    await loginPage.navigate();
    await loginPage.login('agent_user01', 'Password01!');
    await diagnosticPanel.openMemberCase('M-3001');
    await diagnosticPanel.verifyDiagnosticPanelVisible();

    // Step 2: Trigger diagnostic analysis
    await diagnosticPanel.triggerDiagnosticAnalysis();
    await diagnosticPanel.waitForAnalysisCompletion();

    // Step 3: Review issues and recommendations
    const recommendations = await diagnosticPanel.getRecommendations();
    await diagnosticPanel.verifyRecommendationReferencesHistory(recommendations, ['chronic condition', 'missed appointments']);
    await diagnosticPanel.verifyRecommendationReferencesCurrent(recommendations, ['lab results', 'new complaint']);

    // Step 4: Confirm relevance
    await diagnosticPanel.verifyRecommendationsAreContextRelevant(recommendations);
    await diagnosticPanel.verifyNoGenericRecommendations(recommendations);
  });

  test('TC-4001: Diagnostic analysis ignores context and produces generic output (Negative)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Open member case with rich data
    await loginPage.navigate();
    await loginPage.login('agent_user01', 'Password01!');
    await diagnosticPanel.openMemberCase('M-3002');
    await diagnosticPanel.verifyDiagnosticPanelVisible();

    // Step 2: Run diagnostic analysis
    await diagnosticPanel.triggerDiagnosticAnalysis();
    await diagnosticPanel.waitForAnalysisCompletion();

    // Step 3: Evaluate context usage
    const isContextInsensitive = await diagnosticPanel.checkForContextInsensitiveOutput(['No prior history found', 'first-time visit']);

    // Step 4: Flag output
    expect(isContextInsensitive).toBe(true);
    await diagnosticPanel.captureContextInsensitiveEvidence();
  });
});

test.describe('Diagnostic Panel - Guided Issue Resolution (SCRUM-33411)', () => {
  test('TC-4002: Guided workflow executes remediation steps with clear progression', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Login and open member case with remediation steps
    await loginPage.navigate();
    await loginPage.login('agent_user01', 'Password01!');
    await diagnosticPanel.openMemberCase('M-4001');
    await diagnosticPanel.verifyRemediationStepsVisible();

    // Step 2: Start guided workflow
    await diagnosticPanel.startGuidedWorkflow();
    await diagnosticPanel.verifyWorkflowInitiated();
    await diagnosticPanel.verifyCurrentStepDisplayed('Verify required enrollment documents');

    // Step 3: Complete first step
    await diagnosticPanel.performStepAction('confirm receipt of all required documents');
    await diagnosticPanel.markStepComplete(1);
    await diagnosticPanel.verifyStepStatus(1, 'Completed');
    await diagnosticPanel.verifyWorkflowProgressedToNextStep();

    // Step 4: Complete remaining steps
    await diagnosticPanel.performStepAction('confirm eligibility');
    await diagnosticPanel.markStepComplete(2);
    await diagnosticPanel.verifyStepStatus(2, 'Completed');
    await diagnosticPanel.performStepAction('finalize enrollment in system');
    await diagnosticPanel.markStepComplete(3);
    await diagnosticPanel.verifyStepStatus(3, 'Completed');

    // Step 5: Verify issue resolved
    await diagnosticPanel.verifyIssueMarkedResolved();
    await diagnosticPanel.verifyWorkflowFullyCompleted();
  });

  test('TC-4003: Guided workflow fails to progress or update completion status (Negative)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Open member case with remediation steps
    await loginPage.navigate();
    await loginPage.login('agent_user01', 'Password01!');
    await diagnosticPanel.openMemberCase('M-4002');
    await diagnosticPanel.verifyRemediationStepsVisible();

    // Step 2: Start workflow and inspect first step
    await diagnosticPanel.startGuidedWorkflow();
    const firstStepClear = await diagnosticPanel.verifyStepHasClearActions(1);

    // Step 3: Attempt to complete step
    await diagnosticPanel.markStepComplete(1);
    const statusUpdated = await diagnosticPanel.checkStepStatusUpdated(1);

    // Step 4: Continue attempting progression
    const workflowProgressed = await diagnosticPanel.checkWorkflowProgression();
    const issueResolved = await diagnosticPanel.checkIssueResolved();

    expect(firstStepClear && statusUpdated && workflowProgressed).toBe(false);
  });
});

test.describe('Diagnostic Panel - AI Confidence Indicators (SCRUM-33410)', () => {
  test('TC-4004: Confidence indicators accurately reflect AI engine confidence values', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Login and open member case
    await loginPage.navigate();
    await loginPage.login('agent_user01', 'Password01!');
    await diagnosticPanel.openMemberCase('M-5001');
    await diagnosticPanel.verifyDiagnosticPanelVisible();

    // Step 2: Capture AI confidence values
    const actualConfidenceValues = await diagnosticPanel.captureAIConfidenceValues();

    // Step 3: Review displayed confidence indicators
    const displayedIndicators = await diagnosticPanel.getDisplayedConfidenceIndicators();
    await diagnosticPanel.verifyAllInsightsHaveConfidenceIndicators(displayedIndicators);

    // Step 4: Compare displayed with actual
    await diagnosticPanel.verifyConfidenceIndicatorsMatchActual(displayedIndicators, actualConfidenceValues);
    await diagnosticPanel.verifyNoConfidenceMismatches(displayedIndicators, actualConfidenceValues);
  });

  test('TC-4005: Confidence indicators are omitted or misleading for low-confidence insights (Negative)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Open member case with low-confidence insights
    await loginPage.navigate();
    await loginPage.login('agent_user01', 'Password01!');
    await diagnosticPanel.openMemberCase('M-5002');
    await diagnosticPanel.verifyDiagnosticPanelVisible();

    // Step 2: Check confidence indicators for low-confidence insights
    const indicatorsOmittedOrMisleading = await diagnosticPanel.checkLowConfidenceIndicators();

    // Step 3: Assess agent ability to judge reliability
    expect(indicatorsOmittedOrMisleading).toBe(true);
    await diagnosticPanel.captureConfidenceIndicatorFailure();
  });
});

test.describe('Diagnostic Panel - Automatic Refresh (SCRUM-33409)', () => {
  test('TC-4006: Panel automatically refreshes and updates when new member data is added', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Login and open member case
    await loginPage.navigate();
    await loginPage.login('agent_user01', 'Password01!');
    await diagnosticPanel.openMemberCase('M-6001');
    await diagnosticPanel.verifyDiagnosticPanelVisible();
    await diagnosticPanel.verifyCurrentInsightsDisplayed();

    // Step 2: Add new member data
    await diagnosticPanel.addNewLabResult('condition change indicator');
    await diagnosticPanel.verifyNewDataAdded();

    // Step 3: Observe automatic refresh
    await diagnosticPanel.waitForAutomaticRefresh(15000);
    await diagnosticPanel.verifyPanelRefreshedAutomatically();

    // Step 4: Validate updated content
    await diagnosticPanel.verifyInsightReflectsNewData('Schedule urgent follow-up');
    await diagnosticPanel.verifyNoOutdatedDetails();
  });

  test('TC-4007: Automatic refresh fails and panel shows stale data or error (Negative)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Open member case
    await loginPage.navigate();
    await loginPage.login('agent_user01', 'Password01!');
    await diagnosticPanel.openMemberCase('M-6002');
    await diagnosticPanel.verifyDiagnosticPanelVisible();
    await diagnosticPanel.verifyCurrentInsightsDisplayed();

    // Step 2: Add new member data
    await diagnosticPanel.addHighRiskFlag('hospitalization');
    await diagnosticPanel.verifyNewDataRecorded();

    // Step 3: Monitor for automatic refresh failure
    const refreshFailed = await diagnosticPanel.checkAutomaticRefreshFailure();

    // Step 4: Confirm failure behavior
    expect(refreshFailed).toBe(true);
    await diagnosticPanel.captureRefreshFailureEvidence();
  });
});
const { test, expect } = require('@playwright/test');
const { SupportAgentWorkspacePage } = require('./pages/supportAgentWorkspace.page');
const { DiagnosticPanelPage } = require('./pages/diagnosticPanel.page');
const { Logger } = require('../../utils/logger');

test.describe('Diagnostic Panel - AI Insights and Telemetry Updates', () => {
  let workspacePage;
  let diagnosticPanelPage;

  test.beforeEach(async ({ page }) => {
    workspacePage = new SupportAgentWorkspacePage(page);
    diagnosticPanelPage = new DiagnosticPanelPage(page);
    Logger.info('Starting test setup');
  });

  test('TC-4208: Verify diagnostic panel refreshes with updated AI insights after telemetry/case context update', async ({ page }) => {
    Logger.info('Test Case 4208: Testing diagnostic panel refresh with telemetry updates');
    
    // Step 1: Launch and login
    await workspacePage.navigate();
    await workspacePage.login('agent_user', 'ValidPass@123');
    await expect(workspacePage.mainWorkspace).toBeVisible();
    Logger.info('Step 1: Agent logged in successfully');

    // Step 2: Open member case with telemetry enabled
    await workspacePage.openMemberCase('MC-1001');
    await expect(workspacePage.caseDetailsSection).toBeVisible();
    await expect(diagnosticPanelPage.diagnosticPanelEntryPoint).toBeVisible();
    Logger.info('Step 2: Member case MC-1001 loaded with diagnostic panel entry point visible');

    // Step 3: Open diagnostic panel
    await diagnosticPanelPage.openDiagnosticPanel();
    await expect(diagnosticPanelPage.diagnosticPanelContainer).toBeVisible();
    const initialInsights = await diagnosticPanelPage.getDisplayedInsights();
    Logger.info('Step 3: Diagnostic panel opened with initial AI insights');

    // Step 4: Trigger telemetry update
    await workspacePage.addNewSymptom('Frequent disconnects');
    await workspacePage.simulateTelemetryUpdate('0xE12');
    Logger.info('Step 4: New telemetry and symptom data triggered');

    // Step 5: Observe panel refresh
    await diagnosticPanelPage.waitForPanelRefresh();
    await expect(diagnosticPanelPage.diagnosticPanelContainer).toBeVisible();
    const updatedInsights = await diagnosticPanelPage.getDisplayedInsights();
    await expect(diagnosticPanelPage.insightReferencingNewData('Frequent disconnects')).toBeVisible();
    Logger.info('Step 5: Panel refreshed with updated insights referencing new data');

    // Step 6: Compare insights before and after
    expect(updatedInsights).not.toEqual(initialInsights);
    await diagnosticPanelPage.verifyNoOutdatedRecommendations();
    Logger.info('Step 6: Verified insights changed appropriately and no outdated recommendations shown');
  });

  test('TC-4209: Verify diagnostic panel handles malformed/failed telemetry updates gracefully', async ({ page }) => {
    Logger.info('Test Case 4209: Testing diagnostic panel behavior with malformed telemetry');
    
    // Step 1: Launch and login
    await workspacePage.navigate();
    await workspacePage.login('agent_user', 'ValidPass@123');
    await expect(workspacePage.mainWorkspace).toBeVisible();
    Logger.info('Step 1: Agent logged in successfully');

    // Step 2: Open member case
    await workspacePage.openMemberCase('MC-1002');
    await expect(workspacePage.caseDetailsSection).toBeVisible();
    await expect(diagnosticPanelPage.diagnosticPanelEntryPoint).toBeVisible();
    Logger.info('Step 2: Member case MC-1002 loaded');

    // Step 3: Open diagnostic panel and verify valid insights
    await diagnosticPanelPage.openDiagnosticPanel();
    await expect(diagnosticPanelPage.diagnosticPanelContainer).toBeVisible();
    const validInsights = await diagnosticPanelPage.getDisplayedInsights();
    expect(validInsights.length).toBeGreaterThan(0);
    Logger.info('Step 3: Valid AI insights displayed initially');

    // Step 4: Simulate malformed telemetry update
    await workspacePage.simulateMalformedTelemetryUpdate();
    Logger.info('Step 4: Malformed telemetry update simulated');

    // Step 5: Observe panel behavior
    await diagnosticPanelPage.waitForUpdateProcessing();
    const currentInsights = await diagnosticPanelPage.getDisplayedInsights();
    expect(currentInsights).toEqual(validInsights);
    await expect(diagnosticPanelPage.dataNotCurrentIndicator).toBeVisible();
    Logger.info('Step 5: Panel maintains last valid insights with data not current indication');

    // Step 6: Simulate delayed telemetry
    await workspacePage.simulateDelayedTelemetryUpdate(65);
    await diagnosticPanelPage.waitForUpdateProcessing();
    await diagnosticPanelPage.verifyNoPartialOrMisleadingUpdates();
    Logger.info('Step 6: Verified safe behavior with delayed telemetry');
  });
});

test.describe('Diagnostic Panel - AI Remediation Steps', () => {
  let workspacePage;
  let diagnosticPanelPage;

  test.beforeEach(async ({ page }) => {
    workspacePage = new SupportAgentWorkspacePage(page);
    diagnosticPanelPage = new DiagnosticPanelPage(page);
    Logger.info('Starting test setup');
  });

  test('TC-4210: Verify AI displays clear, ordered remediation steps for recognized issue patterns', async ({ page }) => {
    Logger.info('Test Case 4210: Testing AI remediation steps for known patterns');
    
    // Step 1: Login and open case with known pattern
    await workspacePage.navigate();
    await workspacePage.login('agent_user', 'ValidPass@123');
    await workspacePage.openMemberCase('MC-2001');
    await workspacePage.addSymptom('Cannot connect to Wi-Fi, error 0xWIFI123');
    Logger.info('Step 1: Case MC-2001 opened with known issue pattern');

    // Step 2: Open diagnostic panel
    await diagnosticPanelPage.openDiagnosticPanel();
    await expect(diagnosticPanelPage.diagnosticPanelContainer).toBeVisible();
    Logger.info('Step 2: Diagnostic panel opened');

    // Step 3: Trigger AI processing
    await diagnosticPanelPage.triggerAIProcessing();
    await diagnosticPanelPage.waitForAIProcessingComplete();
    Logger.info('Step 3: AI processing completed');

    // Step 4: Observe remediation section
    await expect(diagnosticPanelPage.remediationSection).toBeVisible();
    const remediationSteps = await diagnosticPanelPage.getRemediationSteps();
    expect(remediationSteps.length).toBeGreaterThan(0);
    await diagnosticPanelPage.verifyRemediationStepsAreOrdered();
    Logger.info('Step 4: Remediation steps displayed with clear ordering');

    // Step 5: Review content and ordering
    await diagnosticPanelPage.verifyRemediationStepsRelevance('Wi-Fi');
    await diagnosticPanelPage.verifyRemediationStepsLogicalOrder();
    Logger.info('Step 5: Remediation steps are relevant and logically ordered');
  });

  test('TC-4211: Verify system handles ambiguous/rare symptoms without misleading remediation', async ({ page }) => {
    Logger.info('Test Case 4211: Testing AI behavior with ambiguous symptoms');
    
    // Step 1: Login and open case with ambiguous symptoms
    await workspacePage.navigate();
    await workspacePage.login('agent_user', 'ValidPass@123');
    await workspacePage.openMemberCase('MC-2002');
    await workspacePage.addSymptom('Intermittent UI color flicker after obscure action');
    Logger.info('Step 1: Case MC-2002 opened with ambiguous symptoms');

    // Step 2: Open diagnostic panel and trigger AI
    await diagnosticPanelPage.openDiagnosticPanel();
    await diagnosticPanelPage.triggerAIProcessing();
    await diagnosticPanelPage.waitForAIProcessingComplete();
    Logger.info('Step 2: AI processing attempted for ambiguous case');

    // Step 3: Observe remediation section
    const hasRemediation = await diagnosticPanelPage.hasRemediationSteps();
    if (hasRemediation) {
      await expect(diagnosticPanelPage.lowConfidenceIndicator).toBeVisible();
    } else {
      await expect(diagnosticPanelPage.remediationUnavailableMessage).toBeVisible();
    }
    Logger.info('Step 3: System does not present misleading remediation');

    // Step 4: Verify messaging
    await diagnosticPanelPage.verifyRemediationUnavailableMessaging();
    Logger.info('Step 4: Clear messaging about unavailable AI guidance displayed');
  });
});

test.describe('Diagnostic Panel - Context-Aware Recommendations', () => {
  let workspacePage;
  let diagnosticPanelPage;

  test.beforeEach(async ({ page }) => {
    workspacePage = new SupportAgentWorkspacePage(page);
    diagnosticPanelPage = new DiagnosticPanelPage(page);
    Logger.info('Starting test setup');
  });

  test('TC-4212: Verify AI recommendations are context-aware based on symptoms and interaction history', async ({ page }) => {
    Logger.info('Test Case 4212: Testing context-aware AI recommendations');
    
    // Step 1: Login and open case with symptoms and history
    await workspacePage.navigate();
    await workspacePage.login('agent_user', 'ValidPass@123');
    await workspacePage.openMemberCase('MC-3001');
    await expect(workspacePage.symptomField).toContainText('Slow app performance on login');
    await expect(workspacePage.interactionHistory).toContainText('Support chat 24 hours ago');
    Logger.info('Step 1: Case MC-3001 opened with symptoms and interaction history');

    // Step 2: Open diagnostic panel and trigger AI
    await diagnosticPanelPage.openDiagnosticPanel();
    await diagnosticPanelPage.triggerAIRecommendations();
    await diagnosticPanelPage.waitForRecommendationsGenerated();
    Logger.info('Step 2: AI recommendations triggered');

    // Step 3: Review recommendations
    const recommendations = await diagnosticPanelPage.getRecommendations();
    await diagnosticPanelPage.verifyRecommendationsReferenceSymptoms('slow login performance');
    await diagnosticPanelPage.verifyRecommendationsReferenceHistory('previous unsuccessful troubleshooting');
    Logger.info('Step 3: Recommendations align with case symptoms and history');

    // Step 4: Check for generic recommendations
    await diagnosticPanelPage.verifyNoGenericRecommendations();
    Logger.info('Step 4: No generic or unrelated recommendations presented');
  });

  test('TC-4213: Verify system handles minimal/missing case context appropriately', async ({ page }) => {
    Logger.info('Test Case 4213: Testing AI behavior with minimal context');
    
    // Step 1: Login and open case with minimal context
    await workspacePage.navigate();
    await workspacePage.login('agent_user', 'ValidPass@123');
    await workspacePage.openMemberCase('MC-3002');
    await expect(workspacePage.symptomField).toBeEmpty();
    await diagnosticPanelPage.verifyNoInteractionHistory();
    Logger.info('Step 1: Case MC-3002 opened with insufficient context');

    // Step 2: Open diagnostic panel and trigger AI
    await diagnosticPanelPage.openDiagnosticPanel();
    await diagnosticPanelPage.triggerAIRecommendations();
    await diagnosticPanelPage.waitForRecommendationsGenerated();
    Logger.info('Step 2: AI recommendation generation triggered');

    // Step 3: Observe recommendation area
    const hasRecommendations = await diagnosticPanelPage.hasRecommendations();
    if (hasRecommendations) {
      await expect(diagnosticPanelPage.genericGuidanceLabel).toBeVisible();
      await expect(diagnosticPanelPage.genericGuidanceLabel).toContainText('Generic guidance due to limited case data');
    } else {
      await expect(diagnosticPanelPage.noRecommendationsMessage).toBeVisible();
    }
    Logger.info('Step 3: System handles insufficient context appropriately');

    // Step 4: Verify no misleading indication
    await diagnosticPanelPage.verifyNoContextAwareClaimsWhenContextMissing();
    Logger.info('Step 4: No misleading context-aware indication displayed');
  });
});

test.describe('Diagnostic Panel - Remediation Efficiency Ranking', () => {
  let workspacePage;
  let diagnosticPanelPage;

  test.beforeEach(async ({ page }) => {
    workspacePage = new SupportAgentWorkspacePage(page);
    diagnosticPanelPage = new DiagnosticPanelPage(page);
    Logger.info('Starting test setup');
  });

  test('TC-4214: Verify remediation options are ranked by efficiency metrics', async ({ page }) => {
    Logger.info('Test Case 4214: Testing remediation efficiency ranking');
    
    // Step 1: Login and open case with multiple remediation options
    await workspacePage.navigate();
    await workspacePage.login('agent_user', 'ValidPass@123');
    await workspacePage.openMemberCase('MC-4001');
    Logger.info('Step 1: Case MC-4001 opened with multiple remediation options');

    // Step 2: Open diagnostic panel and trigger AI
    await diagnosticPanelPage.openDiagnosticPanel();
    await diagnosticPanelPage.triggerAIRemediationSuggestions();
    await diagnosticPanelPage.waitForRemediationOptionsDisplayed();
    Logger.info('Step 2: Multiple remediation options displayed');

    // Step 3: Review ordering and emphasis
    const topOption = await diagnosticPanelPage.getTopRemediationOption();
    await expect(diagnosticPanelPage.recommendedChoiceHighlight).toBeVisible();
    await diagnosticPanelPage.verifyTopOptionIsHighlighted();
    Logger.info('Step 3: Most efficient option highlighted at top');

    // Step 4: Cross-check ordering against metrics
    await diagnosticPanelPage.verifyRemediationOrderingMatchesEfficiencyMetrics();
    Logger.info('Step 4: Ordering matches configured efficiency criteria');
  });

  test('TC-4215: Verify system handles incomplete efficiency metrics gracefully', async ({ page }) => {
    Logger.info('Test Case 4215: Testing behavior with incomplete efficiency metrics');
    
    // Step 1: Login and open case with partial metrics
    await workspacePage.navigate();
    await workspacePage.login('agent_user', 'ValidPass@123');
    await workspacePage.openMemberCase('MC-4002');
    Logger.info('Step 1: Case MC-4002 opened with incomplete efficiency metrics');

    // Step 2: Open diagnostic panel and trigger AI
    await diagnosticPanelPage.openDiagnosticPanel();
    await diagnosticPanelPage.triggerAIRemediationSuggestions();
    await diagnosticPanelPage.waitForRemediationOptionsDisplayed();
    Logger.info('Step 2: Remediation options displayed');

    // Step 3: Observe ordering and labeling
    await diagnosticPanelPage.verifyNoMisleadingEfficiencyRanking();
    const hasUnrankedLabel = await diagnosticPanelPage.hasUnrankedOrNoDataLabel();
    expect(hasUnrankedLabel).toBeTruthy();
    Logger.info('Step 3: Safe default ordering applied with no misleading ranking');

    // Step 4: Verify no incorrect efficiency badges
    await diagnosticPanelPage.verifyNoIncorrectEfficiencyBadges();
    Logger.info('Step 4: No incorrect efficiency emphasis shown');
  });
});

test.describe('Diagnostic Panel - Confidence Indicators', () => {
  let workspacePage;
  let diagnosticPanelPage;

  test.beforeEach(async ({ page }) => {
    workspacePage = new SupportAgentWorkspacePage(page);
    diagnosticPanelPage = new DiagnosticPanelPage(page);
    Logger.info('Starting test setup');
  });

  test('TC-4216: Verify confidence indicators accurately reflect model scores', async ({ page }) => {
    Logger.info('Test Case 4216: Testing confidence indicator accuracy');
    
    // Step 1: Login and open case with known model scores
    await workspacePage.navigate();
    await workspacePage.login('agent_user', 'ValidPass@123');
    await workspacePage.openMemberCase('MC-5001');
    Logger.info('Step 1: Case MC-5001 opened with known model scores');

    // Step 2: Open diagnostic panel and wait for insights
    await diagnosticPanelPage.openDiagnosticPanel();
    await diagnosticPanelPage.waitForInsightsGenerated();
    await expect(diagnosticPanelPage.insightsList).toBeVisible();
    Logger.info('Step 2: Insights displayed with confidence indicators');

    // Step 3: Compare confidence indicators to model scores
    await diagnosticPanelPage.verifyConfidenceIndicatorForScore(0.9, 'High');
    await diagnosticPanelPage.verifyConfidenceIndicatorForScore(0.6, 'Medium');
    await diagnosticPanelPage.verifyConfidenceIndicatorForScore(0.3, 'Low');
    Logger.info('Step 3: Confidence indicators match model score thresholds');

    // Step 4: Verify clarity of indicators
    await diagnosticPanelPage.verifyConfidenceIndicatorsAreVisible();
    await diagnosticPanelPage.verifyConfidenceIndicatorsAreUnambiguous();
    Logger.info('Step 4: Confidence indicators are clear and understandable');
  });

  test('TC-4217: Verify system handles missing/invalid confidence scores appropriately', async ({ page }) => {
    Logger.info('Test Case 4217: Testing behavior with missing confidence scores');
    
    // Step 1: Login and open case with missing confidence scores
    await workspacePage.navigate();
    await workspacePage.login('agent_user', 'ValidPass@123');
    await workspacePage.openMemberCase('MC-5002');
    Logger.info('Step 1: Case MC-5002 opened with missing confidence scores');

    // Step 2: Open diagnostic panel and observe insights
    await diagnosticPanelPage.openDiagnosticPanel();
    await diagnosticPanelPage.waitForInsightsGenerated();
    Logger.info('Step 2: Insights processed');

    // Step 3: Verify handling of missing scores
    await diagnosticPanelPage.verifyInsightsWithValidScoresShowProperIndicators();
    await diagnosticPanelPage.verifyInsightsWithoutValidScoresShowUnknownOrOmitted();
    Logger.info('Step 3: Missing/invalid scores handled appropriately');
  });
});

test.describe('Diagnostic Panel - Workspace Integration', () => {
  let workspacePage;
  let diagnosticPanelPage;

  test.beforeEach(async ({ page }) => {
    workspacePage = new SupportAgentWorkspacePage(page);
    diagnosticPanelPage = new DiagnosticPanelPage(page);
    Logger.info('Starting test setup');
  });

  test('TC-4218: Verify diagnostic panel integrates seamlessly within standard workspace', async ({ page }) => {
    Logger.info('Test Case 4218: Testing seamless workspace integration');
    
    // Step 1: Login to standard workspace
    await workspacePage.navigateToStandardWorkspace();
    await workspacePage.login('agent_user', 'ValidPass@123');
    await expect(workspacePage.standardWorkspaceHome).toBeVisible();
    Logger.info('Step 1: Logged into standard workspace');

    // Step 2: Open active member case
    await workspacePage.openMemberCase('MC-6001');
    await expect(workspacePage.caseDetailsSection).toBeVisible();
    Logger.info('Step 2: Member case displayed in standard workspace');

    // Step 3: Open diagnostic panel
    await diagnosticPanelPage.openDiagnosticPanel();
    await expect(diagnosticPanelPage.diagnosticPanelContainer).toBeVisible();
    await diagnosticPanelPage.verifyPanelOpenedInSameWorkspace();
    Logger.info('Step 3: Diagnostic panel opened within same workspace');

    // Step 4: Navigate between case and panel
    await workspacePage.switchToCaseDetails();
    await expect(workspacePage.caseDetailsSection).toBeVisible();
    await diagnosticPanelPage.switchToDiagnosticPanel();
    await expect(diagnosticPanelPage.diagnosticPanelContainer).toBeVisible();
    await diagnosticPanelPage.verifySeamlessNavigation();
    Logger.info('Step 4: Seamless navigation between case and panel verified');
  });

  test('TC-4219: Verify diagnostic panel access is prevented in unsupported workspace contexts', async ({ page }) => {
    Logger.info('Test Case 4219: Testing behavior in unsupported workspace');
    
    // Step 1: Login to non-standard workspace
    await workspacePage.navigateToLegacyWorkspace();
    await workspacePage.login('agent_user', 'ValidPass@123');
    await workspacePage.openMemberCase('MC-6002');
    await expect(workspacePage.caseDetailsSection).toBeVisible();
    Logger.info('Step 1: Member case opened in non-standard workspace');

    // Step 2: Attempt to access diagnostic panel
    await diagnosticPanelPage.attemptToOpenDiagnosticPanel();
    Logger.info('Step 2: Attempted to launch diagnostic panel');

    // Step 3: Observe error message
    await expect(diagnosticPanelPage.workspaceNotSupportedMessage).toBeVisible();
    await expect(diagnosticPanelPage.workspaceNotSupportedMessage).toContainText('Diagnostic panel is not available in this workspace');
    Logger.info('Step 3: Clear error message displayed');

    // Step 4: Verify no partial panel UI
    await diagnosticPanelPage.verifyNoPartialPanelUI();
    Logger.info('Step 4: No broken or partial panel UI displayed');
  });
});
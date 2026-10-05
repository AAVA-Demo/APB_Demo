const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DiagnosticPanelPage } = require('./pages/diagnosticPanel.page');

test.describe('Diagnostic Panel - Real-Time Diagnostic Updates', () => {
  test('TC-3915: Verify diagnostic panel refreshes with updated AI insights when new valid telemetry is received', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Launch the support application and log in as a support agent
    await loginPage.navigate();
    await loginPage.login('agent_valid', 'ValidPass@123');
    await expect(page.locator(diagnosticPanel.mainDashboard)).toBeVisible();

    // Step 2: Open an active member case that has existing diagnostic data and AI insights
    await diagnosticPanel.openMemberCase('MC-RTD-001');
    await expect(page.locator(diagnosticPanel.diagnosticPanel)).toBeVisible();
    await diagnosticPanel.verifyDiagnosticInsightsVisible();

    // Step 3: Keep the diagnostic panel open and trigger new valid telemetry/context
    const baselineInsights = await diagnosticPanel.captureCurrentInsights();
    await diagnosticPanel.injectTelemetryEvent('EVT-RTD-NEW-01', { metrics: 'updated', context: 'relevant' });

    // Step 4: Observe the diagnostic panel behavior after the new telemetry is processed
    await diagnosticPanel.waitForDiagnosticPanelRefresh();
    await diagnosticPanel.verifyDiagnosticInsightsVisible();

    // Step 5: Compare the refreshed diagnostic insights with the previous set
    const updatedInsights = await diagnosticPanel.captureCurrentInsights();
    await diagnosticPanel.verifyInsightsUpdated(baselineInsights, updatedInsights);
    await diagnosticPanel.verifyInsightsRelevance();
  });

  test('TC-3916: Verify diagnostic panel preserves valid insights when invalid telemetry is received', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Log in as a support agent and open an active member case with valid existing diagnostic insights
    await loginPage.navigate();
    await loginPage.login('agent_valid', 'ValidPass@123');
    await diagnosticPanel.openMemberCase('MC-RTD-002');
    await expect(page.locator(diagnosticPanel.diagnosticPanel)).toBeVisible();
    await diagnosticPanel.verifyDiagnosticInsightsVisible();

    // Step 2: Trigger an incoming telemetry/context update that is invalid
    const validInsights = await diagnosticPanel.captureCurrentInsights();
    await diagnosticPanel.injectTelemetryEvent('EVT-RTD-INVALID-01', { invalidPayload: 'missing_fields' });

    // Step 3: Observe the diagnostic panel after the invalid update is processed
    await page.waitForTimeout(2000); // Allow processing time for invalid telemetry
    const insightsAfterInvalid = await diagnosticPanel.captureCurrentInsights();
    await diagnosticPanel.verifyInsightsUnchanged(validInsights, insightsAfterInvalid);

    // Step 4: Verify that the system indicates or logs the invalid update appropriately
    await diagnosticPanel.verifyInvalidUpdateIndicator('EVT-RTD-INVALID-01');
  });
});

test.describe('Diagnostic Panel - AI-Guided Remediation Actions', () => {
  test('TC-3917: Verify AI-generated remediation actions are displayed as clear ordered list', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Log in as a support agent and open a member case with identified issue
    await loginPage.navigate();
    await loginPage.login('agent_valid', 'ValidPass@123');
    await diagnosticPanel.openMemberCase('MC-REM-001');
    await expect(page.locator(diagnosticPanel.diagnosticPanel)).toBeVisible();
    await diagnosticPanel.verifyIdentifiedIssueDisplayed();

    // Step 2: Navigate to the diagnostic panel section for AI-generated remediation actions
    await diagnosticPanel.navigateToRemediationSection('ISSUE-REM-001');
    await expect(page.locator(diagnosticPanel.remediationSection)).toBeVisible();

    // Step 3: Trigger generation of remediation actions if not already displayed
    await diagnosticPanel.generateRemediationSteps();

    // Step 4: Verify the remediation steps are presented as a clear, ordered list
    await diagnosticPanel.verifyRemediationStepsOrdered('ISSUE-REM-001');
  });

  test('TC-3918: Verify system displays clear message when remediation actions are unavailable', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Log in as a support agent and open a member case with no valid remediation actions
    await loginPage.navigate();
    await loginPage.login('agent_valid', 'ValidPass@123');
    await diagnosticPanel.openMemberCase('MC-REM-002');
    await expect(page.locator(diagnosticPanel.diagnosticPanel)).toBeVisible();

    // Step 2: Request AI-guided remediation steps for the identified issue
    await diagnosticPanel.generateRemediationSteps('ISSUE-REM-002');

    // Step 3: Observe the diagnostic panel when system cannot generate valid remediation actions
    await diagnosticPanel.verifyRemediationUnavailableMessage();
  });
});

test.describe('Diagnostic Panel - Contextual Issue Summary', () => {
  test('TC-3919: Verify contextual issue summary displays accurate member issue overview', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Log in as a support agent and open a member diagnostic panel with complete data
    await loginPage.navigate();
    await loginPage.login('agent_valid', 'ValidPass@123');
    await diagnosticPanel.openMemberCase('MC-CXT-001');
    await expect(page.locator(diagnosticPanel.diagnosticPanel)).toBeVisible();

    // Step 2: Observe the contextual issue summary section in the diagnostic panel
    await expect(page.locator(diagnosticPanel.contextualSummarySection)).toBeVisible();
    await diagnosticPanel.verifyContextualSummaryDisplayed();

    // Step 3: Verify the summary content accuracy against the underlying case data
    await diagnosticPanel.verifyContextualSummaryAccuracy('MC-CXT-001');
  });

  test('TC-3920: Verify system indicates when contextual summary is incomplete or unavailable', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Log in as a support agent and open a member diagnostic panel with incomplete data
    await loginPage.navigate();
    await loginPage.login('agent_valid', 'ValidPass@123');
    await diagnosticPanel.openMemberCase('MC-CXT-002');
    await expect(page.locator(diagnosticPanel.diagnosticPanel)).toBeVisible();

    // Step 2: Observe the contextual issue summary section after panel attempts to load data
    await diagnosticPanel.waitForContextualSummaryLoad();

    // Step 3: Verify no partial or misleading summary is shown despite missing data
    await diagnosticPanel.verifyIncompleteContextMessage();
  });
});

test.describe('Diagnostic Panel - Confidence Indicators', () => {
  test('TC-3921: Verify each AI recommendation displays associated confidence indicator', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Log in as a support agent and open a member case with AI recommendations
    await loginPage.navigate();
    await loginPage.login('agent_valid', 'ValidPass@123');
    await diagnosticPanel.openMemberCase('MC-CONF-001');
    await expect(page.locator(diagnosticPanel.diagnosticPanel)).toBeVisible();

    // Step 2: Observe the list of AI recommendations displayed in the diagnostic panel
    await diagnosticPanel.verifyAIRecommendationsVisible();

    // Step 3: Verify that each recommendation has an associated confidence indicator
    await diagnosticPanel.verifyConfidenceIndicatorsPresent();
  });

  test('TC-3922: Verify system handles missing or invalid confidence scores appropriately', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Log in as a support agent and open a member case with invalid confidence score
    await loginPage.navigate();
    await loginPage.login('agent_valid', 'ValidPass@123');
    await diagnosticPanel.openMemberCase('MC-CONF-002');
    await expect(page.locator(diagnosticPanel.diagnosticPanel)).toBeVisible();

    // Step 2: Observe how the recommendation with invalid confidence is presented
    await diagnosticPanel.verifyInvalidConfidenceHandling('REC-ID-INVALID');

    // Step 3: Verify any messaging or tooltip regarding the missing/invalid confidence information
    await diagnosticPanel.verifyConfidenceUnavailableMessage('REC-ID-INVALID');
  });
});

test.describe('Diagnostic Panel - Notification System', () => {
  test('TC-3923: Verify in-panel notification appears when new AI insights are available', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Log in as a support agent and open a member case in the diagnostic panel
    await loginPage.navigate();
    await loginPage.login('agent_valid', 'ValidPass@123');
    await diagnosticPanel.openMemberCase('MC-NOTIF-001');
    await expect(page.locator(diagnosticPanel.diagnosticPanel)).toBeVisible();

    // Step 2: Trigger generation of new or updated AI diagnostic insights
    await diagnosticPanel.injectTelemetryEvent('EVT-NOTIF-NEW-01', { newInsights: true });

    // Step 3: Observe the diagnostic panel for notification behavior
    await diagnosticPanel.verifyNewInsightsNotification();

    // Step 4: Interact with the notification if applicable
    await diagnosticPanel.clickNewInsightsNotification();
    await diagnosticPanel.verifyLatestInsightsDisplayed();
    await diagnosticPanel.verifyNotificationStateUpdated();
  });

  test('TC-3924: Verify no false notifications appear when no new AI insights are generated', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Log in as a support agent and open a member case in the diagnostic panel
    await loginPage.navigate();
    await loginPage.login('agent_valid', 'ValidPass@123');
    await diagnosticPanel.openMemberCase('MC-NOTIF-002');
    await expect(page.locator(diagnosticPanel.diagnosticPanel)).toBeVisible();

    // Step 2: Ensure that no process triggers new or updated AI diagnostic insights
    // Backend configured to not generate new insights

    // Step 3: Observe the diagnostic panel notification area over a defined period
    await page.waitForTimeout(10000); // Observation duration: 10 seconds
    await diagnosticPanel.verifyNoFalseNotifications();
  });
});

test.describe('Diagnostic Panel - Remediation Step Tracking', () => {
  test('TC-3925: Verify remediation step can be marked as completed and status persists', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Log in as a support agent and open a member case with active remediation sequence
    await loginPage.navigate();
    await loginPage.login('agent_valid', 'ValidPass@123');
    await diagnosticPanel.openMemberCase('MC-STEP-001');
    await expect(page.locator(diagnosticPanel.diagnosticPanel)).toBeVisible();
    await diagnosticPanel.verifyRemediationStepsListVisible();

    // Step 2: Identify a specific remediation step that is currently marked as pending
    await diagnosticPanel.verifyStepStatus('STEP-001', 'pending');

    // Step 3: Mark the selected remediation step as completed
    await diagnosticPanel.markStepAsCompleted('STEP-001');
    await diagnosticPanel.verifyStepStatus('STEP-001', 'completed');

    // Step 4: Verify that the system persists the completion status
    await page.reload();
    await diagnosticPanel.openMemberCase('MC-STEP-001');
    await diagnosticPanel.verifyStepStatus('STEP-001', 'completed');
    await diagnosticPanel.verifyProgressIndicatorUpdated();
  });

  test('TC-3926: Verify system handles step completion failure gracefully with error messaging', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const diagnosticPanel = new DiagnosticPanelPage(page);

    // Step 1: Log in as a support agent and open a member case with remediation steps
    await loginPage.navigate();
    await loginPage.login('agent_valid', 'ValidPass@123');
    await diagnosticPanel.openMemberCase('MC-STEP-002');
    await expect(page.locator(diagnosticPanel.diagnosticPanel)).toBeVisible();

    // Step 2: Select a remediation step currently in a not-completed state
    await diagnosticPanel.verifyStepStatus('STEP-FAIL-001', 'pending');

    // Step 3: Attempt to mark the step as completed (backend forced to fail)
    await diagnosticPanel.markStepAsCompleted('STEP-FAIL-001');

    // Step 4: Observe the UI representation of the step and any error messaging
    await diagnosticPanel.verifyStepStatus('STEP-FAIL-001', 'pending');
    await diagnosticPanel.verifyCompletionErrorMessage();

    // Step 5: Refresh or reopen the case to confirm persisted state
    await page.reload();
    await diagnosticPanel.openMemberCase('MC-STEP-002');
    await diagnosticPanel.verifyStepStatus('STEP-FAIL-001', 'pending');
  });
});
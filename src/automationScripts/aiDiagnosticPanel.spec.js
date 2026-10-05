const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { CaseDetailPage } = require('./pages/caseDetail.page');
const { AIDiagnosticPanelPage } = require('./pages/aiDiagnosticPanel.page');

test.describe('AI Diagnostic Panel - Real-Time Insights', () => {
  test('TC-3927: Verify real-time diagnostic insights update with new data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const caseDetailPage = new CaseDetailPage(page);
    const aiPanel = new AIDiagnosticPanelPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('agent_user', 'ValidPassword1!');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 2: Open active member case
    await dashboardPage.openCase('CASE-RT-001');
    await expect(caseDetailPage.caseDetailView).toBeVisible();
    await expect(aiPanel.diagnosticPanel).toBeVisible();

    // Step 3: Verify current diagnostic insights
    await expect(aiPanel.diagnosticInsightsContainer).toBeVisible();
    const initialInsights = await aiPanel.getInsightsText();
    expect(initialInsights.length).toBeGreaterThan(0);

    // Step 4: Inject new data via API
    await aiPanel.injectNewDataForCase('CASE-RT-001', {
      labResults: 'Updated lab results',
      claimActivity: 'New claim activity'
    });

    // Step 5: Observe panel refresh with updated insights
    await aiPanel.waitForPanelRefresh();
    await expect(aiPanel.diagnosticInsightsContainer).toBeVisible();
    const updatedInsights = await aiPanel.getInsightsText();
    expect(updatedInsights).not.toEqual(initialInsights);

    // Step 6: Confirm no stale insights remain
    const hasStaleInsights = await aiPanel.checkForStaleInsights(initialInsights, updatedInsights);
    expect(hasStaleInsights).toBe(false);
  });

  test('TC-3928: Verify system handles invalid data gracefully without showing erroneous insights', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const caseDetailPage = new CaseDetailPage(page);
    const aiPanel = new AIDiagnosticPanelPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('agent_user', 'ValidPassword1!');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 2: Open case with valid insights
    await dashboardPage.openCase('CASE-NEG-001');
    await expect(caseDetailPage.caseDetailView).toBeVisible();
    await expect(aiPanel.diagnosticPanel).toBeVisible();
    const validInsights = await aiPanel.getInsightsText();

    // Step 3: Simulate corrupted data feed
    await aiPanel.injectCorruptedDataForCase('CASE-NEG-001', {
      malformedPayload: true,
      missingFields: ['requiredField1', 'requiredField2']
    });

    // Step 4: Observe panel behavior with invalid data
    await page.waitForTimeout(2000); // Wait for system to process invalid data
    const currentInsights = await aiPanel.getInsightsText();

    // Step 5: Verify retained or unavailable insights indication
    const hasTimestamp = await aiPanel.hasInsightTimestamp();
    const hasUnavailableMessage = await aiPanel.hasUnavailableInsightsMessage();
    expect(hasTimestamp || hasUnavailableMessage).toBe(true);
    if (!hasUnavailableMessage) {
      expect(currentInsights).toEqual(validInsights);
    }
  });
});

test.describe('AI Diagnostic Panel - Remediation Guidance', () => {
  test('TC-3929: Verify AI-generated remediation steps are displayed and can be marked complete', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const caseDetailPage = new CaseDetailPage(page);
    const aiPanel = new AIDiagnosticPanelPage(page);

    // Step 1: Login and navigate to dashboard
    await loginPage.navigate();
    await loginPage.login('agent_user', 'ValidPassword1!');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 2: Open case with identified issues
    await dashboardPage.openCase('CASE-AI-REM-001');
    await expect(caseDetailPage.caseDetailView).toBeVisible();
    await expect(aiPanel.diagnosticPanel).toBeVisible();
    const issuesList = await aiPanel.getIdentifiedIssues();
    expect(issuesList.length).toBeGreaterThan(0);

    // Step 3: Select issue supporting AI remediation
    await aiPanel.selectIssue('ISSUE-REM-001');
    await expect(aiPanel.selectedIssueHighlight).toBeVisible();

    // Step 4: Review AI-generated remediation steps
    await expect(aiPanel.remediationStepsList).toBeVisible();
    const steps = await aiPanel.getRemediationSteps();
    expect(steps.length).toBeGreaterThan(0);
    for (const step of steps) {
      expect(step.description).toBeTruthy();
      expect(step.order).toBeGreaterThan(0);
    }

    // Step 5: Mark each step as completed
    for (let i = 0; i < steps.length; i++) {
      await aiPanel.markStepComplete(i);
      await expect(aiPanel.getStepCompletionStatus(i)).toContain('completed');
    }

    // Step 6: Verify overall remediation status
    const overallStatus = await aiPanel.getIssueRemediationStatus('ISSUE-REM-001');
    expect(overallStatus).toContain('completed');
  });

  test('TC-3930: Verify system handles insufficient data for remediation gracefully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const caseDetailPage = new CaseDetailPage(page);
    const aiPanel = new AIDiagnosticPanelPage(page);

    // Step 1: Login and open dashboard
    await loginPage.navigate();
    await loginPage.login('agent_user', 'ValidPassword1!');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 2: Open case with insufficient data
    await dashboardPage.openCase('CASE-AI-REM-INSUFF-001');
    await expect(caseDetailPage.caseDetailView).toBeVisible();
    await expect(aiPanel.diagnosticPanel).toBeVisible();

    // Step 3: Select issue and request remediation
    await aiPanel.selectIssue('ISSUE-REM-INSUFF-001');

    // Step 4: Observe system response
    const hasUnavailableMessage = await aiPanel.hasRemediationUnavailableMessage();
    expect(hasUnavailableMessage).toBe(true);
    const hasPartialSteps = await aiPanel.hasPartialRemediationSteps();
    expect(hasPartialSteps).toBe(false);

    // Step 5: Verify no misleading steps are stored
    const issueStatus = await aiPanel.getIssueRemediationStatus('ISSUE-REM-INSUFF-001');
    expect(issueStatus).toContain('unavailable');
  });
});

test.describe('AI Diagnostic Panel - Issue Context Summary', () => {
  test('TC-3931: Verify issue context summary displays member history and key indicators', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const caseDetailPage = new CaseDetailPage(page);
    const aiPanel = new AIDiagnosticPanelPage(page);

    // Step 1: Login and navigate to case list
    await loginPage.navigate();
    await loginPage.login('agent_user', 'ValidPassword1!');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 2: Open case with rich history
    await dashboardPage.openCase('CASE-CTX-001');
    await expect(caseDetailPage.caseDetailView).toBeVisible();
    await expect(aiPanel.diagnosticPanel).toBeVisible();

    // Step 3: Locate issue context summary
    await expect(aiPanel.issueContextSummary).toBeVisible();
    const summaryLabel = await aiPanel.getContextSummaryLabel();
    expect(summaryLabel).toBeTruthy();

    // Step 4: Review context summary content
    const summaryContent = await aiPanel.getContextSummaryContent();
    expect(summaryContent).toContain('history');
    expect(summaryContent.length).toBeGreaterThan(0);

    // Step 5: Verify alignment with underlying data
    const underlyingData = await caseDetailPage.getCaseData('CASE-CTX-001');
    const summaryMatchesData = await aiPanel.validateSummaryAgainstData(summaryContent, underlyingData);
    expect(summaryMatchesData).toBe(true);
  });

  test('TC-3932: Verify system handles incomplete context data appropriately', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const caseDetailPage = new CaseDetailPage(page);
    const aiPanel = new AIDiagnosticPanelPage(page);

    // Step 1: Login and navigate to case list
    await loginPage.navigate();
    await loginPage.login('agent_user', 'ValidPassword1!');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 2: Open case with incomplete data
    await dashboardPage.openCase('CASE-CTX-INCOMPLETE-001');
    await expect(caseDetailPage.caseDetailView).toBeVisible();

    // Step 3: Observe context summary section
    const hasLimitedContextMessage = await aiPanel.hasLimitedContextMessage();
    const hasUnavailableContextMessage = await aiPanel.hasUnavailableContextMessage();
    expect(hasLimitedContextMessage || hasUnavailableContextMessage).toBe(true);

    // Step 4: Verify messaging and visual cues
    const contextMessage = await aiPanel.getContextAvailabilityMessage();
    expect(contextMessage).toMatch(/unavailable|limited|missing/i);
    const hasMisleadingData = await aiPanel.hasMisleadingContextData();
    expect(hasMisleadingData).toBe(false);
  });
});

test.describe('AI Diagnostic Panel - Confidence and Priority Indicators', () => {
  test('TC-3933: Verify insights display confidence levels and priority indicators correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const caseDetailPage = new CaseDetailPage(page);
    const aiPanel = new AIDiagnosticPanelPage(page);

    // Step 1: Login and open case with multiple insights
    await loginPage.navigate();
    await loginPage.login('agent_user', 'ValidPassword1!');
    await caseDetailPage.openCaseDirectly('CASE-IND-001');
    await expect(aiPanel.diagnosticPanel).toBeVisible();

    // Step 2: Inspect each insight
    const insights = await aiPanel.getAllInsightsWithIndicators();
    expect(insights.length).toBeGreaterThan(1);
    for (const insight of insights) {
      expect(insight.confidence).toBeDefined();
      expect(insight.priority).toBeDefined();
    }

    // Step 3: Retrieve underlying scoring data
    const underlyingScores = await aiPanel.getUnderlyingScoringData('CASE-IND-001');

    // Step 4: Compare displayed vs underlying scores
    for (const insight of insights) {
      const matchingScore = underlyingScores.find(s => s.id === insight.id);
      expect(insight.confidence).toBe(matchingScore.confidence);
      expect(insight.priority).toBe(matchingScore.priority);
    }

    // Step 5: Verify visual distinguishability
    const highPriorityInsights = insights.filter(i => i.priority === 'High');
    const isVisuallyDistinguishable = await aiPanel.areHighPriorityInsightsDistinguishable();
    expect(isVisuallyDistinguishable).toBe(true);
  });

  test('TC-3934: Verify insights with missing scoring data are handled appropriately', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const caseDetailPage = new CaseDetailPage(page);
    const aiPanel = new AIDiagnosticPanelPage(page);

    // Step 1: Login and open case with incomplete scoring
    await loginPage.navigate();
    await loginPage.login('agent_user', 'ValidPassword1!');
    await caseDetailPage.openCaseDirectly('CASE-IND-NOSCORE-001');
    await expect(aiPanel.diagnosticPanel).toBeVisible();

    // Step 2: Identify insight with missing scoring
    const insightWithoutScore = await aiPanel.getInsightById('INSIGHT-NOSCORE-001');
    expect(insightWithoutScore).toBeDefined();

    // Step 3: Observe display of insight with unavailable ranking
    const hasDefaultIndicators = await aiPanel.insightHasDefaultIndicators('INSIGHT-NOSCORE-001');
    expect(hasDefaultIndicators).toBe(false);
    const hasUnavailableFlag = await aiPanel.insightHasUnavailableRankingFlag('INSIGHT-NOSCORE-001');
    expect(hasUnavailableFlag).toBe(true);

    // Step 4: Verify no placeholder values
    const indicators = await aiPanel.getInsightIndicators('INSIGHT-NOSCORE-001');
    expect(indicators.confidence).not.toBe('0%');
    expect(indicators.priority).not.toBe('Medium');
    expect(indicators.confidence).toMatch(/unavailable|N\/A/i);
  });
});

test.describe('AI Diagnostic Panel - Feedback Mechanism', () => {
  test('TC-3935: Verify agent can provide helpful/not helpful feedback on recommendations', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const caseDetailPage = new CaseDetailPage(page);
    const aiPanel = new AIDiagnosticPanelPage(page);

    // Step 1: Login and open case with recommendations
    await loginPage.navigate();
    await loginPage.login('agent_user', 'ValidPassword1!');
    await caseDetailPage.openCaseDirectly('CASE-FB-001');
    await expect(aiPanel.diagnosticPanel).toBeVisible();
    const recommendations = await aiPanel.getRecommendations();
    expect(recommendations.length).toBeGreaterThan(0);

    // Step 2: Select recommendation
    await aiPanel.selectRecommendation('REC-001');
    await expect(aiPanel.feedbackControls).toBeVisible();

    // Step 3: Mark as helpful
    await aiPanel.submitFeedback('REC-001', 'helpful');
    await expect(aiPanel.getFeedbackConfirmation()).toBeVisible();

    // Step 4: Refresh and verify status
    await page.reload();
    await caseDetailPage.openCaseDirectly('CASE-FB-001');
    const rec001Status = await aiPanel.getRecommendationStatus('REC-001');
    expect(rec001Status).toContain('helpful');

    // Step 5: Submit not helpful feedback on different recommendation
    await aiPanel.selectRecommendation('REC-002');
    await aiPanel.submitFeedback('REC-002', 'not helpful');
    const rec002Status = await aiPanel.getRecommendationStatus('REC-002');
    expect(rec002Status).toContain('not helpful');
    const rec001StatusAfter = await aiPanel.getRecommendationStatus('REC-001');
    expect(rec001StatusAfter).toContain('helpful');
  });

  test('TC-3936: Verify feedback service failure is handled gracefully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const caseDetailPage = new CaseDetailPage(page);
    const aiPanel = new AIDiagnosticPanelPage(page);

    // Step 1: Login and open case
    await loginPage.navigate();
    await loginPage.login('agent_user', 'ValidPassword1!');
    await caseDetailPage.openCaseDirectly('CASE-FB-SVC-001');
    await expect(aiPanel.diagnosticPanel).toBeVisible();

    // Step 2: Simulate feedback service unavailability
    await aiPanel.simulateFeedbackServiceFailure();

    // Step 3: Attempt to submit feedback
    await aiPanel.selectRecommendation('REC-SVC-001');
    await aiPanel.submitFeedback('REC-SVC-001', 'helpful');

    // Step 4: Observe UI response
    const hasErrorMessage = await aiPanel.hasFeedbackErrorMessage();
    expect(hasErrorMessage).toBe(true);
    const hasSuccessMessage = await aiPanel.hasFeedbackSuccessMessage();
    expect(hasSuccessMessage).toBe(false);

    // Step 5: Verify stored status unchanged
    const status = await aiPanel.getRecommendationStatus('REC-SVC-001');
    expect(status).not.toContain('helpful');
  });
});

test.describe('AI Diagnostic Panel - Workflow Integration', () => {
  test('TC-3937: Verify AI diagnostic panel opens seamlessly within case workflow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const caseDetailPage = new CaseDetailPage(page);
    const aiPanel = new AIDiagnosticPanelPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('agent_user', 'ValidPassword1!');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 2: Open member case
    await dashboardPage.openCase('CASE-WF-001');
    await expect(caseDetailPage.caseDetailView).toBeVisible();

    // Step 3: Initiate AI diagnostic panel
    await caseDetailPage.openAIDiagnosticPanel();
    await expect(aiPanel.diagnosticPanel).toBeVisible();

    // Step 4: Confirm no additional authentication
    const hasAuthPrompt = await loginPage.isLoginPromptVisible();
    expect(hasAuthPrompt).toBe(false);

    // Step 5: Verify case-specific insights
    const displayedCaseId = await aiPanel.getDisplayedCaseId();
    expect(displayedCaseId).toBe('CASE-WF-001');
    const insights = await aiPanel.getInsightsText();
    const allInsightsForCorrectCase = await aiPanel.validateInsightsForCase('CASE-WF-001', insights);
    expect(allInsightsForCorrectCase).toBe(true);
  });

  test('TC-3938: Verify system handles missing or invalid context data during panel load', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const caseDetailPage = new CaseDetailPage(page);
    const aiPanel = new AIDiagnosticPanelPage(page);

    // Step 1: Login and navigate to problematic case
    await loginPage.navigate();
    await loginPage.login('agent_user', 'ValidPassword1!');
    await dashboardPage.openCase('CASE-WF-BADCTX-001');
    await expect(caseDetailPage.caseDetailView).toBeVisible();

    // Step 2: Attempt to open AI diagnostic panel
    await caseDetailPage.openAIDiagnosticPanel();

    // Step 3: Observe panel loading behavior
    const hasUnrelatedInsights = await aiPanel.hasUnrelatedInsights('CASE-WF-BADCTX-001');
    expect(hasUnrelatedInsights).toBe(false);
    const hasIncorrectCaseInsights = await aiPanel.hasInsightsForDifferentCase('CASE-WF-BADCTX-001');
    expect(hasIncorrectCaseInsights).toBe(false);

    // Step 4: Verify error or fallback message
    const hasErrorMessage = await aiPanel.hasContextErrorMessage();
    expect(hasErrorMessage).toBe(true);
    const errorMessage = await aiPanel.getContextErrorMessage();
    expect(errorMessage).toMatch(/missing|invalid|cannot be generated/i);
  });
});
const { test, expect } = require('@playwright/test');
const { SupportDashboardPage } = require('./pages/supportDashboard.page');
const { MemberCasePage } = require('./pages/memberCase.page');
const { DiagnosticPanelPage } = require('./pages/diagnosticPanel.page');

test.describe('Support Diagnostic Panel - Real-time Analysis and Insights', () => {

  test('TC-3903: Real-time diagnostic insights display current member data', async ({ page }) => {
    const dashboardPage = new SupportDashboardPage(page);
    const memberCasePage = new MemberCasePage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await dashboardPage.navigate();
    await dashboardPage.login('support.agent1', 'ValidPwd1!');
    await expect(dashboardPage.mainDashboard).toBeVisible();

    await memberCasePage.openMemberCase('MEM-REALTIME-001', 'CASE-RT-001');
    await expect(memberCasePage.diagnosticPanelEntryPoint).toBeVisible();

    await diagnosticPanelPage.openDiagnosticPanel();
    await diagnosticPanelPage.waitForRealTimeAnalysisComplete();

    await expect(diagnosticPanelPage.diagnosticInsightsSection).toBeVisible();
    await diagnosticPanelPage.verifyInsightsDisplayed();

    await diagnosticPanelPage.verifyLatestMemberDataReflected();
  });

  test('TC-3904: System handles failed or incomplete real-time analysis gracefully', async ({ page }) => {
    const dashboardPage = new SupportDashboardPage(page);
    const memberCasePage = new MemberCasePage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await dashboardPage.navigate();
    await dashboardPage.login('support.agent1', 'ValidPwd1!');
    await expect(dashboardPage.mainDashboard).toBeVisible();

    await memberCasePage.openMemberCase('MEM-RT-FAIL-001', 'CASE-RT-FAIL-001');
    await expect(memberCasePage.diagnosticPanelEntryPoint).toBeVisible();

    await diagnosticPanelPage.openDiagnosticPanel();
    await diagnosticPanelPage.waitForAnalysisFailureOrIncomplete();

    await diagnosticPanelPage.verifyUnavailableInsightsMessage();
  });

  test('TC-3905: AI-generated remediation displays tailored instructions for clear root cause', async ({ page }) => {
    const dashboardPage = new SupportDashboardPage(page);
    const memberCasePage = new MemberCasePage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await dashboardPage.navigate();
    await dashboardPage.login('support.agent1', 'ValidPwd1!');
    await expect(dashboardPage.mainDashboard).toBeVisible();

    await memberCasePage.openMemberCase('MEM-AI-ROOT-001', 'CASE-AI-ROOT-001');
    await expect(memberCasePage.diagnosticPanelEntryPoint).toBeVisible();

    await diagnosticPanelPage.navigateToAIRemediationSection();
    await diagnosticPanelPage.waitForAIInferenceComplete();

    await expect(diagnosticPanelPage.remediationInstructions).toBeVisible();
    await diagnosticPanelPage.verifyTailoredRemediationSteps();
  });

  test('TC-3906: System indicates unavailable remediation when diagnostics are ambiguous', async ({ page }) => {
    const dashboardPage = new SupportDashboardPage(page);
    const memberCasePage = new MemberCasePage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await dashboardPage.navigate();
    await dashboardPage.login('support.agent1', 'ValidPwd1!');
    await expect(dashboardPage.mainDashboard).toBeVisible();

    await memberCasePage.openMemberCase('MEM-AI-NOROOT-001', 'CASE-AI-NOROOT-001');
    await expect(memberCasePage.diagnosticInsightsSection).toBeVisible();

    await diagnosticPanelPage.accessAIRemediationSection();
    await diagnosticPanelPage.waitForLowConfidenceInference();

    await diagnosticPanelPage.verifyNoRemediationAvailableMessage();
  });

  test('TC-3907: Recommended actions are ordered by impact and urgency', async ({ page }) => {
    const dashboardPage = new SupportDashboardPage(page);
    const memberCasePage = new MemberCasePage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await dashboardPage.navigate();
    await dashboardPage.login('support.agent1', 'ValidPwd1!');
    await expect(dashboardPage.mainDashboard).toBeVisible();

    await memberCasePage.openMemberCase('MEM-REC-PRIOR-001', 'CASE-REC-PRIOR-001');
    await expect(memberCasePage.recommendationsLink).toBeVisible();

    await diagnosticPanelPage.openRecommendationsSection();
    await diagnosticPanelPage.waitForRecommendationsDataFetch();

    await expect(diagnosticPanelPage.recommendedActionsList).toBeVisible();
    await diagnosticPanelPage.verifyRecommendationsOrderedByPriority();
  });

  test('TC-3908: System handles missing prioritization data appropriately', async ({ page }) => {
    const dashboardPage = new SupportDashboardPage(page);
    const memberCasePage = new MemberCasePage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await dashboardPage.navigate();
    await dashboardPage.login('support.agent1', 'ValidPwd1!');
    await expect(dashboardPage.mainDashboard).toBeVisible();

    await memberCasePage.openMemberCase('MEM-REC-NOPRIO-001', 'CASE-REC-NOPRIO-001');
    await expect(memberCasePage.recommendationsSection).toBeVisible();

    await diagnosticPanelPage.openRecommendationsSection();
    await diagnosticPanelPage.waitForPrioritizationCheck();

    await diagnosticPanelPage.verifyPrioritizationUnavailableMessage();
  });

  test('TC-3909: Contextual member issue summary displays accurate aggregated data', async ({ page }) => {
    const dashboardPage = new SupportDashboardPage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await dashboardPage.navigate();
    await dashboardPage.login('support.agent1', 'ValidPwd1!');
    await expect(dashboardPage.mainDashboard).toBeVisible();

    await diagnosticPanelPage.openDiagnosticPanelForMember('MEM-SUMMARY-OK-001');
    await diagnosticPanelPage.waitForDataAggregation();

    await expect(diagnosticPanelPage.contextualSummary).toBeVisible();
    await diagnosticPanelPage.verifySummaryAccuracy();
    await diagnosticPanelPage.crossCheckSummaryWithUnderlyingData();
  });

  test('TC-3910: System indicates unavailable summary when data is insufficient', async ({ page }) => {
    const dashboardPage = new SupportDashboardPage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await dashboardPage.navigate();
    await dashboardPage.login('support.agent1', 'ValidPwd1!');
    await expect(dashboardPage.mainDashboard).toBeVisible();

    await diagnosticPanelPage.openDiagnosticPanelForMember('MEM-SUMMARY-NODATA-001');
    await diagnosticPanelPage.waitForInsufficientDataDetection();

    await diagnosticPanelPage.verifySummaryUnavailableMessage();
  });

  test('TC-3911: Remediation step completion updates progress accurately', async ({ page }) => {
    const dashboardPage = new SupportDashboardPage(page);
    const memberCasePage = new MemberCasePage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await dashboardPage.navigate();
    await dashboardPage.login('support.agent1', 'ValidPwd1!');
    await expect(dashboardPage.mainDashboard).toBeVisible();

    await memberCasePage.openMemberCase('MEM-ACT-TRACK-001', 'CASE-ACT-TRACK-001');
    await expect(diagnosticPanelPage.remediationSteps).toBeVisible();

    await diagnosticPanelPage.markRemediationStepAsCompleted('STEP-1');
    await diagnosticPanelPage.verifyStepStateUpdated('STEP-1', 'completed');

    await expect(diagnosticPanelPage.progressIndicator).toBeVisible();
    await diagnosticPanelPage.verifyProgressAccuracy();
  });

  test('TC-3912: System prevents corrupted progress when step completion fails', async ({ page }) => {
    const dashboardPage = new SupportDashboardPage(page);
    const memberCasePage = new MemberCasePage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await dashboardPage.navigate();
    await dashboardPage.login('support.agent1', 'ValidPwd1!');
    await expect(dashboardPage.mainDashboard).toBeVisible();

    await memberCasePage.openMemberCase('MEM-ACT-FAIL-001', 'CASE-ACT-FAIL-001');
    await expect(diagnosticPanelPage.remediationSteps).toBeVisible();

    const previousState = await diagnosticPanelPage.captureStepAndProgressState('STEP-FAIL-1');
    await diagnosticPanelPage.attemptMarkRemediationStepAsCompleted('STEP-FAIL-1');
    await diagnosticPanelPage.waitForSaveFailure();

    await diagnosticPanelPage.verifyStepRemainsInPreviousState('STEP-FAIL-1', previousState);
    await diagnosticPanelPage.verifyProgressUnchanged(previousState);
  });

  test('TC-3913: Diagnostic insights refresh after remediation completion', async ({ page }) => {
    const dashboardPage = new SupportDashboardPage(page);
    const memberCasePage = new MemberCasePage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await dashboardPage.navigate();
    await dashboardPage.login('support.agent1', 'ValidPwd1!');
    await expect(dashboardPage.mainDashboard).toBeVisible();

    await memberCasePage.openMemberCase('MEM-INSIGHTS-REFRESH-001', 'CASE-INSIGHTS-REFRESH-001');
    await expect(diagnosticPanelPage.diagnosticInsightsSection).toBeVisible();
    await expect(diagnosticPanelPage.remediationSteps).toBeVisible();

    await diagnosticPanelPage.markRemediationStepAsCompleted('STEP-1');
    await diagnosticPanelPage.markRemediationStepAsCompleted('STEP-2');
    await diagnosticPanelPage.verifyProgressUpdated();

    await diagnosticPanelPage.triggerOrWaitForReAnalysis();
    await diagnosticPanelPage.waitForInsightsRefresh();

    await diagnosticPanelPage.verifyUpdatedInsightsReflectLatestState();
  });

  test('TC-3914: System prevents stale insights when re-analysis fails', async ({ page }) => {
    const dashboardPage = new SupportDashboardPage(page);
    const memberCasePage = new MemberCasePage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await dashboardPage.navigate();
    await dashboardPage.login('support.agent1', 'ValidPwd1!');
    await expect(dashboardPage.mainDashboard).toBeVisible();

    await memberCasePage.openMemberCase('MEM-INSIGHTS-FAIL-001', 'CASE-INSIGHTS-FAIL-001');
    await expect(diagnosticPanelPage.diagnosticInsightsSection).toBeVisible();
    await expect(diagnosticPanelPage.remediationSteps).toBeVisible();

    await diagnosticPanelPage.markRemediationStepAsCompleted('STEP-FAIL-1');
    await diagnosticPanelPage.waitForReAnalysisRequest();

    await diagnosticPanelPage.waitForReAnalysisFailure();
    await diagnosticPanelPage.verifyInsightsNotUpdated();
    await diagnosticPanelPage.verifyErrorLoggedForInvestigation();
  });

});
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { MemberSearchPage } = require('./pages/memberSearch.page');
const { CaseDetailsPage } = require('./pages/caseDetails.page');
const { DiagnosticPanelPage } = require('./pages/diagnosticPanel.page');

test.describe('Diagnostic Panel - Real-Time Diagnostic Insights', () => {
  test('TC-3944: Verify diagnostic panel displays clear list of insights for active case with recent interactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const memberSearchPage = new MemberSearchPage(page);
    const caseDetailsPage = new CaseDetailsPage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await loginPage.navigate();
    await loginPage.login('agent_user_01', 'P@ssword1');
    await loginPage.verifyDashboardVisible();

    await memberSearchPage.navigateToMemberSearch();
    await memberSearchPage.searchMember('MBR-10001', 'Active cases only');
    await memberSearchPage.verifyMemberDisplayedInResults('MBR-10001');

    await caseDetailsPage.openCaseFromSearchResults('CASE-RTDI-01');
    await caseDetailsPage.verifyCaseDetailsPageOpen();
    await caseDetailsPage.verifyDiagnosticPanelOptionAvailable();

    await diagnosticPanelPage.openDiagnosticPanel();
    await diagnosticPanelPage.verifyDiagnosticPanelOpen();
    await diagnosticPanelPage.verifyProcessingIndicatorShown();

    await diagnosticPanelPage.waitForProcessingComplete();
    await diagnosticPanelPage.verifyDiagnosticInsightsDisplayed();

    await diagnosticPanelPage.verifyInsightListContainsAtLeastOne();
    await diagnosticPanelPage.verifyInsightDescriptionPresent();
    await diagnosticPanelPage.verifyInsightConfidenceThreshold(0.7);

    await diagnosticPanelPage.verifyInsightClarity();
    await diagnosticPanelPage.verifyInsightVisuallySeparated();
  });

  test('TC-3945: Verify diagnostic panel shows clear message when data is insufficient or inconsistent', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const memberSearchPage = new MemberSearchPage(page);
    const caseDetailsPage = new CaseDetailsPage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await loginPage.navigate();
    await loginPage.login('agent_user_01', 'P@ssword1');
    await loginPage.verifyDashboardVisible();

    await memberSearchPage.navigateToMemberSearch();
    await memberSearchPage.searchMember('MBR-20001', '');
    await memberSearchPage.verifyMemberDisplayedInResults('MBR-20001');

    await caseDetailsPage.openCaseFromSearchResults('CASE-RTDI-02');
    await diagnosticPanelPage.openDiagnosticPanel();
    await diagnosticPanelPage.verifyDiagnosticPanelOpen();

    await diagnosticPanelPage.waitForProcessingComplete();
    await diagnosticPanelPage.verifyProcessingIndicatorNotShown();

    await diagnosticPanelPage.verifyNoMisleadingInsightsDisplayed();
    await diagnosticPanelPage.verifyLimitedInsightMessage('DIAG_NO_INSIGHT');
  });

  test('TC-3950: Verify diagnostic panel automatically refreshes insights during live interaction with new events', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const caseDetailsPage = new CaseDetailsPage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await loginPage.navigate();
    await loginPage.login('agent_user_04', 'P@ssword1');
    await loginPage.verifyDashboardVisible();

    await caseDetailsPage.startLiveInteraction('MBR-50001');
    await caseDetailsPage.openCaseFromSearchResults('CASE-RTREF-01');
    await diagnosticPanelPage.openDiagnosticPanel();
    await diagnosticPanelPage.verifyDiagnosticInsightsDisplayed();

    await diagnosticPanelPage.triggerNewSystemEvent('New network alert');
    await diagnosticPanelPage.verifyDiagnosticPanelAutoRefresh();
    await diagnosticPanelPage.verifyRefreshIndicatorDisplayed();
  });

  test('TC-3951: Verify diagnostic panel does not create duplicate or stale updates without new events', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const caseDetailsPage = new CaseDetailsPage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await loginPage.navigate();
    await loginPage.login('agent_user_04', 'P@ssword1');
    await loginPage.verifyDashboardVisible();

    await caseDetailsPage.startLiveInteraction('MBR-50002');
    await caseDetailsPage.openCaseFromSearchResults('CASE-RTREF-02');
    await diagnosticPanelPage.openDiagnosticPanel();
    await diagnosticPanelPage.verifyDiagnosticInsightsDisplayed();

    await diagnosticPanelPage.observePanelForDuration(600000);
    await diagnosticPanelPage.verifyNoAutoRefreshOccurred();
    await diagnosticPanelPage.verifyNoDuplicateInsights();
    await diagnosticPanelPage.verifyTimestampsStable();
  });

  test('TC-3952: Verify insights are ordered by relevance and display priority/confidence levels', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const caseDetailsPage = new CaseDetailsPage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await loginPage.navigate();
    await loginPage.login('agent_user_05', 'P@ssword1');
    await loginPage.verifyDashboardVisible();

    await caseDetailsPage.openMemberCase('MBR-60001', 'CASE-PRI-01');
    await diagnosticPanelPage.openDiagnosticPanel();
    await diagnosticPanelPage.waitForProcessingComplete();
    await diagnosticPanelPage.verifyMultipleInsightsDisplayed();

    await diagnosticPanelPage.verifyInsightsOrderedByRelevance();
    await diagnosticPanelPage.verifyEachInsightHasPriorityIndicator();
  });

  test('TC-3953: Verify low-confidence insights are not labeled as high priority', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const caseDetailsPage = new CaseDetailsPage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);

    await loginPage.navigate();
    await loginPage.login('agent_user_05', 'P@ssword1');
    await loginPage.verifyDashboardVisible();

    await caseDetailsPage.openMemberCase('MBR-60002', 'CASE-PRI-02');
    await diagnosticPanelPage.openDiagnosticPanel();
    await diagnosticPanelPage.waitForProcessingComplete();
    await diagnosticPanelPage.verifyMultipleInsightsDisplayed();

    await diagnosticPanelPage.identifyLowConfidenceInsight('INS-LC-01');
    await diagnosticPanelPage.verifyInsightNotHighPriority('INS-LC-01');
    await diagnosticPanelPage.verifyInsightHasDefaultPriority('INS-LC-01', 'Low');
  });
});

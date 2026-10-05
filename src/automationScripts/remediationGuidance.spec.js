const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { MemberSearchPage } = require('./pages/memberSearch.page');
const { CaseDetailsPage } = require('./pages/caseDetails.page');
const { RemediationGuidancePage } = require('./pages/remediationGuidance.page');

test.describe('Remediation Guidance', () => {
  test('TC-3946: Verify remediation guidance displays actionable steps tailored to member issue', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const memberSearchPage = new MemberSearchPage(page);
    const caseDetailsPage = new CaseDetailsPage(page);
    const remediationGuidancePage = new RemediationGuidancePage(page);

    await loginPage.navigate();
    await loginPage.login('agent_user_02', 'P@ssword1');
    await loginPage.verifyDashboardVisible();

    await memberSearchPage.searchMemberWithKnownIssue('MBR-30001', 'Plan billing discrepancy');
    await memberSearchPage.verifyMemberDisplayedInResults('MBR-30001');

    await caseDetailsPage.openMemberIssueCase('CASE-RG-01');
    await remediationGuidancePage.navigateToRemediationGuidanceSection();
    await remediationGuidancePage.verifyRemediationGuidanceSectionVisible();

    await remediationGuidancePage.triggerLoadRemediationGuidance();
    await remediationGuidancePage.verifyOrderedStepListDisplayed();

    await remediationGuidancePage.verifyEachStepIsActionable('Plan billing discrepancy');
    await remediationGuidancePage.verifyStepsAreClearlySequenced();
  });

  test('TC-3947: Verify system shows clear message when remediation guidance is unavailable', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const memberSearchPage = new MemberSearchPage(page);
    const caseDetailsPage = new CaseDetailsPage(page);
    const remediationGuidancePage = new RemediationGuidancePage(page);

    await loginPage.navigate();
    await loginPage.login('agent_user_02', 'P@ssword1');
    await loginPage.verifyDashboardVisible();

    await memberSearchPage.searchMemberWithKnownIssue('MBR-30002', 'Unsupported custom exception');
    await memberSearchPage.verifyMemberDisplayedInResults('MBR-30002');

    await caseDetailsPage.openMemberIssueCase('CASE-RG-02');
    await remediationGuidancePage.navigateToRemediationGuidanceSection();
    await remediationGuidancePage.verifyRemediationGuidanceSectionVisible();

    await remediationGuidancePage.attemptLoadRemediationGuidance();
    await remediationGuidancePage.verifyNoErrorsOccurred();

    await remediationGuidancePage.verifyNoGenericStepsDisplayed();
    await remediationGuidancePage.verifyUnavailableGuidanceMessage('RG_NO_GUIDANCE');
  });

  test('TC-3954: Verify agent can mark remediation steps as completed and tracking persists', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const caseDetailsPage = new CaseDetailsPage(page);
    const remediationGuidancePage = new RemediationGuidancePage(page);

    await loginPage.navigate();
    await loginPage.login('agent_user_06', 'P@ssword1');
    await loginPage.verifyDashboardVisible();

    await caseDetailsPage.openMemberCase('MBR-70001', 'CASE-ACT-01');
    await remediationGuidancePage.navigateToRemediationStepsSection();
    await remediationGuidancePage.verifyAllStepsWithStatusIndicators(['STEP-1', 'STEP-2', 'STEP-3'], 'Pending');

    await remediationGuidancePage.markStepAsCompleted('STEP-1');
    await remediationGuidancePage.verifyStepStatusUpdated('STEP-1', 'Done');

    await remediationGuidancePage.refreshOrReopenCase();
    await remediationGuidancePage.verifyStepStatusPersisted('STEP-1', 'Done');
    await remediationGuidancePage.verifyRemainingStepsPending(['STEP-2', 'STEP-3']);
  });

  test('TC-3955: Verify remediation tracking handles duplicate and invalid completion attempts correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const caseDetailsPage = new CaseDetailsPage(page);
    const remediationGuidancePage = new RemediationGuidancePage(page);

    await loginPage.navigate();
    await loginPage.login('agent_user_06', 'P@ssword1');
    await loginPage.verifyDashboardVisible();

    await caseDetailsPage.openMemberCase('MBR-70002', 'CASE-ACT-02');
    await remediationGuidancePage.navigateToRemediationStepsSection();

    await remediationGuidancePage.markStepAsCompleted('STEP-1');
    await remediationGuidancePage.verifyStepStatusUpdated('STEP-1', 'Done');

    await remediationGuidancePage.attemptMarkStepAsCompletedAgain('STEP-1');
    await remediationGuidancePage.verifyDuplicateCompletionPrevented('STEP-1');

    await remediationGuidancePage.attemptInvalidStepCompletion('STEP-2');
    await remediationGuidancePage.verifyInvalidInputRejected();

    await remediationGuidancePage.verifyRemediationTrackingAccurate();
  });
});

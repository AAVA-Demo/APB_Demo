const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CaseDetailsPage } = require('./pages/caseDetails.page');
const { DiagnosticPanelPage } = require('./pages/diagnosticPanel.page');
const { ContextAwareViewPage } = require('./pages/contextAwareView.page');

test.describe('Context-Aware Member View', () => {
  test('TC-3948: Verify context-aware view displays relevant interaction history without sensitive data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const caseDetailsPage = new CaseDetailsPage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);
    const contextAwareViewPage = new ContextAwareViewPage(page);

    await loginPage.navigate();
    await loginPage.login('agent_user_03', 'P@ssword1');
    await loginPage.verifyDashboardVisible();

    await caseDetailsPage.selectMemberCase('MBR-40001', 'CASE-CAV-01', 'Network connectivity issue');
    await diagnosticPanelPage.verifyDiagnosticPanelOptionsVisible();

    await contextAwareViewPage.openContextAwareView();
    await contextAwareViewPage.verifyContextAwareViewLoaded();

    await contextAwareViewPage.verifyInteractionHistoryRelevant(5, 90);
    await contextAwareViewPage.verifyNonSensitiveContextDisplayed();
    await contextAwareViewPage.verifySensitiveDataNotDisplayed();
  });

  test('TC-3949: Verify context-aware view filters out sensitive and irrelevant data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const caseDetailsPage = new CaseDetailsPage(page);
    const diagnosticPanelPage = new DiagnosticPanelPage(page);
    const contextAwareViewPage = new ContextAwareViewPage(page);

    await loginPage.navigate();
    await loginPage.login('agent_user_03', 'P@ssword1');
    await loginPage.verifyDashboardVisible();

    await caseDetailsPage.selectMemberCase('MBR-40002', 'CASE-CAV-02', '');
    await contextAwareViewPage.openContextAwareView();
    await contextAwareViewPage.verifyContextAwareViewLoaded();

    await contextAwareViewPage.verifySensitiveDataMaskedOrOmitted();
    await contextAwareViewPage.verifyIrrelevantDataNotDisplayed();
  });
});

const { test, expect } = require('@playwright/test');
const { MemberIssuePage } = require('./pages/memberIssue.page');
const { logger } = require('../utils/logger');

test.describe('Member Issue Remediation Guidance - SCRUM-34051', () => {

  test('TC-001: Verify diagnostic insight remediation guidance with ordered steps', async ({ page }) => {
    logger.info('Starting TC-001: Verify diagnostic insight remediation guidance with ordered steps');
    const memberIssuePage = new MemberIssuePage(page);

    // Step 1: Launch the agent application and navigate to the member issue workspace
    logger.info('Step 1: Launching agent application and navigating to member issue workspace');
    await memberIssuePage.navigate();
    await expect(page).toHaveURL(/.*member.*issue/i);
    logger.info('Step 1 Passed: Agent application loaded successfully and member issue workspace is accessible');

    // Step 2: Open the specific member issue that has an existing diagnostic insight
    logger.info('Step 2: Opening member issue with diagnostic insight (IssueID=MI-1001)');
    await memberIssuePage.openMemberIssue('MI-1001');
    await expect(memberIssuePage.diagnosticInsightSection).toBeVisible();
    logger.info('Step 2 Passed: Member issue details page opened and diagnostic insight section is visible');

    // Step 3: Verify that a diagnostic insight has been generated
    logger.info('Step 3: Verifying diagnostic insight has been generated');
    await expect(memberIssuePage.diagnosticInsightContent).toBeVisible();
    const insightText = await memberIssuePage.getDiagnosticInsightText();
    expect(insightText.length).toBeGreaterThan(0);
    logger.info('Step 3 Passed: Diagnostic insight section displays at least one insight with sufficient detail');

    // Step 4: Open the remediation guidance section
    logger.info('Step 4: Opening remediation guidance section');
    await memberIssuePage.openRemediationGuidance();
    await expect(memberIssuePage.remediationGuidanceSection).toBeVisible();
    logger.info('Step 4 Passed: Remediation guidance section opened without error');

    // Step 5: Verify the presence and ordering of remediation steps
    logger.info('Step 5: Verifying presence and ordering of remediation steps');
    const remediationSteps = await memberIssuePage.getRemediationSteps();
    expect(remediationSteps.length).toBeGreaterThan(0);
    await memberIssuePage.verifyStepsAreOrdered(remediationSteps);
    logger.info('Step 5 Passed: Ordered list of remediation steps is displayed in logical sequence');

    // Step 6: Review each remediation step's content for clarity and actionability
    logger.info('Step 6: Reviewing remediation step content for clarity');
    for (let i = 0; i < remediationSteps.length; i++) {
      const stepContent = await memberIssuePage.getStepContent(i);
      expect(stepContent.length).toBeGreaterThan(10);
      logger.info(`Step 6: Remediation step ${i + 1} contains clear and actionable instructions`);
    }
    logger.info('Step 6 Passed: Each remediation step contains clear, concise, and actionable instructions');

    // Step 7: Confirm that remediation steps align with the diagnostic insight details
    logger.info('Step 7: Confirming remediation steps align with diagnostic insight');
    const isAligned = await memberIssuePage.verifyRemediationAlignmentWithInsight();
    expect(isAligned).toBeTruthy();
    logger.info('Step 7 Passed: Remediation steps are contextually relevant to the diagnostic insight');

    // Step 8: Validate that the guidance supports accurate and consistent resolution
    logger.info('Step 8: Validating guidance supports accurate resolution');
    const isConsistent = await memberIssuePage.verifyRemediationConsistency();
    expect(isConsistent).toBeTruthy();
    logger.info('Step 8 Passed: The combination of ordered steps and clear instructions enables consistent resolution path');

    logger.info('TC-001 completed successfully');
  });

  test('TC-002: Verify complex diagnostic insight with multiple remediation rules', async ({ page }) => {
    logger.info('Starting TC-002: Verify complex diagnostic insight with multiple remediation rules');
    const memberIssuePage = new MemberIssuePage(page);

    // Step 1: Launch the agent application and sign in
    logger.info('Step 1: Launching agent application and signing in as complexAgent01');
    await memberIssuePage.navigate();
    await memberIssuePage.signIn('complexAgent01', 'Senior Support Agent');
    await expect(page).toHaveURL(/.*home|.*queue/i);
    logger.info('Step 1 Passed: Agent successfully signed in and reached home or work queue page');

    // Step 2: Navigate to a member issue with complex diagnostic insight
    logger.info('Step 2: Navigating to member issue with complex diagnostic insight (MI-2001)');
    await memberIssuePage.openMemberIssue('MI-2001');
    await expect(memberIssuePage.diagnosticInsightSection).toBeVisible();
    const hasComplexityIndicators = await memberIssuePage.hasComplexityIndicators();
    expect(hasComplexityIndicators).toBeTruthy();
    logger.info('Step 2 Passed: Member issue page shows diagnostic insight with indicators of complexity');

    // Step 3: Open the remediation guidance section for complex insight
    logger.info('Step 3: Opening remediation guidance section for complex diagnostic insight');
    await memberIssuePage.openRemediationGuidance();
    await expect(memberIssuePage.remediationGuidanceSection).toBeVisible();
    const stepCount = await memberIssuePage.getRemediationStepCount();
    expect(stepCount).toBeGreaterThan(5);
    logger.info('Step 3 Passed: Remediation guidance section displays multiple remediation steps without errors');

    // Step 4: Validate the ordering of complex remediation steps
    logger.info('Step 4: Validating ordering of complex remediation steps');
    const steps = await memberIssuePage.getRemediationSteps();
    const isBusinessRuleDriven = await memberIssuePage.verifyBusinessRuleOrdering(steps);
    expect(isBusinessRuleDriven).toBeTruthy();
    logger.info('Step 4 Passed: Steps appear in business-rule-driven sequence');

    // Step 5: Review multiple remediation steps for clarity and absence of conflicts
    logger.info('Step 5: Reviewing multiple remediation steps for clarity and conflicts');
    const hasConflicts = await memberIssuePage.checkForConflictingSteps(steps);
    expect(hasConflicts).toBeFalsy();
    logger.info('Step 5 Passed: No step conflicts with another and overall guidance is coherent');

    // Step 6: Confirm appropriate data or systems references
    logger.info('Step 6: Confirming remediation steps reference appropriate systems');
    const hasValidReferences = await memberIssuePage.verifySystemReferences();
    expect(hasValidReferences).toBeTruthy();
    logger.info('Step 6 Passed: References in steps are consistent with diagnostic insight and available tools');

    logger.info('TC-002 completed successfully');
  });

  test('TC-003: Verify error handling when remediation rules are missing or invalid', async ({ page }) => {
    logger.info('Starting TC-003: Verify error handling when remediation rules are missing or invalid');
    const memberIssuePage = new MemberIssuePage(page);

    // Step 1: Launch the agent application and navigate to work queue
    logger.info('Step 1: Launching agent application and navigating to work queue');
    await memberIssuePage.navigate();
    await expect(memberIssuePage.workQueueSection).toBeVisible();
    logger.info('Step 1 Passed: Application loaded successfully and agent can access member issues');

    // Step 2: Open a member issue with misconfigured remediation rules
    logger.info('Step 2: Opening member issue with misconfigured remediation rules');
    await memberIssuePage.openMemberIssue('MI-INVALID-001');
    await expect(memberIssuePage.diagnosticInsightSection).toBeVisible();
    logger.info('Step 2 Passed: Member issue page opened with diagnostic insight but unresolvable remediation rules');

    // Step 3: Navigate to remediation guidance section
    logger.info('Step 3: Navigating to remediation guidance section');
    await memberIssuePage.openRemediationGuidance();
    await expect(memberIssuePage.remediationGuidanceSection).toBeVisible();
    logger.info('Step 3 Passed: Remediation guidance section opened and attempted to retrieve steps');

    // Step 4: Observe content when rules cannot determine appropriate steps
    logger.info('Step 4: Observing content when remediation steps are unavailable');
    const hasGenericPlaceholder = await memberIssuePage.hasGenericPlaceholder();
    expect(hasGenericPlaceholder).toBeFalsy();
    await expect(memberIssuePage.errorMessage).toBeVisible();
    const errorText = await memberIssuePage.getErrorMessageText();
    expect(errorText).toContain('unavailable');
    logger.info('Step 4 Passed: Explicit error message indicates remediation steps are unavailable');

    // Step 5: Validate clarity and specificity of error message
    logger.info('Step 5: Validating clarity of error/fallback message');
    expect(errorText.length).toBeGreaterThan(20);
    expect(errorText).not.toContain('Contact support');
    logger.info('Step 5 Passed: Error message clearly explains unavailable remediation steps');

    // Step 6: Confirm system logs the condition
    logger.info('Step 6: Confirming system logs the unavailable condition');
    const logEntry = await memberIssuePage.verifyLogEntry('MI-INVALID-001');
    expect(logEntry).toBeTruthy();
    expect(logEntry).toHaveProperty('diagnosticInsightId');
    expect(logEntry).toHaveProperty('memberIssueId');
    expect(logEntry).toHaveProperty('timestamp');
    logger.info('Step 6 Passed: Log entry created capturing diagnostic insight ID, member issue ID, and timestamp');

    logger.info('TC-003 completed successfully');
  });

  test('TC-004: Verify error handling for conflicting remediation rules', async ({ page }) => {
    logger.info('Starting TC-004: Verify error handling for conflicting remediation rules');
    const memberIssuePage = new MemberIssuePage(page);

    // Step 1: Launch the agent application and sign in
    logger.info('Step 1: Launching agent application and signing in as agent02');
    await memberIssuePage.navigate();
    await memberIssuePage.signIn('agent02', 'Support Agent');
    await expect(memberIssuePage.mainWorkspace).toBeVisible();
    logger.info('Step 1 Passed: Agent successfully logged in and reached main workspace');

    // Step 2: Open member issue with conflicting remediation rules
    logger.info('Step 2: Opening member issue with conflicting remediation rules (MI-3001)');
    await memberIssuePage.openMemberIssue('MI-3001');
    await expect(memberIssuePage.diagnosticInsightSection).toBeVisible();
    logger.info('Step 2 Passed: Member issue page displays diagnostic insight with conflicting remediation data');

    // Step 3: Access remediation guidance section
    logger.info('Step 3: Accessing remediation guidance section for conflicting insight');
    await memberIssuePage.openRemediationGuidance();
    await expect(memberIssuePage.remediationGuidanceSection).toBeVisible();
    logger.info('Step 3 Passed: Remediation guidance section attempted to load and detected conflicts');

    // Step 4: Verify no partially generated or misleading steps are shown
    logger.info('Step 4: Verifying no partial or misleading remediation steps are displayed');
    const hasPartialSteps = await memberIssuePage.hasPartialSteps();
    expect(hasPartialSteps).toBeFalsy();
    const hasGenericSteps = await memberIssuePage.hasGenericSteps();
    expect(hasGenericSteps).toBeFalsy();
    await expect(memberIssuePage.conflictIndicator).toBeVisible();
    logger.info('Step 4 Passed: System does not display partial, generic, or contradictory steps');

    // Step 5: Confirm explicit error message for conflict condition
    logger.info('Step 5: Confirming explicit error message for conflict condition');
    await expect(memberIssuePage.errorMessage).toBeVisible();
    const conflictErrorText = await memberIssuePage.getErrorMessageText();
    expect(conflictErrorText).toContain('conflicting');
    expect(conflictErrorText).toContain('unavailable');
    logger.info('Step 5 Passed: Error message specifies remediation steps unavailable due to conflicting rules');

    // Step 6: Validate conflict condition is logged
    logger.info('Step 6: Validating conflict condition is logged for follow-up');
    const conflictLogEntry = await memberIssuePage.verifyConflictLogEntry('MI-3001');
    expect(conflictLogEntry).toBeTruthy();
    expect(conflictLogEntry).toHaveProperty('ruleIds');
    expect(conflictLogEntry).toHaveProperty('diagnosticInsightId');
    expect(conflictLogEntry).toHaveProperty('memberIssueId');
    expect(conflictLogEntry).toHaveProperty('timestamp');
    logger.info('Step 6 Passed: Log entry created capturing conflict details in line with logging standards');

    logger.info('TC-004 completed successfully');
  });

});

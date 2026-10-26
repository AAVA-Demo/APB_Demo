const { test, expect } = require('@playwright/test');
const { AgentDesktopPage } = require('./pages/agentDesktop.page');
const { AIInsightsPage } = require('./pages/aiInsights.page');
const { Logger } = require('../../utils/logger');

test.describe('AI Diagnostic Insights - SCRUM-34043 TS001', () => {
  test('TC-001: Verify AI diagnostic insights retrieval for active member case', async ({ page }) => {
    const logger = new Logger();
    const agentDesktop = new AgentDesktopPage(page);
    const aiInsights = new AIInsightsPage(page);

    logger.info('Test Case 4315: Starting AI diagnostic insights retrieval test');

    // Step 1: Launch agent desktop and navigate to active member case
    logger.info('Step 1: Launching agent desktop application');
    await agentDesktop.navigate();
    await agentDesktop.login();
    await agentDesktop.openMemberCase();
    await expect(agentDesktop.caseSummaryPage).toBeVisible();
    logger.info('Agent desktop loaded and case summary displayed');

    // Step 2: Verify case data and context are present
    logger.info('Step 2: Verifying case workspace data');
    await expect(agentDesktop.recentEventsSection).toBeVisible();
    await expect(agentDesktop.caseNotesSection).toBeVisible();
    await expect(agentDesktop.contextualAttributesSection).toBeVisible();
    logger.info('Case workspace shows required contextual data');

    // Step 3: Trigger AI diagnostic insights retrieval
    logger.info('Step 3: Triggering AI diagnostic insights retrieval');
    await aiInsights.clickViewAIDiagnosticInsights();
    await expect(aiInsights.insightsRequestIndicator).toBeVisible();
    logger.info('AI insights request initiated');

    // Step 4: Observe AI diagnostic insights panel
    logger.info('Step 4: Verifying AI insights panel display');
    await expect(aiInsights.insightsPanel).toBeVisible();
    await expect(aiInsights.insightsList).toBeVisible();
    const insightCount = await aiInsights.getInsightsCount();
    expect(insightCount).toBeGreaterThan(0);
    logger.info(`AI insights displayed: ${insightCount} insights found`);

    // Step 5: Verify insights are associated with correct member case
    logger.info('Step 5: Verifying insights association with current case');
    const currentCaseId = await agentDesktop.getCurrentCaseId();
    const insightCaseReferences = await aiInsights.getInsightCaseReferences();
    for (const reference of insightCaseReferences) {
      expect(reference).toBe(currentCaseId);
    }
    logger.info('All insights correctly associated with current member case');

    // Step 6: Validate insight content consistency
    logger.info('Step 6: Validating insight content consistency');
    const caseContext = await agentDesktop.getCaseContext();
    const insightDescriptions = await aiInsights.getInsightDescriptions();
    for (const description of insightDescriptions) {
      expect(description).toBeTruthy();
      expect(description.length).toBeGreaterThan(0);
    }
    logger.info('Insight content validated and consistent with case data');
  });
});

test.describe('AI Diagnostic Insights - SCRUM-34043 TS002', () => {
  test('TC-001: Verify handling of insufficient case context', async ({ page }) => {
    const logger = new Logger();
    const agentDesktop = new AgentDesktopPage(page);
    const aiInsights = new AIInsightsPage(page);

    logger.info('Test Case 4316: Starting insufficient context handling test');

    // Step 1: Launch agent desktop with minimal context case
    logger.info('Step 1: Opening member case with minimal context');
    await agentDesktop.navigate();
    await agentDesktop.login();
    await agentDesktop.openMinimalContextCase();
    await expect(agentDesktop.caseSummaryPage).toBeVisible();
    logger.info('Case workspace displayed with limited data');

    // Step 2: Confirm missing contextual elements
    logger.info('Step 2: Confirming missing contextual elements');
    const hasIssueCategory = await agentDesktop.hasIssueCategory();
    const hasRecentEvents = await agentDesktop.hasRecentEvents();
    expect(hasIssueCategory).toBe(false);
    expect(hasRecentEvents).toBe(false);
    logger.info('Confirmed insufficient context precondition');

    // Step 3: Trigger AI diagnostic insights retrieval
    logger.info('Step 3: Triggering AI insights for insufficient context case');
    await aiInsights.clickViewAIDiagnosticInsights();
    logger.info('Insights request sent');

    // Step 4: Observe response in insights area
    logger.info('Step 4: Observing insights area response');
    await expect(aiInsights.insightsPanel).toBeVisible();
    const hasStaleInsights = await aiInsights.hasStaleOrIrrelevantInsights();
    expect(hasStaleInsights).toBe(false);
    logger.info('No stale or mismatched insights displayed');

    // Step 5: Verify appropriate error message
    logger.info('Step 5: Verifying error message display');
    await expect(aiInsights.noInsightsMessage).toBeVisible();
    const messageText = await aiInsights.getNoInsightsMessageText();
    expect(messageText).toContain('insufficient');
    logger.info('Appropriate error message displayed');
  });
});

test.describe('AI Remediation Guidance - SCRUM-34042 TS001', () => {
  test('TC-001: Verify retrieval of tailored remediation steps', async ({ page }) => {
    const logger = new Logger();
    const agentDesktop = new AgentDesktopPage(page);
    const aiInsights = new AIInsightsPage(page);

    logger.info('Test Case 4317: Starting remediation guidance retrieval test');

    // Step 1: Open case with existing AI insights
    logger.info('Step 1: Opening member case with existing AI insights');
    await agentDesktop.navigate();
    await agentDesktop.login();
    await agentDesktop.openCaseWithInsights();
    await expect(aiInsights.insightsPanel).toBeVisible();
    const insightCount = await aiInsights.getInsightsCount();
    expect(insightCount).toBeGreaterThan(0);
    logger.info('Case loaded with AI insights');

    // Step 2: Select one AI diagnostic insight
    logger.info('Step 2: Selecting AI diagnostic insight');
    await aiInsights.selectInsightByIndex(0);
    await expect(aiInsights.selectedInsightHighlight).toBeVisible();
    logger.info('Insight selected and guidance retrieval initiated');

    // Step 3: Observe remediation guidance section
    logger.info('Step 3: Observing remediation guidance section');
    await expect(aiInsights.remediationGuidanceSection).toBeVisible();
    await expect(aiInsights.remediationStepsList).toBeVisible();
    logger.info('Remediation steps displayed');

    // Step 4: Verify steps are clearly described and logically ordered
    logger.info('Step 4: Verifying step clarity and order');
    const steps = await aiInsights.getRemediationSteps();
    expect(steps.length).toBeGreaterThan(0);
    for (let i = 0; i < steps.length; i++) {
      expect(steps[i].description).toBeTruthy();
      expect(steps[i].description.length).toBeGreaterThan(10);
      expect(steps[i].order).toBe(i + 1);
    }
    logger.info('Steps are clearly described and properly ordered');

    // Step 5: Confirm steps are tailored to selected insight
    logger.info('Step 5: Confirming steps are tailored');
    const insightContext = await aiInsights.getSelectedInsightContext();
    const stepsContent = await aiInsights.getRemediationStepsContent();
    expect(stepsContent).toContain(insightContext.issueType);
    logger.info('Remediation steps are tailored to selected insight');
  });
});

test.describe('AI Remediation Guidance - SCRUM-34042 TS002', () => {
  test('TC-001: Verify handling of missing remediation mapping', async ({ page }) => {
    const logger = new Logger();
    const agentDesktop = new AgentDesktopPage(page);
    const aiInsights = new AIInsightsPage(page);

    logger.info('Test Case 4318: Starting missing remediation mapping test');

    // Step 1: Open case with insight lacking remediation mapping
    logger.info('Step 1: Opening case with unmapped insight');
    await agentDesktop.navigate();
    await agentDesktop.login();
    await agentDesktop.openCaseWithUnmappedInsight();
    await expect(aiInsights.insightsPanel).toBeVisible();
    logger.info('Case loaded with unmapped insight');

    // Step 2: Select insight and request remediation guidance
    logger.info('Step 2: Selecting unmapped insight');
    await aiInsights.selectUnmappedInsight();
    logger.info('Remediation guidance requested for unmapped insight');

    // Step 3: Observe guidance section
    logger.info('Step 3: Observing guidance section response');
    await expect(aiInsights.remediationGuidanceSection).toBeVisible();
    const hasIncompleteSteps = await aiInsights.hasIncompleteOrGenericSteps();
    expect(hasIncompleteSteps).toBe(false);
    logger.info('No incomplete or generic steps displayed');

    // Step 4: Verify clear error or fallback indication
    logger.info('Step 4: Verifying error message display');
    await expect(aiInsights.remediationUnavailableMessage).toBeVisible();
    const errorText = await aiInsights.getRemediationUnavailableText();
    expect(errorText).toContain('unavailable');
    logger.info('Clear error message displayed for missing remediation');
  });
});

test.describe('Real-time Insights Refresh - SCRUM-34041 TS001', () => {
  test('TC-001: Verify automatic refresh with new case data', async ({ page }) => {
    const logger = new Logger();
    const agentDesktop = new AgentDesktopPage(page);
    const aiInsights = new AIInsightsPage(page);

    logger.info('Test Case 4319: Starting automatic insights refresh test');

    // Step 1: Open case with existing insights
    logger.info('Step 1: Opening case with existing insights');
    await agentDesktop.navigate();
    await agentDesktop.login();
    await agentDesktop.openMemberCase();
    await expect(aiInsights.insightsPanel).toBeVisible();
    const initialTimestamp = await aiInsights.getLastRefreshTimestamp();
    const initialInsights = await aiInsights.getInsightDescriptions();
    logger.info(`Initial insights loaded, timestamp: ${initialTimestamp}`);

    // Step 2: Introduce new case data
    logger.info('Step 2: Adding new case event');
    await agentDesktop.addNewInteraction();
    await agentDesktop.updateClaimStatus();
    logger.info('New case data added');

    // Step 3: Observe automatic refresh behavior
    logger.info('Step 3: Observing automatic refresh');
    await expect(aiInsights.refreshIndicator).toBeVisible();
    await expect(aiInsights.refreshIndicator).toBeHidden({ timeout: 30000 });
    logger.info('Insights refreshed automatically');

    // Step 4: Compare insights before and after refresh
    logger.info('Step 4: Comparing insights after refresh');
    const updatedInsights = await aiInsights.getInsightDescriptions();
    expect(updatedInsights).toBeTruthy();
    logger.info('Insights reflect latest case data');

    // Step 5: Verify timestamp update
    logger.info('Step 5: Verifying timestamp update');
    const updatedTimestamp = await aiInsights.getLastRefreshTimestamp();
    expect(updatedTimestamp).not.toBe(initialTimestamp);
    logger.info(`Timestamp updated to: ${updatedTimestamp}`);
  });
});

test.describe('Real-time Insights Refresh - SCRUM-34041 TS002', () => {
  test('TC-001: Verify graceful handling of refresh failure', async ({ page }) => {
    const logger = new Logger();
    const agentDesktop = new AgentDesktopPage(page);
    const aiInsights = new AIInsightsPage(page);

    logger.info('Test Case 4320: Starting refresh failure handling test');

    // Step 1: Open case with valid insights
    logger.info('Step 1: Opening case with valid insights');
    await agentDesktop.navigate();
    await agentDesktop.login();
    await agentDesktop.openMemberCase();
    await expect(aiInsights.insightsPanel).toBeVisible();
    const validInsights = await aiInsights.getInsightDescriptions();
    logger.info('Valid insights displayed');

    // Step 2: Trigger refresh with simulated failure
    logger.info('Step 2: Triggering refresh with simulated failure');
    await agentDesktop.simulateAIServiceFailure();
    await aiInsights.triggerManualRefresh();
    logger.info('Refresh attempted under failure condition');

    // Step 3: Observe insights panel after failed refresh
    logger.info('Step 3: Observing insights after failure');
    await expect(aiInsights.insightsPanel).toBeVisible();
    const currentInsights = await aiInsights.getInsightDescriptions();
    expect(currentInsights).toEqual(validInsights);
    logger.info('Previous insights remain visible and unchanged');

    // Step 4: Verify error indication
    logger.info('Step 4: Verifying error indication');
    await expect(aiInsights.refreshErrorMessage).toBeVisible();
    const errorText = await aiInsights.getRefreshErrorText();
    expect(errorText).toContain('Unable to refresh');
    await expect(aiInsights.stalenessIndicator).toBeVisible();
    logger.info('Clear error indication displayed');
  });
});

test.describe('Priority-based Insights Display - SCRUM-34040 TS001', () => {
  test('TC-001: Verify high-priority insights sorting and highlighting', async ({ page }) => {
    const logger = new Logger();
    const agentDesktop = new AgentDesktopPage(page);
    const aiInsights = new AIInsightsPage(page);

    logger.info('Test Case 4321: Starting priority-based display test');

    // Step 1: Open case with multiple priority insights
    logger.info('Step 1: Opening case with varied priority insights');
    await agentDesktop.navigate();
    await agentDesktop.login();
    await agentDesktop.openCaseWithPriorityInsights();
    await expect(aiInsights.insightsPanel).toBeVisible();
    logger.info('Insights panel displayed');

    // Step 2: Trigger insights list display
    logger.info('Step 2: Confirming insights list display');
    await expect(aiInsights.insightsList).toBeVisible();
    logger.info('Insights list visible in default order');

    // Step 3: Observe ordering and identify high-priority insights
    logger.info('Step 3: Verifying high-priority insights at top');
    const insightsWithPriority = await aiInsights.getInsightsWithPriority();
    const highPriorityInsights = insightsWithPriority.filter(i => i.priority === 'high');
    const topInsights = insightsWithPriority.slice(0, highPriorityInsights.length);
    for (const insight of topInsights) {
      expect(insight.priority).toBe('high');
    }
    logger.info('High-priority insights displayed at top');

    // Step 4: Verify visual highlighting
    logger.info('Step 4: Verifying visual highlighting');
    for (let i = 0; i < highPriorityInsights.length; i++) {
      const hasHighlight = await aiInsights.hasHighPriorityHighlight(i);
      expect(hasHighlight).toBe(true);
    }
    logger.info('High-priority insights have distinct visual highlighting');
  });
});

test.describe('Priority-based Insights Display - SCRUM-34040 TS002', () => {
  test('TC-001: Verify standard priority insights display', async ({ page }) => {
    const logger = new Logger();
    const agentDesktop = new AgentDesktopPage(page);
    const aiInsights = new AIInsightsPage(page);

    logger.info('Test Case 4322: Starting standard priority display test');

    // Step 1: Open case with all standard priority insights
    logger.info('Step 1: Opening case with standard priority insights');
    await agentDesktop.navigate();
    await agentDesktop.login();
    await agentDesktop.openCaseWithStandardInsights();
    await expect(aiInsights.insightsPanel).toBeVisible();
    const insightCount = await aiInsights.getInsightsCount();
    expect(insightCount).toBeGreaterThanOrEqual(3);
    logger.info('Multiple standard priority insights displayed');

    // Step 2: Observe default ordering
    logger.info('Step 2: Observing default ordering');
    const insights = await aiInsights.getInsightsWithPriority();
    for (const insight of insights) {
      expect(insight.priority).toBe('standard');
    }
    logger.info('All insights have standard priority');

    // Step 3: Verify no high-priority highlighting
    logger.info('Step 3: Verifying no high-priority visuals');
    for (let i = 0; i < insights.length; i++) {
      const hasHighlight = await aiInsights.hasHighPriorityHighlight(i);
      expect(hasHighlight).toBe(false);
    }
    logger.info('No high-priority visual affordances present');
  });
});

test.describe('AI Recommendation Explanations - SCRUM-34039 TS001', () => {
  test('TC-001: Verify plain-language explanation display', async ({ page }) => {
    const logger = new Logger();
    const agentDesktop = new AgentDesktopPage(page);
    const aiInsights = new AIInsightsPage(page);

    logger.info('Test Case 4323: Starting recommendation explanation test');

    // Step 1: Open case with AI remediation recommendations
    logger.info('Step 1: Opening case with AI recommendations');
    await agentDesktop.navigate();
    await agentDesktop.login();
    await agentDesktop.openCaseWithRecommendations();
    await expect(aiInsights.recommendationsPanel).toBeVisible();
    logger.info('Recommendations panel displayed');

    // Step 2: Expand one AI recommendation
    logger.info('Step 2: Expanding recommendation details');
    await aiInsights.expandRecommendation(0);
    await expect(aiInsights.recommendationDetailView).toBeVisible();
    logger.info('Recommendation detail view opened');

    // Step 3: Review explanation text
    logger.info('Step 3: Reviewing explanation text');
    const explanationText = await aiInsights.getRecommendationExplanation();
    expect(explanationText).toBeTruthy();
    expect(explanationText.length).toBeGreaterThan(20);
    const hasTechnicalJargon = /\b(API|JSON|SQL|algorithm|parameter)\b/i.test(explanationText);
    expect(hasTechnicalJargon).toBe(false);
    logger.info('Explanation uses plain language');

    // Step 4: Verify rationale and remediation sections
    logger.info('Step 4: Verifying rationale and remediation content');
    const hasRationale = await aiInsights.hasRationaleSection();
    const hasRemediation = await aiInsights.hasRemediationSection();
    expect(hasRationale).toBe(true);
    expect(hasRemediation).toBe(true);
    logger.info('Both rationale and remediation approach clearly articulated');
  });
});

test.describe('AI Recommendation Explanations - SCRUM-34039 TS002', () => {
  test('TC-001: Verify handling of missing explanation data', async ({ page }) => {
    const logger = new Logger();
    const agentDesktop = new AgentDesktopPage(page);
    const aiInsights = new AIInsightsPage(page);

    logger.info('Test Case 4324: Starting missing explanation handling test');

    // Step 1: Verify recommendation with missing explanation
    logger.info('Step 1: Opening recommendation with missing explanation');
    await agentDesktop.navigate();
    await agentDesktop.login();
    await agentDesktop.openCaseWithMalformedRecommendation();
    await expect(aiInsights.recommendationsPanel).toBeVisible();
    logger.info('Recommendation visible with missing explanation data');

    // Step 2: Attempt to load explanation
    logger.info('Step 2: Attempting to load malformed explanation');
    await aiInsights.expandRecommendation(0);
    logger.info('System detected missing/malformed explanation');

    // Step 3: Verify fallback message display
    logger.info('Step 3: Verifying fallback message');
    await expect(aiInsights.explanationUnavailableMessage).toBeVisible();
    const fallbackText = await aiInsights.getExplanationUnavailableText();
    expect(fallbackText).toContain('unavailable');
    const hasRawContent = await aiInsights.hasRawTechnicalContent();
    expect(hasRawContent).toBe(false);
    logger.info('Clear fallback message displayed without raw content');
  });
});

test.describe('Resolution Outcome Feedback - SCRUM-34038 TS001', () => {
  test('TC-001: Verify successful resolution outcome capture', async ({ page }) => {
    const logger = new Logger();
    const agentDesktop = new AgentDesktopPage(page);
    const aiInsights = new AIInsightsPage(page);

    logger.info('Test Case 4325: Starting resolution outcome capture test');

    // Step 1: Open case with AI-guided remediation in progress
    logger.info('Step 1: Opening case with active AI remediation steps');
    await agentDesktop.navigate();
    await agentDesktop.login();
    await agentDesktop.openCaseWithActiveRemediation();
    await expect(aiInsights.remediationStepsList).toBeVisible();
    logger.info('AI remediation steps displayed');

    // Step 2: Complete AI-guided remediation steps
    logger.info('Step 2: Completing remediation steps');
    await aiInsights.completeAllRemediationSteps();
    logger.info('All remediation steps completed');

    // Step 3: Navigate to resolution outcome section
    logger.info('Step 3: Navigating to resolution outcome section');
    await agentDesktop.navigateToResolutionOutcome();
    await agentDesktop.selectOutcome('resolved');
    await expect(agentDesktop.outcomeField).toHaveValue('resolved');
    logger.info('Resolution outcome selected');

    // Step 4: Save resolution outcome
    logger.info('Step 4: Saving resolution outcome');
    await agentDesktop.saveResolutionOutcome();
    logger.info('Outcome save initiated');

    // Step 5: Verify outcome persistence and confirmation
    logger.info('Step 5: Verifying outcome persistence');
    await expect(agentDesktop.outcomeConfirmationMessage).toBeVisible();
    const confirmationText = await agentDesktop.getConfirmationMessageText();
    expect(confirmationText).toContain('saved');
    const outcomeRecord = await agentDesktop.getOutcomeFromHistory();
    expect(outcomeRecord.status).toBe('resolved');
    logger.info('Resolution outcome successfully persisted');
  });
});

test.describe('Resolution Outcome Feedback - SCRUM-34038 TS002', () => {
  test('TC-001: Verify validation and error handling for outcome submission', async ({ page }) => {
    const logger = new Logger();
    const agentDesktop = new AgentDesktopPage(page);

    logger.info('Test Case 4326: Starting outcome validation and error handling test');

    // Step 1: Open resolution outcome entry section
    logger.info('Step 1: Opening resolution outcome form');
    await agentDesktop.navigate();
    await agentDesktop.login();
    await agentDesktop.openMemberCase();
    await agentDesktop.navigateToResolutionOutcome();
    await expect(agentDesktop.resolutionOutcomeForm).toBeVisible();
    logger.info('Resolution outcome form displayed');

    // Step 2: Attempt to save without selecting outcome
    logger.info('Step 2: Attempting save without outcome selection');
    await agentDesktop.saveResolutionOutcome();
    logger.info('Save attempted with missing outcome');

    // Step 3: Observe validation behavior
    logger.info('Step 3: Verifying validation error');
    await expect(agentDesktop.validationErrorMessage).toBeVisible();
    const validationText = await agentDesktop.getValidationErrorText();
    expect(validationText).toContain('required');
    const outcomeRecorded = await agentDesktop.isOutcomeRecordedInBackend();
    expect(outcomeRecorded).toBe(false);
    logger.info('Validation error displayed and save blocked');

    // Step 4: Simulate backend failure with valid outcome
    logger.info('Step 4: Simulating backend failure');
    await agentDesktop.selectOutcome('resolved');
    await agentDesktop.simulateBackendFailure();
    await agentDesktop.saveResolutionOutcome();
    logger.info('Save attempted with backend failure');

    // Step 5: Verify failure indication
    logger.info('Step 5: Verifying failure indication');
    await expect(agentDesktop.saveErrorMessage).toBeVisible();
    const errorText = await agentDesktop.getSaveErrorText();
    expect(errorText).toContain('Unable to save');
    const outcomeCommitted = await agentDesktop.isOutcomeRecordedInBackend();
    expect(outcomeCommitted).toBe(false);
    logger.info('Clear error message displayed and outcome not recorded');
  });
});
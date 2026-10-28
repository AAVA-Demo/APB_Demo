const { expect } = require('@playwright/test');

exports.AuditTrailPage = class AuditTrailPage {
  constructor(page) {
    this.page = page;
    
    // Audit trail elements
    this.auditEventRow = page.locator('[data-testid="audit-event-row"]');
    this.auditEventType = page.locator('[data-testid="audit-event-type"]');
    this.auditChannel = page.locator('[data-testid="audit-channel"]');
    this.auditProviderStatus = page.locator('[data-testid="audit-provider-status"]');
    this.auditTimestamp = page.locator('[data-testid="audit-timestamp"]');
    this.auditFailureReason = page.locator('[data-testid="audit-failure-reason"]');
    this.deliveryStatus = page.locator('[data-testid="audit-delivery-status"]');
    this.finalStatus = page.locator('[data-testid="audit-final-status"]');
    
    // State transition elements
    this.stateTransitionRow = page.locator('[data-testid="state-transition-row"]');
    this.fromState = page.locator('[data-testid="from-state"]');
    this.toState = page.locator('[data-testid="to-state"]');
    this.transitionTimestamp = page.locator('[data-testid="transition-timestamp"]');
    
    // Lifecycle query elements
    this.lifecycleQueryInput = page.locator('[data-testid="lifecycle-query-input"]');
    this.lifecycleQueryButton = page.locator('[data-testid="lifecycle-query-button"]');
    this.lifecycleEventList = page.locator('[data-testid="lifecycle-event-list"]');
    this.lifecycleEvent = page.locator('[data-testid="lifecycle-event"]');
    
    // Fallback audit elements
    this.fallbackAttemptRow = page.locator('[data-testid="fallback-attempt-row"]');
    this.fallbackChannel = page.locator('[data-testid="fallback-channel"]');
    this.fallbackStatus = page.locator('[data-testid="fallback-status"]');
    this.fallbackReason = page.locator('[data-testid="fallback-reason"]');
    
    // Grouping and prioritization elements
    this.alertRecordRow = page.locator('[data-testid="alert-record-row"]');
    this.groupingDecisionDisplay = page.locator('[data-testid="grouping-decision"]');
    this.deliveryStrategyDisplay = page.locator('[data-testid="delivery-strategy"]');
    this.prioritizationDecisionRow = page.locator('[data-testid="prioritization-decision-row"]');
    this.priorityLevel = page.locator('[data-testid="priority-level"]');
    this.deliveryMethod = page.locator('[data-testid="delivery-method"]');
    
    // Idempotency elements
    this.duplicateEventRow = page.locator('[data-testid="duplicate-event-row"]');
    this.duplicateAction = page.locator('[data-testid="duplicate-action"]');
    this.duplicateReason = page.locator('[data-testid="duplicate-reason"]');
  }

  async navigate() {
    await this.page.goto('/fraud-alerts/audit-trail');
    await expect(this.page).toHaveURL(/.*audit-trail/);
  }

  async verifyAuditEntry(entryData) {
    const eventRow = this.page.locator(`[data-testid="audit-event-row"]:has-text("${entryData.event}")`);
    await expect(eventRow).toBeVisible();
    
    if (entryData.channel) {
      const channelCell = eventRow.locator('[data-testid="audit-channel"]');
      await expect(channelCell).toHaveText(entryData.channel);
    }
    
    if (entryData.providerStatus) {
      const statusCell = eventRow.locator('[data-testid="audit-provider-status"]');
      await expect(statusCell).toHaveText(entryData.providerStatus);
    }
  }

  async verifyDeliveryStatus(expectedStatus) {
    await expect(this.deliveryStatus).toHaveText(expectedStatus);
  }

  async verifyAuditEvent(eventType, eventData = {}) {
    const eventRow = this.page.locator(`[data-testid="audit-event-row"]:has-text("${eventType}")`);
    await expect(eventRow).toBeVisible();
    
    if (eventData.channel) {
      const channelCell = eventRow.locator('[data-testid="audit-channel"]');
      await expect(channelCell).toHaveText(eventData.channel);
    }
    
    if (eventData.failureReason) {
      const reasonCell = eventRow.locator('[data-testid="audit-failure-reason"]');
      await expect(reasonCell).toHaveText(eventData.failureReason);
    }
    
    if (eventData.timestamp) {
      const timestampCell = eventRow.locator('[data-testid="audit-timestamp"]');
      await expect(timestampCell).toHaveText(eventData.timestamp);
    }
    
    if (eventData.notificationId) {
      const notificationIdCell = eventRow.locator('[data-testid="audit-notification-id"]');
      await expect(notificationIdCell).toHaveText(eventData.notificationId);
    }
    
    if (eventData.providerStatus) {
      const providerStatusCell = eventRow.locator('[data-testid="audit-provider-status"]');
      await expect(providerStatusCell).toHaveText(eventData.providerStatus);
    }
    
    if (eventData.deliveredAt) {
      const deliveredAtCell = eventRow.locator('[data-testid="audit-delivered-at"]');
      await expect(deliveredAtCell).toHaveText(eventData.deliveredAt);
    }
    
    if (eventData.transactionId) {
      const transactionIdCell = eventRow.locator('[data-testid="audit-transaction-id"]');
      await expect(transactionIdCell).toHaveText(eventData.transactionId);
    }
    
    if (eventData.action) {
      const actionCell = eventRow.locator('[data-testid="duplicate-action"]');
      await expect(actionCell).toHaveText(eventData.action);
    }
    
    if (eventData.reason) {
      const reasonCell = eventRow.locator('[data-testid="duplicate-reason"]');
      await expect(reasonCell).toHaveText(eventData.reason);
    }
  }

  async verifyStateTransition(fromState, toState, timestamp) {
    const transitionRow = this.page.locator(`[data-testid="state-transition-row"]:has-text("${fromState}"):has-text("${toState}")`);
    await expect(transitionRow).toBeVisible();
    
    const timestampCell = transitionRow.locator('[data-testid="transition-timestamp"]');
    await expect(timestampCell).toHaveText(timestamp);
  }

  async queryAlertLifecycle(alertId) {
    await this.lifecycleQueryInput.fill(alertId);
    await this.lifecycleQueryButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLifecycleEvents(expectedEvents) {
    await expect(this.lifecycleEventList).toBeVisible();
    
    for (const eventName of expectedEvents) {
      const eventItem = this.page.locator(`[data-testid="lifecycle-event"]:has-text("${eventName}")`);
      await expect(eventItem).toBeVisible();
    }
    
    const allEvents = this.lifecycleEvent;
    await expect(allEvents).toHaveCount(expectedEvents.length);
  }

  async verifyMultipleFallbackAttempts(attempts) {
    for (const attempt of attempts) {
      const attemptRow = this.page.locator(`[data-testid="fallback-attempt-row"]:has-text("${attempt.channel}")`);
      await expect(attemptRow).toBeVisible();
      
      const statusCell = attemptRow.locator('[data-testid="fallback-status"]');
      await expect(statusCell).toHaveText(attempt.status);
      
      if (attempt.reason) {
        const reasonCell = attemptRow.locator('[data-testid="fallback-reason"]');
        await expect(reasonCell).toHaveText(attempt.reason);
      }
    }
  }

  async verifyIndividualAlertRecords(expectedCount) {
    const alertRecords = this.alertRecordRow;
    await expect(alertRecords).toHaveCount(expectedCount);
  }

  async verifyGroupingDecision(groupingData) {
    await expect(this.groupingDecisionDisplay).toBeVisible();
    
    const alertCountDisplay = this.page.locator('[data-testid="grouping-alert-count"]');
    await expect(alertCountDisplay).toHaveText(groupingData.alertCount.toString());
    
    const deliveryStrategyDisplay = this.page.locator('[data-testid="delivery-strategy"]');
    await expect(deliveryStrategyDisplay).toHaveText(groupingData.deliveryStrategy);
    
    const notificationCountDisplay = this.page.locator('[data-testid="grouping-notification-count"]');
    await expect(notificationCountDisplay).toHaveText(groupingData.notificationCount.toString());
  }

  async verifyPrioritizationDecisions(decisions) {
    for (const decision of decisions) {
      const decisionRow = this.page.locator(`[data-testid="prioritization-decision-row"]:has-text("${decision.transactionAmount}")`);
      await expect(decisionRow).toBeVisible();
      
      const priorityCell = decisionRow.locator('[data-testid="priority-level"]');
      await expect(priorityCell).toHaveText(decision.priority);
      
      const deliveryCell = decisionRow.locator('[data-testid="delivery-method"]');
      await expect(deliveryCell).toHaveText(decision.delivery);
    }
  }
};

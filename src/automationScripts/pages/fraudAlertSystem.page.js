const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.FraudAlertSystemPage = class FraudAlertSystemPage {
  constructor(page) {
    this.page = page;
    
    // Locators for Fraud Alert System
    this.systemStatusIndicator = page.locator('[data-testid="system-status"]');
    this.createAlertButton = page.locator('[data-testid="create-alert-btn"]');
    this.alertIdField = page.locator('[data-testid="alert-id"]');
    this.alertStatusField = page.locator('[data-testid="alert-status"]');
    this.transactionIdInput = page.locator('[data-testid="transaction-id-input"]');
    this.customerIdInput = page.locator('[data-testid="customer-id-input"]');
    this.amountInput = page.locator('[data-testid="amount-input"]');
    this.merchantInput = page.locator('[data-testid="merchant-input"]');
    this.pushTokenInput = page.locator('[data-testid="push-token-input"]');
    this.fallbackChannelSelect = page.locator('[data-testid="fallback-channel-select"]');
    this.submitAlertButton = page.locator('[data-testid="submit-alert-btn"]');
    this.alertCreatedMessage = page.locator('[data-testid="alert-created-message"]');
    
    // Notification service locators
    this.triggerNotificationButton = page.locator('[data-testid="trigger-notification-btn"]');
    this.notificationChannelInput = page.locator('[data-testid="notification-channel-input"]');
    this.notificationStatusField = page.locator('[data-testid="notification-status"]');
    this.notificationAcceptedMessage = page.locator('[data-testid="notification-accepted-message"]');
    this.notificationFailedMessage = page.locator('[data-testid="notification-failed-message"]');
    this.failureReasonField = page.locator('[data-testid="failure-reason"]');
    this.deliveryStatusField = page.locator('[data-testid="delivery-status"]');
    this.deliveryTimestampField = page.locator('[data-testid="delivery-timestamp"]');
    
    // Fallback mechanism locators
    this.fallbackAttemptIndicator = page.locator('[data-testid="fallback-attempt-indicator"]');
    this.fallbackChannelField = page.locator('[data-testid="fallback-channel"]');
    this.fallbackPhoneNumberField = page.locator('[data-testid="fallback-phone-number"]');
    this.fallbackEmailField = page.locator('[data-testid="fallback-email"]');
    this.fallbackCustomerIdField = page.locator('[data-testid="fallback-customer-id"]');
    
    // Audit trail locators
    this.auditTrailButton = page.locator('[data-testid="audit-trail-btn"]');
    this.auditTrailContainer = page.locator('[data-testid="audit-trail-container"]');
    this.auditEventType = page.locator('[data-testid="audit-event-type"]');
    this.auditAlertId = page.locator('[data-testid="audit-alert-id"]');
    this.auditDeliveryStatus = page.locator('[data-testid="audit-delivery-status"]');
    this.auditTimestamp = page.locator('[data-testid="audit-timestamp"]');
    this.auditChannel = page.locator('[data-testid="audit-channel"]');
    this.auditFailureReason = page.locator('[data-testid="audit-failure-reason"]');
    
    // Channel unavailability simulation locators
    this.simulateUnavailabilityButton = page.locator('[data-testid="simulate-unavailability-btn"]');
    this.pushStatusInput = page.locator('[data-testid="push-status-input"]');
    this.smsStatusInput = page.locator('[data-testid="sms-status-input"]');
    this.emailStatusInput = page.locator('[data-testid="email-status-input"]');
    this.channelStatusIndicator = page.locator('[data-testid="channel-status-indicator"]');
    
    // Retry policy locators
    this.retryPolicyField = page.locator('[data-testid="retry-policy"]');
    this.maxRetriesField = page.locator('[data-testid="max-retries"]');
    this.retryCountField = page.locator('[data-testid="retry-count"]');
    this.retryStatusField = page.locator('[data-testid="retry-status"]');
    this.retryExhaustedFlag = page.locator('[data-testid="retry-exhausted-flag"]');
    this.retryAttemptsContainer = page.locator('[data-testid="retry-attempts-container"]');
  }

  async navigate() {
    await this.page.goto('https://fraud-alert-system.example.com');
    await expect(this.page).toHaveURL(/fraud-alert-system/);
    logger.info('Navigated to Fraud Alert System');
  }

  async verifySystemAccessible() {
    await expect(this.systemStatusIndicator).toBeVisible();
    await expect(this.systemStatusIndicator).toHaveText(/ready|accessible/i);
    logger.info('System accessibility verified');
  }

  async createFraudAlert(alertData) {
    await expect(this.createAlertButton).toBeVisible();
    await this.createAlertButton.click();
    
    await this.transactionIdInput.fill(alertData.transaction_id);
    await this.customerIdInput.fill(alertData.customer_id);
    await this.amountInput.fill(alertData.amount);
    await this.merchantInput.fill(alertData.merchant);
    
    if (alertData.push_token !== null && alertData.push_token !== undefined) {
      await this.pushTokenInput.fill(alertData.push_token);
    } else {
      await this.pushTokenInput.clear();
    }
    
    if (alertData.fallback_channel) {
      await this.fallbackChannelSelect.selectOption(alertData.fallback_channel);
    }
    
    await this.submitAlertButton.click();
    await expect(this.alertCreatedMessage).toBeVisible();
    
    const alertId = await this.alertIdField.textContent();
    logger.info('Fraud alert created with ID: ' + alertId);
    return alertId;
  }

  async verifyAlertCreated(alertId, expectedStatus) {
    await expect(this.alertIdField).toHaveText(alertId);
    await expect(this.alertStatusField).toHaveText(expectedStatus);
    logger.info('Alert creation verified: ' + alertId + ' with status: ' + expectedStatus);
  }

  async triggerNotificationService(notificationData) {
    await expect(this.triggerNotificationButton).toBeVisible();
    await this.triggerNotificationButton.click();
    
    await this.page.locator('[data-testid="notification-alert-id-input"]').fill(notificationData.alert_id);
    await this.notificationChannelInput.fill(notificationData.channel);
    
    if (notificationData.failure_reason) {
      await this.page.locator('[data-testid="simulate-failure-checkbox"]').check();
      await this.page.locator('[data-testid="failure-reason-input"]').fill(notificationData.failure_reason);
    }
    
    await this.page.locator('[data-testid="send-notification-btn"]').click();
    logger.info('Notification service triggered for alert: ' + notificationData.alert_id);
  }

  async verifyNotificationAccepted() {
    await expect(this.notificationAcceptedMessage).toBeVisible();
    await expect(this.notificationStatusField).toHaveText(/success|accepted/i);
    logger.info('Notification accepted by service');
  }

  async verifyNotificationFailed(expectedReason) {
    await expect(this.notificationFailedMessage).toBeVisible();
    await expect(this.failureReasonField).toContainText(expectedReason);
    logger.info('Notification failure verified with reason: ' + expectedReason);
  }

  async verifyNotificationDelivered(alertId, expectedStatus) {
    await this.page.locator('[data-testid="check-delivery-btn"]').click();
    await this.page.locator('[data-testid="delivery-alert-id-input"]').fill(alertId);
    await this.page.locator('[data-testid="verify-delivery-btn"]').click();
    
    await expect(this.deliveryStatusField).toBeVisible();
    await expect(this.deliveryStatusField).toHaveText(expectedStatus);
    logger.info('Notification delivery verified: ' + expectedStatus);
  }

  async verifyDeliveryTimestamp() {
    await expect(this.deliveryTimestampField).toBeVisible();
    const timestamp = await this.deliveryTimestampField.textContent();
    expect(timestamp).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    logger.info('Delivery timestamp verified: ' + timestamp);
  }

  async verifyFallbackAttempt(fallbackData) {
    await expect(this.fallbackAttemptIndicator).toBeVisible();
    await expect(this.fallbackChannelField).toHaveText(fallbackData.fallback_channel);
    
    if (fallbackData.phone_number) {
      await expect(this.fallbackPhoneNumberField).toHaveText(fallbackData.phone_number);
    }
    
    if (fallbackData.email_address) {
      await expect(this.fallbackEmailField).toHaveText(fallbackData.email_address);
    }
    
    if (fallbackData.customer_id) {
      await expect(this.fallbackCustomerIdField).toHaveText(fallbackData.customer_id);
    }
    
    logger.info('Fallback attempt verified for channel: ' + fallbackData.fallback_channel);
  }

  async verifyAuditTrail(alertId, expectedEventType) {
    await this.auditTrailButton.click();
    await this.page.locator('[data-testid="audit-search-alert-id"]').fill(alertId);
    await this.page.locator('[data-testid="audit-search-btn"]').click();
    
    await expect(this.auditTrailContainer).toBeVisible();
    const eventTypes = await this.auditEventType.allTextContents();
    expect(eventTypes).toContain(expectedEventType);
    logger.info('Audit trail verified for event: ' + expectedEventType);
  }

  async verifyAuditTrailFields(expectedFields) {
    for (const field of expectedFields) {
      const fieldLocator = this.page.locator(`[data-testid="audit-${field}"]`);
      await expect(fieldLocator).toBeVisible();
    }
    logger.info('Audit trail fields verified: ' + expectedFields.join(', '));
  }

  async verifyAuditTrailFailureReason(expectedReason) {
    await expect(this.auditFailureReason).toBeVisible();
    await expect(this.auditFailureReason).toContainText(expectedReason);
    logger.info('Audit trail failure reason verified: ' + expectedReason);
  }

  async simulateChannelUnavailability(channelStatus) {
    await this.simulateUnavailabilityButton.click();
    await this.pushStatusInput.fill(channelStatus.push_status);
    await this.smsStatusInput.fill(channelStatus.sms_status);
    await this.emailStatusInput.fill(channelStatus.email_status);
    await this.page.locator('[data-testid="apply-unavailability-btn"]').click();
    logger.info('Channel unavailability simulated');
  }

  async verifyAllChannelsUnavailable() {
    const statusText = await this.channelStatusIndicator.textContent();
    expect(statusText).toMatch(/all.*unavailable/i);
    logger.info('All channels verified as unavailable');
  }

  async verifyDeliveryFailures(alertId, failureReasons) {
    await this.page.locator('[data-testid="view-failures-btn"]').click();
    await this.page.locator('[data-testid="failure-alert-id-input"]').fill(alertId);
    await this.page.locator('[data-testid="load-failures-btn"]').click();
    
    const failuresContainer = this.page.locator('[data-testid="failures-container"]');
    await expect(failuresContainer).toBeVisible();
    
    for (const reason of failureReasons) {
      const reasonLocator = this.page.locator(`[data-testid="failure-reason"]:has-text("${reason}")`);
      await expect(reasonLocator).toBeVisible();
    }
    logger.info('Delivery failures verified for all channels');
  }

  async verifyAlertNotMarkedDelivered(alertId) {
    await this.page.locator('[data-testid="check-alert-status-btn"]').click();
    await this.page.locator('[data-testid="status-alert-id-input"]').fill(alertId);
    await this.page.locator('[data-testid="load-status-btn"]').click();
    
    const status = await this.alertStatusField.textContent();
    expect(status).not.toMatch(/delivered/i);
    logger.info('Alert verified as not marked delivered');
  }

  async verifyRetryPolicyInitiated(retryPolicy) {
    await expect(this.retryPolicyField).toBeVisible();
    await expect(this.retryPolicyField).toHaveText(retryPolicy.retry_policy);
    await expect(this.maxRetriesField).toHaveText(retryPolicy.max_retries.toString());
    await expect(this.retryStatusField).toHaveText(/initiated|active/i);
    logger.info('Retry policy initiated: ' + retryPolicy.retry_policy);
  }

  async verifyAlertStatus(alertId, expectedStatus) {
    await this.page.locator('[data-testid="check-alert-status-btn"]').click();
    await this.page.locator('[data-testid="status-alert-id-input"]').fill(alertId);
    await this.page.locator('[data-testid="load-status-btn"]').click();
    
    await expect(this.alertStatusField).toHaveText(expectedStatus);
    logger.info('Alert status verified: ' + expectedStatus);
  }

  async simulatePersistentUnavailability(channelStatus) {
    await this.simulateUnavailabilityButton.click();
    await this.pushStatusInput.fill(channelStatus.push_status);
    await this.smsStatusInput.fill(channelStatus.sms_status);
    await this.emailStatusInput.fill(channelStatus.email_status);
    await this.page.locator('[data-testid="retry-attempts-input"]').fill(channelStatus.retry_attempts.toString());
    await this.page.locator('[data-testid="apply-persistent-unavailability-btn"]').click();
    logger.info('Persistent channel unavailability simulated through all retries');
  }

  async verifyRetryExhaustion(retryConfig) {
    await expect(this.maxRetriesField).toHaveText(retryConfig.max_retries.toString());
    await expect(this.retryCountField).toHaveText(retryConfig.retry_count.toString());
    await expect(this.retryStatusField).toHaveText(retryConfig.status);
    logger.info('Retry exhaustion verified: ' + retryConfig.status);
  }

  async verifyRetryExhaustedFlag(alertId, expectedValue) {
    await this.page.locator('[data-testid="check-alert-details-btn"]').click();
    await this.page.locator('[data-testid="details-alert-id-input"]').fill(alertId);
    await this.page.locator('[data-testid="load-details-btn"]').click();
    
    await expect(this.retryExhaustedFlag).toBeVisible();
    const flagValue = await this.retryExhaustedFlag.textContent();
    expect(flagValue).toBe(expectedValue.toString());
    logger.info('Retry exhausted flag verified: ' + expectedValue);
  }

  async verifyAuditTrailMultipleFailures(alertId) {
    await this.auditTrailButton.click();
    await this.page.locator('[data-testid="audit-search-alert-id"]').fill(alertId);
    await this.page.locator('[data-testid="audit-search-btn"]').click();
    
    const failureEvents = await this.page.locator('[data-testid="audit-event-type"]:has-text("fraud_alert_failed")').count();
    expect(failureEvents).toBeGreaterThan(1);
    logger.info('Multiple failure events verified in audit trail: ' + failureEvents);
  }
};

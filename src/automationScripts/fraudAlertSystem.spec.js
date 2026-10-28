const { test, expect } = require('@playwright/test');
const { FraudAlertSystemPage } = require('./pages/fraudAlertSystem.page');
const logger = require('../utils/logger');

test.describe('Fraud Alert System - Notification Delivery Tests', () => {
  let fraudAlertPage;

  test.beforeEach(async ({ page }) => {
    fraudAlertPage = new FraudAlertSystemPage(page);
    logger.info('Initializing Fraud Alert System test');
  });

  test('TC-4352: Successful push notification delivery for valid token', async ({ page }) => {
    logger.info('Starting test TC-4352: Push notification delivery with valid token');
    
    // Step 1: Launch the credit card fraud alert system
    await fraudAlertPage.navigate();
    await fraudAlertPage.verifySystemAccessible();
    logger.info('Step 1: System is accessible and ready');
    
    // Step 2: Create fraud alert with valid push token
    const alertData = {
      transaction_id: 'TXN-001',
      customer_id: 'CUST-001',
      amount: '$500',
      merchant: 'Unknown Merchant',
      push_token: 'valid_token_123'
    };
    const alertId = await fraudAlertPage.createFraudAlert(alertData);
    await fraudAlertPage.verifyAlertCreated(alertId, 'Created');
    logger.info('Step 2: Fraud alert created successfully with alert_id: ' + alertId);
    
    // Step 3: Trigger notification service for push notification
    const notificationData = {
      alert_id: alertId,
      channel: 'push_notification'
    };
    await fraudAlertPage.triggerNotificationService(notificationData);
    await fraudAlertPage.verifyNotificationAccepted();
    logger.info('Step 3: Notification service accepted alert for delivery');
    
    // Step 4: Verify push notification delivery
    await fraudAlertPage.verifyNotificationDelivered(alertId, 'delivered');
    await fraudAlertPage.verifyDeliveryTimestamp();
    logger.info('Step 4: Push notification delivered successfully');
    
    // Step 5: Check audit trail
    await fraudAlertPage.verifyAuditTrail(alertId, 'fraud_alert_delivered');
    await fraudAlertPage.verifyAuditTrailFields(['alert_id', 'delivery_status', 'timestamp', 'channel']);
    logger.info('Step 5: Audit trail verified with delivery confirmation');
  });

  test('TC-4353: Push notification failure with SMS fallback', async ({ page }) => {
    logger.info('Starting test TC-4353: Push notification failure with SMS fallback');
    
    // Step 1: Launch system
    await fraudAlertPage.navigate();
    await fraudAlertPage.verifySystemAccessible();
    logger.info('Step 1: System is accessible and ready');
    
    // Step 2: Create fraud alert with no valid push token
    const alertData = {
      transaction_id: 'TXN-002',
      customer_id: 'CUST-002',
      amount: '$750',
      merchant: 'Suspicious Store',
      push_token: null
    };
    const alertId = await fraudAlertPage.createFraudAlert(alertData);
    await fraudAlertPage.verifyAlertCreated(alertId, 'Created');
    logger.info('Step 2: Fraud alert created with null push token');
    
    // Step 3: Attempt push notification delivery
    const notificationData = {
      alert_id: alertId,
      channel: 'push_notification',
      failure_reason: 'No valid push token available'
    };
    await fraudAlertPage.triggerNotificationService(notificationData);
    await fraudAlertPage.verifyNotificationFailed('No valid push token available');
    logger.info('Step 3: Push notification failed as expected');
    
    // Step 4: Verify SMS fallback attempt
    const fallbackData = {
      fallback_channel: 'SMS',
      phone_number: '+1-555-0100'
    };
    await fraudAlertPage.verifyFallbackAttempt(fallbackData);
    logger.info('Step 4: System attempted SMS fallback delivery');
    
    // Step 5: Check audit trail for both events
    await fraudAlertPage.verifyAuditTrail(alertId, 'fraud_alert_failed');
    await fraudAlertPage.verifyAuditTrail(alertId, 'fraud_alert_sent');
    await fraudAlertPage.verifyAuditTrailFailureReason('No valid push token available');
    logger.info('Step 5: Audit trail verified with push failure and SMS fallback');
  });

  test('TC-4354: Push notification failure with email fallback', async ({ page }) => {
    logger.info('Starting test TC-4354: Push notification failure with email fallback');
    
    // Step 1: Launch system
    await fraudAlertPage.navigate();
    await fraudAlertPage.verifySystemAccessible();
    logger.info('Step 1: System is accessible and ready');
    
    // Step 2: Create fraud alert with email fallback
    const alertData = {
      transaction_id: 'TXN-003',
      customer_id: 'CUST-003',
      amount: '$1200',
      merchant: 'Unknown Online Store',
      push_token: null,
      fallback_channel: 'email'
    };
    const alertId = await fraudAlertPage.createFraudAlert(alertData);
    await fraudAlertPage.verifyAlertCreated(alertId, 'Created');
    logger.info('Step 2: Fraud alert created with email fallback configured');
    
    // Step 3: Attempt push notification delivery
    const notificationData = {
      alert_id: alertId,
      channel: 'push_notification',
      failure_reason: 'No valid push token available'
    };
    await fraudAlertPage.triggerNotificationService(notificationData);
    await fraudAlertPage.verifyNotificationFailed('No valid push token available');
    logger.info('Step 3: Push notification failed as expected');
    
    // Step 4: Verify email fallback attempt
    const fallbackData = {
      fallback_channel: 'email',
      email_address: 'customer@example.com'
    };
    await fraudAlertPage.verifyFallbackAttempt(fallbackData);
    logger.info('Step 4: System attempted email fallback delivery');
    
    // Step 5: Check audit trail
    await fraudAlertPage.verifyAuditTrail(alertId, 'fraud_alert_failed');
    await fraudAlertPage.verifyAuditTrail(alertId, 'fraud_alert_sent');
    await fraudAlertPage.verifyAuditTrailFailureReason('No valid push token available');
    logger.info('Step 5: Audit trail verified with push failure and email fallback');
  });

  test('TC-4355: Push notification failure with in-app fallback', async ({ page }) => {
    logger.info('Starting test TC-4355: Push notification failure with in-app fallback');
    
    // Step 1: Launch system
    await fraudAlertPage.navigate();
    await fraudAlertPage.verifySystemAccessible();
    logger.info('Step 1: System is accessible and ready');
    
    // Step 2: Create fraud alert with in-app fallback
    const alertData = {
      transaction_id: 'TXN-004',
      customer_id: 'CUST-004',
      amount: '$950',
      merchant: 'Foreign Merchant',
      push_token: null,
      fallback_channel: 'in-app'
    };
    const alertId = await fraudAlertPage.createFraudAlert(alertData);
    await fraudAlertPage.verifyAlertCreated(alertId, 'Created');
    logger.info('Step 2: Fraud alert created with in-app fallback configured');
    
    // Step 3: Attempt push notification delivery
    const notificationData = {
      alert_id: alertId,
      channel: 'push_notification',
      failure_reason: 'No valid push token available'
    };
    await fraudAlertPage.triggerNotificationService(notificationData);
    await fraudAlertPage.verifyNotificationFailed('No valid push token available');
    logger.info('Step 3: Push notification failed as expected');
    
    // Step 4: Verify in-app fallback attempt
    const fallbackData = {
      fallback_channel: 'in-app',
      customer_id: 'CUST-004'
    };
    await fraudAlertPage.verifyFallbackAttempt(fallbackData);
    logger.info('Step 4: System attempted in-app fallback delivery');
    
    // Step 5: Check audit trail
    await fraudAlertPage.verifyAuditTrail(alertId, 'fraud_alert_failed');
    await fraudAlertPage.verifyAuditTrail(alertId, 'fraud_alert_sent');
    await fraudAlertPage.verifyAuditTrailFailureReason('No valid push token available');
    logger.info('Step 5: Audit trail verified with push failure and in-app fallback');
  });

  test('TC-4356: All notification channels unavailable with retry policy', async ({ page }) => {
    logger.info('Starting test TC-4356: All channels unavailable with retry policy');
    
    // Step 1: Launch system
    await fraudAlertPage.navigate();
    await fraudAlertPage.verifySystemAccessible();
    logger.info('Step 1: System is accessible and ready');
    
    // Step 2: Create and queue fraud alert
    const alertData = {
      transaction_id: 'TXN-005',
      customer_id: 'CUST-005',
      amount: '$2000',
      merchant: 'High Risk Merchant',
      alert_status: 'Queued'
    };
    const alertId = await fraudAlertPage.createFraudAlert(alertData);
    await fraudAlertPage.verifyAlertCreated(alertId, 'Queued');
    logger.info('Step 2: Fraud alert created and queued');
    
    // Step 3: Simulate all channels unavailable
    const channelStatus = {
      push_status: 'unavailable',
      sms_status: 'unavailable',
      email_status: 'unavailable'
    };
    await fraudAlertPage.simulateChannelUnavailability(channelStatus);
    await fraudAlertPage.verifyAllChannelsUnavailable();
    logger.info('Step 3: All notification channels unavailable');
    
    // Step 4: Verify delivery failure recorded
    const failureReasons = ['push: service unavailable', 'sms: provider timeout', 'email: connection error'];
    await fraudAlertPage.verifyDeliveryFailures(alertId, failureReasons);
    await fraudAlertPage.verifyAlertNotMarkedDelivered(alertId);
    logger.info('Step 4: Delivery failures recorded for all channels');
    
    // Step 5: Verify retry policy initiated
    const retryPolicy = {
      retry_policy: 'exponential_backoff',
      max_retries: 3
    };
    await fraudAlertPage.verifyRetryPolicyInitiated(retryPolicy);
    logger.info('Step 5: Retry policy initiated according to configuration');
    
    // Step 6: Verify alert remains queued
    await fraudAlertPage.verifyAlertStatus(alertId, 'Queued');
    logger.info('Step 6: Alert remains in Queued state');
  });

  test('TC-4357: Retry exhaustion for persistent channel unavailability', async ({ page }) => {
    logger.info('Starting test TC-4357: Retry exhaustion scenario');
    
    // Step 1: Launch system
    await fraudAlertPage.navigate();
    await fraudAlertPage.verifySystemAccessible();
    logger.info('Step 1: System is accessible and ready');
    
    // Step 2: Create and queue fraud alert
    const alertData = {
      transaction_id: 'TXN-006',
      customer_id: 'CUST-006',
      amount: '$3500',
      merchant: 'Overseas Merchant',
      alert_status: 'Queued'
    };
    const alertId = await fraudAlertPage.createFraudAlert(alertData);
    await fraudAlertPage.verifyAlertCreated(alertId, 'Queued');
    logger.info('Step 2: Fraud alert created and queued');
    
    // Step 3: Simulate persistent unavailability
    const channelStatus = {
      push_status: 'unavailable',
      sms_status: 'unavailable',
      email_status: 'unavailable',
      retry_attempts: 3
    };
    await fraudAlertPage.simulatePersistentUnavailability(channelStatus);
    logger.info('Step 3: Persistent channel unavailability simulated');
    
    // Step 4: Verify retry exhaustion
    const retryConfig = {
      max_retries: 3,
      retry_count: 3,
      status: 'retry_exhausted'
    };
    await fraudAlertPage.verifyRetryExhaustion(retryConfig);
    logger.info('Step 4: All retry attempts exhausted');
    
    // Step 5: Verify alert status with retry exhaustion flag
    await fraudAlertPage.verifyAlertStatus(alertId, 'Queued');
    await fraudAlertPage.verifyRetryExhaustedFlag(alertId, true);
    logger.info('Step 5: Alert remains Queued with retry exhaustion flag');
    
    // Step 6: Check audit trail
    await fraudAlertPage.verifyAuditTrailMultipleFailures(alertId);
    await fraudAlertPage.verifyAuditTrail(alertId, 'retry_exhausted');
    logger.info('Step 6: Audit trail verified with all attempts and exhaustion event');
  });
});

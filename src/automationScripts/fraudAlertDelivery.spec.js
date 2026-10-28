const { test, expect } = require('@playwright/test');
const { FraudAlertPage } = require('./pages/fraudAlert.page');
const { AuditTrailPage } = require('./pages/auditTrail.page');

test.describe('Fraud Alert Delivery - TS001', () => {

  test('TC-001: Verify fraud alert delivery via push notification with valid token', async ({ page }) => {
    const fraudAlertPage = new FraudAlertPage(page);
    const auditTrailPage = new AuditTrailPage(page);

    // Step 1: Trigger suspicious transaction
    await fraudAlertPage.triggerSuspiciousTransaction({
      amount: 500,
      merchant: 'Unknown_Vendor_XYZ',
      card: '****1234',
      timestamp: '2026-08-15T14:30:00Z',
      pushToken: 'valid_token_abc123'
    });
    await expect(fraudAlertPage.alertCreationIndicator).toBeVisible();

    // Step 2: Verify risk evaluation and alert creation
    await fraudAlertPage.verifyRiskEvaluation({ riskScore: 75, threshold: 60 });
    await expect(fraudAlertPage.alertStatus).toHaveText('Created');

    // Step 3: Verify alert queued for push notification
    await fraudAlertPage.verifyAlertQueued('Push', 'Firebase/APNS', 'valid_token_abc123');
    await expect(fraudAlertPage.alertStatus).toHaveText('Queued');

    // Step 4: Verify push notification delivery within SLA
    await fraudAlertPage.verifyPushDelivery({ slaTarget: 30, actualDeliveryTime: 15 });
    await expect(fraudAlertPage.alertStatus).toHaveText('Delivered');
    await expect(fraudAlertPage.deliveryTimestamp).toBeVisible();

    // Step 5: Verify push notification content
    await fraudAlertPage.verifyNotificationContent({
      amount: '$500',
      merchant: 'Unknown_Vendor_XYZ',
      timestamp: 'Aug 15, 2026 2:30 PM',
      maskedCard: '****1234',
      actionButtons: ['Yes, this was me', "No, I don't recognize this"]
    });

    // Step 6: Verify audit trail
    await auditTrailPage.navigate();
    await auditTrailPage.verifyAuditEntry({
      event: 'fraud_alert_delivered',
      channel: 'Push',
      providerStatus: 'Delivered'
    });
  });

  test('TC-002: Verify fraud alert with multiple risk signals and plain-language messaging', async ({ page }) => {
    const fraudAlertPage = new FraudAlertPage(page);
    const auditTrailPage = new AuditTrailPage(page);

    // Step 1: Trigger suspicious transaction with multiple risk signals
    await fraudAlertPage.triggerSuspiciousTransaction({
      amount: 1200,
      merchant: 'Electronics_Store_Foreign',
      location: 'Tokyo_Japan',
      customerUsualLocation: 'New_York_USA',
      card: '****5678'
    });
    await expect(fraudAlertPage.alertCreationIndicator).toBeVisible();

    // Step 2: Verify plain-language risk message
    await expect(fraudAlertPage.riskMessage).toHaveText(/We noticed unusual activity on your card/);
    await expect(fraudAlertPage.riskMessage).not.toContainText(/model|score|algorithm/);

    // Step 3: Verify masked card or nickname display
    await expect(fraudAlertPage.cardIdentifier).toHaveText(/\*\*\*\*5678|Travel Card/);

    // Step 4: Verify approximate location display
    await expect(fraudAlertPage.transactionLocation).toHaveText('Tokyo, Japan');

    // Step 5: Verify safety guidance and action options
    await expect(fraudAlertPage.safetyGuidance).toContainText("If you don't recognize this transaction, select No to secure your account immediately");
    await expect(fraudAlertPage.confirmButton).toBeVisible();
    await expect(fraudAlertPage.reportButton).toBeVisible();

    // Step 6: Verify SLA compliance and audit trail
    await fraudAlertPage.verifyDeliverySLA({ slaTarget: 30, actualDeliveryTime: 22 });
    await expect(fraudAlertPage.alertStatus).toHaveText('Delivered');
    await auditTrailPage.navigate();
    await auditTrailPage.verifyDeliveryStatus('Delivered');
  });

  test('TC-003: Verify complete alert lifecycle and audit trail', async ({ page }) => {
    const fraudAlertPage = new FraudAlertPage(page);
    const auditTrailPage = new AuditTrailPage(page);

    // Step 1: Initiate suspicious transaction
    await fraudAlertPage.triggerSuspiciousTransaction({
      transactionId: 'TXN-98765',
      alertId: 'ALERT-12345',
      customerId: 'CUST-555',
      timestamp: '2026-08-15T10:00:00Z'
    });
    await expect(fraudAlertPage.alertStatus).toHaveText('Created');
    await auditTrailPage.navigate();
    await auditTrailPage.verifyAuditEvent('fraud_alert_created');

    // Step 2: Verify alert transitions to Queued
    await fraudAlertPage.navigate();
    await fraudAlertPage.waitForStatusTransition('Queued');
    await expect(fraudAlertPage.alertStatus).toHaveText('Queued');
    await auditTrailPage.navigate();
    await auditTrailPage.verifyStateTransition('Created', 'Queued', '2026-08-15T10:00:05Z');

    // Step 3: Verify notification sent to push provider
    await fraudAlertPage.navigate();
    await fraudAlertPage.verifyNotificationSent({
      notificationId: 'NOTIF-67890',
      channel: 'Push',
      sentAt: '2026-08-15T10:00:10Z'
    });
    await auditTrailPage.navigate();
    await auditTrailPage.verifyAuditEvent('fraud_alert_sent', {
      notificationId: 'NOTIF-67890',
      channel: 'Push'
    });

    // Step 4: Verify push provider confirms delivery
    await fraudAlertPage.navigate();
    await fraudAlertPage.waitForStatusTransition('Delivered');
    await expect(fraudAlertPage.alertStatus).toHaveText('Delivered');
    await auditTrailPage.navigate();
    await auditTrailPage.verifyAuditEvent('fraud_alert_delivered', {
      providerStatus: 'Delivered',
      deliveredAt: '2026-08-15T10:00:20Z'
    });

    // Step 5: Query audit trail for complete lifecycle
    await auditTrailPage.queryAlertLifecycle('ALERT-12345');
    await auditTrailPage.verifyLifecycleEvents(['Created', 'Queued', 'Sent', 'Delivered']);
    await expect(auditTrailPage.finalStatus).toHaveText('Delivered');
  });
});

test.describe('Fraud Alert Fallback Mechanisms - TS002', () => {

  test('TC-001: Verify fallback to SMS when push notification fails', async ({ page }) => {
    const fraudAlertPage = new FraudAlertPage(page);
    const auditTrailPage = new AuditTrailPage(page);

    // Step 1: Trigger suspicious transaction
    await fraudAlertPage.triggerSuspiciousTransaction({
      amount: 750,
      card: '****9012',
      pushToken: 'valid_token',
      sms: '+1-555-0123'
    });
    await expect(fraudAlertPage.alertCreationIndicator).toBeVisible();

    // Step 2: Simulate push provider unavailability
    await fraudAlertPage.simulatePushProviderFailure('HTTP 503 Service Unavailable');
    await expect(fraudAlertPage.providerError).toContainText('Push service temporarily unavailable');

    // Step 3: Verify primary channel failure recorded
    await auditTrailPage.navigate();
    await auditTrailPage.verifyAuditEvent('fraud_alert_failed', {
      channel: 'Push',
      failureReason: 'Provider unavailable',
      timestamp: '2026-08-15T11:30:15Z'
    });

    // Step 4: Verify fallback to SMS
    await fraudAlertPage.navigate();
    await fraudAlertPage.verifyFallbackInitiated('SMS', 'Twilio', '+1-555-0123');

    // Step 5: Verify SMS delivery
    await fraudAlertPage.verifySMSDelivery({
      content: 'Fraud Alert: $750 transaction at Merchant_ABC on card ****9012. Reply YES to confirm or NO to report.',
      deliveryStatus: 'Delivered'
    });
    await expect(fraudAlertPage.alertStatus).toHaveText('Delivered');

    // Step 6: Verify audit trail contains both failure and success
    await auditTrailPage.navigate();
    await auditTrailPage.verifyAuditEvent('fraud_alert_failed', { channel: 'Push' });
    await auditTrailPage.verifyAuditEvent('fraud_alert_sent', { channel: 'SMS' });
    await auditTrailPage.verifyAuditEvent('fraud_alert_delivered', { channel: 'SMS' });
  });

  test('TC-002: Verify email fallback when push token is invalid', async ({ page }) => {
    const fraudAlertPage = new FraudAlertPage(page);
    const auditTrailPage = new AuditTrailPage(page);

    // Step 1: Trigger suspicious transaction without valid push token
    await fraudAlertPage.triggerSuspiciousTransaction({
      amount: 300,
      card: '****3456',
      pushToken: null,
      email: 'customer@example.com'
    });
    await expect(fraudAlertPage.alertCreationIndicator).toBeVisible();

    // Step 2: Verify absence of valid push token detected
    await fraudAlertPage.verifyPushTokenStatus('Invalid or Not Registered', 'No valid push token');

    // Step 3: Verify primary channel failure recorded
    await auditTrailPage.navigate();
    await auditTrailPage.verifyAuditEvent('fraud_alert_failed', {
      channel: 'Push',
      failureReason: 'No valid push token',
      timestamp: '2026-08-15T12:00:00Z'
    });

    // Step 4: Verify email fallback initiated
    await fraudAlertPage.navigate();
    await fraudAlertPage.verifyFallbackInitiated('Email', 'SendGrid', 'customer@example.com');

    // Step 5: Verify email delivery with complete details
    await fraudAlertPage.verifyEmailDelivery({
      subject: 'Fraud Alert: Verify your transaction',
      amount: '$300',
      card: '****3456',
      actionLinks: ['Confirm', 'Report']
    });

    // Step 6: Verify audit trail
    await auditTrailPage.navigate();
    await auditTrailPage.verifyAuditEvent('fraud_alert_failed', {
      channel: 'Push',
      failureReason: 'No valid push token'
    });
    await auditTrailPage.verifyAuditEvent('fraud_alert_sent', { channel: 'Email' });
    await auditTrailPage.verifyAuditEvent('fraud_alert_delivered', { channel: 'Email' });
    await expect(auditTrailPage.deliveryStatus).toHaveText('Delivered');
  });

  test('TC-003: Verify multiple fallback attempts with final email delivery', async ({ page }) => {
    const fraudAlertPage = new FraudAlertPage(page);
    const auditTrailPage = new AuditTrailPage(page);

    // Step 1: Trigger suspicious transaction
    await fraudAlertPage.triggerSuspiciousTransaction({
      amount: 1500,
      card: '****7890',
      pushToken: 'valid',
      sms: '+1-555-9999',
      email: 'backup@example.com'
    });
    await expect(fraudAlertPage.alertCreationIndicator).toBeVisible();

    // Step 2: Simulate push provider failure
    await fraudAlertPage.simulatePushProviderFailure('Connection Timeout');
    await expect(fraudAlertPage.providerError).toContainText('Provider unavailable');

    // Step 3: Verify SMS fallback attempt
    await fraudAlertPage.verifyFallbackInitiated('SMS', null, '+1-555-9999');

    // Step 4: Simulate SMS provider failure
    await fraudAlertPage.simulateSMSProviderFailure('Delivery Failed', 'SMS gateway error');

    // Step 5: Verify email fallback initiated
    await fraudAlertPage.verifyFallbackInitiated('Email', null, 'backup@example.com');

    // Step 6: Verify email delivery and complete audit trail
    await fraudAlertPage.verifyEmailDeliverySuccess();
    await expect(fraudAlertPage.alertStatus).toHaveText('Delivered');
    await auditTrailPage.navigate();
    await auditTrailPage.verifyMultipleFallbackAttempts([
      { channel: 'Push', status: 'Failed', reason: 'Provider unavailable' },
      { channel: 'SMS', status: 'Failed', reason: 'SMS gateway error' },
      { channel: 'Email', status: 'Delivered' }
    ]);
  });
});

test.describe('Fraud Alert Edge Cases - TS003', () => {

  test('TC-001: Verify alert grouping for multiple suspicious transactions', async ({ page }) => {
    const fraudAlertPage = new FraudAlertPage(page);
    const auditTrailPage = new AuditTrailPage(page);

    // Step 1: Trigger first suspicious transaction
    await fraudAlertPage.triggerSuspiciousTransaction({
      amount: 200,
      merchant: 'Store_A',
      card: '****1111',
      timestamp: '2026-08-15T15:00:00Z'
    });
    await expect(fraudAlertPage.alertCreationIndicator).toBeVisible();

    // Step 2: Trigger second suspicious transaction within 2 minutes
    await fraudAlertPage.triggerSuspiciousTransaction({
      amount: 150,
      merchant: 'Store_B',
      card: '****1111',
      timestamp: '2026-08-15T15:01:30Z'
    });
    await expect(fraudAlertPage.alertCreationIndicator).toBeVisible();

    // Step 3: Trigger third suspicious transaction within 5 minutes
    await fraudAlertPage.triggerSuspiciousTransaction({
      amount: 300,
      merchant: 'Store_C',
      card: '****1111',
      timestamp: '2026-08-15T15:04:00Z'
    });
    await expect(fraudAlertPage.alertCreationIndicator).toBeVisible();

    // Step 4: Verify alert grouping policy applied
    await fraudAlertPage.verifyAlertGroupingPolicy({
      timeWindow: 5,
      card: '****1111',
      action: 'Group or Prioritize'
    });

    // Step 5: Verify single grouped notification delivered
    await fraudAlertPage.verifyGroupedNotification({
      transactionCount: 3,
      card: '****1111',
      amounts: [200, 150, 300],
      total: 650,
      message: '3 suspicious transactions detected on card ****1111: $200, $150, $300. Total: $650. Review now.'
    });

    // Step 6: Verify audit trail maintains individual records
    await auditTrailPage.navigate();
    await auditTrailPage.verifyIndividualAlertRecords(3);
    await auditTrailPage.verifyGroupingDecision({
      alertCount: 3,
      deliveryStrategy: 'Grouped',
      notificationCount: 1
    });
  });

  test('TC-002: Verify idempotency controls prevent duplicate alerts', async ({ page }) => {
    const fraudAlertPage = new FraudAlertPage(page);
    const auditTrailPage = new AuditTrailPage(page);

    // Step 1: Trigger suspicious transaction
    await fraudAlertPage.triggerSuspiciousTransaction({
      transactionId: 'TXN-555888',
      amount: 600,
      card: '****2222',
      timestamp: '2026-08-15T16:00:00Z'
    });
    await expect(fraudAlertPage.transactionEventPublished).toBeVisible();

    // Step 2: Verify alert record created
    await fraudAlertPage.verifyAlertCreated('ALERT-99001', 'TXN-555888');
    await expect(fraudAlertPage.alertStatus).toHaveText('Created');

    // Step 3: Simulate duplicate transaction event
    await fraudAlertPage.triggerSuspiciousTransaction({
      transactionId: 'TXN-555888',
      amount: 600,
      card: '****2222',
      timestamp: '2026-08-15T16:00:00Z'
    });

    // Step 4: Verify idempotency check detects duplicate
    await fraudAlertPage.verifyIdempotencyCheck('TXN-555888', 'ALERT-99001');

    // Step 5: Verify no duplicate alert created
    await fraudAlertPage.verifyAlertCount('TXN-555888', 1);

    // Step 6: Verify audit trail logs duplicate detection
    await auditTrailPage.navigate();
    await auditTrailPage.verifyAuditEvent('duplicate_event_detected', {
      transactionId: 'TXN-555888',
      action: 'Ignored',
      reason: 'Alert already exists'
    });
  });

  test('TC-003: Verify alert prioritization for varying risk levels', async ({ page }) => {
    const fraudAlertPage = new FraudAlertPage(page);
    const auditTrailPage = new AuditTrailPage(page);

    // Step 1: Trigger multiple transactions with varying risk
    await fraudAlertPage.triggerSuspiciousTransaction({
      amount: 50,
      riskScore: 65,
      merchant: 'Coffee_Shop',
      card: '****3333'
    });
    await fraudAlertPage.triggerSuspiciousTransaction({
      amount: 2500,
      riskScore: 85,
      merchant: 'Electronics_Foreign',
      card: '****3333'
    });
    await fraudAlertPage.triggerSuspiciousTransaction({
      amount: 100,
      riskScore: 62,
      merchant: 'Gas_Station',
      card: '****3333'
    });

    // Step 2: Verify prioritization policy applied
    await fraudAlertPage.verifyPrioritizationPolicy({
      highPriorityThreshold: { riskScore: 80, amount: 2000 }
    });

    // Step 3: Verify high-priority alert delivered immediately
    await fraudAlertPage.verifyPriorityAlertDelivered({
      amount: 2500,
      merchant: 'Electronics_Foreign',
      priority: 'High'
    });

    // Step 4: Verify lower-risk alerts grouped or delayed
    await fraudAlertPage.verifyLowerPriorityAlertsGrouped([
      { amount: 50, merchant: 'Coffee_Shop' },
      { amount: 100, merchant: 'Gas_Station' }
    ]);

    // Step 5: Verify notification count prevents alert fatigue
    await fraudAlertPage.verifyNotificationCount(2);
    await expect(fraudAlertPage.highPriorityNotification).toBeVisible();
    await expect(fraudAlertPage.groupedNotification).toBeVisible();

    // Step 6: Verify audit trail records prioritization
    await auditTrailPage.navigate();
    await auditTrailPage.verifyPrioritizationDecisions([
      { transactionAmount: 2500, priority: 'High', delivery: 'Immediate' },
      { transactionAmount: 50, priority: 'Low', delivery: 'Grouped' },
      { transactionAmount: 100, priority: 'Low', delivery: 'Grouped' }
    ]);
  });
});

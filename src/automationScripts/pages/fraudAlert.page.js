const { expect } = require('@playwright/test');

exports.FraudAlertPage = class FraudAlertPage {
  constructor(page) {
    this.page = page;
    
    // Alert status and indicators
    this.alertCreationIndicator = page.locator('[data-testid="alert-creation-indicator"]');
    this.alertStatus = page.locator('[data-testid="alert-status"]');
    this.deliveryTimestamp = page.locator('[data-testid="delivery-timestamp"]');
    this.transactionEventPublished = page.locator('[data-testid="transaction-event-published"]');
    
    // Risk evaluation elements
    this.riskScoreDisplay = page.locator('[data-testid="risk-score"]');
    this.riskThresholdDisplay = page.locator('[data-testid="risk-threshold"]');
    this.riskMessage = page.locator('[data-testid="risk-message"]');
    
    // Notification content elements
    this.notificationAmount = page.locator('[data-testid="notification-amount"]');
    this.notificationMerchant = page.locator('[data-testid="notification-merchant"]');
    this.notificationTimestamp = page.locator('[data-testid="notification-timestamp"]');
    this.cardIdentifier = page.locator('[data-testid="card-identifier"]');
    this.transactionLocation = page.locator('[data-testid="transaction-location"]');
    this.safetyGuidance = page.locator('[data-testid="safety-guidance"]');
    
    // Action buttons
    this.confirmButton = page.locator('[data-testid="confirm-button"]');
    this.reportButton = page.locator('[data-testid="report-button"]');
    
    // Channel and provider elements
    this.channelDisplay = page.locator('[data-testid="delivery-channel"]');
    this.providerDisplay = page.locator('[data-testid="notification-provider"]');
    this.providerError = page.locator('[data-testid="provider-error"]');
    this.pushTokenStatus = page.locator('[data-testid="push-token-status"]');
    
    // Delivery verification elements
    this.deliveryStatusDisplay = page.locator('[data-testid="delivery-status"]');
    this.slaTargetDisplay = page.locator('[data-testid="sla-target"]');
    this.actualDeliveryTimeDisplay = page.locator('[data-testid="actual-delivery-time"]');
    
    // SMS and Email elements
    this.smsContent = page.locator('[data-testid="sms-content"]');
    this.smsDeliveryStatus = page.locator('[data-testid="sms-delivery-status"]');
    this.emailSubject = page.locator('[data-testid="email-subject"]');
    this.emailContent = page.locator('[data-testid="email-content"]');
    this.emailActionLinks = page.locator('[data-testid="email-action-link"]');
    
    // Grouping and prioritization elements
    this.groupingPolicyDisplay = page.locator('[data-testid="grouping-policy"]');
    this.groupedNotificationDisplay = page.locator('[data-testid="grouped-notification"]');
    this.highPriorityNotification = page.locator('[data-testid="high-priority-notification"]');
    this.groupedNotification = page.locator('[data-testid="grouped-notification"]');
    this.notificationCountDisplay = page.locator('[data-testid="notification-count"]');
    
    // Idempotency elements
    this.idempotencyCheckResult = page.locator('[data-testid="idempotency-check-result"]');
    this.alertCountDisplay = page.locator('[data-testid="alert-count"]');
  }

  async navigate() {
    await this.page.goto('/fraud-alerts');
    await expect(this.page).toHaveURL(/.*fraud-alerts/);
  }

  async triggerSuspiciousTransaction(transactionData) {
    await this.page.goto('/fraud-alerts/trigger-transaction');
    
    if (transactionData.amount) {
      await this.page.locator('[data-testid="transaction-amount"]').fill(transactionData.amount.toString());
    }
    if (transactionData.merchant) {
      await this.page.locator('[data-testid="transaction-merchant"]').fill(transactionData.merchant);
    }
    if (transactionData.card) {
      await this.page.locator('[data-testid="transaction-card"]').fill(transactionData.card);
    }
    if (transactionData.timestamp) {
      await this.page.locator('[data-testid="transaction-timestamp"]').fill(transactionData.timestamp);
    }
    if (transactionData.pushToken !== undefined) {
      await this.page.locator('[data-testid="push-token"]').fill(transactionData.pushToken || '');
    }
    if (transactionData.sms) {
      await this.page.locator('[data-testid="sms-number"]').fill(transactionData.sms);
    }
    if (transactionData.email) {
      await this.page.locator('[data-testid="email-address"]').fill(transactionData.email);
    }
    if (transactionData.location) {
      await this.page.locator('[data-testid="transaction-location"]').fill(transactionData.location);
    }
    if (transactionData.customerUsualLocation) {
      await this.page.locator('[data-testid="customer-usual-location"]').fill(transactionData.customerUsualLocation);
    }
    if (transactionData.transactionId) {
      await this.page.locator('[data-testid="transaction-id"]').fill(transactionData.transactionId);
    }
    if (transactionData.alertId) {
      await this.page.locator('[data-testid="alert-id"]').fill(transactionData.alertId);
    }
    if (transactionData.customerId) {
      await this.page.locator('[data-testid="customer-id"]').fill(transactionData.customerId);
    }
    if (transactionData.riskScore) {
      await this.page.locator('[data-testid="risk-score-input"]').fill(transactionData.riskScore.toString());
    }
    
    await this.page.locator('[data-testid="trigger-transaction-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyRiskEvaluation(riskData) {
    await expect(this.riskScoreDisplay).toHaveText(riskData.riskScore.toString());
    await expect(this.riskThresholdDisplay).toHaveText(riskData.threshold.toString());
    
    const riskScore = parseInt(await this.riskScoreDisplay.textContent());
    const threshold = parseInt(await this.riskThresholdDisplay.textContent());
    expect(riskScore).toBeGreaterThan(threshold);
  }

  async verifyAlertQueued(channel, provider, token) {
    await expect(this.channelDisplay).toHaveText(channel);
    await expect(this.providerDisplay).toHaveText(provider);
    
    if (token) {
      const tokenDisplay = this.page.locator('[data-testid="push-token-display"]');
      await expect(tokenDisplay).toHaveText(token);
    }
  }

  async verifyPushDelivery(deliveryData) {
    await expect(this.slaTargetDisplay).toHaveText(deliveryData.slaTarget.toString());
    await expect(this.actualDeliveryTimeDisplay).toHaveText(deliveryData.actualDeliveryTime.toString());
    
    const actualTime = parseInt(await this.actualDeliveryTimeDisplay.textContent());
    const slaTarget = parseInt(await this.slaTargetDisplay.textContent());
    expect(actualTime).toBeLessThanOrEqual(slaTarget);
  }

  async verifyNotificationContent(contentData) {
    await expect(this.notificationAmount).toHaveText(contentData.amount);
    await expect(this.notificationMerchant).toHaveText(contentData.merchant);
    await expect(this.notificationTimestamp).toHaveText(contentData.timestamp);
    await expect(this.cardIdentifier).toHaveText(contentData.maskedCard);
    
    for (const buttonText of contentData.actionButtons) {
      const button = this.page.locator(`button:has-text("${buttonText}")`);
      await expect(button).toBeVisible();
    }
  }

  async waitForStatusTransition(expectedStatus) {
    await this.page.waitForFunction(
      (status) => {
        const element = document.querySelector('[data-testid="alert-status"]');
        return element && element.textContent === status;
      },
      expectedStatus,
      { timeout: 30000 }
    );
  }

  async verifyNotificationSent(notificationData) {
    const notificationIdDisplay = this.page.locator('[data-testid="notification-id"]');
    await expect(notificationIdDisplay).toHaveText(notificationData.notificationId);
    await expect(this.channelDisplay).toHaveText(notificationData.channel);
    
    const sentAtDisplay = this.page.locator('[data-testid="sent-at-timestamp"]');
    await expect(sentAtDisplay).toHaveText(notificationData.sentAt);
  }

  async simulatePushProviderFailure(errorMessage) {
    await this.page.locator('[data-testid="simulate-push-failure"]').click();
    await this.page.locator('[data-testid="error-message-input"]').fill(errorMessage);
    await this.page.locator('[data-testid="confirm-simulation"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyFallbackInitiated(channel, provider, recipient) {
    const fallbackChannelDisplay = this.page.locator('[data-testid="fallback-channel"]');
    await expect(fallbackChannelDisplay).toHaveText(channel);
    
    if (provider) {
      const fallbackProviderDisplay = this.page.locator('[data-testid="fallback-provider"]');
      await expect(fallbackProviderDisplay).toHaveText(provider);
    }
    
    const recipientDisplay = this.page.locator('[data-testid="fallback-recipient"]');
    await expect(recipientDisplay).toHaveText(recipient);
  }

  async verifySMSDelivery(smsData) {
    await expect(this.smsContent).toHaveText(smsData.content);
    await expect(this.smsDeliveryStatus).toHaveText(smsData.deliveryStatus);
  }

  async verifyPushTokenStatus(status, reason) {
    await expect(this.pushTokenStatus).toHaveText(status);
    
    const reasonDisplay = this.page.locator('[data-testid="push-token-reason"]');
    await expect(reasonDisplay).toHaveText(reason);
  }

  async verifyEmailDelivery(emailData) {
    await expect(this.emailSubject).toHaveText(emailData.subject);
    
    const emailAmountDisplay = this.page.locator('[data-testid="email-amount"]');
    await expect(emailAmountDisplay).toHaveText(emailData.amount);
    
    const emailCardDisplay = this.page.locator('[data-testid="email-card"]');
    await expect(emailCardDisplay).toHaveText(emailData.card);
    
    for (const linkText of emailData.actionLinks) {
      const link = this.page.locator(`[data-testid="email-action-link"]:has-text("${linkText}")`);
      await expect(link).toBeVisible();
    }
  }

  async simulateSMSProviderFailure(status, reason) {
    await this.page.locator('[data-testid="simulate-sms-failure"]').click();
    await this.page.locator('[data-testid="sms-failure-status"]').fill(status);
    await this.page.locator('[data-testid="sms-failure-reason"]').fill(reason);
    await this.page.locator('[data-testid="confirm-sms-simulation"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyEmailDeliverySuccess() {
    const emailDeliveryStatus = this.page.locator('[data-testid="email-delivery-status"]');
    await expect(emailDeliveryStatus).toHaveText('Delivered');
  }

  async verifyAlertGroupingPolicy(policyData) {
    const timeWindowDisplay = this.page.locator('[data-testid="grouping-time-window"]');
    await expect(timeWindowDisplay).toHaveText(policyData.timeWindow.toString());
    
    const cardDisplay = this.page.locator('[data-testid="grouping-card"]');
    await expect(cardDisplay).toHaveText(policyData.card);
    
    const actionDisplay = this.page.locator('[data-testid="grouping-action"]');
    await expect(actionDisplay).toContainText(policyData.action);
  }

  async verifyGroupedNotification(groupData) {
    const transactionCountDisplay = this.page.locator('[data-testid="grouped-transaction-count"]');
    await expect(transactionCountDisplay).toHaveText(groupData.transactionCount.toString());
    
    const cardDisplay = this.page.locator('[data-testid="grouped-card"]');
    await expect(cardDisplay).toHaveText(groupData.card);
    
    const totalDisplay = this.page.locator('[data-testid="grouped-total"]');
    await expect(totalDisplay).toHaveText(groupData.total.toString());
    
    await expect(this.groupedNotificationDisplay).toContainText(groupData.message);
  }

  async verifyAlertCreated(alertId, transactionId) {
    const alertIdDisplay = this.page.locator('[data-testid="alert-id-display"]');
    await expect(alertIdDisplay).toHaveText(alertId);
    
    const transactionIdDisplay = this.page.locator('[data-testid="transaction-id-display"]');
    await expect(transactionIdDisplay).toHaveText(transactionId);
  }

  async verifyIdempotencyCheck(transactionId, existingAlertId) {
    await expect(this.idempotencyCheckResult).toBeVisible();
    
    const transactionIdDisplay = this.page.locator('[data-testid="idempotency-transaction-id"]');
    await expect(transactionIdDisplay).toHaveText(transactionId);
    
    const existingAlertDisplay = this.page.locator('[data-testid="existing-alert-id"]');
    await expect(existingAlertDisplay).toHaveText(existingAlertId);
  }

  async verifyAlertCount(transactionId, expectedCount) {
    const transactionIdInput = this.page.locator('[data-testid="alert-count-transaction-id"]');
    await transactionIdInput.fill(transactionId);
    
    const checkButton = this.page.locator('[data-testid="check-alert-count"]');
    await checkButton.click();
    
    await expect(this.alertCountDisplay).toHaveText(expectedCount.toString());
  }

  async verifyPrioritizationPolicy(policyData) {
    const prioritizationPolicyDisplay = this.page.locator('[data-testid="prioritization-policy"]');
    await expect(prioritizationPolicyDisplay).toBeVisible();
    
    const riskThresholdDisplay = this.page.locator('[data-testid="priority-risk-threshold"]');
    await expect(riskThresholdDisplay).toHaveText(policyData.highPriorityThreshold.riskScore.toString());
    
    const amountThresholdDisplay = this.page.locator('[data-testid="priority-amount-threshold"]');
    await expect(amountThresholdDisplay).toHaveText(policyData.highPriorityThreshold.amount.toString());
  }

  async verifyPriorityAlertDelivered(alertData) {
    await expect(this.highPriorityNotification).toBeVisible();
    
    const priorityAmountDisplay = this.page.locator('[data-testid="priority-alert-amount"]');
    await expect(priorityAmountDisplay).toHaveText(alertData.amount.toString());
    
    const priorityMerchantDisplay = this.page.locator('[data-testid="priority-alert-merchant"]');
    await expect(priorityMerchantDisplay).toHaveText(alertData.merchant);
    
    const priorityLevelDisplay = this.page.locator('[data-testid="priority-level"]');
    await expect(priorityLevelDisplay).toHaveText(alertData.priority);
  }

  async verifyLowerPriorityAlertsGrouped(alerts) {
    const groupedAlertsDisplay = this.page.locator('[data-testid="grouped-lower-priority-alerts"]');
    await expect(groupedAlertsDisplay).toBeVisible();
    
    for (const alert of alerts) {
      const alertItem = this.page.locator(`[data-testid="grouped-alert-item"]:has-text("${alert.amount}")`);
      await expect(alertItem).toBeVisible();
      await expect(alertItem).toContainText(alert.merchant);
    }
  }

  async verifyNotificationCount(expectedCount) {
    const notifications = this.page.locator('[data-testid="notification-item"]');
    await expect(notifications).toHaveCount(expectedCount);
  }

  async verifyDeliverySLA(slaData) {
    await expect(this.slaTargetDisplay).toHaveText(slaData.slaTarget.toString());
    await expect(this.actualDeliveryTimeDisplay).toHaveText(slaData.actualDeliveryTime.toString());
    
    const actualTime = parseInt(await this.actualDeliveryTimeDisplay.textContent());
    const slaTarget = parseInt(await this.slaTargetDisplay.textContent());
    expect(actualTime).toBeLessThanOrEqual(slaTarget);
  }
};

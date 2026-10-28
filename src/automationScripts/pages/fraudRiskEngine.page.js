const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.FraudRiskEnginePage = class FraudRiskEnginePage {
  constructor(page) {
    this.page = page;
    
    // System status locators
    this.systemStatusIndicator = page.locator('[data-testid="risk-engine-status"]');
    this.transactionSystemStatusIndicator = page.locator('[data-testid="transaction-system-status"]');
    
    // Transaction event locators
    this.receiveTransactionButton = page.locator('[data-testid="receive-transaction-btn"]');
    this.transactionIdInput = page.locator('[data-testid="transaction-id-input"]');
    this.transactionAmountInput = page.locator('[data-testid="transaction-amount-input"]');
    this.transactionMerchantInput = page.locator('[data-testid="transaction-merchant-input"]');
    this.transactionTimestampInput = page.locator('[data-testid="transaction-timestamp-input"]');
    this.transactionCardIdInput = page.locator('[data-testid="transaction-card-id-input"]');
    this.submitTransactionButton = page.locator('[data-testid="submit-transaction-btn"]');
    this.transactionReceivedMessage = page.locator('[data-testid="transaction-received-message"]');
    this.transactionValidatedIndicator = page.locator('[data-testid="transaction-validated-indicator"]');
    
    // Risk evaluation locators
    this.triggerRiskEvaluationButton = page.locator('[data-testid="trigger-risk-evaluation-btn"]');
    this.riskModelVersionInput = page.locator('[data-testid="risk-model-version-input"]');
    this.evaluationMethodInput = page.locator('[data-testid="evaluation-method-input"]');
    this.evaluateButton = page.locator('[data-testid="evaluate-btn"]');
    this.riskEvaluationProcessedMessage = page.locator('[data-testid="risk-evaluation-processed-message"]');
    this.riskScoreField = page.locator('[data-testid="risk-score"]');
    this.riskBandField = page.locator('[data-testid="risk-band"]');
    this.riskDecisionIdField = page.locator('[data-testid="risk-decision-id"]');
    this.riskTimestampField = page.locator('[data-testid="risk-timestamp"]');
    
    // SLA and performance locators
    this.processingTimeField = page.locator('[data-testid="processing-time"]');
    this.slaComplianceIndicator = page.locator('[data-testid="sla-compliance-indicator"]');
    this.slaThresholdField = page.locator('[data-testid="sla-threshold"]');
    
    // Batch processing locators
    this.batchTransactionButton = page.locator('[data-testid="batch-transaction-btn"]');
    this.batchCountInput = page.locator('[data-testid="batch-count-input"]');
    this.batchStartIdInput = page.locator('[data-testid="batch-start-id-input"]');
    this.batchEndIdInput = page.locator('[data-testid="batch-end-id-input"]');
    this.batchTimeWindowInput = page.locator('[data-testid="batch-time-window-input"]');
    this.submitBatchButton = page.locator('[data-testid="submit-batch-btn"]');
    this.batchQueuedMessage = page.locator('[data-testid="batch-queued-message"]');
    this.batchProcessedCountField = page.locator('[data-testid="batch-processed-count"]');
    this.batchSuccessRateField = page.locator('[data-testid="batch-success-rate"]');
    this.concurrentProcessingToggle = page.locator('[data-testid="concurrent-processing-toggle"]');
    
    // Risk engine unavailability simulation locators
    this.simulateEngineUnavailabilityButton = page.locator('[data-testid="simulate-engine-unavailability-btn"]');
    this.engineStatusInput = page.locator('[data-testid="engine-status-input"]');
    this.timeoutPeriodInput = page.locator('[data-testid="timeout-period-input"]');
    this.applyUnavailabilityButton = page.locator('[data-testid="apply-unavailability-btn"]');
    this.engineTimeoutIndicator = page.locator('[data-testid="engine-timeout-indicator"]');
    
    // Fail-safe policy locators
    this.failSafePolicyField = page.locator('[data-testid="fail-safe-policy"]');
    this.transactionTypeField = page.locator('[data-testid="transaction-type"]');
    this.policyAppliedIndicator = page.locator('[data-testid="policy-applied-indicator"]');
    this.engineStatusField = page.locator('[data-testid="engine-status-field"]');
    
    // Audit trail locators
    this.auditTrailButton = page.locator('[data-testid="audit-trail-btn"]');
    this.auditSearchInput = page.locator('[data-testid="audit-search-input"]');
    this.auditSearchButton = page.locator('[data-testid="audit-search-btn"]');
    this.auditTrailContainer = page.locator('[data-testid="audit-trail-container"]');
    this.auditEventType = page.locator('[data-testid="audit-event-type"]');
    this.auditFailureReason = page.locator('[data-testid="audit-failure-reason"]');
    this.auditPoliciesApplied = page.locator('[data-testid="audit-policies-applied"]');
    
    // Idempotency locators
    this.sendDuplicateButton = page.locator('[data-testid="send-duplicate-btn"]');
    this.duplicateCountInput = page.locator('[data-testid="duplicate-count-input"]');
    this.sendDuplicatesButton = page.locator('[data-testid="send-duplicates-btn"]');
    this.uniqueDecisionCountField = page.locator('[data-testid="unique-decision-count"]');
    this.decisionCountField = page.locator('[data-testid="decision-count"]');
    this.alertCountField = page.locator('[data-testid="alert-count"]');
    this.caseCountField = page.locator('[data-testid="case-count"]');
    this.idempotencyKeyField = page.locator('[data-testid="idempotency-key"]');
    this.concurrencyControlIndicator = page.locator('[data-testid="concurrency-control-indicator"]');
    this.duplicateDetectionCountField = page.locator('[data-testid="duplicate-detection-count"]');
  }

  async navigate() {
    await this.page.goto('https://fraud-risk-engine.example.com');
    await expect(this.page).toHaveURL(/fraud-risk-engine/);
    logger.info('Navigated to Fraud Risk Engine');
  }

  async navigateToTransactionSystem() {
    await this.page.goto('https://transaction-system.example.com');
    await expect(this.page).toHaveURL(/transaction-system/);
    logger.info('Navigated to Transaction Processing System');
  }

  async verifySystemAccessible() {
    await expect(this.systemStatusIndicator).toBeVisible();
    await expect(this.systemStatusIndicator).toHaveText(/ready|accessible/i);
    logger.info('Fraud Risk Engine system accessibility verified');
  }

  async verifyTransactionSystemAccessible() {
    await expect(this.transactionSystemStatusIndicator).toBeVisible();
    await expect(this.transactionSystemStatusIndicator).toHaveText(/ready|accessible/i);
    logger.info('Transaction system accessibility verified');
  }

  async receiveTransactionEvent(transactionData) {
    await expect(this.receiveTransactionButton).toBeVisible();
    await this.receiveTransactionButton.click();
    
    await this.transactionIdInput.fill(transactionData.transaction_id);
    await this.transactionAmountInput.fill(transactionData.amount);
    await this.transactionMerchantInput.fill(transactionData.merchant);
    
    if (transactionData.timestamp) {
      await this.transactionTimestampInput.fill(transactionData.timestamp);
    }
    
    if (transactionData.card_id) {
      await this.transactionCardIdInput.fill(transactionData.card_id);
    }
    
    if (transactionData.customer_history) {
      await this.page.locator('[data-testid="customer-history-input"]').fill(transactionData.customer_history);
    }
    
    if (transactionData.location) {
      await this.page.locator('[data-testid="location-input"]').fill(transactionData.location);
    }
    
    if (transactionData.velocity) {
      await this.page.locator('[data-testid="velocity-input"]').fill(transactionData.velocity);
    }
    
    if (transactionData.transaction_type) {
      await this.page.locator('[data-testid="transaction-type-input"]').fill(transactionData.transaction_type);
    }
    
    await this.submitTransactionButton.click();
    await expect(this.transactionReceivedMessage).toBeVisible();
    logger.info('Transaction event received: ' + transactionData.transaction_id);
  }

  async verifyTransactionReceived(transactionId) {
    await expect(this.transactionReceivedMessage).toBeVisible();
    await expect(this.transactionValidatedIndicator).toBeVisible();
    const receivedId = await this.page.locator('[data-testid="received-transaction-id"]').textContent();
    expect(receivedId).toBe(transactionId);
    logger.info('Transaction receipt verified: ' + transactionId);
  }

  async triggerRiskEvaluation(transactionId, riskModelConfig) {
    await expect(this.triggerRiskEvaluationButton).toBeVisible();
    await this.triggerRiskEvaluationButton.click();
    
    await this.page.locator('[data-testid="eval-transaction-id-input"]').fill(transactionId);
    await this.riskModelVersionInput.fill(riskModelConfig.risk_model_version);
    
    if (riskModelConfig.evaluation_method) {
      await this.evaluationMethodInput.fill(riskModelConfig.evaluation_method);
    }
    
    await this.evaluateButton.click();
    logger.info('Risk evaluation triggered for transaction: ' + transactionId);
  }

  async verifyRiskEvaluationProcessed() {
    await expect(this.riskEvaluationProcessedMessage).toBeVisible();
    logger.info('Risk evaluation processed successfully');
  }

  async verifyRiskScoreAssigned(transactionId) {
    await this.page.locator('[data-testid="view-risk-result-btn"]').click();
    await this.page.locator('[data-testid="result-transaction-id-input"]').fill(transactionId);
    await this.page.locator('[data-testid="load-result-btn"]').click();
    
    await expect(this.riskScoreField).toBeVisible();
    const riskScore = await this.riskScoreField.textContent();
    expect(parseFloat(riskScore)).toBeGreaterThanOrEqual(0);
    expect(parseFloat(riskScore)).toBeLessThanOrEqual(100);
    logger.info('Risk score assigned: ' + riskScore);
  }

  async verifyRiskBandAssigned(transactionId, validBands) {
    const riskBand = await this.riskBandField.textContent();
    expect(validBands).toContain(riskBand);
    logger.info('Risk band assigned: ' + riskBand);
  }

  async verifyRiskScoreRecorded(transactionId, requiredFields) {
    for (const field of requiredFields) {
      const fieldLocator = this.page.locator(`[data-testid="${field}"]`);
      await expect(fieldLocator).toBeVisible();
    }
    logger.info('Risk score recorded with required fields: ' + requiredFields.join(', '));
  }

  async verifySLACompliance(transactionId, slaThreshold) {
    const processingTime = parseFloat(await this.processingTimeField.textContent());
    expect(processingTime).toBeLessThan(slaThreshold);
    await expect(this.slaComplianceIndicator).toHaveText(/compliant|within SLA/i);
    logger.info('SLA compliance verified: ' + processingTime + 'ms < ' + slaThreshold + 'ms');
  }

  async receiveMultipleTransactionEvents(transactionBatch) {
    await this.batchTransactionButton.click();
    await this.batchCountInput.fill(transactionBatch.transaction_count.toString());
    await this.batchStartIdInput.fill(transactionBatch.transaction_id_range.start);
    await this.batchEndIdInput.fill(transactionBatch.transaction_id_range.end);
    await this.batchTimeWindowInput.fill(transactionBatch.time_window.toString());
    await this.submitBatchButton.click();
    logger.info('Batch of ' + transactionBatch.transaction_count + ' transactions submitted');
  }

  async verifyTransactionBatchQueued(expectedCount) {
    await expect(this.batchQueuedMessage).toBeVisible();
    const queuedCount = await this.page.locator('[data-testid="queued-count"]').textContent();
    expect(parseInt(queuedCount)).toBe(expectedCount);
    logger.info('Transaction batch queued: ' + expectedCount + ' transactions');
  }

  async triggerBatchRiskEvaluation(riskModelConfig) {
    await this.page.locator('[data-testid="batch-evaluate-btn"]').click();
    await this.riskModelVersionInput.fill(riskModelConfig.risk_model_version);
    
    if (riskModelConfig.concurrent_processing === 'enabled') {
      await this.concurrentProcessingToggle.check();
    }
    
    await this.page.locator('[data-testid="start-batch-evaluation-btn"]').click();
    logger.info('Batch risk evaluation triggered with concurrent processing');
  }

  async verifyBatchProcessingComplete(expectedCount, successCount) {
    await expect(this.page.locator('[data-testid="batch-complete-message"]')).toBeVisible();
    const processedCount = parseInt(await this.batchProcessedCountField.textContent());
    expect(processedCount).toBe(expectedCount);
    
    const successRate = parseFloat(await this.batchSuccessRateField.textContent());
    expect(successRate).toBe(100);
    logger.info('Batch processing complete: ' + processedCount + ' transactions, ' + successRate + '% success');
  }

  async verifyAllTransactionsHaveRiskScores(expectedCount) {
    const scoredCount = await this.page.locator('[data-testid="scored-transactions-count"]').textContent();
    expect(parseInt(scoredCount)).toBe(expectedCount);
    logger.info('All transactions have risk scores: ' + scoredCount);
  }

  async verifyBatchSLACompliance(slaThreshold) {
    const batchSLAIndicator = this.page.locator('[data-testid="batch-sla-indicator"]');
    await expect(batchSLAIndicator).toHaveText(/all.*compliant|within SLA/i);
    logger.info('Batch SLA compliance verified for threshold: ' + slaThreshold + 'ms');
  }

  async verifyRiskScoreInRange(transactionId, minScore, maxScore) {
    await this.page.locator('[data-testid="view-risk-result-btn"]').click();
    await this.page.locator('[data-testid="result-transaction-id-input"]').fill(transactionId);
    await this.page.locator('[data-testid="load-result-btn"]').click();
    
    const riskScore = parseFloat(await this.riskScoreField.textContent());
    expect(riskScore).toBeGreaterThanOrEqual(minScore);
    expect(riskScore).toBeLessThanOrEqual(maxScore);
    logger.info('Risk score in range [' + minScore + '-' + maxScore + ']: ' + riskScore);
  }

  async simulateRiskEngineUnavailability(engineStatus) {
    await this.simulateEngineUnavailabilityButton.click();
    await this.engineStatusInput.fill(engineStatus.risk_engine_status);
    await this.timeoutPeriodInput.fill(engineStatus.timeout_period.toString());
    await this.applyUnavailabilityButton.click();
    logger.info('Risk engine unavailability simulated: ' + engineStatus.risk_engine_status);
  }

  async verifyRiskEngineTimeout(timeoutPeriod) {
    await expect(this.engineTimeoutIndicator).toBeVisible();
    await expect(this.engineTimeoutIndicator).toContainText(timeoutPeriod.toString());
    logger.info('Risk engine timeout verified: ' + timeoutPeriod + 'ms');
  }

  async verifyFailSafePolicyApplied(transactionId, failSafePolicy) {
    await this.page.locator('[data-testid="view-policy-btn"]').click();
    await this.page.locator('[data-testid="policy-transaction-id-input"]').fill(transactionId);
    await this.page.locator('[data-testid="load-policy-btn"]').click();
    
    await expect(this.transactionTypeField).toHaveText(failSafePolicy.transaction_type);
    await expect(this.failSafePolicyField).toHaveText(failSafePolicy.fail_safe_policy);
    await expect(this.policyAppliedIndicator).toBeVisible();
    logger.info('Fail-safe policy applied: ' + failSafePolicy.fail_safe_policy);
  }

  async verifyAuditTrail(transactionId, expectedEventType) {
    await this.auditTrailButton.click();
    await this.auditSearchInput.fill(transactionId);
    await this.auditSearchButton.click();
    
    await expect(this.auditTrailContainer).toBeVisible();
    const eventTypes = await this.auditEventType.allTextContents();
    expect(eventTypes).toContain(expectedEventType);
    logger.info('Audit trail verified for event: ' + expectedEventType);
  }

  async verifyAuditTrailFailureReason(expectedReason) {
    await expect(this.auditFailureReason).toBeVisible();
    await expect(this.auditFailureReason).toContainText(expectedReason);
    logger.info('Audit trail failure reason verified: ' + expectedReason);
  }

  async verifyRiskScoreNull(transactionId) {
    await this.page.locator('[data-testid="view-risk-result-btn"]').click();
    await this.page.locator('[data-testid="result-transaction-id-input"]').fill(transactionId);
    await this.page.locator('[data-testid="load-result-btn"]').click();
    
    const riskScoreText = await this.riskScoreField.textContent();
    expect(riskScoreText).toMatch(/null|unavailable|N\/A/i);
    logger.info('Risk score verified as null/unavailable');
  }

  async verifyRiskBandNull(transactionId) {
    const riskBandText = await this.riskBandField.textContent();
    expect(riskBandText).toMatch(/null|unavailable|N\/A/i);
    logger.info('Risk band verified as null/unavailable');
  }

  async verifyEngineStatusUnavailable(transactionId) {
    await expect(this.engineStatusField).toBeVisible();
    await expect(this.engineStatusField).toHaveText(/unavailable/i);
    logger.info('Engine status verified as unavailable');
  }

  async verifyMultiplePoliciesInAudit(expectedPolicies) {
    const policiesText = await this.auditPoliciesApplied.allTextContents();
    for (const policy of expectedPolicies) {
      expect(policiesText.join(' ')).toContain(policy);
    }
    logger.info('Multiple policies verified in audit: ' + expectedPolicies.join(', '));
  }

  async getRiskDecisionId(transactionId) {
    await this.page.locator('[data-testid="view-risk-result-btn"]').click();
    await this.page.locator('[data-testid="result-transaction-id-input"]').fill(transactionId);
    await this.page.locator('[data-testid="load-result-btn"]').click();
    
    const decisionId = await this.riskDecisionIdField.textContent();
    logger.info('Risk decision ID retrieved: ' + decisionId);
    return decisionId;
  }

  async sendDuplicateTransactionEvents(transactionId, duplicateCount) {
    await this.sendDuplicateButton.click();
    await this.page.locator('[data-testid="duplicate-transaction-id-input"]').fill(transactionId);
    await this.duplicateCountInput.fill(duplicateCount.toString());
    await this.sendDuplicatesButton.click();
    logger.info('Sent ' + duplicateCount + ' duplicate events for transaction: ' + transactionId);
  }

  async verifyUniqueDecisionCount(transactionId, expectedCount) {
    await this.page.locator('[data-testid="check-decisions-btn"]').click();
    await this.page.locator('[data-testid="decision-transaction-id-input"]').fill(transactionId);
    await this.page.locator('[data-testid="load-decisions-btn"]').click();
    
    const uniqueCount = parseInt(await this.uniqueDecisionCountField.textContent());
    expect(uniqueCount).toBe(expectedCount);
    logger.info('Unique decision count verified: ' + uniqueCount);
  }

  async verifyDecisionIdUnchanged(transactionId, originalDecisionId) {
    const currentDecisionId = await this.getRiskDecisionId(transactionId);
    expect(currentDecisionId).toBe(originalDecisionId);
    logger.info('Decision ID unchanged: ' + currentDecisionId);
  }

  async verifyRiskDecisionCount(transactionId, expectedCount) {
    await this.page.locator('[data-testid="check-decisions-btn"]').click();
    await this.page.locator('[data-testid="decision-transaction-id-input"]').fill(transactionId);
    await this.page.locator('[data-testid="load-decisions-btn"]').click();
    
    const decisionCount = parseInt(await this.decisionCountField.textContent());
    expect(decisionCount).toBe(expectedCount);
    logger.info('Risk decision count verified: ' + decisionCount);
  }

  async verifyNoDuplicateAlerts(transactionId) {
    await this.page.locator('[data-testid="check-alerts-btn"]').click();
    await this.page.locator('[data-testid="alert-transaction-id-input"]').fill(transactionId);
    await this.page.locator('[data-testid="load-alerts-btn"]').click();
    
    const alertCount = parseInt(await this.alertCountField.textContent());
    expect(alertCount).toBeLessThanOrEqual(1);
    logger.info('No duplicate alerts verified, count: ' + alertCount);
  }

  async sendConcurrentDuplicateEvents(concurrentDuplicates) {
    await this.page.locator('[data-testid="concurrent-duplicate-btn"]').click();
    await this.page.locator('[data-testid="concurrent-transaction-id-input"]').fill(concurrentDuplicates.transaction_id);
    await this.page.locator('[data-testid="concurrent-amount-input"]').fill(concurrentDuplicates.amount);
    await this.page.locator('[data-testid="concurrent-merchant-input"]').fill(concurrentDuplicates.merchant);
    await this.duplicateCountInput.fill(concurrentDuplicates.duplicate_count.toString());
    await this.page.locator('[data-testid="concurrent-time-window-input"]').fill(concurrentDuplicates.time_window.toString());
    await this.page.locator('[data-testid="send-concurrent-btn"]').click();
    logger.info('Sent ' + concurrentDuplicates.duplicate_count + ' concurrent duplicates within ' + concurrentDuplicates.time_window + 'ms');
  }

  async verifyIdempotencyControlEnabled(transactionId) {
    await this.page.locator('[data-testid="check-idempotency-btn"]').click();
    await this.page.locator('[data-testid="idempotency-transaction-id-input"]').fill(transactionId);
    await this.page.locator('[data-testid="load-idempotency-btn"]').click();
    
    await expect(this.idempotencyKeyField).toBeVisible();
    await expect(this.idempotencyKeyField).toHaveText(transactionId);
    logger.info('Idempotency control enabled for transaction: ' + transactionId);
  }

  async verifyConcurrencyLockingMechanism(transactionId) {
    await expect(this.concurrencyControlIndicator).toBeVisible();
    await expect(this.concurrencyControlIndicator).toHaveText(/enabled|active/i);
    logger.info('Concurrency locking mechanism verified');
  }

  async verifyAuditTrailDuplicateDetection(transactionId, expectedDuplicateCount) {
    await this.auditTrailButton.click();
    await this.auditSearchInput.fill(transactionId);
    await this.auditSearchButton.click();
    
    const duplicateCount = parseInt(await this.duplicateDetectionCountField.textContent());
    expect(duplicateCount).toBe(expectedDuplicateCount);
    logger.info('Duplicate detection events logged: ' + duplicateCount);
  }

  async verifyAuditTrailSingleEvaluation(transactionId) {
    const evaluationEvents = await this.page.locator('[data-testid="audit-event-type"]:has-text("risk_evaluation_completed")').count();
    expect(evaluationEvents).toBe(1);
    logger.info('Single risk evaluation event verified in audit trail');
  }

  async verifyNoDuplicateCases(transactionId) {
    await this.page.locator('[data-testid="check-cases-btn"]').click();
    await this.page.locator('[data-testid="case-transaction-id-input"]').fill(transactionId);
    await this.page.locator('[data-testid="load-cases-btn"]').click();
    
    const caseCount = parseInt(await this.caseCountField.textContent());
    expect(caseCount).toBeLessThanOrEqual(1);
    logger.info('No duplicate cases verified, count: ' + caseCount);
  }
};

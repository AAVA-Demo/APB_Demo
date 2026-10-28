(function() {
  'use strict';
  angular.module('fraudAlertApp').service('fraudDetectionService', ['$q', 'riskEngineFactory', 'policyDecisionService', 'alertService', 'idempotencyService', function($q, riskEngineFactory, policyDecisionService, alertService, idempotencyService) {
    this.processTransaction = (transactionEvent) => {
      return idempotencyService.checkDuplicate(transactionEvent.transaction_id)
        .then(isDuplicate => {
          if (isDuplicate) {
            console.log('Duplicate transaction detected, skipping:', transactionEvent.transaction_id);
            return $q.resolve({ status: 'duplicate', message: 'Transaction already processed' });
          }
          return riskEngineFactory.getRiskScore(transactionEvent)
            .then(riskAssessment => {
              const policyDecision = policyDecisionService.evaluatePolicy(riskAssessment.risk_score, riskAssessment.risk_band);
              if (policyDecision.requires_alert) {
                return alertService.createAlert(transactionEvent, riskAssessment)
                  .then(alert => {
                    return idempotencyService.markProcessed(transactionEvent.transaction_id)
                      .then(() => ({
                        status: 'alert_created',
                        alert: alert,
                        decision: policyDecision
                      }));
                  });
              } else {
                return idempotencyService.markProcessed(transactionEvent.transaction_id)
                  .then(() => ({
                    status: 'approved',
                    decision: policyDecision
                  }));
              }
            });
        })
        .catch(error => {
          console.error('Transaction processing failed:', error);
          toastr.error('Failed to process transaction', 'Error');
          return $q.reject(error);
        });
    };
  }]);
})();
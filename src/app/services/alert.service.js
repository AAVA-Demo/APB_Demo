(function() {
  'use strict';
  angular.module('fraudAlertApp').service('alertService', ['$http', '$q', 'alertStateService', 'auditService', 'analyticsService', 'configService', function($http, $q, alertStateService, auditService, analyticsService, configService) {
    this.createAlert = (transactionData, riskData) => {
      const expiryHours = configService.get('alertExpiryHours');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiryHours);
      const alertData = {
        transaction_id: transactionData.transaction_id,
        customer_id: transactionData.account_id,
        severity: this._mapRiskBandToSeverity(riskData.risk_band),
        status: 'created',
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        risk_score: riskData.risk_score,
        risk_band: riskData.risk_band,
        decision: 'alert',
        transaction_details: {
          merchant: transactionData.merchant,
          amount: transactionData.amount,
          currency: transactionData.currency,
          timestamp: transactionData.timestamp,
          channel: transactionData.channel,
          card_id: transactionData.card_id
        }
      };
      return alertStateService.persistAlert(alertData)
        .then(alertId => {
          alertData.alert_id = alertId;
          return alertStateService.updateStatus(alertId, 'queued');
        })
        .then(() => {
          return auditService.logAlertCreated(alertData.alert_id, alertData.transaction_id, alertData.risk_score);
        })
        .then(() => {
          return analyticsService.emitFraudAlertCreated(alertData.alert_id, alertData.transaction_id, alertData.risk_score, alertData.risk_band);
        })
        .then(() => alertData)
        .catch(error => {
          console.error('Alert creation failed:', error);
          return $q.reject(error);
        });
    };
    this._mapRiskBandToSeverity = (riskBand) => {
      const mapping = {
        low: 'low',
        medium: 'medium',
        high: 'high',
        critical: 'critical'
      };
      return mapping[riskBand] || 'medium';
    };
    this.getAlert = (alertId) => {
      return alertStateService.getAlert(alertId);
    };
    this.getActiveAlerts = () => {
      return alertStateService.getAlertsByStatus('queued')
        .then(queuedAlerts => {
          return alertStateService.getAlertsByStatus('delivered')
            .then(deliveredAlerts => {
              return [...queuedAlerts, ...deliveredAlerts];
            });
        });
    };
  }]);
})();
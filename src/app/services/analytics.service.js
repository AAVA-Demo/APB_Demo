(function() {
  'use strict';
  angular.module('fraudAlertApp').service('analyticsService', ['$http', '$q', 'configService', function($http, $q, configService) {
    const baseUrl = configService.get('apiBaseUrl');
    this.emitEvent = (eventName, eventData) => {
      const analyticsEvent = {
        event_name: eventName,
        event_data: eventData,
        timestamp: new Date().toISOString(),
        session_id: localStorage.getItem('session_id') || 'unknown'
      };
      return $http.post(`${baseUrl}/analytics/events`, analyticsEvent)
        .then(response => response.data)
        .catch(error => {
          console.error('Analytics event emission failed:', error);
          return $q.resolve();
        });
    };
    this.emitFraudAlertCreated = (alertId, transactionId, riskScore, riskBand) => {
      return this.emitEvent('fraud_alert_created', {
        alert_id: alertId,
        transaction_id: transactionId,
        risk_score: riskScore,
        risk_band: riskBand
      });
    };
    this.emitFraudAlertSent = (alertId, channel) => {
      return this.emitEvent('fraud_alert_sent', {
        alert_id: alertId,
        channel: channel
      });
    };
    this.emitFraudAlertDelivered = (alertId, channel) => {
      return this.emitEvent('fraud_alert_delivered', {
        alert_id: alertId,
        channel: channel
      });
    };
    this.emitFraudAlertFailed = (alertId, channel, reason) => {
      return this.emitEvent('fraud_alert_failed', {
        alert_id: alertId,
        channel: channel,
        failure_reason: reason
      });
    };
  }]);
})();
(function() {
  'use strict';
  angular.module('fraudAlertApp').service('auditService', ['$http', '$q', 'configService', function($http, $q, configService) {
    const baseUrl = configService.get('apiBaseUrl');
    this.logEvent = (eventType, eventData) => {
      const auditRecord = {
        event_type: eventType,
        event_data: eventData,
        timestamp: new Date().toISOString(),
        user_id: localStorage.getItem('user_id') || 'system'
      };
      return $http.post(`${baseUrl}/audit/events`, auditRecord)
        .then(response => response.data)
        .catch(error => {
          console.error('Audit logging failed:', error);
          return $q.reject(error);
        });
    };
    this.logAlertCreated = (alertId, transactionId, riskScore) => {
      return this.logEvent('alert_created', {
        alert_id: alertId,
        transaction_id: transactionId,
        risk_score: riskScore
      });
    };
    this.logAlertStateTransition = (alertId, fromState, toState) => {
      return this.logEvent('alert_state_transition', {
        alert_id: alertId,
        from_state: fromState,
        to_state: toState
      });
    };
  }]);
})();
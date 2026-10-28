(function() {
  'use strict';
  angular.module('fraudAlertApp').service('notificationStatusService', ['$http', '$q', 'analyticsService', 'configService', function($http, $q, analyticsService, configService) {
    const baseUrl = configService.get('apiBaseUrl');
    this.recordDelivery = (alertId, channel, status, providerResponse) => {
      const notificationStatus = {
        alert_id: alertId,
        channel: channel,
        status: status,
        delivered_at: status === 'delivered' ? new Date().toISOString() : null,
        failure_reason: status === 'failed' ? (providerResponse && providerResponse.error) : null,
        provider_response: providerResponse
      };
      return $http.post(`${baseUrl}/notifications/status`, notificationStatus)
        .then(response => {
          if (status === 'delivered') {
            analyticsService.emitFraudAlertDelivered(alertId, channel);
          } else if (status === 'failed') {
            analyticsService.emitFraudAlertFailed(alertId, channel, notificationStatus.failure_reason);
          }
          return response.data;
        })
        .catch(error => {
          console.error('Failed to record notification status:', error);
          return $q.reject(error);
        });
    };
    this.getNotificationStatus = (alertId) => {
      return $http.get(`${baseUrl}/notifications/status/${alertId}`)
        .then(response => response.data)
        .catch(error => {
          console.error('Failed to retrieve notification status:', error);
          return $q.reject(error);
        });
    };
  }]);
})();
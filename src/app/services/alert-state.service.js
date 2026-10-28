(function() {
  'use strict';
  angular.module('fraudAlertApp').service('alertStateService', ['$http', '$q', 'configService', function($http, $q, configService) {
    const baseUrl = configService.get('apiBaseUrl');
    this.persistAlert = (alertData) => {
      return $http.post(`${baseUrl}/alerts`, alertData)
        .then(response => response.data.alert_id)
        .catch(error => {
          console.error('Failed to persist alert:', error);
          return $q.reject(error);
        });
    };
    this.updateStatus = (alertId, newStatus) => {
      return $http.patch(`${baseUrl}/alerts/${alertId}/status`, { status: newStatus })
        .then(response => response.data)
        .catch(error => {
          console.error('Failed to update alert status:', error);
          return $q.reject(error);
        });
    };
    this.getAlert = (alertId) => {
      return $http.get(`${baseUrl}/alerts/${alertId}`)
        .then(response => response.data)
        .catch(error => {
          console.error('Failed to retrieve alert:', error);
          return $q.reject(error);
        });
    };
    this.getAlertsByStatus = (status) => {
      return $http.get(`${baseUrl}/alerts`, { params: { status: status } })
        .then(response => response.data)
        .catch(error => {
          console.error('Failed to retrieve alerts by status:', error);
          return $q.reject(error);
        });
    };
  }]);
})();
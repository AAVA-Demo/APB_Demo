(function() {
  'use strict';
  angular.module('fraudAlertApp').service('idempotencyService', ['$http', '$q', 'configService', function($http, $q, configService) {
    const baseUrl = configService.get('apiBaseUrl');
    const cache = new Map();
    this.checkDuplicate = (transactionId) => {
      if (cache.has(transactionId)) {
        return $q.resolve(true);
      }
      return $http.get(`${baseUrl}/idempotency/check/${transactionId}`)
        .then(response => {
          const isDuplicate = response.data.exists;
          if (isDuplicate) {
            cache.set(transactionId, true);
          }
          return isDuplicate;
        })
        .catch(() => $q.resolve(false));
    };
    this.markProcessed = (transactionId) => {
      cache.set(transactionId, true);
      return $http.post(`${baseUrl}/idempotency/mark`, { transaction_id: transactionId })
        .then(response => response.data)
        .catch(error => {
          console.error('Failed to mark transaction as processed:', error);
          return $q.reject(error);
        });
    };
  }]);
})();
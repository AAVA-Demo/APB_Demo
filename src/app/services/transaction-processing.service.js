(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TransactionProcessingService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var service = this;
      service.getMonthlySpend = function() {
        var deferred = $q.defer();
        $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY, { timeout: API_CONFIG.TIMEOUT })
          .then(function(response) {
            deferred.resolve(response.data);
          })
          .catch(function(error) {
            console.error('Error fetching monthly spend:', error);
            deferred.reject(error);
          });
        return deferred.promise;
      };
    }]);
})();
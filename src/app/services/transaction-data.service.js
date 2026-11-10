(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionDataService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var service = {
        getMonthlySpend: getMonthlySpend,
        getOutstandingAmounts: getOutstandingAmounts
      };
      return service;
      function getMonthlySpend(userId) {
        var deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/monthly-spend/' + userId)
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      }
      function getOutstandingAmounts(userId) {
        var deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/outstanding/' + userId)
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      }
    }]);
})();
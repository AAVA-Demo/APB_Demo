(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var service = {
        getCardSpending: getCardSpending,
        getTransactionHistory: getTransactionHistory
      };
      return service;
      function getCardSpending(cardId) {
        var deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/card/' + cardId + '/spending')
          .then(function(response) {
            var spending = {
              cardId: response.data.cardId,
              monthlySpend: response.data.monthlySpend || 0,
              lastTransactionDate: new Date(response.data.lastTransactionDate),
              transactionCount: response.data.transactionCount || 0,
              topCategory: response.data.topCategory || 'N/A'
            };
            deferred.resolve(spending);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      }
      function getTransactionHistory(cardId) {
        var deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/card/' + cardId + '/history')
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      }
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCard.transactions')
    .service('TransactionService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var service = this;
      service.getTransactions = function(filters) {
        var deferred = $q.defer();
        var params = {
          page: filters.page || 1,
          size: filters.pageSize || 50
        };
        if (filters.cardId) {
          params.cardId = filters.cardId;
        }
        if (filters.startDate) {
          params.startDate = filters.startDate;
        }
        if (filters.endDate) {
          params.endDate = filters.endDate;
        }
        $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTIONS, { params: params, timeout: API_CONFIG.TIMEOUT })
          .then(function(response) {
            deferred.resolve(response.data);
          })
          .catch(function(error) {
            console.error('Error fetching transactions:', error);
            deferred.reject(error);
          });
        return deferred.promise;
      };
      service.getTransactionById = function(transactionId) {
        var deferred = $q.defer();
        $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTIONS + '/' + transactionId, { timeout: API_CONFIG.TIMEOUT })
          .then(function(response) {
            deferred.resolve(response.data);
          })
          .catch(function(error) {
            console.error('Error fetching transaction details:', error);
            deferred.reject(error);
          });
        return deferred.promise;
      };
    }]);
})();
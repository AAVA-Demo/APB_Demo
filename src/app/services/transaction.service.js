(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TransactionService', ['$http', '$q', 'API_ENDPOINTS', function($http, $q, API_ENDPOINTS) {
      this.getTransactions = function(filters) {
        var params = filters || {};
        return $http.get(API_ENDPOINTS.transactions, { params: params }).then(function(response) {
          return response.data;
        }, function(error) {
          return $q.reject(error);
        });
      };
      this.getTransactionById = function(transactionId) {
        return $http.get(API_ENDPOINTS.transactions + '/' + transactionId).then(function(response) {
          return response.data;
        });
      };
    }]);
})();
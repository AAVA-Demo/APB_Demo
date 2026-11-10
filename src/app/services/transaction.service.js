(function() {
  'use strict';
  angular.module('creditCardApp').service('TransactionService', ['$http', '$q', function($http, $q) {
    var API_BASE = '/api/transactions';
    this.getTransactions = function(page, pageSize) {
      return $http.get(API_BASE, { params: { page: page, size: pageSize } }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
    this.getTransactionById = function(transactionId) {
      return $http.get(API_BASE + '/' + transactionId).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
  }]);
})();
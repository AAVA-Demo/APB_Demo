(function() {
  'use strict';
  angular.module('transactionModule').service('TransactionService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
    this.getTransactions = function(userId, queryParams) {
      var params = angular.extend({userId: userId}, queryParams);
      return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTIONS, {
        params: params,
        timeout: API_CONFIG.TIMEOUT
      }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
    
    this.getTransactionDetail = function(transactionId) {
      return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTIONS + '/' + transactionId, {
        timeout: API_CONFIG.TIMEOUT
      }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
  }]);
})();
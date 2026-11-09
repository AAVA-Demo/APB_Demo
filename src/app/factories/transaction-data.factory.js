(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionDataFactory', ['$http', '$q', 'API_ENDPOINTS', TransactionDataFactory]);
  function TransactionDataFactory($http, $q, API_ENDPOINTS) {
    return {
      getCurrentMonthTransactions: function() {
        var now = new Date();
        var params = { month: 'current', year: now.getFullYear() };
        return $http.get(API_ENDPOINTS.TRANSACTIONS, { params: params })
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            return $q.reject(error);
          });
      },
      getTransactionHistory: function(months) {
        var params = { months: months };
        return $http.get(API_ENDPOINTS.TRANSACTIONS, { params: params })
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            return $q.reject(error);
          });
      }
    };
  }
})();
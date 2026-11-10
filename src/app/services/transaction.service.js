(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionService', TransactionService);
  TransactionService.$inject = ['$http', '$q'];
  function TransactionService($http, $q) {
    var service = {
      getMonthlySpend: getMonthlySpend,
      getTransactions: getTransactions
    };
    return service;
    function getMonthlySpend() {
      return $http.get('/api/transactions/monthly')
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    }
    function getTransactions(startDate, endDate) {
      var params = {
        from: startDate.toISOString(),
        to: endDate.toISOString()
      };
      return $http.get('/api/transactions', {params: params})
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    }
  }
})();
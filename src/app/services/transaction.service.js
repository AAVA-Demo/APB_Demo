(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TransactionService', ['$http', '$q', TransactionService]);
  function TransactionService($http, $q) {
    var service = {
      getTransactions: getTransactions
    };
    return service;
    function getTransactions() {
      return $http.get('/api/transactions')
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    }
  }
})();
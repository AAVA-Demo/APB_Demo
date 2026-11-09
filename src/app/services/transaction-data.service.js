(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TransactionDataService', ['$http', '$q', TransactionDataService]);
  function TransactionDataService($http, $q) {
    var service = {
      getTransactions: getTransactions
    };
    return service;
    function getTransactions(month) {
      var url = '/api/transactions';
      if (month) {
        url += '?month=' + month;
      }
      return $http.get(url)
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    }
  }
})();
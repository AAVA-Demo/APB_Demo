(function() {
  'use strict';
  angular.module('app.analytics')
    .factory('TransactionDataFactory', ['$http', '$q', 'API_CONFIG', TransactionDataFactory]);
  function TransactionDataFactory($http, $q, API_CONFIG) {
    return {
      fetchTransactions: fetchTransactions
    };
    function fetchTransactions(params) {
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions, {
        params: params || {}
      })
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        return $q.reject(error);
      });
    }
  }
})();
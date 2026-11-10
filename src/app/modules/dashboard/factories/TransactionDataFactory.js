(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .factory('TransactionDataFactory', ['$http', '$q', function($http, $q) {
      return {
        fetchTransactions: function(month) {
          const params = month ? { month: month } : {};
          return $http.get('/api/transactions', { params: params })
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        }
      };
    }]);
})();
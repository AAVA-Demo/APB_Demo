(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .factory('TransactionDataFactory', ['$http', '$q', function($http, $q) {
      return {
        fetchTransactions: function() {
          return $http.get('/api/transactions')
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
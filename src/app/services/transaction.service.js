(function() {
  'use strict';
  angular.module('analyticsModule')
    .factory('TransactionService', ['$http', '$q', function($http, $q) {
      return {
        getAllTransactions: function() {
          return $http.get('/api/transactions')
            .then(function(response) {
              return response.data.transactions || response.data;
            })
            .catch(function(error) {
              console.error('Error fetching all transactions:', error);
              return $q.reject(error);
            });
        }
      };
    }]);
})();
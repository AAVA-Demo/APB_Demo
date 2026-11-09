(function() {
  'use strict';
  angular.module('analyticsModule')
    .factory('TransactionCategorizationService', ['$http', '$q', function($http, $q) {
      return {
        getCategorizedTransactions: function() {
          return $http.get('/api/transactions/categorized')
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              console.error('Error fetching categorized transactions:', error);
              return $q.reject(error);
            });
        }
      };
    }]);
})();
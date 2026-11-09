(function() {
  'use strict';
  angular.module('dashboardModule')
    .factory('TransactionDataService', ['$http', '$q', function($http, $q) {
      return {
        getCurrentMonthTransactions: function() {
          return $http.get('/api/transactions', {
            params: { month: 'current' }
          })
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching transactions:', error);
            return $q.reject(error);
          });
        }
      };
    }]);
})();
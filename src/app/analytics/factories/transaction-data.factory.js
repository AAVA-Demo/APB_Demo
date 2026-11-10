(function() {
  'use strict';
  angular.module('app.analytics')
    .factory('TransactionDataFactory', ['$http', '$q', function($http, $q) {
      const factory = {};
      factory.fetchTransactions = function(startDate, endDate) {
        const params = {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        };
        return $http.get('/api/transactions', { params: params })
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching transactions:', error);
            return $q.reject(error);
          });
      };
      return factory;
    }]);
})();
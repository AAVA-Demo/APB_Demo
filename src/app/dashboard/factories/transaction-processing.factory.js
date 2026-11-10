(function() {
  'use strict';
  angular.module('app.dashboard')
    .factory('TransactionProcessingFactory', ['$http', '$q', function($http, $q) {
      const factory = {};
      factory.getMonthlySpend = function() {
        return $http.get('/api/transactions/monthly')
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching monthly spend:', error);
            return $q.reject(error);
          });
      };
      return factory;
    }]);
})();
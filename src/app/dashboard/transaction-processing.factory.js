(function() {
  'use strict';
  angular.module('dashboardModule').factory('TransactionProcessingFactory', ['$http', '$q', function($http, $q) {
    var factory = {};
    factory.getMonthlySummary = function() {
      return $http.get('/api/transactions/monthly-summary').then(function(response) {
        return response.data;
      }).catch(function(err) {
        return $q.reject(err);
      });
    };
    return factory;
  }]);
})();
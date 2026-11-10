(function() {
  'use strict';
  angular.module('analyticsModule').factory('TransactionCategorizationFactory', ['$http', '$q', function($http, $q) {
    var factory = {};
    factory.getCategorySpending = function(months) {
      return $http.get('/api/analytics/category-spending', {
        params: { months: months }
      }).then(function(response) {
        return response.data;
      }).catch(function(err) {
        return $q.reject(err);
      });
    };
    return factory;
  }]);
})();
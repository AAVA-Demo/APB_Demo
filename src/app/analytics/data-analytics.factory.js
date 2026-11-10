(function() {
  'use strict';
  angular.module('analyticsModule').factory('DataAnalyticsFactory', ['$http', '$q', function($http, $q) {
    var factory = {};
    factory.getMonthlyTrends = function(months) {
      return $http.get('/api/analytics/monthly-trends', {
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
(function() {
  'use strict';
  angular.module('creditCardApp').factory('AnalyticsService', ['$http', '$q', function($http, $q) {
    var cache = {};
    var cacheTimeout = 300000;
    function getCategorySpending(userId, month) {
      var cacheKey = 'category_' + userId + '_' + month;
      if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp < cacheTimeout)) {
        return $q.resolve(cache[cacheKey].data);
      }
      var params = { userId: userId };
      if (month) {
        params.month = month;
      }
      return $http.get('/api/analytics/category-spending', { params: params })
        .then(function(response) {
          cache[cacheKey] = { data: response.data, timestamp: Date.now() };
          return response.data;
        })
        .catch(function(error) {
          console.error('Error fetching category spending:', error);
          return $q.reject(error);
        });
    }
    return {
      getCategorySpending: getCategorySpending
    };
  }]);
})();
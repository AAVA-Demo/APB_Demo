(function() {
  'use strict';
  angular.module('analyticsModule').service('AnalyticsService', AnalyticsService);
  AnalyticsService.$inject = ['$http', '$q', 'API_CONFIG', 'AnalyticsCache'];
  function AnalyticsService($http, $q, API_CONFIG, AnalyticsCache) {
    var vm = this;
    vm.getSpendingAnalytics = function(filter) {
      var cacheKey = 'analytics_' + JSON.stringify(filter);
      var cached = AnalyticsCache.get(cacheKey);
      if (cached) {
        return $q.resolve(cached);
      }
      var params = {};
      if (filter) {
        if (filter.cardIds && filter.cardIds.length) params.cardIds = filter.cardIds.join(',');
        if (filter.categories && filter.categories.length) params.categories = filter.categories.join(',');
        if (filter.startDate) params.startDate = filter.startDate;
        if (filter.endDate) params.endDate = filter.endDate;
      }
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics, { params: params, timeout: API_CONFIG.timeout })
        .then(function(response) {
          AnalyticsCache.put(cacheKey, response.data);
          return response.data;
        });
    };
  }
})();
(function() {
  'use strict';
  angular.module('creditCardApp').service('AnalyticsService', ['$http', '$q', '$cacheFactory', AnalyticsService]);
  function AnalyticsService($http, $q, $cacheFactory) {
    var vm = this;
    var cache = $cacheFactory('analyticsCache', { capacity: 10 });
    vm.getSpendingAnalytics = function(startDate, endDate) {
      var cacheKey = startDate + '_' + endDate;
      var cached = cache.get(cacheKey);
      if (cached) return $q.resolve(cached);
      var params = { start: startDate, end: endDate };
      return $http.get('/api/analytics/spending', { params: params }).then(function(response) {
        var data = {
          monthlyTrends: response.data.monthlyTrends || [],
          categoryBreakdown: response.data.categoryBreakdown || [],
          cardWiseSpend: response.data.cardWiseSpend || []
        };
        cache.put(cacheKey, data);
        return data;
      }).catch(function(error) {
        console.error('Error fetching analytics:', error);
        return { monthlyTrends: [], categoryBreakdown: [], cardWiseSpend: [] };
      });
    };
  }
})();
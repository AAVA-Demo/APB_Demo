(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AnalyticsService', ['$http', '$q', '$cacheFactory', 'CategoryFactory', function($http, $q, $cacheFactory, CategoryFactory) {
      var cache = $cacheFactory('analyticsCache');
      var CACHE_TTL = 300000;
      this.getSpendingInsights = function(userId, months) {
        var cacheKey = 'insights_' + userId + '_' + months;
        var cached = cache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
          return $q.resolve(cached.data);
        }
        return CategoryFactory.getCategorizedTransactions(userId, months).then(function(data) {
          var insights = {
            categoryBreakdown: data.aggregations.categoryBreakdown || [],
            monthlyTrends: data.aggregations.monthlyTrends || [],
            period: { start: new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000), end: new Date() }
          };
          cache.put(cacheKey, { data: insights, timestamp: Date.now() });
          return insights;
        }).catch(function(error) {
          console.error('Analytics fetch error:', error);
          return $q.reject(error);
        });
      };
      this.filterByCategory = function(data, category) {
        if (!category || category === 'All') return data;
        return {
          categoryBreakdown: data.categoryBreakdown.filter(function(item) { return item.category === category; }),
          monthlyTrends: data.monthlyTrends,
          period: data.period
        };
      };
    }]);
})();
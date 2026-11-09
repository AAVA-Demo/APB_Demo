(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AnalyticsService', ['TransactionAPI', 'CategoryAPI', 'AnalyticsAPI', '$q', '$cacheFactory', function(TransactionAPI, CategoryAPI, AnalyticsAPI, $q, $cacheFactory) {
      const cache = $cacheFactory('analyticsCache');

      this.getSpendingAnalytics = function(userId, timeRange) {
        const cacheKey = `analytics_${userId}_${timeRange.startDate.getTime()}_${timeRange.endDate.getTime()}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
          return $q.resolve(cachedData);
        }

        const transactionsPromise = TransactionAPI.fetchTransactions(userId, timeRange);
        const categoriesPromise = CategoryAPI.fetchCategories(userId);
        const trendsPromise = AnalyticsAPI.fetchTrends(userId, timeRange);

        return $q.all([transactionsPromise, categoriesPromise, trendsPromise])
          .then(function(results) {
            const transactions = results[0];
            const categories = results[1];
            const trends = results[2];

            const totalSpend = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

            const categoryBreakdown = categories.map(cat => ({
              category: cat.categoryName,
              amount: cat.totalAmount,
              percentage: totalSpend > 0 ? ((cat.totalAmount / totalSpend) * 100).toFixed(2) : 0
            }));

            const analyticsData = {
              userId: userId,
              monthlyTrends: trends,
              categoryBreakdown: categoryBreakdown,
              timeRange: timeRange,
              totalSpend: totalSpend
            };

            cache.put(cacheKey, analyticsData);
            return analyticsData;
          });
      };
    }]);
})();
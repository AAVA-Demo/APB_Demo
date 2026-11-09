(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .service('AnalyticsService', ['TransactionFactory', 'CategoryFactory', 'AnalyticsEngineFactory', '$q', '$window', function(TransactionFactory, CategoryFactory, AnalyticsEngineFactory, $q, $window) {
      var cachedAnalytics = {};
      this.getAnalytics = function(dateRange) {
        var cacheKey = JSON.stringify(dateRange);
        if (cachedAnalytics[cacheKey]) {
          return $q.resolve(cachedAnalytics[cacheKey]);
        }
        var deferred = $q.defer();
        $q.all([
          TransactionFactory.fetchTransactions(dateRange),
          CategoryFactory.getCategoryMapping()
        ]).then(function(results) {
          var transactions = results[0].data;
          var categories = results[1].data;
          return AnalyticsEngineFactory.aggregateByCategory(transactions);
        }).then(function(analyticsResult) {
          var analyticsData = {
            dateRange: dateRange,
            categoryBreakdown: analyticsResult.data.categoryBreakdown,
            totalSpending: analyticsResult.data.totalSpending,
            topCategory: analyticsResult.data.topCategory
          };
          cachedAnalytics[cacheKey] = analyticsData;
          if ($window.sessionStorage) {
            $window.sessionStorage.setItem('lastDateRange', JSON.stringify(dateRange));
          }
          deferred.resolve(analyticsData);
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
      this.getLastDateRange = function() {
        if ($window.sessionStorage) {
          var stored = $window.sessionStorage.getItem('lastDateRange');
          if (stored) {
            return JSON.parse(stored);
          }
        }
        var endDate = new Date();
        var startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 12);
        return {startDate: startDate, endDate: endDate};
      };
    }]);
})();
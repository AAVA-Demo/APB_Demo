(function() {
  'use strict';
  angular.module('analyticsModule').service('AnalyticsService', ['TransactionCategorizationFactory', 'DataAnalyticsFactory', '$q', function(TransactionCategorizationFactory, DataAnalyticsFactory, $q) {
    var self = this;
    self.getSpendingInsights = function(months) {
      return $q.all({
        categorySpending: TransactionCategorizationFactory.getCategorySpending(months),
        monthlyTrends: DataAnalyticsFactory.getMonthlyTrends(months)
      }).then(function(results) {
        var totalSpend = results.categorySpending.reduce(function(sum, cat) {
          return sum + cat.totalSpend;
        }, 0);
        results.categorySpending.forEach(function(cat) {
          cat.percentage = totalSpend > 0 ? ((cat.totalSpend / totalSpend) * 100).toFixed(2) : 0;
        });
        return {
          categorySpending: results.categorySpending,
          monthlyTrends: results.monthlyTrends,
          totalSpend: totalSpend,
          periodStart: new Date(new Date().setMonth(new Date().getMonth() - months)),
          periodEnd: new Date()
        };
      });
    };
  }]);
})();
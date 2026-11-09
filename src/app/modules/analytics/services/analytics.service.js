(function() {
  'use strict';
  angular.module('creditCard.analytics').service('AnalyticsService', ['$q', 'TransactionDataFactory', 'CategorizationService', function($q, TransactionDataFactory, CategorizationService) {
    var self = this;
    self.loadAnalytics = function(dateRange) {
      var deferred = $q.defer();
      TransactionDataFactory.getTransactions(dateRange).then(function(transactions) {
        CategorizationService.categorizeTransactions(transactions).then(function(categorized) {
          var categoryMap = {};
          categorized.forEach(function(t) {
            if (!categoryMap[t.category]) {
              categoryMap[t.category] = {category: t.category, totalAmount: 0, transactionCount: 0};
            }
            categoryMap[t.category].totalAmount += t.amount;
            categoryMap[t.category].transactionCount++;
          });
          var categorySpending = Object.keys(categoryMap).map(function(key) {
            return categoryMap[key];
          });
          var totalAmount = categorySpending.reduce(function(sum, c) { return sum + c.totalAmount; }, 0);
          categorySpending.forEach(function(c) {
            c.percentage = totalAmount > 0 ? (c.totalAmount / totalAmount * 100).toFixed(2) : 0;
          });
          var monthMap = {};
          categorized.forEach(function(t) {
            var monthKey = t.date.getFullYear() + '-' + String(t.date.getMonth() + 1).padStart(2, '0');
            if (!monthMap[monthKey]) {
              monthMap[monthKey] = {month: monthKey, totalSpend: 0, categoryBreakdown: {}};
            }
            monthMap[monthKey].totalSpend += t.amount;
            if (!monthMap[monthKey].categoryBreakdown[t.category]) {
              monthMap[monthKey].categoryBreakdown[t.category] = 0;
            }
            monthMap[monthKey].categoryBreakdown[t.category] += t.amount;
          });
          var monthlyTrends = Object.keys(monthMap).map(function(key) {
            var breakdown = Object.keys(monthMap[key].categoryBreakdown).map(function(cat) {
              return {category: cat, amount: monthMap[key].categoryBreakdown[cat]};
            });
            return {
              month: monthMap[key].month,
              totalSpend: monthMap[key].totalSpend,
              categoryBreakdown: breakdown
            };
          }).sort(function(a, b) { return a.month.localeCompare(b.month); });
          deferred.resolve({
            categorySpending: categorySpending,
            monthlyTrends: monthlyTrends,
            totalTransactions: categorized.length,
            dateRange: dateRange || {start: null, end: null}
          });
        });
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
  }]);
})();
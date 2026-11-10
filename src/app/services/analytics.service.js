(function() {
  'use strict';
  angular.module('creditCardApp').service('AnalyticsService', ['$cacheFactory', function($cacheFactory) {
    var service = this;
    var cache = $cacheFactory('analyticsCache');

    service.aggregateByCategory = function(transactions) {
      var cacheKey = 'categoryAgg_' + transactions.length;
      var cached = cache.get(cacheKey);
      if (cached) return cached;

      var categoryMap = {};
      var total = 0;
      transactions.forEach(function(t) {
        if (!categoryMap[t.category]) {
          categoryMap[t.category] = {category: t.category, totalSpend: 0, transactionCount: 0};
        }
        categoryMap[t.category].totalSpend += t.amount;
        categoryMap[t.category].transactionCount++;
        total += t.amount;
      });

      var result = Object.keys(categoryMap).map(function(key) {
        var cat = categoryMap[key];
        cat.percentage = total > 0 ? (cat.totalSpend / total * 100) : 0;
        return cat;
      });

      cache.put(cacheKey, result);
      return result;
    };

    service.calculateMonthlyTrends = function(transactions) {
      var cacheKey = 'monthlyTrends_' + transactions.length;
      var cached = cache.get(cacheKey);
      if (cached) return cached;

      var monthMap = {};
      transactions.forEach(function(t) {
        var date = new Date(t.transactionDate);
        var monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
        if (!monthMap[monthKey]) {
          monthMap[monthKey] = {month: monthKey, totalSpend: 0, categoryBreakdown: {}};
        }
        monthMap[monthKey].totalSpend += t.amount;
        if (!monthMap[monthKey].categoryBreakdown[t.category]) {
          monthMap[monthKey].categoryBreakdown[t.category] = 0;
        }
        monthMap[monthKey].categoryBreakdown[t.category] += t.amount;
      });

      var result = Object.keys(monthMap).sort().map(function(key) {
        var month = monthMap[key];
        month.categoryBreakdown = Object.keys(month.categoryBreakdown).map(function(cat) {
          return {category: cat, totalSpend: month.categoryBreakdown[cat]};
        });
        return month;
      });

      cache.put(cacheKey, result);
      return result;
    };
  }]);
})();
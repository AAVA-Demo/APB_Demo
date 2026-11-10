(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AnalyticsService', AnalyticsService);
  AnalyticsService.$inject = ['TransactionService', '$http', '$q', '$cacheFactory'];
  function AnalyticsService(TransactionService, $http, $q, $cacheFactory) {
    var cache = $cacheFactory('analyticsCache');
    var service = {
      getSpendingAnalytics: getSpendingAnalytics
    };
    return service;
    function getSpendingAnalytics(dateRange) {
      var cacheKey = 'analytics_' + dateRange.startDate.toISOString() + '_' + dateRange.endDate.toISOString();
      var cached = cache.get(cacheKey);
      if (cached) {
        return $q.resolve(cached);
      }
      return TransactionService.getTransactions(dateRange.startDate, dateRange.endDate)
        .then(function(transactions) {
          var analyticsData = processTransactions(transactions, dateRange);
          cache.put(cacheKey, analyticsData);
          return analyticsData;
        });
    }
    function processTransactions(transactions, dateRange) {
      var categoryMap = {};
      var monthlyMap = {};
      var totalSpend = 0;
      var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      categories.forEach(function(cat) {
        categoryMap[cat] = {category: cat, amount: 0, transactionCount: 0, percentage: 0};
      });
      transactions.forEach(function(txn) {
        var amount = txn.amount || 0;
        var category = txn.category || 'Miscellaneous';
        var date = new Date(txn.date);
        var monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
        totalSpend += amount;
        if (categoryMap[category]) {
          categoryMap[category].amount += amount;
          categoryMap[category].transactionCount++;
        } else {
          categoryMap['Miscellaneous'].amount += amount;
          categoryMap['Miscellaneous'].transactionCount++;
        }
        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = {month: monthKey, totalSpend: 0, categoryBreakdown: []};
        }
        monthlyMap[monthKey].totalSpend += amount;
      });
      var categorySpending = Object.keys(categoryMap).map(function(key) {
        var cat = categoryMap[key];
        cat.percentage = totalSpend > 0 ? (cat.amount / totalSpend) * 100 : 0;
        return cat;
      }).filter(function(cat) {
        return cat.amount > 0;
      });
      var monthlyTrends = Object.keys(monthlyMap).map(function(key) {
        return monthlyMap[key];
      }).sort(function(a, b) {
        return a.month.localeCompare(b.month);
      });
      var topCategory = categorySpending.reduce(function(max, cat) {
        return cat.amount > max.amount ? cat : max;
      }, {amount: 0, category: ''}).category;
      return {
        dateRange: dateRange,
        totalSpend: totalSpend,
        categorySpending: categorySpending,
        monthlyTrends: monthlyTrends,
        topCategory: topCategory
      };
    }
  }
})();
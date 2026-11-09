(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AnalyticsEngine', [function() {
      var CATEGORIES = [
        'Food & Dining',
        'Fuel',
        'Shopping',
        'Travel',
        'Entertainment',
        'Utilities',
        'Healthcare',
        'Education',
        'Miscellaneous'
      ];
      var service = {
        aggregateByCategory: aggregateByCategory,
        aggregateByMonth: aggregateByMonth
      };
      return service;

      function aggregateByCategory(transactions) {
        var categoryMap = {};
        var totalSpend = 0;
        CATEGORIES.forEach(function(cat) {
          categoryMap[cat] = { category: cat, totalAmount: 0, transactionCount: 0, percentage: 0 };
        });
        if (transactions && transactions.length > 0) {
          transactions.forEach(function(txn) {
            var cat = txn.category || 'Miscellaneous';
            if (categoryMap[cat]) {
              categoryMap[cat].totalAmount += txn.amount || 0;
              categoryMap[cat].transactionCount += 1;
              totalSpend += txn.amount || 0;
            }
          });
        }
        var result = [];
        CATEGORIES.forEach(function(cat) {
          var item = categoryMap[cat];
          item.percentage = totalSpend > 0 ? (item.totalAmount / totalSpend * 100).toFixed(2) : 0;
          result.push(item);
        });
        return result;
      }

      function aggregateByMonth(transactions) {
        var monthMap = {};
        if (transactions && transactions.length > 0) {
          transactions.forEach(function(txn) {
            var date = new Date(txn.transactionDate);
            var monthKey = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0');
            if (!monthMap[monthKey]) {
              monthMap[monthKey] = { month: monthKey, totalSpend: 0, transactions: [] };
            }
            monthMap[monthKey].totalSpend += txn.amount || 0;
            monthMap[monthKey].transactions.push(txn);
          });
        }
        var result = [];
        Object.keys(monthMap).sort().forEach(function(key) {
          var monthData = monthMap[key];
          monthData.categoryBreakdown = aggregateByCategory(monthData.transactions);
          delete monthData.transactions;
          result.push(monthData);
        });
        return result;
      }
    }]);
})();
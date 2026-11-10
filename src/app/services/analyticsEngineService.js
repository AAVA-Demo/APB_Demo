(function() {
  'use strict';
  angular.module('creditCardApp').service('analyticsEngineService', ['categoryService', function(categoryService) {
    var self = this;
    self.processTransactions = function(transactions) {
      var categoryMap = new Map();
      var monthlyMap = new Map();
      var totalSpend = 0;
      transactions.forEach(function(txn) {
        var validatedCategory = categoryService.validateCategory(txn.category);
        var amount = parseFloat(txn.amount.toFixed(2));
        totalSpend += amount;
        if (!categoryMap.has(validatedCategory)) {
          categoryMap.set(validatedCategory, { category: validatedCategory, totalSpend: 0, transactionCount: 0 });
        }
        var catData = categoryMap.get(validatedCategory);
        catData.totalSpend += amount;
        catData.transactionCount++;
        var monthKey = new Date(txn.transactionDate).toISOString().substring(0, 7);
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, 0);
        }
        monthlyMap.set(monthKey, monthlyMap.get(monthKey) + amount);
      });
      var categoryBreakdown = Array.from(categoryMap.values()).map(function(item) {
        item.totalSpend = parseFloat(item.totalSpend.toFixed(2));
        item.percentage = parseFloat(((item.totalSpend / totalSpend) * 100).toFixed(2));
        return item;
      });
      var monthlyTrends = Array.from(monthlyMap.entries()).map(function(entry) {
        return { month: entry[0], totalSpend: parseFloat(entry[1].toFixed(2)) };
      }).sort(function(a, b) {
        return a.month.localeCompare(b.month);
      });
      return {
        categoryBreakdown: categoryBreakdown,
        monthlyTrends: monthlyTrends,
        totalTransactions: transactions.length,
        totalSpend: parseFloat(totalSpend.toFixed(2)),
        dateRange: {
          startDate: transactions.length > 0 ? new Date(Math.min.apply(null, transactions.map(function(t) { return new Date(t.transactionDate); }))) : null,
          endDate: transactions.length > 0 ? new Date(Math.max.apply(null, transactions.map(function(t) { return new Date(t.transactionDate); }))) : null
        }
      };
    };
  }]);
})();
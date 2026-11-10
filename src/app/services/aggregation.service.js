(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AggregationService', [function() {
      var self = this;
      self.calculateCategoryTotals = function(categorizedTransactions) {
        var categoryMap = {};
        var total = 0;
        categorizedTransactions.forEach(function(txn) {
          var cat = txn.category;
          if (!categoryMap[cat]) {
            categoryMap[cat] = { category: cat, totalAmount: 0, transactionCount: 0 };
          }
          categoryMap[cat].totalAmount += txn.amount;
          categoryMap[cat].transactionCount++;
          total += txn.amount;
        });
        var result = [];
        for (var cat in categoryMap) {
          categoryMap[cat].totalAmount = Math.round(categoryMap[cat].totalAmount * 100) / 100;
          categoryMap[cat].percentage = total > 0 ? Math.round((categoryMap[cat].totalAmount / total) * 10000) / 100 : 0;
          result.push(categoryMap[cat]);
        }
        return result;
      };
      self.calculateMonthlyTrends = function(categorizedTransactions) {
        var monthMap = {};
        categorizedTransactions.forEach(function(txn) {
          var date = new Date(txn.date);
          var monthKey = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2);
          if (!monthMap[monthKey]) {
            monthMap[monthKey] = { month: monthKey, totalSpend: 0, transactions: [] };
          }
          monthMap[monthKey].totalSpend += txn.amount;
          monthMap[monthKey].transactions.push(txn);
        });
        var result = [];
        for (var month in monthMap) {
          monthMap[month].totalSpend = Math.round(monthMap[month].totalSpend * 100) / 100;
          monthMap[month].categoryBreakdown = self.calculateCategoryTotals(monthMap[month].transactions);
          delete monthMap[month].transactions;
          result.push(monthMap[month]);
        }
        return result.sort(function(a, b) { return a.month.localeCompare(b.month); });
      };
    }]);
})();
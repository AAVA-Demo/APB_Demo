(function() {
  'use strict';
  angular.module('spendingAnalytics')
    .service('AnalyticsEngineService', ['CategoryMapperFactory', AnalyticsEngineService]);
  function AnalyticsEngineService(CategoryMapperFactory) {
    var vm = this;
    vm.calculateCategorySpending = function(transactions) {
      var categoryMap = {};
      var totalSpend = 0;
      transactions.forEach(function(txn) {
        var category = CategoryMapperFactory.mapCategory(txn.category);
        if (!categoryMap[category]) {
          categoryMap[category] = {
            category: category,
            totalAmount: 0,
            transactionCount: 0
          };
        }
        categoryMap[category].totalAmount += txn.amount;
        categoryMap[category].transactionCount++;
        totalSpend += txn.amount;
      });
      var categoryArray = Object.keys(categoryMap).map(function(key) {
        var cat = categoryMap[key];
        cat.percentage = totalSpend > 0 ? parseFloat(((cat.totalAmount / totalSpend) * 100).toFixed(2)) : 0;
        cat.totalAmount = parseFloat(cat.totalAmount.toFixed(2));
        return cat;
      });
      return categoryArray.sort(function(a, b) {
        return b.totalAmount - a.totalAmount;
      });
    };
    vm.calculateMonthlyTrends = function(transactions) {
      var monthMap = {};
      transactions.forEach(function(txn) {
        var date = new Date(txn.transactionDate);
        var monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
        if (!monthMap[monthKey]) {
          monthMap[monthKey] = {
            month: monthKey,
            totalSpend: 0,
            transactions: []
          };
        }
        monthMap[monthKey].totalSpend += txn.amount;
        monthMap[monthKey].transactions.push(txn);
      });
      var monthArray = Object.keys(monthMap).map(function(key) {
        var month = monthMap[key];
        month.totalSpend = parseFloat(month.totalSpend.toFixed(2));
        month.categoryBreakdown = vm.calculateCategorySpending(month.transactions);
        delete month.transactions;
        return month;
      });
      return monthArray.sort(function(a, b) {
        return a.month.localeCompare(b.month);
      });
    };
  }
})();
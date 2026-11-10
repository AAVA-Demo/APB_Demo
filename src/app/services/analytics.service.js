(function() {
  'use strict';
  angular.module('analytics')
    .service('AnalyticsService', ['TransactionRepositoryFactory', 'CategorizationService', '$q', function(TransactionRepositoryFactory, CategorizationService, $q) {
      this.getSpendingInsights = function(userId, dateRange) {
        return TransactionRepositoryFactory.getTransactions(userId, dateRange.months).then(function(transactions) {
          var categorized = transactions.map(function(txn) {
            txn.category = CategorizationService.categorize(txn);
            return txn;
          });
          var categorySpending = this.aggregateByCategory(categorized);
          var monthlyTrends = this.aggregateByMonth(categorized);
          return {
            categorySpending: categorySpending,
            monthlyTrends: monthlyTrends
          };
        }.bind(this));
      };
      this.aggregateByCategory = function(transactions) {
        var categories = {};
        var total = 0;
        transactions.forEach(function(txn) {
          if (!categories[txn.category]) {
            categories[txn.category] = {category: txn.category, totalAmount: 0, transactionCount: 0};
          }
          categories[txn.category].totalAmount += txn.amount;
          categories[txn.category].transactionCount++;
          total += txn.amount;
        });
        return Object.keys(categories).map(function(key) {
          var cat = categories[key];
          cat.percentage = total > 0 ? (cat.totalAmount / total) * 100 : 0;
          return cat;
        });
      };
      this.aggregateByMonth = function(transactions) {
        var months = {};
        transactions.forEach(function(txn) {
          var month = txn.transactionDate.substring(0, 7);
          if (!months[month]) {
            months[month] = {month: month, totalSpend: 0};
          }
          months[month].totalSpend += txn.amount;
        });
        return Object.keys(months).sort().map(function(key) {
          return months[key];
        });
      };
    }]);
})();
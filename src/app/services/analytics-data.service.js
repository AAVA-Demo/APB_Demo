(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AnalyticsDataService', ['$http', '$q', 'TransactionCategorizer', function($http, $q, TransactionCategorizer) {
      var self = this;
      self.getSpendingAnalytics = function(userId, months) {
        return $http.get('/api/analytics/spending?userId=' + userId + '&months=' + months)
          .then(function(response) {
            var transactions = response.data;
            var categorized = TransactionCategorizer.categorizeTransactions(transactions);
            return self.aggregateData(categorized, months);
          })
          .catch(function() {
            var mockTransactions = self.generateMockTransactions(userId, months);
            var categorized = TransactionCategorizer.categorizeTransactions(mockTransactions);
            return self.aggregateData(categorized, months);
          });
      };
      self.aggregateData = function(transactions, months) {
        var categoryMap = {};
        var monthlyMap = {};
        transactions.forEach(function(txn) {
          if (!categoryMap[txn.category]) {
            categoryMap[txn.category] = { categoryName: txn.category, totalAmount: 0, transactionCount: 0 };
          }
          categoryMap[txn.category].totalAmount += txn.amount;
          categoryMap[txn.category].transactionCount++;
          var monthKey = txn.transactionDate.substring(0, 7);
          if (!monthlyMap[monthKey]) {
            monthlyMap[monthKey] = { month: monthKey, totalAmount: 0, categoryBreakdown: {} };
          }
          monthlyMap[monthKey].totalAmount += txn.amount;
          if (!monthlyMap[monthKey].categoryBreakdown[txn.category]) {
            monthlyMap[monthKey].categoryBreakdown[txn.category] = { categoryName: txn.category, totalAmount: 0, transactionCount: 0 };
          }
          monthlyMap[monthKey].categoryBreakdown[txn.category].totalAmount += txn.amount;
          monthlyMap[monthKey].categoryBreakdown[txn.category].transactionCount++;
        });
        var totalAmount = Object.values(categoryMap).reduce(function(sum, cat) { return sum + cat.totalAmount; }, 0);
        Object.values(categoryMap).forEach(function(cat) {
          cat.percentage = totalAmount > 0 ? (cat.totalAmount / totalAmount * 100).toFixed(2) : 0;
        });
        var monthlyTrends = Object.values(monthlyMap).map(function(m) {
          m.categoryBreakdown = Object.values(m.categoryBreakdown);
          return m;
        }).sort(function(a, b) { return a.month.localeCompare(b.month); });
        return {
          userId: transactions[0] ? transactions[0].userId : 'user-123',
          period: { startDate: new Date(), endDate: new Date() },
          categorySpending: Object.values(categoryMap),
          monthlyTrends: monthlyTrends
        };
      };
      self.generateMockTransactions = function(userId, months) {
        var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        var transactions = [];
        var now = new Date();
        for (var i = 0; i < months; i++) {
          var monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
          var monthStr = monthDate.toISOString().substring(0, 7);
          categories.forEach(function(cat) {
            var count = Math.floor(Math.random() * 5) + 3;
            for (var j = 0; j < count; j++) {
              transactions.push({
                transactionId: 'txn-' + i + '-' + cat + '-' + j,
                cardId: 'card-00' + (Math.floor(Math.random() * 3) + 1),
                userId: userId,
                amount: Math.random() * 500 + 50,
                merchant: 'Merchant-' + cat,
                category: cat,
                transactionDate: monthStr + '-15'
              });
            }
          });
        }
        return transactions;
      };
    }]);
})();
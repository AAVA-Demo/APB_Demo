(function() {
  'use strict';
  angular.module('analyticsModule')
    .service('CategoryService', ['TransactionDataFactory', function(TransactionDataFactory) {
      const CATEGORIES = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      this.categorizeTransactions = function(transactions) {
        return transactions;
      };
      this.getCategoryBreakdown = function(transactions) {
        const categoryTotals = {};
        CATEGORIES.forEach(function(cat) {
          categoryTotals[cat] = 0;
        });
        let total = 0;
        transactions.forEach(function(txn) {
          if (categoryTotals.hasOwnProperty(txn.category)) {
            categoryTotals[txn.category] += txn.amount;
          } else {
            categoryTotals['Miscellaneous'] += txn.amount;
          }
          total += txn.amount;
        });
        const breakdown = [];
        CATEGORIES.forEach(function(cat) {
          breakdown.push({
            category: cat,
            amount: categoryTotals[cat],
            percentage: total > 0 ? (categoryTotals[cat] / total * 100).toFixed(2) : 0
          });
        });
        return breakdown;
      };
    }]);
})();
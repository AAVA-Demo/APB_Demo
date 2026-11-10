(function() {
  'use strict';
  angular.module('analyticsModule').service('AnalyticsEngineService', [function() {
    this.aggregateSpending = function(transactions) {
      const categorySpends = {};
      const monthlyTrends = {};
      const cardWiseSpends = {};
      transactions.forEach(function(txn) {
        if (!categorySpends[txn.category]) {
          categorySpends[txn.category] = { category: txn.category, totalSpend: 0, transactionCount: 0 };
        }
        categorySpends[txn.category].totalSpend += txn.amount;
        categorySpends[txn.category].transactionCount += 1;
        if (!monthlyTrends[txn.month]) {
          monthlyTrends[txn.month] = { month: txn.month, totalSpend: 0, categoryBreakdown: {} };
        }
        monthlyTrends[txn.month].totalSpend += txn.amount;
        if (!monthlyTrends[txn.month].categoryBreakdown[txn.category]) {
          monthlyTrends[txn.month].categoryBreakdown[txn.category] = 0;
        }
        monthlyTrends[txn.month].categoryBreakdown[txn.category] += txn.amount;
        if (!cardWiseSpends[txn.cardId]) {
          cardWiseSpends[txn.cardId] = { cardId: txn.cardId, totalSpend: 0 };
        }
        cardWiseSpends[txn.cardId].totalSpend += txn.amount;
      });
      return {
        categorySpends: Object.values(categorySpends),
        monthlyTrends: Object.values(monthlyTrends).sort((a, b) => a.month.localeCompare(b.month)),
        cardWiseSpends: Object.values(cardWiseSpends)
      };
    };
  }]);
})();
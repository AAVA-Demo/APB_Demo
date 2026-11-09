(function() {
  'use strict';
  angular.module('creditCardApp').factory('AnalyticsService', ['TransactionService', 'CategorizationService', '$q', function(TransactionService, CategorizationService, $q) {
    return {
      getSpendingInsights: function(dateRange) {
        var startDate = dateRange.startDate || new Date(new Date().setMonth(new Date().getMonth() - 11));
        var endDate = dateRange.endDate || new Date();
        return TransactionService.getTransactionsByDateRange(startDate.toISOString(), endDate.toISOString()).then(function(transactions) {
          var categorizedTransactions = CategorizationService.categorizeTransactions(transactions);
          var monthlyTrends = {};
          var cardWiseSpend = {};
          var categorySpend = {};
          categorizedTransactions.forEach(function(txn) {
            var month = new Date(txn.transactionDate).toISOString().substring(0, 7);
            if (!monthlyTrends[month]) {
              monthlyTrends[month] = { month: month, totalSpend: 0, transactionCount: 0 };
            }
            monthlyTrends[month].totalSpend += txn.amount;
            monthlyTrends[month].transactionCount += 1;
            if (!cardWiseSpend[txn.cardId]) {
              cardWiseSpend[txn.cardId] = { cardId: txn.cardId, cardName: txn.cardName, totalSpend: 0 };
            }
            cardWiseSpend[txn.cardId].totalSpend += txn.amount;
            if (!categorySpend[txn.category]) {
              categorySpend[txn.category] = { category: txn.category, amount: 0, transactionCount: 0 };
            }
            categorySpend[txn.category].amount += txn.amount;
            categorySpend[txn.category].transactionCount += 1;
          });
          var totalSpend = Object.values(cardWiseSpend).reduce(function(sum, card) { return sum + card.totalSpend; }, 0);
          Object.values(cardWiseSpend).forEach(function(card) {
            card.percentage = totalSpend > 0 ? (card.totalSpend / totalSpend * 100).toFixed(2) : 0;
          });
          Object.values(categorySpend).forEach(function(cat) {
            cat.percentage = totalSpend > 0 ? (cat.amount / totalSpend * 100).toFixed(2) : 0;
          });
          return {
            monthlyTrends: Object.values(monthlyTrends).sort(function(a, b) { return a.month.localeCompare(b.month); }),
            cardWiseSpend: Object.values(cardWiseSpend),
            categorySpend: Object.values(categorySpend),
            dateRange: { startDate: startDate, endDate: endDate }
          };
        });
      }
    };
  }]);
})();
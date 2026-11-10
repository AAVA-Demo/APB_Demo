(function() {
  'use strict';
  angular.module('creditCardApp').factory('CardMetricsFactory', [function() {
    return {
      calculate: function(card, transactions) {
        var monthlySpend = 0;
        var transactionCount = transactions.length;
        var lastTransactionDate = null;
        transactions.forEach(function(t) {
          monthlySpend += t.amount;
          if (!lastTransactionDate || new Date(t.transactionDate) > new Date(lastTransactionDate)) {
            lastTransactionDate = t.transactionDate;
          }
        });
        var utilizationRate = card.creditLimit > 0 ? ((card.outstandingBalance || 0) / card.creditLimit * 100) : 0;
        return {
          cardId: card.cardId,
          monthlySpend: monthlySpend,
          utilizationRate: utilizationRate,
          transactionCount: transactionCount,
          lastTransactionDate: lastTransactionDate
        };
      }
    };
  }]);
})();
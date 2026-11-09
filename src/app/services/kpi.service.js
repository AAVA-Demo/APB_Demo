(function() {
  'use strict';
  angular.module('creditCardApp').factory('KpiService', ['CardDataService', 'TransactionService', '$q', function(CardDataService, TransactionService, $q) {
    return {
      calculateKPIs: function() {
        return $q.all({
          cards: CardDataService.getAllCards(),
          transactions: TransactionService.getMonthlyTransactions()
        }).then(function(results) {
          var cards = results.cards;
          var transactions = results.transactions;
          var totalCreditLimit = cards.reduce(function(sum, card) { return sum + card.creditLimit; }, 0);
          var totalOutstanding = cards.reduce(function(sum, card) { return sum + card.outstandingAmount; }, 0);
          var totalAvailableCredit = cards.reduce(function(sum, card) { return sum + card.availableCredit; }, 0);
          var monthlySpend = transactions.reduce(function(sum, txn) { return sum + txn.amount; }, 0);
          var utilizationRate = totalCreditLimit > 0 ? (totalOutstanding / totalCreditLimit * 100).toFixed(2) : 0;
          return {
            totalCreditLimit: totalCreditLimit,
            totalAvailableCredit: totalAvailableCredit,
            totalOutstanding: totalOutstanding,
            monthlySpend: monthlySpend,
            utilizationRate: utilizationRate,
            cards: cards
          };
        });
      }
    };
  }]);
})();
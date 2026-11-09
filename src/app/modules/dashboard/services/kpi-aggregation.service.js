(function() {
  'use strict';
  angular.module('dashboardModule')
    .service('KPIAggregationService', ['$q', 'CreditCardDataService', 'TransactionDataService', function($q, CreditCardDataService, TransactionDataService) {
      this.getKPIs = function() {
        return $q.all({
          cards: CreditCardDataService.getAllCards(),
          transactions: TransactionDataService.getCurrentMonthTransactions()
        }).then(function(results) {
          const cards = results.cards;
          const transactions = results.transactions;
          
          const totalCreditLimit = cards.reduce((sum, card) => sum + card.creditLimit, 0);
          const totalOutstanding = cards.reduce((sum, card) => sum + card.outstandingAmount, 0);
          const totalAvailableCredit = cards.reduce((sum, card) => sum + card.availableCredit, 0);
          const monthlySpend = transactions.reduce((sum, txn) => sum + txn.amount, 0);
          
          return {
            kpis: {
              monthlySpend: monthlySpend,
              totalCreditLimit: totalCreditLimit,
              totalAvailableCredit: totalAvailableCredit,
              totalOutstanding: totalOutstanding
            },
            cards: cards
          };
        });
      };
    }]);
})();
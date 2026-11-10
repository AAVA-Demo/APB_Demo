(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('KPIService', ['CreditCardService', 'TransactionService', '$q', function(CreditCardService, TransactionService, $q) {
      const self = this;
      self.getKPIs = function() {
        return $q.all({
          cards: CreditCardService.fetchCards(),
          monthlySpend: TransactionService.fetchMonthlySpend()
        }).then(function(results) {
          const cards = results.cards;
          const monthlySpend = results.monthlySpend;
          const totalCreditLimit = cards.reduce((sum, card) => sum + card.creditLimit, 0);
          const outstandingAmount = cards.reduce((sum, card) => sum + card.currentBalance, 0);
          const availableCredit = totalCreditLimit - outstandingAmount;
          return {
            monthlySpend: monthlySpend,
            totalCreditLimit: totalCreditLimit,
            availableCredit: availableCredit,
            outstandingAmount: outstandingAmount,
            lastUpdated: new Date()
          };
        });
      };
    }]);
})();
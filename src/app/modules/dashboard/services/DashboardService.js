(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .service('DashboardService', ['CreditCardDataService', 'TransactionProcessingService', '$q', function(CreditCardDataService, TransactionProcessingService, $q) {
      this.getKPIs = function() {
        return $q.all({
          cards: CreditCardDataService.getAllCards(),
          monthlySpend: TransactionProcessingService.getCurrentMonthSpend()
        }).then(function(results) {
          const cards = results.cards;
          const monthlySpend = results.monthlySpend;
          const totalCreditLimit = cards.reduce(function(sum, c) { return sum + c.creditLimit; }, 0);
          const totalOutstanding = cards.reduce(function(sum, c) { return sum + c.currentBalance; }, 0);
          const totalAvailableCredit = cards.reduce(function(sum, c) { return sum + c.availableCredit; }, 0);
          return {
            monthlySpend: monthlySpend,
            totalCreditLimit: totalCreditLimit,
            totalAvailableCredit: totalAvailableCredit,
            totalOutstanding: totalOutstanding,
            cards: cards
          };
        });
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .factory('KPICalculator', [function() {
      return {
        calculateAvailableCredit: function(totalLimit, outstanding) {
          return (totalLimit || 0) - (outstanding || 0);
        },
        aggregateTotals: function(cards) {
          return cards.reduce(function(acc, card) {
            acc.totalCreditLimit += card.creditLimit || 0;
            acc.totalOutstanding += card.outstandingBalance || 0;
            acc.totalMonthlySpend += card.monthlySpend || 0;
            return acc;
          }, { totalCreditLimit: 0, totalOutstanding: 0, totalMonthlySpend: 0 });
        }
      };
    }]);
})();
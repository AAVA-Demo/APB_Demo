(function() {
  'use strict';
  angular.module('creditCardApp').factory('KPIAggregator', [function() {
    return {
      aggregate: function(cards) {
        const totalCreditLimit = cards.reduce((sum, c) => sum + c.creditLimit, 0);
        const totalOutstanding = cards.reduce((sum, c) => sum + c.outstandingAmount, 0);
        const totalAvailableCredit = cards.reduce((sum, c) => sum + c.availableCredit, 0);
        const totalMonthlySpend = cards.reduce((sum, c) => sum + c.monthlySpend, 0);
        return {
          totalCreditLimit: totalCreditLimit,
          totalOutstanding: totalOutstanding,
          totalAvailableCredit: totalAvailableCredit,
          totalMonthlySpend: totalMonthlySpend,
          cards: cards
        };
      }
    };
  }]);
})();
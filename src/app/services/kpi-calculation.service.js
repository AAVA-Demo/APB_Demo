(function() {
  'use strict';
  angular.module('creditCardApp').factory('KPICalculationService', [function() {
    return {
      calculateKPIs: function(cards) {
        if (!cards || cards.length === 0) {
          return { totalCreditLimit: 0, totalAvailableCredit: 0, totalOutstanding: 0, totalMonthlySpend: 0, cardCount: 0 };
        }
        var totalCreditLimit = cards.reduce(function(sum, card) { return sum + (card.creditLimit || 0); }, 0);
        var totalOutstanding = cards.reduce(function(sum, card) { return sum + (card.outstandingAmount || 0); }, 0);
        var totalMonthlySpend = cards.reduce(function(sum, card) { return sum + (card.monthlySpend || 0); }, 0);
        var totalAvailableCredit = cards.reduce(function(sum, card) {
          return sum + ((card.creditLimit || 0) - (card.outstandingAmount || 0));
        }, 0);
        return {
          totalCreditLimit: totalCreditLimit,
          totalAvailableCredit: totalAvailableCredit,
          totalOutstanding: totalOutstanding,
          totalMonthlySpend: totalMonthlySpend,
          cardCount: cards.length
        };
      }
    };
  }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp').factory('KPICalculator', [KPICalculator]);
  function KPICalculator() {
    return {
      calculateKPIs: function(cards) {
        if (!cards || !cards.length) return { totalCreditLimit: 0, totalAvailableCredit: 0, totalOutstanding: 0, monthlySpend: 0 };
        return {
          totalCreditLimit: cards.reduce(function(sum, card) { return sum + (card.creditLimit || 0); }, 0),
          totalAvailableCredit: cards.reduce(function(sum, card) { return sum + (card.availableCredit || 0); }, 0),
          totalOutstanding: cards.reduce(function(sum, card) { return sum + (card.outstandingBalance || 0); }, 0),
          monthlySpend: cards.reduce(function(sum, card) { return sum + (card.monthlySpend || 0); }, 0)
        };
      }
    };
  }
})();
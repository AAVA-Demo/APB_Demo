(function() {
  'use strict';
  angular.module('creditCardApp').service('KpiAggregationService', [function() {
    this.calculateKpis = function(cards, monthlySpend) {
      if (!cards || cards.length === 0) {
        return {
          totalCreditLimit: 0,
          totalAvailableCredit: 0,
          totalOutstanding: 0,
          monthlySpend: monthlySpend || 0,
          cardCount: 0
        };
      }
      const totalCreditLimit = cards.reduce((sum, card) => sum + card.creditLimit, 0);
      const totalAvailableCredit = cards.reduce((sum, card) => sum + card.availableCredit, 0);
      const totalOutstanding = cards.reduce((sum, card) => sum + card.currentBalance, 0);
      return {
        totalCreditLimit: totalCreditLimit,
        totalAvailableCredit: totalAvailableCredit,
        totalOutstanding: totalOutstanding,
        monthlySpend: monthlySpend || 0,
        cardCount: cards.length
      };
    };
  }]);
})();
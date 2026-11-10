(function() {
  'use strict';
  angular.module('dashboardModule').service('KPIAggregationService', [function() {
    this.calculateKPIs = function(cards) {
      const totalCreditLimit = cards.reduce((sum, card) => sum + card.creditLimit, 0);
      const totalAvailableCredit = cards.reduce((sum, card) => sum + card.availableCredit, 0);
      const totalOutstanding = cards.reduce((sum, card) => sum + card.outstandingAmount, 0);
      const totalMonthlySpend = cards.reduce((sum, card) => sum + card.monthlySpend, 0);
      return {
        totalCreditLimit: totalCreditLimit,
        totalAvailableCredit: totalAvailableCredit,
        totalOutstanding: totalOutstanding,
        totalMonthlySpend: totalMonthlySpend,
        cards: cards
      };
    };
  }]);
})();
(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('KPICalculationService', [function() {
      this.calculateKPIs = function(cards, spend) {
        const totalCreditLimit = cards.reduce((sum, card) => sum + (card.creditLimit || 0), 0);
        const totalAvailableCredit = cards.reduce((sum, card) => sum + (card.availableCredit || 0), 0);
        const totalOutstandingAmount = cards.reduce((sum, card) => sum + (card.outstandingAmount || 0), 0);
        const monthlySpendTotal = spend.totalSpend || 0;
        const creditUtilizationPercent = totalCreditLimit > 0 ? ((totalOutstandingAmount / totalCreditLimit) * 100).toFixed(2) : 0;
        return {
          totalCreditLimit: totalCreditLimit,
          totalAvailableCredit: totalAvailableCredit,
          totalOutstandingAmount: totalOutstandingAmount,
          monthlySpendTotal: monthlySpendTotal,
          creditUtilizationPercent: creditUtilizationPercent,
          cardCount: cards.length,
          lastUpdated: new Date()
        };
      };
    }]);
})();
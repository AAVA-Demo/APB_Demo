(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('KpiCalculatorService', [function() {
      this.calculateKpis = function(cards, transactionData) {
        var totalCreditLimit = 0;
        var totalOutstanding = 0;
        var totalAvailableCredit = 0;
        cards.forEach(function(card) {
          totalCreditLimit += card.creditLimit;
          totalOutstanding += card.outstandingAmount;
          totalAvailableCredit += card.availableCredit;
        });
        var utilizationPercentage = totalCreditLimit > 0 ? (totalOutstanding / totalCreditLimit) * 100 : 0;
        return {
          monthlySpend: transactionData.monthlySpend || 0,
          totalCreditLimit: totalCreditLimit,
          totalAvailableCredit: totalAvailableCredit,
          totalOutstanding: totalOutstanding,
          utilizationPercentage: utilizationPercentage,
          cardCount: cards.length
        };
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp').factory('KPICalculatorFactory', [function() {
    return {
      calculateKPIs: function(cards) {
        if (!cards || cards.length === 0) {
          return {
            totalCreditLimit: 0,
            totalAvailableCredit: 0,
            totalOutstanding: 0,
            totalMonthlySpend: 0,
            cardCount: 0
          };
        }
        return cards.reduce(function(kpis, card) {
          kpis.totalCreditLimit += card.creditLimit;
          kpis.totalAvailableCredit += card.availableCredit;
          kpis.totalOutstanding += card.outstandingAmount;
          kpis.totalMonthlySpend += card.monthlySpend;
          kpis.cardCount++;
          return kpis;
        }, {
          totalCreditLimit: 0,
          totalAvailableCredit: 0,
          totalOutstanding: 0,
          totalMonthlySpend: 0,
          cardCount: 0
        });
      }
    };
  }]);
})();
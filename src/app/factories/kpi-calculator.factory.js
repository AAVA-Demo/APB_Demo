(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('KPICalculatorFactory', [function() {
      return {
        calculateKPIs: function(cards) {
          if (!cards || !Array.isArray(cards) || cards.length === 0) {
            return {
              totalCreditLimit: 0,
              totalAvailableCredit: 0,
              totalOutstanding: 0,
              totalMonthlySpend: 0
            };
          }
          return cards.reduce(function(kpi, card) {
            kpi.totalCreditLimit += card.creditLimit || 0;
            kpi.totalAvailableCredit += card.availableCredit || 0;
            kpi.totalOutstanding += card.outstandingAmount || 0;
            kpi.totalMonthlySpend += card.monthlySpend || 0;
            return kpi;
          }, {
            totalCreditLimit: 0,
            totalAvailableCredit: 0,
            totalOutstanding: 0,
            totalMonthlySpend: 0
          });
        }
      };
    }]);
})();
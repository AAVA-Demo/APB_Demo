(function() {
  'use strict';
  angular.module('ccDashboardModule').factory('KpiAggregationUtil', [function() {
    return {
      calculateKpis: function(cards) {
        var kpis = {
          totalCreditLimit: 0,
          totalAvailableCredit: 0,
          totalOutstanding: 0,
          totalMonthlySpend: 0,
          cardCount: cards.length,
          lastUpdated: new Date()
        };
        cards.forEach(function(card) {
          kpis.totalCreditLimit += card.creditLimit;
          kpis.totalAvailableCredit += card.availableCredit;
          kpis.totalOutstanding += card.outstandingAmount;
          kpis.totalMonthlySpend += card.monthlySpend;
        });
        return kpis;
      }
    };
  }]);
})();
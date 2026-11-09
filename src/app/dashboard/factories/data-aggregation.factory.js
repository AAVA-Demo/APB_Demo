(function() {
  'use strict';
  angular.module('dashboardModule')
    .factory('DataAggregationFactory', [DataAggregationFactory]);

  function DataAggregationFactory() {
    var factory = {
      calculateKPIs: calculateKPIs
    };
    return factory;

    function calculateKPIs(cards) {
      if (!cards || cards.length === 0) {
        return {
          totalCreditLimit: 0,
          totalAvailableCredit: 0,
          totalOutstanding: 0,
          monthlySpend: 0,
          creditUtilization: 0
        };
      }

      var kpis = {
        totalCreditLimit: 0,
        totalAvailableCredit: 0,
        totalOutstanding: 0,
        monthlySpend: 0,
        creditUtilization: 0
      };

      cards.forEach(function(card) {
        kpis.totalCreditLimit += card.creditLimit || 0;
        kpis.totalAvailableCredit += card.availableCredit || 0;
        kpis.totalOutstanding += card.outstandingAmount || 0;
        kpis.monthlySpend += card.monthlySpend || 0;
      });

      if (kpis.totalCreditLimit > 0) {
        kpis.creditUtilization = ((kpis.totalCreditLimit - kpis.totalAvailableCredit) / kpis.totalCreditLimit * 100).toFixed(2);
      }

      return kpis;
    }
  }
})();
(function() {
  'use strict';
  angular.module('dashboardModule').service('KpiCalculationService', [function() {
    const self = this;
    self.calculateKpis = function(cards) {
      if (!cards || !cards.length) {
        return {
          monthlySpend: 0,
          totalCreditLimit: 0,
          totalAvailableCredit: 0,
          totalOutstanding: 0
        };
      }
      const kpis = {
        monthlySpend: 0,
        totalCreditLimit: 0,
        totalAvailableCredit: 0,
        totalOutstanding: 0
      };
      cards.forEach(function(card) {
        kpis.totalCreditLimit += card.creditLimit || 0;
        kpis.totalAvailableCredit += card.availableCredit || 0;
        kpis.totalOutstanding += card.outstandingAmount || 0;
      });
      kpis.monthlySpend = kpis.totalOutstanding;
      return kpis;
    };
  }]);
})();
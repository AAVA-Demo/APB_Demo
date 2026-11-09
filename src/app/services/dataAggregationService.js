(function() {
  'use strict';
  angular.module('creditCardApp').service('dataAggregationService', ['kpiCalculationFactory', function(kpiCalculationFactory) {
    this.consolidateKPIs = function(metrics) {
      return {
        monthlySpend: metrics.monthlySpend || 0,
        totalCreditLimit: metrics.totalCreditLimit || 0,
        availableCredit: metrics.availableCredit || 0,
        outstandingAmount: metrics.outstandingAmount || 0,
        lastUpdated: new Date(),
        cards: metrics.cards || []
      };
    };
  }]);
})();
(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .service('KPICalculationService', [function() {
      this.computeAvailableCredit = function(kpiData) {
        if (!kpiData) return null;
        const totalLimit = parseFloat(kpiData.totalCreditLimit) || 0;
        const outstanding = parseFloat(kpiData.outstandingAmount) || 0;
        kpiData.availableCredit = parseFloat((totalLimit - outstanding).toFixed(2));
        kpiData.monthlySpend = parseFloat((kpiData.monthlySpend || 0).toFixed(2));
        kpiData.totalCreditLimit = parseFloat(totalLimit.toFixed(2));
        kpiData.outstandingAmount = parseFloat(outstanding.toFixed(2));
        return kpiData;
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCard.dashboardModule')
    .factory('KPIModel', [function() {
      function KPIModel(data) {
        this.monthlySpend = data.monthlySpend || 0;
        this.totalCreditLimit = data.totalCreditLimit || 0;
        this.availableCredit = data.availableCredit || 0;
        this.outstandingAmount = data.outstandingAmount || 0;
        this.utilizationRate = data.utilizationRate || 0;
        this.lastRefreshed = data.lastRefreshed || new Date();
      }
      KPIModel.prototype.getUtilizationColor = function() {
        if (this.utilizationRate < 30) return 'success';
        if (this.utilizationRate < 70) return 'warning';
        return 'danger';
      };
      return KPIModel;
    }]);
})();
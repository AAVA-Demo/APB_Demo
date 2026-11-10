(function() {
  'use strict';
  angular.module('creditCardApp').factory('KpiModel', [function() {
    function Kpi(data) {
      this.userId = data.userId || '';
      this.monthlySpend = data.monthlySpend || 0;
      this.totalCreditLimit = data.totalCreditLimit || 0;
      this.availableCredit = data.availableCredit || 0;
      this.outstandingAmount = data.outstandingAmount || 0;
      this.lastUpdated = data.lastUpdated || new Date();
      this.cardCount = data.cardCount || 0;
    }
    
    Kpi.prototype.getOverallUtilization = function() {
      return ((this.outstandingAmount / this.totalCreditLimit) * 100).toFixed(2);
    };
    
    return Kpi;
  }]);
})();
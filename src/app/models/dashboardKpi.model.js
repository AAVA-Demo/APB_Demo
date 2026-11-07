(function() {
  'use strict';
  angular.module('ccApp').factory('DashboardKpi', [function() {
    function DashboardKpi(data) {
      this.totalCreditLimit = data.totalCreditLimit || 0;
      this.totalAvailableCredit = data.totalAvailableCredit || 0;
      this.totalOutstanding = data.totalOutstanding || 0;
      this.totalMonthlySpend = data.totalMonthlySpend || 0;
      this.cardCount = data.cardCount || 0;
      this.lastUpdated = data.lastUpdated ? new Date(data.lastUpdated) : new Date();
    }
    return DashboardKpi;
  }]);
})();
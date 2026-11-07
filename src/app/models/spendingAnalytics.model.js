(function() {
  'use strict';
  angular.module('ccApp').factory('SpendingAnalytics', [function() {
    function SpendingAnalytics(data) {
      this.categorySpend = data.categorySpend || [];
      this.monthlyTrend = data.monthlyTrend || [];
      this.cardWiseSpend = data.cardWiseSpend || [];
      this.totalSpend = data.totalSpend || 0;
      this.periodStart = data.periodStart ? new Date(data.periodStart) : null;
      this.periodEnd = data.periodEnd ? new Date(data.periodEnd) : null;
    }
    return SpendingAnalytics;
  }]);
})();
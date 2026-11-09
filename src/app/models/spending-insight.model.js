(function() {
  'use strict';
  angular.module('app.analytics')
    .factory('SpendingInsightModel', [function() {
      function SpendingInsightModel(data) {
        this.categorySpending = data.categorySpending || [];
        this.monthlyTrends = data.monthlyTrends || [];
        this.totalSpend = data.totalSpend || 0;
        this.period = data.period || '';
      }
      return SpendingInsightModel;
    }]);
})();
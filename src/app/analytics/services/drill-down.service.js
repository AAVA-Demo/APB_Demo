(function() {
  'use strict';
  angular.module('analytics')
    .service('DrillDownService', ['AnalyticsService', function(AnalyticsService) {
      var self = this;
      self.getFilteredData = function(category, month, allTransactions) {
        return allTransactions.filter(function(txn) {
          var matchCategory = !category || txn.category === category;
          var matchMonth = !month || new Date(txn.date).toISOString().substring(0, 7) === month;
          return matchCategory && matchMonth;
        });
      };
    }]);
})();
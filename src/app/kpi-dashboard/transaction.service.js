(function() {
  'use strict';
  angular.module('kpiDashboardModule')
    .factory('TransactionService', ['$http', '$q', function($http, $q) {
      var mockSummary = {
        userId: 'user-001',
        currentMonthSpend: 4250,
        totalOutstanding: 7500
      };
      return {
        getTransactionSummary: function() {
          return $q.resolve(mockSummary);
        }
      };
    }]);
})();
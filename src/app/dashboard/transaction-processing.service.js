(function() {
  'use strict';
  angular.module('dashboardModule')
    .factory('TransactionProcessingService', ['$http', '$q', 'UserService', function($http, $q, UserService) {
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
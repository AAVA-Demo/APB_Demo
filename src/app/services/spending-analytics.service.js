(function() {
  'use strict';
  angular.module('cardManagement')
    .service('SpendingAnalyticsService', ['$http', '$q', function($http, $q) {
      this.getCardSpending = function(cardId) {
        var mockSpending = {
          cardId: cardId,
          monthlySpend: Math.floor(Math.random() * 3000) + 500,
          lastTransactionDate: new Date().toISOString(),
          transactionCount: Math.floor(Math.random() * 50) + 10
        };
        return $q.resolve(mockSpending);
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('portfolioManagementModule')
    .factory('TransactionService', ['$http', '$q', function($http, $q) {
      var mockSpending = {
        'card-001': { cardId: 'card-001', monthlySpend: 1500, yearlySpend: 18000 },
        'card-002': { cardId: 'card-002', monthlySpend: 2000, yearlySpend: 24000 },
        'card-003': { cardId: 'card-003', monthlySpend: 750, yearlySpend: 9000 }
      };
      return {
        getCardSpending: function(cardId) {
          return $q.resolve(mockSpending[cardId] || {});
        }
      };
    }]);
})();
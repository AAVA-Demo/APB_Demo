(function() {
  'use strict';
  angular.module('cardManagementModule')
    .factory('SpendingCalculationService', ['$q', function($q) {
      var mockSpending = {
        'card-001': { cardId: 'card-001', monthlySpend: 1500, yearlySpend: 18000, lastTransactionDate: new Date('2026-11-05'), transactionCount: 45 },
        'card-002': { cardId: 'card-002', monthlySpend: 2000, yearlySpend: 24000, lastTransactionDate: new Date('2026-11-08'), transactionCount: 60 },
        'card-003': { cardId: 'card-003', monthlySpend: 750, yearlySpend: 9000, lastTransactionDate: new Date('2026-11-07'), transactionCount: 30 }
      };
      return {
        calculateSpending: function(cardId) {
          return $q.resolve(mockSpending[cardId] || { monthlySpend: 0, yearlySpend: 0, transactionCount: 0 });
        }
      };
    }]);
})();
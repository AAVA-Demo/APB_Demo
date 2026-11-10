(function() {
  'use strict';
  angular.module('analyticsModule').service('CategorizationService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
    this.getCategorizedTransactions = function(dateRange) {
      const deferred = $q.defer();
      const mockTransactions = [
        { cardId: 'CC001', category: 'Food & Dining', amount: 8500, month: '2024-01' },
        { cardId: 'CC001', category: 'Fuel', amount: 3200, month: '2024-01' },
        { cardId: 'CC001', category: 'Shopping', amount: 12000, month: '2024-01' },
        { cardId: 'CC002', category: 'Travel', amount: 5400, month: '2024-01' },
        { cardId: 'CC002', category: 'Entertainment', amount: 2100, month: '2024-01' },
        { cardId: 'CC002', category: 'Food & Dining', amount: 6800, month: '2024-01' },
        { cardId: 'CC003', category: 'Healthcare', amount: 4500, month: '2024-01' },
        { cardId: 'CC003', category: 'Utilities', amount: 3800, month: '2024-01' },
        { cardId: 'CC003', category: 'Education', amount: 7200, month: '2024-01' },
        { cardId: 'CC001', category: 'Miscellaneous', amount: 1800, month: '2024-01' },
        { cardId: 'CC001', category: 'Food & Dining', amount: 7200, month: '2023-12' },
        { cardId: 'CC002', category: 'Shopping', amount: 15000, month: '2023-12' },
        { cardId: 'CC003', category: 'Travel', amount: 22000, month: '2023-12' },
        { cardId: 'CC001', category: 'Entertainment', amount: 3500, month: '2023-12' },
        { cardId: 'CC002', category: 'Fuel', amount: 4100, month: '2023-12' },
        { cardId: 'CC003', category: 'Healthcare', amount: 5200, month: '2023-12' },
        { cardId: 'CC001', category: 'Food & Dining', amount: 6500, month: '2023-11' },
        { cardId: 'CC002', category: 'Shopping', amount: 9800, month: '2023-11' },
        { cardId: 'CC003', category: 'Utilities', amount: 3200, month: '2023-11' },
        { cardId: 'CC001', category: 'Education', amount: 8500, month: '2023-11' }
      ];
      deferred.resolve(mockTransactions);
      return deferred.promise;
    };
  }]);
})();
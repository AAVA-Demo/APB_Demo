(function() {
  'use strict';
  angular.module('cardManagement.module')
    .service('TransactionService', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
      const transactionCache = {};
      this.getTransactions = function(cardId) {
        if (transactionCache[cardId]) {
          return $q.resolve(transactionCache[cardId]);
        }
        const mockTransactions = [
          {
            transactionId: 'txn_001',
            cardId: cardId,
            amount: 125.50,
            category: 'Food & Dining',
            merchant: 'Restaurant ABC',
            transactionDate: new Date(Date.now() - 86400000).toISOString(),
            description: 'Dinner with family'
          },
          {
            transactionId: 'txn_002',
            cardId: cardId,
            amount: 65.00,
            category: 'Fuel',
            merchant: 'Gas Station XYZ',
            transactionDate: new Date(Date.now() - 172800000).toISOString(),
            description: 'Fuel refill'
          },
          {
            transactionId: 'txn_003',
            cardId: cardId,
            amount: 299.99,
            category: 'Shopping',
            merchant: 'Online Store',
            transactionDate: new Date(Date.now() - 259200000).toISOString(),
            description: 'Electronics purchase'
          },
          {
            transactionId: 'txn_004',
            cardId: cardId,
            amount: 45.00,
            category: 'Entertainment',
            merchant: 'Movie Theater',
            transactionDate: new Date(Date.now() - 345600000).toISOString(),
            description: 'Movie tickets'
          },
          {
            transactionId: 'txn_005',
            cardId: cardId,
            amount: 180.00,
            category: 'Utilities',
            merchant: 'Electric Company',
            transactionDate: new Date(Date.now() - 432000000).toISOString(),
            description: 'Monthly electricity bill'
          }
        ];
        transactionCache[cardId] = mockTransactions;
        return $q.resolve(mockTransactions);
      };
      this.clearCache = function() {
        for (let key in transactionCache) {
          delete transactionCache[key];
        }
      };
    }]);
})();
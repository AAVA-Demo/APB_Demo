(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionDataFactory', ['$q', function($q) {
      const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      const mockTransactions = [];
      for (let i = 0; i < 100; i++) {
        mockTransactions.push({
          id: 'TXN' + (1000 + i),
          cardId: 'CC00' + (Math.floor(Math.random() * 3) + 1),
          amount: Math.floor(Math.random() * 500) + 10,
          date: new Date(2024, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1),
          merchant: 'Merchant ' + i,
          category: categories[Math.floor(Math.random() * categories.length)],
          description: 'Transaction ' + i
        });
      }
      return {
        getTransactions: function(cardId, dateRange) {
          let filtered = mockTransactions;
          if (cardId) {
            filtered = filtered.filter(t => t.cardId === cardId);
          }
          return $q.resolve(filtered);
        }
      };
    }]);
})();
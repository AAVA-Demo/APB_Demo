(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionFactory', ['$http', '$q', function($http, $q) {
      return {
        fetchTransactions: function() {
          return $http.get('/api/transactions')
            .then(function(response) {
              return response.data || generateMockTransactions();
            })
            .catch(function(error) {
              console.warn('API call failed, using mock data', error);
              return generateMockTransactions();
            });
        }
      };
      function generateMockTransactions() {
        var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        var cardIds = ['card-001', 'card-002', 'card-003'];
        var transactions = [];
        var txnId = 2000;
        for (var i = 0; i < 50; i++) {
          var date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 180));
          transactions.push({
            id: 'txn-' + (txnId++),
            cardId: cardIds[Math.floor(Math.random() * cardIds.length)],
            amount: Math.round((Math.random() * 500 + 10) * 100) / 100,
            date: date.toISOString(),
            merchantName: 'Merchant ' + Math.floor(Math.random() * 100),
            category: categories[Math.floor(Math.random() * categories.length)],
            description: 'Transaction description'
          });
        }
        return transactions;
      }
    }]);
})();
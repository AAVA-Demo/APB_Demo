(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionDataFactory', ['$http', '$q', function($http, $q) {
      return {
        fetchTransactions: function(cardIds) {
          var url = '/api/transactions?cardIds=' + cardIds.join(',');
          return $http.get(url)
            .then(function(response) {
              return response.data || generateMockTransactions(cardIds);
            })
            .catch(function(error) {
              console.warn('API call failed, using mock data', error);
              return generateMockTransactions(cardIds);
            });
        }
      };
      function generateMockTransactions(cardIds) {
        var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        var merchants = ['Amazon', 'Walmart', 'Shell Gas', 'Starbucks', 'Netflix', 'Uber', 'Target', 'Whole Foods', 'CVS Pharmacy', 'Delta Airlines'];
        var statuses = ['Posted', 'Pending'];
        var transactions = [];
        var txnId = 1000;
        cardIds.forEach(function(cardId) {
          for (var i = 0; i < 15; i++) {
            var date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 90));
            transactions.push({
              transactionId: 'txn-' + (txnId++),
              cardId: cardId,
              cardNumber: getCardNumber(cardId),
              amount: Math.round((Math.random() * 500 + 10) * 100) / 100,
              transactionDate: date.toISOString(),
              merchantName: merchants[Math.floor(Math.random() * merchants.length)],
              category: categories[Math.floor(Math.random() * categories.length)],
              status: statuses[Math.floor(Math.random() * statuses.length)],
              description: 'Purchase at merchant location'
            });
          }
        });
        return transactions;
      }
      function getCardNumber(cardId) {
        var map = {
          'card-001': '**** **** **** 1234',
          'card-002': '**** **** **** 5678',
          'card-003': '**** **** **** 9012'
        };
        return map[cardId] || '**** **** **** XXXX';
      }
    }]);
})();
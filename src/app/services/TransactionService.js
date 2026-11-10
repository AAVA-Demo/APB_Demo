(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionService', ['ApiGatewayService', '$q', function(ApiGatewayService, $q) {
      var mockTransactions = [
        { transactionId: 'txn1', cardId: 'card1', amount: 1500, category: 'Food & Dining', merchantName: 'Restaurant ABC', transactionDate: '2024-06-01', description: 'Dinner' },
        { transactionId: 'txn2', cardId: 'card1', amount: 800, category: 'Fuel', merchantName: 'Gas Station XYZ', transactionDate: '2024-06-03', description: 'Fuel' },
        { transactionId: 'txn3', cardId: 'card1', amount: 2500, category: 'Shopping', merchantName: 'Mall Store', transactionDate: '2024-06-05', description: 'Clothing' },
        { transactionId: 'txn4', cardId: 'card1', amount: 3000, category: 'Travel', merchantName: 'Airline', transactionDate: '2024-06-07', description: 'Flight tickets' },
        { transactionId: 'txn5', cardId: 'card1', amount: 500, category: 'Entertainment', merchantName: 'Cinema', transactionDate: '2024-06-09', description: 'Movie tickets' },
        { transactionId: 'txn6', cardId: 'card2', amount: 1200, category: 'Utilities', merchantName: 'Electric Company', transactionDate: '2024-06-02', description: 'Electricity bill' },
        { transactionId: 'txn7', cardId: 'card2', amount: 2000, category: 'Healthcare', merchantName: 'Hospital', transactionDate: '2024-06-04', description: 'Medical checkup' },
        { transactionId: 'txn8', cardId: 'card2', amount: 1500, category: 'Education', merchantName: 'Online Course', transactionDate: '2024-06-06', description: 'Course fee' },
        { transactionId: 'txn9', cardId: 'card3', amount: 800, category: 'Miscellaneous', merchantName: 'General Store', transactionDate: '2024-06-08', description: 'Misc items' },
        { transactionId: 'txn10', cardId: 'card3', amount: 2200, category: 'Food & Dining', merchantName: 'Fine Dining', transactionDate: '2024-06-10', description: 'Special dinner' }
      ];
      return {
        getTransactions: function(cardId, dateRange) {
          var deferred = $q.defer();
          setTimeout(function() {
            var filtered = cardId ? mockTransactions.filter(function(t) { return t.cardId === cardId; }) : mockTransactions;
            deferred.resolve(filtered);
          }, 600);
          return deferred.promise;
        }
      };
    }]);
})();
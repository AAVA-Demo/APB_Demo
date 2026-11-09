(function() {
  'use strict';
  angular.module('creditCard.portfolio')
    .service('TransactionService', ['$http', '$q', function($http, $q) {
      this.getTransactionsByCard = function(cardId) {
        var deferred = $q.defer();
        var mockTransactions = {
          'card1': [
            { transactionId: 'txn1', cardId: 'card1', amount: 2500, category: 'Food & Dining', merchantName: 'Restaurant ABC', transactionDate: new Date().toISOString(), description: 'Dinner' },
            { transactionId: 'txn2', cardId: 'card1', amount: 1500, category: 'Fuel', merchantName: 'Gas Station XYZ', transactionDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), description: 'Fuel' },
            { transactionId: 'txn3', cardId: 'card1', amount: 3000, category: 'Shopping', merchantName: 'Online Store', transactionDate: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(), description: 'Electronics' }
          ],
          'card2': [
            { transactionId: 'txn4', cardId: 'card2', amount: 5000, category: 'Shopping', merchantName: 'Mall Store', transactionDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), description: 'Clothing' },
            { transactionId: 'txn5', cardId: 'card2', amount: 2000, category: 'Entertainment', merchantName: 'Cinema', transactionDate: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(), description: 'Movie tickets' }
          ],
          'card3': [
            { transactionId: 'txn6', cardId: 'card3', amount: 8000, category: 'Travel', merchantName: 'Airline', transactionDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(), description: 'Flight booking' },
            { transactionId: 'txn7', cardId: 'card3', amount: 4000, category: 'Travel', merchantName: 'Hotel', transactionDate: new Date(new Date().setDate(new Date().getDate() - 28)).toISOString(), description: 'Hotel stay' }
          ],
          'card4': [
            { transactionId: 'txn8', cardId: 'card4', amount: 1200, category: 'Utilities', merchantName: 'Electric Company', transactionDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(), description: 'Electricity bill' },
            { transactionId: 'txn9', cardId: 'card4', amount: 800, category: 'Healthcare', merchantName: 'Pharmacy', transactionDate: new Date(new Date().setDate(new Date().getDate() - 12)).toISOString(), description: 'Medicines' }
          ],
          'card5': [
            { transactionId: 'txn10', cardId: 'card5', amount: 6000, category: 'Education', merchantName: 'Online Course', transactionDate: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString(), description: 'Course fee' },
            { transactionId: 'txn11', cardId: 'card5', amount: 3500, category: 'Miscellaneous', merchantName: 'General Store', transactionDate: new Date(new Date().setDate(new Date().getDate() - 18)).toISOString(), description: 'Household items' }
          ]
        };
        setTimeout(function() {
          deferred.resolve(mockTransactions[cardId] || []);
        }, 300);
        return deferred.promise;
      };
    }]);
})();
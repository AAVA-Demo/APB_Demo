(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionDatabaseFactory', ['$q', '$timeout', function($q, $timeout) {
      var mockTransactions = [
        {transactionId: 't1', cardId: 'card1', amount: 150, date: new Date('2024-01-15'), description: 'Grocery Store', category: 'Food & Dining', status: 'posted'},
        {transactionId: 't2', cardId: 'card1', amount: 80, date: new Date('2024-01-18'), description: 'Gas Station', category: 'Fuel', status: 'posted'},
        {transactionId: 't3', cardId: 'card2', amount: 200, date: new Date('2024-01-20'), description: 'Online Shopping', category: 'Shopping', status: 'posted'},
        {transactionId: 't4', cardId: 'card2', amount: 500, date: new Date('2024-01-22'), description: 'Flight Booking', category: 'Travel', status: 'posted'},
        {transactionId: 't5', cardId: 'card3', amount: 100, date: new Date('2024-01-25'), description: 'Movie Tickets', category: 'Entertainment', status: 'posted'},
        {transactionId: 't6', cardId: 'card1', amount: 120, date: new Date('2024-01-28'), description: 'Electric Bill', category: 'Utilities', status: 'pending'},
        {transactionId: 't7', cardId: 'card2', amount: 300, date: new Date('2023-12-10'), description: 'Restaurant', category: 'Food & Dining', status: 'posted'},
        {transactionId: 't8', cardId: 'card3', amount: 450, date: new Date('2023-11-15'), description: 'Hotel', category: 'Travel', status: 'posted'}
      ];
      return {
        getRecentTransactions: function(cardId) {
          var deferred = $q.defer();
          $timeout(function() {
            var filtered = mockTransactions.filter(function(t) { return t.cardId === cardId; }).slice(0, 5);
            deferred.resolve(filtered);
          }, 100);
          return deferred.promise;
        },
        getFullTransactionHistory: function(cardId) {
          var deferred = $q.defer();
          $timeout(function() {
            var filtered = mockTransactions.filter(function(t) { return t.cardId === cardId; });
            deferred.resolve(filtered);
          }, 100);
          return deferred.promise;
        }
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionFactory', ['$http', '$q', function($http, $q) {
      var mockMonthlySpend = {
        currentMonthSpend: 8500,
        month: 'November 2026',
        year: 2026
      };
      var mockTransactions = [
        { transactionId: 'txn1', cardId: 'card1234', amount: 1200, category: 'Food & Dining', date: '2026-11-01', description: 'Restaurant' },
        { transactionId: 'txn2', cardId: 'card1234', amount: 800, category: 'Fuel', date: '2026-11-05', description: 'Gas Station' },
        { transactionId: 'txn3', cardId: 'card5678', amount: 2500, category: 'Shopping', date: '2026-11-10', description: 'Electronics' },
        { transactionId: 'txn4', cardId: 'card5678', amount: 1500, category: 'Travel', date: '2026-11-15', description: 'Flight Booking' },
        { transactionId: 'txn5', cardId: 'card9012', amount: 600, category: 'Entertainment', date: '2026-11-20', description: 'Movie Tickets' },
        { transactionId: 'txn6', cardId: 'card1234', amount: 900, category: 'Utilities', date: '2026-10-01', description: 'Electric Bill' },
        { transactionId: 'txn7', cardId: 'card5678', amount: 400, category: 'Healthcare', date: '2026-10-10', description: 'Pharmacy' },
        { transactionId: 'txn8', cardId: 'card9012', amount: 1100, category: 'Education', date: '2026-10-15', description: 'Online Course' },
        { transactionId: 'txn9', cardId: 'card1234', amount: 300, category: 'Miscellaneous', date: '2026-09-05', description: 'Misc Purchase' },
        { transactionId: 'txn10', cardId: 'card5678', amount: 700, category: 'Food & Dining', date: '2026-09-12', description: 'Cafe' }
      ];
      return {
        getMonthlySpend: function() {
          return $q.resolve(mockMonthlySpend);
        },
        getTransactions: function(startDate, endDate) {
          return $q.resolve(mockTransactions);
        }
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TransactionApiService', ['$http', '$q', function($http, $q) {
      var mockTransactions = [
        { transactionId: 'txn001', cardId: 'card001', amount: 150, category: 'Food & Dining', date: new Date(2024, 10, 15), description: 'Restaurant', merchantName: 'Italian Bistro', status: 'Posted' },
        { transactionId: 'txn002', cardId: 'card001', amount: 80, category: 'Fuel', date: new Date(2024, 10, 20), description: 'Gas Station', merchantName: 'Shell', status: 'Posted' },
        { transactionId: 'txn003', cardId: 'card001', amount: 200, category: 'Shopping', date: new Date(2024, 10, 22), description: 'Online Shopping', merchantName: 'Amazon', status: 'Pending' },
        { transactionId: 'txn004', cardId: 'card002', amount: 500, category: 'Travel', date: new Date(2024, 10, 10), description: 'Flight Booking', merchantName: 'Airlines', status: 'Posted' },
        { transactionId: 'txn005', cardId: 'card002', amount: 100, category: 'Entertainment', date: new Date(2024, 10, 18), description: 'Movie Tickets', merchantName: 'Cinema', status: 'Posted' },
        { transactionId: 'txn006', cardId: 'card003', amount: 300, category: 'Healthcare', date: new Date(2024, 10, 5), description: 'Medical Checkup', merchantName: 'Hospital', status: 'Posted' },
        { transactionId: 'txn007', cardId: 'card003', amount: 250, category: 'Utilities', date: new Date(2024, 10, 12), description: 'Electricity Bill', merchantName: 'Utility Co', status: 'Posted' },
        { transactionId: 'txn008', cardId: 'card003', amount: 400, category: 'Education', date: new Date(2024, 9, 28), description: 'Course Fee', merchantName: 'University', status: 'Posted' },
        { transactionId: 'txn009', cardId: 'card001', amount: 120, category: 'Food & Dining', date: new Date(2024, 9, 25), description: 'Cafe', merchantName: 'Starbucks', status: 'Posted' },
        { transactionId: 'txn010', cardId: 'card002', amount: 90, category: 'Fuel', date: new Date(2024, 9, 20), description: 'Gas Station', merchantName: 'BP', status: 'Posted' },
        { transactionId: 'txn011', cardId: 'card003', amount: 600, category: 'Shopping', date: new Date(2024, 8, 15), description: 'Electronics', merchantName: 'Best Buy', status: 'Posted' },
        { transactionId: 'txn012', cardId: 'card001', amount: 75, category: 'Entertainment', date: new Date(2024, 8, 10), description: 'Concert', merchantName: 'Arena', status: 'Posted' },
        { transactionId: 'txn013', cardId: 'card002', amount: 180, category: 'Miscellaneous', date: new Date(2024, 7, 28), description: 'Miscellaneous', merchantName: 'Store', status: 'Posted' }
      ];
      this.fetchTransactions = function(userId, startDate, endDate, cardId) {
        var filtered = mockTransactions;
        if (cardId) {
          filtered = filtered.filter(function(txn) { return txn.cardId === cardId; });
        }
        if (startDate) {
          filtered = filtered.filter(function(txn) { return new Date(txn.date) >= new Date(startDate); });
        }
        if (endDate) {
          filtered = filtered.filter(function(txn) { return new Date(txn.date) <= new Date(endDate); });
        }
        return $q.resolve(filtered);
      };
    }]);
})();
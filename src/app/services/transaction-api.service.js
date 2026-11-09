(function() {
  'use strict';
  angular.module('creditCardApp').service('TransactionApiService', ['$http', '$q', function($http, $q) {
    const BASE_URL = '/api/transactions';
    this.fetchTransactions = function(cardId) {
      const mockTransactions = [
        {transactionId: 'T001', cardId: 'CC001', amount: 1200, category: 'Food & Dining', description: 'Restaurant', timestamp: new Date('2024-01-15'), merchantName: 'The Gourmet Cafe'},
        {transactionId: 'T002', cardId: 'CC001', amount: 800, category: 'Fuel', description: 'Gas Station', timestamp: new Date('2024-01-18'), merchantName: 'Shell'},
        {transactionId: 'T003', cardId: 'CC001', amount: 3500, category: 'Shopping', description: 'Electronics', timestamp: new Date('2024-01-20'), merchantName: 'Best Buy'},
        {transactionId: 'T004', cardId: 'CC002', amount: 2500, category: 'Travel', description: 'Flight Booking', timestamp: new Date('2024-01-10'), merchantName: 'Airline'},
        {transactionId: 'T005', cardId: 'CC002', amount: 600, category: 'Entertainment', description: 'Movie Tickets', timestamp: new Date('2024-01-22'), merchantName: 'Cinema'},
        {transactionId: 'T006', cardId: 'CC003', amount: 1500, category: 'Utilities', description: 'Electricity Bill', timestamp: new Date('2024-01-05'), merchantName: 'Power Company'},
        {transactionId: 'T007', cardId: 'CC003', amount: 4500, category: 'Healthcare', description: 'Medical Checkup', timestamp: new Date('2024-01-12'), merchantName: 'City Hospital'},
        {transactionId: 'T008', cardId: 'CC003', amount: 8000, category: 'Education', description: 'Course Fee', timestamp: new Date('2024-01-25'), merchantName: 'Online Academy'},
        {transactionId: 'T009', cardId: 'CC001', amount: 450, category: 'Miscellaneous', description: 'Subscription', timestamp: new Date('2024-01-28'), merchantName: 'Streaming Service'},
        {transactionId: 'T010', cardId: 'CC002', amount: 950, category: 'Food & Dining', description: 'Grocery', timestamp: new Date('2024-02-02'), merchantName: 'Supermarket'}
      ];
      if (cardId) {
        return $q.resolve(mockTransactions.filter(t => t.cardId === cardId));
      }
      return $q.resolve(mockTransactions);
    };
  }]);
})();
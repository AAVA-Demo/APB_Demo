(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionDataFactory', ['$http', '$q', TransactionDataFactory]);
  function TransactionDataFactory($http, $q) {
    var factory = {
      fetchTransactions: fetchTransactions
    };
    return factory;
    function fetchTransactions() {
      var mockData = [
        {transactionId: 'T001', cardId: 'CC001', date: '2024-01-15', merchant: 'Grocery Store', amount: 2500, category: 'Food & Dining', description: 'Weekly groceries', status: 'Completed'},
        {transactionId: 'T002', cardId: 'CC001', date: '2024-01-18', merchant: 'Gas Station', amount: 1200, category: 'Fuel', description: 'Fuel refill', status: 'Completed'},
        {transactionId: 'T003', cardId: 'CC002', date: '2024-01-20', merchant: 'Amazon', amount: 4500, category: 'Shopping', description: 'Electronics', status: 'Completed'},
        {transactionId: 'T004', cardId: 'CC003', date: '2024-01-22', merchant: 'Flight Booking', amount: 8000, category: 'Travel', description: 'Flight tickets', status: 'Completed'},
        {transactionId: 'T005', cardId: 'CC001', date: '2024-01-25', merchant: 'Movie Theater', amount: 800, category: 'Entertainment', description: 'Movie tickets', status: 'Completed'},
        {transactionId: 'T006', cardId: 'CC002', date: '2024-01-28', merchant: 'Electric Bill', amount: 1500, category: 'Utilities', description: 'Monthly bill', status: 'Completed'},
        {transactionId: 'T007', cardId: 'CC003', date: '2024-02-02', merchant: 'Hospital', amount: 3000, category: 'Healthcare', description: 'Medical checkup', status: 'Completed'},
        {transactionId: 'T008', cardId: 'CC001', date: '2024-02-05', merchant: 'Online Course', amount: 2000, category: 'Education', description: 'Course fee', status: 'Completed'},
        {transactionId: 'T009', cardId: 'CC002', date: '2024-02-10', merchant: 'Restaurant', amount: 1800, category: 'Food & Dining', description: 'Dinner', status: 'Completed'},
        {transactionId: 'T010', cardId: 'CC003', date: '2024-02-12', merchant: 'Miscellaneous', amount: 500, category: 'Miscellaneous', description: 'Other expenses', status: 'Completed'},
        {transactionId: 'T011', cardId: 'CC001', date: '2024-02-15', merchant: 'Grocery Store', amount: 2800, category: 'Food & Dining', description: 'Weekly groceries', status: 'Completed'},
        {transactionId: 'T012', cardId: 'CC002', date: '2024-02-18', merchant: 'Gas Station', amount: 1300, category: 'Fuel', description: 'Fuel refill', status: 'Completed'},
        {transactionId: 'T013', cardId: 'CC003', date: '2024-02-20', merchant: 'Flipkart', amount: 5000, category: 'Shopping', description: 'Clothing', status: 'Completed'},
        {transactionId: 'T014', cardId: 'CC001', date: '2024-03-01', merchant: 'Hotel Booking', amount: 6000, category: 'Travel', description: 'Hotel stay', status: 'Completed'},
        {transactionId: 'T015', cardId: 'CC002', date: '2024-03-05', merchant: 'Concert', amount: 1500, category: 'Entertainment', description: 'Concert tickets', status: 'Completed'}
      ];
      return $q.resolve(mockData);
    }
  }
})();
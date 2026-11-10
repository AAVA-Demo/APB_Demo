(function() {
  'use strict';
  angular.module('creditCardApp.analytics')
    .factory('TransactionService', ['$q', 'TransactionFactory', function($q, TransactionFactory) {
      var cache = null;
      function getTransactions() {
        if (cache) {
          return $q.resolve(cache);
        }
        var mockData = [
          {transactionId: 't001', cardId: 'card001', merchantName: 'Restaurant ABC', merchantCategory: 'food', amount: 45.50, currency: 'USD', transactionDate: new Date('2024-01-15'), description: 'Dinner'},
          {transactionId: 't002', cardId: 'card001', merchantName: 'Gas Station XYZ', merchantCategory: 'fuel', amount: 60.00, currency: 'USD', transactionDate: new Date('2024-01-16'), description: 'Fuel'},
          {transactionId: 't003', cardId: 'card002', merchantName: 'Online Store', merchantCategory: 'shopping', amount: 120.00, currency: 'USD', transactionDate: new Date('2024-01-17'), description: 'Electronics'},
          {transactionId: 't004', cardId: 'card001', merchantName: 'Airline Booking', merchantCategory: 'travel', amount: 450.00, currency: 'USD', transactionDate: new Date('2024-01-18'), description: 'Flight ticket'},
          {transactionId: 't005', cardId: 'card003', merchantName: 'Cinema', merchantCategory: 'entertainment', amount: 35.00, currency: 'USD', transactionDate: new Date('2024-01-19'), description: 'Movie tickets'},
          {transactionId: 't006', cardId: 'card002', merchantName: 'Electric Company', merchantCategory: 'utilities', amount: 85.00, currency: 'USD', transactionDate: new Date('2024-01-20'), description: 'Electricity bill'},
          {transactionId: 't007', cardId: 'card003', merchantName: 'Pharmacy', merchantCategory: 'healthcare', amount: 25.00, currency: 'USD', transactionDate: new Date('2024-01-21'), description: 'Medicines'},
          {transactionId: 't008', cardId: 'card001', merchantName: 'University', merchantCategory: 'education', amount: 500.00, currency: 'USD', transactionDate: new Date('2024-01-22'), description: 'Course fee'},
          {transactionId: 't009', cardId: 'card002', merchantName: 'Coffee Shop', merchantCategory: 'food', amount: 12.50, currency: 'USD', transactionDate: new Date('2024-02-01'), description: 'Coffee'},
          {transactionId: 't010', cardId: 'card003', merchantName: 'Grocery Store', merchantCategory: 'shopping', amount: 95.00, currency: 'USD', transactionDate: new Date('2024-02-02'), description: 'Groceries'},
          {transactionId: 't011', cardId: 'card001', merchantName: 'Hotel Booking', merchantCategory: 'travel', amount: 350.00, currency: 'USD', transactionDate: new Date('2024-02-05'), description: 'Hotel stay'},
          {transactionId: 't012', cardId: 'card002', merchantName: 'Streaming Service', merchantCategory: 'entertainment', amount: 15.99, currency: 'USD', transactionDate: new Date('2024-02-10'), description: 'Subscription'},
          {transactionId: 't013', cardId: 'card003', merchantName: 'Water Bill', merchantCategory: 'utilities', amount: 40.00, currency: 'USD', transactionDate: new Date('2024-02-12'), description: 'Water bill'},
          {transactionId: 't014', cardId: 'card001', merchantName: 'Dentist', merchantCategory: 'healthcare', amount: 150.00, currency: 'USD', transactionDate: new Date('2024-02-15'), description: 'Dental checkup'},
          {transactionId: 't015', cardId: 'card002', merchantName: 'Bookstore', merchantCategory: 'education', amount: 75.00, currency: 'USD', transactionDate: new Date('2024-02-18'), description: 'Books'},
          {transactionId: 't016', cardId: 'card003', merchantName: 'Restaurant DEF', merchantCategory: 'food', amount: 65.00, currency: 'USD', transactionDate: new Date('2024-03-01'), description: 'Lunch'},
          {transactionId: 't017', cardId: 'card001', merchantName: 'Gas Station ABC', merchantCategory: 'fuel', amount: 55.00, currency: 'USD', transactionDate: new Date('2024-03-03'), description: 'Fuel'},
          {transactionId: 't018', cardId: 'card002', merchantName: 'Fashion Store', merchantCategory: 'shopping', amount: 200.00, currency: 'USD', transactionDate: new Date('2024-03-05'), description: 'Clothing'},
          {transactionId: 't019', cardId: 'card003', merchantName: 'Concert Tickets', merchantCategory: 'entertainment', amount: 120.00, currency: 'USD', transactionDate: new Date('2024-03-08'), description: 'Concert'},
          {transactionId: 't020', cardId: 'card001', merchantName: 'Miscellaneous', merchantCategory: 'miscellaneous', amount: 30.00, currency: 'USD', transactionDate: new Date('2024-03-10'), description: 'Other expenses'}
        ];
        var transactions = mockData.map(function(data) {
          return TransactionFactory.create(data);
        });
        cache = transactions;
        return $q.resolve(transactions);
      }
      return {
        getTransactions: getTransactions
      };
    }]);
})();
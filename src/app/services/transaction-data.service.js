(function() {
  'use strict';
  angular.module('creditCardApp').service('TransactionDataService', ['$http', '$q', function($http, $q) {
    var service = this;
    var mockTransactions = [
      {transactionId: 't1', cardId: 'c1', amount: 150, category: 'Food & Dining', merchantName: 'Restaurant A', transactionDate: new Date('2024-01-15'), description: 'Dinner'},
      {transactionId: 't2', cardId: 'c1', amount: 80, category: 'Fuel', merchantName: 'Gas Station B', transactionDate: new Date('2024-01-20'), description: 'Fuel'},
      {transactionId: 't3', cardId: 'c2', amount: 300, category: 'Shopping', merchantName: 'Store C', transactionDate: new Date('2024-01-25'), description: 'Clothing'},
      {transactionId: 't4', cardId: 'c2', amount: 500, category: 'Travel', merchantName: 'Airline D', transactionDate: new Date('2024-02-10'), description: 'Flight'},
      {transactionId: 't5', cardId: 'c1', amount: 120, category: 'Entertainment', merchantName: 'Cinema E', transactionDate: new Date('2024-02-14'), description: 'Movie'},
      {transactionId: 't6', cardId: 'c2', amount: 200, category: 'Utilities', merchantName: 'Utility F', transactionDate: new Date('2024-03-05'), description: 'Electric Bill'},
      {transactionId: 't7', cardId: 'c1', amount: 250, category: 'Healthcare', merchantName: 'Clinic G', transactionDate: new Date('2024-03-12'), description: 'Medical'},
      {transactionId: 't8', cardId: 'c2', amount: 400, category: 'Education', merchantName: 'University H', transactionDate: new Date('2024-04-01'), description: 'Tuition'},
      {transactionId: 't9', cardId: 'c1', amount: 75, category: 'Food & Dining', merchantName: 'Cafe I', transactionDate: new Date('2024-04-15'), description: 'Lunch'},
      {transactionId: 't10', cardId: 'c2', amount: 180, category: 'Shopping', merchantName: 'Mall J', transactionDate: new Date('2024-05-10'), description: 'Electronics'},
      {transactionId: 't11', cardId: 'c1', amount: 90, category: 'Fuel', merchantName: 'Gas Station K', transactionDate: new Date('2024-05-20'), description: 'Fuel'},
      {transactionId: 't12', cardId: 'c2', amount: 350, category: 'Travel', merchantName: 'Hotel L', transactionDate: new Date('2024-06-05'), description: 'Accommodation'}
    ];

    service.getTransactions = function(userId, fromDate) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          var filtered = mockTransactions.filter(function(t) {
            return new Date(t.transactionDate) >= fromDate;
          });
          resolve(filtered);
        }, 800);
      });
    };
  }]);
})();
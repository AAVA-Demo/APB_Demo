(function() {
  'use strict';
  angular.module('creditCardApp').service('TransactionService', ['$http', '$q', function($http, $q) {
    var service = this;
    var mockMonthlySpend = 4200;
    var mockTransactions = [
      {transactionId: 't1', cardId: 'c1', amount: 150, category: 'Food & Dining', merchantName: 'Restaurant A', transactionDate: new Date('2024-01-15'), description: 'Dinner'},
      {transactionId: 't2', cardId: 'c1', amount: 80, category: 'Fuel', merchantName: 'Gas Station B', transactionDate: new Date('2024-01-20'), description: 'Fuel'},
      {transactionId: 't3', cardId: 'c2', amount: 300, category: 'Shopping', merchantName: 'Store C', transactionDate: new Date('2024-01-25'), description: 'Clothing'},
      {transactionId: 't4', cardId: 'c2', amount: 500, category: 'Travel', merchantName: 'Airline D', transactionDate: new Date('2024-02-10'), description: 'Flight'},
      {transactionId: 't5', cardId: 'c1', amount: 120, category: 'Entertainment', merchantName: 'Cinema E', transactionDate: new Date('2024-02-14'), description: 'Movie'},
      {transactionId: 't6', cardId: 'c2', amount: 200, category: 'Utilities', merchantName: 'Utility F', transactionDate: new Date('2024-03-05'), description: 'Electric Bill'}
    ];

    service.getMonthlySpend = function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve(mockMonthlySpend);
        }, 500);
      });
    };

    service.getCardTransactions = function(cardId) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          var filtered = mockTransactions.filter(function(t) { return t.cardId === cardId; });
          resolve(filtered);
        }, 300);
      });
    };
  }]);
})();
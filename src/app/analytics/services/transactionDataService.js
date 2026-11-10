(function() {
  'use strict';
  angular.module('creditCardApp.analytics')
    .service('transactionDataService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;
      var mockTransactions = [
        {transactionId: 't1', cardId: 'c1', amount: 150, date: new Date(2024, 0, 15), merchantName: 'Restaurant A', category: 'Food & Dining'},
        {transactionId: 't2', cardId: 'c2', amount: 80, date: new Date(2024, 1, 10), merchantName: 'Gas Station', category: 'Fuel'},
        {transactionId: 't3', cardId: 'c3', amount: 500, date: new Date(2024, 2, 5), merchantName: 'Online Store', category: 'Shopping'},
        {transactionId: 't4', cardId: 'c1', amount: 200, date: new Date(2024, 3, 20), merchantName: 'Airline', category: 'Travel'},
        {transactionId: 't5', cardId: 'c2', amount: 50, date: new Date(2024, 4, 12), merchantName: 'Cinema', category: 'Entertainment'},
        {transactionId: 't6', cardId: 'c3', amount: 120, date: new Date(2024, 5, 8), merchantName: 'Electric Company', category: 'Utilities'},
        {transactionId: 't7', cardId: 'c1', amount: 300, date: new Date(2024, 6, 15), merchantName: 'Hospital', category: 'Healthcare'},
        {transactionId: 't8', cardId: 'c2', amount: 400, date: new Date(2024, 7, 22), merchantName: 'University', category: 'Education'},
        {transactionId: 't9', cardId: 'c3', amount: 75, date: new Date(2024, 8, 10), merchantName: 'Misc Store', category: 'Miscellaneous'},
        {transactionId: 't10', cardId: 'c1', amount: 180, date: new Date(2024, 9, 5), merchantName: 'Restaurant B', category: 'Food & Dining'},
        {transactionId: 't11', cardId: 'c2', amount: 90, date: new Date(2024, 10, 18), merchantName: 'Gas Station', category: 'Fuel'},
        {transactionId: 't12', cardId: 'c3', amount: 600, date: new Date(2024, 11, 25), merchantName: 'Shopping Mall', category: 'Shopping'}
      ];
      self.getTransactions = function(startDate, endDate) {
        var filtered = mockTransactions.filter(function(txn) {
          return txn.date >= startDate && txn.date <= endDate;
        });
        return $q.resolve(filtered);
      };
    }]);
})();
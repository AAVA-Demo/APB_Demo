(function() {
  'use strict';
  angular.module('creditCardApp').service('TransactionService', ['$http', '$q', 'Transaction', function($http, $q, Transaction) {
    this.getTransactions = function(cardId) {
      var url = '/api/transactions';
      if (cardId) {
        url += '?cardId=' + cardId;
      }
      return $http.get(url).then(function(response) {
        return response.data.map(function(txnData) {
          return new Transaction(txnData);
        });
      }).catch(function(error) {
        var mockTransactions = [
          {id: 't1', cardId: '1', date: '2024-01-15', merchant: 'Starbucks', amount: 5.50, category: 'Food & Dining', status: 'Posted', description: 'Coffee'},
          {id: 't2', cardId: '1', date: '2024-01-16', merchant: 'Shell Gas', amount: 45.00, category: 'Fuel', status: 'Posted', description: 'Gas fill'},
          {id: 't3', cardId: '2', date: '2024-01-17', merchant: 'Amazon', amount: 120.00, category: 'Shopping', status: 'Posted', description: 'Electronics'},
          {id: 't4', cardId: '2', date: '2024-01-18', merchant: 'Delta Airlines', amount: 350.00, category: 'Travel', status: 'Posted', description: 'Flight ticket'},
          {id: 't5', cardId: '3', date: '2024-01-19', merchant: 'Netflix', amount: 15.99, category: 'Entertainment', status: 'Posted', description: 'Subscription'},
          {id: 't6', cardId: '3', date: '2024-01-20', merchant: 'Electric Company', amount: 85.00, category: 'Utilities', status: 'Posted', description: 'Electric bill'},
          {id: 't7', cardId: '4', date: '2024-01-21', merchant: 'CVS Pharmacy', amount: 25.00, category: 'Healthcare', status: 'Posted', description: 'Medication'},
          {id: 't8', cardId: '1', date: '2024-01-22', merchant: 'Coursera', amount: 49.00, category: 'Education', status: 'Posted', description: 'Online course'},
          {id: 't9', cardId: '2', date: '2024-02-01', merchant: 'Target', amount: 75.00, category: 'Shopping', status: 'Posted', description: 'Groceries'},
          {id: 't10', cardId: '3', date: '2024-02-05', merchant: 'Uber', amount: 22.50, category: 'Travel', status: 'Posted', description: 'Ride'},
          {id: 't11', cardId: '1', date: '2024-02-10', merchant: 'Chipotle', amount: 12.00, category: 'Food & Dining', status: 'Posted', description: 'Lunch'},
          {id: 't12', cardId: '4', date: '2024-02-15', merchant: 'Best Buy', amount: 200.00, category: 'Shopping', status: 'Posted', description: 'Laptop accessories'},
          {id: 't13', cardId: '2', date: '2024-03-01', merchant: 'Whole Foods', amount: 95.00, category: 'Food & Dining', status: 'Posted', description: 'Groceries'},
          {id: 't14', cardId: '3', date: '2024-03-05', merchant: 'Spotify', amount: 9.99, category: 'Entertainment', status: 'Posted', description: 'Music subscription'},
          {id: 't15', cardId: '1', date: '2024-03-10', merchant: 'Exxon', amount: 50.00, category: 'Fuel', status: 'Posted', description: 'Gas'},
          {id: 't16', cardId: '4', date: '2024-03-15', merchant: 'ATT', amount: 65.00, category: 'Utilities', status: 'Posted', description: 'Phone bill'},
          {id: 't17', cardId: '2', date: '2024-03-20', merchant: 'Walgreens', amount: 18.50, category: 'Healthcare', status: 'Posted', description: 'Prescription'},
          {id: 't18', cardId: '3', date: '2024-03-25', merchant: 'Udemy', amount: 39.99, category: 'Education', status: 'Posted', description: 'Course'},
          {id: 't19', cardId: '1', date: '2024-03-28', merchant: 'Misc Store', amount: 15.00, category: 'Miscellaneous', status: 'Posted', description: 'Random purchase'}
        ];
        var filtered = cardId ? mockTransactions.filter(function(t) { return t.cardId === cardId; }) : mockTransactions;
        return filtered.map(function(txnData) {
          return new Transaction(txnData);
        });
      });
    };
  }]);
})();
(function() {
  'use strict';
  angular
    .module('creditCardDashboardModule')
    .factory('transactionDataFactory', ['$http', '$q', transactionDataFactory]);

  function transactionDataFactory($http, $q) {
    return {
      getTransactions: function() {
        var deferred = $q.defer();
        var now = new Date();
        var mockTransactions = [
          {
            transactionId: 'txn-001',
            cardId: 'card-001',
            amount: 150.00,
            transactionDate: new Date(now.getFullYear(), now.getMonth(), 5),
            merchantName: 'Amazon',
            category: 'Shopping'
          },
          {
            transactionId: 'txn-002',
            cardId: 'card-001',
            amount: 75.50,
            transactionDate: new Date(now.getFullYear(), now.getMonth(), 12),
            merchantName: 'Starbucks',
            category: 'Dining'
          },
          {
            transactionId: 'txn-003',
            cardId: 'card-002',
            amount: 250.00,
            transactionDate: new Date(now.getFullYear(), now.getMonth(), 8),
            merchantName: 'Best Buy',
            category: 'Electronics'
          },
          {
            transactionId: 'txn-004',
            cardId: 'card-002',
            amount: 120.00,
            transactionDate: new Date(now.getFullYear(), now.getMonth(), 15),
            merchantName: 'Target',
            category: 'Shopping'
          },
          {
            transactionId: 'txn-005',
            cardId: 'card-003',
            amount: 500.00,
            transactionDate: new Date(now.getFullYear(), now.getMonth(), 10),
            merchantName: 'Delta Airlines',
            category: 'Travel'
          },
          {
            transactionId: 'txn-006',
            cardId: 'card-003',
            amount: 85.00,
            transactionDate: new Date(now.getFullYear(), now.getMonth(), 18),
            merchantName: 'Whole Foods',
            category: 'Groceries'
          },
          {
            transactionId: 'txn-007',
            cardId: 'card-001',
            amount: 45.00,
            transactionDate: new Date(now.getFullYear(), now.getMonth() - 1, 20),
            merchantName: 'Shell',
            category: 'Gas'
          }
        ];
        setTimeout(function() {
          deferred.resolve(mockTransactions);
        }, 500);
        return deferred.promise;
      }
    };
  }
})();
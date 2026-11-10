(function() {
  'use strict';
  angular.module('analytics')
    .factory('TransactionRepositoryFactory', ['$http', '$q', function($http, $q) {
      var cache = null;
      var cacheTime = null;
      var CACHE_DURATION = 300000;
      return {
        getTransactions: function(userId, months) {
          if (cache && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
            return $q.resolve(cache);
          }
          var mockTransactions = [
            {transactionId: 't1', cardId: 'c1', merchantName: 'Olive Garden Restaurant', amount: 85.50, transactionDate: '2024-01-15', description: 'Dinner'},
            {transactionId: 't2', cardId: 'c1', merchantName: 'Shell Gas Station', amount: 45.00, transactionDate: '2024-01-18', description: 'Fuel'},
            {transactionId: 't3', cardId: 'c2', merchantName: 'Amazon', amount: 120.00, transactionDate: '2024-01-20', description: 'Electronics'},
            {transactionId: 't4', cardId: 'c2', merchantName: 'United Airlines', amount: 350.00, transactionDate: '2024-02-05', description: 'Flight'},
            {transactionId: 't5', cardId: 'c3', merchantName: 'Netflix', amount: 15.99, transactionDate: '2024-02-10', description: 'Subscription'},
            {transactionId: 't6', cardId: 'c1', merchantName: 'Electric Company', amount: 95.00, transactionDate: '2024-02-15', description: 'Utility bill'},
            {transactionId: 't7', cardId: 'c2', merchantName: 'CVS Pharmacy', amount: 35.00, transactionDate: '2024-03-01', description: 'Medicine'},
            {transactionId: 't8', cardId: 'c3', merchantName: 'Coursera', amount: 49.00, transactionDate: '2024-03-10', description: 'Online course'},
            {transactionId: 't9', cardId: 'c1', merchantName: 'Starbucks', amount: 12.50, transactionDate: '2024-03-15', description: 'Coffee'},
            {transactionId: 't10', cardId: 'c2', merchantName: 'Target', amount: 78.00, transactionDate: '2024-03-20', description: 'Groceries'}
          ];
          cache = mockTransactions;
          cacheTime = Date.now();
          return $q.resolve(mockTransactions);
        }
      };
    }]);
})();
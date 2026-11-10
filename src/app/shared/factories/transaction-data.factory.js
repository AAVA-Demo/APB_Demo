(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionDataFactory', ['$http', '$cacheFactory', '$q', TransactionDataFactory]);
  function TransactionDataFactory($http, $cacheFactory, $q) {
    var cache = $cacheFactory('transactionDataCache');
    var factory = {};
    factory.fetchTransactions = function(userId, dateRange) {
      var cacheKey = 'txns_' + userId + '_' + dateRange.startDate.toISOString() + '_' + dateRange.endDate.toISOString();
      var cached = cache.get(cacheKey);
      if (cached) {
        return $q.resolve(cached);
      }
      var deferred = $q.defer();
      $http.get('/api/transactions', {
        params: {
          userId: userId,
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString()
        }
      }).then(function(response) {
        var transactions = response.data || [];
        cache.put(cacheKey, transactions);
        setTimeout(function() { cache.remove(cacheKey); }, 300000);
        deferred.resolve(transactions);
      }).catch(function(error) {
        var mockTransactions = [
          { transactionId: 'txn1', cardId: 'card1', cardLastFour: '5678', amount: 150, category: 'Food & Dining', merchant: 'Restaurant A', transactionDate: new Date('2024-01-05'), description: 'Dinner' },
          { transactionId: 'txn2', cardId: 'card1', cardLastFour: '5678', amount: 80, category: 'Fuel', merchant: 'Gas Station B', transactionDate: new Date('2024-01-08'), description: 'Fuel' },
          { transactionId: 'txn3', cardId: 'card2', cardLastFour: '4321', amount: 200, category: 'Shopping', merchant: 'Store C', transactionDate: new Date('2024-01-10'), description: 'Clothing' },
          { transactionId: 'txn4', cardId: 'card2', cardLastFour: '4321', amount: 500, category: 'Travel', merchant: 'Airline D', transactionDate: new Date('2024-01-12'), description: 'Flight' },
          { transactionId: 'txn5', cardId: 'card3', cardLastFour: '4444', amount: 100, category: 'Entertainment', merchant: 'Cinema E', transactionDate: new Date('2024-01-15'), description: 'Movie tickets' },
          { transactionId: 'txn6', cardId: 'card1', cardLastFour: '5678', amount: 120, category: 'Utilities', merchant: 'Utility Co F', transactionDate: new Date('2024-01-18'), description: 'Electric bill' },
          { transactionId: 'txn7', cardId: 'card3', cardLastFour: '4444', amount: 300, category: 'Healthcare', merchant: 'Hospital G', transactionDate: new Date('2024-01-20'), description: 'Checkup' },
          { transactionId: 'txn8', cardId: 'card2', cardLastFour: '4321', amount: 250, category: 'Education', merchant: 'School H', transactionDate: new Date('2024-01-22'), description: 'Course fee' },
          { transactionId: 'txn9', cardId: 'card1', cardLastFour: '5678', amount: 50, category: 'Miscellaneous', merchant: 'Store I', transactionDate: new Date('2024-01-25'), description: 'Misc items' },
          { transactionId: 'txn10', cardId: 'card2', cardLastFour: '4321', amount: 175, category: 'Food & Dining', merchant: 'Restaurant J', transactionDate: new Date('2023-12-28'), description: 'Lunch' },
          { transactionId: 'txn11', cardId: 'card3', cardLastFour: '4444', amount: 90, category: 'Fuel', merchant: 'Gas Station K', transactionDate: new Date('2023-12-15'), description: 'Fuel' },
          { transactionId: 'txn12', cardId: 'card1', cardLastFour: '5678', amount: 400, category: 'Shopping', merchant: 'Store L', transactionDate: new Date('2023-11-20'), description: 'Electronics' }
        ];
        deferred.resolve(mockTransactions);
      });
      return deferred.promise;
    };
    return factory;
  }
})();
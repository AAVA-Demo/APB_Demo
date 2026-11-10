(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionFactory', ['$http', '$q', TransactionFactory]);
  function TransactionFactory($http, $q) {
    var factory = {};
    factory.getMonthlyTransactions = function(userId) {
      var deferred = $q.defer();
      var currentDate = new Date();
      var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      var endDate = currentDate;
      $http.get('/api/transactions/monthly', {
        params: {
          userId: userId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      }).then(function(response) {
        deferred.resolve(response.data || []);
      }).catch(function(error) {
        var mockTransactions = [
          { transactionId: 'txn1', cardId: 'card1', amount: 150, category: 'Food & Dining', merchant: 'Restaurant A', transactionDate: new Date('2024-01-05'), description: 'Dinner' },
          { transactionId: 'txn2', cardId: 'card1', amount: 80, category: 'Fuel', merchant: 'Gas Station B', transactionDate: new Date('2024-01-08'), description: 'Fuel' },
          { transactionId: 'txn3', cardId: 'card2', amount: 200, category: 'Shopping', merchant: 'Store C', transactionDate: new Date('2024-01-10'), description: 'Clothing' },
          { transactionId: 'txn4', cardId: 'card2', amount: 500, category: 'Travel', merchant: 'Airline D', transactionDate: new Date('2024-01-12'), description: 'Flight' },
          { transactionId: 'txn5', cardId: 'card3', amount: 100, category: 'Entertainment', merchant: 'Cinema E', transactionDate: new Date('2024-01-15'), description: 'Movie tickets' },
          { transactionId: 'txn6', cardId: 'card1', amount: 120, category: 'Utilities', merchant: 'Utility Co F', transactionDate: new Date('2024-01-18'), description: 'Electric bill' },
          { transactionId: 'txn7', cardId: 'card3', amount: 300, category: 'Healthcare', merchant: 'Hospital G', transactionDate: new Date('2024-01-20'), description: 'Checkup' },
          { transactionId: 'txn8', cardId: 'card2', amount: 250, category: 'Education', merchant: 'School H', transactionDate: new Date('2024-01-22'), description: 'Course fee' },
          { transactionId: 'txn9', cardId: 'card1', amount: 50, category: 'Miscellaneous', merchant: 'Store I', transactionDate: new Date('2024-01-25'), description: 'Misc items' }
        ];
        deferred.resolve(mockTransactions);
      });
      return deferred.promise;
    };
    return factory;
  }
})();
(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionCategorizationFactory', ['$q', '$timeout', function($q, $timeout) {
      var mockCategorizedTransactions = [
        {transactionId: 't1', amount: 150, date: new Date('2024-01-15'), category: 'Food & Dining', description: 'Grocery Store'},
        {transactionId: 't2', amount: 80, date: new Date('2024-01-18'), category: 'Fuel', description: 'Gas Station'},
        {transactionId: 't3', amount: 200, date: new Date('2024-01-20'), category: 'Shopping', description: 'Online Shopping'},
        {transactionId: 't4', amount: 500, date: new Date('2024-01-22'), category: 'Travel', description: 'Flight Booking'},
        {transactionId: 't5', amount: 100, date: new Date('2024-01-25'), category: 'Entertainment', description: 'Movie Tickets'},
        {transactionId: 't6', amount: 120, date: new Date('2024-01-28'), category: 'Utilities', description: 'Electric Bill'},
        {transactionId: 't7', amount: 300, date: new Date('2023-12-10'), category: 'Food & Dining', description: 'Restaurant'},
        {transactionId: 't8', amount: 450, date: new Date('2023-11-15'), category: 'Travel', description: 'Hotel'},
        {transactionId: 't9', amount: 90, date: new Date('2023-10-20'), category: 'Healthcare', description: 'Pharmacy'},
        {transactionId: 't10', amount: 250, date: new Date('2023-09-12'), category: 'Education', description: 'Online Course'},
        {transactionId: 't11', amount: 75, date: new Date('2023-08-05'), category: 'Miscellaneous', description: 'Misc Purchase'}
      ];
      return {
        getCategorizedTransactions: function() {
          var deferred = $q.defer();
          $timeout(function() {
            deferred.resolve(angular.copy(mockCategorizedTransactions));
          }, 100);
          return deferred.promise;
        }
      };
    }]);
})();
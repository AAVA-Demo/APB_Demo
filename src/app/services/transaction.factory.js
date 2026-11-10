(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionFactory', ['$q', '$timeout', function($q, $timeout) {
      var mockTransactions = [
        {transactionId: 't1', cardId: 'card1', amount: 150, date: new Date('2024-01-15'), description: 'Grocery Store', category: 'Food & Dining', status: 'posted'},
        {transactionId: 't2', cardId: 'card1', amount: 80, date: new Date('2024-01-18'), description: 'Gas Station', category: 'Fuel', status: 'posted'},
        {transactionId: 't3', cardId: 'card2', amount: 200, date: new Date('2024-01-20'), description: 'Online Shopping', category: 'Shopping', status: 'posted'},
        {transactionId: 't4', cardId: 'card2', amount: 500, date: new Date('2024-01-22'), description: 'Flight Booking', category: 'Travel', status: 'posted'},
        {transactionId: 't5', cardId: 'card3', amount: 100, date: new Date('2024-01-25'), description: 'Movie Tickets', category: 'Entertainment', status: 'posted'},
        {transactionId: 't6', cardId: 'card1', amount: 120, date: new Date('2024-01-28'), description: 'Electric Bill', category: 'Utilities', status: 'pending'}
      ];
      return {
        getMonthlyTransactions: function() {
          var deferred = $q.defer();
          $timeout(function() {
            var currentMonth = new Date().getMonth();
            var filtered = mockTransactions.filter(function(t) {
              return t.date.getMonth() === currentMonth;
            });
            var total = filtered.reduce(function(sum, t) { return sum + t.amount; }, 0);
            var outstanding = mockTransactions.reduce(function(sum, t) { return sum + (t.status === 'posted' ? t.amount : 0); }, 0);
            deferred.resolve({transactions: filtered, monthlySpend: total, outstandingAmount: outstanding});
          }, 100);
          return deferred.promise;
        },
        getAllTransactions: function() {
          var deferred = $q.defer();
          $timeout(function() {
            deferred.resolve(angular.copy(mockTransactions));
          }, 100);
          return deferred.promise;
        }
      };
    }]);
})();
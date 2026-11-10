(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionProcessingFactory', ['$http', '$q', 'API_CONFIG', 'AuthService', function($http, $q, API_CONFIG, AuthService) {
      var factory = {};
      factory.getMonthlyTransactions = function() {
        var deferred = $q.defer();
        var mockTransactions = [
          { transactionId: 'txn-001', cardId: 'card-001', amount: 150.50, date: new Date('2026-11-05'), merchantName: 'Restaurant ABC', merchantCode: '5812' },
          { transactionId: 'txn-002', cardId: 'card-002', amount: 75.00, date: new Date('2026-11-08'), merchantName: 'Gas Station', merchantCode: '5541' },
          { transactionId: 'txn-003', cardId: 'card-003', amount: 200.00, date: new Date('2026-11-10'), merchantName: 'Shopping Mall', merchantCode: '5311' },
          { transactionId: 'txn-004', cardId: 'card-001', amount: 50.25, date: new Date('2026-11-12'), merchantName: 'Grocery Store', merchantCode: '5411' },
          { transactionId: 'txn-005', cardId: 'card-004', amount: 120.00, date: new Date('2026-11-15'), merchantName: 'Airline', merchantCode: '3000' }
        ];
        setTimeout(function() {
          deferred.resolve(mockTransactions);
        }, 300);
        return deferred.promise;
      };
      return factory;
    }]);
})();
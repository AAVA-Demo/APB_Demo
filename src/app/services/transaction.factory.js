(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionFactory', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var factory = {};
      var allTransactions = [
        { transactionId: 'txn-001', cardId: 'card-001', amount: 150.50, date: new Date('2026-11-05'), merchantName: 'Restaurant ABC', merchantCode: '5812' },
        { transactionId: 'txn-002', cardId: 'card-002', amount: 75.00, date: new Date('2026-11-08'), merchantName: 'Gas Station', merchantCode: '5541' },
        { transactionId: 'txn-003', cardId: 'card-003', amount: 200.00, date: new Date('2026-11-10'), merchantName: 'Shopping Mall', merchantCode: '5311' },
        { transactionId: 'txn-004', cardId: 'card-001', amount: 50.25, date: new Date('2026-11-12'), merchantName: 'Grocery Store', merchantCode: '5411' },
        { transactionId: 'txn-005', cardId: 'card-004', amount: 120.00, date: new Date('2026-11-15'), merchantName: 'Airline', merchantCode: '3000' },
        { transactionId: 'txn-006', cardId: 'card-001', amount: 45.00, date: new Date('2026-10-20'), merchantName: 'Coffee Shop', merchantCode: '5814' },
        { transactionId: 'txn-007', cardId: 'card-002', amount: 300.00, date: new Date('2026-10-25'), merchantName: 'Electronics Store', merchantCode: '5399' },
        { transactionId: 'txn-008', cardId: 'card-005', amount: 85.50, date: new Date('2026-11-18'), merchantName: 'Movie Theater', merchantCode: '7832' }
      ];
      factory.getCardSpending = function(cardId) {
        var deferred = $q.defer();
        var cardTransactions = allTransactions.filter(function(txn) { return txn.cardId === cardId; });
        var monthlySpend = 0;
        var currentMonth = new Date().getMonth();
        cardTransactions.forEach(function(txn) {
          if (new Date(txn.date).getMonth() === currentMonth) {
            monthlySpend += txn.amount;
          }
        });
        var lastTxn = cardTransactions.length > 0 ? cardTransactions[cardTransactions.length - 1] : null;
        setTimeout(function() {
          deferred.resolve({
            cardId: cardId,
            monthlySpend: Math.round(monthlySpend * 100) / 100,
            totalTransactions: cardTransactions.length,
            lastTransactionDate: lastTxn ? lastTxn.date : null
          });
        }, 200);
        return deferred.promise;
      };
      factory.getTransactions = function(cardId) {
        var deferred = $q.defer();
        var cardTransactions = allTransactions.filter(function(txn) { return txn.cardId === cardId; });
        setTimeout(function() {
          deferred.resolve(cardTransactions);
        }, 200);
        return deferred.promise;
      };
      return factory;
    }]);
})();
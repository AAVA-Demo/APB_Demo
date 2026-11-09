(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionFactory', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var mockTransactions = [
        {transactionId: 'T001', cardId: 'CC001', amount: 2500, category: 'Food & Dining', date: new Date('2024-01-15'), merchant: 'Restaurant ABC'},
        {transactionId: 'T002', cardId: 'CC001', amount: 5000, category: 'Shopping', date: new Date('2024-01-20'), merchant: 'Mall XYZ'},
        {transactionId: 'T003', cardId: 'CC002', amount: 1500, category: 'Fuel', date: new Date('2024-01-18'), merchant: 'Gas Station'},
        {transactionId: 'T004', cardId: 'CC003', amount: 8000, category: 'Travel', date: new Date('2024-01-25'), merchant: 'Airline'},
        {transactionId: 'T005', cardId: 'CC001', amount: 3000, category: 'Entertainment', date: new Date('2024-02-05'), merchant: 'Cinema'},
        {transactionId: 'T006', cardId: 'CC002', amount: 2000, category: 'Utilities', date: new Date('2024-02-10'), merchant: 'Electric Company'},
        {transactionId: 'T007', cardId: 'CC003', amount: 4500, category: 'Healthcare', date: new Date('2024-02-15'), merchant: 'Hospital'},
        {transactionId: 'T008', cardId: 'CC001', amount: 6000, category: 'Education', date: new Date('2024-03-01'), merchant: 'University'},
        {transactionId: 'T009', cardId: 'CC002', amount: 1200, category: 'Miscellaneous', date: new Date('2024-03-10'), merchant: 'Store'},
        {transactionId: 'T010', cardId: 'CC003', amount: 3500, category: 'Food & Dining', date: new Date('2024-03-15'), merchant: 'Restaurant DEF'}
      ];
      return {
        fetchMonthlySpend: function() {
          var deferred = $q.defer();
          setTimeout(function() {
            var currentMonth = new Date().getMonth();
            var total = mockTransactions
              .filter(function(t) { return new Date(t.date).getMonth() === currentMonth; })
              .reduce(function(sum, t) { return sum + t.amount; }, 0);
            deferred.resolve({data: {monthlySpend: total || 15000}});
          }, 400);
          return deferred.promise;
        },
        fetchCardSpending: function(cardIds) {
          var deferred = $q.defer();
          setTimeout(function() {
            var spendData = cardIds.map(function(cardId) {
              var cardTransactions = mockTransactions.filter(function(t) { return t.cardId === cardId; });
              var monthlySpend = cardTransactions.reduce(function(sum, t) { return sum + t.amount; }, 0);
              var monthlyTrends = [];
              for (var i = 11; i >= 0; i--) {
                var d = new Date();
                d.setMonth(d.getMonth() - i);
                var monthName = d.toLocaleString('default', {month: 'short', year: 'numeric'});
                var amount = Math.floor(Math.random() * 5000) + 2000;
                monthlyTrends.push({month: monthName, amount: amount});
              }
              return {cardId: cardId, monthlySpend: monthlySpend, monthlyTrends: monthlyTrends};
            });
            deferred.resolve({data: spendData});
          }, 500);
          return deferred.promise;
        },
        fetchTransactions: function(dateRange) {
          var deferred = $q.defer();
          setTimeout(function() {
            var filtered = mockTransactions;
            if (dateRange && dateRange.startDate && dateRange.endDate) {
              filtered = mockTransactions.filter(function(t) {
                var tDate = new Date(t.date);
                return tDate >= new Date(dateRange.startDate) && tDate <= new Date(dateRange.endDate);
              });
            }
            deferred.resolve({data: filtered});
          }, 400);
          return deferred.promise;
        }
      };
    }]);
})();
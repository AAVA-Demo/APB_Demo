(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionDataFactory', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var factory = {};
      factory.getTransactions = function(months) {
        var deferred = $q.defer();
        var mockTransactions = [];
        var categories = ['5812', '5541', '5311', '5411', '3000', '7832', '4900', '8011', '8220', '9999'];
        var merchants = ['Restaurant', 'Gas Station', 'Shopping Mall', 'Grocery', 'Airline', 'Theater', 'Utility Co', 'Hospital', 'University', 'Misc Store'];
        var startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);
        for (var i = 0; i < 120; i++) {
          var randomDays = Math.floor(Math.random() * (months * 30));
          var txnDate = new Date(startDate);
          txnDate.setDate(txnDate.getDate() + randomDays);
          var catIndex = Math.floor(Math.random() * categories.length);
          mockTransactions.push({
            id: 'txn-' + (1000 + i),
            date: txnDate,
            amount: Math.round((Math.random() * 500 + 10) * 100) / 100,
            merchantName: merchants[catIndex] + ' ' + i,
            merchantCode: categories[catIndex],
            cardId: 'card-00' + (Math.floor(Math.random() * 5) + 1)
          });
        }
        setTimeout(function() {
          deferred.resolve(mockTransactions);
        }, 800);
        return deferred.promise;
      };
      return factory;
    }]);
})();
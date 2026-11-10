(function() {
  'use strict';
  angular.module('analytics')
    .factory('TransactionAPIFactory', ['$http', '$q', 'API_ENDPOINTS', function($http, $q, API_ENDPOINTS) {
      return {
        getTransactions: function(userId, dateRange) {
          var params = { userId: userId, range: '12months' };
          if (dateRange) {
            params.start = dateRange.start;
            params.end = dateRange.end;
          }
          return $http.get(API_ENDPOINTS.transactions, { params: params })
            .then(function(response) {
              return response.data;
            })
            .catch(function() {
              return self.generateMockTransactions();
            });
        }
      };
      var self = {
        generateMockTransactions: function() {
          var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
          var merchants = ['Restaurant ABC', 'Gas Station', 'Amazon', 'Airline XYZ', 'Netflix', 'Electric Company', 'Pharmacy', 'University', 'Store'];
          var transactions = [];
          for (var i = 0; i < 120; i++) {
            var monthOffset = Math.floor(i / 10);
            var date = new Date();
            date.setMonth(date.getMonth() - monthOffset);
            transactions.push({
              transactionId: 'txn-' + (i + 1),
              cardId: 'card-00' + (Math.floor(Math.random() * 3) + 1),
              amount: Math.random() * 500 + 10,
              category: categories[Math.floor(Math.random() * categories.length)],
              date: date,
              merchant: merchants[Math.floor(Math.random() * merchants.length)],
              description: 'Transaction ' + (i + 1)
            });
          }
          return transactions;
        }
      };
    }]);
})();
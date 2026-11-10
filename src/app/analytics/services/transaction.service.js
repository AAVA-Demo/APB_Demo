(function() {
  'use strict';
  angular.module('app.analytics')
    .service('TransactionService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;
      self.getTransactions = function(dateRange) {
        var params = {
          from: dateRange.from,
          to: dateRange.to
        };
        return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions, { params: params })
          .then(function(response) {
            return response.data.transactions || [];
          })
          .catch(function() {
            return self.getMockTransactions(dateRange);
          });
      };
      self.getMockTransactions = function(dateRange) {
        var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        var transactions = [];
        var months = 12;
        for (var i = 0; i < months; i++) {
          var date = new Date();
          date.setMonth(date.getMonth() - i);
          categories.forEach(function(category) {
            var amount = Math.floor(Math.random() * 5000) + 1000;
            transactions.push({
              transactionId: 'txn_' + i + '_' + category,
              cardId: 'card1',
              amount: amount,
              category: category,
              merchantName: 'Merchant ' + category,
              transactionDate: date,
              description: category + ' purchase'
            });
          });
        }
        return transactions;
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TransactionService', ['$http', '$q', function($http, $q) {
      var service = this;
      service.getTransactions = function(startDate, endDate) {
        var params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return $http.get('/api/transactions', {params: params}).then(function(response) {
          return response.data;
        }).catch(function(error) {
          console.error('Error fetching transactions:', error);
          return $q.reject(error);
        });
      };
      service.getMockTransactions = function() {
        var transactions = [];
        var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        var cardIds = ['C001', 'C002', 'C003', 'C004', 'C005'];
        var merchants = ['Walmart', 'Amazon', 'Shell', 'Starbucks', 'Netflix', 'Electric Co', 'Hospital', 'University', 'Misc Store'];
        for (var i = 0; i < 12; i++) {
          var month = new Date();
          month.setMonth(month.getMonth() - i);
          for (var j = 0; j < 50; j++) {
            var day = Math.floor(Math.random() * 28) + 1;
            var transDate = new Date(month.getFullYear(), month.getMonth(), day);
            transactions.push({
              transactionId: 'T' + (i * 50 + j),
              cardId: cardIds[Math.floor(Math.random() * cardIds.length)],
              amount: Math.floor(Math.random() * 500) + 10,
              date: transDate.toISOString(),
              category: categories[Math.floor(Math.random() * categories.length)],
              merchantName: merchants[Math.floor(Math.random() * merchants.length)],
              description: 'Transaction ' + (i * 50 + j)
            });
          }
        }
        return $q.resolve(transactions);
      };
    }]);
})();
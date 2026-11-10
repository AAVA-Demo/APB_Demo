(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TransactionDataService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var cache = {};
      this.fetchTransactions = function(months) {
        var cacheKey = 'tx_' + months;
        if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp < 300000)) {
          return $q.resolve(cache[cacheKey].data);
        }
        return $http.get(API_CONFIG.baseUrl + '/transactions', {
          params: { months: months },
          timeout: 1500
        }).then(function(response) {
          cache[cacheKey] = {
            data: response.data,
            timestamp: Date.now()
          };
          return response.data;
        }).catch(function() {
          var mockData = [];
          var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
          for (var i = 0; i < 100; i++) {
            var date = new Date();
            date.setMonth(date.getMonth() - Math.floor(Math.random() * months));
            mockData.push({
              transactionId: 'tx' + i,
              cardId: 'card' + (Math.floor(Math.random() * 3) + 1),
              amount: Math.floor(Math.random() * 5000) + 100,
              category: categories[Math.floor(Math.random() * categories.length)],
              transactionDate: date,
              merchantName: 'Merchant ' + i,
              description: 'Transaction ' + i
            });
          }
          cache[cacheKey] = {
            data: mockData,
            timestamp: Date.now()
          };
          return mockData;
        });
      };
    }]);
})();
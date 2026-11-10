(function() {
  'use strict';
  angular.module('analyticsModule')
    .service('AnalyticsApiService', ['$http', '$q', function($http, $q) {
      this.getTransactions = function() {
        return $http.get('/api/analytics/transactions').then(function(response) {
          return response.data;
        }).catch(function() {
          const mockTransactions = [];
          const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
          const months = [];
          for (let i = 11; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            months.push(d.toISOString().substring(0, 7));
          }
          months.forEach(function(month) {
            for (let j = 0; j < 20; j++) {
              mockTransactions.push({
                transactionId: 'txn_' + month + '_' + j,
                cardId: 'card' + (Math.floor(Math.random() * 3) + 1),
                amount: Math.floor(Math.random() * 5000) + 100,
                date: new Date(month + '-15'),
                category: categories[Math.floor(Math.random() * categories.length)],
                merchantName: 'Merchant ' + j
              });
            }
          });
          return mockTransactions;
        });
      };
    }]);
})();
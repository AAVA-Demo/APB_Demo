(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('SpendingAnalysisService', ['$http', '$q', function($http, $q) {
      var service = this;
      service.getCardWiseSpending = function() {
        return $http.get('/api/cards/spending').then(function(response) {
          return response.data;
        }).catch(function(error) {
          console.error('Error fetching card spending:', error);
          return $q.reject(error);
        });
      };
      service.getMockCardWiseSpending = function() {
        return $q.resolve([
          {cardId: 'C001', monthlySpend: 1200, totalSpend: 14400, transactionCount: 45, utilizationPercentage: 25, topCategories: ['Food & Dining', 'Shopping', 'Fuel']},
          {cardId: 'C002', monthlySpend: 2500, totalSpend: 30000, transactionCount: 78, utilizationPercentage: 53.3, topCategories: ['Travel', 'Shopping', 'Entertainment']},
          {cardId: 'C003', monthlySpend: 1800, totalSpend: 21600, transactionCount: 62, utilizationPercentage: 25, topCategories: ['Shopping', 'Travel', 'Food & Dining']},
          {cardId: 'C004', monthlySpend: 900, totalSpend: 10800, transactionCount: 34, utilizationPercentage: 25, topCategories: ['Utilities', 'Fuel', 'Food & Dining']},
          {cardId: 'C005', monthlySpend: 600, totalSpend: 7200, transactionCount: 28, utilizationPercentage: 18.75, topCategories: ['Entertainment', 'Food & Dining', 'Miscellaneous']}
        ]);
      };
    }]);
})();
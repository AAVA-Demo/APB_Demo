(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('ApiService', ['$http', '$q', function($http, $q) {
      var baseUrl = '/api';
      var mockMode = true;
      var mockData = {
        kpi: {
          userId: 'user123',
          monthlySpend: 4250.75,
          totalCreditLimit: 50000,
          availableCredit: 38500,
          outstandingAmount: 11500,
          lastUpdated: new Date()
        },
        cards: [
          { cardId: 'c1', userId: 'user123', cardNumber: '**** 1234', cardType: 'Visa', creditLimit: 20000, currentBalance: 5000, availableCredit: 15000, utilizationPercentage: 25, monthlySpend: 1800, issuer: 'Chase' },
          { cardId: 'c2', userId: 'user123', cardNumber: '**** 5678', cardType: 'Mastercard', creditLimit: 15000, currentBalance: 3500, availableCredit: 11500, utilizationPercentage: 23.3, monthlySpend: 1200, issuer: 'Citi' },
          { cardId: 'c3', userId: 'user123', cardNumber: '**** 9012', cardType: 'Amex', creditLimit: 15000, currentBalance: 3000, availableCredit: 12000, utilizationPercentage: 20, monthlySpend: 1250.75, issuer: 'American Express' }
        ],
        spending: {
          userId: 'user123',
          timeRange: { startDate: new Date(2025, 0, 1), endDate: new Date() },
          categories: [
            { name: 'Food & Dining', amount: 1250.50, percentage: 29.4, transactionCount: 45 },
            { name: 'Fuel', amount: 680.25, percentage: 16.0, transactionCount: 12 },
            { name: 'Shopping', amount: 890.00, percentage: 20.9, transactionCount: 18 },
            { name: 'Travel', amount: 450.00, percentage: 10.6, transactionCount: 3 },
            { name: 'Entertainment', amount: 320.00, percentage: 7.5, transactionCount: 8 },
            { name: 'Utilities', amount: 280.00, percentage: 6.6, transactionCount: 5 },
            { name: 'Healthcare', amount: 180.00, percentage: 4.2, transactionCount: 4 },
            { name: 'Education', amount: 120.00, percentage: 2.8, transactionCount: 2 },
            { name: 'Miscellaneous', amount: 80.00, percentage: 1.9, transactionCount: 6 }
          ],
          monthlyTrends: [
            { month: '2025-01', totalSpend: 3800, categoryBreakdown: {} },
            { month: '2025-02', totalSpend: 4100, categoryBreakdown: {} },
            { month: '2025-03', totalSpend: 3950, categoryBreakdown: {} },
            { month: '2025-04', totalSpend: 4250.75, categoryBreakdown: {} }
          ]
        }
      };
      function get(endpoint) {
        if (mockMode) {
          var deferred = $q.defer();
          setTimeout(function() {
            if (endpoint.indexOf('/kpi/dashboard') > -1) {
              deferred.resolve({ data: mockData.kpi });
            } else if (endpoint.indexOf('/cards/portfolio') > -1) {
              deferred.resolve({ data: { userId: 'user123', cards: mockData.cards, totalCreditLimit: 50000, totalUtilization: 23 } });
            } else if (endpoint.indexOf('/cards/') > -1 && endpoint.indexOf('/details') > -1) {
              var cardId = endpoint.split('/')[3];
              var card = mockData.cards.find(function(c) { return c.cardId === cardId; });
              deferred.resolve({ data: card || {} });
            } else if (endpoint.indexOf('/analytics/spending') > -1) {
              deferred.resolve({ data: mockData.spending });
            } else {
              deferred.reject({ status: 404, statusText: 'Not Found' });
            }
          }, 300);
          return deferred.promise;
        }
        return $http.get(baseUrl + endpoint).then(function(response) {
          return response;
        }).catch(function(error) {
          console.error('API Error:', error);
          return $q.reject(error);
        });
      }
      return {
        get: get
      };
    }]);
})();
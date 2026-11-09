(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('DashboardService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;
      var cache = {};
      var cacheTTL = 30000;
      self.getDashboardData = function(userId) {
        var cacheKey = 'dashboard_' + userId;
        var now = Date.now();
        if (cache[cacheKey] && (now - cache[cacheKey].timestamp < cacheTTL)) {
          return $q.resolve(cache[cacheKey].data);
        }
        var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard + '?userId=' + userId;
        return $http.get(url, { timeout: API_CONFIG.timeout })
          .then(function(response) {
            var data = response.data || self._getMockDashboardData();
            cache[cacheKey] = { data: data, timestamp: now };
            return data;
          })
          .catch(function(error) {
            if (cache[cacheKey]) {
              return cache[cacheKey].data;
            }
            return self._getMockDashboardData();
          });
      };
      self._getMockDashboardData = function() {
        return {
          kpis: {
            userId: 'user123',
            monthlySpend: 4250.75,
            totalCreditLimit: 50000,
            availableCredit: 38500,
            outstandingAmount: 11500,
            lastUpdated: new Date()
          },
          cards: [
            { cardId: 'card1', cardName: 'Platinum Rewards', cardNumber: '****1234', creditLimit: 25000, currentBalance: 6500, availableCredit: 18500, outstandingAmount: 6500 },
            { cardId: 'card2', cardName: 'Gold Cashback', cardNumber: '****5678', creditLimit: 15000, currentBalance: 3000, availableCredit: 12000, outstandingAmount: 3000 },
            { cardId: 'card3', cardName: 'Travel Elite', cardNumber: '****9012', creditLimit: 10000, currentBalance: 2000, availableCredit: 8000, outstandingAmount: 2000 }
          ]
        };
      };
    }]);
})();
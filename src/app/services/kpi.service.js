(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('KPIService', ['$http', '$q', 'KPICalculator', function($http, $q, KPICalculator) {
      var self = this;
      var cache = {};
      var cacheTimeout = 300000;
      self.getDashboardKPIs = function(userId) {
        var now = Date.now();
        if (cache[userId] && (now - cache[userId].timestamp < cacheTimeout)) {
          return $q.resolve(cache[userId].data);
        }
        return $http.get('/api/dashboard/kpis?userId=' + userId)
          .then(function(response) {
            var kpis = response.data;
            kpis.availableCredit = KPICalculator.calculateAvailableCredit(kpis.totalCreditLimit, kpis.outstandingAmount);
            cache[userId] = { data: kpis, timestamp: now };
            return kpis;
          })
          .catch(function() {
            var mockData = {
              userId: userId,
              monthlySpend: 4250.50,
              totalCreditLimit: 50000,
              outstandingAmount: 12300.75,
              lastUpdated: new Date()
            };
            mockData.availableCredit = KPICalculator.calculateAvailableCredit(mockData.totalCreditLimit, mockData.outstandingAmount);
            cache[userId] = { data: mockData, timestamp: now };
            return mockData;
          });
      };
    }]);
})();
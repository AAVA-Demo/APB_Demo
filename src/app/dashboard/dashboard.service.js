(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('DashboardService', ['$http', '$q', 'API_CONFIG', '$cacheFactory', function($http, $q, API_CONFIG, $cacheFactory) {
      var cache = $cacheFactory('dashboardCache');
      var CACHE_KEY = 'kpiData';
      this.getKPIData = function(userId, skipCache) {
        if (!skipCache) {
          var cachedData = cache.get(CACHE_KEY);
          if (cachedData) {
            return $q.resolve(cachedData);
          }
        }
        return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.DASHBOARD_KPI, {
          params: { userId: userId },
          timeout: API_CONFIG.TIMEOUT
        }).then(function(response) {
          var data = response.data || {
            monthlySpend: 4250.75,
            totalCreditLimit: 50000,
            availableCredit: 35749.25,
            outstandingAmount: 14250.75,
            lastUpdated: new Date()
          };
          cache.put(CACHE_KEY, data);
          return data;
        }).catch(function(error) {
          var mockData = {
            monthlySpend: 4250.75,
            totalCreditLimit: 50000,
            availableCredit: 35749.25,
            outstandingAmount: 14250.75,
            lastUpdated: new Date()
          };
          cache.put(CACHE_KEY, mockData);
          return mockData;
        });
      };
    }]);
})();
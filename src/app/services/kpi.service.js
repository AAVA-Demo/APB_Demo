(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('KPIService', ['$http', '$q', 'API_CONFIG', 'CacheFactory', function($http, $q, API_CONFIG, CacheFactory) {
      this.getKPIs = function() {
        var cached = CacheFactory.get('kpiData');
        if (cached) {
          return $q.resolve(cached);
        }
        return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.kpis)
          .then(function(response) {
            var kpiData = {
              monthlySpend: response.data.monthlySpend || 0,
              totalCreditLimit: response.data.totalCreditLimit || 0,
              availableCredit: response.data.availableCredit || 0,
              outstandingAmount: response.data.outstandingAmount || 0,
              utilizationPercentage: response.data.utilizationPercentage || 0,
              lastUpdated: new Date()
            };
            CacheFactory.put('kpiData', kpiData, 60);
            return kpiData;
          })
          .catch(function() {
            return {
              monthlySpend: 45230,
              totalCreditLimit: 250000,
              availableCredit: 185670,
              outstandingAmount: 64330,
              utilizationPercentage: 25.7,
              lastUpdated: new Date()
            };
          });
      };
    }]);
})();
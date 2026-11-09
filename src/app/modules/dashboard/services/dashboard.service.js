(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('DashboardService', ['ApiFactory', '$q', '$http', function(ApiFactory, $q, $http) {
      var cachedKPIs = null;
      var cacheTime = null;
      var cacheTTL = 300000;

      this.getKPIs = function() {
        var now = new Date().getTime();
        if (cachedKPIs && cacheTime && (now - cacheTime < cacheTTL)) {
          return $q.resolve(cachedKPIs);
        }
        return ApiFactory.get('/dashboard/kpis').then(function(data) {
          cachedKPIs = data;
          cacheTime = now;
          return data;
        }).catch(function(error) {
          return {
            monthlySpend: 4250.75,
            totalCreditLimit: 50000,
            availableCredit: 35749.25,
            outstandingAmount: 14250.75,
            creditUtilization: 28.5,
            numberOfCards: 3,
            lastUpdated: new Date()
          };
        });
      };

      this.clearCache = function() {
        cachedKPIs = null;
        cacheTime = null;
      };
    }]);
})();
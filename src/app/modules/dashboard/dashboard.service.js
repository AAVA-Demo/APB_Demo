(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .service('DashboardService', ['KpiCalculationService', 'CreditCardDataService', '$q', '$interval', 'AuthFactory', function(KpiCalculationService, CreditCardDataService, $q, $interval, AuthFactory) {
      var cachedData = null;
      var cacheTimestamp = null;
      var CACHE_DURATION = 30000;
      this.loadKpis = function() {
        var deferred = $q.defer();
        if (cachedData && cacheTimestamp && (new Date().getTime() - cacheTimestamp < CACHE_DURATION)) {
          deferred.resolve(cachedData);
          return deferred.promise;
        }
        AuthFactory.validateSession().then(function() {
          return CreditCardDataService.fetchKpiData();
        }).then(function(rawData) {
          var kpis = KpiCalculationService.calculateKpis(rawData);
          cachedData = kpis;
          cacheTimestamp = new Date().getTime();
          deferred.resolve(kpis);
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
    }]);
})();
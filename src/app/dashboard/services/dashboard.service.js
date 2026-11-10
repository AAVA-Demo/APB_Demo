(function() {
  'use strict';
  angular.module('dashboardModule').service('DashboardService', ['$q', 'CreditCardDataService', 'KPIAggregationService', function($q, CreditCardDataService, KPIAggregationService) {
    this.loadKPIs = function() {
      const deferred = $q.defer();
      CreditCardDataService.getAllCards().then(function(cards) {
        const kpis = KPIAggregationService.calculateKPIs(cards);
        deferred.resolve(kpis);
      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
  }]);
})();
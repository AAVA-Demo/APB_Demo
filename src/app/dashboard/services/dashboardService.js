(function() {
  'use strict';
  angular.module('ccDashboardModule').service('DashboardService', ['$q', 'CreditCardService', 'KpiAggregationUtil', 'DashboardKpi', function($q, CreditCardService, KpiAggregationUtil, DashboardKpi) {
    var self = this;
    self.loadDashboard = function() {
      var deferred = $q.defer();
      CreditCardService.getAllCards().then(function(cards) {
        var kpis = KpiAggregationUtil.calculateKpis(cards);
        deferred.resolve({ kpis: new DashboardKpi(kpis), cards: cards });
      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
  }]);
})();
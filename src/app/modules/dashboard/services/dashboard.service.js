(function() {
  'use strict';
  angular.module('dashboardModule')
    .service('dashboardService', DashboardService);
  DashboardService.$inject = ['$http', '$q', 'dataAggregationService', 'authFactory'];
  function DashboardService($http, $q, dataAggregationService, authFactory) {
    var service = this;
    service.loadKPIs = function() {
      var userId = authFactory.getUserId();
      return dataAggregationService.getAggregatedMetrics(userId);
    };
  }
})();
(function() {
  'use strict';
  angular.module('app.dashboard')
    .factory('DashboardService', ['ApiGatewayService', '$q', function(ApiGatewayService, $q) {
      return {
        getKpiSummary: function() {
          var deferred = $q.defer();
          ApiGatewayService.get('/kpi/summary')
            .then(function(response) {
              var kpiModel = new window.KpiModel(response);
              deferred.resolve(kpiModel);
            })
            .catch(function(error) {
              var mockData = {
                monthlySpend: 12450.75,
                totalCreditLimit: 150000,
                availableCredit: 87549.25,
                outstandingAmount: 62450.75,
                lastUpdated: new Date()
              };
              deferred.resolve(new window.KpiModel(mockData));
            });
          return deferred.promise;
        }
      };
    }]);
})();
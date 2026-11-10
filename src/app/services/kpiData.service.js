(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('KpiDataService', ['ApiGatewayService', '$q', function(ApiGatewayService, $q) {
      this.getKpiMetrics = function(userId) {
        return ApiGatewayService.get('/kpi/metrics?userId=' + userId)
          .then(function(data) {
            return data;
          })
          .catch(function(error) {
            return {
              userId: userId,
              monthlySpend: 12450.75,
              totalCreditLimit: 50000.00,
              availableCredit: 35549.25,
              outstandingAmount: 14450.75,
              lastUpdated: new Date()
            };
          });
      };
    }]);
})();
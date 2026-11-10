(function() {
  'use strict';
  angular.module('dashboard')
    .controller('DashboardController', ['KpiCalculationService', 'CreditCardDataFactory', '$scope', function(KpiCalculationService, CreditCardDataFactory, $scope) {
      var vm = this;
      vm.kpiSummary = {};
      vm.loading = true;
      vm.error = null;
      vm.init = function() {
        KpiCalculationService.getKpiSummary().then(function(summary) {
          vm.kpiSummary = summary;
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
        });
      };
      vm.init();
    }]);
})();
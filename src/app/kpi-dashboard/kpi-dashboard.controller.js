(function() {
  'use strict';
  angular.module('kpiDashboardModule')
    .controller('KPIDashboardController', ['$scope', 'KPICalculationService', 'AuthFactory', function($scope, KPICalculationService, AuthFactory) {
      var vm = this;
      vm.kpiData = {};
      vm.loading = true;
      vm.error = null;
      function loadKPIs() {
        vm.loading = true;
        KPICalculationService.calculateKPIs().then(function(data) {
          vm.kpiData = data;
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load KPI data.';
          vm.loading = false;
        });
      }
      AuthFactory.authenticate();
      loadKPIs();
    }]);
})();
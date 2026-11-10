(function() {
  'use strict';
  angular.module('dashboardModule').controller('DashboardController', DashboardController);
  DashboardController.$inject = ['$scope', '$interval', 'DashboardService', 'KPICalculationService'];
  function DashboardController($scope, $interval, DashboardService, KPICalculationService) {
    var vm = this;
    vm.kpis = {};
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    vm.init = function() {
      vm.loadDashboard();
      var refreshInterval = $interval(function() {
        vm.refresh();
      }, 300000);
      $scope.$on('$destroy', function() {
        $interval.cancel(refreshInterval);
      });
    };
    vm.loadDashboard = function() {
      vm.loading = true;
      vm.error = null;
      DashboardService.getKPIs().then(function(kpiData) {
        vm.kpis = KPICalculationService.formatKPIs(kpiData);
        vm.kpis.rawData = kpiData;
        return DashboardService.getCreditCardSummary();
      }).then(function(cardData) {
        vm.cards = cardData;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load dashboard data';
        vm.loading = false;
      });
    };
    vm.refresh = function() {
      DashboardService.refresh().then(function(results) {
        vm.kpis = KPICalculationService.formatKPIs(results[0]);
        vm.kpis.rawData = results[0];
        vm.cards = results[1];
      });
    };
    vm.getUtilizationClass = function() {
      return KPICalculationService.getUtilizationClass(vm.kpis.rawData ? vm.kpis.rawData.utilizationPercentage : 0);
    };
    vm.init();
  }
})();
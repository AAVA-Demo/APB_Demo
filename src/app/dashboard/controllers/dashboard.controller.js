(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'KPIService', 'RefreshIntervalFactory', function($scope, $interval, KPIService, RefreshIntervalFactory) {
      var vm = this;
      vm.kpiData = {};
      vm.loading = false;
      vm.error = null;
      vm.refreshInterval = null;
      init();
      function init() {
        loadKPIData();
        startAutoRefresh();
      }
      function loadKPIData() {
        vm.loading = true;
        vm.error = null;
        KPIService.getKPIData()
          .then(function(data) {
            vm.kpiData = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load KPI data. Please try again.';
            vm.loading = false;
            console.error('KPI load error:', error);
          });
      }
      function startAutoRefresh() {
        vm.refreshInterval = RefreshIntervalFactory.startAutoRefresh(10000, loadKPIData);
      }
      $scope.$on('$destroy', function() {
        if (vm.refreshInterval) {
          RefreshIntervalFactory.stopAutoRefresh(vm.refreshInterval);
        }
      });
    }]);
})();
(function() {
  'use strict';
  angular.module('dashboardModule')
    .controller('DashboardController', ['$scope', '$interval', 'KPIAggregationService', 'DashboardRefreshFactory', 'UserService', function($scope, $interval, KPIAggregationService, DashboardRefreshFactory, UserService) {
      var vm = this;
      vm.kpiData = {};
      vm.loading = true;
      vm.error = null;
      vm.lastUpdated = null;
      function loadKPIData() {
        vm.loading = true;
        vm.error = null;
        UserService.getUserId();
        KPIAggregationService.getAggregatedKPIs().then(function(data) {
          vm.kpiData = data;
          vm.lastUpdated = new Date();
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load KPI data. Please try again.';
          vm.loading = false;
        });
      }
      vm.refresh = function() {
        loadKPIData();
      };
      loadKPIData();
      DashboardRefreshFactory.startAutoRefresh(function() {
        loadKPIData();
      }, 300000);
      $scope.$on('$destroy', function() {
        DashboardRefreshFactory.stopAutoRefresh();
      });
    }]);
})();
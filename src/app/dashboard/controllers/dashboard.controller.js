(function() {
  'use strict';
  angular.module('app.dashboard').controller('DashboardController', ['$scope', '$interval', 'KPIAggregationService', 'DashboardRefreshFactory', function($scope, $interval, KPIAggregationService, DashboardRefreshFactory) {
    var vm = this;
    vm.kpis = {};
    vm.loading = true;
    vm.error = null;
    vm.loadKPIs = function() {
      vm.loading = true;
      vm.error = null;
      KPIAggregationService.getKPIs().then(function(data) {
        vm.kpis = data;
        vm.loading = false;
      }).catch(function(err) {
        vm.error = 'Failed to load dashboard data. Please try again.';
        vm.loading = false;
        console.error('KPI load error:', err);
      });
    };
    vm.loadKPIs();
    var refreshInterval = DashboardRefreshFactory.startRefresh(function() {
      KPIAggregationService.getKPIs().then(function(data) {
        vm.kpis = data;
      }).catch(function(err) {
        console.error('KPI refresh error:', err);
      });
    });
    $scope.$on('$destroy', function() {
      DashboardRefreshFactory.stopRefresh(refreshInterval);
    });
  }]);
})();
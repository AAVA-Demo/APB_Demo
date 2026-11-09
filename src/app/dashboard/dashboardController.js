(function() {
  'use strict';
  angular.module('creditCardApp').controller('dashboardController', ['$scope', 'dashboardService', 'dataRefreshService', function($scope, dashboardService, dataRefreshService) {
    var vm = this;
    vm.kpis = null;
    vm.loading = true;
    vm.errorMessage = null;
    var refreshInterval = null;
    function loadKPIs() {
      vm.loading = true;
      dashboardService.getKPIs().then(function(data) {
        vm.kpis = data;
        vm.loading = false;
        vm.errorMessage = null;
      }).catch(function(error) {
        vm.errorMessage = 'Failed to load dashboard data. Please try again.';
        vm.loading = false;
      });
    }
    loadKPIs();
    refreshInterval = dataRefreshService.startRefresh(loadKPIs, 300000);
    $scope.$on('$destroy', function() {
      if (refreshInterval) {
        dataRefreshService.stopRefresh(refreshInterval);
      }
    });
  }]);
})();
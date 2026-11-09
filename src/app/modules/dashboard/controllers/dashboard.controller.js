(function() {
  'use strict';
  angular.module('dashboardModule')
    .controller('DashboardController', DashboardController);
  DashboardController.$inject = ['dashboardService', '$scope', '$interval', 'authFactory'];
  function DashboardController(dashboardService, $scope, $interval, authFactory) {
    var vm = this;
    vm.kpis = null;
    vm.loading = true;
    vm.error = null;
    vm.lastRefreshed = null;
    vm.init = function() {
      authFactory.validateAuth().then(function() {
        vm.loadKPIs();
        var refreshInterval = $interval(function() {
          vm.loadKPIs();
        }, 300000);
        $scope.$on('$destroy', function() {
          $interval.cancel(refreshInterval);
        });
      });
    };
    vm.loadKPIs = function() {
      vm.loading = true;
      dashboardService.loadKPIs().then(function(data) {
        vm.kpis = data;
        vm.lastRefreshed = new Date();
        vm.loading = false;
        vm.error = null;
      }).catch(function(err) {
        vm.error = 'Failed to load dashboard data';
        vm.loading = false;
      });
    };
    vm.init();
  }
})();
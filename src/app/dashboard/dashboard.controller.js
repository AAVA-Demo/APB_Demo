(function() {
  'use strict';
  angular.module('creditCardApp').controller('DashboardController', ['DashboardService', '$scope', function(DashboardService, $scope) {
    const vm = this;
    vm.kpis = null;
    vm.loading = true;
    vm.error = null;
    vm.init = function() {
      DashboardService.getKPIs().then(function(data) {
        vm.kpis = data;
        vm.loading = false;
      }).catch(function(err) {
        vm.error = 'Failed to load dashboard data';
        vm.loading = false;
      });
    };
    vm.refresh = function() {
      vm.loading = true;
      vm.init();
    };
    vm.init();
  }]);
})();
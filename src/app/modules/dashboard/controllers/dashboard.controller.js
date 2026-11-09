(function() {
  'use strict';
  angular.module('creditCardDashboard')
    .controller('DashboardController', ['$scope', 'DashboardService', DashboardController]);
  function DashboardController($scope, DashboardService) {
    var vm = this;
    vm.kpis = null;
    vm.loading = true;
    vm.error = null;
    vm.init = function() {
      vm.loading = true;
      DashboardService.getKPIs()
        .then(function(kpiData) {
          vm.kpis = kpiData;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
        });
    };
    vm.refresh = function() {
      vm.init();
    };
    vm.init();
  }
})();
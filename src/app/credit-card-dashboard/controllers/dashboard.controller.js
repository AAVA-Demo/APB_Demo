(function() {
  'use strict';
  angular
    .module('creditCardDashboardModule')
    .controller('dashboardController', ['dashboardService', '$scope', dashboardController]);

  function dashboardController(dashboardService, $scope) {
    var vm = this;
    vm.kpis = {};
    vm.loading = true;
    vm.error = null;
    activate();
    function activate() {
      dashboardService.getDashboardKPIs()
        .then(function(data) {
          vm.kpis = data;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
        });
    }
  }
})();
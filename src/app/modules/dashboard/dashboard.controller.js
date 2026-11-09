(function() {
  'use strict';
  angular.module('creditcard.dashboard')
    .controller('DashboardController', ['DashboardService', '$scope', '$interval', DashboardController]);
  function DashboardController(DashboardService, $scope, $interval) {
    var vm = this;
    vm.kpis = {};
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    vm.refreshKPIs = refreshKPIs;
    activate();
    function activate() {
      refreshKPIs();
      $interval(refreshKPIs, 30000);
    }
    function refreshKPIs() {
      vm.loading = true;
      vm.error = null;
      DashboardService.getKPIs()
        .then(function(data) {
          vm.kpis = data;
          vm.cards = data.cards;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
        });
    }
  }
})();
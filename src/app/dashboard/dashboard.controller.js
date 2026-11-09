(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['DashboardService', '$scope', function(DashboardService, $scope) {
      var vm = this;
      vm.kpis = null;
      vm.loading = true;
      vm.error = null;
      vm.refreshData = refreshData;
      activate();
      function activate() {
        loadKPIs();
      }
      function loadKPIs() {
        vm.loading = true;
        vm.error = null;
        DashboardService.getKPIs()
          .then(function(data) {
            vm.kpis = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data. Please try again.';
            vm.loading = false;
            console.error('Error loading KPIs:', error);
          });
      }
      function refreshData() {
        loadKPIs();
      }
    }]);
})();
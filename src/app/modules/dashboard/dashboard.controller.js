(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', 'DashboardService', function($scope, DashboardService) {
      var vm = this;
      vm.kpiData = null;
      vm.loading = true;
      vm.error = null;
      vm.init = function() {
        DashboardService.getKpiSummary()
          .then(function(data) {
            vm.kpiData = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data. Please try again.';
            vm.loading = false;
          });
      };
      vm.init();
    }]);
})();
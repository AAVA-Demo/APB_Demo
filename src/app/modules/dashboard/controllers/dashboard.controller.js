(function() {
  'use strict';
  angular.module('creditCard.dashboard').controller('DashboardController', ['$scope', 'DashboardService', function($scope, DashboardService) {
    var vm = this;
    vm.kpis = null;
    vm.loading = true;
    vm.error = null;
    vm.init = function() {
      DashboardService.loadKPIs().then(function(kpiData) {
        vm.kpis = kpiData;
        vm.loading = false;
        $scope.$apply();
      }, function(error) {
        vm.error = 'Failed to load dashboard data';
        vm.loading = false;
        $scope.$apply();
      });
    };
    vm.refresh = function() {
      vm.loading = true;
      vm.init();
    };
    vm.init();
  }]);
})();
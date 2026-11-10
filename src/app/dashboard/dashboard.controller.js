(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'DashboardService', 'KPICalculationService', 'DashboardDataFactory', 'AuthService', 'toastr', function($scope, $interval, DashboardService, KPICalculationService, DashboardDataFactory, AuthService, toastr) {
      const vm = this;
      vm.kpis = null;
      vm.loading = true;
      vm.lastUpdated = null;
      const user = AuthService.getCurrentUser();
      const userId = user.userId;
      let refreshInterval;
      vm.loadKPIData = function() {
        DashboardService.getKPIData(userId)
          .then(function(data) {
            vm.kpis = KPICalculationService.computeAvailableCredit(data);
            vm.lastUpdated = new Date();
            DashboardDataFactory.cacheKPIData(vm.kpis);
            vm.loading = false;
          })
          .catch(function(error) {
            vm.loading = false;
            toastr.error('Failed to load dashboard data');
          });
      };
      vm.refreshData = function() {
        vm.loading = true;
        DashboardDataFactory.clearCache();
        vm.loadKPIData();
      };
      const cachedData = DashboardDataFactory.getCachedKPIData();
      if (cachedData) {
        vm.kpis = cachedData;
        vm.loading = false;
      }
      vm.loadKPIData();
      refreshInterval = $interval(function() {
        vm.loadKPIData();
      }, 10000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
})();
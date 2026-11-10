(function() {
  'use strict';
  angular.module('creditCard.dashboardModule').controller('DashboardController', ['$scope', '$interval', 'KpiCalculationService', 'AuthService', function($scope, $interval, KpiCalculationService, AuthService) {
    const vm = this;
    vm.kpis = null;
    vm.isLoading = true;
    vm.lastRefresh = null;
    vm.error = null;
    
    let refreshInterval;
    
    function loadKpis() {
      vm.isLoading = true;
      vm.error = null;
      
      AuthService.validateSession().then(function() {
        return KpiCalculationService.fetchKpis();
      }).then(function(kpis) {
        vm.kpis = kpis;
        vm.lastRefresh = new Date();
        vm.isLoading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load dashboard data. Please try again.';
        vm.isLoading = false;
      });
    }
    
    vm.refresh = function() {
      KpiCalculationService.clearCache();
      loadKpis();
    };
    
    vm.init = function() {
      loadKpis();
      refreshInterval = $interval(function() {
        KpiCalculationService.clearCache();
        loadKpis();
      }, 300000);
    };
    
    $scope.$on('$destroy', function() {
      if (refreshInterval) {
        $interval.cancel(refreshInterval);
      }
    });
    
    vm.init();
  }]);
})();
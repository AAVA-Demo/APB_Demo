(function() {
  'use strict';
  angular.module('app.dashboard').controller('DashboardController', ['$scope', '$interval', 'CreditCardService', 'TransactionService', 'KpiAggregationService', 'AuthService', function($scope, $interval, CreditCardService, TransactionService, KpiAggregationService, AuthService) {
    const vm = this;
    vm.kpiData = {};
    vm.loading = true;
    vm.error = null;
    vm.lastRefresh = new Date();
    const userId = AuthService.getUserId();
    function loadDashboardData() {
      vm.loading = true;
      vm.error = null;
      CreditCardService.getAllCards(userId).then(function(cards) {
        return TransactionService.getMonthlySummary(userId).then(function(summary) {
          vm.kpiData = KpiAggregationService.calculateKpis(cards, summary.monthlySpend);
          vm.loading = false;
          vm.lastRefresh = new Date();
        });
      }).catch(function(error) {
        vm.error = 'Failed to load dashboard data. Please try again.';
        vm.loading = false;
      });
    }
    loadDashboardData();
    const refreshInterval = $interval(loadDashboardData, 30000);
    $scope.$on('$destroy', function() {
      if (refreshInterval) {
        $interval.cancel(refreshInterval);
      }
    });
    vm.refresh = loadDashboardData;
  }]);
})();
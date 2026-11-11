(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', '$q', 'KPIService', 'CardSummaryService', 'RefreshService', function($scope, $q, KPIService, CardSummaryService, RefreshService) {
      var vm = this;
      vm.kpis = null;
      vm.cardSummaries = [];
      vm.loading = true;
      vm.error = null;
      vm.lastUpdated = null;
      function loadDashboardData() {
        vm.loading = true;
        vm.error = null;
        $q.all({
          kpis: KPIService.getKPIs(),
          summaries: CardSummaryService.getCardSummaries()
        })
        .then(function(results) {
          vm.kpis = results.kpis;
          vm.cardSummaries = results.summaries;
          vm.lastUpdated = new Date();
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
        });
      }
      vm.getUtilizationClass = function(percentage) {
        if (percentage >= 80) return 'danger';
        if (percentage >= 60) return 'warning';
        return '';
      };
      vm.getAvailableCreditClass = function() {
        if (!vm.kpis) return '';
        var utilization = (vm.kpis.outstandingAmount / vm.kpis.totalCreditLimit) * 100;
        if (utilization >= 80) return 'danger';
        if (utilization >= 60) return 'warning';
        return '';
      };
      loadDashboardData();
      RefreshService.startRefresh(function() {
        KPIService.clearCache();
        loadDashboardData();
      }, 60000);
      $scope.$on('$destroy', function() {
        RefreshService.stopRefresh();
      });
    }]);
})();
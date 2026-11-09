(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', 'KpiService', 'RefreshService', function($scope, KpiService, RefreshService) {
      var vm = this;
      vm.kpiData = null;
      vm.loading = true;
      vm.error = null;
      vm.kpis = [];
      function loadKpiData() {
        vm.loading = true;
        KpiService.getKpiData().then(function(data) {
          vm.kpiData = data;
          vm.kpis = [
            { label: 'Monthly Spend', value: data.monthlySpend, icon: 'fa-shopping-cart', format: 'currency' },
            { label: 'Total Credit Limit', value: data.totalCreditLimit, icon: 'fa-credit-card', format: 'currency' },
            { label: 'Available Credit', value: data.availableCredit, icon: 'fa-money', format: 'currency' },
            { label: 'Outstanding Amount', value: data.outstandingAmount, icon: 'fa-exclamation-triangle', format: 'currency' }
          ];
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
        });
      }
      loadKpiData();
      RefreshService.startPolling('dashboard', loadKpiData, 30000);
      $scope.$on('$destroy', function() {
        RefreshService.stopPolling('dashboard');
      });
    }]);
  DashboardController.$inject = ['$scope', 'KpiService', 'RefreshService'];
})();
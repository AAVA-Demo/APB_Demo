(function() {
  'use strict';
  angular.module('dashboardModule').controller('DashboardController', ['$scope', '$interval', 'KPIService', function($scope, $interval, KPIService) {
    var vm = this;
    vm.kpiData = null;
    vm.loading = true;
    vm.error = null;
    vm.kpiWidgets = [];
    var refreshInterval;
    function loadKPIData() {
      vm.loading = true;
      vm.error = null;
      var userId = 'user123';
      KPIService.getKPIData(userId)
        .then(function(data) {
          vm.kpiData = data;
          vm.kpiWidgets = [
            { label: 'Monthly Spend', value: data.monthlySpend, iconClass: 'glyphicon-usd', trendPercent: 5, trendDirection: 'up' },
            { label: 'Total Credit Limit', value: data.totalCreditLimit, iconClass: 'glyphicon-credit-card', trendPercent: null, trendDirection: null },
            { label: 'Available Credit', value: data.availableCredit, iconClass: 'glyphicon-ok-circle', trendPercent: null, trendDirection: null },
            { label: 'Outstanding Amount', value: data.outstandingAmount, iconClass: 'glyphicon-exclamation-sign', trendPercent: 3, trendDirection: 'down' }
          ];
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
        });
    }
    vm.refresh = function() {
      loadKPIData();
    };
    loadKPIData();
    refreshInterval = $interval(function() {
      loadKPIData();
    }, 30000);
    $scope.$on('$destroy', function() {
      if (refreshInterval) {
        $interval.cancel(refreshInterval);
      }
    });
  }]);
})();
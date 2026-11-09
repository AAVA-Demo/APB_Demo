(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'CreditCardService', 'KPICalculatorFactory', function($scope, $interval, CreditCardService, KPICalculatorFactory) {
      var vm = this;
      vm.kpiData = {};
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.loadDashboard = function() {
        vm.loading = true;
        vm.error = null;
        CreditCardService.getAllCards()
          .then(function(cards) {
            vm.cards = cards;
            vm.kpiData = KPICalculatorFactory.calculateKPIs(cards);
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data. Please try again.';
            vm.loading = false;
          });
      };
      vm.getUtilizationClass = function() {
        var utilization = vm.kpiData.creditUtilizationPercent;
        if (utilization < 30) return 'utilization-low';
        if (utilization >= 30 && utilization <= 70) return 'utilization-medium';
        return 'utilization-high';
      };
      vm.retry = function() {
        vm.loadDashboard();
      };
      vm.loadDashboard();
      var refreshInterval = $interval(function() {
        vm.loadDashboard();
      }, 300000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
})();
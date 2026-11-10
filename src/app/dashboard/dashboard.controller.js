(function() {
  'use strict';
  angular.module('dashboardModule').controller('DashboardController', ['$scope', 'CreditCardService', 'KPICalculator', DashboardController]);
  function DashboardController($scope, CreditCardService, KPICalculator) {
    var vm = this;
    vm.cards = [];
    vm.kpis = {};
    vm.loading = true;
    vm.error = null;
    vm.init = function() {
      CreditCardService.getCreditCards().then(function(cards) {
        vm.cards = cards;
        vm.kpis = KPICalculator.calculateKPIs(cards);
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load dashboard data. Please try again.';
        vm.loading = false;
      });
      CreditCardService.startAutoRefresh(function(cards) {
        vm.cards = cards;
        vm.kpis = KPICalculator.calculateKPIs(cards);
        $scope.$apply();
      });
    };
    vm.retry = function() {
      vm.error = null;
      vm.loading = true;
      vm.init();
    };
    $scope.$on('$destroy', function() {
      CreditCardService.stopAutoRefresh();
    });
    vm.init();
  }
})();
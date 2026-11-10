(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'CreditCardService', 'TransactionService', 'KPICalculatorFactory', function($scope, $interval, CreditCardService, TransactionService, KPICalculatorFactory) {
      var vm = this;
      vm.kpis = {};
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      function loadDashboardData() {
        vm.loading = true;
        CreditCardService.getMockCards().then(function(cards) {
          vm.cards = cards;
          return TransactionService.getMockTransactions();
        }).then(function(transactions) {
          vm.kpis = KPICalculatorFactory.calculateKPIs(vm.cards, transactions);
          vm.loading = false;
        }).catch(function(error) {
          vm.error = 'Failed to load dashboard data';
          vm.loading = false;
        });
      }
      loadDashboardData();
      var refreshInterval = $interval(function() {
        loadDashboardData();
      }, 30000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
      vm.getUtilizationClass = function(utilization) {
        if (utilization >= 80) return 'danger';
        if (utilization >= 50) return 'warning';
        return '';
      };
    }]);
})();
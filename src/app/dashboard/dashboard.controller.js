(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', DashboardController);
  DashboardController.$inject = ['$scope', '$interval', 'CreditCardService', 'TransactionService', 'KpiCalculatorService'];
  function DashboardController($scope, $interval, CreditCardService, TransactionService, KpiCalculatorService) {
    var vm = this;
    vm.kpiData = {};
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    vm.refreshKpis = refreshKpis;
    activate();
    function activate() {
      refreshKpis();
      var refreshInterval = $interval(refreshKpis, 30000);
      $scope.$on('$destroy', function() {
        $interval.cancel(refreshInterval);
      });
    }
    function refreshKpis() {
      vm.loading = true;
      vm.error = null;
      CreditCardService.getCards()
        .then(function(cards) {
          vm.cards = cards;
          return TransactionService.getMonthlySpend();
        })
        .then(function(transactionData) {
          vm.kpiData = KpiCalculatorService.calculateKpis(vm.cards, transactionData);
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
        });
    }
  }
})();
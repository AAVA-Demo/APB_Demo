(function() {
  'use strict';
  angular.module('creditCardApp').controller('DashboardController', ['$scope', '$q', 'creditCardService', 'transactionService', 'balanceService', 'kpiAggregatorFactory', function($scope, $q, creditCardService, transactionService, balanceService, kpiAggregatorFactory) {
    var vm = this;
    vm.loading = true;
    vm.kpiData = {};
    vm.error = null;
    vm.init = function() {
      vm.loading = true;
      $q.all([
        creditCardService.getCards(),
        transactionService.getMonthlySpend(),
        balanceService.getOutstandingBalances()
      ]).then(function(results) {
        var cardData = results[0];
        var txnData = results[1];
        var balData = results[2];
        vm.kpiData = kpiAggregatorFactory.aggregate(cardData, txnData, balData);
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load dashboard data. Please try again.';
        vm.loading = false;
      });
    };
    vm.refresh = function() {
      vm.init();
    };
    vm.init();
  }]);
})();
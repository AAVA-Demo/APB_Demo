(function() {
  'use strict';
  angular.module('app.dashboard').controller('DashboardController', ['KpiService', 'CardDataService', 'TransactionService', '$scope', function(KpiService, CardDataService, TransactionService, $scope) {
    var vm = this;
    vm.loading = true;
    vm.kpis = {};
    vm.cards = [];
    vm.error = null;
    function init() {
      KpiService.calculateKPIs().then(function(data) {
        vm.kpis = {
          monthlySpend: data.monthlySpend,
          totalCreditLimit: data.totalCreditLimit,
          availableCredit: data.totalAvailableCredit,
          outstanding: data.totalOutstanding,
          utilizationRate: data.utilizationRate
        };
        vm.cards = data.cards;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load dashboard data. Please try again.';
        vm.loading = false;
      });
    }
    init();
  }]);
})();
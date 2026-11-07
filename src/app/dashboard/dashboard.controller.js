(function() {
  'use strict';
  angular.module('app.dashboard').controller('DashboardController', ['KpiCalculationService', '$scope', function(KpiCalculationService, $scope) {
    var vm = this;
    vm.loading = true;
    vm.kpis = {};
    vm.cards = [];
    KpiCalculationService.getKPIs().then(function(data) {
      vm.kpis = data;
      vm.cards = data.cards;
      vm.loading = false;
    }).catch(function(error) {
      vm.loading = false;
      vm.error = 'Failed to load dashboard data';
    });
  }]);
})();
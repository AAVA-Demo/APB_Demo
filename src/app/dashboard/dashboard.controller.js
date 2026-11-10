(function() {
  'use strict';
  angular.module('dashboardModule').controller('DashboardController', ['$scope', '$timeout', 'CreditCardDataService', 'KPICalculationService', function($scope, $timeout, CreditCardDataService, KPICalculationService) {
    var vm = this;
    vm.loading = true;
    vm.kpis = {};
    vm.cards = [];
    vm.error = null;
    var loadStartTime = Date.now();
    CreditCardDataService.getAllCards().then(function(cards) {
      vm.cards = cards;
      vm.kpis = KPICalculationService.calculateKPIs(cards);
      vm.loading = false;
      var loadTime = Date.now() - loadStartTime;
      if (loadTime > 2000) {
        console.warn('Dashboard load time exceeded 2 seconds: ' + loadTime + 'ms');
      }
    }).catch(function(error) {
      vm.error = 'Failed to load dashboard data. Please try again.';
      vm.loading = false;
    });
  }]);
})();
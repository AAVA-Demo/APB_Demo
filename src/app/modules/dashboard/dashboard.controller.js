(function() {
  'use strict';
  angular.module('creditCard.dashboard').controller('DashboardController', ['$scope', 'CardService', 'KPICalculatorFactory', function($scope, CardService, KPICalculatorFactory) {
    var vm = this;
    vm.cards = [];
    vm.kpis = {};
    vm.loading = true;
    vm.error = null;
    function init() {
      CardService.getAllCards().then(function(cards) {
        vm.cards = cards;
        vm.kpis = KPICalculatorFactory.calculateKPIs(cards);
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load cards. Please try again.';
        vm.loading = false;
      });
    }
    init();
  }]);
})();
(function() {
  'use strict';
  angular.module('creditCard.dashboard').controller('DashboardController', ['CreditCardService', '$scope', function(CreditCardService, $scope) {
    var vm = this;
    vm.loading = true;
    vm.error = null;
    vm.kpiData = null;
    vm.init = function() {
      vm.loading = true;
      CreditCardService.getMockPortfolio().then(function(data) {
        vm.kpiData = data;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load dashboard data. Please try again.';
        vm.loading = false;
      });
    };
    vm.retry = function() {
      vm.error = null;
      CreditCardService.clearCache();
      vm.init();
    };
    vm.formatCurrency = function(amount) {
      return '₹' + (amount || 0).toLocaleString('en-IN');
    };
    vm.init();
  }]);
})();
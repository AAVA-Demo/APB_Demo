(function() {
  'use strict';
  angular.module('creditCardApp.portfolio').controller('PortfolioDashboardController', ['PortfolioService', '$scope', '$q', function(PortfolioService, $scope, $q) {
    var vm = this;
    vm.portfolio = null;
    vm.loading = true;
    vm.error = null;
    vm.init = function() {
      var userId = 'user123';
      PortfolioService.getPortfolio(userId).then(function(portfolio) {
        vm.portfolio = portfolio;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load portfolio. Please try again.';
        vm.loading = false;
      });
    };
    vm.init();
  }]);
  PortfolioDashboardController.$inject = ['PortfolioService', '$scope', '$q'];
})();
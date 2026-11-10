(function() {
  'use strict';
  angular.module('portfolio')
    .controller('PortfolioDashboardController', ['$scope', 'PortfolioService', function($scope, PortfolioService) {
      const vm = this;
      vm.loading = true;
      vm.error = null;
      vm.portfolioSummary = null;
      vm.init = function() {
        PortfolioService.getPortfolioSummary()
          .then(function(summary) {
            vm.portfolioSummary = summary;
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(err) {
            vm.error = 'Failed to load portfolio data';
            vm.loading = false;
            $scope.$apply();
          });
      };
      vm.init();
    }]);
})();
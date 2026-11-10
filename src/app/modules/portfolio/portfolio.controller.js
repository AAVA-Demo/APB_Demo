(function() {
  'use strict';
  angular.module('portfolioModule')
    .controller('PortfolioController', ['$scope', '$filter', 'PortfolioManagementService', function($scope, $filter, PortfolioManagementService) {
      const vm = this;
      vm.portfolio = {};
      vm.selectedCard = null;
      vm.loading = true;
      vm.error = null;
      function loadPortfolio() {
        vm.loading = true;
        PortfolioManagementService.getCardPortfolio().then(function(data) {
          vm.portfolio = data;
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load portfolio data';
          vm.loading = false;
        });
      }
      loadPortfolio();
      vm.selectCard = function(card) {
        vm.selectedCard = card;
      };
      vm.closeDetail = function() {
        vm.selectedCard = null;
      };
    }]);
})();
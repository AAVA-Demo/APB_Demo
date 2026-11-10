(function() {
  'use strict';
  angular.module('app.portfolio')
    .controller('PortfolioController', ['PortfolioService', 'AuthService', '$scope', function(PortfolioService, AuthService, $scope) {
      var vm = this;
      vm.portfolio = null;
      vm.selectedCard = null;
      vm.loading = true;
      vm.error = null;
      vm.transactionLimit = 20;
      vm.loadPortfolio = function() {
        vm.loading = true;
        AuthService.validateUser().then(function(userId) {
          PortfolioService.getPortfolio(userId).then(function(portfolio) {
            vm.portfolio = portfolio;
            vm.selectedCard = portfolio.selectedCard;
            vm.loading = false;
          }, function(error) {
            vm.error = 'Failed to load portfolio';
            vm.loading = false;
          });
        });
      };
      vm.selectCard = function(card) {
        vm.selectedCard = card;
        PortfolioService.getCardDetails(card.cardId).then(function(detailedCard) {
          vm.selectedCard = detailedCard;
        });
      };
      vm.loadMore = function() {
        vm.transactionLimit += 20;
      };
      vm.loadPortfolio();
    }]);
})();